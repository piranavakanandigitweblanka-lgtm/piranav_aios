# Capability Record — SEO Intelligence Dashboard

- **Title:** LEDSone SEO Intelligence Dashboard — Live Multi-Source Reporting
- **Date:** 2026-08-03
- **Member:** Piranav
- **Team:** SEO / Digital Marketing Intelligence
- **Requirement:** SEO Dashboard — full-stack live analytics dashboard for ledsone.co.uk
- **Dashboard URL:** https://staff-requirements-02.vercel.app/pages/seo.html
- **Files Changed:** `Staff-requirements-02/pages/seo.html`, `Staff-requirements-02/api/seo.js`
- **Data Sources:** Ledsone PostgreSQL (GSC + Google Ads), Neon PostgreSQL (SEMrush), SEMrush MCP
- **Evidence:** evidence/piranav/seo-dashboard-evidence-2026-08-03.md
- **Validation:** validation/piranav/seo-dashboard-validation-2026-08-03.md
- **Status:** PASS
- **PASS / FAIL:** PASS

---

## Capabilities Delivered

### 1 — Executive Overview Tab
KPI cards: GSC clicks, impressions, CTR, avg position, Google Ads spend, ROAS, Authority Score, Referring Domains, Total Backlinks. MoM comparison table. Trend chart (clicks + impressions). Donut chart (channel split). Google Ads chart. Competitors traffic chart. Backlinks Health dual-axis chart.

### 2 — SEO Alerts Panel (Auto-Generated)
Auto-generates severity-graded alerts (critical / warning / good) from live data on every page load:
- Backlink drop ≥50% from peak → critical
- 6-month rank decline → warning
- Traffic MoM drop ≥20% or 6-month drop ≥50% → warning / critical
- Keyword count 6-month drop ≥30% → warning
- ROAS ≥3× → good

### 3 — Backlinks Health Section
Dual-axis Chart.js chart: total backlinks (blue, left axis) + referring domains (red, right axis) over time. KPI cards: Authority Score, Referring Domains, Total Backlinks (warn styling on decline).

### 4 — SEMrush Rankings Sub-Tab (Keywords Tab)
Table of top 50 keywords with position colour badges (green ≤3, blue ≤10, amber ≤20, grey >20), KD badge (green <30, amber <60, red ≥60), volume, intent, URL.

### 5 — SEMrush Pages Sub-Tab (Landing Pages Tab)
Page type summary cards + 50-row table with traffic share bar visual.

### 6 — Weekly Cloud Agent — Backlinks Refresh
Scheduled Monday 3am UTC. Fetches SEMrush backlinks data → inserts into `semrush_backlinks_history` and `semrush_backlinks` Neon tables.

### 7 — Weekly Cloud Agent — Keywords Refresh
Scheduled Monday 3am UTC. Fetches top 50 SEMrush keyword rankings → upserts into `semrush_keywords` Neon table.

### 8 — Weekly Cloud Agent — Pages Refresh
Scheduled Monday 3am UTC. Fetches top 50 SEMrush pages → upserts into `semrush_pages` Neon table.

### 9 — Single-File API Pattern (Vercel Hobby)
All data modules in one `api/seo.js`, routed by `?module=` param. Modules: `gsc`, `semrush`, `ads`, `competitor`. Stays within Vercel Hobby serverless function limit.

---

## Data Sources

| Source | What | Updated |
|---|---|---|
| Ledsone PostgreSQL (read-only) | GSC clicks, impressions, CTR, position | Daily (automatic) |
| Ledsone PostgreSQL (read-only) | Google Ads spend, ROAS | Daily (automatic) |
| Neon PostgreSQL (read+write) | SEMrush rankings, pages, backlinks | Weekly (Monday agent) |
| SEMrush MCP | Fetched by cloud agents | Weekly |

## Neon Tables

| Table | Primary Key | Key Columns |
|---|---|---|
| `semrush_backlinks_history` | `snapshot_date` | total_backlinks, referring_domains |
| `semrush_backlinks` | `id` | authority_score, total_backlinks, referring_domains, follow_links, nofollow_links |
| `semrush_keywords` | `(snapshot_date, keyword)` | position, volume, keyword_difficulty, intent, url |
| `semrush_pages` | `(snapshot_date, page_url)` | traffic, keywords_count, traffic_share, page_type |
| `semrush_competitors` | `(snapshot_date, domain)` | traffic, keywords |
| `semrush_history` | `(snapshot_date)` | organic_keywords, organic_traffic |

## Business Impact

- Single dashboard replaces 4 separate reporting tools (GSC, Google Ads, SEMrush, manual backlink checks)
- Auto-generated alerts reduce weekly review time — issues surface without manual analysis
- Weekly cloud agents ensure SEMrush data is always ≤7 days old without manual refresh
- Backlinks health chart enables early detection of authority loss before it impacts rankings
