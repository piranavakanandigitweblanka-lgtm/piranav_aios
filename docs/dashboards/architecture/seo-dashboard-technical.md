# SEO Intelligence Dashboard — Full Technical Reference
**Last updated:** 2026-08-03  
**Dashboard URL:** https://staff-requirements-02.vercel.app/pages/seo.html  
**Repo:** https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios  
**Repo path:** `Staff-requirements-02/`

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (Vanilla JS)                    │
│  seo.html — 6-tab SPA, Chart.js, no framework               │
└──────────────────────┬──────────────────────────────────────┘
                       │ fetch() API calls
┌──────────────────────▼──────────────────────────────────────┐
│              VERCEL SERVERLESS API                           │
│  Staff-requirements-02/api/seo.js                           │
│  Single file, routes by ?module= param                      │
│  maxDuration: 60s (vercel.json)                             │
└───────────┬──────────────────────┬──────────────────────────┘
            │                      │
┌───────────▼──────────┐  ┌───────▼────────────────────────┐
│  PostgreSQL (Ledsone)│  │  Neon PostgreSQL (SEMrush)     │
│  169.58.91.229:5432  │  │  eu-west-2 (AWS)               │
│  db: ledsone         │  │  db: neondb                    │
│  READ-ONLY           │  │  READ + WRITE                  │
│  GSC + Ads data      │  │  SEMrush snapshots             │
└──────────────────────┘  └────────────────────────────────┘
                                    ▲
                          ┌─────────┴──────────┐
                          │  Claude Code Cloud  │
                          │  Scheduled Agents   │
                          │  (Weekly Monday)    │
                          └─────────────────────┘
                                    ▲
                          ┌─────────┴──────────┐
                          │  SEMrush MCP        │
                          │  connector          │
                          └─────────────────────┘
```

---

## 2. Data Sources

### 2.1 PostgreSQL — Ledsone Production DB (Read-Only)

| Property | Value |
|---|---|
| Host | `169.58.91.229` |
| Port | `5432` |
| Database | `ledsone` |
| Access | Read-only |
| Env var | `DATABASE_URL` (set in Vercel project settings) |
| SSL | `rejectUnauthorized: false` |
| Connection timeout | 15,000ms |
| Statement timeout | 30,000ms |

**Tables used:**

| Table | Schema | Data |
|---|---|---|
| `google_search_console.overview` | `date, clicks, impressions, position, sub_source, search_type` | GSC daily totals. Filter: `sub_source=104, search_type='web'` |
| `google_search_console.query` | `date, query, clicks, impressions, position, sub_source, search_type` | GSC keyword-level data. 61,228 distinct queries |
| `google_search_console.query_page` | `date, query, page, clicks, sub_source, search_type` | GSC keyword+page join. Privacy-thresholded |
| `google_search_console.page` | `date, page, clicks, impressions, position, sub_source, search_type` | GSC page-level data |
| `google_ads.campaign_performance` | `date, campaign_id, clicks, impressions, cost, conversion_value` | Google Ads daily performance |
| `google_ads.campaigns` | `campaign_id, account_id, name` | Campaign metadata |

**Key constants in api/seo.js:**
```js
const ADS_ACCOUNT    = 4503486236;   // Google Ads UK account ID
const GSC_SUB_SOURCE = 104;          // ledsone.co.uk GSC property ID
```

**Data coverage:**
- GSC: 20 Mar 2026 – present (~50% of true click totals due to device-level thresholding)
- Google Ads: Feb 2020 – present (cost in GBP, UK account)

---

### 2.2 Neon PostgreSQL — SEMrush Data Store (Read + Write)

| Property | Value |
|---|---|
| Host | `ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech` |
| Port | `5432` |
| Database | `neondb` |
| User | `neondb_owner` |
| Password | `npg_aX4pf0IeqQEC` |
| Region | eu-west-2 (AWS London) |
| SSL | `sslmode=require` |
| Full connection string | `postgresql://neondb_owner:npg_aX4pf0IeqQEC@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require` |
| Env var | `NEON_DATABASE_URL` (set in Vercel project settings) |

**Tables:**

#### `semrush_history`
```sql
CREATE TABLE semrush_history (
  month                DATE PRIMARY KEY,
  rank                 INTEGER,
  organic_keywords     INTEGER,
  kw_top3              INTEGER,
  kw_top4_10           INTEGER,
  kw_top11_20          INTEGER,
  kw_top21_100         INTEGER,
  traffic_est          INTEGER,
  traffic_cost_gbp     NUMERIC(12,2),
  paid_keywords        INTEGER,
  paid_traffic         INTEGER,
  fetched_at           TIMESTAMPTZ DEFAULT NOW()
);
```
- 36 rows loaded (Jul 2023 – Jul 2026)
- Refreshed daily by scheduled agent

