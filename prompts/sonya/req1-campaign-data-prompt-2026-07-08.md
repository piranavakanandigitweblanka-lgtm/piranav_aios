# Prompt Record — Sonya Requirement 1

## Title
Sonya Requirement 1 — Campaign Data Source Migration to public.ppc_etl_performance_data

## Task
Modify existing Requirement 1 implementation in sonya.html.
Replace previous data source logic with public.ppc_etl_performance_data.
Keep existing UI, layout, navigation and styling.

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

## Campaign Filter
campaign_name ILIKE '%Sonya%'
Resolved via: staging_ai.cppc_campaign_truth_registry_v1

## Date Ranges
- Last 30 Days: 2026-06-08 to 2026-07-07
- Before Last: 2026-05-09 to 2026-06-07

## SQL Used

### Campaign Name Resolution
```sql
SELECT DISTINCT campaign_id, campaign_name
FROM staging_ai.cppc_campaign_truth_registry_v1
WHERE campaign_name ILIKE '%Sonya%';
```

### Last 30 Days
```sql
SELECT record_id AS campaign_id,
  COUNT(DISTINCT date) AS days,
  ROUND(SUM(spend)::numeric, 2) AS cost,
  ROUND(SUM(sales)::numeric, 2) AS conv_value,
  ROUND(SUM(orders)::numeric, 2) AS conversions,
  ROUND((SUM(sales)/NULLIF(SUM(spend),0)*100)::numeric, 2) AS roas_pct
FROM public.ppc_etl_performance_data
WHERE record_type = 'campaign' AND source = 3
  AND date >= '2026-06-08' AND date <= '2026-07-07'
GROUP BY record_id;
```

### Before Last
```sql
SELECT record_id AS campaign_id,
  COUNT(DISTINCT date) AS days,
  ROUND(SUM(spend)::numeric, 2) AS cost,
  ROUND(SUM(sales)::numeric, 2) AS conv_value,
  ROUND(SUM(orders)::numeric, 2) AS conversions,
  ROUND((SUM(sales)/NULLIF(SUM(spend),0)*100)::numeric, 2) AS roas_pct
FROM public.ppc_etl_performance_data
WHERE record_type = 'campaign' AND source = 3
  AND date >= '2026-05-09' AND date <= '2026-06-07'
GROUP BY record_id;
```

## Sources Removed
- staging_ai.cppc_workbook_campaign_performance_v1
- staging_ai.cppc_pmax_campaign_grain_action_queue_v1
- staging_ai.cppc_pmax_campaign_passport_v1
- staging_ai.pmax_18m_postmortem_fact_v1
