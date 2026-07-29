# Sonya R6 — Daily Orders — Evidence
**Date:** 2026-07-29 | **Member:** Sonya | **Requirement:** 6

## PostgreSQL Inspection Summary

| Table | Rows confirmed | Key columns used |
|---|---|---|
| `order_management.orders` | ✅ Live | `id`, `order_date`, `market_place`, `sub_source_id` |
| `order_management.order_item_info` | ✅ Live | `order_id`, `real_sku`, `item_title`, `item_price`, `item_quantity`, `item_img` |
| `order_management.sub_source` | ✅ Live | `id`, `name` (e.g. "ledsone", "amazon Ledsone") |
| `order_management.market_place` | ✅ Live | `id=23` → UK |
| `inventory.products` | ✅ Live | `id`, `sku` |
| `inventory.physical_product_stock` | ✅ Live | `inventory` (FK), `quantity` |
| `listings.shopify_listings` | ✅ Live | `sku`, `price`, `listing_url`, `site`, `is_parent` |

## Sample Query Validation

**Yesterday = 2026-07-28 (DATE(MAX(order_date)) - 1)**

| SKU | Sub_source | Qty | Sold Price | LEDsone UK Price | L7d UK Sales | URL confirmed |
|---|---|---|---|---|---|---|
| ENC9764 | ledsone | 3 | £39.65 | £39.65 | 3 | ledsone.co.uk ✅ |
| LDMG125E278 | ledsone | 1 | £8.49 | £8.49 | 9 | ledsone.co.uk ✅ |
| COI9BBM | ledsone | 1 | £1.95 | n/a | 0 | — |

## Data Rules Confirmed

- `market_place = '23'` → UK orders only ✅
- `site='UK' AND listing_url ILIKE '%ledsone.co.uk%' AND is_parent=0` → one LEDsone UK row per SKU ✅
- `DISTINCT ON (sku) ORDER BY sku, price ASC` → deduplicates multiple variants ✅
- L7d sales filtered to `sub_source.name ILIKE '%ledsone%' AND NOT ILIKE '%amazon%' AND NOT ILIKE '%ebay%'` ✅
- Stock = `SUM(physical_product_stock.quantity)` per SKU ✅
