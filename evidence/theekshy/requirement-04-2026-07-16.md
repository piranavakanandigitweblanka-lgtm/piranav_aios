# Theekshy Req4 — Evidence Record
**Date:** 2026-07-16 | **Type:** SQL Evidence + CSV Verification | **Status:** VERIFIED

---

## 1. Data Sources Confirmed

### google_ads.product_performance
- Campaigns verified: 23714290257 (THEE_GEMS), 23684837882 (THEE_MYSTERY)
- Column confirmed: `cost` (numeric) — NOT `cost_micros` (does not exist)
- Period used: 2026-06-15 to 2026-07-14 (30-day window)
- Products retrieved: top 30 by SUM(cost) per campaign = 60 total

### Inventory Join Chain (verified working)
```
google_ads.product_performance.product_item_id
→ listings.shopify_listings.item_id  (site='UK', channel='LEDSone')
→ listings.shopify_listings.sku
→ inventory.products.sku
→ inventory.local_inventory_current_stock_location_wise  (SUM all warehouse locations)
```

### GMC Source
- `google_ads.merchant_products` WHERE country = 'GB'
- Only 3 of 60 products have GMC records

---

## 2. Stock Results (latest data: 2026-07-15)

| Status | Count | Notes |
|---|---|---|
| In Stock (>10) | 37 | Active, no action needed |
| Going to Finish (1–10) | 2 | See below |
| Out of Stock (=0) | 1 | HIGHEST PRIORITY — see below |
| Coming Soon | 0 | No verified restock dates in DB |
| Unknown (null inv) | 20 | Parent-level Shopify IDs, no SKU |

### Critical — Out of Stock
- **pid 55116252905858** — Vintage Flush Ceiling Light White/No (THEE_GEMS)
- inv = 0, 30d spend = £12.04
- Action: Pause Ads Immediately; Set GMC to Out of Stock; Exclude from PMax Listing Group

### Going to Finish
- **pid 55112543961474** — Rustic Red 3-Way Industrial Ceiling Light (THEE_MYSTERY) — inv = 5
- **pid 55262186242434** — Three Head Spider Pendant (THEE_MYSTERY) — inv = 10 (boundary, ≤10 → GTF)

---

## 3. GMC Results

| pid | GMC Status | Calc. Status | Comparison |
|---|---|---|---|
| 43032723456250 | in stock | In Stock (inv=42) | GMC Match ✓ |
| 7469126549754 | in stock | Unknown (inv=null) | Data Review Required |
| 14935996924290 | in stock | Unknown (inv=null) | Data Review Required |
| 57 other products | — (no record) | — | GMC Data Unavailable (not a mismatch) |

---

## 4. SQL Error Resolved

- **Error:** `column "cost_micros" does not exist`
- **Root cause:** Column in `google_ads.product_performance` is named `cost` (numeric), not `cost_micros`
- **Fix:** Replaced `cost_micros / 1000000.0` with `SUM(cost)` — verified working

---

## 5. Unknown Products — Root Cause

20 of 60 products are parent-level Shopify IDs. `listings.shopify_listings` returns
`sku = null` for parent product pages (not variant pages). No inventory join is
possible. These correctly classify as Unknown per the "never treat null as zero" rule.

---

## 6. CSV Spec Verification (2026-07-16)

Source CSV: `What_I_Need_To_Improve_ADS_Performance - Copy of Theekshy (1).csv`

3 action text gaps identified and fixed post-CSV review:
1. Going to Finish: added "Consider Budget Trim; Do Not Pause Yet; Sonya/Dilaksi"
2. Out of Stock: added "Exclude from PMax Listing Group"
3. Coming Soon: added "Set GMC to Preorder"

All Action Log columns from CSV present in dashboard table.
