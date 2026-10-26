# Evidence — Conduit Sold Page Investigation

**Date:** 2026-10-26
**Task:** Investigation and verification of the existing Conduit Sold page
**Scope:** Read-only code inspection. No code changes, no deployments, no runtime execution.
**Status:** COMPLETE — see Final Report section

---

## A. Page Route and Component Files

| Item | Value |
|---|---|
| Navigation section | "Sales & Performance" (`AdminLayout.jsx` line 149) |
| Sidebar key | `conduit-sold` |
| Tool key (UAM) | `tools.AdminConduitSold` |
| Label | "Conduit Sold" (taskRegistry.jsx line 355) |
| Sub-label | "ledsone.co.uk — Apr–Sep 2026 units sold by SKU" |
| Panel type | No dedicated route — admin panel rendered via `GrantedTaskPanel` + `ScheduledSnapshot` |
| Frontend component | `frontend/src/admin/pages/ConduitSold.jsx` (777 lines) |
| Backend — sold | `backend/app/dashboard_pages/conduit_sold.py` (478 lines) |
| Backend — stock | `backend/app/dashboard_pages/conduit_stock.py` (364 lines) |
| Router registration | `backend/app/main.py` lines 347, 350 |
| Startup call | `backend/app/main.py` line 490: `start_conduit_sold_snapshots()` |
| taskRegistry entry | `frontend/src/taskRegistry.jsx` line 355 — lazy-loaded, `load: () => import('./admin/pages/ConduitSold')` |

---

## B. End-to-End Request Flow

### Sold History Tab (GET /api/admin/conduit-sold)

```
User opens Admin → Sales & Performance → Conduit Sold
  → ConduitSold.jsx mounts
  → useEffect([]) → load()
  → fetch(`${API_URL}/api/admin/conduit-sold`, { Authorization: Bearer {dm_token} })
  → backend: require_conduit_access (make_admin_task_auth, tools.AdminConduitSold)
  → conduit_sold_snapshot.read()
    → SELECT payload, updated_at FROM public.admin_conduit_sold_snapshot ...
    → If row exists: return instantly (no Shopify call)
    → If never synced: _compute_conduit_sold() live
      → _fetch_conduit_collections()
          → get_business_conn()
          → listings.shopify_collections WHERE handle = ANY(CONDUIT_HANDLES) AND sub_source = 104
          → listings.shopify_collection_products WHERE collection_id = ANY(coll_ids) AND is_deleted = 0
          → Returns 4 collection dicts with product_id sets
      → _fetch_uk_orders_in_range()
          → shopify_client.graphql("ledsone_uk", ORDERS_QUERY, ...)
          → Paginated: 50 orders/page, cursor-based, up to 1000 pages
          → Filters: created_at >= '2026-04-01' AND created_at < '2026-10-01'
          → Excludes: displayFinancialStatus in {"VOIDED"}, or cancelledAt IS NOT NULL
          → Collects: product_id, variant_id, sku, title, quantity, revenue per line item
      → _build_report()
          → Buckets by collection / product_id / sku / (year, month)
          → Aggregates qty + revenue per bucket
          → Builds monthly/total rows per SKU, product, collection
      → conduit_sold_snapshot.write(payload) → INSERT INTO public.admin_conduit_sold_snapshot
  → JSON response: { success, generatedAt, period, store, months, collections, meta, syncedAt, source }
  → Frontend: setData(d), setActiveTab(0), renders tab bar + CollectionView
```

### Component Stock Tab (GET /api/admin/conduit-stock)

```
User clicks "Component Stock" tab
  → useEffect([activeTab]) → loadStock(false) (first visit only)
  → fetch(`${API_URL}/api/admin/conduit-stock`, { Authorization: Bearer {dm_token} })
  → backend: require_conduit_access (same tools.AdminConduitSold grant)
  → _CACHE check: if cache exists + version=1 + age < 5 min → return cached
  → _fetch_conduit_stock_data()
      → get_business_conn() — 3 queries:
        Q1: conduit SKU → collection mapping (with parent-child join through shopify_listings)
        Q2: inventory.products + inventory.local_inventory_current_stock_location_wise (warehouse_location='UK')
            + LEFT JOIN inventory.product_mapping → alternative_inventory_id + alternative SKU
        Q3: component SKU stock lookup (for combo/ENC SKUs only)
      → Assembles: per-SKU record with type, stock, alert_status, collections, components
  → JSON: { success, generatedAt, store, collections, summary, skus, meta }
  → Frontend: setStockData(d), renders ComponentStockView
```

