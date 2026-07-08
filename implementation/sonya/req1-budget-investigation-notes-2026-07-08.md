# Implementation Notes — Sonya Req 1 Budget Investigation

## Title
Sonya Req 1 — Budget Column N/A — No Fix Applied

## Date
2026-07-08

## Decision
NO CHANGE to sonya.html.

Budget column correctly remains N/A. No reliable, complete budget source exists in PostgreSQL for all 9 Sonya campaigns.

## Investigation Steps Taken

1. Confirmed public.ppc_etl_performance_data has no budget column (18 columns, none budget-related)
2. Searched all PostgreSQL schemas for tables/views with budget columns joinable by campaign_id
3. Found 7 candidate sources — queried each for Sonya campaign coverage
4. Best candidate (cppc_pmax_campaign_digital_twin_rows_v1) covers only 2/9 campaigns
5. Second candidate (pmax_change_event_outcome_recovery_base_v1) covers only 1/9 and records change events, not current daily budget
6. Combined coverage 3/9 (33%) — insufficient for dashboard population

## Why Not Partially Populate Budget

Showing £250 for Muguntha, £15 for NICC_07, and N/A for the other 7 would:
- Mislead Sonya into thinking 7 campaigns have no budget set (they may have budgets not captured in DB)
- Create inconsistent UX — some rows showing budget, most showing N/A
- Risk incorrect financial interpretation

## What Would Be Required to Fix Budget

A complete budget source needs to exist in PostgreSQL that:
- Contains all campaign IDs in Sonya's group
- Stores current daily/shared budget amounts
- Is updated regularly (ideally daily or near-real-time)
- Can be joined by campaign_id

Likely candidate: Google Ads API → campaign.campaign_budget.amount_micros ingested via ETL into a dedicated budget table. Data team should confirm if this pipeline exists or can be added.

## Files Changed
NONE
