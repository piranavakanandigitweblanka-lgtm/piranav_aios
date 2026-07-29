# Sonya R6 — Daily Orders — Prompt Record
**Date:** 2026-07-29 | **Member:** Sonya | **Requirement:** 6

## Objective
Daily operational dashboard showing yesterday's UK orders across all marketplaces with stock, pricing, and 7-day Shopify UK sales.

## Key Business Rules
- Default date = yesterday (DATE(MAX(order_date)) - 1)
- UK orders = market_place = '23'
- LEDsone UK listing = site='UK' AND listing_url ILIKE '%ledsone.co.uk%' AND is_parent=0, DISTINCT ON sku
- L7d Shopify UK = ledsone sub_sources only (NOT amazon/ebay), last 7 days from target date
- Stock = SUM(physical_product_stock.quantity) per SKU

## Scope
- New API: api/sonya/daily-orders.js
- New tab 6 in pages/sonya.html
- Deleted api/status.js to stay within 12-function Vercel limit
