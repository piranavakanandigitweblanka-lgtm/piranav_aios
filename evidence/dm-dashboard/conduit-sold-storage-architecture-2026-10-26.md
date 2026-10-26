# Evidence — Conduit Sold: Data Storage & Read Architecture Verification

**Date:** 2026-10-26
**Task:** Verify whether Conduit Sold reads from PostgreSQL snapshot or fetches Shopify data live on page load
**Scope:** Local code trace (confirmed) + live Contabo partial check (health only — auth required for rest)
**Status:** LOCAL — COMPLETE. LIVE DATABASE — NOT VERIFIED (steps provided for Piranav)

---

## A. Verified End-to-End Data Flow

### Normal page load (snapshot exists — the 99.9% case)

```
User opens Admin → Conduit Sold
  → GET /api/admin/conduit-sold
  → conduit_sold_snapshot.read()
  → get_conn() [APP DB — dm_dashboard, localhost:5432 on Contabo]
  → SELECT payload, updated_at
    FROM public.admin_conduit_sold_snapshot
    WHERE id = 1
  → Returns full JSONB payload + updated_at timestamp
  → HTTP response: payload + syncedAt + source:"scheduled-sync"
  → Sub-second response — zero Shopify API calls, zero business DB queries
```

### Background sync (scheduled every 12 hours OR manual Update button)

```
ScheduledSnapshot._loop() fires every 12 hours   OR
POST /api/admin/conduit-sold/sync/run-now (frontend Update button)
  → threading.Thread(target=conduit_sold_snapshot.run_sync)
  → _compute_conduit_sold():
      → _fetch_conduit_collections()
          → get_business_conn() [BUSINESS DB — shared read-only, 10-conn cap]
          → listings.shopify_collections WHERE handle=CONDUIT_HANDLES AND sub_source=104
          → listings.shopify_collection_products WHERE collection_id=ANY(...) AND is_deleted=0
      → _fetch_uk_orders_in_range()
          → shopify_client.graphql("ledsone_uk", ORDERS_QUERY, ...)
          → 50 orders/page, cursor-paginated, up to 1000 pages
          → Apr 1–Sep 30 2026, excluding VOIDED + cancelledAt
          → Runs for ~1–3 minutes (100–200 API pages)
      → _build_report()
          → Aggregates into collection/product/SKU/month buckets
  → conduit_sold_snapshot.write(payload)
      → get_conn() [APP DB]
      → INSERT INTO public.admin_conduit_sold_snapshot (id, payload, updated_at)
        VALUES (1, payload_json, NOW())
        ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()
      → Single JSONB row, always id=1 (singleton constraint)
  → Logs to sales_cache.sync_history (APP DB): staff, tab, started_at, status, duration
```

### First-ever page load (snapshot missing — cold start only)

```
conduit_sold_snapshot.read() → None
  → _compute_conduit_sold() called SYNCHRONOUSLY (inline, not background)
  → ~1–3 min Shopify fetch happens BLOCKING the GET request
  → conduit_sold_snapshot.write(payload)
  → Returns payload with source:"live-first-compute"
```

**Note:** This only happens once — on the very first page load after a fresh deploy with no snapshot. In practice the ScheduledSnapshot.start() at startup (main.py line 490) fires a "prime" run if the snapshot is missing, so by the time any user opens the page the snapshot is already being populated (staggered 60s per slot).

---

## B. What Is Stored in PostgreSQL vs Fetched from Shopify

### Stored in PostgreSQL (App DB — `dm_dashboard` on Contabo)

**Table:** `public.admin_conduit_sold_snapshot`

| Column | Type | Content |
|---|---|---|
| `id` | SMALLINT | Always 1 (singleton constraint) |
| `payload` | JSONB | Full computed report — see schema below |
| `updated_at` | TIMESTAMPTZ | Time of last successful sync |