---

## C. Quantity and Revenue Calculation Rules

### Quantity (Units Sold)
- **Source:** `lineItem.quantity` (int) from Shopify GraphQL
- **Included orders:** displayFinancialStatus NOT in `{"VOIDED"}` AND `cancelledAt IS NULL`
- **Statuses included:** PAID, PARTIALLY_PAID, PARTIALLY_REFUNDED, AUTHORIZED, PENDING, REFUNDED
  - Note: REFUNDED orders ARE included — gross sold, refunded quantities not subtracted
- **Bucketing:** `_month_key(dt)` = `(dt.year, dt.month)` on the UTC `createdAt` timestamp
- **Aggregation:** Sum across all line items matching a conduit product_id, grouped by (collection, product_id, sku, year, month)

### Revenue
- **Source:** `lineItem.originalTotalSet.shopMoney.amount` (string → float)
- **Definition:** Quantity × original unit price, **pre-discount**, GBP shop currency
- **NOT included:** Applied discounts, shipping costs, taxes
- **Rounding:** Each SKU `total_rev` rounded to 2 decimal places; product `total_rev` rounded to 2 decimal places; `grand_revenue` rounded to 2 decimal places
- **Precedent:** Same field used by `admin_sku_audit.py`

### Product → Collection Matching
- Source: business DB `listings.shopify_collections` + `listings.shopify_collection_products`
- sub_source = 104 (ledsone.co.uk)
- `is_deleted = 0` required on collection_products
- Product_id in Shopify GraphQL: `variant.product.legacyResourceId` → `int()`
- Products in multiple collections: counted independently in each collection

---

## D. Date Range and Monthly Generation Behaviour

| Item | Value | Location |
|---|---|---|
| Start date | `date(2026, 4, 1)` | `conduit_sold.py` line 57: `PHASE1_START` |
| End date | `date(2026, 9, 30)` | `conduit_sold.py` line 58: `PHASE1_END` |
| Shopify query filter | `created_at:>='2026-04-01' created_at:<'2026-10-01'` | `conduit_sold.py` line 175-178 |
| Month list | `[(2026,4,"Apr"), ..., (2026,9,"Sep")]` — HARDCODED | `conduit_sold.py` lines 67-74 |
| Month labels in API response | `["Apr","May","Jun","Jul","Aug","Sep"]` | `_compute_conduit_sold()` line 407 |
| Timezone used | UTC (`datetime.fromisoformat(...replace("Z", "+00:00"))`) | `conduit_sold.py` line 222 |
| UK timezone offset | BST = UTC+1 (Apr–Oct). NOT applied. | **ISSUE** — see Section F |
| Current partial month | None. Range is fixed Sep 30 regardless of today's date. | — |
| Month label in frontend | `data.months` array from API — no hardcoding in React | `ConduitSold.jsx` line 101, 115, etc. |
| CSV filename | `${handle}-sold-apr-sep-2026.csv` — HARDCODED string | `ConduitSold.jsx` line 192 |

---

## E. Filters, Totals, Cache, Refresh, Export

### Sold History Tabs
| Feature | Behaviour |
|---|---|
| Filters | None on sold view. Collection switching via tab bar only. |
| Products with sales | Filtered to `p.total > 0` — zero-sold products shown as footer count only |
| Product collapse | Click product header to collapse/expand SKU table |
| Collection totals | `grand_total` (units) + `grand_revenue` (GBP) in tab label |
| Summary cards | Total Products, Products with Sales, Total Units Sold, Total Revenue |
| Refresh (Update) button | `POST /api/admin/conduit-sold/sync/run-now` → background thread → polls every 10s up to 5 min |
| Export CSV | Client-side, selected collection tab only. Columns: Collection, Product ID, SKU, Title, Row Type, [month Units + Revenue ×6], Total Units, Total Revenue. UTF-8 BOM. One row per SKU + product_total row. |
| Grand total across collections | NOT shown — each collection is independent |
| Last updated chip | Shows `syncedAt` or `generatedAt` from response |

