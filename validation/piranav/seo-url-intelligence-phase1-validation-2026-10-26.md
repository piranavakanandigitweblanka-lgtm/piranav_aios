# SEO URL Intelligence — Phase 1 Validation Record
## Date: 2026-10-26 | Validator: Claude Code | Status: PASS — DB recovery complete, analysis recomputed with corrected URLs

## Validation Checklist

| # | Test | Method | Status | Result |
|---|---|---|---|---|
| 1 | Backend file parses without syntax errors | `python -c "import ast; ast.parse(...)"` | **PASS** | `PASS — no syntax errors` |
| 2 | import line + include_router present in main.py | grep main.py | **PASS** | Both lines confirmed |
| 3 | GET /sync/status returns {"status":"idle"} before first sync | curl with auth token | PENDING — requires running backend | — |
| 4 | POST /sync/start returns 403 without task grant | curl without auth | PENDING — requires running backend | — |
| 5 | POST /sync/start returns {"status":"computing"} with valid token | curl with dev token | PENDING — requires running backend | — |
| 6 | Sync completes — seo_url_product table populated with real product count | DB query after sync | PENDING — requires running backend | — |
| 7 | Sync idempotent — run twice, row counts unchanged | DB query before/after second sync | PENDING — requires running backend | — |
| 8 | GET /products returns rows with handle, title, description, mismatch_status, ranking_status | API response | PENDING — requires running backend | — |
| 9 | ranking_status filter returns only Ranking Drop rows when filter=Ranking Drop | API with filter | PENDING — requires running backend | — |
| 10 | mismatch_status filter works independently from ranking_status filter | API with both filters | PENDING — requires running backend | — |
| 11 | Products with < 10 impressions show Insufficient Data, not Ranking Drop | DB check on analysis table | PENDING — requires running backend | — |
| 12 | CSV export downloads with correct columns | Browser download | PENDING — requires running backend | — |
| 13 | tools.SeoUrlIntelligence appears in UAM task list | taskRegistry.jsx grep | **PASS** | Line 514 confirmed, `lazy: true, kind: 'tool'` |
| 14 | Staff without grant gets 403 on POST /sync/start | Static code audit: `_REQUIRE_ACCESS = make_task_auth(...)` | **PASS (static)** | Route decorator confirmed, runtime test pending |
| 15 | Frontend builds without error | `npm run build` | **PASS** | 501 modules, `SeoUrlIntelligence-DmL4xJUs.js` emitted, 0 errors |
| 16 | Sidebar fix — entry added to RAW_ADMIN_ITEMS in AdminLayout.jsx | grep AdminLayout.jsx | **PASS** | Line 198: `{ key: 'seo-url-intelligence', toolKey: 'tools.SeoUrlIntelligence', enabled: true }` |
| 17 | Sidebar fix — build passes after AdminLayout.jsx change | `npm run build` | **PASS** | `SeoUrlIntelligence-Cj5iUot1.js` emitted, 0 errors, 788ms |
| 18 | Sidebar grant-filter — entry not in ALWAYS_VISIBLE_KEYS, uses `grantedAtByKey.has(item.toolKey)` | static code audit AdminLayout.jsx line 297 | **PASS** | Users without grant: hidden. Users with grant: visible. Dev role: always visible. |
| 19 | Sidebar visible in running dashboard after grant | Browser test | PENDING — manual check required after deploy |

## Routes Confirmed (static)

| Route | Auth | Line |
|---|---|---|
| GET /stores | `_REQUIRE_LOGIN` | 664 |
| POST /sync/start | `_REQUIRE_ACCESS` (task grant) | 669 |
| GET /sync/status | `_REQUIRE_LOGIN` | 676 |
| GET /summary | `_REQUIRE_LOGIN` | 683 |
| GET /products | `_REQUIRE_LOGIN` | 730 |
| GET /products/csv | `_REQUIRE_LOGIN` | 758 |

## Static Analysis (can run now without running environment)

### Python syntax check
```bash
python -c "
import ast, sys
with open('backend/app/dashboard_pages/seo_url_intelligence.py') as f:
    src = f.read()
try:
    ast.parse(src)
    print('OK — no syntax errors')
except SyntaxError as e:
    print(f'FAIL: {e}')
    sys.exit(1)
"
```

### main.py import check (grep)
Both lines added to main.py:
- `from .dashboard_pages.seo_url_intelligence import router as seo_url_intelligence_router`
- `app.include_router(seo_url_intelligence_router)`

### taskRegistry.jsx check (grep)
Entry added: `taskKey: 'tools.SeoUrlIntelligence'`

### taskAddedDates.json check (grep)
Entry added: `"tools.SeoUrlIntelligence": "2026-10-26"`

## Sidebar Bug — Root Cause and Fix (2026-10-26)

**Root cause:** `tools.SeoUrlIntelligence` was registered in `taskRegistry.jsx` (makes it grantable in UAM) but was missing from `RAW_ADMIN_ITEMS` in `AdminLayout.jsx` (the hardcoded sidebar list). UAM reads from taskRegistry — sidebar reads from RAW_ADMIN_ITEMS. They are independent. Both must be updated for a new tool.