**Payload schema stored:**
```json
{
  "success": true,
  "generatedAt": "2026-10-25T10:32:11Z",
  "period": {"start": "2026-04-01", "end": "2026-09-30"},
  "months": ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  "store": "Shopify UK (ledsone.myshopify.com)",
  "collections": [
    {
      "handle": "conduit-accessories",
      "title": "Conduit Accessories",
      "products": [
        {
          "product_id": 14822482411906,
          "title": "20mm Bush Female...",
          "skus": [
            {
              "sku": "PCBSF2MCH3PK",
              "title": "...",
              "monthly": {"Apr": 12, "May": 8, ...},
              "monthly_rev": {"Apr": 45.60, "May": 30.40, ...},
              "total": 63,
              "total_rev": 239.40
            }
          ],
          "monthly_totals": {"Apr": 12, ...},
          "monthly_rev_totals": {"Apr": 45.60, ...},
          "total": 63,
          "total_rev": 239.40
        }
      ],
      "grand_total": 480,
      "grand_revenue": 1824.00
    }
  ],
  "meta": {
    "ordersScanned": 12500,
    "rule": "Gross units sold on non-VOIDED, non-cancelled orders...",
    "revenueDefinition": "originalTotalSet.shopMoney.amount per line item..."
  }
}
```

**Also stored in App DB:**
- `sales_cache.sync_history` — one row per sync run: staff, tab, started_at, finished_at, status, duration_seconds, orders_count (= total units), net_sales (= total revenue)
- `sales_cache.sync_control` — pause/resume flag for scope "admin-conduit-sold"
- `dev_deploy_log` — git SHA and timestamp of every backend deploy

### Fetched live from Shopify (only during compute)
- Raw order line items: product_id, variant_id, SKU, title, quantity, originalTotalSet.shopMoney.amount
- Fetched only during background 12-hour sync or manual Update — NEVER on normal page loads

### Fetched live from Business DB (only during compute)
- `listings.shopify_collections` — collection handles and titles
- `listings.shopify_collection_products` — product IDs per collection
- Fetched only during background 12-hour sync or manual Update

### Component Stock — NOT in snapshot

| Item | Storage |
|---|---|
| Storage type | In-process Python dict `_CACHE` (module-level in `conduit_stock.py`) |
| TTL | 5 minutes |
| Table source | `inventory.local_inventory_current_stock_location_wise` (Business DB) |
| Persistence | None — lost on every backend restart |
| Query on each miss | 3 SQL queries against Business DB |
| First tab-click | Always triggers a fresh Business DB fetch (unless within 5-min cache window) |

---

## C. Local Code vs Live Contabo Findings

### Confirmed from local code
| Fact | Evidence | Confidence |
|---|---|---|
| Snapshot stored in app DB | `scheduled_snapshot.py` lines 143-153, 155-171 — uses `get_conn()` | CONFIRMED |
| Table name | `conduit_sold.py` line 433: `table_name="public.admin_conduit_sold_snapshot"` | CONFIRMED |
| Singleton row (id=1) | `_ensure_table()` constraint, `read()` WHERE id=1 | CONFIRMED |
| 12-hour schedule | `conduit_sold.py` line 438: `interval_hours=12` | CONFIRMED |
| Startup prime | `ScheduledSnapshot.start()` lines 413-423: fires if `payload is None` | CONFIRMED |
| Staggered startup (60s/slot) | `scheduled_snapshot.py` line 43: `_STARTUP_RUN_SPACING_SECONDS = 60` | CONFIRMED |
| No Shopify call on normal GET | `get_conduit_sold()` lines 447-465: reads snapshot, only falls through if None | CONFIRMED |
| Component stock in-process only | `conduit_stock.py` lines 63-64: `_CACHE` dict, `_CACHE_TTL = 5*60` | CONFIRMED |
| Retry on DB transient errors | `_RETRY_DELAYS = (15, 30, 60, 120, 240)` in `scheduled_snapshot.py` | CONFIRMED |
| Duplicate imports in main.py | Lines 139-141 and 151-153 — same symbols imported twice | CONFIRMED |

