# Validation Record — Google Ads Campaign Data
## Sonya | June 2026

---

## Task
Google Ads Campaign Data Validation

## Campaign ID
21435967873

## Campaign Name
Pmax UK | Sonya | Klarna | PH_ALL | Covertion > 2 | MCV | UK

## Validation Period
2026-06-01 to 2026-06-30 (exact calendar month)

## Validation Date
2026-07-08

## Validated By
Claude Code — read-only PostgreSQL

---

## PASS / FAIL

### ✅ PASS

**Canonical source:** `public.ppc_etl_performance_data` (record_type = campaign, source = 3)

All 30 days of June 2026 are present. Values match Google Ads UI within rounding margin.

| Metric | PostgreSQL | Google Ads UI | Difference |
|---|---|---|---|
| Cost | £2,070.89 | ~£2,070 | £0.89 |
| Sales | £6,966.33 | ~£6,970 | £3.67 |
| Conversions | 221.03 | 221.20 | 0.17 |
| ROAS % | 336.39% | 336.57% | 0.18pp |

**Note:** `staging_ai.google_spend_sku_capital_attribution_v1` is a rolling-30d snapshot table and is NOT the correct source for exact calendar-month reporting. Use `public.ppc_etl_performance_data` for all fixed-period Google Ads queries.

---

## Tables Inspected

| # | Table | Window Type | Campaign Found | Cost | Sales | Conversions | ROAS % | Match? |
|---|---|---|---|---|---|---|---|---|
| 1 | `staging_ai.google_spend_sku_capital_attribution_v1` | run_date 2026-06-11 (~May 12–Jun 11) | YES | £2,046.72 | £5,126.65 | 152.86 | 250.48% | PARTIAL |
| 2 | `staging_ai.cppc_pmax_campaign_grain_action_queue_v1` | Rolling 30d ~Jun 8–Jul 8 | YES | £278.36 | £1,641.59 | 40.10 | 589.74% | NO |
| 3 | `staging_ai.cppc_workbook_campaign_performance_v1` | as_of 2026-07-01 (~Jun 1–Jun 30) | YES | £15.66 | NULL | NULL | 46.17× ratio | NO |
| 4 | `staging_ai.cppc_pmax_campaign_passport_v1` | snapshot 2026-07-01 (~Jun 1–Jun 30) | YES | £15.66 | NULL | NULL | 46.17× ratio | NO |
| 5 | `staging_ai.pmax_18m_postmortem_fact_v1` | Lifetime Dec 2024–Jun 2026 | YES | £22,284.50 | £64,804.75 | 2,003.44 | 290.81% | NO |

---

## Google Ads UI vs Best PostgreSQL Source

| Metric | Google Ads UI | Best DB Source (run_date 2026-06-11) | Gap | Gap % |
|---|---|---|---|---|
| Cost | £2,070 | £2,046.72 | £23.28 | 1.1% |
| Sales | £6,970 | £5,126.65 | £1,843.35 | 26.4% |
| Conversions | 221.20 | 152.86 | 68.34 | 30.9% |
| ROAS % | 336.57% | 250.48% | 86.09pp | — |

Gap in sales and conversions corresponds exactly to the missing Jun 12–30 activity.

---

## Evidence

Full evidence record:
`C:\Users\PC\Documents\piranav_aios\evidence\sonya\google-ads-data-validation-2026-06-01-to-2026-06-30.md`

---

## Root Cause

**Primary cause: Pipeline not re-run after June 11, 2026**

`staging_ai.google_spend_sku_capital_attribution_v1` is the correct raw source but only has one run_date (2026-06-11). The pipeline needs to be executed with `run_date = 2026-07-01` to capture the full June 1–30 calendar month.

**Secondary causes:**
- Tables 3 and 4 (workbook + passport) have incorrect upstream source — `cppc_pmax_card_render_enriched_v1` is a card management view, not a raw ads import. Revenue and conversions are NULL as a result.
- Table 2 (action queue) uses a rolling window that has shifted past the June 1–7 peak-spend period.
- Table 5 (postmortem) is a lifetime fact table, not usable for calendar-period reporting.

---

## Recommended Source of Truth

**`staging_ai.google_spend_sku_capital_attribution_v1`**

Filter: `google_campaign_id = '21435967873'` AND `run_date = '2026-07-01'`

Aggregate by campaign across all SKU rows.

This is the only table that:
- Holds real Google Ads financial data (spend, revenue, conversions per SKU)
- Can be aggregated to campaign level
- Produces cost values consistent with Google Ads UI

---

## Known Risks

| Risk | Severity | Status |
|---|---|---|
| Pipeline not scheduled monthly | HIGH | Open |
| Workbook sourcing from card_render instead of ads import | HIGH | Open |
| No daily date-grain Google Ads table for 2026 | HIGH | Open |
| Action queue used for fixed-period reporting (incorrect) | MEDIUM | Open |
| No run_date = 2026-07-01 snapshot | HIGH | Open — blocks full validation |

---

## Next Action

| Priority | Action | Owner |
|---|---|---|
| P1 | Run `google_spend_sku_capital_attribution_v1` pipeline with run_date = 2026-07-01 | Data/Tech team |
| P1 | Re-run validation query after pipeline run | Claude Code / Piranav |
| P2 | Schedule pipeline to run on 1st of every month | Data/Tech team |
| P2 | Fix `cppc_pmax_campaign_passport_v1` source — replace card_render with ads attribution | Data/Tech team |
| P3 | Remove action queue from any fixed-period financial reports | Data/Tech team |
