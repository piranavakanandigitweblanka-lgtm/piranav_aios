# Jakshan Dashboard

**File:** `pages/jakshan.html`
**Title:** Jackshan — Requirements 1 & 2 — GSC Analysis & SEO Tracker
**Store:** ledsone.co.uk
**Last updated:** 2026-07-23

---

## Purpose

GSC (Google Search Console) keyword analysis and SEO optimisation tracker for ledsone.co.uk. Two-tab dashboard: Requirement 1 shows keyword-level GSC performance per product, Requirement 2 is an SEO task tracker.

---

## Structure — 2 Tabs

| Tab | Requirement | Title |
|---|---|---|
| 1 | Req 1 | GSC Priority Keyword Analysis |
| 2 | Req 2 | SEO Optimization Tracker |

---

## Data Architecture

**Live API — date-range filtered**

Both tabs call `../api/jackshan/dashboard` with `type=req1` or `type=req2` and a date range or rolling days filter.

```javascript
// URL builder
buildApiUrl('req1', 'r1-days-filter', 'r1-from', 'r1-to')
// → /api/jackshan/dashboard?type=req1&from=YYYY-MM-DD&to=YYYY-MM-DD
// or
// → /api/jackshan/dashboard?type=req1&days=30
```

Both fetches run in parallel:
```javascript
Promise.all([fetch(url1), fetch(url2)])
```

---

## API Route — `/api/jackshan/dashboard.js`

### Req 1 — GSC Priority Keyword Analysis

**Source tables:**
```sql
-- Page-level GSC metrics
SELECT page, clicks, impressions, ctr, position
FROM google_search_console.page
WHERE sub_source = $1 AND search_type = 'web'
AND date BETWEEN $2 AND $3

-- Top query per page
SELECT DISTINCT ON (page) page, query, clicks, impressions, ctr, position
FROM google_search_console.query_page
WHERE sub_source = $1 AND search_type = 'web'
AND date BETWEEN $2 AND $3
ORDER BY page, clicks DESC
```

**Logic:**
- Matches GSC page URLs to a hardcoded priority product handle list in the API
- Returns GSC metrics (clicks, impressions, CTR, position) per product
- Identifies the top-performing keyword per product from query_page table

### Req 2 — SEO Optimization Tracker

Tracks SEO tasks per product (meta title, meta description, image alt text, schema, internal links). Status values: Done / In Progress / Pending.

---

## Tables Used

| Schema | Table | Purpose |
|---|---|---|
| `google_search_console` | `page` | Page-level clicks, impressions, CTR, position |
| `google_search_console` | `query_page` | Top keyword per page |

---

## Key Logic

- **Priority product list:** Hardcoded in `api/jackshan/dashboard.js` — a curated list of ledsone.co.uk product handles to track
- **Top keyword:** `DISTINCT ON (page) ORDER BY clicks DESC` — picks the highest-click query per URL
- **Date filter:** User selects rolling days (7/30/90) or custom date range — passed as query params
- **sub_source filter:** GSC data is filtered by sub_source to isolate ledsone.co.uk traffic

---

## Known Limitations

- Priority product list is hardcoded — requires manual update to add/remove products
- GSC data has ~3 day lag from Google
- Req 2 SEO tracker status is manually maintained — not auto-detected from live page data
