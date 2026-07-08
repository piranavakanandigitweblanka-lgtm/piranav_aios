# Validation — Sonya Req 1 Stage Section 60d & 90d

## Title
Sonya Req 1 — Stage of the Ads updated to 60-day and 90-day performance

## Date
2026-07-08

## Member
Sonya

## Requirement
Requirement 1 — Campaign Data

## Validation Checklist

| # | Check | Status |
|---|---|---|
| 1 | Stage section displays 60 Days Performance (2026-05-09 – 2026-07-07) | ✅ |
| 2 | Stage section displays 90 Days Performance (2026-04-09 – 2026-07-07) | ✅ |
| 3 | Last 30 Days card removed from Stage column | ✅ |
| 4 | Before Last card removed from Stage column | ✅ |
| 5 | Stage shows Cost, Conv Value, Conversions, ROAS per block | ✅ |
| 6 | Existing card design and styling preserved (`.sp`, `.sm-row`, `.sm` classes) | ✅ |
| 7 | Campaign Name unchanged | ✅ |
| 8 | Campaign ID unchanged | ✅ |
| 9 | Budget unchanged (N/A) | ✅ |
| 10 | Cost (30d) main column unchanged | ✅ |
| 11 | Conversions main column unchanged | ✅ |
| 12 | Conv. Value main column unchanged | ✅ |
| 13 | ROAS main column unchanged | ✅ |
| 14 | Segment / ROAS badges unchanged | ✅ |
| 15 | Filters, search, sort controls unchanged | ✅ |
| 16 | KPI cards unchanged | ✅ |
| 17 | Navigation tabs unchanged | ✅ |
| 18 | public.ppc_etl_performance_data remains sole data source | ✅ |
| 19 | 60-day SQL verified against PostgreSQL (9/9 campaigns returned) | ✅ |
| 20 | 90-day SQL verified against PostgreSQL (9/9 campaigns returned) | ✅ |
| 21 | No PostgreSQL writes | ✅ |
| 22 | AIOS evidence updated | ✅ |
| 23 | AIOS implementation updated | ✅ |

## PASS / FAIL
**✅ PASS**

All validation checks passed. Stage section now shows 60-day and 90-day rolling performance per Sonya's spreadsheet. No other dashboard elements modified.
