# Validation — Sonya Req 1 Budget Investigation

## Title
Sonya Req 1 — Budget Column N/A Validation

## Date
2026-07-08

## Member
Sonya

## Team
Google Ads

## Requirement
Requirement 1 — Campaign Data

## Issue
Budget column showing N/A — investigate and fix if possible.

## Performance Source
public.ppc_etl_performance_data

## Budget Source Found
NO — no complete, authoritative budget source found for all 9 Sonya campaigns.

## Validation Checklist

| # | Check | Status |
|---|---|---|
| 1 | public.ppc_etl_performance_data inspected for budget columns | ✅ Done — no budget column |
| 2 | All schemas searched for budget-related tables/views | ✅ Done — 7 tables/views found |
| 3 | Each candidate source queried for Sonya campaign coverage | ✅ Done |
| 4 | cppc_pmax_campaign_digital_twin_rows_v1 checked | ✅ 2/9 campaigns only |
| 5 | pmax_change_event_outcome_recovery_base_v1 checked | ✅ 1/9 campaigns (change event, not current) |
| 6 | cppc_google_ads_change_capture_v1 checked | ✅ 0/9 campaigns |
| 7 | Coverage assessed — 3/9 (33%) insufficient | ✅ |
| 8 | Dashboard NOT updated (incomplete coverage) | ✅ Correct decision |
| 9 | Budget N/A documented in AIOS | ✅ |
| 10 | No PostgreSQL write | ✅ |
| 11 | No unrelated files changed | ✅ |
| 12 | No git push | ✅ |
| 13 | No deployment | ✅ |
| 14 | Performance source unchanged | ✅ |
| 15 | ROAS / Cost / Conversions / Conv Value unchanged | ✅ |

## Budget Source Summary

| Source | Budget Column | Coverage | Suitable? |
|---|---|---|---|
| public.ppc_etl_performance_data | NONE | 0/9 | NO |
| cppc_pmax_campaign_digital_twin_rows_v1 | budget | 2/9 (22%) | NO — incomplete |
| pmax_change_event_outcome_recovery_base_v1 | new_budget | 1/9 (11%) | NO — not current state |
| cppc_google_ads_change_capture_v1 | campaign_budget_amount | 0/9 (0%) | NO |

## Files Changed
NONE — Budget column correctly remains N/A.

## PASS / FAIL
**✅ PASS**

Investigation complete. No suitable complete budget source found. Budget N/A is the correct and documented state. Dashboard unchanged. All validation checks passed.
