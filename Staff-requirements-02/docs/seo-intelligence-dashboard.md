# SEO Intelligence Dashboard — Full Technical Reference

**Project:** ledsone.co.uk · AIOS Staff Reporting  
**URL:** https://staff-requirements-02.vercel.app/pages/seo.html  
**Entry point (index):** https://staff-requirements-02.vercel.app/  
**Last updated:** 2026-07-31  
**Status:** All 7 phases complete and live

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Architecture](#2-architecture)
3. [File Map](#3-file-map)
4. [Data Sources](#4-data-sources)
5. [API Reference — `api/seo.js`](#5-api-reference)
6. [Phase 1 — Executive Overview](#6-phase-1--executive-overview)
7. [Phase 2 — Product Intelligence](#7-phase-2--product-intelligence)
8. [Phase 3 — Keyword Intelligence](#8-phase-3--keyword-intelligence)
9. [Phase 4 — Landing Pages](#9-phase-4--landing-pages)
10. [Phase 5 — Action Centre](#10-phase-5--action-centre)
11. [Phase 6 — Technical SEO](#11-phase-6--technical-seo)
12. [Phase 7 — Index Card](#12-phase-7--index-card)
13. [Shared UI Utilities](#13-shared-ui-utilities)
14. [Known Limitations & Placeholders](#14-known-limitations--placeholders)
15. [Deployment](#15-deployment)
16. [Constraint Log](#16-constraint-log)

---

## 1. Purpose

A single-page, 6-tab SEO Intelligence Dashboard for ledsone.co.uk built for the AIOS coordinator and digital marketing team. It consolidates:

- **Google Search Console** data (PostgreSQL pipeline, sub_source=104)
- **Google Ads** data (UK account 4503486236, PostgreSQL)
- **SEMrush** 37-month historic data (static CSV)
- **Shopify product listings** (PostgreSQL, listings schema)

The dashboard replaces the need to log in to multiple platforms for weekly/monthly SEO reporting. Each tab is independently loadable and lazy-loaded on first click to avoid slow initial page loads.

**Design constraints set at project start (immutable):**
- Do not hardcode SEMrush data — load from master CSV
- Do not use assumed revenue formulas as primary KPIs
- Keep placeholders for unavailable data (GA4, CWV, crawl errors)
- Add a Data Quality panel on every tab showing source coverage and freshness
- GSC clicks from the pipeline are ~50% of true GSC totals — label this on every panel
- Single `seo.html` file (no multi-page routing)

---

## 2. Architecture

```
PostgreSQL (207.148.78.148:5432)
  db=ledsone · user=dbhub_readonly (READ-ONLY)
        │
        ▼
api/seo.js  ←  Vercel Serverless Function (Node.js, pg)
  ?module=exec|products|keywords|landing|actions|technical
  ?type=<sub-type>
        │
        ▼
pages/seo.html  ←  Single-file dashboard (vanilla JS, Chart.js 4.4.3)
  Tab 1: Executive Overview
  Tab 2: Product Intelligence
  Tab 3: Keyword Intelligence
  Tab 4: Landing Pages
  Tab 5: Action Centre
  Tab 6: Technical SEO
        │
        ▼ (CSV only)
data/seo-master-dataset.csv  ←  37-month SEMrush + corrected GSC + Ads
```

**Key architectural decisions:**

| Decision | Reason |
|---|---|
| Single `api/seo.js` (not 4–6 sub-files) | Vercel Hobby plan caps at 12 serverless functions. 10 total across the project. |
| `?module=` routing inside one handler | Avoids function-count bloat while keeping sub-logic clearly separated |
| CSV for SEMrush data | SEMrush API is not in the pipeline; maintainable manual export |
| Lazy tab loading | Avoids 6 simultaneous DB queries on page open |
| ILIKE JOIN avoided | `page ILIKE '%/products/' \|\| handle` timed out on 269k-row table; replaced with separate queries + JS merge |
| `ROW_NUMBER()` for top-keyword-per-page | Avoids correlated subquery timeout |
| GSC clicks labelled "≈50%" everywhere | Device-level thresholding in the pipeline overview table stores only a subset of rows |

---

## 3. File Map

```
Staff-requirements-02/
├── index.html                        # Staff directory — SEO card added (Phase 7)
├── pages/
│   └── seo.html                      # Full 6-tab dashboard (~1,800 lines)
├── api/
│   └── seo.js                        # Combined serverless API (~550 lines)
└── data/
    └── seo-master-dataset.csv        # 37 rows × 58 cols, Jul 2023–Jul 2026
docs/
└── seo-intelligence-dashboard.md    # This file
```

**`seo.html` internal structure:**

```
<head>  CSS variables + global styles
<body>
  .topbar + .masthead          # ledsone gold/navy branding
  .nav                         # 6 tab buttons
  #tab-exec                    # Phase 1 HTML shell
  #tab-products                # Phase 2 HTML shell
  #tab-keywords                # Phase 3 HTML shell (sub-nav injected by JS)
  #tab-landing                 # Phase 4 HTML shell (sub-nav injected by JS)
  #tab-actions                 # Phase 5 HTML shell (injected by JS)
  #tab-technical               # Phase 6 HTML shell (sub-nav injected by JS)
<script>
  /* Shared utilities */        fNum, fGBP, pct, deltaHtml, fMonth, parseCSV
  /* switchTab */               lazy loader dispatch
  /* Phase 1 — Executive */    loadExec(), Chart.js trend, donut, ads overlay
  /* Phase 2 — Products */     loadProducts(), filterProducts(), renderProdTable()
  /* Phase 3 — Keywords */     loadKeywords(), filterKwTable(), renderKwRows()
  /* Phase 4 — Landing */      loadLanding(), filterLandingTable(), renderLandingRows()
  /* Phase 5 — Actions */      loadActions(), filterActions(), renderActTable()
  /* Phase 6 — Technical */    loadTechnical(), filterTechTable(), renderZeroClickTable()
  /* Exports */                 exportKwCSV(), exportLandingCSV(), exportActCSV(), exportTechCSV(), exportProdCSV()
```

---

## 4. Data Sources

### 4.1 Google Search Console (GSC)

| Property | Value |
|---|---|
| Database schema | `google_search_console` |
| Tables used | `overview`, `query`, `query_page`, `page` |
| sub_source filter | `104` (ledsone.co.uk web search) |
| search_type filter | `'web'` |
| Date range in pipeline | 2026-03-20 to present |
| Click accuracy | **~50% of true GSC totals** (device-level thresholding removes rows where device-split clicks fall below GSC's privacy floor) |

**Table row counts (approx, as of Jul 2026):**
- `overview`: monthly rollups, ~5 rows for ledsone
- `query`: 61,228 distinct queries
- `page`: 34,874 distinct URLs
- `query_page`: large join table, privacy-thresholded

**GSC pipeline click correction (discovered during build):**  
The original master CSV (docs/) had GSC clicks for Mar–May 2026 exactly 2× the live DB values (device-split sums were erroneously doubled). The `data/seo-master-dataset.csv` copy uses corrected values matching the DB:

| Month | Corrected (DB) |
|---|---|
| Mar 2026 | 1,921 |
| Apr 2026 | 4,256 |
| May 2026 | 4,172 |
| Jun 2026 | 4,217 |
| Jul 2026 | 3,854 |

### 4.2 Google Ads

| Property | Value |
|---|---|
| Database schema | `google_ads` |
| Tables used | `campaign_performance`, `campaigns` |
| Account filter | `account_id = 4503486236` |
| Currency | GBP — `cost` column is already in GBP (not micros) |
| Date range | Jul 2023 to present |
| Campaigns | 346 active, £382,993 total spend |

### 4.3 SEMrush (Static CSV)

| Property | Value |
|---|---|
| File | `data/seo-master-dataset.csv` |
| Rows | 37 (Jul 2023 – Jul 2026, one row per month) |
| Columns | 58 |
| SEMrush coverage | Jul 2023 – Jun 2026 (36 months, manually exported) |
| Update method | Manual export + CSV edit when new data available |
| Key columns | `semrush_organic_keywords`, `semrush_organic_traffic`, `semrush_domain_score`, `semrush_backlinks_total` |

### 4.4 Shopify Listings

| Property | Value |
|---|---|
| Database schema | `listings` |
| Table | `shopify_listings` |
| Filter | `sub_source=104 AND is_parent=1` |
| Total products | 5,216 parent products |
| Used for | Product Intelligence title matching; Technical coverage ratio |

### 4.5 Data NOT Available

| Source | Status | Notes |
|---|---|---|
| GA4 session-level data | Limited | Mar–Apr 2026 aggregate exports only; not reliable for KPIs |
| Shopify organic revenue | Unavailable | MCP connection failed; GA4→Shopify session join not in pipeline |
| Core Web Vitals | Unavailable | Requires CrUX integration or GA4 WV reporting |
| Crawl errors | Unavailable | Requires GSC Coverage API or crawler |
| Keyword-level history pre-Mar 2026 | Unavailable | SEMrush data is site-level only |

---

## 5. API Reference

**Base:** `https://staff-requirements-02.vercel.app/api/seo`  
**Auth:** None (internal staff tool)  
**Cache:** `s-maxage=300, stale-while-revalidate=60`  
**DB timeout:** 30,000ms per query  
**Connection timeout:** 15,000ms  

All endpoints: `GET /api/seo?module=<module>&type=<type>[&from=YYYY-MM-DD&to=YYYY-MM-DD]`

Default date range: `from=2026-03-20`, `to=<today>`

---

### `module=exec`

#### `type=gsc-monthly`
Monthly GSC aggregates from `google_search_console.overview`.

```json
{
  "ok": true,
  "data_note": "clicks ≈ 50% of true GSC totals",
  "rows": [
    { "month": "2026-03-01", "days_with_data": 12, "clicks": 1921, "impressions": 89432, "avg_position": 24.5 }
  ]
}
```

SQL:
```sql
SELECT DATE_TRUNC('month', date)::date AS month,
       COUNT(DISTINCT date)::int AS days_with_data,
       SUM(clicks)::int AS clicks,
       SUM(impressions)::int AS impressions,
       ROUND(AVG(position)::numeric, 2) AS avg_position
FROM google_search_console.overview
WHERE sub_source = 104 AND search_type = 'web'
GROUP BY DATE_TRUNC('month', date)
ORDER BY month ASC
```

#### `type=position-dist`
Current-month keyword distribution across position buckets.

```json
{
  "ok": true,
  "rows": [
    { "bucket": "pos_1_3", "query_count": 142, "clicks": 892, "impressions": 4210 },
    { "bucket": "pos_4_10", "query_count": 1834, ... },
    { "bucket": "pos_11_20", ... },
    { "bucket": "pos_21_50", ... },
    { "bucket": "pos_51_100", ... }
  ]
}
```

Buckets: `pos_1_3`, `pos_4_10`, `pos_11_20`, `pos_21_50`, `pos_51_100`

#### `type=ads-monthly`
Monthly Google Ads totals (UK account, GBP).

```json
{
  "ok": true,
  "rows": [
    { "month": "2026-07-01", "active_campaigns": 48, "clicks": 12043, "impressions": 289432,
      "cost_gbp": 14823.40, "conv_value_gbp": 52431.00, "roas": 3.538 }
  ]
}
```

#### `type=data-quality`
Source freshness metadata (parallel queries).

```json
{
  "ok": true,
  "sources": {
    "semrush":    { "status": "static_csv", "coverage": "Jul 2023–Jun 2026", "months": 36 },
    "gsc":        { "status": "live", "earliest": "2026-03-20", "latest": "2026-07-26", "total_days": 131 },
    "google_ads": { "status": "live", "earliest": "2023-07-01", "latest": "2026-07-26", "account_id": 4503486236 },
    "ga4":        { "status": "limited" },
    "shopify":    { "status": "unavailable" }
  }
}
```

---

### `module=products`

#### `type=pages`
Top 2,000 product pages by GSC clicks, with top keyword per page merged.

Two parallel queries:
1. `google_search_console.page` WHERE `page ILIKE '%ledsone.co.uk/products/%'`
2. `query_page` with `ROW_NUMBER() OVER (PARTITION BY page ORDER BY SUM(clicks) DESC)` to get top keyword

Merged in handler by `page` URL key.

```json
{
  "ok": true, "from": "2026-03-01", "to": "2026-07-26", "total": 1842,
  "data_note": "clicks ≈ 50% of true GSC totals",
  "rows": [
    { "page": "https://ledsone.co.uk/products/zip-ties-...", "clicks": 0, "impressions": 20833,
      "ctr_pct": 0, "avg_position": 13.3, "days_with_data": 84,
      "top_query": "zip ties", "top_query_clicks": 0 }
  ]
}
```

**Handle extraction (JS side):**
```js
url.match(/\/products\/([^?#]+)/)
```

**Title matching (JS side):** Shopify titles contain `~{number}` variant suffixes — stripped with `.replace(/~\d+$/, '').trim()`

#### `type=listings`
All Shopify parent products (handle + title) for JS-side title matching.

```json
{ "ok": true, "count": 5216, "rows": [{ "handle": "zip-ties-...", "title": "Releasable Zip Ties" }] }
```

**Why separate query instead of JOIN:** ILIKE join `page ILIKE '%/products/' || handle` on 269k × 5217 rows timed out at 30s. Fix: two queries, merge in JavaScript.

---

### `module=keywords`

Default `from=2026-03-20`, `to=<today>`.

#### `type=top`
Top 500 keywords by clicks + top landing page per keyword.

Two parallel queries:
1. Aggregate `query` table, ORDER BY clicks DESC LIMIT 500
2. CTE: top_kw JOIN query_page, `ROW_NUMBER() OVER (PARTITION BY query ORDER BY SUM(clicks) DESC)` → top page per keyword

```json
{
  "ok": true, "total": 500,
  "rows": [
    { "query": "ledsone", "clicks": 375, "impressions": 4608, "ctr_pct": 8.138,
      "avg_position": 2.7, "top_page": "https://ledsone.co.uk/" }
  ]
}
```

#### `type=opportunity`
Keywords pos 4–20 with ≥50 impressions, sorted by opportunity score.

**Opportunity score formula:**
```
pos_bucket_score:
  pos <= 3   → 0
  pos <= 10  → 40
  pos <= 20  → 70   ← most addressable band
  pos <= 50  → 50
  else       → 20

score = pos_bucket + min(impressions/100, 30) - min(ctr×10, 20)
score = clamp(0, 100, round(score))
```

**Action labels:**
| Condition | Action |
|---|---|
| pos ≤ 7 and imp ≥ 200 | Quick Win — Top 3 Push |
| pos ≤ 10 and imp ≥ 200 | CTR Boost — Title/Meta |
| pos ≤ 15 and imp ≥ 200 | Page 2 Rescue |
| pos ≤ 20 and imp ≥ 200 | Content Depth Needed |
| imp ≥ 10,000 | High Volume Priority |
| else | Monitor |

```json
{
  "ok": true, "total": 300,
  "rows": [
    { "query": "zip ties", "clicks": 0, "impressions": 51131, "ctr_pct": 0,
      "avg_position": 10.7, "opp_score": 100, "action": "Page 2 Rescue" }
  ]
}
```

#### `type=rising` / `type=declining`
Position movers: last 30 days vs prior 30 days.

Date computation:
```
latest_date  = MAX(date) from query table
cur_period   = [latest-29, latest]
prv_period   = [latest-59, latest-30]
```

Filter: `(prv_pos - cur_pos) > 0.5` (rising) or `< -0.5` (declining)  
Minimum: 10 impressions in both periods  
Limit: 200

```json
{
  "ok": true, "type": "rising", "total": 200,
  "cur_period": { "from": "2026-06-27", "to": "2026-07-26" },
  "prv_period": { "from": "2026-05-28", "to": "2026-06-26" },
  "rows": [
    { "query": "colourful table lamps", "cur_pos": 6.4, "prv_pos": 70.6,
      "pos_change": 64.2, "cur_clicks": 12, "cur_imp": 340, "prv_clicks": 0, "prv_imp": 24 }
  ]
}
```

---

### `module=landing`

#### `type=pages`
Top 500 landing pages (all types) by GSC clicks, with URL-pattern page classification.

**`classifyPage(url)` function:**
```js
/products/    → 'product'
/collections/ → 'collection'
/blogs/ or /pages/ → 'content'
/ (root)      → 'home'
/search       → 'search'
else          → 'other'
```

```json
{
  "ok": true, "total": 500,
  "rows": [
    { "page": "https://ledsone.co.uk/", "page_type": "home",
      "clicks": 248, "impressions": 8932, "ctr_pct": 2.776, "avg_position": 1.2, "days_with_data": 131 }
  ]
}
```

#### `type=by-type`
All pages aggregated by `classifyPage()` bucket.

Computed in handler from full page table (no LIMIT). Buckets: product, collection, content, home, search, other.

```json
{
  "rows": [
    { "page_type": "product", "clicks": 7635, "impressions": 412000, "ctr_pct": 1.852,
      "avg_position": 18.4, "page_count": 11387 }
  ]
}
```

#### `type=top-pages`
Top 20 pages current month vs prior full calendar month (MoM).

Date logic:
```
latest_date  = MAX(date) from page table
cur_period   = [YYYY-MM-01, latest_date]      ← current (possibly partial) month
prv_period   = [YYYY-(M-1)-01, YYYY-MM-00]   ← prior full calendar month
```

---

### `module=actions`

#### `type=priorities`
Three parallel queries merged and priority-ranked.

**Query 1 — Opportunity keywords** (pos 4–20, ≥100 impressions, top 80)  
**Query 2 — Declining movers** (pos drop > 2 places, ≥20 impressions, last 30d vs prior 30d, top 30)  
**Query 3 — CTR underperformers** (pos 1–10, ≥200 impressions, CTR < 3%, top 30)

**Priority scoring:**
- Quick win (pos ≤ 7): base 90 + min(imp/200, 10) → capped 100
- CTR boost (pos ≤ 10): base 75 + same
- Page 2 rescue (pos ≤ 15): base 60
- Content gap (pos ≤ 20): base 45
- Declining: 55 + drop×1.2, capped 100
- CTR underperformer: 50 + gap×2 + min(imp/500, 15)

**Priority bands:** P1 ≥ 85, P2 ≥ 70, P3 ≥ 55, P4 < 55

```json
{
  "ok": true, "total": 110,
  "summary": { "quick_win": 17, "ctr_boost": 20, "rescue": 29, "content": 14, "decline": 30 },
  "rows": [
    { "rank": 1, "priority": "P1", "category": "quick-win",
      "query": "lighting design ideas 2026", "cur_pos": 5.1, "impressions": 51131,
      "clicks": 243, "ctr_pct": 0.475, "priority_score": 100,
      "action_label": "Push to Top 3",
      "why": "Ranking #5.1 with 51131 impressions — a 1-3 position improvement could 3× clicks.",
      "pos_change": null }
  ]
}
```

---

### `module=technical`

#### `type=coverage`
Index coverage stats: three parallel queries.

1. Page-type breakdown counts from `page` table (CASE WHEN ILIKE)
2. Shopify product count from `listings.shopify_listings`
3. Freshness buckets from days_with_data distribution (new ≤7, active_30d 8–30, active_60d 31–60, established >60)

```json
{
  "ok": true,
  "stats": {
    "total_indexed": 34874,
    "indexed_products": 30915,
    "indexed_collections": 2574,
    "indexed_other": 1865,
    "total_shopify_products": 5216,
    "product_coverage_pct": 592.7,
    "earliest": "2026-03-20", "latest": "2026-07-26"
  },
  "freshness": { "new_7d": 23993, "active_30d": 6700, "active_60d": 1883, "established": 2298 }
}
```

**Coverage note:** `indexed_products = 30,915` vs `total_shopify_products = 5,216` gives 592.7% — the ILIKE `%/products/%` count captures URL variants (variant param URLs, localised `/pl-pl/products/` paths, paginated URLs etc.), not just canonical parent pages. The ratio is surfaced as a data note in the UI rather than a clean percentage.

#### `type=cannibalization`
Keywords where 2+ distinct pages receive ≥1 click each (from `query_page` table).

CTE approach:
1. `page_kw`: sum clicks per (query, page), HAVING clicks ≥ 1
2. `multi_page`: GROUP BY query HAVING COUNT(DISTINCT page) ≥ 2, ORDER BY total_clicks DESC LIMIT 60
3. JOIN back to `page_kw` to get per-page click breakdown

Results grouped by keyword in handler JS. First page in each group = click winner (bold in UI).

```json
{
  "ok": true, "total": 60,
  "rows": [
    { "query": "ledsone", "competing_pages": 15, "total_clicks": 386,
      "pages": [
        { "page": "https://ledsone.co.uk/", "clicks": 233 },
        { "page": "https://www.ledsone.co.uk/", "clicks": 93 }
      ]
    }
  ]
}
```

**Observation:** "ledsone" brand keyword has 15 competing pages including www vs non-www — indicates a redirect configuration issue (www should 301 to non-www canonically).

#### `type=zero-click`
Pages with ≥20 impressions and 0 clicks across the full date range.

```json
{
  "ok": true, "total": 300,
  "rows": [
    { "page": "https://ledsone.co.uk/products/zip-ties-...",
      "page_type": "product", "impressions": 20833, "avg_position": 13.3, "days_with_data": 84 }
  ]
}
```

**Recommended fix logic (JS):**
- `avg_position > 20` → "Improve ranking first"
- `avg_position ≤ 10` → "Rewrite title tag — high pos, 0 clicks"
- else → "Improve snippet relevance"

---

## 6. Phase 1 — Executive Overview

**Tab ID:** `tab-exec`  
**Load function:** `loadExec()` — fires on page load (not lazy)  
**Data fetches (parallel):** 4 API calls + 1 CSV fetch

### KPI Cards
Derived from the last two rows of `gsc-monthly` data (MoM delta).

| Card | Source | Formula |
|---|---|---|
| GSC Clicks | gsc-monthly | Latest month total; delta vs prior month |
| GSC Impressions | gsc-monthly | Same |
| Avg Position | gsc-monthly | Latest month avg_position |
| Ads Spend | ads-monthly | Latest month cost_gbp |
| ROAS | ads-monthly | conv_value_gbp / cost_gbp |

### 37-Month Trend Chart (Chart.js)
- **Type:** Line chart with two Y-axes
- **Data source:** `data/seo-master-dataset.csv` (fetched client-side via `fetch('/data/seo-master-dataset.csv')`)
- **Series:** SEMrush organic traffic (left axis), GSC clicks (right axis, labelled "≈50% pipeline"), Ads spend
- **Months:** Jul 2023 – Jul 2026 (37 rows)
- **CSV not hardcoded** — `parseCSV()` utility reads it dynamically

### Position Distribution Donut (Chart.js)
- **Type:** Doughnut
- **Data source:** `type=position-dist` (current month)
- **Segments:** pos 1–3, 4–10, 11–20, 21–50, 51–100

### Ads Overlay Chart (Chart.js)
- **Type:** Bar (impressions) + Line (ROAS) combo, two Y-axes
- **Data source:** `type=ads-monthly`

### MoM Table
Last 6 months, GSC + Ads side by side with delta arrows.

### Data Quality Panel
4 cards: SEMrush (static CSV), GSC (live, with click note), Google Ads (live), GA4 (limited).

---

## 7. Phase 2 — Product Intelligence

**Tab ID:** `tab-products`  
**Load function:** `loadProducts()` — lazy, fires on first tab click  
**Data fetches (parallel):** `type=pages` + `type=listings`

### Stats Bar
- Total product pages in GSC
- Total Shopify listings
- Coverage % (GSC-visible / Shopify total)
- Pages with clicks > 0
- Avg position across all product pages

### Sortable Product Table
Columns: rank, page/title/handle, position badge, clicks, impressions, CTR, top keyword, opp score bar, priority badge.

**Opportunity score (same formula as keywords module):**
```js
function calcOppScore(pos, imp, ctr) {
  let s = pos<=3?0 : pos<=10?40 : pos<=20?70 : pos<=50?50 : 20;
  s += Math.min(imp/100, 30);
  s -= Math.min(ctr*10, 20);
  return Math.max(0, Math.min(100, Math.round(s)));
}
```

**Priority badges:** Critical (score ≥ 80), High (≥ 60), Medium (≥ 40), Low (< 40)

**Position badges (colour-coded):**
- pos 1–3: green `.pos-1-3`
- pos 4–10: gold `.pos-4-10`
- pos 11–20: blue `.pos-11-20`
- pos 21+: muted `.pos-21p`

### JS-side Shopify Title Matching
```js
// Extract handle from GSC URL
const handle = url.match(/\/products\/([^?#]+)/)?.[1] || '';
// Look up in listings map
const title = listingsMap[handle] || null;
// Clean Shopify title (strip ~variant suffix)
title.replace(/~\d+$/, '').trim()
```

### Filters
Search (URL or title), sort by clicks/impressions/position/score, pagination (50 per page).

### CSV Export
Exports all columns including opp score and priority label.

---

## 8. Phase 3 — Keyword Intelligence

**Tab ID:** `tab-keywords`  
**Load function:** `loadKeywords(subType)` — lazy, per sub-tab  
**Sub-tabs:** Top Keywords, Opportunities, Rising, Declining

### Sub-tab Loading Pattern
Each sub-tab has its own `kwLoaded[type]` guard — data is fetched once per sub-tab per session. Subsequent filter/sort operations reuse cached `kwData[type]` array.

### Top Keywords Table
Columns: rank, keyword, position badge, clicks, impressions, CTR %, top landing page (truncated URL).

### Opportunities Table
Columns: rank, keyword, position, impressions, clicks, CTR, opp score bar, action tag.

Action tag CSS classes: `.act-quickwin`, `.act-ctr`, `.act-rescue`, `.act-content`, `.act-highvol`, `.act-monitor`

### Rising / Declining Tables
Columns: rank, keyword, current pos, prev pos, change (pos-up/pos-dn coloured), current clicks, current impressions.

**`pos_change` sign convention:** positive = position number increased (ranking got worse); negative = ranking improved. In the `rising` query `(prv_pos - cur_pos) > 0.5` means current position number is smaller (higher ranking).

---

## 9. Phase 4 — Landing Pages

**Tab ID:** `tab-landing`  
**Load function:** `loadLanding(subType)` — lazy, per sub-tab  
**Sub-tabs:** All Pages, By Page Type, Month-on-Month

### All Pages Table
Columns: rank, page slug (truncated), page type badge, clicks, impressions, CTR, position badge, days in GSC.

**Page type badges (colour-coded):**
- home: blue `.pt-home`
- product: green `.pt-product`
- collection: purple `.pt-collection`
- content: amber `.pt-content`
- search: red `.pt-search`
- other: grey `.pt-other`

### By Page Type Cards
Grid of summary cards: clicks total, impression total, avg position, page count, CTR per type.

### MoM Table
Top 20 pages current month, with MoM click delta and position delta columns. Green/red colouring. "Prior = Jun 2026 (full month)" note.

---

## 10. Phase 5 — Action Centre

**Tab ID:** `tab-actions`  
**Load function:** `loadActions()` — lazy, single fetch  
**Data:** `module=actions&type=priorities` (one API call, 3 parallel DB queries inside)

### Summary Cards
5 cards (Quick Win, CTR Fixes, Page 2 Rescue, Content Gaps, Declining Alerts) with click-to-filter. Count sourced from `summary` object in API response.

### Action Table
Columns: rank, priority badge (P1–P4), category badge, keyword, position badge, impressions, clicks, score bar, action label, why-text.

**`why` field:** Human-readable explanation generated in the API handler, e.g. "Ranking #5.1 with 51,131 impressions — a 1–3 position improvement could 3× clicks."

### Filters
Keyword search, category dropdown, priority dropdown. All operate on cached `actAllRows` array without re-fetching.

### CTR Benchmark (estimated, labelled in UI)
Used for CTR underperformer detection only:
- pos 1–3 benchmark: ~15% CTR
- pos 4–7 benchmark: ~5% CTR
- pos 8–10 benchmark: ~2% CTR

Source: industry average curves. Site-specific benchmarks unavailable without full GA4. Clearly labelled "Estimated" in Data Quality panel.

---

## 11. Phase 6 — Technical SEO

**Tab ID:** `tab-technical`  
**Load function:** `loadTechnical(subType)` — lazy, per sub-tab  
**Sub-tabs:** Index Coverage, Cannibalization, Zero-Click Pages

### Index Coverage
KPI cards: total GSC-indexed pages, indexed product count (with coverage bar vs Shopify total), collections, other pages.

Freshness chips from `days_with_data` bucketing:
- New ≤7 days: 23,993 pages (mostly due to Mar 2026 pipeline start date, not truly new)
- Active 8–30d: 6,700
- Active 31–60d: 1,883
- Established >60d: 2,298

### Cannibalization
Grouped display: keyword → list of competing pages with click counts. First (highest-click) page bolded as "winner".

**Top cannibalization signals found:**
- "ledsone" — 15 competing pages (www vs non-www redirect gap)
- "ledsone lighting" — 10 competing pages
- "ledsone uk" — 11 competing pages

### Zero-Click Pages
Top 300 pages by impressions with 0 clicks. Includes recommended fix based on avg_position. Filterable by page type and URL search.

**Top zero-click finding:** Zip-ties product page — 20,833 impressions, pos 13.3, 0 clicks — strong candidate for title/meta rewrite and ranking improvement.

---

## 12. Phase 7 — Index Card

Added to `Staff-requirements-02/index.html`:

```html
<div class="section-title">Intelligence Dashboards <span class="count">1</span></div>
<div class="roster">
  <a class="row" href="pages/seo.html" style="border-color:var(--gold)">
    <span class="avatar live">SEO</span>
    <span class="who">
      <span class="nm">SEO Intelligence</span>
      <span class="role">ledsone.co.uk · GSC + Ads + SEMrush</span>
    </span>
    <div class="tags">
      <span class="tag r">Executive</span>
      <span class="tag r">Products</span>
      <span class="tag r">Keywords</span>
      <span class="tag r">Actions</span>
    </div>
    <span class="status live">6 Phases Live</span>
  </a>
</div>
```

Positioned above the existing "Active Dashboards" section. Gold border matches branding.

---

## 13. Shared UI Utilities

All in `seo.html` `<script>` block, available across all phases:

```js
fNum(n, dec)          // Format number with commas: 12345 → "12,345"
fGBP(n)               // Format as GBP: 1234.5 → "£1,234.50"
pct(val, prev)        // Percentage change: (val-prev)/prev * 100
deltaHtml(val, prev, reverse)  // Coloured ▲/▼ delta chip
fMonth(iso)           // "2026-07-01" → "Jul 2026"
parseCSV(text)        // Parse CSV string → [{col:val,...}]
posBadge(pos)         // Coloured position badge span
oppBar(score)         // Opportunity score bar HTML (opp-wrap > opp-fill + opp-num)
ptBadge(type)         // Page type coloured badge span (shared Phase 4+6)
```

**CSS variables (`:root`):**

| Variable | Value | Usage |
|---|---|---|
| `--navy` | `#0c1a30` | Headings, borders |
| `--gold` | `#b98b1e` | Accent, badges |
| `--accent` | `#1f5eff` | Links, tags |
| `--good` | `#0a7d4f` | Positive deltas, live status |
| `--red` | `#dc2626` | Negative deltas, alerts |
| `--warn` | `#d97706` | Warning indicators |
| `--muted` | `#64748b` | Secondary text |
| `--purple` | `#7c3aed` | Chart series 3 |
| `--na` | `#94a3b8` | Unavailable/placeholder |

---

## 14. Known Limitations & Placeholders

| Item | Status | Notes |
|---|---|---|
| GSC click accuracy | Known limitation — labelled everywhere | ~50% of true totals due to device thresholding in pipeline |
| Product coverage % in Technical tab | Misleading as shown | ILIKE on `%/products/%` captures all URL variants, not just canonicals (30,915 vs 5,216 Shopify products) |
| GA4 revenue | Unavailable — placeholder | Session→order join not in pipeline |
| Core Web Vitals | Unavailable — placeholder | No CrUX or GA4 WV integration |
| Crawl errors | Unavailable — placeholder | No GSC Coverage API or crawler |
| Keyword-level position history pre-Mar 2026 | Unavailable | SEMrush data is site-level only; GSC query table starts Mar 2026 |
| CTR benchmarks in Action Centre | Estimated — labelled | Industry averages, not site-specific |
| www vs non-www canonicalization | Surfaced in cannibalization data | "ledsone" has 15 competing pages including www. Needs redirect audit |
| SEMrush data freshness | Static — manual update required | Last export Jun 2026; Jul 2026 row has no SEMrush data |
| Zero-click zip-ties page | High priority fix | 20,833 impressions, pos 13.3, 0 clicks — title/meta rewrite needed |

---

## 15. Deployment

**Platform:** Vercel (Hobby plan)  
**Project ID:** `prj_5dGSos7ZXDK3knlASnFNgXHCMFpf`  
**Team ID:** `team_3yn5bmAF7peUPYM7LJcj07PF`  
**Production URL:** `https://staff-requirements-02.vercel.app`  

**Deploy command (from `Staff-requirements-02/` directory):**
```bash
vercel --prod --yes
```

**Git push alone does not auto-deploy** — Vercel CLI must be invoked explicitly.

**Function count:** 10 of 12 maximum (Hobby plan)

| Function | Purpose |
|---|---|
| `api/seo.js` | All 6 SEO modules (exec, products, keywords, landing, actions, technical) |
| `api/germany/marketplace-gap.js` | Germany sales gap dashboard |
| `api/hetheesha/req1.js` | Hetheesha requirement 1 |
| `api/hetheesha/req2.js` | Hetheesha requirement 2 |
| `api/jackshan/dashboard.js` | Jakshan dashboard |
| `api/sajeepan/dashboard.js` | Sajeepan dashboard |
| `api/sonya/daily-orders.js` | Sonya daily orders |
| `api/sonya/dashboard.js` | Sonya main dashboard |
| `api/theekshy/dashboard.js` | Theekshy dashboard |
| `api/thivajini/dashboard.js` | Thivajini dashboard |

**Environment variable required:** `DATABASE_URL` (PostgreSQL connection string)

**`vercel.json`:**
```json
{ "functions": { "api/**/*.js": { "maxDuration": 60 } } }
```

**Consolidation history:** Originally 4 separate SEO API files (`executive.js`, `products.js`, `keywords.js`, `landing-pages.js`) caused the function count to hit 13 → exceeded Hobby limit. All merged into `api/seo.js` in commit `eaf08d0`.

---

## 16. Constraint Log

Decisions and incidents worth remembering for future sessions:

| Date | Event |
|---|---|
| 2026-07 | GSC master CSV had doubled clicks for Mar–May 2026 (2× error). Corrected in `data/seo-master-dataset.csv`. Original `docs/` copy not corrected — use only `data/` copy. |
| 2026-07 | ILIKE JOIN on `page ILIKE '%/products/' \|\| handle` timed out at 30s on 269k × 5217 rows. Fixed by separate queries + JS merge. Never retry this pattern on large tables. |
| 2026-07 | Vercel Hobby plan hit 13-function limit when 4 SEO sub-files were separate. Merged into `api/seo.js`. Keep ≤ 12 functions total across the project. |
| 2026-07 | `dirCondition` in `rising`/`declining` SQL uses a JS-constructed string — this is NOT injection-vulnerable because the value is hardcoded in a switch case, not from `req.query`. |
| 2026-07 | `listingsJson` scope bug: declared inside `loadProducts()` but referenced in `renderProducts()`. Fixed by promoting to module-level `prodListingsCount`. |
| 2026-07 | Jul 2026 row in master CSV was initially written with March's values (1,921 instead of 3,854). Caught and fixed immediately via Edit tool. |

---

*Generated 2026-07-31 · ledsone.co.uk AIOS SEO Intelligence Dashboard*
