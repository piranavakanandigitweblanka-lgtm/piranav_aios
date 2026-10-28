---
name: dm-campaign-overall-performance-audit-2026-10-28
description: Full read-only audit of the DM Campaign — Overall Performance page in the DM Dashboard. Covers navigation, components, API endpoints, SQL queries, KPI formulas, caching, and risks.
metadata:
  type: evidence
---

# Evidence: DM Campaign — Overall Performance — Full Audit

**Date:** 2026-10-28
**Auditor:** Claude Code (piranav AIOS)
**Scope:** Read-only code audit — no source files modified

---

## Post-Sync Verification (2026-10-28 — commit 8427e22)

**Repository:** `websitetecteam-arch/dm-dashboard`
**Branch:** `main`
**HEAD:** `8427e22` — Merge pull request #116 from websitetecteam-arch/dev-work
**Matches origin/main:** YES
**Working tree:** Clean

### What changed in the 304-commit sync that affects this page

The original audit was written AFTER the sync had already been applied, so all audit findings already reflect the current `main` state. The comparison below documents what was different at the pre-sync HEAD (`846cbef`) vs now.

| File | Pre-sync (846cbef) | Post-sync (8427e22) | Audit impact |
|---|---|---|---|
| `frontend/src/admin/AdminLayout.jsx` | Direct `lazy(() => import('./pages/DmCampaign'))` + hardcoded `<DmCampaign />` panel render (old architecture) | `toolKey: 'tools.DmCampaign'` leaf item, rendered via `GrantedTaskPanel` + `taskRegistry` (new unified architecture) | **Architecture changed** — audit reflects current (post-sync) state correctly |
| `frontend/src/taskRegistry.jsx` | **File did not exist** | Introduced with `tools.DmCampaign` entry at lines 343–353 | Audit reflects current state correctly |
| `frontend/src/admin/pages/DmCampaign.jsx` | Unchanged across sync | Unchanged | All audit findings accurate |
| `backend/app/dashboard_pages/dm_campaign.py` | Unchanged across sync | Unchanged | All audit findings accurate |
| `backend/app/core/scheduled_snapshot.py` | No `is_running()` method | Added `is_running()` public method (c11f985) — exposes `_currently_running` flag | Minor addition; DM Campaign's `product_snapshot` does not use `is_running()`. No impact on audit. |
| `backend/app/core/task_auth.py` | Unchanged across sync | Unchanged | Auth gate findings accurate |
| `backend/app/core/auth.py` | No `team` field on user model | `team: str | None` added (d431455) | Not used by DM Campaign endpoints. No impact. |
| `frontend/src/lib/apiFetch.js` | Unchanged (comment only change at eaee857) | Comment added | No functional change. Audit accurate. |

### Confirmed accurate from original audit
- Navigation path: section `Sales & Performance`, key `dm-campaign`, toolKey `tools.DmCampaign` — **CONFIRMED** (AdminLayout.jsx lines 149–150)
- Auth gate: `make_admin_task_auth("tools.DmCampaign")` — **CONFIRMED** (dm_campaign.py line 49)
- All 3 API endpoints: `/summary`, `/products`, `/products/sync/run-now` — **CONFIRMED**
- All SQL queries (CAMPAIGNS_QUERY, CAMPAIGN_PERF_QUERY, CAMPAIGN_DAILY_QUERY, PRODUCT_PERF_QUERY) — **CONFIRMED**
- Data sources: `google_ads.*`, `listings.shopify_listings`, `order_management.*` — **CONFIRMED**
- Snapshot: `product_snapshot`, scope `admin-dm-campaign-products`, table `public.admin_dm_campaign_products_snapshot`, 6-hour interval — **CONFIRMED**
- All KPI formulas, flag logic, date handling — **CONFIRMED**
- Known issues (unused `daily` array, `days_live` all-time scope, `eur()` name, ROAS as %) — **CONFIRMED still present**

