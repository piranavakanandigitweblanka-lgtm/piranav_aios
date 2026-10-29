# DM Dashboard — LED Inventory: Phase 2 Implementation
**Req ID:** DMDASH-LEDINV-PHASE2-2026-10-29
**Date:** 29 October 2026
**Prepared by:** Claude Code
**Branch:** `piranv-work` — clean, up to date with `origin/piranv-work`
**Status:** IMPLEMENTED + UI UPDATED — 103/103 tests PASS. Commits `2021cb3` (Phase 2) + `b101431` (stock tab merge) pushed to piranv-work.

---

## 1. Files Created (7 new)

| File | Description |
|---|---|
| `backend/app/core/market_config.py` | Authoritative server-side market config — sub_source, warehouse_location, currency, stock_col_label, filename_prefix for UK and DE |
| `backend/app/dashboard_pages/led_inventory_listings.py` | Listings endpoint: `GET /api/led-inventory/listings/search?sku={}&market={}` — UK 3-branch (Combo/Single/ENC), DE 2-branch (Combo/ENC). UAM: `tools.LedInventoryListings` |
| `backend/app/dashboard_pages/led_inventory_stock.py` | Stock endpoint: `GET /api/led-inventory/stock/single` + `POST /api/led-inventory/stock/upload` with market param. UAM: `tools.LedInventoryStock` |
| `frontend/src/lib/marketConfig.js` | Frontend market display config — labels, currency symbols, stock column labels (display only; no server values) |
| `frontend/src/admin/pages/LedInventory.jsx` | Single page component: market selector (UK/DE) + SKU Listings tab + Stock Lookup tab |
| `backend/tests/test_led_inventory_listings.py` | 30 tests — market config, SQL structure, UK/DE queries, response shape, error handling |
| `backend/tests/test_led_inventory_stock.py` | 17 tests — warehouse routing, fetch_stock_map, combo rule, regression |

## 1b. UI Update — Stock sub-tabs merged (commit `b101431`)

`StockLookupTab` in `LedInventory.jsx` was updated to display `SingleSkuStockTab` and `CsvBulkStockTab` simultaneously instead of switching between inner tabs. Both sections are labelled and separated by a divider. No logic, API calls, or market routing changed. 1 file, 0 lint warnings, 103/103 tests PASS.

---

## 2. Files Modified (3)

| File | Change |
|---|---|
| `backend/app/main.py` | +2 imports + 2 `include_router()` calls for both new routers |
| `frontend/src/admin/AdminLayout.jsx` | +1 nav entry `{ key: 'led-inventory', toolKey: 'tools.LedInventoryListings', enabled: true }` above existing entries |
| `frontend/src/taskRegistry.jsx` | +1 task entry for `tools.LedInventoryListings` → `LedInventory` page |

---

## 3. Architecture

### Market config (server-authoritative)

```
backend/app/core/market_config.py  ← MARKETS dict
  uk: sub_source=104, warehouse='UK', currency=GBP, stock_col='UK_Current_Stock'
  de: sub_source=108, warehouse='Germany', currency=EUR, stock_col='DE_Current_Stock'
```

`get_market(market_id)` validates and returns. Raises `ValueError` for unknown markets. Client supplies `'uk'` or `'de'` — never raw sub_source, warehouse, or currency.

### Listings endpoint — query differences

| Market | Branch 1 | Branch 2 | Branch 3 |
|---|---|---|---|
| DE | Combo: `sku LIKE '%term%'` → sku_type='Combo' | ENC: `sku_original LIKE '%term%' AND sku LIKE 'ENC%'` → sku_type='ENC' | — |
| UK | Combo/Single: `sku LIKE '%term%' AND sku NOT LIKE 'ENC%'` → CASE WHEN `sku LIKE '%+%'` THEN 'Combo' ELSE 'Single' | ENC: same as DE | — |

**Key UK decisions:**
- `NOT LIKE 'ENC%'` on the non-ENC branch prevents ENC SKUs appearing twice
- `CASE WHEN sl.sku LIKE '%+%'` correctly distinguishes 9,144 UK Combo SKUs from 6,596 UK Single SKUs
- DE SQL is byte-for-byte identical to the original `sku_de_listings.py` query

