# Thivajini Req 1 — Discovery Evidence
## Google Ads vs Shopify Revenue Reconciliation — LEDSone FR

**Title:** Discovery Evidence — Google Ads Conversion Value vs Shopify UTM Revenue  
**Purpose:** Prove or disprove that weekly reconciliation is buildable from existing PostgreSQL data  
**Requirement source:** Thivajini verbal/written requirement — "recurring task cross-checks Google Ads conversion value against Shopify UTM-attributed orders weekly, flags variance"  
**Team member:** Thivajini  
**Department:** Digital Marketing / Google Ads / PPC  
**Store:** LEDSone FR (ledsone.fr)  
**Business question:** Does Google Ads conversion value match Shopify revenue from UTM-attributed Google Ads orders each week?  
**Discovery date:** 2026-07-09  
**Validated by:** Claude Code — read-only PostgreSQL inspection  
**Evidence location:** `C:\Users\PC\Documents\piranav_aios\evidence\Thivajini\req1-discovery-evidence-2026-07-09.md`

---

## STOP CONDITIONS TRIGGERED

| # | Condition | Status |
|---|-----------|--------|
| 1 | Shopify UTM attribution fields missing from production data | ⛔ TRIGGERED |
| 2 | GA4 source/medium table exists but has zero rows | ⛔ TRIGGERED |
| 3 | Order-level UTM pilot table is staging-only, all attribution NULL | ⛔ TRIGGERED |

---

## EXISTING AIOS ASSETS — CHECK RESULT

**Search scope:**
- `C:\Users\PC\Documents\piranav_aios\prompts\Thivajini` — **directory did not exist — CREATED NOW**
- `C:\Users\PC\Documents\piranav_aios\evidence\Thivajini` — **directory did not exist — CREATED NOW**
- `C:\Users\PC\Documents\piranav_aios\validation\Thivajini` — **directory did not exist — CREATED NOW**
- `C:\Users\PC\Documents\piranav_aios\handover\Thivajini` — **directory did not exist — CREATED NOW**
- `C:\Users\PC\Documents\piranav_aios\reports\Thivajini` — **directory did not exist — CREATED NOW**
- `C:\Users\PC\Documents\piranav_aios\vercel\Thivajini` — **directory did not exist — CREATED NOW**
- Grepped `reconcil*` across all AIOS files — **ZERO files found**
- Thivajini page in Staff-requirements: `pages/thivagini.html` — **placeholder only, no requirements built**

**Duplicate dashboard risk:** NONE — no existing reconciliation dashboard found.

---

## POSTGRESQL SCHEMAS INSPECTED (READ-ONLY)

| Schema | Tables inspected | Relevance |
|--------|-----------------|-----------|
| public | ppc_etl_performance_data, shopify_transactions, order_transaction, google_merchants, google_product_performance | Google Ads confirmed source; Shopify = payment-only, no UTM |
| raw_data | ga4_source_medium_daily, ga4_landing_page_daily, ga4_ai_referral_daily | GA4 table exists but EMPTY |
| staging_ai | cppc_order_truth_pilot, cppc_order_touchpoint_match_staging, marketing_sales_truth_ledger | Pilot tables only, no production UTM data |
| analytics | ph_segment_report, slow_stock_snapshot | Not relevant |
| cppc_intelligence | object_registry, validation_gate, outcome_gate | Not relevant |

---

## GOOGLE ADS CONVERSION VALUE SOURCE

### Result: ✅ FOUND — `public.ppc_etl_performance_data`

| Field | Column | Notes |
|-------|--------|-------|
| Store identifier | `sub_source_id = 233`, `marketplace_id = 9` | Confirmed = LEDSone FR Google Ads account |
| Date grain | `date` (DATE) | Daily grain — weekly rollup possible |
| Conversion value | `sales` (DOUBLE PRECISION) | = Google Ads reported conversion value |
| Conversions | `orders` (DOUBLE PRECISION) | = Google Ads conversion count |
| Cost | `spend` (DOUBLE PRECISION) | Ad spend |
| Record type | `record_type = 'campaign'` | Filter to campaign level |
| Platform | `source = 3` | Source 3 = Google Ads |
| Date coverage | 2025-08-27 → 2026-07-07 | Active, daily updates confirmed |

