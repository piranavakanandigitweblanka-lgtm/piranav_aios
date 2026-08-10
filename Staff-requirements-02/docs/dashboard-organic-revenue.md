# Organic Revenue Intelligence Dashboard

**File:** `pages/organic-revenue.html`
**Title:** Organic Revenue Intelligence — ledsone.co.uk
**Store:** ledsone.co.uk
**Last updated:** 2026-08-06

---

## Purpose

Organic revenue analytics dashboard for ledsone.co.uk. Shows revenue attributed to organic search landing pages from GA4, broken down by page, page type, and monthly trend. Companion guide page: `pages/organic-revenue-guide.html`.

---

## Structure — 4 Tabs

| Tab | ID | Title | Subtitle |
|-----|----|-------|---------|
| 1 | `tab-overview` | Overview | KPIs + Top Pages |
| 2 | `tab-bypage` | By Landing Page | Full Table |
| 3 | `tab-bytype` | By Page Type | Home / Product / Collection |
| 4 | `tab-trend` | Revenue Trend | Monthly Chart |

---

## Data Architecture

**Live API — latest snapshot (no date filter)**

Each tab calls `/api/intel-api?service=organic` with a `type` parameter. Data comes from a pre-aggregated GA4 snapshot stored in the database — not real-time.

```javascript
fetch('/api/intel-api?service=organic&type=overview')
fetch('/api/intel-api?service=organic&type=by-page')
fetch('/api/intel-api?service=organic&type=by-type')
fetch('/api/intel-api?service=organic&type=trend')
```

---

## API Route — `/api/intel-api?service=organic`
(Previously `api/organic-revenue.js` — merged into `api/intel-api.js` on 2026-08-10)

**Source schema/table:** `google_analytics.organic_landing_page_revenue`

| Type param | Returns |
|-----------|---------|
| `overview` | 6 KPI cards + top 10 pages by revenue (latest snapshot) |
| `by-page` | All pages with sessions, orders, revenue, avg order value, rev/session |
| `by-type` | Revenue grouped by page type bucket (Home, Product, Collection, Blog, Other) |
| `trend` | Monthly revenue aggregation — last 12+ months |

**Key columns returned:**
```
landing_page, sessions, orders, revenue, avg_order_value, rev_per_session, page_type, snapshot_date, month
```

---

## Tab Detail

### Tab 1 — Overview
- 6 KPI cards: Total Revenue, Sessions, Orders, Avg Order Value, Rev/Session, Pages Tracked
- Top 10 pages by organic revenue table
- Sortable columns

### Tab 2 — By Landing Page
- Full paginated table of all landing pages
- Columns: Landing Page, Sessions, Orders, Revenue, Avg Order, Rev/Session
- Filters: date range selector, keyword search
- Sortable all columns
- CSV export: `organic_revenue_by_page.csv`

### Tab 3 — By Page Type
- Revenue share cards per page type bucket (Home / Product / Collection / Blog / Other)
- Share bar visual
- Comparison table: page type vs sessions, orders, revenue, conversion rate

### Tab 4 — Revenue Trend
- Monthly organic revenue bar chart (Chart.js)
- Month-on-Month comparison table — last 12 months
- MoM delta % column

---

## Tables Used

| Schema | Table | Purpose |
|--------|-------|---------|
| `google_analytics` | `organic_landing_page_revenue` | Pre-aggregated GA4 organic revenue snapshot |

---

## Key Logic

- **Data is snapshot-based** — not queried live from GA4, pulled from a DB table that is updated on a schedule
- **Page type classification** — landing pages are bucketed by URL pattern (e.g. `/products/` → Product, `/collections/` → Collection)
- **Revenue attribution** — GA4 last-click attribution to organic search as the entry landing page
- **Guide link** — Nav bar links to `organic-revenue-guide.html` for data documentation

---

## Known Limitations

- Data reflects the latest snapshot date — not real-time GA4
- Revenue attribution is GA4 session-scoped (last non-direct click), not order-level
- Page type bucket is pattern-matched, edge-case URLs may land in "Other"



---

> *Auto-synced 2026-08-06 — Tabs/sections detected: Overview KPIs + Top Pages, By Landing Page Full Table, By Page Type Home / Product / Collection, Revenue Trend Monthly Chart, 📖 Guide Data Docs*
