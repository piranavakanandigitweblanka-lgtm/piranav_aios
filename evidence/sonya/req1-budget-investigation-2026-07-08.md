# Evidence — Sonya Req 1 Budget Column Investigation

## Title
Sonya Req 1 — Budget Column N/A Investigation

## Task
Investigate why Budget column shows N/A and determine if a reliable budget source exists in PostgreSQL.

## Date
2026-07-08

## Member
Sonya

## Team
Google Ads

## Requirement
Requirement 1 — Campaign Data

## Issue
Budget column showing N/A for all 9 campaigns in Sonya's dashboard.

## Performance Source
public.ppc_etl_performance_data

---

## STEP 1 — public.ppc_etl_performance_data Budget Check

**Result: NO budget column.**

Columns confirmed in public.ppc_etl_performance_data:
performance_data_id, source, sub_source_id, marketplace_id, date, record_type,
ref_id, sku, record_id, child_id, parent_id, impressions, clicks, spend, sales,
orders, created_at, updated_at

No column matching: budget, daily_budget, campaign_budget, campaign_budget_amount,
budget_micros, amount_micros, campaign_budget_amount_micros.

---

## STEP 2 — Full PostgreSQL Budget Source Search

### Tables/Views Found with Budget Columns

| Schema | Table/View | Budget Column | Join Key | Notes |
|---|---|---|---|---|
| staging_ai | cppc_google_ads_change_capture_v1 | campaign_budget_amount | campaign_id | No rows for Sonya campaigns |
| staging_ai | cppc_pmax_campaign_digital_twin_rows_v1 | budget | campaign_id | Partial — 2/9 campaigns only |
| staging_ai | cppc_workbook_campaign_performance_v1 | budget_30d | campaign_id | Forbidden source; budget_30d was NULL for all campaigns previously |
| staging_ai | pmax_change_event_outcome_recovery_base_v1 | new_budget, old_budget | campaign_id | Change event history — not current daily budget |
| staging_ai | v_pmax_change_event_outcome_recovery_v1 | new_budget, old_budget | campaign_id | View of above |
| staging_ai | v_pmax_roi_learning_candidates_v1 | old_budget, new_budget | campaign_id | Budget change context only |
| staging_ai | pendant_investment_engine_v1 | ad_budget_allocation | none | No campaign_id join key |

---

## STEP 3 — Budget Data Found Per Campaign

### Source A: staging_ai.cppc_pmax_campaign_digital_twin_rows_v1

| Campaign ID | Campaign Name | Budget | Latest Date |
|---|---|---|---|
| 20810136438 | Muguntha \| DM 46 All | £250 | 2026-07-04 |
| 22847654610 | GCSS \| NICC_07 | £15 | 2026-07-04 |
| 21435967873 | PH_ALL | — | not in table |
| 22943583032 | SUMMER_TRENDS | — | not in table |
| 23526695953 | EUR_76 | — | not in table |
| 23515806682 | SONYA2026 | — | not in table |
| 23729304135 | GB C1 | — | not in table |
| 23793722836 | D Gen | — | not in table |
| 23914872425 | English_EU | — | not in table |

**Coverage: 2/9 campaigns (22%)**

### Source B: staging_ai.pmax_change_event_outcome_recovery_base_v1

| Campaign ID | Campaign Name | new_budget | Latest Date |
|---|---|---|---|
| 23526695953 | EUR_76 | £40 | 2026-07-05 |

**Coverage: 1/9 campaigns (11%)**
Note: This is a budget change event record, not an authoritative current daily budget.

### Combined Coverage: 3/9 campaigns (33%)

Campaigns with NO budget data in any PostgreSQL source:
- 21435967873 (PH_ALL)
- 22943583032 (SUMMER_TRENDS)
- 23515806682 (SONYA2026)
- 23729304135 (GB C1)
- 23793722836 (D Gen)
- 23914872425 (English_EU)

---

## STEP 3 DECISION — Do NOT Update Dashboard

**Reason:** Budget coverage is 3/9 (33%). Populating budget for only 3 campaigns while showing N/A for the remaining 6 would be misleading and inconsistent. The dashboard must either show budget for all campaigns or none.

**No single PostgreSQL table provides a complete, authoritative daily budget for all 9 Sonya campaigns.**

### Why each source is insufficient:

| Source | Reason Not Used |
|---|---|
| public.ppc_etl_performance_data | No budget column |
| cppc_pmax_campaign_digital_twin_rows_v1 | Only 2/9 campaigns present |
| pmax_change_event_outcome_recovery_base_v1 | Change event history, not current daily budget; 1/9 campaigns |
| cppc_google_ads_change_capture_v1 | No rows for any Sonya campaign |
| cppc_workbook_campaign_performance_v1 | Forbidden source for Req 1; budget_30d was NULL for all campaigns |

---

## Dashboard Change
**NONE — Budget column remains N/A.**

No files changed in sonya.html.

---

## Known Risks
- Budget data gap may persist if no ETL pipeline writes daily campaign budget to a central table
- cppc_pmax_campaign_digital_twin_rows_v1 has partial budget data but is not maintained for all campaigns
- Change event recovery table records budget changes, not current state

## Next Action
- Request data team to confirm authoritative budget source for Google Ads campaigns
- Candidate: Google Ads API campaign resource (campaign.campaign_budget.amount_micros) — confirm if this is being ingested into PostgreSQL
- Once complete budget table confirmed, raise as Req 1 follow-up task
