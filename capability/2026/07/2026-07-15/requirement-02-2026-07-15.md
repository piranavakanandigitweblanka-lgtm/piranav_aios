# Capability Record — Theekshy Requirement 2

**Title:** Weekly PMax Search Term Optimisation Analysis
**Task:** Reusable capability documentation
**Date:** 2026-07-15
**Member:** Theekshy
**Team:** Google Ads
**Requirement:** 2 — Search Term Optimisation
**Dashboard Tab:** Search Terms (Requirement 2)
**Campaign Scope:** THEE_GEMS (23714290257), THEE_MYSTERY (23684837882)
**Store and Country:** LEDSone UK / United Kingdom
**PostgreSQL Environment:** ledsone-db-mcp
**PostgreSQL Sources:** google_ads.campaign_search_term_data
**Tables or Views:** google_ads.campaign_search_term_data
**Source Grain:** Search Term per Campaign (aggregated 30 days)
**Files Changed:** Staff-requirements/pages/theekshy.html
**Reviewer:** GPT / Piranav

## Capability Description
Weekly Google Ads / PMax search-term optimisation analysis with CTR-based classification, cost-based waste detection (when cost data available), competitor term review, and Remove/Keep recommendations with a 7-day review cycle.

## Inputs
- google_ads.campaign_search_term_data (campaign_id, search_term, impressions, clicks, conversions, conversions_value, cost — note: cost null for PMax)
- Campaign scope: authoritative campaign IDs only
- Date range: configurable (default last 30 days)
- Competitor brand list (external — required for Rule 3)
- Brand term dictionary (external — required for Rule 7)

## Outputs
- Per-term condition classification (Low CTR / Borderline CTR / Good Performer / Waste Term / High Cost / Competitor / Branded)
- Primary condition (highest severity per precedence)
- All conditions triggered
- Recommended Decision (Remove / Keep / Review / Manual Decision / Monitor / Pending)
- Logged Decision (Pending — write-back not available)
- Next Action Plan
- Status badge (Critical / Monitor / Healthy / Review)
- Next Review Date (generated date + 7 days)
- KPI summary cards
- Condition distribution chart
- CTR bar chart

## Formulas
- CTR = Clicks / Impressions × 100 (null when impressions = 0)
- CPA = Cost / Conversions (null when conv = 0 or cost null)
- Conv Rate = Conversions / Clicks × 100 (null when clicks = 0) — optional
- Precedence: Waste Term > High Cost > Low CTR > Competitor > Branded/High Conv > Good Performer > Borderline CTR > Early Waste Warning > Unclassified

## Thresholds (Official — Detailed Conditions Table)
- High Cost Term: Cost > £20
- Waste Term: Cost > £10 AND Conv = 0
- Early Waste Warning (supplementary, from requirement summary): Cost > £1 AND Cost ≤ £10 AND Conv = 0
- Low CTR: CTR < 1.5%
- Borderline CTR: 1.5% ≤ CTR < 3.0%
- Good Performer: CTR ≥ 3.0% AND Conv > 0
- Branded/High Conv: Intent = Branded AND Conv > 2

## Dependencies
- Authoritative campaign IDs (from google_ads.campaigns)
- google_ads.campaign_search_term_data with cost field populated (currently null for PMax)
- Competitor brand list (AIOS — not yet provided)
- Brand term dictionary (AIOS — not yet provided)
- Chart.js 4.4.0 (loaded in theekshy.html)

## Limitations
1. Cost is NULL in campaign_search_term_data for PMax campaigns — activate High Cost, Waste Term, Early Waste Warning rules when a cost source is available
2. No search intent field — classify intent from brand dictionary when available
3. Competitor detection requires authoritative brand list
4. Logged Decision requires a write-back or action-log source (currently recommendation-only)
5. 100-term limit in embedded dataset (top terms by clicks)

## Reuse Guidance
- Pattern is reusable for any Google Ads member with search-term data in google_ads.campaign_search_term_data
- Replace CAMPAIGNS object and campaign IDs for different members
- All rule thresholds are configurable via R2_* constants
- Competitor list can be added as an array to enable automatic Rule 3 detection
- Brand dictionary can be added as an array to enable Rule 7 classification

**Status:** PASS
