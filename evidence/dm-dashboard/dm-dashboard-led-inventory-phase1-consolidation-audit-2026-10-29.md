# DM Dashboard — LED Inventory: Phase 1 Consolidation Audit
**Req ID:** DMDASH-LEDINV-AUDIT-2026-10-29
**Date:** 29 October 2026
**Prepared by:** Claude Code (read-only audit — no code changed)
**Branch:** `piranv-work` — clean, up to date with `origin/piranv-work`
**Status:** AUDIT COMPLETE — awaiting Piranav + GPT review before Phase 2

---

## 1. Git State

| Field | Value |
|---|---|
| Branch | `piranv-work` |
| Remote | `https://github.com/websitetecteam-arch/dm-dashboard.git` |
| Status | Clean — nothing to commit |
| Latest commit | `3494d88` feat(sku-de-listings): add price calculator + CSV export |

---

## 2. Existing Pages — File Inventory

### SKU DE Listings

| Layer | File | Status |
|---|---|---|
| Frontend | `frontend/src/admin/pages/SkuDeListings.jsx` | Implemented (Phase 2+3) |
| Calc utility | `frontend/src/lib/priceCalc.js` | Implemented (Phase 3) |
| Backend router | `backend/app/dashboard_pages/sku_de_listings.py` | Implemented (Phase 2) |
| Nav entry | `frontend/src/admin/AdminLayout.jsx` line ~198 | Registered |
| Task registry | `frontend/src/taskRegistry.jsx` | Registered |
| Main.py | `backend/app/main.py` | Router included |
| UAM key | `tools.SkuDeListings` | Active |

**API:** `GET /api/sku-de-listings/search?sku={term}`
**Response:** `{ sku, total, combo_count, enc_count, rows[] }`
**Auth:** `make_task_auth("tools.SkuDeListings")` — admin/dev auto; staff needs UAM grant

### SKU Stock Lookup

| Layer | File | Status |
|---|---|---|
| Frontend | `frontend/src/admin/pages/SkuStockLookup.jsx` | Implemented |
| Backend router | `backend/app/dashboard_pages/sku_stock_lookup.py` | Implemented |
| Nav entry | `frontend/src/admin/AdminLayout.jsx` line ~199 | Registered |
| Task registry | `frontend/src/taskRegistry.jsx` | Registered |
| UAM key | `tools.SkuStockLookup` | Active |

**APIs:**
- `GET /api/sku-stock-lookup/single?sku={sku}` → `{ sku, status, product_id, stock, matched_by }`
- `POST /api/sku-stock-lookup/upload` → CSV stream with appended stock columns
**Auth:** `make_task_auth("tools.SkuStockLookup")` — admin/dev auto; staff needs UAM grant

---

## 3. Market/Store Identifiers — Verified Live

| sub_source | Store URL | Market | Currency | Listing count |
|---|---|---|---|---|
| **104** | ledsone.co.uk | **UK** | GBP (implicit) | 23,965 |
| **108** | ledsone.de | **DE** | EUR (implicit) | 16,065 |
| 233 | ledsone.fr | FR | EUR (implicit) | 1,053 |
| 245 | ledsone.us | US | USD (implicit) | 1,681 |

**Critical:** The `currency` column in `listings.shopify_listings` is NULL for all markets. Currency is entirely implicit — derived from sub_source / listing URL. A consolidated page must maintain an explicit market-config object mapping `sub_source → { label, currency, currencySymbol, warehouseLocation }`.

---

## 4. UK vs DE Listing Query — Key Differences

### SKU type breakdown (verified live)

| SKU Type | DE (sub_source=108) | UK (sub_source=104) |
|---|---|---|
| Combo (sku contains `+`) | majority | 9,144 |
| ENC (sku starts `ENC`) | minority | 2,878 |
| **Single/Other** | **near-zero** | **6,596** |

**CRITICAL DIFFERENCE:** UK has 6,596 "Single/Other" SKUs — standard individual product SKUs that contain neither `+` nor `ENC`. The existing DE-optimized Combo+ENC UNION ALL query silently misses all of these for UK. A UK listings search must include a third branch (or broaden the Combo branch to `sku LIKE '%{term}%'` without the ENC dedup restriction) to surface single SKU listings.

