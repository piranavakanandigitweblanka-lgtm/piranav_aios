# Validation — Sonya Req 1 Stage Accordion UI

## Date
2026-07-08

## Member
Sonya

## Requirement
Requirement 1 — Campaign Data

## Validation Checklist

| # | Check | Status |
|---|---|---|
| 1 | Stage column shows "View Stage Details ▼" button (collapsed by default) | ✅ |
| 2 | Clicking button expands the panel for that row only | ✅ |
| 3 | Clicking again collapses the panel | ✅ |
| 4 | Each row expands/collapses independently | ✅ |
| 5 | Block 1 — Last 30 Days (2026-06-08–2026-07-07): Cost, ROAS, Conv, Conv Value | ✅ |
| 6 | Block 2 — Before Last (2026-05-09–2026-06-07): Cost, ROAS, Conv, Conv Value | ✅ |
| 7 | Block 3 — Last 60 Days (2026-05-09–2026-07-07): Cost, ROAS, Conv, Conv Value | ✅ |
| 8 | Block 4 — Last 90 Days (2026-04-09–2026-07-07): Cost, ROAS, Conv, Conv Value | ✅ |
| 9 | Existing Search filter still works | ✅ |
| 10 | Existing Segment filter still works | ✅ |
| 11 | Existing Campaign Type filter (All/Active/Push) still works | ✅ |
| 12 | Export CSV still works (uses activeData — unchanged) | ✅ |
| 13 | Campaign Name unchanged | ✅ |
| 14 | Campaign ID unchanged | ✅ |
| 15 | Days unchanged | ✅ |
| 16 | Budget unchanged (N/A) | ✅ |
| 17 | Cost (30d) main column unchanged | ✅ |
| 18 | Conversions main column unchanged | ✅ |
| 19 | Conv. Value main column unchanged | ✅ |
| 20 | ROAS main column unchanged | ✅ |
| 21 | Segment badges unchanged | ✅ |
| 22 | KPI cards unchanged | ✅ |
| 23 | Navigation tabs unchanged | ✅ |
| 24 | public.ppc_etl_performance_data remains sole data source | ✅ |
| 25 | No PostgreSQL writes | ✅ |
| 26 | No git push | ✅ |
| 27 | No deployment | ✅ |

## PASS / FAIL
**✅ PASS**

Stage column accordion UI implemented. All 4 blocks display correctly. Per-row expand/collapse works independently. All existing filters and CSV export unaffected.
