# Req 4 — Opportunity Tab Evidence

## Data Source
- Table: order_management.orders + order_item_info + source + sub_source
- Listing: listings.shopify_listings (image, URL, price, title)
- Ads: google_ads.product_performance joined via shopify_listings.item_id → sku
- Stock: inventory.products + physical_product_stock
- Date range: 2026-06-09 to 2026-07-08 (L30)

## Opportunity Rule
Combined non-Google sales (AMAZON + EBAY + B&Q + SHOPIFY) > 2 units in L30

## Rows embedded: 300 (top 300 by combined_sales DESC)

## Columns
SKU, Amazon, eBay, B&Q, Shopify, Combined Sales, Impressions, Clicks, Cost, Conversions, Conv Value, Image, URL, Title, Price, Stock

## JS Functions Added
- OPP_DATA[] — 300-row embedded array (lines 6645–6946 in sonya.html)
- O_SKU=0 … O_STOCK=15 — column index constants
- oGetSegment(r) — 8-rule segment classification (Zombie/Low Engagement/Bleeding/Monitor Cut/High Priority Cut/Orange/Amber/Green)
- oGetSegBadgeClass(seg) — CSS badge class mapper
- oRender() — renders rows into #oTbody, pagination 50 at a time
- oUpdateKpis() — updates #oKpiInStock, #oKpiZeroConv, #oKpiMissingAds
- oApplyFilters() — filters by search/segment/stage/platform/stock
- oExportCSV() — exports oActiveData as CSV download
- showTab override — initialises Opportunity tab on first visit (tab index 4)

## Segment Sample (top 10)
- CL3TBR: 348 sales, imp=1303, clk=23, ROAS=195% → High Priority Cut
- LDMST64E274: 212 sales, imp=18177, clk=234, ROAS=290% → Amber
- 12IP6715: 157 sales, ROAS=5230% → Green
- LDMG125E278: 120 sales, ROAS=286% → Amber

## Known Data Gaps
- Temu: Not found in order_management source_names — documented as Data Missing in HTML footnotes
- SKU Keywords: No marketplace keyword source in DB — shown as "Data Missing" in table
- Manual Orders: source names MANUAL OM/MANUALORDER exist but not included in this query (AMAZON/EBAY/B&Q/SHOPIFY only — matches spec "non-Google platform sales")

## Status: PASS
- oRender(), oApplyFilters(), oExportCSV(), oUpdateKpis() implemented
- OPP_DATA embedded in sonya.html (300 rows, real PostgreSQL data)
- No fake data — all from read-only SELECT queries
- No Git push, no Vercel deploy, no PostgreSQL modifications
- sonya.html updated in-place: C:\Users\PC\Documents\piranav_aios\Staff-requirements\pages\sonya.html

## Evidence Date: 2026-07-10