### Key architectural change confirmed (not in original audit)
The pre-sync AdminLayout used a direct lazy import and hardcoded panel render for DM Campaign. The post-sync version uses the unified `taskRegistry` + `GrantedTaskPanel` pattern introduced during the 304-commit range. This means:
- Rendering path is now: `taskRegistry.jsx` `load()` → lazy component → `GrantedTaskPanel` lazy-mounts via `tabPanelClass`
- Access control grant check is now done centrally in `filterAdminItems()` via `useGrantedTasks()` hook
- **No functional difference to the user** — the page content, API calls, and data flow are identical
- **Regression risk note:** any future change must update `taskRegistry.jsx` (label/icon/sub/load), NOT a direct import in `AdminLayout.jsx`

---

## 1. Existing AIOS Documentation Found

| File | Relevance |
|---|---|
| `closure/piranav/dm-dashboard-local-setup-2026-09-01.md` | Local setup (Python 3.13, port 5199/8499) |
| `evidence/piranav/dm-campaign-filter-2026-09-23.md` | Campaign filter dropdown added to Products view (2026-09-23) |
| `PROMPT_REGISTER.md` — `muguntha-budget-rule-alert-step1-discovery` | Prior DM campaign data model audit (2026-10-12) — ROAS formula confirmed |

---

## 2. Navigation Path

**Sidebar section:** `Sales & Performance`
**Sidebar label:** `DM Campaign`
**Nav key in `AdminLayout.jsx`:** `dm-campaign`
**Tool key:** `tools.DmCampaign`
**`RAW_ADMIN_ITEMS` line:** `{ key: 'dm-campaign', toolKey: 'tools.DmCampaign', enabled: true }` (line 150)
**Section header declared at line 149:** `{ key: 'section-sales-performance', section: 'Sales & Performance' }`

Access control: item is gate-controlled via `filterAdminItems()` + `useGrantedTasks()`. Only admins/devs with `tools.DmCampaign` in their `access_grants` row can see this entry. Dev role bypasses the grant filter entirely (line 319 `AdminLayout.jsx`).

---

## 3. Component Resolution

**`taskRegistry.jsx` entry (lines 343–353):**
```
taskKey: 'tools.DmCampaign'
label: 'DM Campaign'
kind: 'tool'
lazy: true
sub: 'ledsone.co.uk — Google Ads overall performance'
load: () => import('./admin/pages/DmCampaign')
```

**Component file:** `frontend/src/admin/pages/DmCampaign.jsx`
**Rendered via:** `GrantedTaskPanel` in `AdminLayout.jsx` (line 354) → `tabPanelClass` lazy mounting from `Sidebar.jsx`

---

## 4. Frontend Component Map

**Main export:** `DmCampaign()` (line 563)
- Eyebrow: "Admin — Sales & Performance"
- Heading: "DM Campaign — Overall Performance"
- Sub: "Google Ads campaigns (group 'DM') advertising ledsone.co.uk, tied together with real Shopify UK sales."
- **Two-tab toggle:** Campaigns | Products (state: `view`, default: `'campaigns'`)

### Tab 1: Campaigns (`CampaignsView`)
- **KPI cards:** Campaigns count, Impressions, Clicks, Cost, Conv. Value (hero), ROAS (hero)
- **Date range bar (`DateRangeBar`):** Start/End date pickers (bounded to `dataMin`/`dataMax`). Apply button triggers `load(start, end)`. "Reset to All Time" clears both and calls `load('','')`. Defaults to All Time.
- **Search bar:** free-text filter on campaign name (client-side)
- **Sort dropdown:** Spend High→Low (default) | Spend Low→High | ROAS High→Low (client-side)
- **Export CSV button:** exports filtered rows as `dm-campaign-summary-<date>.csv`
- **Table columns:** Campaign, Budget (£/day), Impressions, Clicks, CTR, Cost, Conversions, Conv. Value, ROAS
- **Loading/empty/error states:** inline `<tr>` messages
- **Footnote:** Scope note — 7 campaigns under "DM" group, 2 ad accounts