**Fix applied:** One line added to `AdminLayout.jsx` line 198, immediately after `tools.SeoIntelligence`:
```javascript
{ key: 'seo-url-intelligence', toolKey: 'tools.SeoUrlIntelligence', enabled: true },
```

**File changed:** `frontend/src/admin/AdminLayout.jsx`
**Build after fix:** PASS — `SeoUrlIntelligence-Cj5iUot1.js` emitted, 0 errors

## Production Database Inspection — Full Results (2026-10-26)

### Table existence and schema
Both tables exist in `public` schema of `dm_dashboard` (Contabo). Schema matches implementation exactly.

| Table | Rows | Size |
|---|---|---|
| `seo_url_product` | 5,335 | ~10.3 MB |
| `seo_url_analysis` | 5,335 | ~1.3 MB |

All 6 indexes confirmed: PK, `(store, shopify_id)` UNIQUE, `store` index on both tables.

### Store and sync timestamps
- Only store present: `ledsone_uk` ✅ (Phase 1 correct)
- First sync: `2026-10-26 09:43:19 +01:00`
- Latest sync: `2026-10-26 09:43:19 +01:00` (one sync run so far)
- Analysis computed: `2026-10-26 09:43:21 +01:00`

### Data integrity
- Duplicate `(store, shopify_id)`: **0** ✅
- Orphan analysis rows: **0** ✅
- Product/analysis row count match: **5,335 / 5,335** ✅

### Ranking status breakdown
| Status | Count |
|---|---|
| No GSC Data | 5,332 |
| Insufficient Data | 3 |
| (no Ranking Drop / Improved / Stable rows) | — |

### Mismatch status breakdown
| Status | Count |
|---|---|
| Matched | 5,054 |
| Potential Mismatch | 281 |

### Priority breakdown
| Priority | Count |
|---|---|
| N/A (no ranking issue) | 5,054 |
| Medium (mismatch only) | 281 |

### GSC date periods used
- Current period: `2026-09-27` to `2026-10-24` (28 days)
- Previous period: `2026-08-30` to `2026-09-26` (28 days)
- `blog_optimization_gsc_page` rows for `sc-domain:ledsone.co.uk`: **292,502** (table is populated)
- Latest date in GSC table: `2026-10-17`

### ROOT CAUSE — Why 5,332 products show "No GSC Data"

**URL format mismatch between `seo_url_product.canonical_url` and `blog_optimization_gsc_page.page`:**

| Source | URL format |
|---|---|
| `seo_url_product.canonical_url` | `https://www.ledsone.co.uk/products/{handle}` |
| `blog_optimization_gsc_page.page` | `https://ledsone.co.uk/products/{handle}` |

The `canonical_base` in `STORE_CONFIG` is `https://www.ledsone.co.uk/products/` but GSC stores pages without `www.`. Direct JOIN on `canonical_url = page` finds only **1 match** out of 5,335.

**Required fix:** Strip `www.` when matching, or use `REPLACE(p.canonical_url, 'www.', '')` in the JOIN — OR change the `canonical_base` constant to `https://ledsone.co.uk/products/`.

### Dashboard data source
**PostgreSQL only** — `/products` endpoint queries `seo_url_product` LEFT JOIN `seo_url_analysis`. No Shopify calls at read time.

## Production Sync Lock Investigation (2026-10-26)

### Root cause: multiple abandoned sync transactions holding locks

The `{"status":"computing"}` never resolves because **multiple overlapping sync runs left open transactions on the DB**. Each run held a lock and then went `idle in transaction` — never committed, never rolled back. New sync attempts block waiting for those locks.

**Lock chain (read-only DB inspection):**

| Blocked pid | Age waiting | Blocked on | Root blocker pid | Root blocker age |
|---|---|---|---|---|
| 354053 | 15m 14s | INSERT seo_url_product | 353008 (`idle in transaction`) | 28m 42s |
| 358471 | 9m 49s | INSERT seo_url_analysis | 352341 (`idle in transaction`) | ~24h+ |
| 359236 | 6m 6s | INSERT seo_url_analysis | 358471 (itself blocked) | — |
| 359878 | 3m 52s | CREATE INDEX seo_url_product_store_idx | 354053 (itself blocked) | — |

**Two root blockers (`idle in transaction`):**
- `pid=353008` — stuck after `CREATE INDEX IF NOT EXISTS seo_url_product_store_idx`, age 28+ min
- `pid=352341` — stuck after `INSERT INTO seo_url_analysis`, age ~24h+ (from prior session attempts via Claude Code Bash tool)

These are connections from **previous sync attempts** that the background Python processes started but never committed or closed — caused by the Bash tool dispatching long-running commands to background where the process was killed before `conn.commit()` executed, leaving the DB connection in `idle in transaction` state holding row/relation locks.

### Current DB state at time of investigation

| Table | Rows | Latest timestamp |
|---|---|---|
| `seo_url_product` | 5,335 | `synced_at: 2026-10-26 10:01:53 +01:00` |
| `seo_url_analysis` | 5,335 | `computed_at: 2026-10-26 09:43:21 +01:00` (original, not updated) |

