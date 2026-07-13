# Sonya Req5 — Stop Waste Spend Implementation

**Title:** Stop Waste Spend Tab — Implementation Notes
**Task:** sonya-requirement-5-stop-waste-spend
**Date:** 2026-07-13
**Member:** Piranav
**Team:** Google Ads Team
**Requirement Source:** GPT-approved Requirement 5 brief
**PostgreSQL Sources:** google_ads.campaign_performance, google_ads.campaigns, google_ads.asset_performance, google_ads.campaign_search_term_data
**Files Changed:** Staff-requirements/pages/sonya.html
**Reviewer:** GPT

---

## Architecture

Follows the established static-embed pattern used in Req1–4:
- Data queried from PostgreSQL read-only
- Embedded as `const SWS_CAMPAIGNS=[...]` JS array in sonya.html
- No credentials exposed in browser
- showTab override chain extended: R5 → R2 → R4 → R3 → original

## HTML Changes

Panel-5 placeholder replaced with full Stop Waste Spend tab:
- 5 KPI cards: Campaigns, Wasteful Products, Wasteful Assets, Neg Keywords, Geo Exclude
- 2 filter dropdowns (Segment, Stage) + text search + Export CSV button
- 20-column table: Campaign Name, ID, Budget, Segment, Stage, 3× period columns (Cost/ROAS%/Conv/CV), Wasteful Products, Wasteful Assets, Neg Keywords, Geo Exclude
- 3-coloured period headers: blue (L30d), amber (Prev 30d), green (Prev 60–90d)

## JS Constants

`SWS_AS_OF` = '2026-07-13'

`SWS_CAMPAIGNS` = 10 campaign objects (all Sonya campaigns with any 90d data). Each contains:
- name, id, budget
- cost30/conv30/cv30/imp30/clk30
- cost60/conv60/cv60
- cost90/conv90/cv90
- wasteful_products[] (empty — 0 found at threshold)
- wasteful_assets[] (17 total across 3 campaigns)
- neg_keywords[] (44 total across 4 campaigns)
- geo_excludes[] (empty — no DB source)

## JS Functions Added

- `swsGetRoas(cv, cost)` — ROAS calculation
- `swsGetSegment(c)` — OK/Bad/New based on ROAS30 vs ROAS60 comparison
- `swsGetStage(c)` — Green/Amber/Orange/Red/No Data based on 30d ROAS
- `swsSegClass(seg)` / `swsStageClass(s)` — CSS badge classes
- `swsRender()` — renders swsActiveData into #swsTbody, updates KPIs
- `swsUpdateKpis()` — updates 5 KPI card values
- `swsApplyFilters()` — filters by search text, segment, stage
- `swsExportCSV()` — exports all SWS_CAMPAIGNS as CSV download
- `showTab` override for n===5

## showTab Chain

Before: R2 → R4 → R3 → original
After:  R5 → R2 → R4 → R3 → original

## Status: COMPLETE

## Known Risks
- 10 campaigns in DB with no 90d performance data are not shown (paused)
- Wasteful products: 0 found at current thresholds
- Geo: no data source in DB

## Next Action
- GPT review before git push
- Consider whether paused campaigns should also show in table

## PASS / FAIL: PASS