### Tab 2: Products (`ProductsView`)
- **KPI cards:** Products Tracked, 0 Impressions (villain), 0 Clicks (villain), 0 Conversions, Healthy (hero) — counts from `flagCounts`
- **Sync status chip:** Shows `syncedAt` timestamp (scheduled snapshot) or 'Live (custom range)'
- **Refresh button:** POSTs to `/products/sync/run-now`, polls until `syncedAt` changes (max 300s)
- **Date range bar:** same `DateRangeBar` component; date change resets `campaign` filter to 'all' and page to 1
- **Search bar:** filters on title, SKU, productItemId, campaignName (client-side)
- **Campaign dropdown:** filter by campaign name (client-side, derived from rows via `useMemo`)
- **Flag dropdown:** All | New+0 Imp | 0 Impressions | 0 Clicks | 0 Conversions | Healthy
- **Sort dropdown:** Spend High→Low (default) | Spend Low→High | ROAS High→Low
- **Export CSV button:** exports filtered rows as `dm-campaign-products-<date>.csv`
- **Table columns:** Product ID (Google Ads), Campaign, Cost, Clicks, Conv. Value, ROAS, Flag, Details button
- **Pagination:** 50/100/250/500 rows per page; page navigation
- **Product Detail Modal (`ProductDetailModal`):** triggered by Details button; shows Campaign, Days Live, Impressions, Clicks, Cost, Conversions, Conv. Value (Google Ads), ROAS, Units Sold (Real, Shopify UK), Real Revenue (Shopify UK), Sales Gap (Real − Ads). Link to ledsone.co.uk listing. Closeable by Escape key or overlay click.
- **Note block:** explains "Unknown Product" and Sales Gap meaning (from API `note` field)
- **Footnote:** explains snapshot refresh schedule

### Shared sub-components
- `DateRangeBar` — inline date picker + Apply/Reset
- `FlagPill` — coloured status pill (new/zeroimp/zeroclick/zeroconv/healthy)
- `ProductDetailModal` — overlay with full product breakdown
- `Icon.*` — inline SVG icons (Sparkle, AlertTriangle, AlertCircle, CheckCircle)
- `apiFetch` (`frontend/src/lib/apiFetch.js`) — auth-aware fetch wrapper (attaches `dm_token`, dispatches `dm:session-expired` / `dm:server-unavailable` global events)

---

## 5. Backend / API Map

**Backend file:** `backend/app/dashboard_pages/dm_campaign.py`
**Router registered in `main.py`:** line 347 `app.include_router(admin_dm_campaign_router)`
**Snapshot started in `main.py`:** line 492 `start_dm_campaign_snapshots()`
**Router prefix:** `/api/admin/dm-campaign`
**Auth dependency:** `make_admin_task_auth("tools.DmCampaign")` — checks `access_grants` for `tools.DmCampaign`; role='admin' does NOT auto-bypass (only role='dev' does). Confirmed in `backend/app/core/task_auth.py` lines 77–107.

### Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/admin/dm-campaign/summary` | Campaign-level aggregated performance |
| GET | `/api/admin/dm-campaign/products` | Product-level performance (snapshot or live) |
| POST | `/api/admin/dm-campaign/products/sync/run-now` | Trigger background snapshot refresh |

---

## 6. End-to-End Data Flow

### Flow A: Campaigns tab
```
DmCampaign.jsx → CampaignsView.load()
  → apiFetch GET /api/admin/dm-campaign/summary?mode=all
  → FastAPI: dm_campaign_summary() → _compute_campaign_summary("all", None, None)
    → _bounds() → SELECT MIN/MAX date FROM google_ads.campaign_performance WHERE campaigns.group_name='DM' AND campaign_status='ENABLED'
    → CAMPAIGNS_QUERY: SELECT campaign_id, campaign_name, account_id, budget FROM google_ads.campaigns WHERE group_name='DM' AND campaign_status='ENABLED'
    → CAMPAIGN_PERF_QUERY: SELECT campaign_id, SUM(impressions,clicks,cost,conversions,conversion_value) FROM google_ads.campaign_performance WHERE campaign_id IN (...DM ENABLED...) AND date BETWEEN start AND end
    → CAMPAIGN_DAILY_QUERY: per-day per-campaign rows (returned but not currently rendered in UI — included in API response as `daily` array, unused by CampaignsView)
  → JSON response: { generatedAt, dateRange, totals, campaigns[], daily[] }
  → CampaignsView: renders KPI cards from totals, table rows from campaigns[]
  → Client-side: search filter + sort applied to campaigns[] in useMemo
```

