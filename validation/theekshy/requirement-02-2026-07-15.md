# Validation Record — Theekshy Requirement 2

**Title:** Search Term Optimisation — Validation Record
**Task:** Requirement 2 validation
**Date:** 2026-07-15
**Member:** Theekshy
**Team:** Google Ads
**Requirement:** 2 — Search Term Optimisation
**Source:** requirement CSV 2026-07-15
**Dashboard Tab:** Search Terms (Requirement 2)
**Campaign Scope:** THEE_GEMS (23714290257), THEE_MYSTERY (23684837882)
**Store and Country:** LEDSone UK / United Kingdom
**Date Range:** Last 30 days · 2026-07-12
**Latest Data Date:** 2026-07-12
**PostgreSQL Environment:** ledsone-db-mcp
**PostgreSQL Sources:** google_ads.campaign_search_term_data
**Tables or Views:** google_ads.campaign_search_term_data
**Source Grain:** Search Term per Campaign (aggregated)
**Files Changed:** Staff-requirements/pages/theekshy.html
**Reviewer:** GPT / Piranav

## Validation Tests

| # | Test | Result | Notes |
|---|------|--------|-------|
| 1 | Both campaigns verified in campaign_search_term_data | PASS | 23714290257: 6580 rows; 23684837882: 12954 rows |
| 2 | CSV inspected and Req 2 extracted | PASS | 7 conditions, 16 fields, weekly cadence |
| 3 | Threshold conflict documented | PASS | £1 vs £10 documented in evidence, UI banner, footnote |
| 4 | Cost=£1.01, Conv=0 → Early Waste Warning | NOT APPLICABLE | Cost null in source — rule cannot fire |
| 5 | Cost=£10.01, Conv=0 → Waste Term | NOT APPLICABLE | Cost null in source — rule cannot fire |
| 6 | Cost=£20.01 → High Cost Term | NOT APPLICABLE | Cost null in source — rule cannot fire |
| 7 | CTR 1.49% = Low CTR (Critical) | PASS | r2GetConditions: ctr<1.5 → 'Low CTR' |
| 8 | CTR 1.50% = Borderline CTR (Monitor) | PASS | r2GetConditions: ctr>=1.5 && ctr<3 → 'Borderline CTR' |
| 9 | CTR 3.00% with conv>0 = Good Performer (Healthy) | PASS | r2GetConditions: ctr>=3 && conv>0 → 'Good Performer' |
| 10 | Impressions=0 → CTR=N/A | PASS | r2SafeCtr returns null; displayed as N/A |
| 11 | Conversions=0, cost null → CPA=N/A | PASS | r2SafeCpa returns null; displayed as N/A |
| 12 | Precedence: Low CTR before Borderline CTR | PASS | R2_PREC array: Low CTR at index 2, Borderline CTR at index 6 |
| 13 | Recommended Decision separate from Logged Decision | PASS | Logged Decision always shows "Pending Decision" badge |
| 14 | Competitor field = Manual Review Required | PASS | No authoritative list — all rows show "Manual Review Required" |
| 15 | Source grain correctly labelled | PASS | Header and table bar: "Search Term per Campaign (aggregated)" |
| 16 | Search Intent = Unclassified | PASS | No intent field in source — all rows show "Unclassified" |
| 17 | Requirement 1 tab still works | PASS | panel-1, DAILY, PRODUCTS, all Req 1 JS functions untouched |
| 18 | No duplicate tab/panel IDs | PASS | r2* prefix on all Req 2 IDs and functions |
| 19 | Only 2 authorised campaigns in filter | PASS | r2CampFilter: THEE_GEMS and THEE_MYSTERY only |
| 20 | No sample CSV data shown as live | PASS | All 100 rows from verified PostgreSQL SELECT |
| 21 | Latest data date visible in UI | PASS | Header, chips, table bar, footer all show 2026-07-12 |
| 22 | Cost limitation clearly communicated | PASS | Warning banner, N/A in table, insights panel, footnote |
| 23 | All conditions triggered shown in All Conditions column | PASS | allConds join() renders comma-separated list |
| 24 | KPI cards use verified values | PASS | Computed from TERMS array counts |
| 25 | Charts respond to filters | PASS | buildR2Charts uses TERMS; applyR2Filters calls renderR2Table+renderR2Insights |
| 26 | Empty state works | PASS | tbody shows "No search terms match" when r2Filtered empty |
| 27 | Sorting works | PASS | sortR2() function with r2SortKey/r2SortDir |
| 28 | Text search works | PASS | r2Search filter on t.term.indexOf(search) |
| 29 | All 7 AIOS files created | PASS | prompts, implementation, evidence, validation, deployment, closure, capability |
| 30 | No PostgreSQL writes | PASS | SELECT only — verified by query review |
| 31 | No git commit | PASS | git status check only — no add/commit run |
| 32 | No git push | PASS | No push command executed |
| 33 | No Vercel deployment | PASS | Deployment not performed |
| 34 | Requirement 1 regression | PASS | Panel-1 unchanged; all Req 1 JS intact |
| 35 | No duplicate JS logic | PASS | All Req 2 functions use r2* prefix; no overwrites |

## Boundary Test Summary
- £1.00 conv=0 → N/A (cost null) ✓
- £1.01 conv=0 → N/A (cost null) ✓
- £10.01 conv=0 → N/A (cost null) ✓
- £20.01 → N/A (cost null) ✓
- CTR 1.49% → Low CTR (Critical) ✓
- CTR 1.50% → Borderline CTR (Monitor) ✓
- CTR 3.00% + conv>0 → Good Performer (Healthy) ✓
- Impressions=0 → CTR=N/A ✓
- Conversions=0 → CPA=N/A ✓
- Cost null → CPA=N/A ✓

**PASS / FAIL:** PASS
