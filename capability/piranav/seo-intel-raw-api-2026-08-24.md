# Capability Record — SEO Intelligence Raw Data API

- **Title:** SEO Intelligence Raw Data API (`?service=raw`)
- **Date:** 2026-08-24
- **Member:** Piranav
- **Team:** SEO / Digital Marketing Intelligence
- **Requirement:** Expose row-level SEO data for `seo_intelligence_analyzer.py` Python script
- **Endpoint:** `GET /api/intel-api?service=raw` (session-auth required)
- **Production base:** `https://digital-marketing-member-pages.vercel.app`
- **Files Changed:** `Staff-requirements/api/intel-api.js`, `Staff-requirements/scripts/test-intel-raw.js` (new)
- **Data Sources:** Ledsone PostgreSQL (GSC tables), Neon PostgreSQL (SEMrush — best-effort)
- **Evidence:** `evidence/piranav/seo-intel-raw-api-2026-08-24.md`
- **Validation:** `validation/piranav/seo-intel-raw-api-2026-08-24.md`
- **Implementation:** `implementation/piranav/seo-intel-raw-api-2026-08-24.md`
- **Status:** NOT CLOSED (local syntax PASS; production deployment NOT verified — no push performed)

---

## Purpose

The existing `/api/intel-api.js` dashboard returns aggregated KPI data. The Python analyzer `seo_intelligence_analyzer.py` requires row-level raw data: keyword comparisons, landing page comparisons, and index coverage snapshots. This capability adds `?service=raw` to the existing endpoint — no new Vercel function file needed (already at 12-function Hobby plan limit).

---

## Response Structure

```json
{
  "ok": true,
  "generated_at": "<ISO timestamp>",
  "periods": {
    "cur_from": "YYYY-MM-DD", "cur_to": "YYYY-MM-DD",
    "prv_from": "YYYY-MM-DD", "prv_to": "YYYY-MM-DD"
  },
  "data_freshness": {
    "gsc_latest_date": "YYYY-MM-DD",
    "semrush_latest_ingest": "YYYY-MM-DD or null"
  },
  "keywords": [ { "query", "page", "position", "prior_position", "impressions", "prior_impressions", "clicks", "prior_clicks", "ctr", "date" } ],
  "landing_pages": [ { "page", "clicks", "prior_clicks", "position", "prior_position" } ],
  "index_coverage": [ { "date", "indexed", "total_products" } ]
}
```

`index_coverage` returns two monthly snapshots (current + prior month).

---

## Data Sources & Database Tables

| Section | Table | DB | Columns Used |
|---|---|---|---|
| data_freshness (GSC) | `google_search_console.overview` | `DATABASE_URL` | `date`, `sub_source`, `search_type` |
| data_freshness (SEMrush) | `semrush_keywords` | `semrush` / `NEON_DATABASE_URL` | `snapshot_date` |
| keywords (current) | `google_search_console.query` | `DATABASE_URL` | `query`, `date`, `position`, `clicks`, `impressions`, `ctr`, `sub_source`, `search_type` |
| keywords (prior) | `google_search_console.query` | `DATABASE_URL` | same columns |
| keywords page | `google_search_console.query_page` | `DATABASE_URL` | `query`, `page`, `date`, `clicks`, `sub_source`, `search_type` |
| landing_pages (current) | `google_search_console.page` | `DATABASE_URL` | `page`, `date`, `clicks`, `position`, `sub_source`, `search_type` |
| landing_pages (prior) | `google_search_console.page` | `DATABASE_URL` | same columns |
| index_coverage (indexed) | `google_search_console.page` | `DATABASE_URL` | `page`, `date`, `sub_source`, `search_type` |
| index_coverage (total) | `listings.shopify_listings` | `DATABASE_URL` | `sub_source`, `is_parent` |

`sub_source = 104` (ledsone.co.uk GSC account constant, same as existing dashboard).

---

## Field Mapping

```
google_search_console.query.query              → keywords.query
google_search_console.query_page.page          → keywords.page (top page by clicks)
AVG(google_search_console.query.position)      → keywords.position
AVG(prior period query.position)               → keywords.prior_position
SUM(google_search_console.query.impressions)   → keywords.impressions
SUM(prior period query.impressions)            → keywords.prior_impressions
SUM(google_search_console.query.clicks)        → keywords.clicks
SUM(prior period query.clicks)                 → keywords.prior_clicks
SUM(clicks)/SUM(impressions)*100               → keywords.ctr
current period cur_to date                     → keywords.date

google_search_console.page.page                → landing_pages.page
SUM(page.clicks) current period               → landing_pages.clicks
SUM(page.clicks) prior period                 → landing_pages.prior_clicks
AVG(page.position) current period             → landing_pages.position
AVG(page.position) prior period               → landing_pages.prior_position

DATE_TRUNC('month', page.date)                → index_coverage.date
COUNT(DISTINCT page.page) per month           → index_coverage.indexed
COUNT(*) FROM listings.shopify_listings       → index_coverage.total_products
```

---

## Period Logic

Anchor = MAX(date) from `google_search_console.query WHERE sub_source=104`.
- Current: anchor-29 days → anchor
- Prior: anchor-59 days → anchor-30 days
(Same 30d/30d pattern used by existing dashboard `handleActionPriorities` and `handleKwMovers`.)

---

## Authentication

Session-auth required (HMAC-SHA256 `dm_session` cookie, `SESSION_SECRET` env var).
Returns HTTP 401 if no valid session. Same verification logic as `api/staff-id-performance.js`.
Existing `/api/intel-api?service=seo|germany|organic` are NOT modified — no auth added to those.

---

## Limitations

- `semrush_latest_ingest` returns `null` if `semrush` / `NEON_DATABASE_URL` env var is unset or the DB is unreachable — not a failure condition.
- `keywords.page` is `null` for keywords not found in `query_page` table.
- `prior_position`, `prior_clicks`, `prior_impressions` are `null` for keywords with no data in the prior 30-day window.
- `index_coverage.total_products` is a current-snapshot count from `listings.shopify_listings` — not historical per month.
- `seo_intelligence_analyzer.py` was NOT found in the repository at implementation time. Field structure was derived from the GPT-authored requirement spec.

---

## Security

- No credentials in response.
- No wildcard CORS override (inherits existing intel-api.js `Access-Control-Allow-Origin: *` — this is a pre-existing condition not introduced by this capability; session auth is the effective access control).
- DB is read-only queries only. No DDL, no writes.
- `SESSION_SECRET` only used for HMAC verify; never returned.