### Flow B: Products tab (All Time — snapshot)
```
DmCampaign.jsx → ProductsView.load()
  → apiFetch GET /api/admin/dm-campaign/products?mode=all
  → FastAPI: dm_campaign_products() → product_snapshot.read()
    → reads public.admin_dm_campaign_products_snapshot (JSON JSONB column)
    → if stale/missing: runs _compute_product_performance() live then writes snapshot
  → JSON response: { generatedAt, dateRange, note, flagCounts, totalProducts, products[], syncedAt, source:'scheduled-sync' }
  → Client-side: search/campaign/flag filters + sort + pagination in useMemo
```

### Flow C: Products tab (custom date range — live)
```
→ apiFetch GET /api/admin/dm-campaign/products?mode=custom&start=YYYY-MM-DD&end=YYYY-MM-DD
→ FastAPI: _compute_product_performance("custom", start, end) — always live, no snapshot
→ source: 'live-filtered'
```

### Flow D: Refresh button
```
→ apiFetch POST /api/admin/dm-campaign/products/sync/run-now
→ FastAPI: threads product_snapshot.run_sync(manual=True)
→ ProductsView polls load() every 2s (max 150 iterations = 300s) until syncedAt changes
```

---

## 7. SQL Queries and Data Sources

### Campaign summary queries (in `_compute_campaign_summary`)

**`_bounds()`**
```sql
SELECT MIN(date), MAX(date) FROM google_ads.campaign_performance
WHERE campaign_id IN (SELECT campaign_id FROM google_ads.campaigns WHERE group_name='DM' AND campaign_status='ENABLED')
```

**`CAMPAIGNS_QUERY`**
```sql
SELECT campaign_id, campaign_name, account_id, budget
FROM google_ads.campaigns
WHERE group_name='DM' AND campaign_status='ENABLED'
ORDER BY campaign_id
```

**`CAMPAIGN_PERF_QUERY`**
```sql
SELECT campaign_id,
  SUM(impressions)::bigint, SUM(clicks)::bigint, SUM(cost)::numeric,
  SUM(conversions)::numeric, SUM(conversion_value)::numeric
FROM google_ads.campaign_performance
WHERE campaign_id IN (SELECT ... group_name='DM' AND campaign_status='ENABLED')
  AND date BETWEEN %(start)s AND %(end)s
GROUP BY campaign_id
```

**`CAMPAIGN_DAILY_QUERY`** — daily per-campaign rows, same date filter, ORDER BY date ASC. Included in response but not displayed in current UI.

### Product performance query (`PRODUCT_PERF_QUERY`)

CTE breakdown:
1. `dm_campaigns` — ENABLED DM campaigns (campaign_id, campaign_name, budget)
2. `perf` — product-level aggregation from `google_ads.product_performance`, grouped by product_item_id + campaign_id, date-filtered
3. `first_seen` — MIN(date) per product+campaign from full history (not date-filtered — always all-time for days_live calc)
4. `resolved` — extracts variant_id: `regexp_replace(product_item_id, '^shopify_gb_[0-9]+_', '')`
5. `listing` — DISTINCT ON (item_id): sku, title, main_image_url, listing_url, price from `listings.shopify_listings` WHERE channel='LEDSone', priority: all_list=1
6. `sales` — real_qty × real_price aggregated from `order_management.orders` JOIN `order_management.order_item_info`, filtered: sub_source_id=38 (UK), market_place='23', status='Completed', order_date in range

Final SELECT: LEFT JOINs listing and sales onto perf rows, ordered by spend DESC.

