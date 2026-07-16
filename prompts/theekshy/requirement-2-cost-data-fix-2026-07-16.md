# Requirement 2 — Cost Data Fix Prompt
**Date:** 2026-07-16  
**Staff:** Theekshy  
**File:** Staff-requirements/pages/theekshy.html  
**Scope:** Requirement 2 (Search Term Optimisation Dashboard) — cost data fix only

## Problem Statement

The existing Requirement 2 dashboard reported "Cost field is NULL in campaign_search_term_data for all PMax campaigns." Rule 1 (Waste Term: Cost > £1 AND Conv = 0) was BLOCKED. Only CTR-based and conversion-based rules were active.

## Root Cause

`google_ads.campaign_search_term_data` has cost = NULL for all 19,534 PMax rows across both campaigns. The table does not provide search-term-level cost for Performance Max campaigns.

## Resolution

Use `google_ads.pmax_campaign_search_term_data` which has:
- `cost` field (numeric) populated for 100% of rows (20,127/20,127)
- Latest data date: 2026-06-30
- Grain: date + campaign_id + search_term + match_type

## Campaigns in Scope

| Campaign | ID |
|---|---|
| Pmax UK \| Theekshy \| THEE_GEMS \| ORDERS>1 | 23714290257 |
| Pmax \| Theekshy \| THEE_MYSTERY \| Non-Converting | 23684837882 |

## Date Ranges (derived from latest date 2026-06-30)

| Range | Start | End |
|---|---|---|
| 7D | 2026-06-24 | 2026-06-30 |
| 30D | 2026-06-01 | 2026-06-30 |
| 60D | 2026-06-01 | 2026-06-30 (same as 30D — pmax data starts June) |
| 90D | 2026-06-01 | 2026-06-30 (same as 30D) |

## SQL Pattern

```sql
SELECT campaign_id, LOWER(TRIM(search_term)) as search_term, match_type,
  SUM(impressions) as imp, SUM(clicks) as clk,
  ROUND(SUM(cost)::numeric,2) as cost,
  ROUND(SUM(conversions)::numeric,4) as conv,
  ROUND(SUM(conversions_value)::numeric,2) as cv
FROM google_ads.pmax_campaign_search_term_data
WHERE campaign_id IN (23714290257, 23684837882)
  AND date >= 'START_DATE' AND date <= 'END_DATE'
GROUP BY campaign_id, LOWER(TRIM(search_term)), match_type
ORDER BY SUM(cost) DESC
LIMIT 200;
```
