# Evidence — Wire Connectors & Junction Box SKU Audit
**Date:** 2026-09-02
**Store:** LEDSone UK (ledsone.co.uk) — Advanced Plan

## Collection Found
- **Name:** Wire Connectors & Junction Box
- **ID:** gid://shopify/Collection/665480921474
- **Type:** Manual
- **Products:** 21
- **Last Updated:** 2026-09-01

## CSV Reference File
- File: `products_2026-09-02.csv`
- Base SKUs: 61
- Format: ProductID (internal) + ButtonText (base SKU)

## Key Findings

### Collection Products (21)
All active except product 15296796524930 (Draft — COM16BM).
Product 15296771555714 has a missing SKU on the 20 Pack variant.

### SKU Gap vs Collection
- **61 base SKUs** in CSV
- **28 found** in Wire Connectors collection
- **33 not in collection**

### Of the 33 Missing from Collection
- **24 found elsewhere** in Shopify (different products/collections)
- **9 not found anywhere** in Shopify:
  - CO123PCL
  - CO122PCL (only in bundle SKUs, no standalone)
  - COI9ASBM
  - COI9CBM
  - COI9DBM
  - COS92BM
  - CO432AOR
  - COPA9TWH
  - COPA10TWH

## Output Files
- `C:\Users\PC\Documents\wire-connectors-collection.csv` — 120 rows, full variant data
- `C:\Users\PC\Documents\sku-gap-analysis.csv` — 61 rows, gap status per SKU
- `C:\Users\PC\Documents\product-id-tags-full.csv` — 45 rows, Product ID + Tags