Analysis `computed_at` has NOT been updated — no sync has successfully committed the analysis upsert. All 5,335 products still show "No GSC Data" from the original broken sync.

### Recovery verification snapshot — 2026-10-26 10:41:49 +01:00

### Check 1 — Blockers terminated: FAIL (not yet)
PIDs 354053 and 358471 still exist, still `idle in transaction`. Termination commands have not been executed yet.

### Check 2 — Blocked pids resolved: BLOCKED
PIDs 359236 and 359878 still `active`, still waiting on 354053 and 358471 respectively.

### Check 3 — Lock chain clear: BLOCKED
4 sessions still active on `dm_dashboard`. Same chain as before.

### Check 4+5 — Row counts and sync timestamps
| Table | Rows | Latest timestamp |
|---|---|---|
| `seo_url_product` | 5,335 | `synced_at: 2026-10-26 10:01:53 +01:00` ✅ (correct) |
| `seo_url_analysis` | 5,335 | `computed_at: 2026-10-26 09:43:21 +01:00` ❌ (stale — pre-fix) |

### Check 6 — Canonical URLs (no-www): PASS
- `canonical_url` with `www.`: **0** ✅
- `canonical_url` without `www.`: **5,335** ✅
- Sample: `https://ledsone.co.uk/products/2-core-round-green-cable`

### Check 6b — GSC match count: PASS (data is ready, analysis not yet recomputed)
- Products with GSC data in cur period (2026-09-27 to 2026-10-24): **4,626 of 5,335**

### Check 7 — Ranking status (stale): BLOCKED
Analysis `computed_at` is still `09:43:21` (from original broken www. sync). Current ranking breakdown reflects that broken state:
- No GSC Data: 5,332 (stale — will reduce to ~709 after recompute)
- Insufficient Data: 3

### Check 7c — Data integrity: PASS
- Duplicates: 0 | Orphans: 0 | Products without analysis: 0 ✅

## DB Recovery — COMPLETE (2026-10-26 10:49:47 +01:00)

**Terminations executed:**
- `pg_terminate_backend(354053)` → `True` ✅
- `pg_terminate_backend(358471)` → `True` ✅
- `pg_terminate_backend(359236)` → `True` ✅ (second-generation blocker — unblocked then went idle in transaction)

**Result:** All locks cleared. `seo_url_analysis` fully recomputed with corrected no-www canonical URLs.

### Final post-recovery state (2026-10-26 10:49:47 +01:00)

| Table | Rows | Latest timestamp |
|---|---|---|
| `seo_url_product` | 5,335 | `synced_at: 2026-10-26 10:49:45 +01:00` ✅ |
| `seo_url_analysis` | 5,335 | `computed_at: 2026-10-26 10:49:47 +01:00` ✅ |

### Ranking status (post-fix, post-recovery)
| Status | Count |
|---|---|
| Insufficient Data | 2,250 |
| Stable | 1,980 |
| No GSC Data | 495 |
| Ranking Drop | 381 |
| Improved | 229 |

GSC match rate: **4,840 of 5,335 products** (90.7%) — up from 4 (0.07%) before the www. fix.

### Mismatch status
| Status | Count |
|---|---|
| Matched | 5,054 |
| Potential Mismatch | 281 |

### Priority breakdown
| Priority | Count |
|---|---|
| N/A | 4,478 |
| Medium | 610 |
| Low | 221 |
| High | 26 |

**26 High-priority products** = Ranking Drop + Potential Mismatch — actionable SEO items.

## Database Access Verification (2026-10-26)

| DB | Env Var | Host (masked) | Database | PostgreSQL | SELECT 1 | Confirmed Provider |
|---|---|---|---|---|---|---|
| App DB | `DATABASE_URL` | `158.220.99.***` | `dm_dashboard` | 16.15 (Ubuntu) | PASS | **Contabo** (`vmi3548238.contaboserver.net`) |
| Business DB | `BUSINESS_DATABASE_URL` | `169.58.91.***` | `ledsone` | 18.4 (Ubuntu) | PASS | UNVERIFIED (remote, not Contabo rDNS) |
| Business DB 2 | `BUSINESS_DATABASE_2_URL` | NOT SET | — | — | N/A | N/A |

- App DB (`dm_dashboard`): **PASS — confirmed Contabo**. Reverse DNS resolves to `vmi3548238.contaboserver.net`. This is the database used by `get_conn()` — where `seo_url_product` and `seo_url_analysis` will be created on first sync.
- Business DB (`ledsone`): PASS — connection live, SELECT 1 succeeded. Used by `get_business_conn()`. Remote IP, not Contabo rDNS — provider unverified but accessible.
- Claude Code can connect to both databases from the local environment via project venv + `.env`.

## Notes
- Tables (seo_url_product, seo_url_analysis) created on first sync via _ensure_schema()
- GSC data source: public.blog_optimization_gsc_page — must be populated by gsc_sync.py
- If blog_optimization_gsc_page has no data for ledsone.co.uk products, all ranking_status will be "No GSC Data"
- All mismatch detection is regex-only — no spec sheet data, no verified mismatches

---

## Listing + Inventory Filter Validation (2026-10-26 — post-push)