### Live Contabo verification results

| Check | Result | Method |
|---|---|---|
| Backend process running | **CONFIRMED** | `GET /api/health` → `{"status":"ok"}` |
| API accessible publicly | **CONFIRMED** | `http://158.220.99.127:8499` responds |
| Current deployed commit | **NOT VERIFIED** — auth required | `/api/dev/branches/history` returns 401 |
| `admin_conduit_sold_snapshot` exists | **NOT VERIFIED** — port 5432 closed | No direct DB access from this machine |
| Snapshot row present and fresh | **NOT VERIFIED** | Requires SSH or auth |
| Live sync history | **NOT VERIFIED** | Requires auth |
| Live code matches local `103de7b` | **UNCONFIRMED** — likely true | deploy_log would confirm; auth required |

---

## D. Evidence Supporting Each Conclusion

| Conclusion | Evidence | File | Lines |
|---|---|---|---|
| App DB (not business DB) stores snapshot | `ScheduledSnapshot.read()` calls `get_conn()`, not `get_business_conn()` | `core/scheduled_snapshot.py` | 155-160 |
| App DB is `dm_dashboard` on localhost | `DATABASE_URL` pool setup; deployment doc | `core/db.py` line 11; `deployment/piranav/contabo-vps-setup-2026-09-01.md` line 39 | — |
| Normal GET never queries Shopify | `get_conduit_sold()`: `conduit_sold_snapshot.read()` short-circuits before any Shopify call | `dashboard_pages/conduit_sold.py` | 447-465 |
| 12-hour background refresh | `ScheduledSnapshot(interval_hours=12)` | `dashboard_pages/conduit_sold.py` | 432-440 |
| Startup auto-prime | `ScheduledSnapshot.start()`: if `payload is None`, fires "prime" run | `core/scheduled_snapshot.py` | 413-423 |
| Singleton JSONB row pattern | `CREATE TABLE ... id SMALLINT PRIMARY KEY DEFAULT 1`, `CHECK (id=1)` | `core/scheduled_snapshot.py` | 140-153 |
| Component stock = no snapshot | `_CACHE = None` (module-level), `_CACHE_TTL = 5*60`, no ScheduledSnapshot in `conduit_stock.py` | `dashboard_pages/conduit_stock.py` | 63-64 |
| Sync logged in sales_cache.sync_history | `_run_sync_inner()` inserts/updates sync_history rows | `core/scheduled_snapshot.py` | 286-342 |
| Backend live | `curl http://158.220.99.127:8499/api/health` → `{"status":"ok"}` | Live check, 2026-10-26 | — |

---

## E. Is PostgreSQL the Actual Serving Layer on Production?

**For Conduit Sold history (sold units + revenue): YES, confirmed by code.**

The serving path is unambiguous:
1. `get_conduit_sold()` calls `conduit_sold_snapshot.read()`
2. `read()` executes `SELECT payload, updated_at FROM public.admin_conduit_sold_snapshot WHERE id = 1` against the app DB (`get_conn()`)
3. If a row exists it is returned immediately — no Shopify call, no business DB query
4. The 12-hour background scheduler and the "Update" button are the ONLY paths that reach Shopify

**For Component Stock: NO — served from in-process cache backed by live Business DB queries.**

The component stock tab bypasses the snapshot pattern entirely:
- It uses a module-level `_CACHE` dict (5-min TTL)
- On cache miss it runs 3 live Business DB queries
- There is no PostgreSQL snapshot table for stock data
- Every backend restart wipes the cache; the first stock tab view always queries the Business DB

**The critical implication:** If the Contabo backend restarts (deploy, crash, server reboot), the component stock cache is cleared. The first staff member to open the Component Stock tab after restart triggers a live Business DB query. This is expected and fine — the queries run in seconds, not minutes.

---

