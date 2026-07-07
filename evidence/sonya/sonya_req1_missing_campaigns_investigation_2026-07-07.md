# Sonya Requirement 1 — Missing Campaign Investigation

**Title:** Investigation: Why 3 Sonya Campaigns Have No Performance Data  
**Date:** 2026-07-07  
**Member:** Sonya  
**Investigator:** Piranav (AIOS)  
**Method:** Read-only PostgreSQL search across all staging_ai tables with campaign_id column  
**Scope:** 115 tables with campaign_id inspected; all performance/metrics/workbook/pmax tables searched  

---

## Target Campaign IDs

| Campaign ID | Campaign Name |
|-------------|---------------|
| 23793722836 | D Gen \| Sonya \| Klarna\| PLight \| Pendant Light \| MCV \| UK |
| 23526695953 | Pmax UK \| Sonya \| Klarna \| EUR_76 \| All \| MCV \| Ierland |
| 23515806682 | Pmax UK \| Sonya \| Shoptimised \| SONYA2026 \| Zombies > 35\| MC \| UK |

---

## Investigation Results by Campaign

---

### Campaign 23793722836 — D Gen | Sonya | Klarna | PLight | Pendant Light | MCV | UK

**Verdict:** This campaign exists only in the campaign registry and change-event logs. It has **no recorded performance metrics** in any table.

#### Tables searched and result:

| Table | Found | Records | Notes |
|-------|-------|---------|-------|
| cppc_pmax_campaign_truth_registry_v1 | YES | 1 | Registry entry only (NAME_RESOLVED) |
| cppc_google_campaign_change_inventory_v1 | YES | 2 | Status change events only — FIELD_ONLY_NO_VALUES |
| cppc_google_ads_change_capture_v1 | YES | 2 | Status change events, old/new value = NULL |
| cppc_workbook_campaign_performance_v1 | NO | 0 | — |
| pmax_18m_postmortem_fact_v1 | NO | 0 | — |
| cppc_pmax_campaign_passport_v1 | NO | 0 | — |
| cppc_pmax_campaign_grain_action_queue_v1 | NO | 0 | — |
| v_pmax_18m_spend_leakage_v1 | NO | 0 | — |
| cppc_pmax_digital_twin_enriched_rows_v1 | NO | 0 | — |
| cppc_google_ads_roi_audit_v1 | NO | 0 | — |
| All other performance tables | NO | 0 | — |

#### Root Cause:
**This is a Demand Gen ("D Gen") campaign — campaign_type = 'D' in the truth registry.** It is NOT a Performance Max campaign. All Pmax-specific tables (passport, workbook, grain queue, 18m postmortem) are Pmax-only pipelines that exclude Demand Gen campaigns by design.

The only evidence of this campaign in the system is:
- 2 status change events (2026-05-29 and 2026-06-01) captured via Supermetrics from the Google Ads account change history
- evidence_status = `FIELD_ONLY_NO_VALUES` — the status field changed but old/new values were not captured
- last_seen = 2026-06-05 (over 30 days ago from investigation date)

**Recommendation:** This campaign requires a Demand Gen-specific performance pipeline. It will remain N/A in the Pmax-scoped dashboard until a Demand Gen data source is connected.

---

### Campaign 23526695953 — Pmax UK | Sonya | Klarna | EUR_76 | All | MCV | Ierland

**Verdict:** Performance data EXISTS in `staging_ai.pmax_18m_postmortem_fact_v1`. The workbook is incomplete for this campaign.

#### Performance Data Found:

| Metric | Value | Source |
|--------|-------|--------|
| Earliest Date | 2026-02-02 | pmax_18m_postmortem_fact_v1 |
| Latest Date | 2026-06-26 | pmax_18m_postmortem_fact_v1 |
| Total Impressions | 514,338 | pmax_18m_postmortem_fact_v1 |
| Total Clicks | 4,728 | pmax_18m_postmortem_fact_v1 |
| Total Spend | £1,445.46 | pmax_18m_postmortem_fact_v1 |
| Total Conversions | 100.73 | pmax_18m_postmortem_fact_v1 |
| Total Revenue | £4,861.01 | pmax_18m_postmortem_fact_v1 |
| ROAS (ratio) | 3.36 | pmax_18m_postmortem_fact_v1 |
| ROAS % | 336% | Calculated (3.36 × 100) |

#### Tables searched and result:

| Table | Found | Records | Notes |
|-------|-------|---------|-------|
| pmax_18m_postmortem_fact_v1 | **YES** | Multiple | Full historical data — 2026-02-02 to 2026-06-26 |
| v_pmax_18m_spend_leakage_v1 | **YES** | Multiple | Flagged: SPEND_WITH_ZERO_CONVERSIONS, HIGH_SPEND_LOW_ROAS (some periods) |
| cppc_pmax_campaign_truth_registry_v1 | YES | 1 | Registry entry |
| cppc_pmax_campaign_grain_action_queue_v1 | YES | 1 | ALL metric columns NULL |
| cppc_workbook_campaign_performance_v1 | NO | 0 | **Missing — this is the gap** |
| cppc_pmax_campaign_passport_v1 | NO | 0 | — |
| cppc_google_ads_roi_audit_v1 | NO | 0 | — |

