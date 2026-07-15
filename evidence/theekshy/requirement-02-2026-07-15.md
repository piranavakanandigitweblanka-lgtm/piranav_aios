# Evidence Record — Theekshy Requirement 2

**Title:** Search Term Optimisation — Evidence Record
**Task:** Requirement 2 build evidence
**Date:** 2026-07-15
**Member:** Theekshy
**Team:** Google Ads
**Requirement:** 2 — Search Term Optimisation
**Source:** requirement CSV 2026-07-15
**Dashboard Tab:** Search Terms (Requirement 2)
**Campaign Scope:** THEE_GEMS (23714290257), THEE_MYSTERY (23684837882)
**Store and Country:** LEDSone UK / United Kingdom
**Date Range:** Last 30 days · 2026-06-12 to 2026-07-12
**Latest Data Date:** 2026-07-12
**PostgreSQL Environment:** ledsone-db-mcp
**PostgreSQL Sources:** google_ads.campaign_search_term_data
**Tables or Views:** google_ads.campaign_search_term_data, information_schema.tables, information_schema.columns
**Source Grain:** Search Term per Campaign (aggregated)
**Join Keys:** campaign_id
**Files Changed:** Staff-requirements/pages/theekshy.html
**Reviewer:** GPT / Piranav

## Requirement CSV Evidence
- File found: C:\Users\PC\Downloads\What_I_Need_To_Improve_ADS_Performance - Copy of Theekshy (1).csv
- Requirement 2 section: "Search Term Optimisation — Action Log"
- Review cadence: weekly
- Fields extracted: Date Range, Search Term, Match Type, Search Intent, Impressions, Clicks, CTR%, Cost £, Conversions, CPA £, High Cost Term?, Competitor Term?, Condition Triggered, Remove or Keep?, Next Action Plan, Status
- 7 conditions in detailed table extracted
- Threshold conflict confirmed: summary says £1, detailed table says £10 for Waste Term

## AIOS Search Evidence
- Searched C:\Users\PC\Documents\piranav_aios recursively for "theekshy"
- Found: prompts/theekshy, evidence/theekshy, implementation/theekshy, validation/theekshy, deployment/theekshy, closure/theekshy, capability/theekshy (all from Req 1)
- No existing Requirement 2 files found
- No competitor brand list found in any AIOS folder
- No brand dictionary found in any AIOS folder

## Existing Dashboard Evidence
- pages/theekshy.html inspected: 635 lines
- Requirement 1 tab: fully built, Campaign Optimisation, panels 1–4 navigation
- panel-2 was placeholder: <div class="placeholder"><h2>Search Term Optimisation</h2>...</div>
- CSS design system: --ink, --muted, --line, --bg, --accent, badge classes, kpi, tbox, controls
- JS: showTab(), badgeHtml(), CAMPAIGNS object, DAILY array, PRODUCTS array, Req 1 render functions
- Chart.js 4.4.0 already loaded

## PostgreSQL Evidence

### Tables confirmed in google_ads schema
campaign_performance, campaign_search_term_data, campaign_search_term_insights, campaigns, keyword_performance, merchant_products, product_performance (and others)

### campaign_search_term_data columns
id (bigint), date (date), campaign_id (bigint), ad_group_id (bigint), search_term (text), match_type (varchar), impressions (integer), clicks (integer), conversions (numeric), conversions_value (numeric), cost (numeric), insight_id (bigint)

### campaign_search_term_insights columns
id (bigint), insight_id (bigint), campaign_id (bigint), category_label (varchar)
NOTE: This table contains search categories, not raw search terms.

### Campaign scope verification
THEE_GEMS (23714290257): 6,580 rows, earliest 2026-04-05, latest 2026-07-12
THEE_MYSTERY (23684837882): 12,954 rows, earliest 2026-04-01, latest 2026-07-12
Both campaigns confirmed present.

### Cost field: NULL for all rows
SELECT cost FROM google_ads.campaign_search_term_data WHERE campaign_id IN (23714290257,23684837882) LIMIT 5 → all NULL
PMax campaigns do not populate cost at search-term level in this source.

### 30-day aggregated query
100 terms retrieved by clicks/impressions, aggregated across 30 days
Top term by clicks: "ledsone uk" (MYSTERY) — 8 clicks, 161 imp, 0 conv
Highest converting by conv_value: "kitchen lights ideas" (MYSTERY) — 4 clicks, £97.77 conv value

### Duplicate check
GROUP BY campaign_id, search_term, match_type — confirmed no duplicates in aggregated result

### Null check
search_term: all non-null in returned rows
campaign_id: all non-null
cost: ALL NULL

### Currency
Confirmed GBP (conversions_value in £ consistent with campaign_performance values)

## No-Write Confirmation
Only SELECT statements executed. No INSERT, UPDATE, DELETE, ALTER, DROP, CREATE performed.

## Git Status
Git push: Not performed. File modified locally only.

## Deployment Status
Vercel deployment: Not performed. Approval required.

**PASS / FAIL:** PASS
