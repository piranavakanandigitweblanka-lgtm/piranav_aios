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
