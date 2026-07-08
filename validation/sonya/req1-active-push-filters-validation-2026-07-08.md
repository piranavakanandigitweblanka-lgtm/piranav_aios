# Validation — Sonya Req 1 Active & Push Campaign Filters

## Title
Sonya Req 1 — Active Campaign and Push Campaign filters validation

## Date
2026-07-08

## Member
Sonya

## Requirement
Requirement 1 — Campaign Data

## Validation Checklist

| # | Check | Status |
|---|---|---|
| 1 | Active Campaign filter button appears in controls bar | ✅ |
| 2 | Push Campaign filter button appears in controls bar | ✅ |
| 3 | All Campaigns button appears (default selected) | ✅ |
| 4 | Active filter correctly uses activity-based rule (l30.cost > 0) | ✅ |
| 5 | Push filter correctly uses name-based fallback (name contains 'push') | ✅ |
| 6 | Active filter: 8/9 campaigns shown (D Gen excluded — £0 L30 cost) | ✅ |
| 7 | Push filter: 0/9 campaigns shown (none contain 'push' in name — correct) | ✅ |
| 8 | Campaign Type filter combines with Search filter correctly | ✅ |
| 9 | Campaign Type filter combines with Segment dropdown correctly | ✅ |
| 10 | All three filters (Search + Segment + Campaign Type) combine correctly | ✅ |
| 11 | Export CSV exports currently filtered rows (uses activeData — unchanged) | ✅ |
| 12 | Sort buttons (Cost / ROAS / Conv. Value) unchanged | ✅ |
| 13 | Search input unchanged | ✅ |
| 14 | Segment dropdown unchanged | ✅ |
| 15 | public.ppc_etl_performance_data remains sole data source | ✅ |
| 16 | Main table columns unchanged (Campaign Name, ID, Budget, Cost, Conv, CV, ROAS, Segment) | ✅ |
| 17 | Stage column unchanged (60d + 90d) | ✅ |
| 18 | KPI cards unchanged | ✅ |
| 19 | Navigation tabs unchanged | ✅ |
| 20 | No other Requirement tabs changed | ✅ |
| 21 | No PostgreSQL writes | ✅ |
| 22 | No git push | ✅ |
| 23 | No deployment | ✅ |

## Source Field Inspection Result

| Field | Found in ppc_etl_performance_data? |
|---|---|
| status / campaign_status / enabled / is_active | NO |
| push / campaign_type / label / tag / objective | NO |

**Active rule used:** Activity-based — `l30.cost > 0`
**Push rule used:** Name-based fallback — `name.toLowerCase().includes('push')`

## PASS / FAIL
**✅ PASS**

Both filters added and working. Existing filters, metrics, layout, and export CSV unaffected. Rules documented per field inspection results.
