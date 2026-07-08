# Google Ads Campaign Validation — Evidence Record

## Campaign
**ID:** 21435967873
**Name:** Pmax UK | Sonya | Klarna | PH_ALL | Covertion > 2 | MCV | UK

## Validation Period
2026-06-01 to 2026-06-30 (exact calendar month — NOT rolling 30 days)

## Validation Date
2026-07-08

## Validated By
Claude Code — read-only PostgreSQL

---

## Google Ads UI Reference Values

| Metric | UI Value |
|---|---|
| Cost | ~£2,070 |
| Sales / Conversion Value | ~£6,970 |
| Conversions | 221.20 |
| ROAS | 336.57% |
| ROAS check | 6,970 / 2,070 × 100 = 336.57% ✓ |

---

## Overall Result

**PASS**

`public.ppc_etl_performance_data` (record_type = campaign, source = 3) holds daily-grain Google Ads data for all 30 days of June 2026. Values match Google Ads UI within rounding margin.

**Correct canonical source:** `public.ppc_etl_performance_data`
**Filter:** `record_id = '21435967873' AND record_type = 'campaign' AND source = 3 AND date >= '2026-06-01' AND date <= '2026-06-30'`

---

## Confirmed Match — public.ppc_etl_performance_data

| Metric | PostgreSQL | Google Ads UI | Difference |
|---|---|---|---|
| Cost | £2,070.89 | ~£2,070 | £0.89 |
| Sales | £6,966.33 | ~£6,970 | £3.67 |
| Conversions | 221.03 | 221.20 | 0.17 |
| ROAS % | 336.39% | 336.57% | 0.18pp |
| Clicks | 4,543 | — | — |
| Impressions | 299,699 | — | — |
| Days covered | 30/30 | 30 | ✅ |

**Canonical query:**
```sql
SELECT MIN(date) AS date_from, MAX(date) AS date_to,
  ROUND(SUM(spend)::numeric, 2) AS cost,
  ROUND(SUM(sales)::numeric, 2) AS sales,
  ROUND(SUM(orders)::numeric, 2) AS conversions,
  ROUND((SUM(sales)/NULLIF(SUM(spend),0)*100)::numeric, 2) AS roas_pct,
  SUM(clicks) AS clicks, SUM(impressions) AS impressions
FROM public.ppc_etl_performance_data
WHERE record_id = '21435967873'
  AND record_type = 'campaign'
  AND source = 3
  AND date >= '2026-06-01'
  AND date <= '2026-06-30';
```

---

## Tables Inspected

### 1. staging_ai.google_spend_sku_capital_attribution_v1

- **Window:** Rolling 30d ending run_date 2026-06-11 (~May 12 – Jun 11)
- **Campaign found:** YES

| Metric | DB Value | UI Value | Gap | Gap % |
|---|---|---|---|---|
| Cost | £2,046.72 | £2,070 | £23.28 | 1.1% |
| Sales | £5,126.65 | £6,970 | £1,843.35 | 26.4% |
| Conversions | 152.86 | 221.20 | 68.34 | 30.9% |
| ROAS % | 250.48% | 336.57% | 86.09pp | — |
| Clicks | 4,482 | — | — | — |
| Impressions | 155,805 | — | — | — |

**Verdict:** PARTIAL MATCH — correct raw source, incomplete window. Pipeline must re-run with run_date = 2026-07-01.

**SQL used:**
```sql
SELECT run_date, COUNT(*) AS rows_used,
  ROUND(SUM(spend)::numeric, 2) AS cost,
  ROUND(SUM(revenue)::numeric, 2) AS sales,
  ROUND(SUM(conversions)::numeric, 2) AS conversions,
  ROUND((SUM(revenue)/NULLIF(SUM(spend),0)*100)::numeric, 2) AS roas_pct,
  SUM(clicks) AS clicks, SUM(impressions) AS impressions
FROM staging_ai.google_spend_sku_capital_attribution_v1
WHERE google_campaign_id = '21435967873'
GROUP BY run_date ORDER BY run_date DESC;
```

---

### 2. staging_ai.cppc_pmax_campaign_grain_action_queue_v1

- **Window:** Rolling 30d ending ~2026-07-08 (~Jun 8 – Jul 8)
- **Campaign found:** YES

| Metric | DB Value |
|---|---|
| Cost | £278.36 |
| Sales | £1,641.59 |
| Conversions | 40.10 |
| ROAS % | 589.74% |

**Verdict:** DOES NOT MATCH — rolling window excludes Jun 1–7 peak spend. Not usable for calendar-month reporting.

