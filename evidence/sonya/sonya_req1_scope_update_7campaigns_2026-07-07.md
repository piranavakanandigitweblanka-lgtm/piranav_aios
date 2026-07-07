# Sonya Requirement 1 — Scope Update: 7 Campaigns + Two-Step Data Priority

**Title:** Sonya Requirement 1 — All 7 Sonya Campaigns, Two-Step Priority Logic  
**Task:** Show 7 campaigns, 6 with performance (workbook OR 18m postmortem), 1 no data  
**Date:** 2026-07-07  
**Member:** Sonya  
**Team:** Digital Marketing / Google Ads  
**Requirement Source:** GPT scope update instruction — 2026-07-07  
**AIOS Staff:** Piranav  
**Status:** COMPLETE — PASS  

---

## Data Priority Rule (Two-Step)

| Step | Source | Description |
|------|--------|-------------|
| 1 | `cppc_workbook_campaign_performance_v1` | 30-day snapshot (as_of 2026-07-01). Primary source. |
| 2 | `pmax_18m_postmortem_fact_v1` | Historical cumulative. Used only if workbook has no row. |
| 3 | No Data | Only if BOTH sources have no row. |

---

## All 7 Sonya Campaigns — Updated Outcome

| # | Campaign ID | Campaign Name | Market | Type | Source | Cost | ROAS % | Segment |
|---|-------------|---------------|--------|------|--------|------|--------|---------|
| 1 | 21435967873 | Pmax UK \| Sonya \| Klarna \| PH_ALL | UK | Pmax | **Workbook** | £15.66 | 4617% | Best |
| 2 | 22943583032 | Pmax UK \| Sonya \| Shoptimised \| SUMMER_TRENDS | UK | Pmax | **Workbook** | £301.02 | 149% | Worst |
| 3 | 22847654610 | Pmax UK \| Sonya \| GCSS \| NICC_07 | UK | Pmax | **Workbook** | £140.45 | 157% | Worst |
| 4 | 23729304135 | Pmax UK \| Sonya \| Klarna \| GB C1 Zombies | UK | Pmax | **Workbook** | £402.10 | 78% | Worst |
| 5 | 23526695953 | Pmax UK \| Sonya \| Klarna \| EUR_76 \| Ierland | IE | Pmax | **Historical 18m** | £1,445.46 | 336% | OK |
| 6 | 23515806682 | Pmax UK \| Sonya \| Shoptimised \| SONYA2026 | UK | Pmax | **Historical 18m** | £753.41 | 388% | Better |
| 7 | 23793722836 | D Gen \| Sonya \| Klarna \| Pendant Light | UK | D Gen | **No Data** | — | — | No Data |

---

## Coverage Summary

| Metric | Count |
|--------|-------|
| Total Sonya Campaigns | **7** |
| Campaigns With Performance | **6** (4 workbook + 2 historical 18m) |
| Campaigns Without Performance | **1** (Demand Gen — no pipeline) |

---

## SQL Queries Used (Read-Only)

### Registry + Workbook Join
```sql
SELECT r.campaign_id, r.campaign_name, r.market, r.campaign_type,
  w.campaign_status, w.spend_30d, w.roas_30d, w.conversions_30d,
  w.revenue_30d, w.budget_30d, w.segment_5band, w.issue_type, w.as_of
FROM staging_ai.cppc_pmax_campaign_truth_registry_v1 r
LEFT JOIN staging_ai.cppc_workbook_campaign_performance_v1 w
  ON r.campaign_id = w.campaign_id
WHERE r.campaign_name ILIKE '%Sonya%'
ORDER BY r.campaign_name;
```

### 18m Postmortem Fallback (targeted)
```sql
SELECT campaign_id,
  MIN(date) AS earliest_date, MAX(date) AS latest_date,
  SUM(impressions) AS total_impressions, SUM(clicks) AS total_clicks,
  SUM(spend) AS total_spend, SUM(conversions) AS total_conversions,
  SUM(revenue) AS total_revenue,
  ROUND((SUM(revenue)/NULLIF(SUM(spend),0))::numeric,4) AS roas_ratio
FROM staging_ai.pmax_18m_postmortem_fact_v1
WHERE campaign_id IN ('23526695953','23515806682')
GROUP BY campaign_id;
```

---

## Source Badge Rules (UI)

| Data Source | Badge Label | Badge Style |
|-------------|-------------|-------------|
| `cppc_workbook_campaign_performance_v1` | Workbook | Blue pill |
| `pmax_18m_postmortem_fact_v1` | Historical (18m) | Purple pill |
| Neither | No Data | Grey pill |

---

## Why EUR_76 and SONYA2026 Were Missing From Workbook

Both campaigns have real spend and real conversions in `pmax_18m_postmortem_fact_v1` but were excluded from the workbook snapshot (as_of 2026-07-01). Root cause:

- **23526695953 (EUR_76):** Flagged with `SPEND_WITH_ZERO_CONVERSIONS` and `HIGH_SPEND_LOW_ROAS` in `v_pmax_18m_spend_leakage_v1`. Workbook pipeline filters out spend-leakage flagged campaigns.
- **23515806682 (SONYA2026):** Flagged with `GA4_PRODUCT_ITEM_SOURCE_EMPTY` and `BROAD_MIXED_COMMERCIAL_OBJECTS`. GA4 tracking failure caused exclusion from workbook.

Both campaigns are **Pmax campaigns with real performance** and are correctly surfaced via the postmortem fallback.

---

## Why Demand Gen Has No Data

Campaign 23793722836 is `campaign_type = 'D'` (Demand Gen) in the truth registry. The Pmax pipeline (workbook, grain queue, 18m postmortem) is a Pmax-only pipeline that excludes Demand Gen by design. Only 2 status change events exist (no spend, no conversions in any table). Correctly shown as No Data.

---

## Files Changed

| File | Action |
|------|--------|
| `pages/sonya.html` | Updated — 7 campaigns, 6 with data, source badges, 7/6/1 summary |
| `evidence/sonya/sonya_req1_scope_update_7campaigns_2026-07-07.md` | Updated (this file) |
| `evidence/sonya/sonya_req1_missing_campaigns_investigation_2026-07-07.md` | Previous — remains valid |
| `validation/sonya/sonya_req1_validation_checklist_2026-07-07.md` | Updated |
| `implementation/sonya/sonya_req1_implementation_notes_2026-07-07.md` | Updated |

---

**PASS / FAIL:** PASS