## F. Risks, Gaps and Recommended Next Step

### Risk 1 — Live snapshot verification not confirmed
**Detail:** Cannot confirm from this machine whether `public.admin_conduit_sold_snapshot` exists on Contabo, whether it has a recent row, or whether the 12-hour schedule has been running. The backend being up does not guarantee the snapshot has been populated.
**Risk level:** Medium — if the table is missing or empty, the first page load will trigger a 1–3 minute inline Shopify fetch that blocks the HTTP response.
**Fix:** Run the verification SQL below (Section G).

### Risk 2 — Component stock cache lost on restart
**Detail:** Every backend restart (deploy or crash) clears the 5-min in-process `_CACHE`. The first Component Stock tab view after any restart hits the Business DB. Given the 10-connection cap, if multiple staff members open this tab simultaneously just after a restart, the Business DB could be briefly stressed.
**Risk level:** Low — the stock queries are 3 fast SQL selects, not multi-page Shopify fetches. The 5-min cache protects against burst once primed.
**Improvement (optional):** Convert Component Stock to use ScheduledSnapshot with a 5–10 min interval, persisting to app DB like the sold history. This would make stock restarts instant-serve too.

### Risk 3 — Hardcoded date range means stale sold data
**Detail:** `MONTHS` and `PHASE1_END` are fixed to Sep 2026. The 12-hour sync re-fetches the same Apr–Sep window every time. No new data is being collected for Oct 2026+. The page is cosmetically stale but functionally correct for its defined scope.
**Risk level:** High — the page is not showing current business performance.
**Fix:** Phase 2 date range extension (separate task, needs Piranav approval).

### Risk 4 — Duplicate imports in main.py
**Detail:** Lines 139-141 and 151-153 both import conduit_sold/stock symbols. Python deduplicates silently, no runtime effect.
**Risk level:** Negligible.
**Fix:** Remove lines 139-141 (first occurrence) in Phase 2 cleanup.

### Recommended Next Step
1. **Piranav to run the 3 verification SQL queries below** (via SSH psql or pgAdmin on Contabo) to confirm the live snapshot state.
2. If snapshot is confirmed present and recent: approve Phase 2 date range extension.
3. If snapshot is missing: trigger a manual sync via the Update button after logging in.

---

## G. Live Verification Steps for Piranav

**Access method:** SSH to `158.220.99.127` then `psql -U dm_user -d dm_dashboard`

**Query 1 — Confirm deployed commit:**
```sql
SELECT git_sha, git_message, deployed_at
FROM dev_deploy_log
ORDER BY deployed_at DESC
LIMIT 3;
```
Expected: `103de7b` in the most recent row if the last deploy matched local state.

**Query 2 — Confirm snapshot exists and is fresh:**
```sql
SELECT
  id,
  updated_at,
  payload->>'generatedAt' AS generated_at,
  payload->>'store' AS store,
  jsonb_array_length(payload->'collections') AS num_collections,
  payload->'meta'->>'ordersScanned' AS orders_scanned,
  jsonb_array_length(payload->'months') AS num_months
FROM public.admin_conduit_sold_snapshot
WHERE id = 1;
```
Expected: 1 row, `num_collections=4`, `num_months=6`, `updated_at` within last 12 hours.

**Query 3 — Confirm sync history:**
```sql
SELECT
  staff, tab, started_at, finished_at, status,
  duration_seconds, orders_count, net_sales
FROM sales_cache.sync_history
WHERE tab = 'conduit-sold'
ORDER BY started_at DESC
LIMIT 5;
```
Expected: rows with `status='success'`, regular ~12-hour intervals, `orders_count` > 0.

**Query 4 — Confirm Component Stock is NOT in a snapshot table:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE '%conduit%';
```
Expected: only `admin_conduit_sold_snapshot` — no `admin_conduit_stock_snapshot`.

Do not print DATABASE_URL, passwords, tokens, or order-level customer data.
