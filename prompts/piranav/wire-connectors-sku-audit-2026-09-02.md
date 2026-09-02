# Prompt — Wire Connectors & Junction Box SKU Audit
**Date:** 2026-09-02
**Requested by:** Piranav
**AI:** Claude Sonnet 4.6

## Request
1. Find the "Wire Connectors & Junction Box" collection on LEDSone UK Shopify
2. Show all 21 products with Product ID, Title, Price, Variant, SKU
3. Cross-reference against `products_2026-09-02.csv` (61 base SKUs)
4. Identify which SKUs from the CSV are missing from the collection
5. For the missing SKUs, check if they exist elsewhere in Shopify
6. Pull Product ID + Tags for all 21 collection products + 24 found elsewhere
7. Export all findings as CSV files

## Outputs Requested
- Full variant table (Product ID, Title, Variant, Price, SKU) as CSV
- SKU gap analysis CSV
- Product ID + Tags CSV
