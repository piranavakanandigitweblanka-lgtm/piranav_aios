# Thivajini Req 1 — GPT Prompt Capture
## Discovery Result for Approval Decision

**Title:** GPT Prompt — Req 1 Discovery Result  
**Purpose:** Capture the discovery prompt for GPT review and approval decision  
**Team member:** Thivajini  
**Requirement:** Weekly Google Ads vs Shopify UTM revenue reconciliation dashboard  
**Date:** 2026-07-09  
**Evidence path:** `evidence/Thivajini/req1-discovery-evidence-2026-07-09.md`  
**Validation path:** `validation/Thivajini/req1-discovery-validation-2026-07-09.md`

---

## DISCOVERY TABLE

| Area | Finding | Evidence Path | Risk | Recommendation |
|------|---------|---------------|------|----------------|
| Existing AIOS assets | No reconciliation dashboard exists for Thivajini or LEDSone FR | AIOS-wide grep, `pages/thivagini.html` placeholder | LOW | Safe to create new |
| Google Ads conversion value | `public.ppc_etl_performance_data` — sub_source_id=233, source=3, record_type='campaign'. Fields: date, sales (conv. value), spend, orders. Active data Aug 2025–Jul 2026. | evidence file | NONE | Use this as Google Ads source |
| LEDSone FR identifier | sub_source_id=233, marketplace_id=9. Confirmed by active campaigns (Oct 2025–Jul 2026) — only FR account in that marketplace bucket | evidence file | LOW — not confirmed via named mapping table | Data/Tech team to confirm sub_source_id=233 = FR |
| Shopify UTM orders | `public.shopify_transactions` — payment data only, no UTM fields. No Shopify order table with UTM in any schema | evidence file | HIGH — blocks entire reconciliation | ETL or API extract required |
| GA4 source/medium data | `raw_data.ga4_source_medium_daily` — correct schema (source_medium, purchase_revenue, date, property_id) but ZERO ROWS | evidence file | HIGH — alternative path blocked | Activate GA4 ETL pipeline for ledsone.fr |
| Order attribution pilot | `cppc_order_truth_pilot` — correct schema design (utm_source, google_claim, revenue_gbp) but 100 staging rows, all attribution NULL | evidence file | MEDIUM — right design, wrong data | Promote pilot to production with real ETL |
| Variance formula | Documented: ABS(difference)/shopify_revenue * 100. Thresholds: PASS≤2%, REVIEW≤5%, FAIL>5% | evidence file | LOW — formula is standard | Needs Thivajini threshold approval before use |
| Duplicate dashboard | NONE found | AIOS grep | NONE | Safe to proceed |
| Weekly reconciliation | BLOCKED — Google Ads side ready, Shopify side missing | evidence file | CRITICAL | Cannot build until data gap resolved |

---

## SUMMARY

**Requirement:** Thivajini — weekly dashboard cross-checking Google Ads conversion value vs Shopify UTM-attributed orders, flags variance  
**Requirement source:** Staff verbal/written requirement  
**Requester:** Thivajini  
**Department owner:** Digital Marketing / Google Ads / PPC  
**Business question:** Does Google Ads conversion value match Shopify revenue from UTM-attributed Google Ads orders each week?

**PostgreSQL objects inspected:**
- `public.ppc_etl_performance_data` — Google Ads daily grain (CONFIRMED SOURCE)
- `public.shopify_transactions` — Shopify payment data (NO UTM)
- `public.order_transaction` — Amazon order table (NOT SHOPIFY)
- `raw_data.ga4_source_medium_daily` — GA4 aggregate (EMPTY)
- `staging_ai.cppc_order_truth_pilot` — attribution pilot (STAGING, NULL DATA)
- `staging_ai.marketing_sales_truth_ledger` — revenue ledger (NO ATTRIBUTION)
- `public.google_merchants` — merchant mapping
- 6 schemas × all user tables

**Google Ads data source:** FOUND — `public.ppc_etl_performance_data`  
**Shopify UTM data source:** MISSING — no production table with UTM attribution for FR Shopify orders  
**Weekly reconciliation possible:** ❌ NOT YET — Shopify UTM side is blocked

**Example SQL — Google Ads side (ready):**
```sql
SELECT DATE_TRUNC('week', date) AS week_start,
  ROUND(SUM(sales)::numeric, 2) AS google_ads_conversion_value,
  ROUND(SUM(spend)::numeric, 2) AS google_ads_spend
FROM public.ppc_etl_performance_data
WHERE source = 3 AND sub_source_id = 233 AND record_type = 'campaign'
GROUP BY DATE_TRUNC('week', date)
ORDER BY week_start DESC;
```

**Sample result (Shopify side):** NULL — no data

**Duplicate dashboard risk:** NONE

**Recommended dashboard:** Weekly table with 13-week rolling window, colour-coded PASS/REVIEW/FAIL status — pending Shopify data source

**PASS/FAIL rule:** PASS ≤2%, REVIEW 2–5%, FAIL >5% — *Proposed rule — needs Thivajini approval*

**Stop conditions hit:**
1. Shopify UTM fields missing from all production tables
2. GA4 source/medium table = 0 rows
3. Attribution pilot = staging only, all NULL

**Final decision:**

| Option | Decision |
|--------|----------|
| Reuse existing dashboard | NOT POSSIBLE — none exists |
| Extend existing asset | NOT POSSIBLE — none exists |
| Merge with another dashboard | NOT RECOMMENDED — no suitable candidate |
| Create New | APPROVED in principle — but BLOCKED by data gap |
| Stop | RECOMMENDED until data gap resolved |

**GPT is requested to decide:**
1. Which data source path to pursue — GA4 ETL activation vs Shopify order UTM ETL vs other
2. Approve or modify variance thresholds (2%/5%)
3. Confirm sub_source_id=233 = LEDSone FR with data/tech team
4. Approve build once data source is confirmed

---

**Owner:** Thivajini  
**Reviewer:** GPT / Piranav  
**Status:** BLOCKED — awaiting GPT decision on data gap remediation  