### Component Stock Tab
| Feature | Behaviour |
|---|---|
| Filters | SKU text search, Collection dropdown, Type dropdown (single/combo/enc/pack), Alert status dropdown |
| Alert summary cards | Clickable — click to filter by that status |
| Clear filters | Appears when any filter is active |
| SKU count | "{filtered} of {total} SKUs" |
| Expand components | Expand button on combo/ENC SKUs to show component breakdown with BOTTLENECK badge |
| Alert tiers | CRITICAL=0 stock, WARNING=1–3, LOW=4–10, OK>10 |
| Refresh stock | `GET /api/admin/conduit-stock?refresh=1` — bypasses 5-min in-process cache |
| Export CSV | Exports currently filtered SKU list. Columns: SKU, Type, Collections, Stock, Alert Status, Alternative SKU, Components. |
| Source note | Footer: "Business PostgreSQL — inventory.local_inventory_current_stock_location_wise (UK warehouses)" |

### Cache Details
| Cache | Type | TTL | Invalidation |
|---|---|---|---|
| Sold history | PostgreSQL (ScheduledSnapshot) | 12-hour background refresh | `POST /sync/run-now` + automatic every 12h |
| Stock | In-process dict `_CACHE` | 5 minutes | `?refresh=1` parameter, or server restart |

---

## F. Verified Issues and Missing Functionality

### ISSUE 1 — HARDCODED date range (confirmed, not in dispute)
**Severity:** High — data is stale
**Location:** `conduit_sold.py` lines 57–74; `ConduitSold.jsx` line 192 (CSV filename)
**Detail:** `PHASE1_START`, `PHASE1_END`, and `MONTHS` are fixed to Apr–Sep 2026. The page is now Oct 2026. No October or later data will ever appear without a code change. The frontend footnote acknowledges: "Phase 1 scope: Apr 2026 – Sep 2026. Future months and additional collections can be added in Phase 2."
**Smallest safe correction needed:** Extend `MONTHS` and `PHASE1_END` — e.g., push to Dec 2026, or make `MONTHS` dynamically generated to the current month. See Section I.

### ISSUE 2 — Timezone: UTC used, UK local (BST) not applied
**Severity:** Low — affects only orders placed near midnight
**Location:** `conduit_sold.py` line 222: `datetime.fromisoformat(o["createdAt"].replace("Z", "+00:00"))`; line 238: `_month_key(dt) = (dt.year, dt.month)`
**Detail:** Shopify `createdAt` is UTC. UK in Apr–Sep is BST (UTC+1). An order placed at 23:30 BST Sep 30 = 22:30 UTC Sep 30 → buckets correctly into Sep. An order placed at 00:30 BST Oct 1 = 23:30 UTC Sep 30 → would bucket into Sep but is outside the Shopify query date filter (`created_at < '2026-10-01'`). The impact is small but may cause a handful of near-midnight orders to bucket into the wrong month. At scale this is cosmetic, not materially wrong.
**Note:** The Shopify query boundary `created_at < '2026-10-01'` is also UTC, so a Sep 30 23:30 UTC order (Oct 1 00:30 BST) IS fetched and buckets into Sep correctly. The asymmetry is at the start of each month, not the end.

### ISSUE 3 — REFUNDED orders included in gross sold
**Severity:** None — this is intentional by design
**Location:** `conduit_sold.py` line 78: `EXCLUDED_FINANCIAL_STATUSES = {"VOIDED"}`
**Detail:** Orders with `displayFinancialStatus = "REFUNDED"` are included. This is gross-sold view, documented in code and frontend notes. Not a bug. Flagged for awareness.

### ISSUE 4 — Duplicate imports in main.py
**Severity:** Low — harmless (Python dedups module-level imports)
**Location:** `main.py` lines 139–141 and again 151–153 (same conduit_sold + conduit_stock imports)
**Detail:** Both import blocks import the same symbols from the same paths. Python silently ignores the second import. The router is only registered once (line 347). No runtime effect but indicates a merge artifact.

### ISSUE 5 — Revenue double-rounding can cause £0.01 discrepancies
**Severity:** Very low — cosmetic at most
**Location:** `conduit_sold.py` lines 344, 355, 369, 379
**Detail:** `sku_total_rev` is summed unrounded, then `sku.total_rev = round(sku_total_rev, 2)`. `prod_total_rev` accumulates from `sku_total_rev` (unrounded). `product.total_rev = round(prod_total_rev, 2)`. `grand_revenue = round(grand_revenue, 2)`. This means the displayed per-SKU total_rev and the per-product total_rev may disagree by £0.01 vs the sum of monthly values, due to different rounding paths. Not functionally wrong but could surprise users comparing rows.

### MISSING — No grand total row across all collections
The frontend shows collection totals only. There is no cross-collection total units/revenue summary card. This is not a bug but may be desired.

### MISSING — No date range change UI
The date range is always Apr–Sep 2026. There is no UI to change the period. Phase 2 work would add this.

