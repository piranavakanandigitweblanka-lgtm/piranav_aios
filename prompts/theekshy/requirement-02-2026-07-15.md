# Prompt Record — Theekshy Requirement 2

**Title:** Search Term Optimisation — Prompt Record
**Task:** Build Requirement 2 inside pages/theekshy.html
**Date:** 2026-07-15
**Member:** Theekshy
**Team:** Google Ads
**Requirement:** 2 — Search Term Optimisation
**Source:** C:\Users\PC\Downloads\What_I_Need_To_Improve_ADS_Performance - Copy of Theekshy (1).csv
**Objective:** Weekly search-term review flagging waste, competitor, and low-CTR terms with Remove/Keep decisions.
**Dashboard Tab:** Requirement 2 — Search Term Optimisation (Search Terms)
**Campaign Scope:**
- Pmax UK | Theekshy | Shoptimised | THEE_GEMS | ORDERS>1 | MCV | UK (ID: 23714290257)
- Pmax | Theekshy | Shoptimised | THEE_MYSTERY| Non-Converting | MCV | UK (ID: 23684837882)
**Store and Country:** LEDSone UK / United Kingdom
**Date Range:** Last 30 days (2026-06-12 to 2026-07-12)
**Latest Data Date:** 2026-07-12
**PostgreSQL Environment:** ledsone-db-mcp (read-only)
**PostgreSQL Sources:** google_ads.campaign_search_term_data
**Tables or Views:** google_ads.campaign_search_term_data, google_ads.campaigns
**Source Grain:** Search Term per Campaign (aggregated across 30 days)
**Files Changed:** Staff-requirements/pages/theekshy.html
**Reviewer:** GPT / Piranav

## Requirement Summary
Recurring weekly review of search terms. Flags: Cost >£1 & 0 conv (summary); Cost >£10 & 0 conv (official Waste Term); Cost >£20 (High Cost); CTR <1.5% (Low CTR); CTR 1.5–3% (Borderline); CTR ≥3% & conv>0 (Good Performer); Branded & conv>2 (Branded/High Conv). Remove/Keep decision per term.

## Threshold Conflict
Requirement summary: "cost above £1 and 0 conversions" — Resolution: Use detailed conditions table (£10 Waste Term). Early Waste Warning shown separately for £1–£10 range. Cost field is NULL in source — both thresholds currently inapplicable.

## Restrictions
- No git commit or push
- No Vercel deployment
- No PostgreSQL writes
- No invented competitor brands
- No invented search intent
- No sample CSV rows as live data
- Must not overwrite Requirement 1

## PASS/FAIL Conditions
PASS: Both campaigns confirmed; CTR rules active; cost limitation documented; no invented data; Req 1 intact; all 7 AIOS files created; no git push; no deployment.
FAIL: Wrong campaigns; invented data; cost rules shown as active when null; Req 1 broken; git push performed.

**Status:** PASS
