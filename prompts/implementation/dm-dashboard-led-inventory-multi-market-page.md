# Prompt: DM Dashboard — LED Inventory Multi-Market Page Implementation

## Category
implementation / dm-dashboard

## When to Use
When implementing a consolidated multi-market inventory page in dm-dashboard that replaces or unifies two existing single-market pages (listings + stock lookup).

## Reusable Pattern

### What to build
A single `LedInventory.jsx` page with:
1. Market selector (initially UK + DE, extensible)
2. Two feature tabs: SKU Listings + Stock Lookup
3. Separate UAM keys per tab: `tools.LedInventoryListings` + `tools.LedInventoryStock`
4. Server-side market config object (never trust client-supplied sub_source/warehouse/currency)

### Server config structure
```python
# backend/app/core/market_config.py
MARKETS = {
  'uk': { sub_source: 104, warehouse_location: 'UK', currency: 'GBP', ... },
  'de': { sub_source: 108, warehouse_location: 'Germany', currency: 'EUR', ... },
}
```

### UK listings: 3-branch SQL
- Branch 1: `sku LIKE '%term%' AND sku NOT LIKE 'ENC%'` → CASE WHEN for Combo/Single
- Branch 2: ENC join via sku_original (same as DE)
- ENC exclusion on Branch 1 prevents duplicates

### DE listings: 2-branch SQL (preserve original exactly)
- Branch 1: `sku LIKE '%term%'` → 'Combo'
- Branch 2: ENC join via sku_original → 'ENC'

### Stock: parameterized warehouse
- `_fetch_stock_map(skus, warehouse_location)` — warehouse resolved server-side from MARKETS dict
- Combo rule preserved: never match combos via sku_original

### Nav/registry
- One nav entry under `tools.LedInventoryListings`
- Keep existing page entries during transition

### Migration
- Existing pages remain active until UAM grants migrated and live-tested
- New grants needed: tools.LedInventoryListings + tools.LedInventoryStock

## Key Technical Facts (verified 2026-10-29)
- sub_source: UK=104, DE=108
- warehouse: UK='UK', DE='Germany' (not 'DE')
- currency: NULL in DB for all markets — always implicit from market config
- UK has 6,596 Single/Other SKUs not covered by Combo+ENC query alone
- priceCalc.js reusable for listings price adjustment and CSV export
