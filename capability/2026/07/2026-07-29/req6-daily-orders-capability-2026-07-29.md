# Sonya R6 — Daily Orders — Capability Record
**Date:** 2026-07-29 | **Member:** Sonya | **Requirement:** 6

## Implemented Capabilities

| Capability | Source | Status |
|---|---|---|
| Yesterday's UK orders by SKU | `order_management.orders` + `order_item_info` | LIVE |
| Marketplace identification | `order_management.sub_source` | LIVE |
| Stock level per SKU | `inventory.products` + `physical_product_stock` | LIVE |
| LEDsone UK listing URL | `listings.shopify_listings` | LIVE |
| LEDsone UK price | `listings.shopify_listings` | LIVE |
| L7d Shopify UK sales | `order_management.orders` (ledsone sub_sources) | LIVE |
| Selling market price | `order_item_info.item_price` | LIVE |
| Product image thumbnail | `order_item_info.item_img` | LIVE |
| Date picker (custom date) | Frontend + API `?date=` param | LIVE |
| Marketplace filter | Dynamic from data | LIVE |
| Stock filter | In/Low/Out/No Data | LIVE |
| Price comparison filter | Selling vs LEDsone UK | LIVE |
| CSV export | Filtered view | LIVE |
| Pagination | 50 rows/page | LIVE |
| Sortable columns | Client-side | LIVE |