### Data sources summary

| Schema / Table | Purpose |
|---|---|
| `google_ads.campaigns` | Campaign metadata — name, account_id, budget, group_name, campaign_status |
| `google_ads.campaign_performance` | Daily campaign-level metrics — impressions, clicks, cost, conversions, conversion_value |
| `google_ads.product_performance` | Daily product-level metrics — same columns + product_item_id |
| `listings.shopify_listings` | Resolve Google Ads product_item_id → SKU, title, image, URL (channel='LEDSone') |
| `order_management.orders` | Shopify UK orders — sub_source_id=38, market_place='23', status='Completed' |
| `order_management.order_item_info` | Order line items — real_sku, real_qty, real_price |
| `public.admin_dm_campaign_products_snapshot` | Background snapshot table for All Time product view |
| `sales_cache.sync_history` / `sync_control` | ScheduledSnapshot logging — visible in SalesSyncMonitor |

Database connection: `get_business_conn()` from `backend/app/core/db.py`. Hard cap: 10 connections org-wide.

---

## 8. KPI Calculation Reference

### Campaigns tab — Totals and per-campaign rows

| Metric | Source field(s) | Formula | Notes |
|---|---|---|---|
| Impressions | `google_ads.campaign_performance.impressions` | SUM(impressions) across date range | bigint cast |
| Clicks | `google_ads.campaign_performance.clicks` | SUM(clicks) across date range | bigint cast |
| CTR | clicks, impressions | `(clicks / impressions) * 100`, rounded to 2dp | 0 if impressions=0 |
| Cost | `google_ads.campaign_performance.cost` | SUM(cost) | numeric, £ currency, _round2 |
| Conversions | `google_ads.campaign_performance.conversions` | SUM(conversions) | numeric, _round2 |
| Conv. Value | `google_ads.campaign_performance.conversion_value` | SUM(conversion_value) | Google's attributed value, £, _round2 |
| ROAS | cost, conversion_value | `(conversion_value / cost) * 100`, 2dp | null if cost=0; expressed as % not ratio |
| Budget | `google_ads.campaigns.budget` | Direct field | float, displayed as £X.XX/day |

**ROAS note:** ROAS here is `(conv_value / cost) * 100` expressed as a percentage (e.g. 500% = 5× return). Not a ratio.

### Products tab — per-product rows

| Metric | Source | Formula | Notes |
|---|---|---|---|
| Cost | `google_ads.product_performance.cost` | SUM(cost), date-filtered | £, _round2 |
| Clicks | `google_ads.product_performance.clicks` | SUM(clicks), date-filtered | bigint |
| Conv. Value (Google Ads) | `google_ads.product_performance.conversion_value` | SUM(conversion_value), date-filtered | Google's attributed value |
| ROAS | cost, conversion_value | `(conversion_value / cost) * 100` | null if cost=0 |
| Units Sold (Real, Shopify UK) | `order_management.order_item_info.real_qty` | SUM(real_qty) for resolved SKU, date-filtered | Completed orders only |
| Real Revenue (Shopify UK) | `order_item_info.real_price × real_qty` | SUM(real_price × real_qty) | Completed Shopify UK orders |
| Sales Gap | Real Revenue, Conv. Value | `Real Revenue − Google Conv. Value` | null if no Shopify revenue resolved |
| Days Live | `google_ads.product_performance.MIN(date)` (all-time) | `range_end − first_seen_date` | first_seen is NOT date-filtered; always all-time |
| CTR | clicks, impressions | `(clicks / impressions) * 100` | 0 if impressions=0 |

### Flag logic (`_flag_for`)

| Flag | Condition |
|---|---|
| `new` | days_live ≤ 30 AND impressions = 0 |
| `zeroimp` | (days_live > 30 OR days_live is None) AND impressions = 0 |
| `zeroclick` | impressions > 0 AND clicks = 0 |
| `zeroconv` | clicks > 0 AND conversions = 0 |
| `healthy` | clicks > 0 AND conversions > 0 |

