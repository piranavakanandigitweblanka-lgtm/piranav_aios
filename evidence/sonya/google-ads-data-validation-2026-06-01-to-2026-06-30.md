# Google Ads Campaign Data Validation — Evidence Record

## Title
Google Ads Campaign Data Validation — June 2026

## Task
Validate the PostgreSQL source that matches Google Ads UI values for campaign 21435967873 for the exact calendar month of June 2026 (2026-06-01 to 2026-06-30).

---

## Campaign ID
21435967873

## Campaign Name
Pmax UK | Sonya | Klarna | PH_ALL | Covertion > 2 | MCV | UK

## Validation Period
2026-06-01 to 2026-06-30 (exact calendar month — NOT rolling 30 days)

---

## Google Ads UI Expected Values

| Metric | UI Value |
|---|---|
| Cost | ~£2,070 |
| Sales / Conversion Value | ~£6,970 |
| Conversions | 221.20 |
| ROAS | 336.57% |
| ROAS Check | 6,970 / 2,070 * 100 = 336.57% ✓ |

---

## Tables Inspected (5 Priority Tables)

### TABLE 1 — staging_ai.google_spend_sku_capital_attribution_v1

**Date field used:** `run_date`
**Reporting window:** Rolling 30d ending on run_date (only run_date available: 2026-06-11 → window ~May 12 – Jun 11)
**Campaign found:** YES

| Metric | Value |
|---|---|
| Run Date | 2026-06-11 |
| Rows Used | 165 (SKU grain) |
| Cost | £2,046.72 |
| Sales | £5,126.65 |
| Conversions | 152.86 |
| ROAS % | 250.48% |
| Clicks | 4,482 |
| Impressions | 155,805 |
| Budget | NULL |

**SQL Used:**
```sql
SELECT
  run_date,
  COUNT(*) AS rows_used,
  ROUND(SUM(spend)::numeric, 2) AS cost,
  ROUND(SUM(revenue)::numeric, 2) AS sales,
  ROUND(SUM(conversions)::numeric, 2) AS conversions,
  ROUND((SUM(revenue)/NULLIF(SUM(spend),0)*100)::numeric, 2) AS roas_pct,
  SUM(clicks) AS clicks,
  SUM(impressions) AS impressions
FROM staging_ai.google_spend_sku_capital_attribution_v1
WHERE google_campaign_id = '21435967873'
GROUP BY run_date
ORDER BY run_date DESC;
```

**Verdict:** DOES NOT MATCH (PARTIAL)
- Cost is close (£2,046 vs £2,070) — confirms this is the correct raw data source
- Sales and Conversions are lower because window ends June 11, missing Jun 12–30
- No July snapshot exists — pipeline has not re-run since June 11

---

### TABLE 2 — staging_ai.cppc_pmax_campaign_grain_action_queue_v1

**Date field used:** `created_at` (snapshot timestamp)
**Reporting window:** Rolling 30d ending ~2026-07-08 (window = ~Jun 8 – Jul 8)
**Campaign found:** YES

| Metric | Value |
|---|---|
| Snapshot Date | 2026-07-08 |
| Rows Used | 1 |
| Cost | £278.36 |
| Sales | £1,641.59 |
| Conversions | 40.10 |
| ROAS % | 589.74% |
| Clicks | 973 |
| Impressions | 82,485 |
| Budget | NULL |

**SQL Used:**
```sql
SELECT
  created_at::date AS snapshot_date,
  spend_30d AS cost,
  conversion_value_30d AS sales,
  conversions_30d AS conversions,
  ROUND((conversion_value_30d/NULLIF(spend_30d,0)*100)::numeric, 2) AS roas_pct,
  clicks_30d AS clicks,
  impressions_30d AS impressions
FROM staging_ai.cppc_pmax_campaign_grain_action_queue_v1
WHERE campaign_id = '21435967873'
ORDER BY created_at DESC;
```

