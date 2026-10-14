# Evidence — RC-02 Step B2 Frontend Implementation

**Date:** 2026-10-14
**Req ID:** RC-02
**Stage:** B2 — Frontend
**Status:** IMPLEMENTATION COMPLETE — browser test pending

---

## Files Modified

| File | Action | Notes |
|---|---|---|
| `frontend/src/admin/pages/RepeatCustomers.jsx` | MODIFIED | Full four-tab interface added |
| `backend/tests/test_repeat_customer_products.py` | MODIFIED | Fixed 6 failing tests (non-numeric variant ID assertion + endpoint auth override) |

---

## Four-Tab Interface

### Tab 1 — Customers (preserved)
- All existing functionality retained: 3+/4+ threshold selector, KPI cards, search, pagination, CSV export
- Added **View Products →** button per customer row — navigates to Tab 2 with customer pre-loaded
- Loading, error, empty, and no-match states all preserved

### Tab 2 — Customer Products
- Customer ID search bar + Load button
- Automatically populated when "View Products →" clicked from Tab 1
- Back to Customers button
- Calls: `GET /api/admin/repeat-customers/{customer_id}/products`
- Columns: Image, Product, Variant, SKU, Total Qty, Product ID, Variant ID
- `ProductImage` component with fallback (◻ placeholder, no fake URLs)
- Handles: not-synced state, 404 (customer not in snapshot), 422 (invalid ID), 401/403
- Empty state with informative message

### Tab 3 — Product Summary
- Lazy-loaded on first tab open; re-fetches on threshold change
- Calls: `GET /api/admin/repeat-customers/product-summary?threshold=3|4`
- Columns: Image, Product (with variant count), Top SKU, Customers (sortable), Total Qty (sortable), Product ID
- Client-side sort by `distinct_customers` or `total_qty`
- Not-synced state, empty state, completeness warning

### Tab 4 — Products Bought Together
- Lazy-loaded on first tab open; re-fetches on threshold change
- Calls: `GET /api/admin/repeat-customers/products-bought-together?threshold=3|4`
- Columns: Product A (name + ID), ×, Product B (name + ID), Orders Together, Customers
- Sorted by `orders_together` desc (backend-sorted, no client re-sort needed)
- No frontend pair calculation — uses backend's canonical sorted-pair definition
- Not-synced, empty, error states

---

## Shared Threshold Behaviour

- Single threshold selector controls all four tabs
- Tab 1 (Customers): fetches `/repeat-customers?threshold=N` on change
- Tab 2 (Customer Products): customer_products stored at MIN_THRESHOLD=2; snapshot always has data; threshold affects which customers qualify but customer ID lookup is direct
- Tab 3 + Tab 4: re-fetch on threshold change via `useEffect([threshold])`
- No stale data shown as fresh — each fetch clears prior data

---

## Controls

| Control | Shown When |
|---|---|
| ↻ Refresh Customers | Always |
| ↻ Refresh Products | Product tabs (2/3/4) only |
| ↓ Export CSV | Customers tab only |

Both sync buttons trigger independent background jobs. No full Shopify scan triggered by tab navigation.

---

## API Endpoints Used

| Endpoint | Tab | Method |
|---|---|---|
| `/api/admin/repeat-customers?threshold=N` | Tab 1 | GET |
| `/api/admin/repeat-customers/{id}/products` | Tab 2 | GET |
| `/api/admin/repeat-customers/product-summary?threshold=N` | Tab 3 | GET |
| `/api/admin/repeat-customers/products-bought-together?threshold=N` | Tab 4 | GET |
| `/api/admin/repeat-customers/sync/run-now` | All (Refresh Customers) | POST |
| `/api/admin/repeat-customers/products/sync/run-now` | Product tabs | POST |
| `/api/admin/repeat-customers/export/csv?threshold=N` | Tab 1 | GET |

All calls via `apiFetch()` — Bearer token attached automatically.

---

## Auth / Privacy

- `tools.AdminRepeatCustomers` permission required for all product endpoints (unchanged from B1)
- No raw email in product tabs — customer_id (numeric) only
- No product images generated or guessed — only rendered if `image_url` returned by backend
- No customer data stored in localStorage/sessionStorage
- `apiFetch` handles 401 → session-expired event globally

---

## Build and Test Results

| Check | Result |
|---|---|
| Vite build (before B2) | ✅ PASS — `✓ built in 1.02s` |
| Vite build (after B2) | ✅ PASS — `✓ built in 867ms` |
| B1 unit tests (before fixes) | 27/33 — 6 failing |
| B1 unit tests (after fixes) | **33/33 PASS** |
| Test fix 1 | `test_non_numeric_variant_ids_skipped` — expectation corrected (backend returns `{vid: None}`, not `{}`) |
| Test fix 2 | `TestEndpointValidation` × 5 — switched from `patch()` to `app_.dependency_overrides[require_access]` |

---

## Test Fixes Detail

### test_non_numeric_variant_ids_skipped
- **Before:** `assert result == {}` — wrong; backend initializes dict entry then skips DB query for non-numeric IDs
- **After:** `assert result.get("not-a-number") is None` and `mock_conn.assert_not_called()` — correct

### TestEndpointValidation × 5
- **Before:** `patch("...require_access", return_value={})` — ineffective because `Depends()` captures reference at decoration time
- **After:** `app_.dependency_overrides[m.require_access] = lambda: {}` — correct FastAPI override pattern

---

## Remaining — Browser Tests (B3)

| Test | Status |
|---|---|
| Tab 1 — Customers tab unchanged | PENDING — browser |
| Tab switching renders correct panel | PENDING — browser |
| Threshold change reloads product tabs | PENDING — browser |
| View Products → opens Tab 2 with customer pre-loaded | PENDING — browser |
| Product images render or show fallback | PENDING — browser (requires live sync) |
| Tab 3 sort by Customers / Total Qty | PENDING — browser |
| Product sync trigger (Refresh Products button) | PENDING — browser |
| Not-synced state (before first product sync) | PENDING — browser |
| UAM test — Repeat Customers row in matrix | PENDING — Piranav |
| python-multipart install for server startup | PENDING — pre-existing |