#### `semrush_competitor_history`
```sql
CREATE TABLE semrush_competitor_history (
  month                DATE,
  domain               TEXT,
  rank                 INTEGER,
  organic_keywords     INTEGER,
  traffic_est          INTEGER,
  traffic_cost_gbp     NUMERIC(12,2),
  fetched_at           TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (month, domain)
);
```
- 185 rows (5 competitors × ~37 months, Apr 2023 – Jul 2026)
- Competitors: lightingcompany.co.uk, ledhut.co.uk, industville.co.uk, thevintagelightbulbcompany.com, lampspares.co.uk
- Refreshed weekly by scheduled agent

#### `semrush_keywords`
```sql
CREATE TABLE semrush_keywords (
  snapshot_date        DATE,
  keyword              TEXT,
  position             INTEGER,
  prev_position        INTEGER,
  volume               INTEGER,
  cpc                  NUMERIC(8,2),
  url                  TEXT,
  traffic              INTEGER,
  keyword_difficulty   NUMERIC(5,2),
  intent               TEXT,
  fetched_at           TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (snapshot_date, keyword)
);
```
- 100 rows per weekly snapshot
- Source: SEMrush `resource_organic` report, UK database, sorted by traffic desc

#### `semrush_pages`
```sql
CREATE TABLE semrush_pages (
  snapshot_date        DATE,
  page_url             TEXT,
  traffic              INTEGER,
  keywords_count       INTEGER,
  traffic_share        NUMERIC(6,2),
  page_type            TEXT,   -- homepage | blog | collection | product | other
  fetched_at           TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (snapshot_date, page_url)
);
```
- 50 rows per weekly snapshot
- Source: SEMrush `resource_organic_unique` report, UK database, sorted by traffic desc

#### `semrush_backlinks`
```sql
CREATE TABLE semrush_backlinks (
  snapshot_date        DATE PRIMARY KEY,
  authority_score      INTEGER,
  total_backlinks      INTEGER,
  referring_domains    INTEGER,
  referring_ips        INTEGER,
  follow_links         INTEGER,
  nofollow_links       INTEGER,
  fetched_at           TIMESTAMPTZ DEFAULT NOW()
);
```
- 1 row per weekly snapshot (current state)

#### `semrush_backlinks_history`
```sql
CREATE TABLE semrush_backlinks_history (
  snapshot_date        DATE PRIMARY KEY,
  total_backlinks      INTEGER,
  referring_domains    INTEGER,
  fetched_at           TIMESTAMPTZ DEFAULT NOW()
);
```
- 24 rows (Aug 2024 – Jul 2026, monthly)
- Peak: 132,993 backlinks / 2,655 referring domains (Aug 2024)
- Current: 18,276 backlinks / 616 referring domains (Jul 2026) — 86% drop

---

### 2.3 SEMrush MCP

| Property | Value |
|---|---|
| Connector name | `Semrush` |
| Connector UUID | `56a453d4-a573-4213-8e58-130c6a68c10c` |
| MCP URL | `https://mcp.semrush.com/claude/v1/mcp` |
| Target domain | `ledsone.co.uk` |
| Database | `uk` |

**Reports used:**

| Report name | Purpose |
|---|---|
| `resource_rank_history` | Monthly domain rank, traffic, keyword counts |
| `resource_organic` | Top 100 ranking keywords with position, volume, CPC, traffic |
| `resource_organic_unique` | Top 50 pages by organic traffic |
| `backlinks_research` → `backlinks_overview` | Current AS, total backlinks, referring domains |
| `backlinks_research` → `backlinks_historical` | Monthly backlink history (Unix timestamps) |

---

## 3. Vercel Deployment

| Property | Value |
|---|---|
| Platform | Vercel Hobby |
| Team | `digitalmarketing69140951-sys-projects` |
| Team ID | `team_3yn5bmAF7peUPYM7LJcj07PF` |
| Project | `staff-requirements-02` |
| Project ID | `prj_5dGSos7ZXDK3knlASnFNgXHCMFpf` |
| Production URL | `https://staff-requirements-02.vercel.app` |
| Deploy method | `vercel --prod` (CLI, manual trigger) |
| Auto-deploy from Git | ❌ Not connected (git push does NOT auto-deploy) |
| Function timeout | 60 seconds (`vercel.json`) |
| Node.js runtime | 24.x |

**Environment variables set in Vercel project settings:**
- `DATABASE_URL` — PostgreSQL (Ledsone) connection string
- `NEON_DATABASE_URL` — Neon PostgreSQL connection string