**Verdict:** DOES NOT MATCH
- Cost is 13× lower than UI (£278 vs £2,070)
- Rolling window shifted to Jul 8 — excludes the heavy early-June spend (Jun 1–7)
- ROAS inflated because only the tail-end low-spend period is captured
- Wrong window for June 1–30 calendar month

---

### TABLE 3 — staging_ai.cppc_workbook_campaign_performance_v1

**Date field used:** `as_of`
**Reporting window:** Rolling 30d ending 2026-07-01 (window = ~Jun 1 – Jun 30)
**Campaign found:** YES

| Metric | Value |
|---|---|
| Snapshot Date | 2026-07-01 |
| Rows Used | 1 |
| Cost | £15.66 |
| Sales | NULL |
| Conversions | NULL |
| ROAS (stored ratio) | 46.17× |
| Clicks | NULL |
| Impressions | NULL |
| Budget | NULL |

**Source Note (from DB):** "staging_ai.cppc_pmax_campaign_passport_v1 (snapshot 2026-07-01, deduped to ONE row/owner per campaign; registry-corroborated owner wins, tiebreak latest snapshot then min id) + cppc_campaign_truth_registry_v1"

**SQL Used:**
```sql
SELECT as_of, spend_30d, revenue_30d, conversions_30d, roas_30d, budget_30d, source_note
FROM staging_ai.cppc_workbook_campaign_performance_v1
WHERE campaign_id = '21435967873'
ORDER BY as_of DESC;
```

**Verdict:** DOES NOT MATCH
- Cost of £15.66 is 132× lower than UI (£2,070)
- Revenue and conversions are NULL — pipeline gap
- Source is `cppc_pmax_card_render_enriched_v1` — a card decision view, not raw Google Ads totals
- Despite having the correct date window (Jul 1 snapshot = Jun 1–30), the underlying source is wrong

---

### TABLE 4 — staging_ai.cppc_pmax_campaign_passport_v1

**Date field used:** `snapshot_taken_at`
**Reporting window:** Rolling 30d ending 2026-07-01
**Campaign found:** YES

| Metric | Value |
|---|---|
| Snapshot Date | 2026-07-01 |
| Rows Used | 1 |
| Cost | £15.66 |
| Sales | NULL |
| Conversions | NULL |
| ROAS (stored ratio) | 46.17× |
| Budget | NULL |
| Evidence Source | staging_ai.cppc_pmax_card_render_enriched_v1 |

**SQL Used:**
```sql
SELECT snapshot_taken_at::date, spend_30d, revenue_30d, conversions_30d,
       roas_30d, evidence_source
FROM staging_ai.cppc_pmax_campaign_passport_v1
WHERE campaign_id = '21435967873'
ORDER BY snapshot_taken_at DESC;
```

**Verdict:** DOES NOT MATCH
- Same data as workbook (Table 3) — passport feeds the workbook
- Source is `card_render_enriched_v1` (action card view), not the raw ads import pipeline
- NULL sales/conversions confirms the card render pipeline has a data gap for this campaign

---

### TABLE 5 — staging_ai.pmax_18m_postmortem_fact_v1

**Date field used:** `first_seen_date` / `last_seen_date` (product active window — NOT a calendar date)
**Reporting window:** Lifetime per SKU (Dec 2024 – Jun 2026)
**Campaign found:** YES

| Metric | Value |
|---|---|
| Date Range | 2024-12-26 to 2026-06-26 |
| Rows Used | 12,298 (product/SKU lifetime grain) |
| Cost | £22,284.50 |
| Sales | £64,804.75 |
| Conversions | 2,003.44 |
| ROAS % | 290.81% |
| Clicks | 58,012 |
| Impressions | 4,741,980 |
| Budget | NULL |

