# SKU DE Listings — Task Folder

Extract all ledsone.de (sub_source = 108) Shopify listings for a given SKU — both Combo and ENC types.

## Query Rules

**Combo:** `listings.shopify_listings` WHERE `sub_source = 108` AND `sku LIKE '%{SKU}%'` AND `is_child = 1`

**ENC:** JOIN `inventory.products` ON `ip.sku = sl.sku` WHERE `ip.sku_original LIKE '%{SKU}%'` AND `sl.sku LIKE 'ENC%'`

Deduplicate: Combo SKUs that also appear in inventory.products are kept as Combo only.

## CSV Columns

`Store, Item ID, Variant Title, SKU, Price (EUR), Stock, Status, SKU Type, Listing URL`

- **SKU Type:** Combo / ENC
- **Variant Title:** flattened from selected_variations JSON (Value fields joined with " / ")
- **Store:** always `ledsone-de`

## Files

| File | SKU | Rows | Active | ENC | Date |
|---|---|---|---|---|---|
| PHHT1FBRBM-listings-DE-2026-10-19.csv | PHHT1FBRBM | 8 | 4 | 2 | 2026-10-19 |
| WSRH230YB-listings-DE-2026-10-19.csv | WSRH230YB | 84 | 84 | 16 | 2026-10-19 |
| LSCY290BG-listings-DE-2026-10-19.csv | LSCY290BG | 37 | 34 | 3 | 2026-10-19 |
| PHSH1HETYB-listings-DE-2026-10-19.csv | PHSH1HETYB | 128 | 112 | 4 | 2026-10-19 |
| WSNWBM-listings-DE-2026-10-19.csv | WSNWBM | 9 | 8 | 0 | 2026-10-19 |
| LSCY290CO-listings-DE-2026-10-19.csv | LSCY290CO | 33 | 28 | 13 | 2026-10-19 |
| LSCY290BU-listings-DE-2026-10-19.csv | LSCY290BU | 33 | 31 | 8 | 2026-10-19 |
| LSCY290NB-listings-DE-2026-10-19.csv | LSCY290NB | 25 | 25 | 4 | 2026-10-19 |
