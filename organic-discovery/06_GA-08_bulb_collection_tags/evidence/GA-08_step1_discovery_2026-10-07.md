# Evidence: GA-08 Step 1 Discovery
**Date:** 2026-10-07  
**Store:** LEDSone UK (sub_source 104)  
**Task:** GA-08 Bulb Collection Tag Fixes — Step 1 Discovery / Audit  
**Method:** Read-only PostgreSQL queries via `ledsone-db-mcp`. No Shopify data modified.

---

## Queries Run

### Q1 — Collection Shopify IDs
```sql
SELECT id, collection_id, handle, title, type
FROM listings.shopify_collections
WHERE handle IN ('low-wattage-bulbs','incandescent-bulbs','dimmable-led-bulbs','e14-base-bulb','e27-base-bulb')
  AND sub_source = 104;
```
Results confirmed all 5 collections exist. All are Smart type.

### Q2 — low-wattage-bulbs product list
```sql
SELECT sl.id, sl.item_id, sl.title, sl.product_type, sl.status, STRING_AGG(TRIM(slt.tag),', ')
FROM listings.shopify_collection_products cp
JOIN listings.shopify_listings sl ON sl.item_id = cp.product_id::varchar AND sl.sub_source = 104 AND sl.is_parent = 1
LEFT JOIN listings.shopify_listing_tag slt ON slt.product_id = sl.id
WHERE cp.collection_id = '677351195010'
GROUP BY sl.id, sl.item_id, sl.title, sl.product_type, sl.status ORDER BY sl.title;
```
Result: 53 products, ALL pendant/spider fittings.

### Q3 — incandescent-bulbs product list
Same query pattern, collection_id = '159254839392'.  
Result: 4 products, ALL LED bulbs.

### Q4 — dimmable-led-bulbs product list
Same query pattern, collection_id = '394336076026'.  
Result: 37 products, all genuine dimmable LED bulbs.

### Q5 — Products ~6941, ~6742, ~1045 lookup
```sql
SELECT sl.id, sl.item_id, sl.title, sl.product_type, sl.status, STRING_AGG(TRIM(slt.tag),', ')
FROM listings.shopify_listings sl
LEFT JOIN listings.shopify_listing_tag slt ON slt.product_id = sl.id
WHERE sl.sub_source = 104 AND sl.is_parent = 1
  AND (sl.title LIKE '%~6941' OR sl.title LIKE '%~6742' OR sl.title LIKE '%~1045')
GROUP BY sl.id, sl.item_id, sl.title, sl.product_type, sl.status;
```
Results: all 3 found. See task.md for details.

### Q6 — Collection membership of ~6941, ~6742, ~1045
Join across shopify_collection_products + shopify_collections.  
Key findings: ~6941 NOT in e14; ~6742 NOT in e14; ~1045 IS in e27 and b22.

### Q7 — e14-base-bulb product list
Result: 7 products, all genuine E14 bulbs.

### Q8 — Missing dimmable products (tagged but not in collection)
```sql
SELECT ... FROM listings.shopify_listings sl
JOIN listings.shopify_listing_tag slt ON slt.product_id = sl.id AND TRIM(slt.tag) = 'Dimmable LED Bulbs'
WHERE sl.item_id NOT IN (SELECT cp.product_id::varchar FROM listings.shopify_collection_products WHERE collection_id = '394336076026')
  AND sl.sub_source=104 AND sl.is_parent=1 AND sl.status='active';
```
Result: 11 products.

### Q9 — Physical stock for missing dimmable products
Via shopify_listings_parent_child_mapping → inventory.products → physical_product_stock.  
Highest: ~3219 (835 units), ~3076 (644 units). Others at 0 or negative.

---

## Key Raw Findings

| Collection | DB count | Finding |
|---|---|---|
| low-wattage-bulbs | 53 | ALL pendants — 0 bulbs |
| incandescent-bulbs | 4 | ALL LED bulbs — 0 incandescent |
| dimmable-led-bulbs | 37 | Correct products — 11 tagged missing from DB snapshot |
| e14-base-bulb | 7 | Correct products — 2 E14 bulbs missing tag |
| e27-base-bulb | 58+ | 1 product needs human review |

---

## Tables Used
- `listings.shopify_collections`
- `listings.shopify_collection_products`
- `listings.shopify_listings`
- `listings.shopify_listing_tag`
- `listings.shopify_listings_parent_child_mapping`
- `inventory.products`
- `inventory.physical_product_stock`

**Join key confirmed:** `shopify_listing_tag.product_id` (int) → `shopify_listings.id` (int). Use `TRIM()` on tag values.
