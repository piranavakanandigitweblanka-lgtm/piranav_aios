# Evidence Record — SEO Intelligence Raw Data API

- **Date:** 2026-08-24
- **Member:** Piranav
- **Requirement:** `?service=raw` endpoint on `/api/intel-api.js`

---

## Files Inspected

| File | Purpose |
|---|---|
| `Staff-requirements/api/intel-api.js` | Existing intel endpoint — full read (1533 lines) |
| `Staff-requirements/vercel.json` | Function list + timeouts — confirmed 11 entries + intel-api.js = 12 |
| `Staff-requirements/.vercel/project.json` | Project: `digital-marketing-member-pages`, orgId confirmed |
| `Staff-requirements/api/staff-id-performance.js` | Source of `verifySession` pattern (lines 44–58) |
| `Staff-requirements/api/auth.js` | Confirmed COOKIE_NAME, SESSION_SECRET, parseCookies pattern |
| `Staff-requirements/.env.local` | Env var NAMES inspected (values not logged): `DATABASE_URL`, `SESSION_SECRET`, `semrush`, `NEON_DATABASE_URL`, `AUTH_DATABASE_URL` |
| `Staff-requirements/ARCHITECTURE.md` | Confirmed 12-function Hobby plan limit |
| `Staff-requirements/DASHBOARD-EXPLAINER.md` | Confirmed GSC_SUB_SOURCE usage, data sources |

---

## Tables Confirmed in intel-api.js SQL

| Table | Schema | Confirmed columns |
|---|---|---|
| `google_search_console.overview` | business DB | `date`, `sub_source`, `search_type`, `clicks`, `impressions`, `position` |
| `google_search_console.query` | business DB | `query`, `date`, `sub_source`, `search_type`, `clicks`, `impressions`, `position`, `ctr` |
| `google_search_console.page` | business DB | `page`, `date`, `sub_source`, `search_type`, `clicks`, `impressions`, `position` |
| `google_search_console.query_page` | business DB | `query`, `page`, `date`, `sub_source`, `search_type`, `clicks` |
| `listings.shopify_listings` | business DB | `sub_source`, `is_parent`, `shopify_handle`, `title` |
| `semrush_keywords` | Neon SEMrush DB | `keyword`, `position`, `prev_position`, `volume`, `cpc`, `url`, `traffic`, `keyword_difficulty`, `intent`, `snapshot_date` |

All column names above are directly sourced from SQL queries in `intel-api.js` — not invented.

---

## Key Decisions with Evidence

**Decision: `?service=raw` inside intel-api.js, not a new file**
Evidence: `find Staff-requirements/api -maxdepth 1 -name "*.js"` returned exactly 12 files. Vercel Hobby plan ceiling is 12 functions (confirmed ARCHITECTURE.md §5.5). Creating a 13th file would break deployment.

**Decision: session auth on raw endpoint only**
Evidence: intel-api.js lines 1522–1533 — existing `seo|germany|organic` services have no auth. The raw endpoint adds auth without disturbing existing consumers.

**Decision: GSC_SUB_SOURCE = 104**
Evidence: intel-api.js line 14: `const GSC_SUB_SOURCE = 104;`

**Decision: semrush client uses `process.env.semrush || process.env.NEON_DATABASE_URL`**
Evidence: intel-api.js lines 784, 880 confirm this fallback chain.

**Decision: `query_page` table available for keyword→page mapping**
Evidence: intel-api.js lines 193, 256, 693 use `google_search_console.query_page` with columns `query`, `page`, `date`, `clicks`, `sub_source`, `search_type`.

---

## Python Analyzer Status

`seo_intelligence_analyzer.py` was searched across all of `C:\Users\PC\Documents\piranav_aios\` — **NOT FOUND**. Field structure implemented from GPT requirement spec only.

---

## Syntax Test Evidence

```
> node --check api/intel-api.js
SYNTAX OK

> node scripts/test-intel-raw.js
PASS  file exists: ...api/intel-api.js
PASS  module.exports is a function
Attempting live endpoint test: http://localhost:3000/api/intel-api?service=raw
INFO  No local server running — live test skipped (expected in CI)

> node --check scripts/test-intel-raw.js
SYNTAX OK
```

---

## Representative Response Shape (design-time, not live)

```json
{
  "ok": true,
  "generated_at": "2026-08-24T10:00:00.000Z",
  "periods": {
    "cur_from": "2026-07-25", "cur_to": "2026-08-23",
    "prv_from": "2026-06-25", "prv_to": "2026-07-24"
  },
  "data_freshness": {
    "gsc_latest_date": "2026-08-23",
    "semrush_latest_ingest": "2026-08-17"
  },
  "keywords": [
    {
      "query": "led strip lights",
      "page": "https://ledsone.co.uk/products/...",
      "position": 4.3,
      "prior_position": 5.1,
      "impressions": 8200,
      "prior_impressions": 7900,
      "clicks": 312,
      "prior_clicks": 290,
      "ctr": 3.805,
      "date": "2026-08-23"
    }
  ],
  "landing_pages": [
    {
      "page": "https://ledsone.co.uk/",
      "clicks": 820,
      "prior_clicks": 791,
      "position": 3.2,
      "prior_position": 3.5
    }
  ],
  "index_coverage": [
    { "date": "2026-08-01", "indexed": 2140, "total_products": 2380 },
    { "date": "2026-07-01", "indexed": 2098, "total_products": 2380 }
  ]
}
```
*Values above are illustrative only — actual values come from live DB query.*

---

## Deployment

- **Platform:** Vercel (`digital-marketing-member-pages` project)
- **Production URL:** `https://digital-marketing-member-pages.vercel.app/api/intel-api?service=raw`
- **Status:** DEPLOYMENT: NOT VERIFIED — git push not performed
- **Auto-deploy trigger:** Push to `main` branch → GitHub Actions → Vercel deploy hook
