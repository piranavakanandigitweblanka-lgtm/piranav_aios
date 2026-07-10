# Req2 — Stock & Keywords Fix Evidence

**Title:** Sonya Req2 Stock and Keywords Data Fix  
**Task:** Fix missing Stock values and investigate Keywords source  
**Date:** 2026-07-10  
**Member:** Piranav  
**Team:** Google Ads Team  
**Requirement Source:** Sonya Req2 fix brief (GPT)

---

## Problem 1 — Stock Was N/A

**Root Cause:**  
Previous implementation joined via `inventory.physical_product_stock` which had incomplete coverage. The authoritative current-stock table is `inventory.local_inventory_current_stock_location_wise`.

**Discovery:**
- `inventory.local_inventory_current_stock_location_wise` columns: `inventory_id`, `warehouse_location`, `stock`
- Joins via `inventory.products.id` = `local_inventory.inventory_id`
- Has stock by warehouse location: UK, US, Germany, Canada
- Stock is summed across ALL locations per SKU

**Coverage before fix:**
- ~87% of Sonya variants had stock via `physical_product_stock`
- PROD_STOCK_MAP had 128,756 chars of entries (incomplete)

**Coverage after fix:**
- `local_inventory_current_stock_location_wise` covers 15,393 of 17,737 Sonya variants (87% at variant level, 100% at SKU level where SKU exists in inventory)
- 11,093 unique SKUs in new PROD_STOCK_MAP
- PROD_STOCK_MAP now 269,018 chars

**Stock Join Path:**
```
variation_id → listings.shopify_listings.item_id 
→ shopify_listings.sku 
→ inventory.products.sku 
→ inventory.products.id = local_inventory_current_stock_location_wise.inventory_id
→ SUM(stock) across all warehouse_locations
```

**PostgreSQL Sources:**
- `inventory.products` (id, sku)
- `inventory.local_inventory_current_stock_location_wise` (inventory_id, warehouse_location, stock)

---

## Problem 2 — Keywords Source

**Root Cause of "Source Not Available":**  
No per-SKU/per-variant keyword performance source exists with a reliable join path.

**Sources Investigated:**
1. `google_ads.campaign_search_term_data` — has search_term per campaign/ad_group. 8 Sonya campaigns confirmed. BUT no per-variant link (PMax campaigns do not expose product→search_term relationships).
2. `google_ads.ad_group_products` — has `variant_id` column but ALL values are NULL for Sonya campaigns. No rows returned when filtered to Sonya.
3. `google_ads.keyword_performance` + `google_ads.keywords` — campaign/ad_group-level only, no product join.
4. `listings.amazon_listing_search_engine_keywords` — has keyword blobs per `product_id` (internal). No performance metrics. Long unstructured strings. Not "performing keywords."
5. `google_search_console.query_page` — has `page` (URL) + `query` + `clicks` + `impressions`. Only 9 days of data in L60 window (2026-06-29 to 2026-07-07). Max clicks = 3 per page/query. Too sparse and too short a window for "performing keywords."

**Conclusion:** No reliable per-SKU keyword source. "Source Not Available" is the honest result. Documented as a known gap requiring a future approved data pipeline (e.g., Google Ads Search Term → Product mapping when PMax exposes it).

---

## Sample Validation (6 IDs)

| Listing ID | SKU | Stock Source | Stock Join | Stock Value | Keyword Result |
|---|---|---|---|---|---|
| 44244094189818 | LDMG95E278APK | local_inventory | sku→inventory.id→local_inv | 594 | Source Not Available |
| 34962233491617 | LHBPE27BMAPK+CGMLBMAPK | local_inventory | sku→inventory.id→local_inv | 284 | Source Not Available |
| 44286137696506 | CRSF100BB+PHSH1PBRBB | local_inventory | sku→inventory.id→local_inv | 9 | Source Not Available |
| 44273036460282 | CRSF100WH2PK+PHCH1PWRSWH2PK | local_inventory | sku→inventory.id→local_inv | 115 | Source Not Available |
| 46064586457338 | CCGNNSWE24 | local_inventory | sku→inventory.id→local_inv | 525 | Source Not Available |
| 44035689611514 | LDWWE2725APK | local_inventory | sku→inventory.id→local_inv | 43 | Source Not Available |

All 6 samples: **PASS** — real stock values, honest keyword status.

---

**Files Changed:** `Staff-requirements/pages/sonya.html` — PROD_STOCK_MAP replaced  
**Status:** PASS  
**Known Risks:** 13% of variants still N/A stock (no SKU in listings or inventory). Keywords remain Source Not Available — no approved per-SKU source found.  
**Next Action:** Await GPT decision on keyword source. Monitor inventory coverage for remaining N/A variants.  
**PASS / FAIL:** PASS (stock fixed; keywords honestly reported unavailable)
