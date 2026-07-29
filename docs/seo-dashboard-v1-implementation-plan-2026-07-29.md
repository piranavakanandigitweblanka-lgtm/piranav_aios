# AIOS Organic SEO Intelligence Dashboard — V1 Implementation Plan
**Date:** 2026-07-29  
**Status:** AWAITING APPROVAL — Do not build until approved  
**Preceding work:** Historical Discovery → Master Dataset → Intelligence Report  

---

## Pre-Build Repository Audit

Before planning anything, the following existing assets were reviewed:

| Asset | Location | Reuse Decision |
|-------|----------|---------------|
| CSS design system (variables, card, kpi, nav-btn, tbox, badge, table) | `Staff-requirements-02/assets/css/style.css` + inline styles in pages | **REUSE DIRECTLY** — copy variable set, extend with SEO-specific tokens |
| Germany dashboard (masthead, topbar, alert, section-title, chart-panel) | `Staff-requirements-02/germany-sales-decline-dashboard/index.html` | **REUSE PATTERN** — most advanced visual design in the project |
| Sonya dashboard (tab navigation, KPI cards, filter controls, table, pagination) | `Staff-requirements-02/pages/sonya.html` | **REUSE PATTERN** — most complete interactive dashboard |
| API pattern (pg client, makeClient, errResponse, type routing, cache headers) | `Staff-requirements-02/api/sonya/dashboard.js` | **REUSE VERBATIM** — copy boilerplate, adapt SQL |
| GSC SQL patterns (query, query_page, page tables with sub_source filter) | `Staff-requirements-02/api/jackshan/dashboard.js` | **REUSE VERBATIM** — proven SQL for GSC schema |
| Architecture documentation | `docs/live-dashboard-architecture.md` | **FOLLOW** — all conventions apply |
| Vercel config + package.json | `Staff-requirements-02/vercel.json`, `package.json` | **NO CHANGES NEEDED** — existing config supports new API files |
| Master SEO dataset (37 months) | `docs/seo-master-dataset-ledsone-2026-07-29.csv` | **HARDCODE in frontend** — historical SEMrush data served as JS array |

### What is NOT being duplicated
- No new CSS framework
- No React or component library
- No new database connection pattern
- No new Vercel project — deploys into existing `Staff-requirements-02` deployment
- No new `package.json` or `vercel.json`

---

