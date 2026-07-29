# Sonya R6 — Daily Orders — Validation
**Date:** 2026-07-29 | **Member:** Sonya | **Requirement:** 6

## Checklist

| Check | Status | Notes |
|---|---|---|
| Live PostgreSQL data used | ✅ | No mock data anywhere |
| Yesterday's orders load correctly | ✅ | Default = DATE(MAX(order_date)) - 1 |
| All required columns appear | ✅ | SKU, Stock, Image, URL, Marketplace, L7d, Selling £, LEDsone UK £, Qty, Title |
| LEDsone UK URL filtering works | ✅ | `site='UK' AND listing_url ILIKE '%ledsone.co.uk%'` |
| Duplicate rows eliminated | ✅ | `DISTINCT ON (sku)` in shopify_listings query; GROUP BY (sku, sub_source) in orders |
| All filters function | ✅ | Date, SKU search, Marketplace, Stock, Price comparison |
| Pagination works | ✅ | 50 rows/page |
| CSV export works | ✅ | Downloads filtered view |
| Vercel function limit | ✅ | 12/12 — within limit |
| Responsive layout | ✅ | overflow-x:auto on table wrap |
| Loading spinner | ✅ | `r6Loading` element shown during fetch |
| Error handling | ✅ | `r6Error` element on API failure |
| Empty state | ✅ | `r6Empty` element when no rows |
| globalRefresh integration | ✅ | case 6 added to switch |
| Lazy load on first click | ✅ | `doLoadR6()` checks `r6Loaded` flag |

## Known Limitations

- Image thumbnails from order_item_info.item_img may be 404 for old orders — `onerror` handler hides broken images
- Stock SUM includes negative adjustment rows — reflects true net stock
- L7d Shopify UK excludes Amazon/eBay ledsone sub_sources by design
- SKU + sub_source grouping means one product sold across 2 sub_sources = 2 rows
