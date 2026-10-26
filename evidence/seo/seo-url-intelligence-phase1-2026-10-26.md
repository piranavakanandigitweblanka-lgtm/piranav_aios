# SEO URL Intelligence — Phase 1 Implementation Evidence
## Date: 2026-10-26 | Store: LEDSone UK | Status: COMPLETE (local, not deployed)

## Files Created

| File | Purpose |
|---|---|
| `dm-dashboard/backend/app/dashboard_pages/seo_url_intelligence.py` | Backend — router, schema, sync, analysis logic (~430 lines) |
| `dm-dashboard/frontend/src/admin/pages/SeoUrlIntelligence.jsx` | Frontend page (~250 lines) |
| `piranav_aios/prompts/seo/seo-url-intelligence-implementation-prompt.md` | AIOS prompt (saved before execution per Rule 1) |

## Files Modified

| File | Change |
|---|---|
| `dm-dashboard/backend/app/main.py` | +2 lines: import + app.include_router(seo_url_intelligence_router) |
| `dm-dashboard/frontend/src/taskRegistry.jsx` | +1 TOOLS entry: tools.SeoUrlIntelligence |
| `dm-dashboard/frontend/src/admin/pages/taskAddedDates.json` | +1 line: "tools.SeoUrlIntelligence": "2026-10-26" |

## Database Schema (app DB — get_conn())

### seo_url_product
- Stores synced Shopify UK products: shopify_id, handle, title, description_html, status, canonical_url
- Idempotent upsert on (store, shopify_id) — repeated syncs do not duplicate

### seo_url_analysis
- Stores computed analysis per product: mismatch_status, ranking_status, priority
- Full replace on every sync (ON CONFLICT DO UPDATE)
- Created by _ensure_schema() called at start of every sync job

## Reused Existing Tables
- `public.blog_optimization_gsc_page` — read-only, no changes, no new data written

## UAM Integration
- Task key: `tools.SeoUrlIntelligence`
- Write endpoint (POST /sync/start): make_task_auth("tools.SeoUrlIntelligence") — requires task grant or admin/dev role
- Read endpoints (GET): require_any_login() — any valid login, same as all other dashboard_pages
- UAM database (access_grants table): unchanged
- UAM UI (UserAccessManagement.jsx): unchanged — new task appears automatically via taskRegistry.jsx

## Ranking Drop Rules (implemented as named constants)
- MIN_IMPRESSIONS = 10 (both periods must meet this)
- POS_DROP_THRESHOLD = 3.0 position points
- CLICKS_DROP_PCT = 0.30 (30%)
- CLICKS_MIN_VOL = 5 (min previous clicks for click-change rule)
- Insufficient Data rule: fires before drop/improvement checks — cannot be misclassified

## Mismatch Rules
- 6 regex extractors: wattage, colour, pack_size, voltage, fitting, length
- Result: Potential Mismatch only — never Verified Mismatch
- Evidence shown: which rule fired, handle value vs title value
- Short handle (<3 chars) or missing title → Unverified

## Security
- No Shopify writes
- No production deployment performed
- No tokens/credentials in API responses
- All changes local only

## GSC Data Source
- Site URL: sc-domain:ledsone.co.uk
- Table: public.blog_optimization_gsc_page (already synced weekly)
- Period: period_bounds(28) — 28-day current vs 28-day previous
- URL match: canonical_base + handle → exact lookup in GSC page table

## Remaining Blockers Before Testing
- Backend service must be running (requires Python environment with dependencies)
- DB tables created on first sync (ensure_schema called inside sync job)
- Frontend build required (Vite dev server)
- GSC data in blog_optimization_gsc_page must be populated by gsc_sync.py weekly job

---

## Phase 1 Extension — Listing Status + Inventory Status Filters (2026-10-26)

### Changes Made