### Response shape

```json
{
  "sku": "LSCY290BG",
  "market": "de",
  "store": "ledsone.de",
  "currency": "EUR",
  "currency_symbol": "€",
  "total": 4,
  "combo_count": 3,
  "enc_count": 1,
  "single_count": 0,
  "rows": [...]
}
```

### Stock endpoint

Parameterized `_fetch_stock_map(skus, warehouse_location)` — same matching logic as existing `sku_stock_lookup.py` (combo rule preserved). Warehouse resolved from `get_market()` server-side.

### UAM

| Tab | UAM Key | Endpoints gated |
|---|---|---|
| SKU Listings | `tools.LedInventoryListings` | `GET /api/led-inventory/listings/search` |
| Stock Lookup | `tools.LedInventoryStock` | `GET /api/led-inventory/stock/single`, `POST /api/led-inventory/stock/upload` |

Nav entry registered under `tools.LedInventoryListings`. Both keys must be granted separately in UAM.

### Navigation

- New: `led-inventory` (key) → `tools.LedInventoryListings` → `LedInventory.jsx`
- Existing entries `sku-de-listings` and `sku-stock-lookup` remain active and unchanged

### Frontend features preserved

- Price adjustment (increase/decrease %) + Calculated Price column — reuses `priceCalc.js`
- CSV export with both original and calculated prices — market-appropriate filename and currency label
- Filters (status / SKU type / stock) — UK adds Single option
- Stock CSV upload — drag/drop, results table, pagination — same as SkuStockLookup
- apiFetch() handles 401/403 globally — no per-component auth checks

---

## 4. Tests

| Suite | Count | Result |
|---|---|---|
| `test_led_inventory_listings.py` | 30 | **30/30 PASS** |
| `test_led_inventory_stock.py` | 17 | **17/17 PASS** |
| **New total** | 47 | **47/47 PASS** |
| `test_sku_de_listings.py` (regression) | 20 | **20/20 PASS** |
| `test_sku_stock_lookup.py` (regression) | 36 | **36/36 PASS** |
| **Regression total** | 56 | **56/56 PASS** |

---

## 5. Existing Pages Status

Both existing pages remain fully active. No changes to:
- `sku_de_listings.py` — unchanged
- `sku_stock_lookup.py` — unchanged
- `SkuDeListings.jsx` — unchanged
- `SkuStockLookup.jsx` — unchanged

---

## 6. UAM Migration Plan

Before retiring existing pages, the following grants must be created in UAM:
- `tools.LedInventoryListings` — grant to any staff who currently have `tools.SkuDeListings`
- `tools.LedInventoryStock` — grant to any staff who currently have `tools.SkuStockLookup`

Do not revoke old grants until confirmed by Piranav after live testing.

---

## 7. Deployment Steps

1. Commit 10 files on `piranv-work`
2. Push to `websitetecteam-arch/dm-dashboard` (select **websitetecteam-arch** in credential popup)
3. Restart backend: `led_inventory_listings.py` + `led_inventory_stock.py` are new — backend must restart to load them
4. Grant `tools.LedInventoryListings` to Piranav in UAM (for live testing)
5. Live test: search LSCY290BG on UK → verify Combo + Single + ENC results; search on DE → verify Combo + ENC only
6. Live test Stock tab: UK vs DE warehouse stock differs for LSCY290BG (UK=624, Germany=0 at last check)

---

## 8. Remaining Risks

| Risk | Status |
|---|---|
| UK Single/Other count verified (6,596 from audit) | Covered — CASE WHEN in SQL |
| Currency implicit in DB | Covered — currency_symbol from server config only |
| Warehouse name ≠ market label | Covered — `'Germany'` hardcoded in MARKETS dict |
| UAM migration | OPEN — pending Piranav grant + live test before old page retirement |
| FR/US markets | Not included — FR store URL was staging domain; confirmed UK+DE only for Phase 2 |