---

## 9. Caching and Refresh Behaviour

**`ScheduledSnapshot` instance:** `product_snapshot` (line 366 in `dm_campaign.py`)
- `scope`: `"admin-dm-campaign-products"`
- `staff`: `"admin"`
- `tab`: `"dm-campaign-products"`
- `table_name`: `"public.admin_dm_campaign_products_snapshot"`
- `interval_hours`: 6 (every 6 hours)
- `compute_fn`: `_compute_product_performance("all", None, None)`

**Read flow (All Time):**
1. `product_snapshot.read()` reads latest JSON from `public.admin_dm_campaign_products_snapshot`
2. If available: returns immediately with `source='scheduled-sync'` and `syncedAt` timestamp
3. If missing (first run): computes live, writes to snapshot, returns with `syncedAt=None`

**Custom date range:** always computed live (no cache), `source='live-filtered'`

**Manual refresh:** POST `/products/sync/run-now` → `product_snapshot.run_sync(manual=True)` in background thread → frontend polls every 2s up to 300s

**Startup:** `start_snapshots()` in `main.py` on startup calls `product_snapshot.start()`. ScheduledSnapshot runs are staggered (60s apart) to avoid DB connection cap.

**Sync history:** All runs logged to `sales_cache.sync_history` / `sync_control` — visible in SalesSyncMonitor admin page.

---

## 10. Date Handling

- **Default mode:** `"all"` — full available date range (dataMin to dataMax from `google_ads.campaign_performance`)
- **Frontend date constraints:** `min` and `max` attributes on date inputs = `dataMin`/`dataMax` from API
- **Custom range validation (backend):** `_resolve_range()` clamps user start/end to actual data bounds; invalid/reversed ranges fall back to 90d default
- **`first_seen` for `days_live`:** NOT date-filtered — always queries the full `google_ads.product_performance` table history regardless of selected range. This means `days_live` always reflects total lifetime, not the filtered period.
- **Timezone:** dates stored as `date` type in Postgres (no timezone). No explicit timezone conversion observed in the backend. Sri Lanka TZ (Asia/Colombo) is used only by `ScheduledSnapshot` for run scheduling.
- **Currency:** All cost/revenue values are in GBP (£). `eur()` formatting helper name is misleading — it prefixes with `£`.

---

## 11. Dependencies and Regression Risks

### Pages sharing the same data sources

| Page | Shared source |
|---|---|
| Budget Alerts (`tools.AdminBudgetAlerts`) | Likely `google_ads.campaign_performance` — unconfirmed |
| Staff ID Performance (`tools.StaffIdPerformance`) | `order_management.orders` |
| Product Campaign Sales (`ProductCampaignSales.jsx`) | `google_ads.product_performance` |
| SalesSyncMonitor | `sales_cache.sync_history` / `sync_control` — reads DM campaign sync status |
| Thasitha Req4 (ShopifyVsAdsValue) | `order_management.orders` + Google Ads — same pattern noted in dm_campaign.py docstring |

### Shared components
- `DateRangeBar` — internal to `DmCampaign.jsx` (not shared globally)
- `FlagPill` — internal to `DmCampaign.jsx`
- `ProductDetailModal` — internal to `DmCampaign.jsx`
- `ScheduledSnapshot` — shared core framework, used by multiple pages

### Regression risks if this page is modified
1. **`product_snapshot` table** (`public.admin_dm_campaign_products_snapshot`) — schema change in `_compute_product_performance` would invalidate stale snapshots; old JSON may cause JSON parsing errors until snapshot refreshes.
2. **`PRODUCT_PERF_QUERY` CTE** — `first_seen` subquery scans full `google_ads.product_performance` regardless of date filter; a performance regression there affects All Time snapshot compute time (~10s).
3. **`listings.shopify_listings` resolution** — 73% match rate (15,742 / 21,492 distinct products). Changes to `item_id` column or channel filter would affect SKU/title/link resolution.
4. **`order_management.orders` filter** — `sub_source_id=38` + `market_place='23'` are hardcoded constants (not configurable). If UK's source ID changes, real revenue would silently zero out.
5. **`dm:session-expired` / `dm:server-unavailable` events** — dispatched by `apiFetch.js`; changing the global event names would break App.jsx's session handler.

