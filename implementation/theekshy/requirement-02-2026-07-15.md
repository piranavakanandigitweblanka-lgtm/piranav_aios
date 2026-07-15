# Implementation Record — Theekshy Requirement 2

**Title:** Search Term Optimisation — Implementation Record
**Task:** Add Requirement 2 tab to pages/theekshy.html
**Date:** 2026-07-15
**Member:** Theekshy
**Team:** Google Ads
**Requirement:** 2 — Search Term Optimisation
**Source:** requirement CSV 2026-07-15
**Objective:** Weekly PMax search-term review with CTR-based classification and Remove/Keep recommendations.
**Dashboard Tab:** Search Terms (Requirement 2 — Search Term Optimisation)
**Campaign Scope:** THEE_GEMS (23714290257), THEE_MYSTERY (23684837882)
**Store and Country:** LEDSone UK / United Kingdom
**Date Range:** Last 30 days aggregated · 2026-06-12 to 2026-07-12
**Latest Data Date:** 2026-07-12
**PostgreSQL Environment:** ledsone-db-mcp
**PostgreSQL Sources:** google_ads.campaign_search_term_data (confirmed both campaigns present)
**Tables or Views:** google_ads.campaign_search_term_data
**Source Grain:** Search Term per Campaign, aggregated (impressions/clicks/conversions/conv_value; cost is NULL)
**Join Keys:** campaign_id — matched to CAMPAIGNS object in JS
**Files Changed:** Staff-requirements/pages/theekshy.html (panel-2 replaced, JS extended)
**Reviewer:** GPT / Piranav

## Implementation Summary

### Approach
- Replaced panel-2 placeholder with full Requirement 2 UI
- Added TERMS array (100 search terms) embedded from verified PostgreSQL queries
- All business rule logic implemented in JavaScript

### Data Flow
1. PostgreSQL SELECT (read-only) → campaign_search_term_data → last 30 days, both campaigns
2. Aggregated by term + campaign: SUM(impressions, clicks, conversions, conversions_value)
3. cost field confirmed NULL for both PMax campaigns — documented in UI and AIOS
4. Embedded as TERMS[] JS constant in theekshy.html
5. Business rules applied client-side via r2GetConditions(), r2PrimaryCondition(), r2GetStatus()

### Aggregation Logic
GROUP BY campaign_id, search_term, match_type
WHERE date >= CURRENT_DATE - 30 AND campaign_id IN (23714290257, 23684837882)
HAVING SUM(impressions) > 0

### Formulas
- CTR = clicks / impressions × 100 — null when impressions = 0
- CPA = cost / conversions — null when conversions = 0 or cost null
- All cost-based rules: N/A (cost null in source)

### Condition Precedence (JS R2_PREC array)
1. Waste Term (cost null — inactive)
2. High Cost Term (cost null — inactive)
3. Low CTR
4. Competitor Term (manual only)
5. Branded / High Conversion (intent unclassified)
6. Good Performer
7. Borderline CTR
8. Early Waste Warning (cost null — inactive)
9. Unclassified

### UI Components Added
- Req 2 header with review dates
- Data limitation banner (cost null, competitor list absent, intent absent)
- 8 KPI cards
- Filter bar (campaign, condition, status, text search, reset)
- 100-row sortable/filterable action table (21 columns)
- 2 charts (condition distribution doughnut, CTR bar top 20)
- Rule-based insights panel
- Validation section
- Business rules footnote

### Assets Reused
- CSS design system from Req 1 (badge, kpi, tbox, controls, charts-grid, fn classes)
- CAMPAIGNS object and badgeHtml() from Req 1 JS
- safeCtr() pattern reimplemented as r2SafeCtr() to avoid collision

### Duplicate Prevention
- All Req 2 JS functions prefixed r2* or R2_
- No Req 1 functions modified
- Req 2 init called after Req 1 init in same script block

### Known Limitations
- Cost field NULL in campaign_search_term_data for PMax campaigns — Rules 1, 2, Early Waste Warning inactive
- No competitor brand dictionary found in AIOS — Rule 3 manual only
- No search intent field in source — Rule 7 (Branded/High Conv) inactive
- 100 terms returned by clicks; zero-click terms (impressions only) not embedded

## Business Rules
Rules 1, 2: Inactive (cost null). Rule 3: Manual review only. Rules 4–6: Active. Rule 7: Inactive (no intent field).
Early Waste Warning: Inactive (cost null).

**Status:** PASS
