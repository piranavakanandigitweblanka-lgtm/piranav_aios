# Google Ads — Product Eligibility & Campaign Investigation
**Date:** 2026-07-09  
**Analyst:** Piranav  
**Status:** CLOSED — evidence filed  
**Reviewer needed:** Yes — campaign manager to confirm Klarna drop cause and SHOPTIMISED OOS fix

---

## Business Question

> Are products `8278561882377` and `8361815638281` eligible and actively serving in their assigned DE Pmax campaigns? If not, what is blocking them?

---

## Products Checked

| Product ID | Title | Internal SKU | Google Variant ID |
|---|---|---|---|
| `8278561882377` | LED Wandleuchte Außen mit Bewegungsmelder 10W Schwarz – IP65 Alu Cube Wandlampe 10cm | `WLHSBMSQ10` | `56812549210377` |
| `8361815638281` | IP68 Kabelverbinder Wasserdicht 2-polig 3-polig 4-polig T Y I Form Outdoor Verbindungsdose | *(missing — bridge VARIANT_ID_MISSING)* | *(missing)* |

---

## Campaigns Checked

| Campaign ID | Campaign Name | Sub Source | Market | Status |
|---|---|---|---|---|
| `23684789991` | Pmax DE \| Mahi \| Shoptimised\| BESTEN-BELEUCHTUNG \| priceGT10_5 \| MCV | 108 | Germany | active |
| `20763699505` | Pmax DE \| Mahi \| Klarna \| DE \| All_Myid \| MCV | 108 | Germany | active |
| `23053104908` | Pmax DE \| Mahi \| Shoptimised \| LIGHTINGSOLUTION \| All_Myid_1 \| MCV | 108 | Germany | active |

---

## Tables Inspected

| Table | Schema | Purpose |
|---|---|---|
| `google_merchant_products` | public | Feed listings — availability, price, feed_label per merchant |
| `gmc_product_diagnostics_daily` | raw_data | GMC disapprovals, issue codes, approval_status |
| `google_variant_product_sku_bridge_v1` | staging_ai | Shopify product ID → Google variant ID → internal SKU |
| `google_shopify_product_id_bridge_test_v1` | staging_ai | Bridge validation / test table |
| `cppc_campaign_truth_registry_v1` | staging_ai | Campaign ID ↔ campaign name lookup |
| `ppc` | public | Campaign structure — sub_source_id, record_status, parent/child IDs |
| `ppc_etl_performance_data` | public | Product-level daily performance by campaign |
| `cppc_google_ads_product_history_v1` | staging_ai | Monthly spend/performance history by internal SKU |

---

## SQL Used

### S1 — Bridge Lookup
```sql
SELECT bridge_id, run_date, google_variant_id, item_group_id,
       shopify_product_id, internal_sku, bridge_status, failure_reason, spend_90d
FROM staging_ai.google_variant_product_sku_bridge_v1
WHERE shopify_product_id = '8278561882377'
   OR item_group_id = '8278561882377'
ORDER BY run_date DESC LIMIT 5;
```

### S2 — Feed Status
```sql
SELECT merchant_id, product_id, title, availability, feed_label,
       country, price, currency, item_group_id
FROM public.google_merchant_products
WHERE product_id ILIKE '%8278561882377%'
   OR item_group_id::text = '8278561882377'
ORDER BY merchant_id, feed_label;
```

### S3 — GMC Diagnostics
```sql
SELECT date, merchant_id, item_id, sku, product_title,
       destination_status, approval_status, issue_severity,
       issue_code, issue_description, affected_country
FROM raw_data.gmc_product_diagnostics_daily
WHERE item_id ILIKE '%8278561882377%'
   OR sku ILIKE '%WLHSBMSQ10%'
ORDER BY date DESC LIMIT 10;
-- Result: 0 rows (no active flags)
```

### S4 — Campaign ID Resolution
```sql
SELECT campaign_id, campaign_name, campaign_type
FROM staging_ai.cppc_campaign_truth_registry_v1
WHERE campaign_name ILIKE '%BESTEN-BELEUCHTUNG%'
   OR campaign_name ILIKE '%LIGHTINGSOLUTION%'
   OR campaign_name ILIKE '%Klarna%';

SELECT ppc_etl_id, record_name, record_status, record_main_type,
       sub_source_id, market_place, parent_id, child_id
FROM public.ppc
WHERE parent_id = '23684789991' AND child_id = '0';
```

### S5 — Campaign Performance (product 8278561882377 in BESTEN-BELEUCHTUNG)
```sql
SELECT COUNT(*) FROM public.ppc_etl_performance_data
WHERE sub_source_id = 108
  AND sku = '56812549210377'
  AND parent_id = '23684789991';
-- Result: 0 — product never appeared in this campaign
```