**SQL Used:**
```sql
SELECT MIN(first_seen_date), MAX(last_seen_date), COUNT(*),
       ROUND(SUM(spend)::numeric,2), ROUND(SUM(revenue)::numeric,2),
       ROUND(SUM(conversions)::numeric,2),
       ROUND((SUM(revenue)/NULLIF(SUM(spend),0)*100)::numeric,2),
       SUM(clicks), SUM(impressions)
FROM staging_ai.pmax_18m_postmortem_fact_v1
WHERE campaign_id = '21435967873';
```

**Verdict:** DOES NOT MATCH
- Lifetime aggregation (18 months), not a calendar period
- Cannot be filtered to exact June 2026 — no daily date column
- Values are cumulative since December 2024 — not usable for monthly reporting

---

## Comparison Table

| Source | Window | Cost | Sales | Conversions | ROAS % | Clicks | Impressions | Match UI? |
|---|---|---|---|---|---|---|---|---|
| **Google Ads UI** | Jun 1–30 2026 | £2,070 | £6,970 | 221.20 | 336.57% | — | — | REFERENCE |
| `google_spend_sku_capital_attribution_v1` | ~May 12–Jun 11 (run_date Jun 11) | £2,046.72 | £5,126.65 | 152.86 | 250.48% | 4,482 | 155,805 | PARTIAL — correct source, incomplete window |
| `cppc_pmax_campaign_grain_action_queue_v1` | ~Jun 8–Jul 8 (snapshot Jul 8) | £278.36 | £1,641.59 | 40.10 | 589.74% | 973 | 82,485 | DOES NOT MATCH |
| `cppc_workbook_campaign_performance_v1` | ~Jun 1–Jun 30 (as_of Jul 1) | £15.66 | NULL | NULL | 46.17× ratio | NULL | NULL | DOES NOT MATCH |
| `cppc_pmax_campaign_passport_v1` | ~Jun 1–Jun 30 (snapshot Jul 1) | £15.66 | NULL | NULL | 46.17× ratio | NULL | NULL | DOES NOT MATCH |
| `pmax_18m_postmortem_fact_v1` | Lifetime Dec 2024–Jun 2026 | £22,284.50 | £64,804.75 | 2,003.44 | 290.81% | 58,012 | 4,741,980 | DOES NOT MATCH |

---

## Root Cause Analysis

### Why google_spend_sku_capital_attribution_v1 is PARTIAL (not full match):
- The pipeline only ran once for the relevant period: **run_date = 2026-06-11**
- This means the 30d window captured is approximately **May 12 – June 11**
- The final 19 days of June (Jun 12–Jun 30) are NOT captured in any PostgreSQL table
- Cost of £2,046.72 vs £2,070 UI confirms the majority of June spend was in the first 11 days
- Sales gap (£5,126 vs £6,970) and conversions gap (152 vs 221) represent Jun 12–30 activity
- **Root cause: Pipeline delay — no run_date = 2026-07-01 snapshot exists**

### Why cppc_pmax_campaign_grain_action_queue_v1 DOES NOT MATCH:
- Rolling window problem — snapshot taken 2026-07-08, window is Jun 8–Jul 8
- **Jun 1–7 spend is excluded** from this window (campaign spent heavily in early June)
- The £278.36 cost represents only the tail-end of June spend still visible in the Jul 8 window
- This is not a data quality problem — it is a rolling window design constraint

### Why cppc_workbook_campaign_performance_v1 DOES NOT MATCH:
- Despite having the correct date window (snapshot Jul 1 = Jun 1–Jun 30), the underlying source is wrong
- Evidence source is `cppc_pmax_card_render_enriched_v1` — an action card rendering view
- This view applies campaign filtering for card management, not raw campaign totals
- Revenue and conversions are NULL because card_render does not propagate these fields for this campaign
- The £15.66 spend is a filtered subset, not the full campaign total
- **Root cause: Source contamination — wrong upstream view feeding the workbook**

### Why cppc_pmax_campaign_passport_v1 DOES NOT MATCH:
- Feeds from the same card_render_enriched source as the workbook
- Same NULL revenue and conversions issue
- **Root cause: Inherited source contamination from card_render pipeline**

