# Implementation Record — SEO Intelligence Raw Data API

- **Date:** 2026-08-24
- **Member:** Piranav
- **Requirement:** Add `?service=raw` to `/api/intel-api.js` for Python analyzer
- **Status:** Local PASS — DEPLOYMENT: NOT VERIFIED (no git push performed)

---

## Function Limit Decision

Vercel Hobby plan: 12-function ceiling.

Existing top-level `api/*.js` files counted:
1. assign-order.js
2. auth.js
3. generate-staff-attribution.js
4. intel-api.js
5. members-api.js
6. muguntha.js
7. requirement.js
8. sales.js
9. sales25.js
10. salesde25.js
11. salesuk.js
12. staff-id-performance.js

**Already at 12.** Adding a new `api/intel-raw.js` would exceed the limit. Implementation added as `?service=raw` inside existing `intel-api.js` instead.

---

## Files Changed

### `Staff-requirements/api/intel-api.js`

**Changes (additive only — no existing code modified):**

1. Line 1 comment updated: `seo|germany|organic` → `seo|germany|organic|raw`
2. `const crypto = require('crypto');` added after line 7 (needed for session HMAC verify)
3. Two new functions added before `// MAIN ROUTER` section:
   - `_rawParseCookies(req)` — parses cookie header
   - `_rawVerifySession(req)` — HMAC-SHA256 verify of `dm_session` cookie using `SESSION_SECRET`
   - `handleRaw(req, res)` — main raw data handler (~160 lines)
4. Main router: added `if (service === 'raw') return handleRaw(req, res);`
5. Main router error message updated to include `raw`

**All existing service handlers (`handleSEO`, `handleGermany`, `handleOrganic`) and their sub-handlers are UNCHANGED.**

### `Staff-requirements/scripts/test-intel-raw.js` (new)

Validation script:
- Checks file exists
- Verifies `require()` succeeds and exports a function
- Contains schema validator function `validateRawResponse(body)`
- Attempts HTTP GET to `localhost:3000/api/intel-api?service=raw` (skips gracefully if not running)
- Expects HTTP 401 in test env (no session cookie) or 200 with valid schema

---

## SQL Queries (new, read-only)

### data_freshness — GSC
```sql
SELECT MAX(date)::text AS gsc_latest_date
FROM google_search_console.overview
WHERE sub_source = 104 AND search_type = 'web'
```

### data_freshness — SEMrush (separate Neon DB, best-effort)
```sql
SELECT MAX(snapshot_date)::text AS d FROM semrush_keywords
```

### keywords — current period (30d)
```sql
SELECT query,
  ROUND(AVG(position)::numeric, 2) AS position,
  SUM(clicks)::int AS clicks, SUM(impressions)::int AS impressions,
  ROUND((SUM(clicks)::numeric / NULLIF(SUM(impressions),0))*100, 3) AS ctr
FROM google_search_console.query
WHERE sub_source=104 AND search_type='web' AND date BETWEEN $cur_from AND $cur_to
GROUP BY query ORDER BY SUM(clicks) DESC LIMIT 500
```

### keywords — prior period (prev 30d)
```sql
SELECT query,
  ROUND(AVG(position)::numeric,2) AS prior_position,
  SUM(clicks)::int AS prior_clicks, SUM(impressions)::int AS prior_impressions
FROM google_search_console.query
WHERE sub_source=104 AND search_type='web' AND date BETWEEN $prv_from AND $prv_to
GROUP BY query
```

### keywords — top page (from query_page)
```sql
WITH ranked AS (
  SELECT qp.query, qp.page,
    ROW_NUMBER() OVER (PARTITION BY qp.query ORDER BY SUM(qp.clicks) DESC) AS rn
  FROM google_search_console.query_page qp
  WHERE qp.sub_source=104 AND qp.search_type='web' AND qp.date BETWEEN $cur_from AND $cur_to
  GROUP BY qp.query, qp.page
)
SELECT query, page FROM ranked WHERE rn=1
```

### landing_pages — current / prior (same tables, page-level)
```sql
SELECT page, SUM(clicks)::int AS clicks, ROUND(AVG(position)::numeric,1) AS position
FROM google_search_console.page
WHERE sub_source=104 AND search_type='web' AND date BETWEEN $X AND $Y
GROUP BY page ORDER BY SUM(clicks) DESC LIMIT 200
```

### index_coverage — two monthly snapshots
```sql
SELECT DATE_TRUNC('month', date)::date AS month, COUNT(DISTINCT page)::int AS indexed
FROM google_search_console.page
WHERE sub_source=104 AND search_type='web'
  AND date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC LIMIT 2
```

### index_coverage — total products (current snapshot)
```sql
SELECT COUNT(*)::int AS total_products
FROM listings.shopify_listings
WHERE sub_source=104 AND is_parent=1
```

---

## Backward Compatibility Verification

- `?service=seo` — router unchanged; `handleSEO` unchanged
- `?service=germany` — router unchanged; `handleGermany` unchanged
- `?service=organic` — router unchanged; `handleOrganic` unchanged
- All existing sub-handlers, SQL queries, response shapes: unchanged
- `node --check api/intel-api.js` → SYNTAX OK
- `node scripts/test-intel-raw.js` → PASS (file check + require check)