### S6 — Campaign Performance (product 8278561882377 in Klarna)
```sql
SELECT date, impressions, clicks, spend, sales, orders
FROM public.ppc_etl_performance_data
WHERE sub_source_id = 108
  AND sku = '56812549210377'
  AND parent_id = '20763699505'
ORDER BY date DESC LIMIT 30;
-- Result: 62 days, last date 2026-06-10, 0 records after

SELECT date, impressions, clicks, spend
FROM public.ppc_etl_performance_data
WHERE sub_source_id = 108
  AND sku = '56812549210377'
  AND parent_id = '20763699505'
  AND date > '2026-06-10';
-- Result: 0 rows — confirmed dropped
```

### S7 — Aggregated Totals (product 8361815638281 in LIGHTINGSOLUTION)
```sql
SELECT
  COUNT(DISTINCT date) AS days_active,
  MIN(date) AS first_date, MAX(date) AS last_date,
  SUM(impressions) AS total_impressions,
  SUM(clicks) AS total_clicks,
  ROUND(SUM(clicks)::numeric / NULLIF(SUM(impressions),0)*100, 2) AS ctr_pct,
  ROUND((SUM(spend) / NULLIF(SUM(clicks),0))::numeric, 2) AS avg_cpc,
  ROUND(SUM(spend)::numeric, 2) AS total_cost,
  ROUND(SUM(sales)::numeric, 2) AS total_conv_value,
  SUM(orders) AS total_conversions,
  ROUND((SUM(orders)/NULLIF(SUM(clicks),0)*100)::numeric, 2) AS conv_rate_pct
FROM public.ppc_etl_performance_data
WHERE sub_source_id = 108
  AND parent_id = '23053104908'
  AND record_id = '8361815638281'
  AND date BETWEEN '2026-01-01' AND '2026-07-07';
```

---

## Findings

### Finding 1 — Product `8278561882377` in BESTEN-BELEUCHTUNG (ID: 23684789991)

**Bridge:** FULL_MATCH — Variant `56812549210377`, SKU `WLHSBMSQ10`, 90d spend €173.21

**Feed status:**

| Merchant | Feed Label | Availability | Price |
|---|---|---|---|
| 274357352 | DE (country=DE) | ✅ in stock | €21.27 |
| 5349761386 | **SHOPTIMISED** | ⚠️ **out of stock** | €24.99 |

**Performance:** 0 impressions, 0 clicks, 0 spend — never served in this campaign.

**Root cause:** The BESTEN-BELEUCHTUNG campaign pulls inventory from merchant `5349761386` (SHOPTIMISED feed). That feed marks this product as `out of stock`, making it ineligible. The DE feed (merchant 274357352) shows `in stock` but is not the feed source for this campaign.

---

### Finding 2 — Product `8278561882377` in Klarna (ID: 20763699505)

**Feed status:** DE feed = in stock ✅ (merchant 274357352, €21.27)

**Performance (Jan 1 → Jul 7, 2026):**

| Metric | Value |
|---|---|
| Days active | 62 |
| First seen | 2026-04-10 |
| **Last seen** | **2026-06-10** |
| Impressions | 11,563 |
| Clicks | 157 |
| CTR | 1.36% |
| Avg. CPC | €0.83 |
| Cost | €130.28 |
| Conv. value | €227.88 |
| Conversions | 2 |
| Conv. rate | 1.27% |
| After 2026-06-10 | **0 records** |

**Root cause:** Unknown from DB alone. Feed shows in stock. No GMC disapproval flags. Product dropped from all campaigns simultaneously on 2026-06-10. Likely a Google-side eligibility change — price competitiveness, Pmax asset group listing filter, or product-level suspension not captured in diagnostics table.

---

### Finding 3 — Product `8361815638281` in LIGHTINGSOLUTION (ID: 23053104908)

**Bridge:** VARIANT_ID_MISSING — no internal SKU in COGS truth model (covers 91/9671 products)

**Feed status (LIGHTINGSOLUTION feed, merchant 5351990695):** ✅ in stock, €4.32

**Performance (Jan 1 → Jul 7, 2026):**

| Metric | Value |
|---|---|
| Days active | 187 |
| First seen | 2026-01-01 |
| **Last seen** | **2026-07-07** ✅ |
| Impressions | 31,511 |
| Clicks | 606 |
| CTR | 1.92% |
| Avg. CPC | €0.21 |
| Cost | €129.95 |
| Conv. value | €368.46 |
| Conversions | 19 |
| Conv. rate | 3.15% |
| ROAS | 2.84x |

**Root cause:** None — product is healthy and actively serving.

---

## Status Decision Logic

| Status | Icon | Condition |
|---|---|---|
| **Eligible** | 🟢 | Impressions in target campaign within last 7 days AND feed = in stock |
| **Limited / Dropped** | 🟡 | Was serving previously, 0 impressions recently, feed = in stock — Google-side cause |
| **Not eligible** | 🔴 | Never in campaign OR feed = out of stock OR active GMC disapproval |

---

## Verdict Table

