# Sonya Requirement 1 — Capability Notes

**Date:** 2026-07-07  
**Member:** Sonya  
**Requirement:** Campaign Data Dashboard  
**Author:** Piranav (AIOS)

---

## What This Dashboard Can Do

- Show all 7 Sonya Google Ads campaigns with live source priority: Workbook → Historical 18m → No Data
- Filter by: campaign name (search), segment (Best/Better/OK/Bad/Worst/No Data), source (Workbook/Historical 18m/No Data), status (Enabled/Paused/Unknown/Demand Gen)
- Sort by: ROAS%, Total Cost, Conversion Value
- Export all visible rows as CSV
- Show stage-of-ads: 30/60/90d performance breakdown (where grain queue data exists)
- Show source badge on every row (Workbook / Historical 18m / No Data)
- KPI summary cards: Total Cost, Conv Value, Avg ROAS, Conversions, Best/Worst campaign name

---

## What This Dashboard Cannot Do

- Live database refresh (data is embedded at build time — requires manual rebuild to update)
- Demand Gen campaign metrics (no Demand Gen pipeline connected)
- Per-product or per-asset breakdown (campaign-level only)
- 30d breakdown for historical 18m campaigns (postmortem source is cumulative only)
- Budget column (NULL in all sources)
- Impressions/Clicks for workbook campaigns (not stored in workbook source columns)

---

## Data Sources Used

| Source | Table | Schema | Access |
|--------|-------|--------|--------|
| Campaign Registry | cppc_pmax_campaign_truth_registry_v1 | staging_ai | Read-only |
| Workbook Performance | cppc_workbook_campaign_performance_v1 | staging_ai | Read-only |
| Stage Data | cppc_pmax_campaign_grain_action_queue_v1 | staging_ai | Read-only |
| Historical Fallback | pmax_18m_postmortem_fact_v1 | staging_ai | Read-only |

---

## Segment Rules

| Segment | ROAS % Range | Row Colour |
|---------|-------------|------------|
| Best | ≥ 400% | Green (#f0fdf4) |
| Better | 350–399% | Green (#f0fdf4) |
| OK | 300–349% | Amber (#fffbeb) |
| Bad | 200–299% | Light red (#fff5f5) |
| Worst | < 200% | Red (#fff0f0) |
| No Data | — | Grey (#f8fafc) |

---

## Replication Instructions for Future Rebuilds

1. Query `cppc_pmax_campaign_truth_registry_v1` WHERE campaign_name ILIKE '%Sonya%' for authoritative campaign list.
2. LEFT JOIN `cppc_workbook_campaign_performance_v1` on campaign_id (get spend_30d, roas_30d, campaign_status, issue_type).
3. For campaigns with NULL workbook result: query `pmax_18m_postmortem_fact_v1` WHERE campaign_id IN (...) GROUP BY campaign_id.
4. LEFT JOIN `cppc_pmax_campaign_grain_action_queue_v1` for 30/60/90d stage data.
5. Embed results into RAW array in sonya.html.
6. ROAS% = roas_ratio × 100. Segment derived in JS from ROAS%.
