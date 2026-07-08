# Implementation Notes — Sonya Requirement 1

## Title
Sonya Req 1 — Campaign Data Table Implementation

## Date
2026-07-08

## Member
Sonya

## Team
Google Ads

## Requirement
Requirement 1 — Campaign Data

## What Changed

### Removed
- `staging_ai.cppc_workbook_campaign_performance_v1` — was primary source (as_of snapshot)
- `staging_ai.cppc_pmax_campaign_grain_action_queue_v1` — was used for Stage column
- `staging_ai.cppc_pmax_campaign_passport_v1` — was referenced indirectly
- `staging_ai.pmax_18m_postmortem_fact_v1` — was inspected, now removed
- Hardcoded `gq` (grain queue) object per campaign
- Status column (not in Sonya's spreadsheet requirement)
- Market column (not in Sonya's spreadsheet requirement)
- Old `roasRatio` field (stored as ratio, multiply ×100 to get %)

### Added
- `public.ppc_etl_performance_data` as single source (daily grain, source=3)
- `l30` object per campaign: { cost, cv, conv, roas } for Last 30 Days
- `bl` object per campaign: { cost, cv, conv, roas } for Before Last
- Stage shows two blocks: Last 30 Days + Before Last
- 7 campaigns (was 4 in previous implementation)

### Kept Unchanged
- All CSS / design tokens
- Nav tabs (Campaign Data, Product Data, Trend, Opportunity, Stop Waste Spend)
- Panel 2–5 content
- KPI cards layout
- Search / segment filter / sort controls
- Export CSV
- showTab() function
- segFromRoas() logic (same ROAS thresholds)
- fmt() / fmtPct() / shortN() helpers

## Data Architecture

```
public.ppc_etl_performance_data
  WHERE record_type = 'campaign'
    AND source = 3
  ↓
  Last 30 Days window  → l30 object
  Before Last window   → bl object

staging_ai.cppc_campaign_truth_registry_v1
  WHERE campaign_name ILIKE '%Sonya%'
  ↓
  7 campaign IDs + names
```

## File Modified
`Staff-requirements/pages/sonya.html`
