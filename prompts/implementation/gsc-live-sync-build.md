# Prompt: GSC Live Sync — Replace Sampled Pipeline with Full GSC API Data

**Registered:** 2026-09-18
**Status:** ACTIVE
**Category:** implementation

## What This Builds

Replace the 50%-sampled `google_search_console.*` DB pipeline used by SEO Intelligence with full 100% data pulled directly from the Google Search Console API via the existing `query_gsc()` client.

## 3 Parts

### Part 1 — Daily Sync Script (gsc_live_sync.py)
- Calls `query_gsc("sc-domain:ledsone.co.uk", ...)` for 3 dimension sets:
  - `["date"]` → daily overview (clicks, impressions, ctr, position)
  - `["page"]` → per-page aggregates
  - `["query"]` → per-keyword aggregates
  - `["page", "query"]` → page+keyword pairs
- Writes to `gsc_live` schema tables in business DB
- Uses CREATE TABLE IF NOT EXISTS + upsert (ON CONFLICT DO UPDATE)
- Syncs last 16 months of data on first run, last 3 days on subsequent runs

### Part 2 — Scheduler
- APScheduler background job in main.py — runs daily at 6am
- Also runs once on startup (if last sync > 24h ago)

### Part 3 — seo_intelligence.py Switch
- Replace `google_search_console.overview/query/page` → `gsc_live.uk_*` tables
- Remove `data_note: "clicks ≈ 50%"` warnings
- Keep same response shape so frontend needs no changes

## Key Facts
- Site URL: `sc-domain:ledsone.co.uk` (confirmed from kamsi.py + dilaksi.py)
- Auth: `GSC_SERVICE_ACCOUNT_KEY` env var — already set and working
- `query_gsc()` is in `google_client.py` — paginated, 25k rows/batch
- Business DB connection: `get_business_conn()`
- sub_source for UK in old pipeline: 234 (check before switching)
