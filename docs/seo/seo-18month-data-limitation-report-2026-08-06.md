# SEO Dashboard — 18-Month Requirement vs Data Limitation Report

**Date:** 2026-08-06
**Prepared by:** Piranav
**For:** Developer / Technical Team

---

## 1. Management Requirement

Management requested:
> *"Monitor KPIs of our SEO on a weekly basis and provide visibility for the last 18 months."*

The dashboard has been built to fully support 18-month visibility with:
- 18m date preset button
- 7 KPI trend charts (Clicks, Impressions, CTR, Avg Position, Top 3 KWs, Top 10 KWs, SEMrush Traffic)
- Per-URL monthly trend charts in Landing Pages tab
- Weekly KPI cards with WoW comparison

---

## 2. Current Data Availability (as of 2026-08-06)

| Source | Data From | Data To | Months Available | Full 18m Ready |
|---|---|---|---|---|
| GSC Overview | **20 Mar 2026** | 3 Aug 2026 | **4.5 months** | ❌ No |
| GSC Page (per URL) | **20 Mar 2026** | 3 Aug 2026 | **4.5 months** | ❌ No |
| GSC Query (keywords) | **20 Mar 2026** | 3 Aug 2026 | **4.5 months** | ❌ No |
| SEMrush History | Jul 2023 | Aug 2026 | **~36 months** | ✅ Yes |
| Google Ads | Feb 2020 | Aug 2026 | **~78 months** | ✅ Yes |

---

## 3. Root Cause — Why GSC Has Only 4.5 Months

**Data flow:**
```
Google Search Console
        ↓
MySQL listing_management (gsc_* tables — 28 tables)
        ↓  [Laravel sync app — daily, rolling 10-day window]
PostgreSQL google_search_console schema
        ↓
Dashboard (staff-requirements-02.vercel.app)
```

The GSC pipeline in MySQL was only set up on **March 20, 2026**. Before that date, no GSC data was captured or backfilled from MySQL. The PostgreSQL sync inherits this limitation — it can only sync what MySQL has.

**There is no historical GSC data available before March 20, 2026 in any database.**

---

## 4. Impact on Dashboard — Gap Points

| Feature | Status | Gap |
|---|---|---|
| 18m date preset button | ✅ Built & working | Returns same data as 6m and 1y — no data gap filled |
| 6m filter | ✅ Correct | Shows Mar 20 – Aug 3 (4.5m, not 6m) |
| 1y filter | ✅ Correct | Shows Mar 20 – Aug 3 (same as 6m — no data before Mar 20) |
| 18m filter | ✅ Correct | Shows Mar 20 – Aug 3 (same as 6m — no data before Mar 20) |
| Weekly KPI cards | ✅ Working | Only last 26 weeks available (26 weeks = ~6m, pipeline only has 4.5m) |
| 18m KPI trend charts (GSC) | 🟡 Partial | Shows 5 monthly points — will auto-fill as data grows |
| 18m KPI trend charts (SEMrush) | ✅ Full | 36 months available — complete |
| Per-URL trend charts | 🟡 Partial | Shows 5-6 monthly points per URL — Mar to Aug 2026 only |
| MoM comparison table | 🟡 Partial | Only 4 complete months available (Apr, May, Jun, Jul 2026) |

---

## 5. When Will 18-Month Data Be Complete?

| Milestone | Date |
|---|---|
| 6 months of GSC data complete | **20 Sep 2026** |
| 12 months of GSC data complete | **20 Mar 2027** |
| **Full 18 months of GSC data** | **20 Sep 2027** |

Until September 2027, selecting 6m / 1y / 18m on the dashboard will return the **same dataset** because the database has no GSC data before March 20, 2026.

---

## 6. What the Developer Needs to Check / Fix

### 6a. GSC Data Gap — Is Backfill Possible?
- **Question for dev:** Does MySQL `listing_management` have any GSC data before March 20, 2026?
- If yes → run the existing backfill commands on PostgreSQL:
  ```bash
  php artisan google-search-console:backfill-page
  php artisan google-search-console:backfill-query
  php artisan google-search-console:backfill-overview
  ```
- If no → MySQL never captured pre-March data. No backfill is possible. Must wait for pipeline to accumulate.

### 6b. Data Mismatch — Dashboard vs Real GSC
- Real GSC shows **505 clicks** for `/blogs/new/e27-bulb-guide`
- Dashboard DB shows **379 clicks** (75% capture rate)
- **Root cause:** MySQL GSC tables capture partial data from GSC API (Google API returns sampled data)
- **Dev action:** Investigate whether MySQL `gsc_web_page` table has the full 505 or also shows ~379 for this URL. If MySQL also shows 379, the issue is at the GSC API level — nothing can be fixed. If MySQL shows 505 but PostgreSQL shows 379, there is a sync bug to fix.

### 6c. Dashboard Limitation Note
- The dashboard Data Quality panel already states this limitation
- No dashboard code fix is needed — the limitation is at the database/pipeline level

---

## 7. Summary for Developer

| # | Issue | Priority | Action |
|---|---|---|---|
| 1 | GSC data starts Mar 20, 2026 only | High | Check if MySQL has older data. If yes, run backfill. |
| 2 | Dashboard clicks lower than real GSC | Medium | Compare MySQL gsc_web_page vs GSC interface for same URL/date |
| 3 | 6m / 1y / 18m filters show identical data | Low (by design) | No fix needed — will resolve naturally by Sep 2027 |
| 4 | August 2026 monthly trend shows partial data | Low (by design) | No fix — month not complete yet, auto-corrects on Aug 31 |

---

## 8. Reference

| Item | Detail |
|---|---|
| Dashboard URL | https://staff-requirements-02.vercel.app/pages/seo.html |
| API file | `Staff-requirements-02/api/seo.js` |
| GSC PostgreSQL schema | `google_search_console` — tables: `overview`, `page`, `query`, `country` |
| MySQL source | `listing_management` database, `gsc_web_*` tables (28 tables) |
| Sync controller | `app/Http/Controllers/Google/GoogleSearchConsoleController.php` |
| Sync schedule | Daily — rolling 10-day window (`now()->subDays(10)`) |
| Backfill commands | `php artisan google-search-console:backfill-{overview,page,query,country}` |
| Knowledge base | `database/postgresql/schemas/google_search_console/README.md` |