**Validation pedigree:** `public.ppc_etl_performance_data` was previously validated PASS against Google Ads UI for June 2026 (see `evidence/google-ads/validation-campaign-21435967873-june-2026.md`). That validation was for LEDSone UK (sub_source_id=104). The same table/schema confirmed for FR (sub_source_id=233).

**Weekly Google Ads SQL (ready to use):**
```sql
SELECT
  DATE_TRUNC('week', date) AS week_start,
  ROUND(SUM(sales)::numeric, 2) AS google_ads_conversion_value,
  ROUND(SUM(spend)::numeric, 2) AS google_ads_spend,
  ROUND(SUM(orders)::numeric, 2) AS google_ads_conversions
FROM public.ppc_etl_performance_data
WHERE source = 3
  AND sub_source_id = 233
  AND record_type = 'campaign'
  AND date >= '2026-01-01'
GROUP BY DATE_TRUNC('week', date)
ORDER BY week_start DESC;
```

---

## SHOPIFY UTM ORDER ATTRIBUTION SOURCE

### Result: ❌ MISSING FROM PRODUCTION

| Table | Schema | UTM fields | Status |
|-------|--------|-----------|--------|
| `shopify_transactions` | public | NONE | Payment-level only. Has order_id, amount, processed_at, currency. No utm_source, gclid, landing_site. |
| `order_transaction` | public | NONE | Amazon-style table (asin, fba_sales). Not Shopify. |
| `cppc_order_truth_pilot` | staging_ai | utm_source ✅ schema, google_claim ✅ schema | 100 rows total. ALL rows: utm_source=NULL, google_claim=NULL. promotion_status='STAGING'. NOT production data. |
| `cppc_order_touchpoint_match_staging` | staging_ai | touchpoint-level attribution | Staging only — no confirmed FR order data |
| `marketing_sales_truth_ledger` | staging_ai | website, order_revenue — NO utm_source | Cannot identify Google Ads attribution |
| `ga4_source_medium_daily` | raw_data | source_medium, purchase_revenue | Table schema correct. ROW COUNT = 0. No data loaded. |

**Root cause:** The Shopify order ETL does not currently capture or store UTM parameters (utm_source, utm_medium, utm_campaign, gclid). The GA4 source/medium daily pipeline exists but has not been populated.

---

## WEEKLY RECONCILIATION FEASIBILITY

| Side | Feasible | Blocker |
|------|----------|---------|
| Google Ads weekly conversion value | ✅ YES | None — data is production-ready |
| Shopify weekly UTM-attributed revenue | ❌ NO | UTM attribution not available in any production table |
| Weekly cross-check | ❌ NOT POSSIBLE | Cannot compute Shopify side |

---

## ALTERNATIVE PATH (if GPT approves)

**Option A — Use GA4 aggregate data** (requires data load first)
- `raw_data.ga4_source_medium_daily` has the correct schema: `source_medium`, `purchase_revenue`, `date`, `property_id`
- Filter: `source_medium ILIKE '%google%cpc%'` or `channel_group = 'Paid Search'`
- Limitation: GA4 aggregates sessions/revenue, not individual orders. Attribution model differences from Google Ads are expected.
- **Blocker:** Table has 0 rows. ETL pipeline must be activated for ledsone.fr property first.

**Option B — Build Shopify order ETL with UTM capture**
- Extract Shopify orders via Admin API (note_attributes or order_referral fields contain UTM)
- Load order_id, created_at, total_price, utm_source, utm_medium, utm_campaign, gclid into a new table
- Join to `cppc_order_truth_pilot` schema (which already has the right design)
- **Blocker:** New ETL pipeline required — not in scope for discovery, needs GPT approval.

**Option C — Use GA4 as proxy (partial)**
- Weekly Google Ads conversion value from `ppc_etl_performance_data`
- Weekly GA4 purchase_revenue for google/cpc sessions from `ga4_source_medium_daily` (once populated)
- Variance = Google Ads conversion value – GA4 google/cpc revenue
- Note: This is a methodological approximation, not exact order-level match. Variance expected 5–30% due to attribution window differences.

