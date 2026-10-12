# Prompt: Lookup Shopify Parent Product IDs via ledsone-db-mcp

**Category:** shopify / data-lookup  
**Registered:** 2026-10-12  
**Author:** Piranav  
**Status:** ACTIVE

---

## Purpose

Given a CSV of ledsone.co.uk product SKUs, retrieve the correct Shopify **parent product ID** (not variant ID) for each product, filtered specifically to ledsone.co.uk listings (excluding besbet.co.uk, vintagelite.co.uk etc.).

---

## When to Use

- Need Shopify product IDs for a batch of products from a CSV export
- Need to distinguish parent product ID from variant/item ID
- Need to filter by a specific Shopify store URL within ledsone-db

---

## Key Technical Constraints

- `listings.shopify_listings.item_id` = **variant ID** (NOT the product ID)
- `listings.shopify_listings.listing_url` contains the store domain — must filter `LIKE '%ledsone.co.uk%'`
- `listings.shopify_listings_parent_child_mapping` maps child listing rows to parent rows
- Parent row `item_id` = **Shopify product ID** (what admin URLs use)
- `site` column values are: `UK`, `France`, `Germany`, `US`, `Canada`, `Unknown` — NOT store domain names
- `status = 'active'` filter required to exclude archived/draft/unlisted
- Multiple active listings per SKU may exist across different stores — always join on `listing_url LIKE '%ledsone.co.uk%'`

---

## Query Pattern

```sql
SELECT DISTINCT
  sl_child.sku,
  sl_parent.item_id AS shopify_product_id,
  sl_parent.listing_url AS product_url
FROM listings.shopify_listings sl_child
JOIN listings.shopify_listings_parent_child_mapping m ON m.child_id = sl_child.id
JOIN listings.shopify_listings sl_parent ON sl_parent.id = m.parent_id
WHERE sl_child.listing_url LIKE '%ledsone.co.uk%'
  AND sl_child.status = 'active'
  AND sl_child.sku IN (/* SKU list from CSV */)
ORDER BY sl_child.sku;
```

---

## Output

- One row per SKU (some products may return multiple parent IDs if duplicate listings exist — pick by URL title match)
- Columns: `sku`, `shopify_product_id`, `product_url`
- Export as CSV with columns: `row`, `product_title`, `shopify_product_id`, `product_url`, `notes`

---

## Common Pitfalls

| Pitfall | Fix |
|---|---|
| Using `item_id` directly as product ID | Always join via `parent_child_mapping` |
| Filtering by `site = 'ledsone-uk'` | Wrong — use `listing_url LIKE '%ledsone.co.uk%'` |
| Getting variant IDs instead of product IDs | Join to parent via mapping table |
| Multiple results per SKU | Pick by matching URL slug to product title |
| `is_parent = true` filter fails | Column is `smallint` — use `is_parent = 1` |