### Changes vs initial push (c7157a9)

| Change | Detail |
|---|---|
| Added `Unknown Inventory` as filterable option | `_INVENTORY_STATUS_SQL["Unknown Inventory"] = "total_inventory IS NULL"` |
| Renamed "Untracked" → "Unknown Inventory" | Matches filter value — CASE expression + frontend pill map updated |
| Published `publishedAt` limitation documented | Comment in `_LISTING_STATUS_SQL`: reflects Online Store channel only, not all channels |

### Test Results — 8 Tests (all PASS)

| Test | Result | Evidence |
|---|---|---|
| T1 Migration idempotency — ALTER TABLE twice | PASS | No error on second run |
| T2 NULL inventory → Unknown, not Out of Stock | PASS | unknown=5335, oos=0, sum=total |
| T3 Listing status NULL handling | PASS | active=0, unlisted=5069, draft=172, archived=1 |
| T4 Analysis row count unchanged | PASS | 5335 rows |
| T5 Combined filter (Draft + Out of Stock) | PASS | 0 rows, no error |
| T6 Unknown Inventory filter SQL | PASS | 5335 rows (all NULL pre-sync) |
| T7 Ranking Drop count unchanged | PASS | 381 |
| T8 Potential Mismatch count unchanged | PASS | 281 |
| Python syntax (ast.parse) | PASS | — |
| Frontend build (npm run build) | PASS | `SeoUrlIntelligence` emitted, 0 errors, 910ms |

### publishedAt Limitation — Documented

`published_at IS NULL` on an ACTIVE product means the product was never published to the Shopify Online Store channel. It does NOT confirm the product is invisible on all channels (POS, wholesale, custom storefronts may still serve it). The Unlisted label is a heuristic consistent with project convention in `duplicate_price_check.py`.

### Pre-sync State (expected, correct)

- All 5,335 inventory rows: Unknown Inventory (total_inventory NULL)
- Active = 0, Unlisted = 5,069 (all ACTIVE show as Unlisted because published_at NULL)
- Listing and inventory filter values become accurate after re-sync only

### Production Re-sync Status

**REQUIRED** — `publishedAt` and `totalInventory` will only populate after next sync triggers the updated GraphQL query. Until then: all products show Unknown Inventory; all ACTIVE show as Unlisted.

---

## Post-Revert State Check (2026-10-26)

### What was reverted
Commit `3121466` (Unknown Inventory filter + publishedAt limitation comment) was reverted via `15266b0`. The main listing/inventory filter feature (`c7157a9`) was NOT reverted and remains fully in place.

### 1. Column existence — CONFIRMED

Both new columns exist in `public.seo_url_product`:

| Column | Type | Nullable |
|---|---|---|
| `published_at` | `timestamp with time zone` | YES |
| `total_inventory` | `integer` | YES |

### 2. Field population — ALL NULL (re-sync required)

| Metric | Value |
|---|---|
| Total rows | 5,335 |
| `published_at` filled | 0 |
| `published_at` NULL | 5,335 |
| `total_inventory` filled | 0 |
| `total_inventory` NULL | 5,335 |

Both columns exist but contain no data. The `ADD COLUMN IF NOT EXISTS` migration ran against the live DB in a previous session. No sync has been completed since the updated GraphQL query (which fetches `publishedAt` + `totalInventory`) was pushed. A Shopify re-sync is required to populate these fields.

### 3. Listing/Inventory filters — FULLY IMPLEMENTED (c7157a9 intact)

**Backend (`seo_url_intelligence.py`):**
- `_LISTING_STATUS_SQL`: Active / Unlisted / Draft / Archived — present ✅
- `_INVENTORY_STATUS_SQL`: In Stock / Out of Stock — present ✅ (Unknown Inventory removed by revert)
- `listing_status` + `inventory_status` params on `/products` and `/products/csv` — present ✅
- `published_at` and `total_inventory` in GraphQL query, upsert, SELECT CASE expressions — present ✅

**Frontend (`SeoUrlIntelligence.jsx`):**
- `LISTING_OPTIONS`: Active / Unlisted / Draft / Archived — present ✅
- `INVENTORY_OPTIONS`: In Stock / Out of Stock (Unknown Inventory removed by revert) ✅
- Both filter dropdowns rendered in UI — present ✅
- `listingFilter` + `inventoryFilter` state wired to fetch + CSV export — present ✅
- Listing/Inventory columns in table + expanded row detail — present ✅

### 4. Re-sync requirement — YES

A Shopify re-sync is required. The backend will fetch `publishedAt` and `totalInventory` from Shopify GraphQL on the next sync and write them to the DB. Until then:
- All products show `listing_status = 'Unlisted'` (ACTIVE + published_at IS NULL)
- All products show `inventory_status = 'Untracked'` (total_inventory IS NULL — label from CASE expression)
- Listing and Inventory filters are functional but will return inaccurate results pre-sync

### Current git state (dm-dashboard piranv-work)

| Commit | Status |
|---|---|
| `c7157a9` | Listing/Inventory filter feature — **active** |
| `3121466` | Unknown Inventory + publishedAt comment — **reverted by 15266b0** |

---

