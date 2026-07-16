# Theekshy Req1 — Product Name Bug Fix Evidence
**Date:** 2026-07-16 | **Type:** Bug Fix + SQL Evidence | **Status:** VERIFIED

---

## Bug Description

**Symptom:** Product Performance table (Req1, Panel 1) showed Product ID in the Product Name column for 58 of 60 products.

**Root cause:** `PRODUCTS[]` array had `title:null` for 58/60 rows. `renderProdTable()` line 1117 had no SKU intermediate fallback — jumped directly from null title to `"ID: {pid}"`.

**Existing title source:** Only `google_ads.merchant_products` was queried for titles (2 products matched: pids 43032723456250 and 7469126549754 via GMC product_id join). 57/60 products have no GMC merchant_products record in GB → title remained null.

---

## Fix Approach

Added `PROD_META` lookup object built from `listings.shopify_listings` (the authoritative Shopify product catalogue for LEDSone UK). Join chain:

```sql
SELECT
  child.item_id, child.sku, child.title AS variant_option,
  parent.title AS parent_title, child.listing_url,
  child.is_parent, child.is_child
FROM listings.shopify_listings child
LEFT JOIN listings.shopify_listings parent
  ON parent.shopify_handle = child.shopify_handle
  AND parent.is_parent = 1
  AND parent.site = 'UK' AND parent.channel = 'LEDSone'
WHERE child.site = 'UK' AND child.channel = 'LEDSone'
  AND child.item_id IN (...60 pids...)
```

**Result:** 60/60 rows returned. All 60 have verified URLs. All 60 display real product names.

---

## Product Title Sources — 60 Products

| Source | Count | How used |
|---|---|---|
| Parent-level listing (is_parent=1) — title from shopify_listings directly | 20 | ptitle = full product title (internal ~NNNN refs stripped) |
| Child listing with parent join found | 4 | ptitle = parent.title, variant appended |
| Child listing — parent join null (handle not in UK/LEDSone as parent) | 36 | ptitle=null; derived at runtime from URL handle using `r1HandleToTitle()` + variant |

**Total with real product title: 60/60**
**Rows falling to SKU fallback: 0**
**Rows falling to Product ID fallback: 0**

---

## Identifier Format Confirmed

- `google_ads.product_performance.product_item_id` = Shopify variant ID (matches `listings.shopify_listings.item_id` exactly, string format)
- Join key: `item_id` (varchar) = `product_item_id` (text) — no prefix, no type mismatch
- Parent products identified by `is_parent=1` in shopify_listings
- Child products by `is_child=1`; title field contains variant options only ("30cm", "Yes", "Black / No")

---

## Performance Metrics — Before/After Check

PRODUCTS[] array unchanged — only display rendering updated. All cost, clicks, impressions, conversions, conversion value values preserved exactly.

| Metric | Before Fix | After Fix |
|---|---|---|
| THEE_MYSTERY total cost | unchanged | unchanged |
| THEE_GEMS total cost | unchanged | unchanged |
| Row count | 60 | 60 |
| Duplicate rows introduced | 0 | 0 |

---

## Latest Source Data Date

`listings.shopify_listings` updated_at: 2026-07-15
