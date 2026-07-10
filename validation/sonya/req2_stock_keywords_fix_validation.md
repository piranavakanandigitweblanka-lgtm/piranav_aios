# Req2 — Stock & Keywords Fix Validation

**Title:** Sonya Req2 Stock & Keywords Fix Validation  
**Task:** Validate fixed stock data and keyword coverage decision  
**Date:** 2026-07-10  
**Member:** Piranav  
**Team:** Google Ads Team  
**Requirement Source:** Sonya Req2 fix brief  
**Reviewer:** GPT (pending)

---

## Stock Validation

### Before Fix
- Source: `inventory.physical_product_stock`
- PROD_STOCK_MAP size: 128,756 chars
- Coverage: incomplete (exact count not recorded)

### After Fix
- Source: `inventory.local_inventory_current_stock_location_wise`
- PROD_STOCK_MAP size: 269,018 chars
- SKUs covered: 11,093 unique SKUs
- Variant coverage: 15,393 / 17,737 Sonya variants (87%)
- Remaining N/A: ~13% (variants with no SKU in shopify_listings or no inventory record)

### Sample Row Validation (PASS)

| Listing ID | SKU | DB Stock (SUM all locations) | In PROD_STOCK_MAP | Match |
|---|---|---|---|---|
| 44244094189818 | LDMG95E278APK | 594 (CA:10, DE:4, UK:503, US:77) | 594 | ✅ PASS |
| 34962233491617 | LHBPE27BMAPK+CGMLBMAPK | 284 (UK:284) | 284 | ✅ PASS |
| 44286137696506 | CRSF100BB+PHSH1PBRBB | 9 (UK:9) | 9 | ✅ PASS |
| 44273036460282 | CRSF100WH2PK+PHCH1PWRSWH2PK | 115 (UK:115) | 115 | ✅ PASS |
| 46064586457338 | CCGNNSWE24 | 525 (DE:159, UK:366) | 525 | ✅ PASS |
| 44035689611514 | LDWWE2725APK | 43 (UK:43) | 43 | ✅ PASS |

---

## Keyword Coverage Validation

| Source | Investigated | Per-SKU Join | Quality | Decision |
|---|---|---|---|---|
| google_ads.campaign_search_term_data | ✅ | ❌ No variant link | Campaign-level only | Excluded |
| google_ads.ad_group_products | ✅ | ❌ variant_id all NULL | No data | Excluded |
| listings.amazon_listing_search_engine_keywords | ✅ | ❌ No performance metrics | Unstructured blobs | Excluded |
| google_search_console.query_page | ✅ | ⚠️ URL match (9 days only) | Max 3 clicks | Excluded |

**Result:** Source Not Available — correctly preserved. No fabricated data. ✅

---

## File Integrity

- `pages/sonya.html` total lines: 18,324 (unchanged)
- `pages/sonya.html` total chars: 2,843,129 (increased from ~2.7MB due to larger PROD_STOCK_MAP)
- `const PROD_STOCK_MAP` present: ✅
- `const PROD_PERF_MAP` present: ✅
- `const PROD_META_MAP` present: ✅
- `</script></body></html>` intact: ✅
- Existing tabs (1, 3, 4) unaffected: ✅

---

**Status:** PASS  
**Known Risks:** 
1. ~13% of variants still show N/A stock — no listing/inventory record for those variants
2. Keywords column remains "Source Not Available" — no approved per-SKU source found in DB
3. `local_inventory` can have negative stock values (e.g., -7, -146) — these are real DB values, not errors

**Next Action:** GPT to review; consider future keyword data pipeline approval.  
**PASS / FAIL:** **PASS**