## 1. Dashboard Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│  Browser  pages/seo.html                                          │
│  6 tab panels, lazy-loaded, vanilla JS                            │
│  • Hardcoded: 37-month SEMrush trend array (static, no API call)  │
│  • Live:      5 panels call /api/seo/* for PostgreSQL data        │
└─────────────┬──────────────────────────────────────────────────────┘
              │ HTTP GET /api/seo/{endpoint}?type={view}&from=&to=
              ▼
┌───────────────────────────────────────────────────────────────────┐
│  Vercel Serverless  api/seo/*.js  (Node.js, pg library)           │
│  executive.js  keywords.js  products.js  landing-pages.js         │
│  technical.js  actions.js                                         │
└─────────────┬──────────────────────────────────────────────────────┘
              │ SQL over TCP
              ▼
┌───────────────────────────────────────────────────────────────────┐
│  PostgreSQL  207.148.78.148:5432  db: ledsone  user: dbhub_readonly│
│  google_search_console.{overview,query,query_page,page,device}    │
│  google_ads.{campaign_performance,product_performance,campaigns}  │
│  google_ads.{merchant_products,campaign_search_term_data}         │
│  listings.{shopify_listings,shopify_listing_meta}                 │
└───────────────────────────────────────────────────────────────────┘
```

### Key Constants
| Constant | Value | Source |
|----------|-------|--------|
| `GSC_SUB_SOURCE` | `104` | Established in Jackshan API, confirmed in audit |
| `GSC_SEARCH_TYPE` | `'web'` | All existing GSC queries filter this |
| `ADS_ACCOUNT_ID` | `4503486236` | LEDSone UK account confirmed in audit |
| `GSC_SITE_URL` | `'ledsone.co.uk'` | Appears in `site_url LIKE '%ledsone.co.uk%'` |

### Data Availability Mapping (Honest)

| Dashboard Page | Primary Source | Available Since | Gap |
|----------------|---------------|----------------|-----|
| Executive — live KPIs | GSC overview | Mar 2026 (5 months) | Pre-Mar 2026 = SEMrush estimates only |
| Executive — 37-month trend | Master dataset CSV (hardcoded) | Jul 2023 | Static; updates monthly |
| Keyword Intelligence | GSC query + query_page | Mar 2026 | No historical keyword positions pre-Mar 2026 |
| Product Intelligence | GSC page + shopify_listings | Mar 2026 | No organic revenue (GA4 limited) |
| Landing Page Intelligence | GSC page + query_page | Mar 2026 | No backlinks, no CWV in DB |
| Technical SEO | GSC device + appearance | Mar 2026 | CWV/404/crawl not in PostgreSQL → placeholder sections |
| Action Centre | Derived from all above | Mar 2026 | Actions quality limited by data depth |

**Placeholder policy:** Every section without data shows a clearly labelled "Connect Data Source" card — never empty space or fake data.

---

## 2. Folder Structure

```
Staff-requirements-02/
├── pages/
│   └── seo.html                        ← SINGLE HTML FILE, 6 tab panels
│
├── api/
│   └── seo/
│       ├── executive.js                ← ?type=overview|trend|kpi|ads-overlay
│       ├── keywords.js                 ← ?type=top|opportunity|rising|declining
│       ├── products.js                 ← ?type=all|single
│       ├── landing-pages.js            ← ?type=all|single
│       ├── technical.js                ← ?type=coverage|device|search-appearance
│       └── actions.js                  ← ?type=all  (derives from all sources)
│
└── docs/
    └── seo-dashboard-v1-implementation-plan-2026-07-29.md  ← this file
```

### Files being created (6 new)
- `pages/seo.html`
- `api/seo/executive.js`
- `api/seo/keywords.js`
- `api/seo/products.js`
- `api/seo/landing-pages.js`
- `api/seo/technical.js`
- `api/seo/actions.js`

### Files being modified (1)
- `Staff-requirements-02/index.html` — add SEO dashboard card to the directory

### Files NOT modified
- All existing member dashboards
- `vercel.json`, `package.json`, `assets/css/style.css`, `assets/js/main.js`

---

## 3. Required APIs

### 3a. `api/seo/executive.js`

**Purpose:** Powers the Executive Dashboard tab. Provides live KPIs, MoM/QoQ/YoY deltas, and chart data.

| Query Param `?type=` | What it returns |
|---------------------|-----------------|
| `overview` | Monthly GSC totals for all available months (Mar–Jul 2026). One row per month with clicks, impressions, CTR, avg_position. |
| `kpi` | Current month vs prior month vs same month last year: clicks Δ, impressions Δ, position Δ, CTR Δ. Also best month, worst month, biggest MoM win. |
| `device` | GSC device split for current month: desktop/mobile/tablet clicks + impressions. |
| `ads-overlay` | Ads campaign totals for last 6 months (LEDSone UK account): cost, conv_value, ROAS. Used to show organic vs paid relationship. |
| `position-dist` | Count of queries by position bucket: 1–3, 4–10, 11–20, 21–50, 51–100 from current month's query table. |

**Cache:** `s-maxage=600, stale-while-revalidate=300` (10 minutes — GSC data refreshes daily)

---

### 3b. `api/seo/keywords.js`

**Purpose:** Powers the Keyword Intelligence tab. Returns keyword-level data with position change, opportunity scoring.

| Query Param `?type=` | What it returns |
|---------------------|-----------------|
| `top` | Top 500 keywords by clicks from GSC query table. Columns: query, clicks, impressions, CTR, avg_position, landing page (from query_page join), date range. With `?from=&to=` date range support. |
| `opportunity` | Keywords ranking position 4–20 with ≥100 impressions, ordered by impressions DESC. These are the highest-leverage ranking improvement targets. |
| `rising` | Keywords where position improved comparing last 30 days vs prior 30 days (self-join on query table). Minimum 10 impressions in both periods. |
| `declining` | Keywords where position worsened comparing last 30 days vs prior 30 days. Minimum 10 impressions in both periods. |
| `by-page` | Given `?page=URL`, returns all queries associated with that landing page, ordered by clicks DESC. |

**Filters supported:** `?from=`, `?to=`, `?device=`, `?country=`

**Cache:** `s-maxage=600, stale-while-revalidate=300`

---

### 3c. `api/seo/products.js`

**Purpose:** Powers the Product Intelligence tab. Joins GSC page data with Shopify listings metadata.

| Query Param `?type=` | What it returns |
|---------------------|-----------------|
| `all` | All product pages (URLs matching `/products/`) from GSC page table. Joins to `listings.shopify_listings` (sub_source=104) and `listings.shopify_listing_meta` for title, meta description. Includes: page URL, title, GSC clicks, impressions, CTR, avg_position, top keyword (from query_page), opportunity_score. |
| `single` | Given `?handle=`, returns full detail for one product: all time-series data, all associated keywords, position trend. |

**Opportunity Score formula (computed in API, not SQL):**
```
score = 0
if position <= 3:   score += 0
elif position <= 10: score += 40
elif position <= 20: score += 70
elif position <= 50: score += 50
else:               score += 20

score += min(impressions / 100, 30)         # up to 30 points for volume
score -= min(ctr_pct * 10, 20)             # subtract for already-good CTR
score = max(0, min(100, round(score)))
```

**Priority mapping:**
- Score 80-100 → `Critical`
- Score 60-79  → `High`
- Score 40-59  → `Medium`
- Score 0-39   → `Low`

**Cache:** `s-maxage=600, stale-while-revalidate=300`

---

### 3d. `api/seo/landing-pages.js`

**Purpose:** Powers the Landing Page Intelligence tab. All pages (not just products) from GSC.

| Query Param `?type=` | What it returns |
|---------------------|-----------------|
| `all` | All pages from GSC page table (sub_source=104, search_type='web'), aggregated over current month. Ordered by clicks DESC. Columns: page, clicks, impressions, ctr, avg_position, keyword_count (from query_page distinct queries), top_keyword, opportunity_score. |
| `trending` | Pages with the biggest click improvement vs prior 30 days. |
| `declining` | Pages with the biggest click decline vs prior 30 days. |
| `zero-click` | Pages with impressions ≥ 50 but zero clicks. Priority pages for CTR improvement. |

**Cache:** `s-maxage=600, stale-while-revalidate=300`

---

### 3e. `api/seo/technical.js`

**Purpose:** Powers the Technical SEO tab. Shows available index and search appearance signals.

| Query Param `?type=` | What it returns |
|---------------------|-----------------|
| `coverage` | Count of distinct pages indexed (from GSC page table), by month. Shows indexing trend over available months. |
| `device` | Clicks + impressions + CTR + position by device (desktop/mobile/tablet) for current month. |
| `countries` | Top 20 countries by clicks from GSC country table, current month. |
| `search-appearance` | Data from GSC appearance table (will return empty flag if no data — confirmed empty in audit). |
| `query-stats` | Distinct query count by month (proxy for keyword footprint growth). |

**Sections with no data (clearly labelled as PLACEHOLDER):**
- Core Web Vitals → "Connect Google PageSpeed Insights API"
- Broken Links / 404s → "Connect Screaming Frog or GSC Coverage API"
- XML Sitemap → "Connect GSC Sitemaps API"
- Schema Markup → "Connect Structured Data Testing API"
- JavaScript SEO → "Connect Lighthouse API"

**Cache:** `s-maxage=1800, stale-while-revalidate=600` (30 minutes — changes rarely)

---

### 3f. `api/seo/actions.js`

**Purpose:** Powers the Action Centre tab. Derives actionable items from all data sources. This is the most important page — every item has business evidence.

| Query Param `?type=` | What it returns |
|---------------------|-----------------|
| `all` | Full action list, sorted by priority + estimated revenue impact. Each action includes: id, category, problem, evidence, business_impact, seo_impact, revenue_impact_est, priority, effort, expected_roi, recommended_fix, validation_method, status, owner_suggestion. |

**Action categories generated from available data:**

| Category | Trigger Condition | Action Generated |
|----------|-----------------|-----------------|
| `CTR_BOOST` | Impressions ≥ 200, CTR < 0.2%, position ≤ 10 | Improve title + meta description |
| `POSITION_PUSH` | Position 4–7, impressions ≥ 100 | Top-10 → top-3 push opportunity |
| `PAGE_2_RESCUE` | Position 11–15, impressions ≥ 200 | Page 2 → Page 1 opportunity |
| `IMPRESSION_LOST` | Month-over-month impressions decline > 20% | Investigate SERP feature displacement |
| `ZERO_CLICK` | Impressions ≥ 100, clicks = 0 | Intent mismatch or snippet not compelling |
| `DECLINING_PAGE` | Page clicks fell > 30% vs prior period | Content freshness or ranking drop |
| `PRODUCT_NO_GSC` | Product page in Shopify but zero GSC impressions | Indexing or crawl issue |

Revenue impact estimation formula:
```
est_monthly_clicks_if_fixed = impressions × target_ctr_for_position
avg_order_value = £45 (from intelligence report: conv_value / conversions ≈ £38–45)
organic_cr = 0.006 (6 per 1000 clicks — from GA4 data: 1933 purchases / 31919 sessions)
revenue_impact_est = (est_monthly_clicks_if_fixed - current_clicks) × organic_cr × avg_order_value
```

**Status values:** `Open` | `In Progress` | `Done` | `Won't Fix`  
**Owner suggestions:** Generated from category type (Content team, Dev team, SEO team)

**Cache:** `s-maxage=300, stale-while-revalidate=60` (5 minutes — most volatile)

---

## 4. Required SQL

### SQL-1: GSC Monthly Summary (executive.js — ?type=overview)
```sql
SELECT
  DATE_TRUNC('month', date)::date               AS month,
  COUNT(DISTINCT date)::int                     AS days_with_data,
  SUM(clicks)::int                              AS total_clicks,
  SUM(impressions)::int                         AS total_impressions,
  ROUND((SUM(clicks)::numeric / NULLIF(SUM(impressions),0)) * 100, 4) AS ctr_pct,
  ROUND(AVG(position)::numeric, 2)              AS avg_position
FROM google_search_console.overview
WHERE sub_source = $1
  AND search_type = 'web'
GROUP BY DATE_TRUNC('month', date)
ORDER BY month ASC
```
Params: `[$GSC_SUB_SOURCE]`

---

### SQL-2: Current Month vs Prior Month KPIs (executive.js — ?type=kpi)
```sql
WITH monthly AS (
  SELECT
    DATE_TRUNC('month', date)::date AS month,
    SUM(clicks)::int               AS clicks,
    SUM(impressions)::int          AS impressions,
    ROUND((SUM(clicks)::numeric / NULLIF(SUM(impressions),0)) * 100, 4) AS ctr_pct,
    ROUND(AVG(position)::numeric, 2) AS avg_position
  FROM google_search_console.overview
  WHERE sub_source = $1 AND search_type = 'web'
  GROUP BY DATE_TRUNC('month', date)
)
SELECT
  cur.month                    AS current_month,
  cur.clicks                   AS cur_clicks,
  cur.impressions              AS cur_impressions,
  cur.ctr_pct                  AS cur_ctr,
  cur.avg_position             AS cur_position,
  prv.clicks                   AS prv_clicks,
  prv.impressions              AS prv_impressions,
  prv.ctr_pct                  AS prv_ctr,
  prv.avg_position             AS prv_position
FROM monthly cur
LEFT JOIN monthly prv ON prv.month = (cur.month - INTERVAL '1 month')::date
WHERE cur.month = DATE_TRUNC('month', (
  SELECT MAX(date) FROM google_search_console.overview WHERE sub_source = $1
))
```
Params: `[$GSC_SUB_SOURCE]`  
Note: MoM delta computed in JS: `((cur - prv) / prv * 100).toFixed(1)`

---

### SQL-3: Position Distribution (executive.js — ?type=position-dist)
```sql
SELECT
  CASE
    WHEN position <= 3   THEN 'pos_1_3'
    WHEN position <= 10  THEN 'pos_4_10'
    WHEN position <= 20  THEN 'pos_11_20'
    WHEN position <= 50  THEN 'pos_21_50'
    ELSE                      'pos_51_100'
  END                              AS bucket,
  COUNT(DISTINCT query)::int       AS query_count,
  SUM(clicks)::int                 AS clicks,
  SUM(impressions)::int            AS impressions
FROM google_search_console.query
WHERE sub_source = $1
  AND search_type = 'web'
  AND date BETWEEN $2 AND $3
GROUP BY bucket
ORDER BY MIN(position)
```
Params: `[$GSC_SUB_SOURCE, $from_date, $to_date]`

---

### SQL-4: Top Keywords (keywords.js — ?type=top)
```sql
SELECT
  q.query,
  SUM(q.clicks)::int                                        AS clicks,
  SUM(q.impressions)::int                                   AS impressions,
  ROUND((SUM(q.clicks)::numeric / NULLIF(SUM(q.impressions),0)) * 100, 3) AS ctr_pct,
  ROUND(AVG(q.position)::numeric, 1)                        AS avg_position,
  (SELECT qp.page
   FROM google_search_console.query_page qp
   WHERE qp.query = q.query AND qp.sub_source = $1 AND qp.search_type = 'web'
     AND qp.date BETWEEN $2 AND $3
   GROUP BY qp.page ORDER BY SUM(qp.clicks) DESC LIMIT 1)  AS top_landing_page
FROM google_search_console.query q
WHERE q.sub_source = $1
  AND q.search_type = 'web'
  AND q.date BETWEEN $2 AND $3
GROUP BY q.query
ORDER BY clicks DESC
LIMIT 500
```
Params: `[$GSC_SUB_SOURCE, $from_date, $to_date]`

---

### SQL-5: Opportunity Keywords (keywords.js — ?type=opportunity)
```sql
SELECT
  query,
  SUM(clicks)::int                                             AS clicks,
  SUM(impressions)::int                                        AS impressions,
  ROUND((SUM(clicks)::numeric / NULLIF(SUM(impressions),0)) * 100, 3) AS ctr_pct,
  ROUND(AVG(position)::numeric, 1)                             AS avg_position
FROM google_search_console.query
WHERE sub_source = $1
  AND search_type = 'web'
  AND date BETWEEN $2 AND $3
GROUP BY query
HAVING AVG(position) BETWEEN 4 AND 20
   AND SUM(impressions) >= 50
ORDER BY SUM(impressions) DESC
LIMIT 200
```
Params: `[$GSC_SUB_SOURCE, $from_date, $to_date]`

Opportunity score computed in JS after fetch (same formula as product score).

---

### SQL-6: Rising and Declining Keywords (keywords.js — ?type=rising / declining)
```sql
WITH current_period AS (
  SELECT query,
    ROUND(AVG(position)::numeric, 1) AS cur_pos,
    SUM(clicks)::int                 AS cur_clicks,
    SUM(impressions)::int            AS cur_imp
  FROM google_search_console.query
  WHERE sub_source = $1 AND search_type = 'web'
    AND date BETWEEN $2 AND $3
  GROUP BY query
  HAVING SUM(impressions) >= 10
),
prior_period AS (
  SELECT query,
    ROUND(AVG(position)::numeric, 1) AS prv_pos,
    SUM(clicks)::int                 AS prv_clicks,
    SUM(impressions)::int            AS prv_imp
  FROM google_search_console.query
  WHERE sub_source = $1 AND search_type = 'web'
    AND date BETWEEN $4 AND $5
  GROUP BY query
  HAVING SUM(impressions) >= 10
)
SELECT
  c.query,
  c.cur_pos,
  p.prv_pos,
  ROUND((p.prv_pos - c.cur_pos)::numeric, 1) AS position_change,
  c.cur_clicks,
  c.cur_imp,
  c.cur_imp - p.prv_imp AS imp_change
FROM current_period c
JOIN prior_period p ON p.query = c.query
WHERE (p.prv_pos - c.cur_pos) {DIRECTION_CONDITION}
ORDER BY ABS(p.prv_pos - c.cur_pos) DESC
LIMIT 100
```
`{DIRECTION_CONDITION}` = `> 0.5` for rising, `< -0.5` for declining.  
Params: `[$GSC_SUB_SOURCE, $cur_from, $cur_to, $prv_from, $prv_to]`

---

### SQL-7: Product Pages (products.js — ?type=all)
```sql
SELECT
  p.page,
  SUM(p.clicks)::int                                              AS clicks,
  SUM(p.impressions)::int                                         AS impressions,
  ROUND((SUM(p.clicks)::numeric / NULLIF(SUM(p.impressions),0)) * 100, 3) AS ctr_pct,
  ROUND(AVG(p.position)::numeric, 1)                              AS avg_position,
  COUNT(DISTINCT p.date)::int                                     AS days_with_data,
  sl.title                                                        AS product_title,
  sl.shopify_handle                                               AS handle,
  m.title_tag                                                     AS meta_title,
  m.description_tag                                               AS meta_desc
FROM google_search_console.page p
LEFT JOIN listings.shopify_listings sl
  ON sl.sub_source = $1
  AND sl.is_parent = 1
  AND p.page ILIKE '%/products/' || sl.shopify_handle
LEFT JOIN listings.shopify_listing_meta m
  ON m.product_id = sl.item_id::bigint
WHERE p.sub_source = $1
  AND p.search_type = 'web'
  AND p.page ILIKE '%ledsone.co.uk/products/%'
  AND p.date BETWEEN $2 AND $3
GROUP BY p.page, sl.title, sl.shopify_handle, m.title_tag, m.description_tag
ORDER BY clicks DESC
LIMIT 1000
```
Params: `[$GSC_SUB_SOURCE, $from_date, $to_date]`

Top keyword per product added via secondary query on `query_page` table (same pattern as Jackshan API — proven).

---

### SQL-8: All Landing Pages (landing-pages.js — ?type=all)
```sql
SELECT
  p.page,
  SUM(p.clicks)::int                                              AS clicks,
  SUM(p.impressions)::int                                         AS impressions,
  ROUND((SUM(p.clicks)::numeric / NULLIF(SUM(p.impressions),0)) * 100, 3) AS ctr_pct,
  ROUND(AVG(p.position)::numeric, 1)                              AS avg_position,
  (SELECT COUNT(DISTINCT qp.query)
   FROM google_search_console.query_page qp
   WHERE qp.page = p.page AND qp.sub_source = $1 AND qp.search_type = 'web'
     AND qp.date BETWEEN $2 AND $3)::int                          AS keyword_count
FROM google_search_console.page p
WHERE p.sub_source = $1
  AND p.search_type = 'web'
  AND p.date BETWEEN $2 AND $3
GROUP BY p.page
ORDER BY clicks DESC
LIMIT 2000
```
Params: `[$GSC_SUB_SOURCE, $from_date, $to_date]`

---

### SQL-9: Index Coverage Over Time (technical.js — ?type=coverage)
```sql
SELECT
  DATE_TRUNC('month', date)::date AS month,
  COUNT(DISTINCT page)::int       AS distinct_pages_indexed,
  COUNT(DISTINCT date)::int       AS days_with_data
FROM google_search_console.page
WHERE sub_source = $1
  AND search_type = 'web'
GROUP BY DATE_TRUNC('month', date)
ORDER BY month ASC
```
Params: `[$GSC_SUB_SOURCE]`

---

### SQL-10: Device Split (technical.js — ?type=device)
```sql
SELECT
  device,
  SUM(clicks)::int                                              AS clicks,
  SUM(impressions)::int                                         AS impressions,
  ROUND((SUM(clicks)::numeric / NULLIF(SUM(impressions),0)) * 100, 3) AS ctr_pct,
  ROUND(AVG(position)::numeric, 1)                              AS avg_position
FROM google_search_console.device
WHERE sub_source = $1
  AND search_type = 'web'
  AND date BETWEEN $2 AND $3
GROUP BY device
ORDER BY clicks DESC
```
Params: `[$GSC_SUB_SOURCE, $from_date, $to_date]`

---

### SQL-11: Top Countries (technical.js — ?type=countries)
```sql
SELECT
  country,
  SUM(clicks)::int       AS clicks,
  SUM(impressions)::int  AS impressions,
  ROUND(AVG(position)::numeric, 1) AS avg_position
FROM google_search_console.country
WHERE sub_source = $1
  AND search_type = 'web'
  AND date BETWEEN $2 AND $3
GROUP BY country
ORDER BY clicks DESC
LIMIT 20
```
Params: `[$GSC_SUB_SOURCE, $from_date, $to_date]`

---

### SQL-12: Action Centre Data Gathering (actions.js — ?type=all)

This API runs three SQL queries in parallel, then derives actions in JavaScript:

**Query A — High-impression, low-CTR keywords (CTR_BOOST + ZERO_CLICK actions):**
```sql
SELECT query,
  SUM(clicks)::int                AS clicks,
  SUM(impressions)::int           AS impressions,
  ROUND(AVG(position)::numeric,1) AS avg_position,
  ROUND((SUM(clicks)::numeric / NULLIF(SUM(impressions),0)) * 100, 4) AS ctr_pct
FROM google_search_console.query
WHERE sub_source = $1 AND search_type = 'web'
  AND date BETWEEN $2 AND $3
GROUP BY query
HAVING SUM(impressions) >= 50
ORDER BY SUM(impressions) DESC
LIMIT 500
```

**Query B — Page MoM comparison (DECLINING_PAGE + IMPRESSION_LOST actions):**
```sql
WITH cur AS (
  SELECT page, SUM(clicks)::int AS clicks, SUM(impressions)::int AS imp
  FROM google_search_console.page
  WHERE sub_source = $1 AND search_type = 'web' AND date BETWEEN $2 AND $3
  GROUP BY page
),
prv AS (
  SELECT page, SUM(clicks)::int AS clicks, SUM(impressions)::int AS imp
  FROM google_search_console.page
  WHERE sub_source = $1 AND search_type = 'web' AND date BETWEEN $4 AND $5
  GROUP BY page
)
SELECT c.page,
  c.clicks AS cur_clicks, p.clicks AS prv_clicks,
  c.imp AS cur_imp,       p.imp AS prv_imp,
  ROUND(((c.clicks - p.clicks)::numeric / NULLIF(p.clicks,0)) * 100, 1) AS click_chg_pct,
  ROUND(((c.imp - p.imp)::numeric / NULLIF(p.imp,0)) * 100, 1) AS imp_chg_pct
FROM cur c
JOIN prv p ON p.page = c.page
WHERE p.clicks > 0
  AND ((c.clicks - p.clicks)::numeric / NULLIF(p.clicks,0)) < -0.3
ORDER BY click_chg_pct ASC
LIMIT 50
```

**Query C — Position 4-10 keywords with high impressions (POSITION_PUSH actions):**
Same as SQL-5 but limited to position 4–10 bucket.

Actions array is built in JavaScript, sorted by `revenue_impact_est` DESC, and returned as a single `actions[]` array.

---

## 5. HTML Page Structure — `pages/seo.html`

### Single-file, 6-tab architecture (matching Sonya pattern)

```
<head>
  CSS (reuse all variables + patterns from sonya.html + germany dashboard)
  New SEO-specific CSS:
    .trend-up   (green arrow badge)
    .trend-down (red arrow badge)
    .trend-flat (grey — badge)
    .opp-bar    (horizontal opportunity score bar)
    .pos-badge  (position number with color coding 1–3/4–10/11–20/21+)
    .sparkline  (small inline SVG for 37-month trend)
    .kpi-delta  (MoM/QoQ/YoY change sub-line on KPI cards)
    .placeholder-section (greyed-out card for missing data)
    .action-card (full-width action item with all 11 fields)
</head>

<body>
  <!-- Top accent bar (reuse Germany topbar) -->
  <div class="topbar"></div>

  <!-- Masthead (reuse Germany masthead pattern) -->
  <header class="masthead">
    Mark: SE (SEO logo mark)
    Kicker: "AIOS Intelligence · LEDSone Organic SEO"
    Title: "Organic SEO Intelligence Dashboard"
    Lede: "North Star: Organic Sessions · Sources: GSC, Google Ads, SEMrush (37-month) · Data to: 2026-07-26"
    Stats: [5 Months GSC | 37 Months Trend | 6 Pages]
  </header>

  <!-- Tab Navigation (reuse Sonya nav-btn pattern) -->
  <nav class="top-nav">
    [Executive] [Keywords] [Products] [Landing Pages] [Technical SEO] [Action Centre]
    [↻ Refresh button]
  </nav>

  <!-- PANEL 1: Executive Dashboard -->
  <div id="panel-1" class="tab-panel active">
    ROW 1: 6 KPI cards (Clicks | Impressions | Avg Position | CTR | Indexed Pages | Top-3 KWs)
           Each card shows: value, MoM Δ badge, QoQ Δ badge
    ROW 2: 37-Month Trend Chart (Chart.js line, data hardcoded from master dataset)
           — SEMrush traffic estimate (orange dashed)
           — GSC actual clicks (blue solid, only last 5 months)
           — Vertical markers: May 2024 crash, Aug 2025 peak, Apr 2026 inflection
    ROW 3: 2-panel row
           LEFT:  Position Distribution donut chart (GSC query data)
           RIGHT: MoM delta table (current vs prior month, 6 KPIs, Δ value, Δ %)
    ROW 4: Biggest Winner | Biggest Loser | Highest Opportunity (3 cards, from action engine)
    ROW 5: Organic vs Paid Overlay bar chart (Ads cost vs GSC clicks, last 6 months)
  </div>

  <!-- PANEL 2: Keyword Intelligence -->
  <div id="panel-2" class="tab-panel">
    Controls: [Date Range] [Intent filter] [Device filter] [Country filter] [Search box] [Export CSV]
    Tabs-within-tab: [Top Keywords] [Opportunities] [Rising] [Declining]
    Table: query | position | pos Δ | clicks | impressions | CTR | landing page | opp score | priority | action
    Sortable columns. Paginated (50 per page). Row click → expands to show all associated pages.
  </div>

  <!-- PANEL 3: Product Intelligence -->
  <div id="panel-3" class="tab-panel">
    Controls: [Date Range] [Sort by] [Search by product name] [Export]
    Summary bar: {N} products tracked | Avg position | Total clicks | Best performer | Worst performer
    Table: product | organic clicks | impressions | CTR | avg position | top keyword | opp score | priority | action
    Revenue/Orders: grayed-out columns labelled "GA4 not connected"
    AI Readiness: placeholder column labelled "Manual audit required"
    Row click → expands to show all keywords for that product
  </div>

  <!-- PANEL 4: Landing Page Intelligence -->
  <div id="panel-4" class="tab-panel">
    Controls: [Date Range] [Page type filter: /products/ | /collections/ | /pages/ | /blogs/ | Other]
    Tabs-within-tab: [All Pages] [Declining] [Zero-Click Opportunities]
    Table: page URL | clicks | impressions | CTR | avg position | keyword count | top keyword | opp score
    Grayed columns with "Not connected" label: Internal Links | Backlinks | Content Score
  </div>

  <!-- PANEL 5: Technical SEO -->
  <div id="panel-5" class="tab-panel">
    Section 1: INDEX COVERAGE (live — SQL-9)
      Chart: distinct pages indexed per month (bar chart, May 2026 = 18,270 pages)
      KPIs: Total Pages | MoM Change | YoY Change

    Section 2: DEVICE SPLIT (live — SQL-10)
      Bar chart: desktop/mobile/tablet clicks + impressions
      KPIs: Mobile share %, Desktop share %

    Section 3: GEOGRAPHIC REACH (live — SQL-11)
      Table: country | clicks | impressions | position

    Section 4: SEARCH APPEARANCE (live — returns empty, shows data status)
      Alert: "Appearance data table is empty — no search feature impressions recorded in pipeline"

    Sections 5–9: PLACEHOLDER CARDS (clearly labelled)
      - Core Web Vitals: "Connect PageSpeed Insights API"
      - Broken Links / 404s: "Connect Screaming Frog or Search Console Coverage API"
      - XML Sitemap: "Connect GSC Sitemaps API"
      - Schema Markup: "Connect Structured Data Testing"
      - JavaScript SEO: "Connect Lighthouse API"
  </div>

  <!-- PANEL 6: Action Centre -->
  <div id="panel-6" class="tab-panel">
    Summary bar: {N} open actions | Est. total revenue impact: £{X}/month | {N} Critical | {N} High
    Filters: [All] [Critical] [High] [Medium] [Category filter] [Status filter]
    Sort: [Revenue Impact ↓] [Priority] [Effort]
    
    For each action — full-width card:
      Red/orange/yellow priority pill | Category badge
      PROBLEM: one sentence
      EVIDENCE: specific data (query name, click count, position, decline %)
      BUSINESS IMPACT: customer-facing explanation
      SEO IMPACT: technical explanation
      REVENUE IMPACT: £/month estimate with formula shown
      PRIORITY: Critical / High / Medium / Low
      EFFORT: Hours estimate
      EXPECTED ROI: £ per hour of effort
      RECOMMENDED FIX: specific instruction
      VALIDATION METHOD: how to confirm fix worked
      STATUS: [Open ▼] dropdown
      OWNER: suggested team
  </div>

  <script>
    // Constants
    const GSC_SUB_SOURCE = 104;

    // 37-month SEMrush data (hardcoded from master dataset CSV)
    const SEMRUSH_TREND = [
      {m:'2023-07', rank:150410, kw:3838, top3:35, traffic:1871},
      // ... all 36 months ...
    ];

    // Tab state
    var SEO_LOADED = {exec:false, kw:false, prod:false, lp:false, tech:false, act:false};

    // Shared fetch utilities (same pattern as Sonya)
    function seoFetch(endpoint, params) { ... }
    function seoState(panelId, state, msg) { ... }
    function seoHide(panelId) { ... }

    // Executive tab
    function loadExec() { ... }
    function renderExecKPIs(data) { ... }
    function renderTrendChart(gscData) { ... }  // merges hardcoded SEMrush + live GSC

    // Keyword tab
    function loadKeywords(type) { ... }
    function renderKeywords(rows) { ... }
    function calcOpportunityScore(pos, imp, ctr) { ... }

    // Product tab
    function loadProducts() { ... }
    function renderProducts(rows) { ... }

    // Landing page tab
    function loadLandingPages(type) { ... }
    function renderLandingPages(rows) { ... }

    // Technical tab
    function loadTechnical(type) { ... }
    function renderTechnical(data) { ... }

    // Action centre tab
    function loadActions() { ... }
    function renderActions(actions) { ... }

    // Tab switching (same showTab pattern as Sonya)
    function showTab(n) { ... }

    // Sort + filter (same in-memory pattern as Sonya — no re-fetch)
    function filterKeywords(query) { ... }
    function sortKeywords(col) { ... }

    // Global refresh
    function globalRefresh() { ... }

    // Init: load exec tab on page load
    document.addEventListener('DOMContentLoaded', function() {
      loadExec();
    });
  </script>
</body>
```

---

## 6. Component Structure

All components reused from existing codebase with zero modification to existing files.

| Component | CSS Class(es) | Source | Used In |
|-----------|--------------|--------|---------|
| Top accent bar | `.topbar` | Germany dashboard | seo.html masthead |
| Page masthead | `.masthead .inner .mark .headtxt .statrow .stat` | Germany dashboard | seo.html top |
| Section label | `.section-title` | Germany dashboard | All panels |
| Tab navigation | `.top-nav .nav-btn .nav-btn.active` | Sonya dashboard | All panel navigation |
| KPI card | `.kpi .lbl .val .note` | Sonya dashboard | Executive panel |
| Status badge | `.badge .badge-best .badge-bad .badge-ok` | Sonya dashboard | All tables |
| Table wrapper | `.tbox .tbar .scroll table thead tbody` | Sonya dashboard | All table panels |
| Filter controls | `.controls .srch .fsel .fbtn .fbtn.on` | Sonya dashboard | Keywords, Products |
| Alert box | `.alert` | Germany dashboard | Data limitation notices |
| Loading state | `.placeholder .ph-icon` | Sonya dashboard | Lazy-load states |
| Export button | `.exp` | Sonya dashboard | All tables |
| Chart wrapper | `.chart-panel .chart-card .chart-wrap` | Germany dashboard | Executive charts |

**New CSS-only additions to `seo.html` (no modification to shared files):**

```css
/* Position badges */
.pos-1-3  { background:#dcfce7; color:#14532d; }   /* green */
.pos-4-10 { background:#dbeafe; color:#1e3a8a; }   /* blue */
.pos-11-20{ background:#fef9c3; color:#713f12; }   /* amber */
.pos-21p  { background:#f3f4f6; color:#6b7280; }   /* grey */

/* Trend arrows */
.trend-up   { color:#059669; }  /* ▲ */
.trend-down { color:#dc2626; }  /* ▼ */
.trend-flat { color:#6b7280; }  /* — */

/* Opportunity score bar */
.opp-bar { height:6px; border-radius:3px; background:#e5e7eb; }
.opp-bar-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,#3b82f6,#8b5cf6); }

/* KPI delta sub-line */
.kpi-delta { font-size:11px; margin-top:3px; font-weight:600; }

/* Placeholder section */
.placeholder-section { background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px;
  padding:28px; text-align:center; color:#94a3b8; }

/* Action card */
.action-card { background:#fff; border:1px solid var(--line); border-radius:14px; 
  padding:20px 24px; margin-bottom:12px; }
.action-field-label { font-size:10px; font-weight:700; text-transform:uppercase; 
  letter-spacing:.8px; color:#94a3b8; margin-top:12px; margin-bottom:3px; }
.action-field-value { font-size:13px; color:#1a2233; line-height:1.5; }

/* 37-month sparkline annotation */
.chart-annotation { position:absolute; border-left:1px dashed #94a3b8; 
  height:100%; pointer-events:none; }
```

---

## 7. Database Mapping

| Dashboard Widget | DB Schema | DB Table | Key Columns | Filter |
|-----------------|-----------|----------|-------------|--------|
| Organic Clicks KPI | google_search_console | overview | clicks, date | sub_source=104, search_type='web' |
| Impressions KPI | google_search_console | overview | impressions, date | sub_source=104 |
| Avg Position KPI | google_search_console | overview | position, date | sub_source=104 |
| CTR KPI | google_search_console | overview | clicks, impressions | sub_source=104 |
| Position Distribution chart | google_search_console | query | query, position, date | sub_source=104 |
| Indexed Pages count | google_search_console | page | page, date | sub_source=104 |
| Device split | google_search_console | device | device, clicks, impressions | sub_source=104 |
| Country reach | google_search_console | country | country, clicks | sub_source=104 |
| Keyword table | google_search_console | query | query, clicks, impressions, position | sub_source=104 |
| Keyword → Landing Page | google_search_console | query_page | query, page | sub_source=104 |
| Product page GSC data | google_search_console | page | page (ILIKE /products/) | sub_source=104 |
| Product metadata | listings | shopify_listings | title, shopify_handle | sub_source=104, is_parent=1 |
| Product meta title/desc | listings | shopify_listing_meta | title_tag, description_tag | via item_id |
| Ads cost overlay | google_ads | campaign_performance | cost, date | account_id=4503486236 |
| Ads ROAS overlay | google_ads | campaign_performance | cost, conversion_value | account_id=4503486236 |
| Action Centre inputs | All above | Multiple | Derived | All |
| 37-month trend chart | (hardcoded) | master dataset CSV | semrush_traffic_est, month | Static JS array |

**Tables confirmed to have data for ledsone.co.uk (sub_source=104):**
- `google_search_console.overview` ✓ (Mar–Jul 2026)
- `google_search_console.query` ✓ (Mar–Jul 2026)
- `google_search_console.query_page` ✓ (Mar–Jul 2026)
- `google_search_console.page` ✓ (Mar–Jul 2026)
- `google_search_console.device` ✓ (Mar–Jul 2026)
- `google_search_console.country` ✓ (Mar–Jul 2026)
- `google_search_console.appearance` ✗ (empty — confirmed in audit)
- `listings.shopify_listings` ✓ (confirmed via Jackshan API)
- `listings.shopify_listing_meta` ✓ (confirmed via Jackshan API)
- `google_ads.campaign_performance` ✓ (37 months — account_id 4503486236)

---

## 8. Build Plan

### Phase 0 — Configuration (0 new files, 30 minutes)
- [ ] Confirm DATABASE_URL env var is set in Vercel project for Staff-requirements-02
- [ ] Confirm `api/seo/` path will be auto-recognised by Vercel (no config change needed — existing `vercel.json` covers `api/**/*.js`)
- [ ] Confirm `GSC_SUB_SOURCE = 104` by running SQL: `SELECT DISTINCT sub_source FROM google_search_console.overview LIMIT 10` via MCP

### Phase 1 — Executive Dashboard (Priority 1 — delivers North Star KPI immediately)
- [ ] `api/seo/executive.js` — implement SQL-1, SQL-2, SQL-3, SQL-4 (ads overlay)
- [ ] `pages/seo.html` — build masthead, nav, Panel 1 only (other panels as stubs)
- [ ] Wire 37-month SEMrush hardcoded array from master dataset
- [ ] Render KPI cards, trend chart, position distribution, MoM delta table
- [ ] Test: open `/pages/seo.html` locally via Vercel dev
- [ ] Deploy: `git push` → Vercel auto-deploys

### Phase 2 — Keyword Intelligence (Priority 2 — highest decision-making value)
- [ ] `api/seo/keywords.js` — implement SQL-5, SQL-6, SQL-7 (top, opportunity, rising/declining)
- [ ] Wire Panel 2: keyword table, 4 sub-tabs, filters, export
- [ ] Opportunity score calculation in JavaScript
- [ ] Deploy

### Phase 3 — Action Centre (Priority 3 — outputs decisions from all data)
- [ ] `api/seo/actions.js` — implement SQL-12 (queries A, B, C)
- [ ] Action generation logic in JavaScript
- [ ] Wire Panel 6: action cards with all 11 fields, status dropdown
- [ ] Revenue impact calculation
- [ ] Deploy

### Phase 4 — Product + Landing Page Intelligence
- [ ] `api/seo/products.js` — implement SQL-8
- [ ] `api/seo/landing-pages.js` — implement SQL-9
- [ ] Wire Panel 3: product table with expand-on-click keyword detail
- [ ] Wire Panel 4: landing page table with page-type filter tabs
- [ ] Deploy

### Phase 5 — Technical SEO
- [ ] `api/seo/technical.js` — implement SQL-10, SQL-11, SQL-12, SQL-13
- [ ] Wire Panel 5: live sections (coverage, device, countries, appearance)
- [ ] Placeholder cards for unconnected sections (CWV, 404s, sitemap, schema)
- [ ] Deploy

### Phase 6 — Polish + Index Entry
- [ ] Add SEO dashboard card to `Staff-requirements-02/index.html`
- [ ] Cross-tab navigation (click a keyword → opens in Keyword tab)
- [ ] Export CSV for keyword and product tables
- [ ] Final QA: all tabs load, all error states handled
- [ ] Deploy + validate

---

## Data Gap Register

Every known limitation is listed here. Nothing is hidden.

| Gap | Affected Widget | Plan |
|----|----------------|------|
| GSC data only from Mar 2026 (5 months) | All live KPIs — no YoY comparison possible | Show "YoY: data unavailable — Mar 2027" |
| No GA4 reliable data | Organic Revenue, Orders, Conversion Rate | Show placeholder: "GA4 pipeline required — 0 months available" |
| No backlink data | Landing Page — Backlinks column | Placeholder: "Connect Ahrefs/Majestic API" |
| No Core Web Vitals | Technical SEO — CWV section | Placeholder: "Connect PageSpeed Insights API" |
| No 404/crawl data | Technical SEO — Broken Links section | Placeholder: "Connect Screaming Frog or GSC Coverage API" |
| No schema markup data | Technical SEO — Schema section | Placeholder: "Connect Structured Data API" |
| No AI Overview impression data | AI Visibility KPI | Placeholder: "GSC AIO data not in current pipeline" |
| SEMrush data is static (monthly) | 37-month trend | Hardcoded JS array; manual update needed monthly |
| Google Ads ROAS anomaly Mar 2025 | Ads overlay chart | Flag in chart tooltip: "Conversion tracking change detected" |
| GSC appearance table empty | Search Appearance section | Alert shown clearly in UI |

---

## Naming Conventions

Consistent with existing project:

| Element | Convention | Example |
|---------|-----------|---------|
| API file | `api/seo/{name}.js` | `api/seo/executive.js` |
| HTML page | `pages/seo.html` | single file |
| Query param (type) | lowercase-hyphen | `?type=landing-pages` |
| JSON response | `{ ok: true, data: [...], meta: {...} }` | standard |
| CSS classes | lowercase-hyphen | `.action-card` `.pos-1-3` |
| JS vars | camelCase | `var SEO_KEYWORDS = []` |
| JS functions | camelCase | `function loadKeywords()` |

---

## Approval Checklist

Before any code is written, confirm:

- [ ] This implementation plan is approved
- [ ] Phase build order is approved (Executive → Keywords → Actions → Products → Pages → Technical)
- [ ] Placeholder strategy for missing data is approved
- [ ] Hardcoded SEMrush 37-month array approach is approved (vs. CSV-serving API)
- [ ] Single `pages/seo.html` file approach is approved (vs. separate file per tab)
- [ ] Revenue impact estimation formula (£45 AOV, 0.6% organic CR) is approved or to be revised
- [ ] `api/seo/` subfolder within existing `Staff-requirements-02` project is approved (vs. new Vercel project)

---

*All SQL uses parameterized queries. No SQL injection vectors. DB user is read-only. No data is written.*  
*All implementation follows patterns established in existing live dashboards.*