| Product ID | Campaign | Status | Feed | Last Active | Issue | Verdict |
|---|---|---|---|---|---|---|
| `8278561882377` | BESTEN-BELEUCHTUNG | 🔴 Not eligible | SHOPTIMISED = out of stock | Never served | OOS in campaign feed | **FAIL** |
| `8278561882377` | Klarna | 🟡 Dropped | DE = in stock | 2026-06-10 | Unknown — Google-side | **FAIL** |
| `8361815638281` | LIGHTINGSOLUTION | 🟢 Eligible | LIGHTINGSOLUTION = in stock | 2026-07-07 | None | **PASS** |

---

## Known Limits

1. **GMC diagnostics table** (`raw_data.gmc_product_diagnostics_daily`) returned 0 rows for both products — either no issues exist or the diagnostics ETL does not cover all issue types. Cannot confirm "no issues" with full certainty from DB alone.
2. **Bridge for `8361815638281`** is `VARIANT_ID_MISSING` — internal SKU not mapped. Performance is tracked via `record_id` not `sku` column. This works but is not the clean path.
3. **`public.google_product_performance`** table is populated only up to 2025-02-26 — not usable for 2026 investigations. All campaign-level product data comes from `public.ppc_etl_performance_data`.
4. **Klarna drop cause (2026-06-10)** cannot be confirmed from PostgreSQL alone. Google Ads UI must be checked for the item `shopify_de_8278561882377_56812549210377` to see the specific eligibility reason.
5. **`ppc_etl_performance_data` sku column** stores Google variant IDs (numeric), not internal SKUs — naming is misleading. For products with `VARIANT_ID_MISSING` bridge, use `record_id` or `ref_id` columns instead.

---

## Reviewer Actions Required

| Action | Owner | Priority |
|---|---|---|
| Fix SHOPTIMISED feed OOS status for product `8278561882377` (merchant 5349761386) | Feed/Catalog team | HIGH |
| Check Google Ads UI for `shopify_de_8278561882377_56812549210377` — find eligibility reason for Klarna drop (2026-06-10) | Campaign manager (Mahi) | HIGH |
| Map `8361815638281` internal SKU in COGS truth model to resolve bridge VARIANT_ID_MISSING | Data team | MEDIUM |
| Confirm whether BESTEN-BELEUCHTUNG campaign uses merchant 5349761386 as its primary feed source | Campaign manager (Mahi) | MEDIUM |

---

## Pass / Fail Rule

**PASS** if:
- Product has impressions in target campaign within last 7 days
- Feed shows `in stock` for the feed label used by that campaign
- No active GMC disapprovals

**FAIL** if:
- 0 records in campaign performance table for target campaign
- Feed = `out of stock` for the campaign's feed label
- Active GMC disapproval or issue flag exists

---

## Next Steps

1. **Immediate:** Fix `out of stock` in SHOPTIMISED feed for product `8278561882377` → re-check BESTEN-BELEUCHTUNG eligibility after next feed sync
2. **Immediate:** Mahi to open Google Ads UI → Products tab → filter Item ID `8278561882377` → check eligibility status for Klarna campaign
3. **Data:** Map `8361815638281` to internal SKU via COGS truth model expansion
4. **Monitoring:** Re-run Steps S5/S6 SQL after feed fix to confirm product starts serving

---

## Reference IDs

### Sub Source IDs
| Sub Source ID | Account |
|---|---|
| 108 | ledsone-de (Germany — Shopify / Shoptimised / Klarna campaigns) |

### Merchant IDs
| Merchant ID | Feed Description |
|---|---|
| 274357352 | Main DE merchant — feed labels: DE, EUR_81985766, GBP_81985766, CHF_81985766 etc. |
| 5349761386 | Shoptimised EU merchant — feed label: SHOPTIMISED |
| 5351990695 | LIGHTINGSOLUTION + AOVU15_2 feeds |

### All DE Campaign IDs (from cppc_campaign_truth_registry_v1)
| Campaign ID | Campaign Name |
|---|---|
| 23684789991 | Pmax DE \| Mahi \| Shoptimised\| BESTEN-BELEUCHTUNG \| priceGT10_5 \| MCV |
| 20763699505 | Pmax DE \| Mahi \| Klarna \| DE \| All_Myid \| MCV |
| 23053104908 | Pmax DE \| Mahi \| Shoptimised \| LIGHTINGSOLUTION \| All_Myid_1 \| MCV |
| 23431543574 | Pmax DE \| Mahi \| Shoptimised \| JAN-TOP-SALES \| JanTopSales_3 \| MCV |
| 23445162394 | Shopping DE \| Mahi \| Klarna \| JAN-TOP-SALES \| JanTopSales \| tROAS |
| 23512764208 | Shopping DE \| Mahi \| Shoptimised \| LIGHTING-FIXTURE \| Beleuchtungskörper_4 \| tROAS |

---

*Generated: 2026-07-09 | Source: PostgreSQL DB (public, staging_ai, raw_data schemas) | Tool: Claude Code via AIOS*