**To deploy:**
```bash
cd Staff-requirements-02
vercel --prod
```

---

## 4. API Routes — `api/seo.js`

All routes are served from a single serverless function to stay within Vercel Hobby function limit.

**Base URL:** `https://staff-requirements-02.vercel.app/api/seo`

### Module: `exec`
| Route | Description | DB |
|---|---|---|
| `?module=exec&type=gsc-monthly` | Monthly GSC clicks, impressions, avg position | PostgreSQL |
| `?module=exec&type=position-dist` | Keyword position bucket distribution (current month) | PostgreSQL |
| `?module=exec&type=ads-monthly` | Monthly Ads spend, ROAS, campaigns | PostgreSQL |
| `?module=exec&type=data-quality` | Coverage metadata for all data sources | PostgreSQL |

### Module: `semrush`
| Route | Description | DB |
|---|---|---|
| `?module=semrush&type=history` | 36-month SEMrush domain history | Neon |
| `?module=semrush&type=competitors` | Competitor traffic history (5 domains) | Neon |
| `?module=semrush&type=backlinks` | Current backlinks snapshot | Neon |
| `?module=semrush&type=backlinks-history` | 24-month backlinks trend | Neon |
| `?module=semrush&type=keywords` | Top 100 keywords (latest snapshot) | Neon |
| `?module=semrush&type=pages` | Top 50 pages by traffic (latest snapshot) | Neon |

### Module: `keywords`
| Route | Description | DB |
|---|---|---|
| `?module=keywords&type=top` | Top GSC keywords by clicks | PostgreSQL |
| `?module=keywords&type=opportunity` | Keywords with high impressions, low position | PostgreSQL |
| `?module=keywords&type=rising` | Keywords improving position (last 30 days) | PostgreSQL |
| `?module=keywords&type=declining` | Keywords losing position (last 30 days) | PostgreSQL |

### Module: `products`
| Route | Description | DB |
|---|---|---|
| `?module=products&type=pages` | Product pages by GSC clicks | PostgreSQL |
| `?module=products&type=listings` | Product listing performance | PostgreSQL |

### Module: `landing`
| Route | Description | DB |
|---|---|---|
| `?module=landing&type=pages` | All landing pages by GSC clicks | PostgreSQL |
| `?module=landing&type=by-type` | Pages grouped by type | PostgreSQL |
| `?module=landing&type=top-pages` | Month-on-month page comparison | PostgreSQL |

---

## 5. Frontend — `pages/seo.html`

**Stack:** Vanilla HTML + CSS + JavaScript. No build step, no framework.  
**Charts:** Chart.js (loaded from CDN)  
**Single file:** ~2,200+ lines

### Tab Structure

| Tab | ID | Load function | Status |
|---|---|---|---|
| Executive Overview | `tab-exec` | `loadExec()` | Live |
| Product Intelligence | `tab-products` | `loadProducts()` | Live |
| Keyword Intelligence | `tab-keywords` | `loadKeywords()` | Live |
| Landing Pages | `tab-landing` | `loadLanding()` | Live |
| Action Centre | `tab-actions` | — | Live |
| Technical SEO | `tab-technical` | — | Live |

### Key JS Functions

| Function | Purpose |
|---|---|
| `loadExec()` | Fetches all 8 API endpoints in parallel, calls `renderExec()` |
| `renderExec(csv, gscRows, posRows, adsRows, dqSrc, compRows, blRows, blCurrent)` | Builds SEO alerts, KPI cards, all charts, MoM table |
| `renderSemrushKw()` | Renders SEMrush Rankings table in Keywords tab |
| `renderSemrushPages()` | Renders SEMrush Pages table in Landing Pages tab |
| `loadKeywords(subType)` | Loads GSC keyword sub-tabs + SEMrush Rankings |
| `loadLanding(subType)` | Loads GSC landing page sub-tabs + SEMrush Pages |
| `switchTab(id, btn)` | Tab navigation, lazy-loads data on first open |

### SEO Alerts Logic (auto-generated in `renderExec`)

| Alert | Trigger | Severity |
|---|---|---|
| Backlink drop | `total_backlinks` drop ≥50% from earliest to latest history row | Critical 🔴 |
| Domain rank decline | Rank worsened >50,000 places over 6 months | Critical 🔴 |
| Domain rank decline (minor) | Rank worsened 10,000–50,000 places | Warning 🟡 |
| Traffic MoM drop | Traffic estimate down ≥20% month-on-month | Warning 🟡 |
| Traffic 6-month drop | Traffic estimate down ≥50% over 6 months | Critical 🔴 |
| Keyword count drop | Organic keywords down ≥30% over 6 months | Warning 🟡 |
| ROAS healthy | ROAS ≥ 3x | Good 🟢 |