### Existing tests
- No automated tests found for this page in `backend/app/tests/` — not verified whether any integration tests exist for `dm_campaign.py`. Manual testing only.

---

## 12. Known Issues and Unresolved Questions

| Issue | Type | Evidence |
|---|---|---|
| `eur()` formatter uses `£` symbol despite "eur" name | Minor (misleading name) | DmCampaign.jsx line 13 |
| `daily` array included in `/summary` response but not rendered in UI | Unused data transfer | CampaignsView never accesses `data.daily` |
| `days_live` not date-filtered — always shows full lifetime even on custom range | Behaviour — may confuse users | `first_seen` CTE has no date WHERE clause |
| No pagination on Campaigns tab — all campaigns returned | Acceptable (7 campaigns total) | Footnote confirms small dataset |
| Product ID URL resolution depends on `listings.shopify_listings` match rate (73%) | Data quality | dm_campaign.py lines 21–24 |
| ROAS formula expressed as % (e.g. 500%) not ratio (5×) — label says "ROAS" with no "%" unit shown in table header | Potential misread | DmCampaign.jsx line 219, pct() formatter |
| 6-hour snapshot may lag behind live spend by up to 6 hours on All Time view | Expected behaviour | Documented in footnote |
| `_resolve_range` falls back to "90d" for unrecognised mode strings — `"all"` is the only validated mode the frontend sends | Code path | dm_campaign.py line 96 |

---

## 13. Files to Inspect During Future Modification

| File | Purpose |
|---|---|
| `frontend/src/admin/pages/DmCampaign.jsx` | All UI, API calls, filters, pagination, modal |
| `backend/app/dashboard_pages/dm_campaign.py` | All routes, SQL queries, flag logic, snapshot config |
| `backend/app/core/scheduled_snapshot.py` | Snapshot framework — read/write/schedule |
| `backend/app/core/task_auth.py` | Auth dependency — `make_admin_task_auth` |
| `backend/app/core/db.py` | DB connection management (10-connection cap) |
| `backend/app/main.py` | Router registration (line 347), snapshot startup (line 492) |
| `frontend/src/taskRegistry.jsx` | toolKey registration (lines 343–353) |
| `frontend/src/admin/AdminLayout.jsx` | Nav entry (line 150), access control filter |
| `frontend/src/lib/apiFetch.js` | Auth fetch wrapper, session expiry events |
| `public.admin_dm_campaign_products_snapshot` | Snapshot table — Postgres |
| `sales_cache.sync_history` / `sync_control` | Sync log tables |

---

## 14. Recommended Next Steps (No Implementation)

1. **Verify `daily` array usage** — confirm whether any unreleased frontend feature or analytics query reads `data.daily` from `/summary`, or whether it can be safely removed to reduce response payload.
2. **Confirm `days_live` behaviour is intentional** — if users expect `days_live` to reflect only the custom date window, the `first_seen` CTE needs a date filter. Needs Piranav/GPT decision.
3. **ROAS unit clarity** — add "%" to the ROAS column header or change the formatter to display as a plain ratio (e.g. 5.00×) to avoid misreading. Needs Piranav approval.
4. **`eur()` naming** — rename to `gbp()` or `currency()` in a future pass (non-breaking, cosmetic).
5. **Add a test for `_compute_campaign_summary` and `_flag_for`** — these are pure logic functions, straightforward to unit-test.
6. **Live-verify snapshot content** — connect to local Postgres and `SELECT syncedAt, totalProducts FROM public.admin_dm_campaign_products_snapshot LIMIT 1` to confirm snapshot is populated and refresh is working.
7. **Confirm `sub_source_id=38` / `market_place='23'** map to correct Shopify UK store — check `order_management.orders` source table documentation or ask Kuberan.
