# Evidence Pack — SEO Intelligence Dashboard

- **Date:** 2026-08-03
- **Author:** Piranav
- **Project:** LEDSone SEO Intelligence Dashboard
- **Business Impact:** Unified live SEO reporting — GSC + Google Ads + SEMrush in one dashboard. Auto-alerts replace manual weekly review.
- **Validation Status:** PASS

---

## Live Dashboard

| Item | Value |
|---|---|
| Production URL | https://staff-requirements-02.vercel.app/pages/seo.html |
| Vercel Project | staff-requirements-02 |
| Vercel Team | digitalmarketing69140951-sys-projects |
| Repo | piranavakanandigitweblanka-lgtm/piranav_aios |
| File — HTML | Staff-requirements-02/pages/seo.html |
| File — API | Staff-requirements-02/api/seo.js |

---

## API Endpoints (Live)

| Endpoint | Module | Type | Data |
|---|---|---|---|
| `/api/seo?module=gsc&type=trend` | gsc | trend | GSC daily clicks + impressions (30d) |
| `/api/seo?module=gsc&type=position` | gsc | position | Avg position by month |
| `/api/seo?module=ads` | ads | — | Google Ads spend + ROAS (30d) |
| `/api/seo?module=competitor` | competitor | — | SEMrush competitor traffic |
| `/api/seo?module=semrush&type=backlinks` | semrush | backlinks | Current authority score + link counts |
| `/api/seo?module=semrush&type=backlinks-history` | semrush | backlinks-history | Historical backlinks time series |
| `/api/seo?module=semrush&type=keywords` | semrush | keywords | Top 50 keyword rankings |
| `/api/seo?module=semrush&type=pages` | semrush | pages | Top 50 pages by traffic |

---

## Neon Database

| Item | Value |
|---|---|
| Host | ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech |
| Database | neondb |
| User | neondb_owner |
| Region | eu-west-2 |
| Env var | NEON_DATABASE_URL (set in Vercel) |

### Tables

| Table | Rows (approx) | Last Updated |
|---|---|---|
| semrush_backlinks_history | Growing weekly | 2026-08-03 |
| semrush_backlinks | 1 (current) | 2026-08-03 |
| semrush_keywords | 50 per snapshot | 2026-08-03 |
| semrush_pages | 50 per snapshot | 2026-08-03 |
| semrush_competitors | varies | 2026-08-03 |
| semrush_history | Growing weekly | 2026-08-03 |

---

## Ledsone PostgreSQL Sources

| Item | Value |
|---|---|
| Source | Ledsone DB (read-only, via ledsone-db-mcp) |
| GSC sub_source | 104 |
| Google Ads account | 4503486236 |
| GSC schema | `google_search_console` (gsc_clicks, gsc_pages) |
| Ads schema | `google_ads` (campaign_performance) |

---

## Cloud Agents

| Agent | Schedule | MCP | Purpose |
|---|---|---|---|
| SEO Backlinks Weekly Refresh | Monday 3am UTC | Semrush | Fetch backlinks → Neon |
| SEO Keywords Weekly Refresh | Monday 3am UTC | Semrush | Fetch top 50 keywords → Neon |
| SEO Pages Weekly Refresh | Monday 3am UTC | Semrush | Fetch top 50 pages → Neon |

Manage: https://claude.ai/code/routines

---

## SEMrush MCP

| Item | Value |
|---|---|
| Connector UUID | 56a453d4-a573-4213-8e58-130c6a68c10c |
| Name | Semrush |
| URL | https://mcp.semrush.com/claude/v1/mcp |

---

## Validation Evidence

- Dashboard loads and all 6 tabs render without console errors
- Executive Overview shows GSC KPIs, Google Ads KPIs, and SEMrush KPIs in single view
- SEO Alerts panel auto-generates from live data on every load
- Backlinks Health chart renders dual-axis time series
- SEMrush Rankings sub-tab shows keyword table with colour badges
- SEMrush Pages sub-tab shows page type cards + 50-row table
- All 3 cloud agents created and confirmed in claude.ai/code/routines
- API returns 200 for all 8 endpoints when tested live

---

## Technical Reference

Full A-Z technical reference: `docs/seo-dashboard-technical.md`  
Simple blueprint: `docs/seo-dashboard-blueprint.md`