### ENC join — identical for both markets (verified live)
Both UK and DE use the same pattern:
```sql
JOIN inventory.products ip ON ip.sku = sl.sku
WHERE sl.sku LIKE 'ENC%' AND ip.sku_original LIKE '%{term}%'
```
UK ENC example confirmed: `ENC9067 / ENC9068` → `sku_original` contains `LSCY290BG`.

### Price column
Both markets use the same `price` (numeric) column — no separate GBP/EUR column exists. The numeric value IS the market-native price. Currency label must be applied by the frontend based on selected market.

### selected_variations JSON
Same structure for both markets — `string_agg(sv->>'Value', ' / ' ORDER BY sv->>'Name')` works identically.

---

## 5. Stock Lookup — UK vs Other Markets

### Verified warehouse_location values
```
UK       — 45,402 rows
Germany  — 45,402 rows
Canada   — 45,402 rows
US       — 45,381 rows
```

### Current SKU Stock Lookup page
Hardcoded to `warehouse_location = 'UK'`. Returns `UK_Current_Stock`.

### DE warehouse stock exists
For `LSCY290BG`: UK=624, Germany=0 — confirmed different values in different warehouses. A market-aware stock lookup would use `warehouse_location = 'Germany'` for DE market.

### Implication
The Stock Lookup page could be extended to accept a `warehouse_location` parameter from a market selector, making it truly multi-market. The DB schema already supports this.

---

## 6. Consolidation Architecture — Proposal

### Recommended approach: Single page with market-config object

One `LedInventory.jsx` page with two functional tabs (Listings, Stock Lookup) and a market selector. All market-specific values are driven by a central config object — no hardcoded values in query logic.

#### Market config (frontend + backend)

```js
// frontend/src/lib/marketConfig.js  (proposed)
export const MARKETS = {
  uk: {
    label: 'UK',
    subSource: 104,
    warehouseLocation: 'UK',
    currency: 'GBP',
    currencySymbol: '£',
    storeUrl: 'ledsone.co.uk',
    hasSingleSkus: true,   // UK has Single/Other SKUs — needs broader query
  },
  de: {
    label: 'DE',
    subSource: 108,
    warehouseLocation: 'Germany',
    currency: 'EUR',
    currencySymbol: '€',
    storeUrl: 'ledsone.de',
    hasSingleSkus: false,
  },
}
```

#### Backend generalisation

**Listings endpoint** — generalise `sku_de_listings.py` into `led_inventory_listings.py`:
- Accept `market` query param (`uk` | `de`)
- Resolve `sub_source` server-side from a trusted config dict (never let client supply raw sub_source)
- For UK: add a third UNION ALL branch for Single/Other SKUs (or broaden the Combo branch)
- Keep ENC dedup logic (`sl.sku LIKE 'ENC%'`) unchanged

**Stock lookup endpoint** — generalise `sku_stock_lookup.py`:
- Accept `market` param, resolve `warehouse_location` server-side
- Single-SKU endpoint: `GET /api/led-inventory/stock/single?sku={sku}&market={market}`
- CSV bulk endpoint: `POST /api/led-inventory/stock/upload?market={market}`
- UK remains default for backward compatibility

**UAM key:** `tools.LedInventory` — one key covers both tabs and all markets.
Or keep per-page keys and add `tools.LedInventory` as the consolidated key.

#### Frontend structure (proposed)

```
frontend/src/admin/pages/LedInventory.jsx        ← new consolidated page
frontend/src/lib/marketConfig.js                  ← market definitions
frontend/src/admin/pages/SkuDeListings.jsx        ← keep (don't remove yet)
frontend/src/admin/pages/SkuStockLookup.jsx       ← keep (don't remove yet)
```

`LedInventory.jsx` contains:
- `<MarketSelector>` — dropdown: UK | DE (extensible)
- `<ListingsTab market={market}>` — replaces SkuDeListings logic
- `<StockLookupTab market={market}>` — replaces SkuStockLookup logic
- Shared: `priceCalc.js` already usable, `apiFetch` already shared