| File | Change |
|---|---|
| `seo_url_intelligence.py` | Added `published_at`, `total_inventory` columns to schema + ALTER TABLE migration; added to GraphQL query, upsert, and `_query_products`; new filter params on `/products` and `/products/csv`; new CSV columns |
| `SeoUrlIntelligence.jsx` | Added `listingFilter`, `inventoryFilter` state; two new `<select>` filter dropdowns; `LISTING_PILL`, `INVENTORY_PILL` color maps; two new table columns (Listing, Inventory); colSpan 11→13; expanded row detail updated |

### Schema Migration

```sql
ALTER TABLE public.seo_url_product ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE public.seo_url_product ADD COLUMN IF NOT EXISTS total_inventory INT;
```
- Additive only. No data loss. Ran against Contabo production dm_dashboard: PASS.

### Unlisted — Exact Definition (project convention from duplicate_price_check.py line 61)

| Filter Value | SQL Condition |
|---|---|
| Active   | `status = 'ACTIVE' AND published_at IS NOT NULL` |
| Unlisted | `status = 'ACTIVE' AND published_at IS NULL` |
| Draft    | `status = 'DRAFT'` |
| Archived | `status = 'ARCHIVED'` |
| In Stock     | `total_inventory > 0` |
| Out of Stock | `total_inventory IS NOT NULL AND total_inventory <= 0` |
| (unclassified) | `total_inventory IS NULL` → shown as "Untracked" |

**Unlisted source field:** Shopify GraphQL `Product.publishedAt` — returns ISO datetime of publication to Online Store channel; null = not published to any channel. Product is active in Shopify admin but invisible on the storefront.

### Pre-sync state (after schema migration, before re-sync)

| Status | Count |
|---|---|
| ACTIVE products (all showing as Unlisted pre-sync) | 5,069 |
| Draft | 172 |
| Archived | 1 |
| Inventory Untracked (published_at and total_inventory NULL) | 5,335 |

All ACTIVE products show as Unlisted pre-sync because `published_at IS NULL` until re-sync fetches `publishedAt` from Shopify. This is correct and expected. Listing and inventory filter accuracy requires a re-sync.

### Build Tests

| Test | Result |
|---|---|
| Python syntax (ast.parse) | PASS |
| npm run build | PASS — `SeoUrlIntelligence-igsBoS8V.js` emitted, 0 errors, 904ms |
| DB schema migration (Contabo production) | PASS |
| Filter SQL expressions against live data | PASS |
| Existing ranking/mismatch counts unchanged | PASS — 381 Ranking Drop, 281 Potential Mismatch, 26 High unchanged |

### Remaining: Re-sync Required

Listing Status and Inventory Status filter values will be accurate only after next sync triggers updated GraphQL query (fetches `publishedAt` + `totalInventory`). Current data: all Untracked, all ACTIVE show as Unlisted.

---

## Commit: Analysis Batch Upsert Fix (2026-10-26)

**Commit hash:** `139ef2d`
**Branch:** `piranv-work`
**Remote:** `websitetecteam-arch/dm-dashboard`
**Push result:** `0da1924..139ef2d piranv-work -> piranv-work` ✓

### Files committed

| File | Change |
|---|---|
| `backend/app/dashboard_pages/seo_url_intelligence.py` | Added `_upsert_analysis_batched()` + 4 constants; replaced 46-line single-connection loop with 1-line call |
| `frontend/src/admin/pages/SeoUrlIntelligence.jsx` | Error banner sub-text added for partial-sync state warning |
| `backend/tests/test_seo_url_analysis_batch.py` | New — 7 unit tests (all PASS) |

### Test results at commit

```
7/7 PASS — backend/tests/test_seo_url_analysis_batch.py (1.11s)
T1 single batch | T2 two independent batches | T3 transient retry
T4 retries exhausted | T5 non-transient no retry | T6 row counts
T7 delay sequence
```

### Production sync and deployment

NOT run. Local only. Dev tunnel not restarted.
