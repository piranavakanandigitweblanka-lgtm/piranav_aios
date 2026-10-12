# Evidence: ledsone-uk Never-Sold Products — Shopify Parent ID Lookup

**Date:** 2026-10-12  
**Assigned:** Piranav  
**Tool:** ledsone-db-mcp (`listings.shopify_listings` + `listings.shopify_listings_parent_child_mapping`)  
**Output:** `reports/daily/ledsone-uk-neversold-shopify-ids-2026-10-12.csv`

---

## Task

Given the file `ledsone-uk-neversold-lighting-product-level-2026-09-21 (1)(in).csv` (81 products, never-sold on ledsone.co.uk), retrieve the correct Shopify parent product ID for each product.

---

## Input File

| Field | Value |
|---|---|
| File | `ledsone-uk-neversold-lighting-product-level-2026-09-21 (1)(in).csv` |
| Location | `C:\Users\PC\Downloads\` |
| Columns | `product_title`, `product_type`, `skus`, `total_stock` |
| Products | 81 |

---

## Method

1. Attempted `site = 'ledsone-uk'` filter → 0 results (site values are `UK`, not `ledsone-uk`)
2. Discovered `listing_url` contains store domain — correct filter: `listing_url LIKE '%ledsone.co.uk%'`
3. Discovered `item_id` on child rows = variant ID (matches `?variant=XXXXX` in URL)
4. Used `shopify_listings_parent_child_mapping` to get parent row `item_id` = true Shopify product ID
5. Filtered `status = 'active'` only
6. For SKUs with multiple parent IDs (duplicate listings), selected best match by URL slug vs product title

---

## Key Query

```sql
SELECT DISTINCT sl_child.sku, sl_parent.item_id AS shopify_product_id, sl_parent.listing_url
FROM listings.shopify_listings sl_child
JOIN listings.shopify_listings_parent_child_mapping m ON m.child_id = sl_child.id
JOIN listings.shopify_listings sl_parent ON sl_parent.id = m.parent_id
WHERE sl_child.listing_url LIKE '%ledsone.co.uk%'
  AND sl_child.status = 'active'
  AND sl_child.sku IN (/* 81 product SKUs */)
ORDER BY sl_child.sku;
```

---

## Results

| Metric | Count |
|---|---|
| Total products in input | 81 |
| Products with active ledsone.co.uk parent ID found | 79 |
| No active listing found (row 50 — LSGL3L150AR+RPM40WH_HIT) | 1 |
| No SKU in CSV (row 70 — Vintage G125 4W E27) | 1 |

---

## Output File

| Field | Value |
|---|---|
| File | `reports/daily/ledsone-uk-neversold-shopify-ids-2026-10-12.csv` |
| Columns | `row`, `product_title`, `shopify_product_id`, `product_url`, `notes` |
| Committed | `1c490c2` |
| Format | UTF-8 with BOM, comma-separated |

---

## Discoveries

- `listings.shopify_listings` stores listings for multiple stores (ledsone.co.uk, besbet.co.uk, vintagelite.co.uk) — always filter by `listing_url`
- `site` column = `UK` / `France` etc., not store domain
- `item_id` = variant ID on child rows; must join parent via mapping table for product ID
- `is_parent` is `smallint` not boolean — use `= 1` not `= true`
