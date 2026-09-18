# Capability: GSC Live Sync (Full 100% GSC API Data)

**Created:** 2026-09-18
**Project:** dm-dashboard
**Category:** SEO / Data Pipeline

## What This Does

Pulls full Google Search Console data (100%, not 50%-sampled) directly from the GSC API into the business DB via a daily background sync. Replaces the old `google_search_console.*` pipeline tables with fresh `gsc_live.*` tables.

## How It Works

**Sync script:** `dm-dashboard/backend/app/gsc_live_sync.py`
- Site: `sc-domain:ledsone.co.uk`
- Auth: `GSC_SERVICE_ACCOUNT_KEY` (same service account already used)
- 4 dimension sets pulled: date only, date+page, date+query, date+page+query
- Upsert into: `gsc_live.uk_overview`, `gsc_live.uk_page`, `gsc_live.uk_query`, `gsc_live.uk_page_query`
- Full mode (16 months): runs once on startup if no prior sync exists
- Incremental mode (3 days): runs daily at 6am via APScheduler

**Entry point:** `start_gsc_sync_scheduler()` — called from `main.py` `_start_background_sync`

**SEO Intelligence reads from:** `gsc_live.*` tables — all endpoints in `seo_intelligence.py`

## How to Reuse / Extend

- To add a new site (e.g. ledsone.de), add a new SITE_URL constant and a separate set of `gsc_live.de_*` tables
- To trigger a manual backfill: call `run_sync(full=True)` from a Python shell or add a one-off admin endpoint
- To query sync history: `SELECT * FROM gsc_live.sync_log ORDER BY synced_at DESC LIMIT 20`

## Key Constraints
- GSC API lags ~1 day — sync targets `date.today() - 1` as end date
- `query_gsc()` pages 25,000 rows/batch — large date ranges take 30-120s
- Thread-locked — only one sync runs at a time (prevents double-writes)
- Fails gracefully — `GoogleNotConfigured` skips sync without crashing app