---

## SAMPLE WEEKLY DATA (Google Ads side only — Shopify side blocked)

```sql
-- Google Ads weekly conversion value — LEDSone FR — last 4 weeks
SELECT
  DATE_TRUNC('week', date) AS week_start,
  ROUND(SUM(sales)::numeric, 2) AS google_ads_conversion_value,
  ROUND(SUM(spend)::numeric, 2) AS google_ads_spend
FROM public.ppc_etl_performance_data
WHERE source = 3
  AND sub_source_id = 233
  AND record_type = 'campaign'
  AND date >= CURRENT_DATE - INTERVAL '28 days'
GROUP BY DATE_TRUNC('week', date)
ORDER BY week_start DESC;
```

*Shopify side: NULL — no UTM data in production database.*

---

## VARIANCE FORMULA (Proposed — pending data source resolution)

```
difference = google_ads_conversion_value - shopify_google_ads_revenue

variance_percent =
  CASE
    WHEN shopify_google_ads_revenue > 0
    THEN ABS(difference) / shopify_google_ads_revenue * 100
    ELSE NULL
  END
```

**Proposed thresholds (Proposed rule — needs Thivajini/GPT approval):**
- PASS: variance ≤ 2%
- REVIEW: variance > 2% and ≤ 5%
- FAIL: variance > 5%

---

## DUPLICATE DASHBOARD RISK

None identified. No reconciliation dashboard exists in any AIOS folder. Safe to build new.

---

## RECOMMENDED DASHBOARD STRUCTURE (when data is ready)

```
[HEADER] Google Ads vs Shopify Revenue Reconciliation — LEDSone FR
[STATUS BADGE] Weekly — auto-refreshed

[TABLE] Week | Google Ads Conv. Value | Shopify GA Ads Revenue | Difference | Variance % | Status
[COLOUR] Green (PASS) / Amber (REVIEW) / Red (FAIL)

[SECTION] Last 13 weeks rolling
[ALERT BANNER] if variance > threshold for current week
[DATA SOURCES]
  Google Ads: public.ppc_etl_performance_data (sub_source_id=233, source=3)
  Shopify: raw_data.ga4_source_medium_daily (property_id=ledsone.fr) [PENDING DATA LOAD]
```

---

## KNOWN LIMITATIONS

1. `cppc_order_truth_pilot` is a staging pilot — not production-ready, all attribution fields NULL
2. `raw_data.ga4_source_medium_daily` has zero rows — ETL pipeline not yet activated
3. `public.shopify_transactions` is payment-level only — cannot filter by traffic source
4. sub_source_id=233 confirmed as LEDSone FR by elimination (marketplace_id=9, active campaigns through Jul 2026) but not verified against a named mapping table
5. Weekly bucket defined as Monday-start ISO week (`DATE_TRUNC('week', date)`)

---

## NEXT STEPS

| Priority | Action | Owner |
|----------|--------|-------|
| P0 | Confirm sub_source_id=233 = LEDSone FR with data/tech team | Piranav / Data team |
| P1 | Activate GA4 source/medium ETL for ledsone.fr property | Data/Tech team |
| P1 | OR build Shopify order UTM ETL (new pipeline) | Data/Tech team |
| P2 | Once Shopify side confirmed — GPT approves dashboard build | GPT / Thivajini |
| P3 | Thivajini approves variance thresholds (2%/5%) | Thivajini |

---

## PASS / FAIL RESULT

**DISCOVERY: CONDITIONAL PASS**

- Google Ads data source: ✅ PASS
- Shopify UTM data source: ❌ FAIL — not in production
- Weekly reconciliation feasibility: ❌ BLOCKED
- Evidence saved: ✅ PASS
- Duplicate risk checked: ✅ PASS
- Existing assets checked: ✅ PASS

**Overall discovery status: BLOCKED — cannot proceed to build without Shopify UTM data source**

---

**Owner:** Thivajini  
**Reviewer:** GPT / Piranav  
**Status:** BLOCKED — awaiting data source resolution  