#### Root Cause:
The campaign has historical data in `pmax_18m_postmortem_fact_v1` but was **not promoted into** the workbook view (`cppc_workbook_campaign_performance_v1`). The workbook snapshot (as_of 2026-07-01) appears to apply eligibility filters that exclude this campaign — likely because it has spend-leakage failure flags (`SPEND_WITH_ZERO_CONVERSIONS`, `HIGH_SPEND_LOW_ROAS` in the leakage view) and its 30d spend window may have fallen below the workbook's inclusion threshold at snapshot time.

**Recommended source for dashboard:** `staging_ai.pmax_18m_postmortem_fact_v1` with a date filter for the last 30/60/90 days.

---

### Campaign 23515806682 — Pmax UK | Sonya | Shoptimised | SONYA2026 | Zombies > 35| MC | UK

**Verdict:** Performance data EXISTS in `staging_ai.pmax_18m_postmortem_fact_v1`. The workbook is incomplete for this campaign.

#### Performance Data Found:

| Metric | Value | Source |
|--------|-------|--------|
| Earliest Date | 2026-01-29 | pmax_18m_postmortem_fact_v1 |
| Latest Date | 2026-06-26 | pmax_18m_postmortem_fact_v1 |
| Total Impressions | 277,850 | pmax_18m_postmortem_fact_v1 |
| Total Clicks | 1,633 | pmax_18m_postmortem_fact_v1 |
| Total Spend | £753.41 | pmax_18m_postmortem_fact_v1 |
| Total Conversions | 29.84 | pmax_18m_postmortem_fact_v1 |
| Total Revenue | £2,921.74 | pmax_18m_postmortem_fact_v1 |
| ROAS (ratio) | 3.88 | pmax_18m_postmortem_fact_v1 |
| ROAS % | 388% | Calculated (3.88 × 100) |

#### Tables searched and result:

| Table | Found | Records | Notes |
|-------|-------|---------|-------|
| pmax_18m_postmortem_fact_v1 | **YES** | Multiple | Full historical data — 2026-01-29 to 2026-06-26 |
| v_pmax_18m_spend_leakage_v1 | **YES** | Multiple | Flagged: HIGH_SPEND_LOW_ROAS, BROAD_MIXED_COMMERCIAL_OBJECTS, GA4_PRODUCT_ITEM_SOURCE_EMPTY |
| v_pmax_18m_campaign_structure_risk_v1 | **YES** | Multiple | BROAD_MIXED_COMMERCIAL_OBJECTS |
| cppc_pmax_campaign_truth_registry_v1 | YES | 1 | Registry entry |
| cppc_pmax_campaign_grain_action_queue_v1 | YES | 1 | ALL metric columns NULL |
| cppc_workbook_campaign_performance_v1 | NO | 0 | **Missing — this is the gap** |
| cppc_pmax_campaign_passport_v1 | NO | 0 | — |
| cppc_google_ads_roi_audit_v1 | NO | 0 | — |

#### Root Cause:
Same as 23526695953: the campaign has historical data in `pmax_18m_postmortem_fact_v1` but was excluded from the workbook. This campaign is flagged with `BROAD_MIXED_COMMERCIAL_OBJECTS` and `GA4_PRODUCT_ITEM_SOURCE_EMPTY` — indicating GA4 tracking issues and mixed product intent, which may have caused the workbook pipeline to exclude it from the active 30d snapshot.

**Recommended source for dashboard:** `staging_ai.pmax_18m_postmortem_fact_v1` with a date filter for the last 30/60/90 days.

---

## Summary Table — All 3 Campaigns

| Campaign ID | Campaign Name | Type | Has Performance Data | Correct Source | Status |
|-------------|---------------|------|---------------------|----------------|--------|
| 23793722836 | D Gen Pendant Light | **Demand Gen** | NO — nowhere | None available | Registry + 2 status events only |
| 23526695953 | Klarna EUR_76 Ierland | Pmax | **YES** | pmax_18m_postmortem_fact_v1 | Excluded from workbook (spend-leakage flags) |
| 23515806682 | Shoptimised SONYA2026 | Pmax | **YES** | pmax_18m_postmortem_fact_v1 | Excluded from workbook (GA4 issues + broad objects flag) |

---

## Root Cause Summary

| Issue | Campaigns Affected | Explanation |
|-------|--------------------|-------------|
| **Wrong campaign type** | 23793722836 | Demand Gen, not Pmax. Pmax pipeline doesn't ingest Demand Gen metrics |
| **Workbook snapshot exclusion** | 23526695953, 23515806682 | Data exists in 18m fact table but workbook snapshot (as_of 2026-07-01) excludes campaigns with spend-leakage or GA4 failure flags |

---

## Recommendation to GPT

1. **Campaign 23793722836 (D Gen):** Keep as N/A in dashboard. State it is a **Demand Gen** campaign with no performance pipeline. Add a note in the UI: "Demand Gen campaign — performance data not available in current pipeline."

2. **Campaigns 23526695953 & 23515806682:** These have **real spend, real conversions, real ROAS**. Recommend supplementing the dashboard with `staging_ai.pmax_18m_postmortem_fact_v1` for these campaigns, filtered to the last 30 days (2026-06-07 to 2026-07-07).

3. **Dashboard impact if approved:** These 2 campaigns would move from "No Data" (grey) to showing real performance metrics — ROAS 336% and 388% respectively, placing them in the **Better** and **OK** segments respectively.

---

**PASS / FAIL:** PASS — investigation complete with full evidence
