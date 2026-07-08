# Evidence — Sonya Requirement 1 Source Migration

## Title
Sonya Req 1 — Data Source Migration to public.ppc_etl_performance_data

## Task
Replace Requirement 1 data source in sonya.html from cppc_workbook/grain_queue to public.ppc_etl_performance_data (daily grain).

## Date
2026-07-08

## Member
Sonya

## Team
Google Ads

## Requirement
Requirement 1 — Campaign Data

## PostgreSQL Source
public.ppc_etl_performance_data (record_type = campaign, source = 3)

## Files Changed
- `C:\Users\PC\Documents\piranav_aios\Staff-requirements\pages\sonya.html`

## Campaigns Found (7)

| Campaign ID | Campaign Name | L30 Cost | L30 Conv Value | L30 Conv | L30 ROAS% | Segment |
|---|---|---|---|---|---|---|
| 21435967873 | Pmax UK \| Sonya \| Klarna \| PH_ALL | £1,902.53 | £6,098.94 | 209.92 | 320.57% | OK |
| 22943583032 | Pmax UK \| Sonya \| Shoptimised \| SUMMER_TRENDS | £542.70 | £1,190.44 | 23.55 | 219.36% | Bad |
| 23526695953 | Pmax UK \| Sonya \| Klarna \| EUR_76 | £457.51 | £1,834.88 | 31.99 | 401.06% | Best |
| 23515806682 | Pmax UK \| Sonya \| SONYA2026 | £153.29 | £99.23 | 2.73 | 64.73% | Worst |
| 23729304135 | Pmax UK \| Sonya \| Klarna \| GB C1 | £125.94 | £390.00 | 14.11 | 309.67% | OK |
| 22847654610 | Pmax UK \| Sonya \| GCSS \| NICC_07 | £2.48 | £0.00 | 0.00 | 0.00% | Worst |
| 23793722836 | D Gen \| Sonya \| Klarna \| PLight | £0.00 | £0.00 | 0.00 | — | Worst |

## Before Last Period (2026-05-09 to 2026-06-07)

| Campaign ID | BL Cost | BL Conv Value | BL Conv | BL ROAS% |
|---|---|---|---|---|
| 21435967873 | £2,713.00 | £10,549.56 | 281.58 | 388.85% |
| 22943583032 | £355.02 | £1,198.25 | 28.89 | 337.52% |
| 23526695953 | £326.75 | £1,042.30 | 27.21 | 318.99% |
| 23515806682 | £271.18 | £2,166.92 | 11.25 | 799.07% |
| 23729304135 | £387.12 | £1,552.24 | 21.04 | 400.97% |
| 22847654610 | £158.43 | £351.28 | 14.42 | 221.73% |
| 23793722836 | £19.98 | £0.00 | 0.00 | 0.00% |

## KPI Totals (Last 30 Days — all 7 campaigns)

| Metric | Value |
|---|---|
| Total Cost | £3,184.45 |
| Total Conv. Value | £9,613.49 |
| Total Conversions | 282.30 |
| Avg ROAS (weighted) | 301.89% |
| Best Campaign | EUR_76 (401.06%) |
| Worst Campaign | SONYA2026 (64.73%) |

## ROAS Segment Distribution

| Segment | Count | Campaigns |
|---|---|---|
| Best (≥400%) | 1 | EUR_76 |
| Better (350–399%) | 0 | — |
| OK (300–349%) | 2 | PH_ALL, GB C1 |
| Bad (200–299%) | 1 | SUMMER_TRENDS |
| Worst (<200%) | 3 | SONYA2026, NICC_07, D Gen |

## Source Validation
- public.ppc_etl_performance_data confirmed as correct daily-grain source for Google Ads
- Validated against Google Ads UI for campaign 21435967873 June 2026: Cost £2,070.89 matched UI ~£2,070 ✓
- See: evidence/google-ads/validation-campaign-21435967873-june-2026.md