---

### 3. staging_ai.cppc_workbook_campaign_performance_v1

- **Window:** as_of 2026-07-01 (~Jun 1 – Jun 30)
- **Campaign found:** YES

| Metric | DB Value |
|---|---|
| Cost | £15.66 |
| Sales | NULL |
| Conversions | NULL |

**Verdict:** DOES NOT MATCH — source contamination. Upstream is `cppc_pmax_card_render_enriched_v1` (card management view), not raw ads import. Revenue/conversions NULL.

---

### 4. staging_ai.cppc_pmax_campaign_passport_v1

- **Window:** snapshot 2026-07-01 (~Jun 1 – Jun 30)
- **Campaign found:** YES

| Metric | DB Value |
|---|---|
| Cost | £15.66 |
| Sales | NULL |
| Conversions | NULL |
| Evidence Source | staging_ai.cppc_pmax_card_render_enriched_v1 |

**Verdict:** DOES NOT MATCH — same upstream contamination as workbook (Table 3). Passport feeds workbook.

---

### 5. staging_ai.pmax_18m_postmortem_fact_v1

- **Window:** Lifetime Dec 2024 – Jun 2026 (product/SKU grain, no daily date column)
- **Campaign found:** YES

| Metric | DB Value |
|---|---|
| Cost | £22,284.50 |
| Sales | £64,804.75 |
| Conversions | 2,003.44 |
| ROAS % | 290.81% |

**Verdict:** DOES NOT MATCH — lifetime cumulative fact table. Cannot be filtered to June 2026 calendar month.

---

## Source Conflict Summary

| Source | Window | Cost | Match? |
|---|---|---|---|
| Google Ads UI | Jun 1–30 exact | £2,070 | REFERENCE |
| google_spend_sku_capital_attribution_v1 | ~May 12–Jun 11 (run 2026-06-11) | £2,046.72 | PARTIAL |
| cppc_pmax_campaign_grain_action_queue_v1 | ~Jun 8–Jul 8 (rolling) | £278.36 | NO |
| cppc_workbook_campaign_performance_v1 | ~Jun 1–Jun 30 (as_of Jul 1) | £15.66 | NO |
| cppc_pmax_campaign_passport_v1 | ~Jun 1–Jun 30 (snapshot Jul 1) | £15.66 | NO |
| pmax_18m_postmortem_fact_v1 | Lifetime Dec 2024–Jun 2026 | £22,284.50 | NO |

**SOURCE CONFLICT: YES** — three sources show £2,046 / £278 / £15 for the same campaign. Explained by different window types and source contamination, not data corruption.

---

## Root Cause

| Cause | Table | Severity |
|---|---|---|
| Pipeline not re-run after Jun 11 — no run_date = 2026-07-01 | Table 1 | P1 — blocks full validation |
| Rolling window shifted past Jun 1–7 peak spend | Table 2 | P2 — design constraint |
| Source contamination: card_render_enriched_v1 instead of ads import | Tables 3 & 4 | P1 — permanent data quality defect |
| Lifetime fact table, no date filter column | Table 5 | Low — wrong table type |

---

## Recommended Canonical Source

**`public.ppc_etl_performance_data`**

Filter: `record_id = '21435967873' AND record_type = 'campaign' AND source = 3`

This table holds daily-grain Google Ads data from January 2025 onwards. Any calendar month can be queried exactly by setting the `date` range. Validated PASS for June 2026.

**Note:** `staging_ai.google_spend_sku_capital_attribution_v1` is a rolling-30d snapshot table — it cannot reliably return exact calendar-month totals. Do not use it for fixed-period financial reporting.

---

## Next Actions

| Priority | Action | Owner |
|---|---|---|
| P1 | Run google_spend_sku_capital_attribution_v1 pipeline with run_date = 2026-07-01 | Data/Tech team |
| P1 | Re-run validation query after pipeline run | Piranav / Claude Code |
| P2 | Schedule pipeline monthly on 1st of each month | Data/Tech team |
| P2 | Fix cppc_pmax_campaign_passport_v1 — replace card_render source with raw ads attribution | Data/Tech team |
| P3 | Remove action queue from fixed-period financial reporting | Data/Tech team |

---

## Companion Files

- Validation record: `C:\Users\PC\Documents\piranav_aios\validation\sonya\google-ads-validation-june-2026.md`
- Full evidence: `C:\Users\PC\Documents\piranav_aios\evidence\sonya\google-ads-data-validation-2026-06-01-to-2026-06-30.md`
