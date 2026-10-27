# Evidence — SKU Stock Lookup Implementation
## Date: 2026-10-27
## Status: PASS

---

## Files Created

| File | Type |
|---|---|
| `backend/app/dashboard_pages/sku_stock_lookup.py` | NEW — FastAPI router |
| `frontend/src/admin/pages/SkuStockLookup.jsx` | NEW — React page |
| `backend/tests/test_sku_stock_lookup.py` | NEW — 24 tests |

## Files Modified

| File | Change |
|---|---|
| `backend/app/main.py` | Import + `app.include_router(sku_stock_lookup_router)` added after seo_url_intelligence_router |
| `frontend/src/taskRegistry.jsx` | `tools.SkuStockLookup` entry added before SeoUrlIntelligence |
| `frontend/src/admin/AdminLayout.jsx` | `{ key: 'sku-stock-lookup', toolKey: 'tools.SkuStockLookup', enabled: true }` added before seo-url-intelligence |

---

## Git Preflight

| Check | Result |
|---|---|
| Branch | `piranv-work` |
| Upstream | `origin/piranv-work` |
| Working tree before pull | CLEAN |
| Pull result | `Already up to date` (ff-only) |

---

## Backend

### Endpoint
`POST /api/sku-stock-lookup/upload`

### Auth
`make_task_auth("tools.SkuStockLookup")` — UAM-grantable, consistent with SeoUrlIntelligence pattern.

### SQL
```sql
SELECT p.id::text AS product_id, p.sku, p.sku_original, COALESCE(s.stock, 0) AS uk_stock
FROM inventory.products p
LEFT JOIN inventory.local_inventory_current_stock_location_wise s
       ON s.inventory_id = p.id AND s.warehouse_location = 'UK'
WHERE p.sku = ANY(%(skus)s) OR p.sku_original = ANY(%(skus)s)
```
Uses `get_business_conn()` (existing pool). Read-only SELECT. No DB writes.

### Matching Logic
1. Primary: `p.sku` match → `matched_by = 'sku'`
2. Fallback: `p.sku_original` match → `matched_by = 'sku_original'`
3. Same input SKU → different product IDs via both keys → `AMBIGUOUS`, stock blank
4. No match → `UNMATCHED`, stock blank (never zero)
5. Confirmed zero from DB → `MATCHED`, `uk_stock = 0`

### Validation / Size
- MIME: accepts text/csv + .csv extension fallback
- Max size: 10 MB (Avasam CSV is ~200 KB)
- SKU column detection: 6 known names (SKU, sku, ProductSKU, product_sku, Item SKU, item_sku) + case-insensitive fallback
- 400 on missing SKU column, empty file, wrong type, oversized
- 502 on DB failure (opaque message — no internal details exposed)

### Response Headers
`X-SKU-Matched`, `X-SKU-Unmatched`, `X-SKU-Ambiguous`, `X-SKU-Zero-Stock`, `X-SKU-Total` — exposed via `Access-Control-Expose-Headers`.

---

## Frontend

### Component
`frontend/src/admin/pages/SkuStockLookup.jsx`

- Phase states: idle → loading → done | error
- Drag-and-drop + click-to-select upload zone (`jreq-upload-box`)
- KPI cards (jreq-cards): Total rows, Matched, Unmatched, Ambiguous, Zero stock
- Download button (`<a href={blobUrl} download>`) — uses blob URL, no server re-fetch
- `apiFetch` from `../../lib/apiFetch` (consistent with SeoUrlIntelligence)
- All CSS: existing `jreq-*` classes only (verified against dashboard.css)

---

## Test Results

```
24 passed, 1 warning in 2.04s
```

| Test | Result |
|---|---|
| _detect_sku_column (exact, lowercase, missing, ProductSKU) | PASS ×4 |
| _safe_field (injection =, +, quotes, normal, empty, None) | PASS ×6 |
| _fetch_stock_map (sku match, sku_original match, zero stock) | PASS ×3 |
| _fetch_stock_map (unmatched absent, ambiguous, empty input) | PASS ×3 |
| _fetch_stock_map (DB exception propagates, duplicate SKUs) | PASS ×2 |
| Pipeline (matched, unmatched blank, ambiguous blank) | PASS ×3 |
| Pipeline (duplicate rows preserved, original cols, row count) | PASS ×3 |

---

## Build Results

Frontend build: **PASS** — 970ms, zero errors
Python compile: `app/dashboard_pages/sku_stock_lookup.py` — **PASS**
Python compile: `app/main.py` — **PASS**

---

## UAM Registration

- Task key: `tools.SkuStockLookup`
- **Action required:** Piranav must grant `tools.SkuStockLookup` to himself via UAM page after first deploy.
- No existing grants modified.

---

## Reuse of Prior Work

- SQL pattern: from `jefri_nonmoving.py` `_warehouse_stock_for_base_skus()` + Avasam 2026-10-27 validated run
- Upload pattern: `listing_issues.py` `UploadFile` + `await file.read()`
- CSV stream: `admin_repeat_customer.py` `StreamingResponse` + `_safe_csv_field()`
- Auth: `make_task_auth()` from `core/task_auth.py` (SeoUrlIntelligence pattern)
- CSS: `jreq-*` design system (SeoUrlIntelligence reference)

---

## Git Status (post-implementation)

No commits made. All changes in working tree on `piranv-work`.
