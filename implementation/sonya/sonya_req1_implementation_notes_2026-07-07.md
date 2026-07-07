# Sonya Requirement 1 — Implementation Notes

**Date:** 2026-07-07  
**Member:** Sonya  
**Requirement:** Sonya Requirement 1 — Campaign Data (Two-Step Data Priority)  
**AIOS Staff:** Piranav  
**Version:** v2 — updated after postmortem fallback implementation

---

## Architecture Decision

- **Pattern:** Hetheesha-style inline CSS + JavaScript (no external dependencies)
- **Data delivery:** Embedded JavaScript constant (RAW array) — matches existing dashboard pattern
- **No live DB connection from browser** — data embedded at build time from PostgreSQL read-only inspection

---

## Data Priority Logic (Two-Step)

```
For each Sonya campaign (7 total from truth_registry):
  STEP 1: Check cppc_workbook_campaign_performance_v1 (30d snapshot, as_of 2026-07-01)
    → If row exists: use it. src = 'workbook'. hasData = true.
  STEP 2: If no workbook row: Check pmax_18m_postmortem_fact_v1 (cumulative historical)
    → If rows exist: aggregate and use. src = 'hist18m'. hasData = true.
  STEP 3: If both are empty: src = 'nodata'. hasData = false.
```

Result: 4 workbook + 2 hist18m + 1 nodata = 7 total.

---

## Primary Data Source — Workbook (4 campaigns)

`staging_ai.cppc_workbook_campaign_performance_v1`
- Fields used: campaign_id, campaign_name, campaign_type, campaign_status, market, spend_30d, roas_30d, budget_30d, segment_5band, issue_type
- All 4 campaigns have campaign_status from this source

## Stage Data Source — Grain Queue (1 of 4 workbook campaigns)

`staging_ai.cppc_pmax_campaign_grain_action_queue_v1`
- LEFT JOIN on campaign_id
- Fields: spend_30d/60d/90d, roas_30d/60d/90d, conversion_value_30d/60d/90d, conversions_30d/60d/90d
- Only campaign 21435967873 (Klarna PH_ALL) has populated grain queue data
- Other 3 workbook campaigns: grain queue row exists but all metric columns are NULL

## Fallback Source — 18m Postmortem (2 campaigns)

`staging_ai.pmax_18m_postmortem_fact_v1`

| Campaign ID | Period | Spend | Conv | Conv Value | ROAS |
|-------------|--------|-------|------|------------|------|
| 23526695953 | 2026-02-02 to 2026-06-26 | £1,445.46 | 100.73 | £4,861.01 | 336% |
| 23515806682 | 2026-01-29 to 2026-06-26 | £753.41 | 29.84 | £2,921.74 | 388% |

Status for both: UNKNOWN (not in workbook — no campaign_status available from postmortem source).

These campaigns were excluded from workbook due to leakage/GA4 flags. Full investigation in:
`evidence/sonya/sonya_req1_missing_campaigns_investigation_2026-07-07.md`

---

## ROAS Formula

- **Workbook:** `roas_30d` stored as ratio (e.g. 46.17 = 4617%). ROAS% = roas_30d × 100.
- **Postmortem:** ROAS ratio = SUM(revenue) / SUM(spend). ROAS% = ratio × 100.
- Segment rules applied in JavaScript using ROAS%.

---

## Source Badge Implementation

Each RAW row has a `src` field: `'workbook'` | `'hist18m'` | `'nodata'`.

```javascript
function srcBadge(src){
  if(src==='workbook') return '<span class="src-badge src-workbook">Workbook</span>';
  if(src==='hist18m')  return '<span class="src-badge src-hist18m">Historical (18m)</span>';
  return '<span class="src-badge src-nodata">No Data</span>';
}
```

CSS classes: `src-workbook` (blue), `src-hist18m` (purple), `src-nodata` (grey).

---

## Stage Column by Source

| Source | Stage Column Content |
|--------|---------------------|
| Workbook + grain queue data | 30d / Previous 30d / 60d cumulative / 90d cumulative blocks |
| Workbook without grain queue | "No 30/60/90d breakdown available for this campaign." |
| Historical 18m | Cumulative period block showing total spend/conv/roas/impressions/clicks + date range |
| No Data (Demand Gen) | "Demand Gen campaign — outside Pmax performance pipeline." |

---

## Previous 30d Derivation (Grain Queue Only)

- `prev30_cost = gq.cost60 − gq.cost30`
- `prev30_convVal = gq.convVal60 − gq.convVal30`
- `prev30_conv = gq.conv60 − gq.conv30`
- `prev30_roas = (prev30_convVal / prev30_cost) × 100`

---

## Known Discrepancy — Klarna PH_ALL

- Workbook spend_30d = £15.66, roas_30d = 46.17 (4617%)
- Grain queue spend_30d = £355.47, roas_30d = 3.45 (345%)
- Root cause: different aggregation window or attribution base
- Decision: Workbook drives segment + KPI cards; grain queue used only for Stage column (self-consistent 30/60/90d set)

---

## Budget

- `budget_30d` = NULL for all 7 Sonya campaigns in all sources
- Displayed as 'N/A' in dashboard

---

## Segment Color Map

| Segment | Row Background | Badge |
|---------|---------------|-------|
| Best (≥400%) | #f0fdf4 | Dark green |
| Better (350-399%) | #f0fdf4 | Green |
| OK (300-349%) | #fffbeb | Amber |
| Bad (200-299%) | #fff5f5 | Light red |
| Worst (<200%) | #fff0f0 | Red |
| No Data | #f8fafc | Neutral grey |
