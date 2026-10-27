# Evidence — SKU Stock Lookup: Single SKU Search Tab
## Date: 2026-10-27
## Status: PASS

---

## Files Changed

| File | Change |
|---|---|
| `backend/app/dashboard_pages/sku_stock_lookup.py` | MODIFIED — new GET `/api/sku-stock-lookup/single` endpoint added |
| `frontend/src/admin/pages/SkuStockLookup.jsx` | MODIFIED — tab selector + SingleSkuTab component, CsvBulkTab extracted |
| `backend/tests/test_sku_stock_lookup.py` | MODIFIED — 6 new single-SKU tests added (30 total) |

No other files changed.

---

## Backend — New Endpoint

### Route
`GET /api/sku-stock-lookup/single?sku=<value>`

### Auth
Same `make_task_auth("tools.SkuStockLookup")` — no UAM changes needed.

### Logic
Reuses `_fetch_stock_map([sku])` directly — zero SQL duplication.

### Response JSON
```json
{ "sku": "...", "status": "MATCHED|UNMATCHED|AMBIGUOUS", "product_id": "...|null", "stock": 0|null, "matched_by": "sku|sku_original|null" }
```

### Behaviour
- MATCHED: `stock` is integer (may be 0 — confirmed warehouse value)
- UNMATCHED: `stock` is null, `product_id` is null
- AMBIGUOUS: `stock` is null, `product_id` is null
- DB error → 502 opaque message
- Blank/missing sku → 400

---

## Frontend — Tab Selector

### Tabs
- **Single SKU Search** (default) — `SingleSkuTab` component
- **CSV Bulk Upload** — `CsvBulkTab` component (extracted unchanged from prior implementation)

### Single SKU UX
- `jreq-tbar` input + Search button (input picks up jreq-tbar input styles)
- Enter key triggers search (onKeyDown handler)
- States: idle → loading → result | error
- Result display: status pill + SKU (monospace), UK Stock, Matched By, Product ID in `jreq-inset-box`
- Zero stock displays as "0" (confirmed value)
- UNMATCHED/AMBIGUOUS: stock shows "—"
- "Clear / Search another" resets to idle

### CSS verified
- `jreq-tbar` + `input[type='text']` — line 638 of dashboard.css ✓
- `jreq-btn`, `jreq-btn-primary` — confirmed present ✓
- `jreq-inset-box` — confirmed present ✓
- `jreq-pill-solid-green/red/amber` — lines 1199–1214 ✓
- No new CSS classes introduced

---

## Test Results

```
30 passed in 0.74s
```

| New Test | Result |
|---|---|
| test_single_matched_by_sku | PASS |
| test_single_matched_by_sku_original | PASS |
| test_single_confirmed_zero_stock | PASS — stock=0, not None |
| test_single_unmatched_returns_null_stock | PASS — stock=None |
| test_single_ambiguous_returns_null_stock | PASS — stock=None |
| test_single_db_failure_propagates | PASS |

All 24 original tests still PASS.

---

## Build Results

```
✓ built in 658ms
```

---

## Security

- Parameterized query via `_fetch_stock_map` — no string interpolation
- 502 response has no DB details or credentials
- Same UAM policy as existing upload endpoint
- No writes to DB, Shopify, or Avasam

---

## UAM

No changes. `tools.SkuStockLookup` grant covers both `/upload` and `/single` endpoints.

---

## Git Status

Not committed. All changes in working tree on `piranv-work`.