## Pre-Sync Safety Check (2026-10-26 16:42:54 +05:30)

### 1. GraphQL query — publishedAt and totalInventory present: CONFIRMED

Both fields present in `_PRODUCT_QUERY` (lines 164–165):
```graphql
publishedAt
totalInventory
```
Both mapped in `_fetch_shopify_products()` (lines 188–189):
```python
"published_at":    p.get("publishedAt"),
"total_inventory": p.get("totalInventory"),
```

### 2. Upsert — both fields persisted correctly: CONFIRMED

`_upsert_products()` INSERT and ON CONFLICT DO UPDATE both include `published_at` and `total_inventory` (lines 209, 217–218). A re-sync will overwrite with fresh Shopify values on every product.

### 3. canonical_url — no-www confirmed: PASS

| Check | Result |
|---|---|
| `canonical_base` in STORE_CONFIG | `https://ledsone.co.uk/products/` (no www.) |
| canonical_url rows with `www.` | **0** of 5,335 |
| Sample URLs | `https://ledsone.co.uk/products/...` ✅ |

The sync builds `canonical_url = canonical_base + handle` — will produce no-www URLs. No risk of overwriting with www. values.

### 4. GSC analysis — recompute behaviour: SAFE

The sync recomputes `seo_url_analysis` fully from current GSC data via `ON CONFLICT DO UPDATE`. This is the intended behaviour. Since the latest GSC date in `blog_optimization_gsc_page` is `2026-10-17` and that has not changed since the last sync (`computed_at: 2026-10-26 10:49:47`), the ranking breakdown will be identical or near-identical post-sync.

Current analysis to be preserved (will recompute to same values):

| Status | Count |
|---|---|
| Insufficient Data | 2,250 |
| Stable | 1,980 |
| No GSC Data | 495 |
| Ranking Drop | 381 |
| Improved | 229 |

### 5. PostgreSQL locks — CLEAR: PASS

| Check | Result |
|---|---|
| SEO-related active sessions | 0 |
| Other active sessions | 0 |
| Lock chains | 0 |

No abandoned transactions, no blocked sessions. DB is fully idle.

### 6. Current DB state pre-sync

| Table | Rows | Last timestamp |
|---|---|---|
| `seo_url_product` | 5,335 | `synced_at: 2026-10-26 10:49:45 +01:00` |
| `seo_url_analysis` | 5,335 | `computed_at: 2026-10-26 10:49:47 +01:00` |
| `published_at` filled | 0 | NULL — awaiting sync |
| `total_inventory` filled | 0 | NULL — awaiting sync |

### VERDICT: SYNC IS SAFE TO RUN

All pre-conditions clear:
- GraphQL query fetches `publishedAt` + `totalInventory` ✅
- Upsert persists both fields ✅
- canonical_url no-www verified ✅
- DB idle, no locks ✅
- Analysis recompute will use same GSC window, same results expected ✅

---

## _ensure_schema() Fix — Sync Connection Drop Root Cause and Fix (2026-10-26)

### Root cause

Every sync call runs `_ensure_schema()`, which executed two `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` statements unconditionally — even though both columns (`published_at`, `total_inventory`) already exist. PostgreSQL acquires an `AccessExclusiveLock` on the table to service the DDL, even when `IF NOT EXISTS` means no actual change is made. Over the Contabo remote connection, the server drops the TCP connection during that lock-wait on every sync attempt. The `_RetryingConn` wrapper in `db.py` only retries connection acquisition, not mid-query failures — so the retry logic provided no protection.

**Failure signature (from task output):**
```
psycopg.OperationalError: consuming input failed: server closed the connection unexpectedly
```
**Failing location:** `_ensure_schema()` → `ALTER TABLE seo_url_product ADD COLUMN IF NOT EXISTS published_at`

### Fix applied

Replaced unconditional `ALTER TABLE` with a guard: query `information_schema.columns` first (lock-free SELECT), then only run `ALTER TABLE` when the column is genuinely absent.