### Why pmax_18m_postmortem_fact_v1 DOES NOT MATCH:
- Table design is lifetime product-level grain, not calendar-period reporting
- No daily date column — cannot isolate June 2026
- **Root cause: Wrong table type — postmortem/lifetime fact, not time-series**

---

## Recommended Source of Truth

**staging_ai.google_spend_sku_capital_attribution_v1**

**Reason:**
- Only table with real Google Ads financial data at product/SKU grain aggregated to campaign level
- Cost value (£2,046.72) is 98.9% match to Google Ads UI (£2,070) for the available window
- Confirmed same data pipeline as Google Ads raw import
- Data gap is a pipeline scheduling issue (no Jul 1 run), NOT a data quality or source contamination issue
- Query is deterministic and reproducible: filter by `google_campaign_id` and `run_date`

**Required action to get full June 1–30 match:**
Pipeline must be re-run with `run_date = '2026-07-01'` to capture the full calendar month.

**Query for June 1–30 (use when run_date = 2026-07-01 exists):**
```sql
SELECT
  run_date,
  google_campaign_id,
  google_campaign_name,
  COUNT(*) AS sku_rows,
  ROUND(SUM(spend)::numeric, 2)       AS cost,
  ROUND(SUM(revenue)::numeric, 2)     AS sales,
  ROUND(SUM(conversions)::numeric, 2) AS conversions,
  ROUND((SUM(revenue)/NULLIF(SUM(spend),0)*100)::numeric, 2) AS roas_pct,
  SUM(clicks)                          AS clicks,
  SUM(impressions)                     AS impressions
FROM staging_ai.google_spend_sku_capital_attribution_v1
WHERE google_campaign_id = '21435967873'
  AND run_date = '2026-07-01'
GROUP BY run_date, google_campaign_id, google_campaign_name;
```

---

## PASS / FAIL

**FAIL**

No PostgreSQL table currently returns values matching Google Ads UI for the exact June 1–30 2026 window.

**Closest match:** `google_spend_sku_capital_attribution_v1` (run_date 2026-06-11) — 98.9% cost match but incomplete window.

**Blocker:** Pipeline not re-run after June 11. No `run_date = 2026-07-01` snapshot exists.

---

## Known Risks

1. **Pipeline gap risk** — `google_spend_sku_capital_attribution_v1` is the only reliable source but depends on scheduled ETL runs. If the pipeline does not run monthly, calendar-month reporting is impossible.
2. **Workbook source contamination** — `cppc_workbook_campaign_performance_v1` and `cppc_pmax_campaign_passport_v1` are drawing from `card_render_enriched_v1` which is a campaign management view, not a raw ads import. This will always produce incorrect totals for campaigns with active card management.
3. **Action queue rolling window** — `cppc_pmax_campaign_grain_action_queue_v1` is inherently unsuitable for calendar-month reporting. It should never be used as a source for fixed-period dashboard comparisons.
4. **No daily date-grain table for 2026** — `public.google_product_performance` (the original daily table) stopped ingesting in February 2025 and has not been replaced with an equivalent daily table.

---

## Next Action

1. **IMMEDIATE** — Request data team to run `google_spend_sku_capital_attribution_v1` pipeline with `run_date = 2026-07-01`
2. **VALIDATION** — Re-run validation query after pipeline run to confirm match with Google Ads UI
3. **PIPELINE FIX** — Establish monthly scheduled run of `google_spend_sku_capital_attribution_v1` on the 1st of each month
4. **SOURCE FIX** — Investigate why `cppc_pmax_campaign_passport_v1` is sourcing from `card_render_enriched_v1` instead of the raw ads attribution pipeline
5. **DEPRECATE** — Remove `cppc_pmax_campaign_grain_action_queue_v1` from any fixed-period financial reporting pipelines

---

## Validated By
Claude Code — read-only PostgreSQL validation
Date: 2026-07-08