### Chart IDs

| Chart | Canvas ID | Data source |
|---|---|---|
| Organic trend + GSC overlay | `chart-trend` | Neon + PostgreSQL |
| Position distribution donut | `chart-donut` | PostgreSQL |
| Google Ads spend + ROAS | `chart-ads` | PostgreSQL |
| Competitor traffic | `chart-competitors` | Neon |
| Backlinks health (dual axis) | `chart-backlinks` | Neon |

---

## 6. Scheduled Agents (Claude Code Cloud)

All agents run **every Monday at 3:00 AM UTC** (8:30 AM Asia/Colombo).  
Manage at: https://claude.ai/code/routines

| Agent | Routine ID | MCP | What it does |
|---|---|---|---|
| SEMrush Daily History | *(existing)* | Semrush | Fetches latest 3 months of rank/traffic history → upserts `semrush_history` |
| SEMrush Competitor Weekly | *(existing)* | Semrush | Fetches competitor traffic history → upserts `semrush_competitor_history` |
| SEMrush Backlinks Weekly | `trig_018pJfVbpNBx28ts6K3tkgHG` | Semrush | Fetches backlinks overview + 3 history rows → upserts `semrush_backlinks` + `semrush_backlinks_history` |
| SEMrush Keywords Weekly | `trig_014i3fxSK7keGtmr5dwL7c4a` | Semrush | Fetches top 100 keywords → upserts `semrush_keywords` |
| SEMrush Pages Weekly | `trig_015oKF9135BduUvNk3Wa8N3Z` | Semrush | Fetches top 50 pages → upserts `semrush_pages` |

**Agent runtime:**
- Model: `claude-sonnet-4-6`
- Environment: `env_01TdLC2qEj1RZF4KfdswVr5x` (Anthropic Cloud Default)
- Repo: `https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios`
- Tools: Bash, Read, Write, Edit, Glob, Grep
- Each agent: `cd Staff-requirements-02 && npm install` then runs Node.js script with `pg` package

---

## 7. Repository Structure

```
piranav_aios/
└── Staff-requirements-02/
    ├── api/
    │   └── seo.js              # Single serverless API function
    ├── pages/
    │   └── seo.html            # Full dashboard SPA (~2,200 lines)
    ├── assets/                 # Static assets
    ├── data/                   # Static CSV data files
    ├── docs/                   # Documentation
    ├── scripts/                # Utility scripts
    ├── package.json            # { "dependencies": { "pg": "^8.22.0" } }
    ├── vercel.json             # { "functions": { "api/**/*.js": { "maxDuration": 60 } } }
    └── .vercel/
        └── project.json        # projectId, orgId
```

---

## 8. Key Known Issues & Notes

| Issue | Detail |
|---|---|
| GSC clicks ~50% of true total | PostgreSQL pipeline stores device-level data; overview table has thresholding. Use for trend direction only |
| Vercel no static IP | Hobby plan has no fixed outbound IPs — cannot whitelist for external DBs that require IP allowlisting |
| No Vercel Git auto-deploy | GitHub not connected to Vercel auto-deploy; must run `vercel --prod` manually after each push |
| SEMrush data is UK database | All SEMrush reports use `database: 'uk'` — global traffic not reflected |
| Backlink drop (critical finding) | 86% drop in backlinks (132,993 → 18,276) and 77% drop in referring domains (2,655 → 616) between Aug 2024 and Jul 2026 — root cause unknown, likely link rot or penalty |
| `semrush_history` daily agent | Fetches only latest 3 rows per run — full 36-month history was loaded manually |
| MoM table GSC/Ads flags | Uses live data presence checks (`!!gsc.clicks`, `!!ads.cost_gbp`) not `data_flags` string matching |

---

## 9. Data Flow — End to End

```
SEMrush API
    ↓ (SEMrush MCP connector)
Claude Code Cloud Agent (weekly/daily)
    ↓ (Node.js + pg)
Neon PostgreSQL (neondb)
    ↓ (NEON_DATABASE_URL env var)
Vercel API (api/seo.js → handleSemrush())
    ↓ (?module=semrush&type=...)
Browser fetch() in seo.html
    ↓
renderExec() / renderSemrushKw() / renderSemrushPages()
    ↓
Chart.js charts + HTML tables on screen

PostgreSQL (Ledsone DB)
    ↓ (DATABASE_URL env var)
Vercel API (api/seo.js → handleGscMonthly() etc.)
    ↓ (?module=exec&type=...)
Browser fetch() in seo.html
    ↓
renderExec() KPI cards + MoM table + overlays
```

---

*Document generated 2026-08-03. Keep updated when new agents, tables, or API routes are added.*
