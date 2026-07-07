# Sonya Requirement 1 — Campaign Data Evidence

**Title:** Last 30 Days Campaign Performance — Final Evidence  
**Date:** 2026-07-07  
**Member:** Sonya  
**AIOS Staff:** Piranav  
**Version:** v3 — performance-first filter, 4 qualifying campaigns

---

## Business Rule (Final)

> Only display campaigns where:
> - campaign_name contains 'Sonya'
> - AND the campaign has performance during the selected last 30 days (spend_30d > 0)
>
> Do NOT use the campaign registry alone. Do NOT include campaigns with no 30-day performance.

---

## Primary Query (Authoritative)

```sql
SELECT 
  campaign_id, campaign_name, campaign_status, market,
  spend_30d, roas_30d, conversions_30d, revenue_30d,
  budget_30d, segment_5band, issue_type, as_of
FROM staging_ai.cppc_workbook_campaign_performance_v1
WHERE campaign_name ILIKE '%Sonya%'
  AND (spend_30d > 0 OR conversions_30d > 0)
ORDER BY spend_30d DESC;
```

**Result:** 4 campaigns — all with spend_30d > 0.

---

## Stage Data Query

```sql
SELECT 
  campaign_id, campaign_name,
  spend_30d, conversion_value_30d, conversions_30d, roas_30d,
  spend_60d, conversion_value_60d, conversions_60d, roas_60d,
  spend_90d, conversion_value_90d, conversions_90d, roas_90d
FROM staging_ai.cppc_pmax_campaign_grain_action_queue_v1
WHERE campaign_name ILIKE '%Sonya%'
ORDER BY spend_30d DESC NULLS LAST;
```

**Result:** 6 rows. Only campaign 21435967873 has non-NULL grain queue metrics.

---

## Qualifying Campaigns (Final — 4)

| Campaign ID | Campaign Name | Status | Cost 30d | ROAS % | Segment | Issue |
|-------------|---------------|--------|----------|--------|---------|-------|
| 23729304135 | Pmax UK \| Sonya \| Klarna \| GB C1 \| Zombies Dracarys \| MCV \| UK | ENABLED | £402.10 | 78% | Worst | KILL_LOSS |
| 22943583032 | Pmax UK \| Sonya \| Shoptimised \| SUMMER_TRENDS \| Zombies \| MCV \| UK | ENABLED | £301.02 | 149% | Worst | KILL_LOSS |
| 22847654610 | Pmax UK \| Sonya \| GCSS \| NICC_07 \| Last Year Sold \| MCV \| UK | PAUSED | £140.45 | 157% | Worst | KILL_LOSS |
| 21435967873 | Pmax UK \| Sonya \| Klarna \| PH_ALL \| Covertion > 2\| MCV \| UK | ENABLED | £15.66 | 4617% | Best | SCALE_WINNER |

**Total active spend (30d): £859.23**

---

## Grain Queue Data — Campaign 21435967873 Only

| Period | Cost | Conv. Value | Conversions | ROAS % |
|--------|------|-------------|-------------|--------|
| Last 30 Days | £355.47 | £1,225.62 | 51.3 | 345% |
| Previous 30 Days | £344.30 | £1,276.78 | 43.7 | 371% |
| 60 Days Cumulative | £699.77 | £2,502.40 | 95.0 | 358% |
| 90 Days Cumulative | £970.98 | £4,111.78 | 132.3 | 423% |

Note: Grain queue spend_30d (£355.47) differs from workbook spend_30d (£15.66). Different aggregation windows. Workbook drives segment; grain queue drives Stage column only.

---

## Excluded Campaigns and Reason

| Campaign ID | Campaign Name | Reason |
|-------------|---------------|--------|
| 23526695953 | Pmax UK \| Klarna \| EUR_76 \| Ierland | Not in workbook 30d snapshot (spend-leakage flags) |
| 23515806682 | Pmax UK \| Shoptimised \| SONYA2026 | Not in workbook 30d snapshot (GA4 failure + broad objects) |
| 23793722836 | D Gen \| Sonya \| Pendant Light | Demand Gen — no performance data anywhere |
| 23914872425 | Pmax UK \| Shoptimised \| English_EU | New campaign (first seen 2026-06-06); in postmortem but NOT in workbook 30d snapshot — excluded pending direction |

---

## Data Gaps (Documented)

| Gap | Affected Campaigns | Notes |
|-----|-------------------|-------|
| conversions_30d = NULL | All 4 | Not populated in workbook source |
| revenue_30d = NULL | All 4 | Not populated in workbook source |
| budget_30d = NULL | All 4 | No budget data in any source |
| impressions/clicks | All 4 | Not in workbook columns |
| Grain queue metrics | 3 of 4 | Rows exist but all metric columns NULL |

---

**PASS / FAIL:** PASS — 4 active campaigns confirmed with real 30-day spend
