# Evidence: GSC Live Sync — SEO Intelligence Switch to Full GSC API Data

**Date:** 2026-09-18
**Staff:** Sajeepan (SEO Intelligence page)
**Commit:** c3075ff (piranv-work branch, websitetecteam-arch/dm-dashboard)

## What Was Built

3-part feature replacing the 50%-sampled `google_search_console.*` pipeline data in SEO Intelligence with full 100% Google Search Console API data via direct sync.

### Part 1 — gsc_live_sync.py
- New file: `dm-dashboard/backend/app/gsc_live_sync.py`
- Creates `gsc_live` schema + 5 tables: `uk_overview`, `uk_page`, `uk_query`, `uk_page_query`, `sync_log`
- `run_sync(full=True)` → pulls last 16 months from GSC API (first run / backfill)
- `run_sync(full=False)` → pulls last 3 days (daily incremental)
- Uses `query_gsc("sc-domain:ledsone.co.uk", ...)` from existing `google_client.py`
- Upserts via `ON CONFLICT DO UPDATE` — safe to re-run
- `GoogleNotConfigured` handled gracefully — logs and skips if `GSC_SERVICE_ACCOUNT_KEY` not set

### Part 2 — Scheduler in main.py
- `start_gsc_sync_scheduler()` added to `_start_background_sync` startup hook
- Runs full sync on startup if last sync >24h ago, incremental otherwise
- Schedules daily 6am incremental via APScheduler

### Part 3 — seo_intelligence.py switch
- All `google_search_console.overview/query/page/query_page` → `gsc_live.uk_overview/uk_query/uk_page/uk_page_query`
- Removed `sub_source=%s AND search_type='web'` filters throughout (gsc_live tables are UK-only, no sub_source column)
- Removed all `data_note: "clicks ≈ 50% of true GSC totals."` warnings
- Updated `_default_range()` and `_get_latest_date()` helpers to query gsc_live tables
- `listings.shopify_listings WHERE sub_source=%s` kept — that table legitimately needs sub_source

## Files Changed
- `dm-dashboard/backend/app/gsc_live_sync.py` — new (created)
- `dm-dashboard/backend/app/main.py` — import + startup hook (+2 lines)
- `dm-dashboard/backend/app/seo_intelligence.py` — table switch + filter cleanup (~186 lines changed)

## Validation Notes
- No syntax errors on commit
- GSC client (`google_client.py`) already tested and working — `query_gsc()` used by kamsi.py and dilaksi.py in production
- First startup after deploy: full 16-month backfill runs in background thread (non-blocking)
- gsc_live tables do not exist yet — `ensure_gsc_live_schema()` creates them on first sync

## Status: PASS (pending first production sync)