---

## G. Local vs Live Verification Checklist

### What can be verified statically (no runtime needed)
- [x] Date range constants — PHASE1_START, PHASE1_END, MONTHS (confirmed above)
- [x] Financial status exclusion logic — VOIDED + cancelledAt check (confirmed above)
- [x] Revenue field — originalTotalSet.shopMoney.amount (confirmed above)
- [x] Month bucketing logic — UTC, no timezone conversion (confirmed above)
- [x] Collection handles — CONDUIT_HANDLES list (confirmed in both conduit_sold.py and conduit_stock.py)
- [x] Auth — make_admin_task_auth, tools.AdminConduitSold (confirmed above)
- [x] Cache type — ScheduledSnapshot (Postgres) for sold; in-process 5-min for stock (confirmed above)

### What requires runtime comparison (Phase 2 — NOT done yet)

| Check | How to verify locally vs live |
|---|---|
| Page loads (sold data) | Start backend + frontend, navigate to Admin → Conduit Sold. Confirm 4 collection tabs + Component Stock tab render. |
| Collection tabs correct | Compare tab labels (should show handle + units/revenue) against live Contabo dashboard |
| Sample SKU units | Pick 1 SKU (e.g. `PCBSF2MCH3PK`), compare monthly units in Apr/May with Contabo dashboard value |
| Revenue figures | Pick same SKU, compare Apr revenue GBP with Contabo |
| Update button | Click "Update" — confirm "Updating… (1–3 min)" appears, then data refreshes |
| Component Stock | Click Component Stock tab — confirm summary cards + SKU table loads (from business DB) |
| CRITICAL badges | Confirm at least one SKU shows CRITICAL (stock=0) if one exists in the data |
| Export CSV | Click Export CSV — confirm download, open in Excel, check UTF-8 BOM and column structure |
| Auth rejection | Use a non-admin JWT — confirm 403 returned |

### Sample comparisons to plan
| Product | Expected tab | Months of interest | Notes |
|---|---|---|---|
| `PCBSF2MCH3PK` (Bush Female 20mm 3PK) | conduit-accessories | Apr, May | Confirmed in Phase 1 validation — appeared in first 10 pages |
| `ENC8046` | conduit-accessories | Apr | Confirmed in Phase 1 validation |
| Any SKU with 0 units | Any | — | Should appear in "N products had 0 units sold" footer only |

### What to distinguish
- **Stale data:** If live Contabo dashboard shows the last sync was hours ago, it's a snapshot difference, not a code difference
- **Cache difference:** Local first load will trigger live Shopify fetch (1–3 min). Live Contabo reads from snapshot.
- **Code difference:** If totals disagree after sync, it may indicate Contabo is running an older version of the code

---

## H. AIOS Files Updated

| File | Action |
|---|---|
| `evidence/dm-dashboard/conduit-sold-investigation-2026-10-26.md` | CREATED (this file) |
| `capability/2026/10/2026-10-01/dm-dashboard-conduit-sold-history-pattern-2026-10-01.md` | UPDATED — added investigation findings, current state, issues |
| `validation/piranav/conduit-sold-investigation-validation-2026-10-26.md` | CREATED |
| `closure/README.md` | UPDATED |
| `PROMPT_REGISTER.md` | UPDATED |
| `prompts/dm-dashboard/conduit-sold-investigation-2026-10-26.md` | CREATED |

---

## I. Recommended Next Step

**Priority 1 — Fix the hardcoded date range (Phase 2 implementation)**

The page is frozen at Apr–Sep 2026. It is now Oct 2026. The smallest safe fix:

Option A (minimal): Add Oct 2026 and Nov 2026 to `MONTHS` and update `PHASE1_END`. One-line change + cache invalidation via ScheduledSnapshot re-run.

Option B (clean): Make `MONTHS` dynamically generated to the current month, with `PHASE1_END` = last day of last completed month. This means the report always shows data up to the month before today without code changes. This requires:
1. `conduit_sold.py`: Replace `MONTHS` constant with a function that generates months from Apr 2026 to last month.
2. Update `PHASE1_END` to be dynamic.
3. Update `ConduitSold.jsx` CSV filename (remove hardcoded `-apr-sep-2026`).
4. Force a new ScheduledSnapshot run after deploy.

**Do not implement until Piranav approves.**

**Priority 2 — Resolve duplicate imports in main.py**
Remove lines 151–153 (the second set of conduit imports). Single-line cleanup, no functional change.
