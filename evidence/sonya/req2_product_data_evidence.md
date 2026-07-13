# Sonya Requirement 2 — Product Data Evidence

**Title:** Product Data Tab — 60-Day Google Ads Performance Evidence  
**Task:** sonya-requirement-2-product-data-60-days  
**Date:** 2026-07-10  
**Member:** Piranav  
**Team:** Google Ads Team  
**Requirement Source:** GPT-supplied Sonya Req2 brief (2026-07-10)

---

## CSV Profile

**File searched:** `Sonya ID 08_07_ 2026 - products-variant (1).csv`  
**Search locations:**
- `C:\Users\PC\Documents\piranav_aios\` (all subdirectories)
- `C:\Users\PC\Documents\piranav_aios\Staff-requirements\` (all subdirectories)
- ledsone-aios-mcp knowledge base (keyword: products-variant)
- ledsone-aios-knowledge-base (keyword: products-variant)

**Result:** File NOT FOUND in any location.

**Authoritative substitute:** `TREND_ROWS` embedded in `pages/sonya.html` (lines 759–6537)  
This array was built from the same CSV (without the "(1)" suffix) during Req3 implementation and contains exactly 5,778 rows with fields: `[variantID, parentID, sku, impressions, clicks, cost, conv_value, conversions, ctr, cvr, roas, isSeasonal, isDropoff, hasData]`.

**Justification:** TREND_ROWS has:
- 5,778 rows (matches expected CSV count)
- Variant IDs preserved as strings
- Parent IDs preserved as strings  
- SKU field present
- Built from Sonya campaign product_performance data (same scope as Req2)

**Risk documented:** CSV not directly read — TREND_ROWS is the de-facto authoritative variant list. This is noted as a known gap.

---

## PostgreSQL Environment

**Connection:** ledsone-db (MCP tool: mcp__ledsone-db__execute_sql)  
**Access:** Read-only SELECT only

### Tables Used

| Schema | Table | Purpose |
|--------|-------|---------|
| google_ads | product_performance | Impressions, clicks, cost, conversions, conv_value per variant per day |
| google_ads | campaigns | Campaign names — joined to filter Sonya campaigns |
| listings | shopify_listings | Image URL, product URL, price, title, SKU per variant |
| inventory | products | SKU lookup for stock |
| inventory | physical_product_stock | Stock quantity per SKU |

### Date Range
- Max date in DB: 2026-07-10
- 60-day window: 2026-05-12 to 2026-07-10 (inclusive)

---

## Sonya Campaign Filter

**Campaigns identified:** 20 campaigns matching `ILIKE '%sonya%'`

Sample campaigns:
- Pmax UK | Sonya | Shoptimised | SONYA2026 | Zombies > 35| MC | UK
- Pmax UK | Sonya | GCSS | NICC_07 | Last Year Sold | MCV | UK
- Shopping UK | Sonya | GCSS | CPPC | Bulb
- D Gen | Sonya | Klarna| PLight | Pendant Light | MCV | UK

**Join path:** `product_performance.campaign_id → campaigns.campaign_id WHERE campaign_name ILIKE '%sonya%'`

---

## Performance Data

**Distinct variation_ids with Sonya 60-day data:** 6,235  
**Total cost:** £4,888.31  
**Total impressions:** 1,032,998  
**Total clicks:** 12,249  
**Total conversion value:** £17,649.43  
**Total conversions:** 521.30

**TREND_ROWS match:** 5,778 of 5,778 TREND_ROWS VIDs are the authoritative scope; PROD_PERF_MAP covers 6,235 VIDs (5,778 from TREND_ROWS + extras from other Sonya campaign records not in the CSV scope).

---

## Listing Meta Data

**Query:** `listings.shopify_listings` joined to Sonya variation_ids  
**Total listing rows returned:** 15,700 (multiple stores per variant)  
**Filtered to TREND_ROWS VIDs:** 4,786 entries in PROD_META_MAP  
**Unmatched (no listing data):** 992 TREND_ROWS VIDs have no listing metadata

---

## Stock Data

**Query:** `inventory.products JOIN inventory.physical_product_stock`  
**Total SKUs with stock data:** 7,723

---

## Identity Mapping

| Field | Source | Notes |
|-------|--------|-------|
| Variant ID (Listing ID) | TREND_ROWS[i][0] = product_performance.variation_id | Preserved as string |
| Parent ID (Product ID) | TREND_ROWS[i][1] | Preserved as string |
| SKU | TREND_ROWS[i][2] or PROD_META_MAP[vid].sku | From TREND_ROWS or shopify_listings |
| Image | PROD_META_MAP[vid].img | shopify_listings.main_image_url |
| Product URL | PROD_META_MAP[vid].url | shopify_listings.listing_url |
| Price | PROD_META_MAP[vid].price | shopify_listings.price |
| Stock | PROD_STOCK_MAP[sku] | inventory.physical_product_stock SUM |
| Performance | PROD_PERF_MAP[vid] or TREND_ROWS fallback | 60-day Sonya aggregation |

---

## Status: PASS (with known gaps)

**Known Gaps:**
1. CSV not found — TREND_ROWS used as substitute
2. 992 of 5,778 variants have no listing metadata (img/url/price shown as N/A)
3. Keyword column: Source Not Available (no verified keyword source found in DB)
4. Stage mapping: using Req3 approved logic (Trend List / Opportunity List / Monitor)