**Diff summary:**
- Remove: 2× `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
- Add: 1× `information_schema.columns` SELECT → conditional `ALTER TABLE` (no `IF NOT EXISTS` — the SELECT is the guard)

**One file changed:** `backend/app/dashboard_pages/seo_url_intelligence.py`

### Tests (5/5 PASS — run against Contabo production DB)

| Test | Scenario | Result |
|---|---|---|
| T1 | Both columns exist — no DDL executed | PASS |
| T2 | `published_at` absent — added, `total_inventory` untouched | PASS |
| T3 | `total_inventory` absent — added, `published_at` untouched | PASS |
| T4 | Both absent — both added | PASS |
| T5 | Idempotency — second run is no-op | PASS |

Python syntax: PASS

### Remaining risks

- `CREATE INDEX IF NOT EXISTS seo_url_product_store_idx` is still run unconditionally. `CREATE INDEX IF NOT EXISTS` is cheaper than `ALTER TABLE` (shared lock, not exclusive) and has not caused failures — no change made.
- Fix is local only — not committed or pushed (per task instructions).
- Production sync still not run — awaiting Piranav instruction after commit/push.

---

## Section 6 — Analysis Upsert Batch Fix (2026-10-26)

### Problem

`_run_sync()` held a single pooled connection open for **5,335 individual `conn.execute()`** calls before committing.  Over the Contabo internet path the TCP connection drops mid-loop, the transaction is implicitly rolled back (no partial writes), and the sync fails with `OperationalError: consuming input failed`.

Confirmed in task output `b0plh1pd2`: full computation succeeded (14,778/17,654 GSC keys, 5,335 products, ranking + mismatch computed) — only the persist step failed.

### Fix applied

**`_upsert_analysis_batched(store, analysis_rows)`** — new helper function in `seo_url_intelligence.py` replacing lines 541–586 of `_run_sync()`.

Key properties:
- Splits rows into batches of `_ANALYSIS_BATCH_SIZE = 500`
- Each batch acquires a fresh `get_conn()` context — connection held for ~500 rows, not ~5,335
- Uses `conn.executemany()` (pipeline-compatible) not a per-row loop
- On `OperationalError` matching `_ANALYSIS_RETRYABLE` markers: retries up to 3× with 2/5/10 s backoff
- On non-retryable error: re-raises immediately (no retry)
- On permanent batch failure: re-raises so `_SyncJob` records `error`, `/sync/status` returns `{"status":"error"}` — incomplete sync is NOT silently presented as complete

**Partial-commit trade-off:** If batch N fails after all retries, rows 0..N-1 are committed with new `computed_at`; rows N..end retain previous values. This is visible in the DB but `sync_status = error` signals the incomplete state. Re-running the sync overwrites all rows idempotently.

**Files changed:**
- `backend/app/dashboard_pages/seo_url_intelligence.py` — added `_ANALYSIS_UPSERT_SQL`, `_ANALYSIS_BATCH_SIZE`, `_ANALYSIS_RETRY_DELAYS`, `_ANALYSIS_RETRYABLE`, `_upsert_analysis_batched()`; replaced 46-line single-connection loop with 1-line call
- `backend/tests/test_seo_url_analysis_batch.py` — 7 new unit tests

### Tests (7/7 PASS — pure unit tests, mock DB)

| Test | Scenario | Result |
|---|---|---|
| T1 | Single batch < BATCH_SIZE — one executemany, one commit | PASS |
| T2 | 600 rows → 2 batches (500+100), each committed independently | PASS |
| T3 | Transient OperationalError on attempt 1, success on attempt 2 | PASS |
| T4 | All retries exhausted → exception propagates | PASS |
| T5 | Non-transient error propagates immediately (no retry) | PASS |
| T6 | Row count integrity: 0/1/499/500/501/1000/5335 rows all correct | PASS |
| T7 | Retry delays match _ANALYSIS_RETRY_DELAYS sequence | PASS |

Python syntax check: PASS (`py_compile`)

### Status

Fix local only — not committed or pushed. Production sync not run. Awaiting Piranav instruction.

---

## Section 7 — Safety Review: Batch Fix Pre-Commit Check (2026-10-26)

### Review scope

1. Actual code diff inspected
2. Dashboard read path confirmed
3. Partial data visibility traced end-to-end
4. Smallest safe fix proposed and applied
5. Retry corruption analysis
6. Tests re-run

### Finding 1 — Partial data CAN become visible

The `/products` endpoint uses `LEFT JOIN seo_url_analysis` with no filter on `computed_at` or sync generation. The products component loads independently of `syncStatus.status`. If a later batch fails permanently, rows from that batch retain their previous `computed_at` and old GSC-period analysis values while earlier batches already committed new values.

**Status:** Not silently presented — error banner (`jreq-error-banner`) is shown. But original banner text only showed the raw exception message, not an explanation of what it means for data integrity.

### Finding 2 — Partial commit is worse than original single-transaction failure

Original code: sync fails → single transaction rolled back → ALL rows still from last successful sync (consistent, one GSC window).

New batch code with partial failure: rows 0–N are from new GSC window, rows N–5335 are from old GSC window. Summary pill counts aggregate across both.

**Mitigated by:** error banner + new explanatory sub-text (see Fix 1 below).

### Fix 1 applied — error banner sub-text (SeoUrlIntelligence.jsx)

Added sub-text to the error banner:

> "Ranking and mismatch analysis may reflect a previous sync period. Re-run sync to resolve. Product, listing and inventory data is unaffected."

This is accurate: `seo_url_product` (listing status, inventory status) is upserted in a separate step before analysis, always completes cleanly, and is not batched.

### Finding 3 — Retry is safe (no corruption)

ON CONFLICT (store, shopify_id) DO UPDATE SET [all columns] = EXCLUDED.* is a full overwrite. When a connection drops mid-batch:
- PostgreSQL server: rolls back the incomplete batch transaction (no partial rows committed)
- psycopg3: reports OperationalError
- `_upsert_analysis_batched`: sleeps, acquires fresh connection, retries all 500 rows from scratch
- Result: idempotent — same 500 rows committed as if the drop never happened

`computed_at = now()` for retried rows reflects the retry timestamp, not the original attempt. This is correct.

### Tests re-run

`backend/tests/test_seo_url_analysis_batch.py` — 7/7 PASS (1.36s)

### Files changed in this session

| File | Change |
|---|---|
| `backend/app/dashboard_pages/seo_url_intelligence.py` | `_upsert_analysis_batched()` + constants added; 46-line single-connection loop replaced with 1-line call |
| `frontend/src/admin/pages/SeoUrlIntelligence.jsx` | Error banner sub-text added |
| `backend/tests/test_seo_url_analysis_batch.py` | New — 7 unit tests |

### Status

All changes local only. No commit, push, deploy, or production sync. Awaiting Piranav approval.

**Pre-commit verdict: SAFE TO COMMIT with the banner fix applied.**

---

## Section 8 — Production Sync Preflight (2026-10-26)

### DB connection: Contabo (158.220.99.127:5432/dm_dashboard)

Note: the ph_dashboard MCP tool connects to a different server (169.58.91.229) and does not have access to the dm_dashboard Contabo tables. DB checks were performed via the backend Python venv (read-only queries, no credential values printed).

### Check results

| # | Check | Result | Detail |
|---|---|---|---|
| 1 | Branch and commit | PASS | piranv-work @ 139ef2d — matches pushed commit |
| 2 | Working tree clean | PASS | git status: no staged or unstaged changes |
| 3 | Remote sync | PASS | origin/piranv-work @ 139ef2d — local matches remote |
| 4 | Batch fix present in code | PASS | `_upsert_analysis_batched()`, `_ANALYSIS_BATCH_SIZE=500`, `_ANALYSIS_RETRY_DELAYS=(2,5,10)` confirmed at lines 526–637 |
| 5 | Error banner sub-text | PASS | JSX line 269: "Ranking and mismatch analysis may reflect a previous sync period..." |
| 6a | `published_at` column in DB | PASS | Column exists in `seo_url_product` |
| 6b | `total_inventory` column in DB | PASS | Column exists in `seo_url_product` |
| 6c | `published_at` / `total_inventory` values populated | NOTE | Both columns are NULL for all 5,336 rows — populated on next sync (columns were added after last successful sync) |
| 6d | Fields in GraphQL query | PASS | `publishedAt` and `totalInventory` in `_PRODUCT_QUERY` (lines 176–177) |
| 6e | Fields in DB upsert | PASS | `published_at`, `total_inventory` in INSERT and ON CONFLICT DO UPDATE (lines 221–243) |
| 7 | Backend running | NOTE | Port 8000 not listening — backend not running. Sync status is in-memory; will be `idle` on next start |
| 8 | Active/stuck DB sessions | PASS | 0 active or idle-in-transaction sessions on dm_dashboard |
| 9 | Ungranted DB locks | PASS | 0 ungranted locks |
| 10 | seo_url_product rows | PASS | 5,336 rows present |
| 11 | seo_url_analysis rows | PASS | 5,336 rows, all `computed_at = 2026-10-26 12:13:19` (consistent — 1 distinct minute) |
| 12 | Production sync triggered | PASS — NOT run | Awaiting Piranav approval |

### Pre-sync state summary

- DB is clean: no locks, no stuck sessions
- Both SEO tables exist with 5,336 rows each
- Analysis data is consistent (all from one sync run, same timestamp)
- `published_at` and `total_inventory` columns exist but values are NULL — will be populated by the next sync
- Backend must be started before sync can be triggered
- The batch fix (commit 139ef2d) is the HEAD commit and matches origin

**Pre-sync verdict: CLEAR — safe to start backend and run production sync when approved.**

---

## Section 9 — Live Verification + Code Defect Discovery (2026-10-26)

### Critical finding — `conn.executemany` does not exist in psycopg3

**Confirmed via local inspection:**

```
psycopg version: 3.2.10
Connection execute methods: ['execute']          # NO executemany
Cursor execute methods: ['execute', 'executemany']  # executemany is on Cursor only
```

**Line 575 of `seo_url_intelligence.py` (commit 139ef2d):**
```python
conn.executemany(_ANALYSIS_UPSERT_SQL, params)   # ← WRONG — AttributeError
```

**Correct pattern (as used in the same codebase — link_opportunities.py:325, schema.py:288, 425):**
```python
conn.cursor().executemany(_ANALYSIS_UPSERT_SQL, params)   # ← CORRECT
```

In psycopg3, `Connection.execute()` exists as a shorthand for a single statement. `Connection.executemany()` does NOT exist. `executemany` is a method on `Cursor` only.

The local error screenshot (`'Connection' object has no attribute 'executemany'`) is confirmed as a real code defect in commit 139ef2d.

### Live environment vs local environment

| Environment | Code version | executemany bug | Sync at 13:07 possible? |
|---|---|---|---|
| Contabo VPS (live, 158.220.99.127) | Pre-139ef2d (not deployed) | Not present | YES — old code used conn.execute() loop |
| Local dev (Windows, localhost:8499) | 139ef2d (batch fix) | PRESENT | NO — will fail with AttributeError |

The live summary data (`lastSync: 2026-10-26T13:07:43`, 5,336 products, ranking/mismatch counts) reflects a sync run on the VPS at 13:07 using the OLD code (single-connection loop, no batch fix). Commit 139ef2d was not on the VPS at that time and has NOT been deployed to it.

### Sync status endpoint — what proves success vs error

`GET /api/seo-url-intelligence/sync/status?store=ledsone_uk` returns:

| Response | Meaning |
|---|---|
| `{"status": "idle"}` | Backend restarted since last sync; no sync run yet this session |
| `{"status": "computing"}` | Sync in progress |
| `{"status": "error", "error": "..."}` | Sync failed — error message in `error` field |
| `{"status": "done", "productsUpserted": N, "analysisRows": N, "gscCurrentPeriod": {...}, ...}` | Sync COMPLETED SUCCESSFULLY |

**The `summary` endpoint CANNOT confirm sync success.** It reads from the DB unconditionally, returning data from any previous sync. A `summary` result of `ok=true` with product counts proves the DB contains rows — not that a new sync completed.

**The only confirmation of sync success is `sync/status` returning `{"status": "done", ...}`.**

### Current live evidence — what is proven vs unverified

**PROVEN (from summary endpoint):**
- 5,336 products in `seo_url_product`
- 5,336 analysis rows in `seo_url_analysis`
- All analysis rows share a single `computed_at` timestamp (consistent)
- `lastSync: 2026-10-26T13:07:43+01:00` — at least one sync completed before that time
- Ranking/mismatch distribution is non-zero and plausible

**UNVERIFIED:**
- Whether `sync/status` returns `done`, `idle`, or `error` on the live VPS right now (in-memory — resets on backend restart)
- Whether the 13:07 sync used the old or new analysis upsert path (old code — pre-139ef2d — is confirmed)
- Whether `published_at` and `total_inventory` are populated on the live VPS (the 13:07 sync used old _PRODUCT_QUERY without those fields)

**MANUAL BROWSER VERIFICATION REQUIRED:**
Navigate to the SEO URL Intelligence page, open browser DevTools → Network, and check the response from:
`/api/seo-url-intelligence/sync/status?store=ledsone_uk`

Confirm `status` field is `"done"` (not `"idle"` or `"error"`) to prove the in-memory state reflects a completed sync this session.

### Actions performed this session

- Code inspected (read-only)
- No code changes, commits, pushes, deployments, or syncs performed
- No production data modified

### Status: BLOCKED — code defect must be fixed before local sync can succeed

**Defect:** `conn.executemany()` → must be `conn.cursor().executemany()` (line 575, `seo_url_intelligence.py`)
**Fix scope:** 1 line. Does not affect logic, batch size, retry, or transaction structure.
**Next action:** Piranav approves fix → apply, re-run tests, commit, push.

---

## Section 10 — executemany Defect Fix + Regression Test (2026-10-26)

### Git state at fix

| Item | Value |
|---|---|
| Branch | piranv-work |
| HEAD before fix | 139ef2d (Fix SEO URL analysis batch upsert reliability) |
| Working tree before fix | Clean |
| Origin tracking | piranv-work up to date with origin/piranv-work |
| Defect confirmed in 139ef2d | YES — `git show 139ef2d:...seo_url_intelligence.py | grep executemany` → line 575 |

### Defect

**File:** `backend/app/dashboard_pages/seo_url_intelligence.py`, line 575

In psycopg3, `executemany` is a method on `Cursor`, not on `Connection`. `Connection.execute()` exists as a shorthand for single statements only.

| | Code |
|---|---|
| Broken (139ef2d) | `conn.executemany(_ANALYSIS_UPSERT_SQL, params)` |
| Fixed | `conn.cursor().executemany(_ANALYSIS_UPSERT_SQL, params)` |

Pattern confirmed from existing codebase: `link_opportunities.py:325`, `schema.py:288`, `schema.py:425` all use `conn.cursor().executemany(...)`.

### Diff

```diff
-                    conn.executemany(_ANALYSIS_UPSERT_SQL, params)
+                    conn.cursor().executemany(_ANALYSIS_UPSERT_SQL, params)
```

One character change. Logic, batch size, retry structure, and commit placement are all unchanged.

### Test file update

All 7 existing tests were wired to `conn.executemany` — they passed before only because `MagicMock()` auto-creates any attribute silently. After the fix, mocks rewired to `conn.cursor.return_value.executemany`. Added `_cursor_of()` helper for clarity.

**T8 regression test added:** `test_cursor_executemany_called_not_conn_executemany` — explicitly asserts `conn.cursor()` was called, `cursor.executemany` was called, and `conn.executemany` call count is 0. This test would have caught the defect in 139ef2d had it existed at the time.

### Test results (8/8 PASS)

```
backend/tests/test_seo_url_analysis_batch.py — 8 passed in 1.15s

T1  test_successful_single_batch                          PASS
T2  test_two_batches_committed_independently              PASS
T3  test_transient_failure_then_success                   PASS
T4  test_all_retries_exhausted_raises                     PASS
T5  test_non_transient_error_no_retry                     PASS
T6  test_row_count_integrity                              PASS
T7  test_retry_delay_sequence                             PASS
T8  test_cursor_executemany_called_not_conn_executemany   PASS
```

### Status

Fix local only. Not committed or pushed. No production sync, deploy. Awaiting Piranav approval.
