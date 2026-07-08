# Validation Record — Sonya Requirement 1

## Title
Sonya Req 1 — Implementation Validation

## Task
Validate modified Requirement 1 implementation in sonya.html

## Date
2026-07-08

## Member
Sonya

## Team
Google Ads

## Requirement
Requirement 1 — Campaign Data

## Requirement Source
Sonya Spreadsheet

## PostgreSQL Source
public.ppc_etl_performance_data

## Files Changed
- `Staff-requirements/pages/sonya.html`

## Checklist

| # | Check | Status |
|---|---|---|
| 1 | Existing Requirement 1 modified (not new dashboard) | ✅ PASS |
| 2 | Existing UI preserved (layout, nav, styling, tabs) | ✅ PASS |
| 3 | Data source changed to public.ppc_etl_performance_data | ✅ PASS |
| 4 | Campaign filter: campaign_name ILIKE '%Sonya%' | ✅ PASS |
| 5 | Campaign table has all 10 required columns | ✅ PASS |
| 6 | Stage column — Last 30 Days block | ✅ PASS |
| 7 | Stage column — Before Last block | ✅ PASS |
| 8 | ROAS segment colours correct | ✅ PASS |
| 9 | No duplicate JavaScript | ✅ PASS |
| 10 | No duplicate SQL | ✅ PASS |
| 11 | Old source references removed | ✅ PASS |
| 12 | AIOS updated | ✅ PASS |
| 13 | No PostgreSQL write | ✅ PASS |
| 14 | No git push | ✅ PASS |
| 15 | No deployment | ✅ PASS |

## Table Columns Verified

| # | Column | Implemented |
|---|---|---|
| 1 | Campaign Name | ✅ |
| 2 | Campaign ID | ✅ |
| 3 | Number of Days | ✅ |
| 4 | Budget | ✅ (N/A — not in source) |
| 5 | Cost | ✅ |
| 6 | Conversions | ✅ |
| 7 | Conversion Value | ✅ |
| 8 | ROAS | ✅ |
| 9 | Segment | ✅ |
| 10 | Stage (Last 30 / Before Last) | ✅ |

## ROAS Segment Rules Verified

| Rule | ROAS Range | Colour | Applied |
|---|---|---|---|
| Best | ≥400% | Dark Green | ✅ |
| Better | 350–399% | Light Green | ✅ |
| OK | 300–349% | Orange | ✅ |
| Bad | 200–299% | Light Red | ✅ |
| Worst | <200% | Red | ✅ |

## Campaigns Displayed
7 Sonya campaigns — campaign_name ILIKE '%Sonya%' via cppc_campaign_truth_registry_v1

## Known Risks

| Risk | Severity |
|---|---|
| Budget not available in ppc_etl_performance_data — shown as N/A | Low |
| Campaign 22847654610 only 17 active days in last 30d (£2.48 spend) | Low |
| Campaign 23793722836 no spend in last 30d | Low |

## Next Action
- Confirm with Sonya that 7 campaigns is correct expected count
- Confirm budget source if required (not in ppc_etl_performance_data)

## PASS / FAIL

**✅ PASS**

All 15 validation checks passed. sonya.html Requirement 1 updated to use public.ppc_etl_performance_data. UI preserved. 7 Sonya campaigns displayed with correct ROAS segments and Last 30 / Before Last stage comparison.