#### Navigation migration path (safe)

Phase 2: Add `LedInventory` to `AdminLayout.jsx` under a new `section-inventory` section. Keep both existing entries active.
Phase 3 (later): After UAM grants migrated, hide or deprecate existing entries.

---

## 7. Risks and Unresolved Questions

| Risk | Severity | Detail |
|---|---|---|
| UK Single/Other SKUs missed | HIGH | Current Combo+ENC query covers only ~66% of UK listings. Third query branch required. |
| Currency implicit only | MEDIUM | No DB column — must never let client control currency symbol. Enforce via server config. |
| Warehouse ≠ Market for stock | MEDIUM | `warehouse_location = 'Germany'` for DE market, not `'DE'`. Config object must map this explicitly. |
| UAM grant migration | MEDIUM | Existing staff granted `tools.SkuDeListings` or `tools.SkuStockLookup` would need re-granting to `tools.LedInventory`, or the new page must accept grants from old keys during transition. |
| ENC9107 duplicate (UK) | LOW | Same ENC SKU appears in both active and draft status for UK — existing dedup logic handles this correctly via UNION ALL + ORDER BY. |
| France (sub_source=233) | LOW | 1,053 listings exist but FR store URL is a staging/test domain (`jedsz8-km.myshopify.com`). Exclude from initial market selector until confirmed production. |
| US (sub_source=245) | LOW | 1,681 listings. US warehouse stock exists. Can be added as market option once confirmed with Piranav. |

---

## 8. Proposed Phase 2 Files

| File | Action | Notes |
|---|---|---|
| `frontend/src/lib/marketConfig.js` | Create | Central market config — sub_source, warehouse, currency |
| `frontend/src/admin/pages/LedInventory.jsx` | Create | Market selector + Listings tab + Stock Lookup tab |
| `backend/app/dashboard_pages/led_inventory_listings.py` | Create | Generalised listings endpoint with market param |
| `backend/app/dashboard_pages/led_inventory_stock.py` | Create | Generalised stock endpoint with market param |
| `backend/app/main.py` | Modify | Import + include_router for both new routers |
| `frontend/src/admin/AdminLayout.jsx` | Modify | Add `led-inventory` nav entry |
| `frontend/src/taskRegistry.jsx` | Modify | Add `tools.LedInventory` entry |
| `backend/tests/test_led_inventory_listings.py` | Create | Unit tests: UK 3-branch query, DE 2-branch, market param validation |
| `backend/tests/test_led_inventory_stock.py` | Create | Unit tests: warehouse routing, auth |

**Keep unchanged for now:**
- `sku_de_listings.py` — leave active
- `SkuDeListings.jsx` — leave active
- `sku_stock_lookup.py` — leave active
- `SkuStockLookup.jsx` — leave active

---

## 9. Test Requirements for Phase 2

- UK listings: Single/Other SKUs appear for a known UK-only SKU
- UK listings: Combo and ENC results still correct
- DE listings: unchanged behaviour vs current SkuDeListings page
- Market param validation: invalid market rejected (400)
- sub_source and warehouse_location never controllable by client
- Stock lookup: `warehouse_location = 'UK'` for uk, `'Germany'` for de
- Currency label correct in table header and CSV for each market
- Price calculator: same `priceCalc.js` functions reused unchanged
- CSV export: market-appropriate filename and currency column label
- UAM: `tools.LedInventory` key enforced on all new endpoints
- Regression: existing SkuDeListings and SkuStockLookup endpoints unaffected

---

## 10. Source Files Read This Audit

- `frontend/src/admin/pages/SkuDeListings.jsx` — full
- `frontend/src/admin/pages/SkuStockLookup.jsx` — full
- `backend/app/dashboard_pages/sku_de_listings.py` — full
- `backend/app/dashboard_pages/sku_stock_lookup.py` — full
- `frontend/src/lib/priceCalc.js` — full
- `frontend/src/admin/AdminLayout.jsx` — lines 190–203
- `backend/app/core/task_auth.py` — full (from earlier session)
- Live DB queries: sub_source map, UK listing types, currency column, ENC join UK, warehouse_location values, stock by warehouse
