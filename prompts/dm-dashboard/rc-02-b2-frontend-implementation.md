# Prompt: RC-02 Step B2 — Repeat Customer Product Analytics Frontend

**Prompt ID:** DM-RC-02-B2
**Category:** implementation
**Registered:** 2026-10-14
**Status:** ACTIVE

---

## Objective

Add a four-tab interface to the existing `RepeatCustomers.jsx` page in the DM Dashboard. Preserve all existing functionality. Integrate the three new product analytics views from RC-02 B1 backend.

---

## File to Modify

`frontend/src/admin/pages/RepeatCustomers.jsx`

---

## Four Tabs

| Tab | ID | Endpoint |
|---|---|---|
| Customers | `customers` | Existing `/api/admin/repeat-customers?threshold=N` |
| Customer Products | `customer-products` | `GET /api/admin/repeat-customers/{customer_id}/products` |
| Product Summary | `product-summary` | `GET /api/admin/repeat-customers/product-summary?threshold=N` |
| Products Bought Together | `bought-together` | `GET /api/admin/repeat-customers/products-bought-together?threshold=N` |

---

## Key Design Rules

- Single threshold selector (3+/4+) shared across all tabs
- Tab 3 and Tab 4 lazy-load on first open; re-fetch on threshold change
- Tab 2 loads customer when customer_id provided (from "View Products →" click on Tab 1)
- "View Products →" button on each row in Customers tab navigates to Tab 2 with customer pre-loaded
- "↻ Refresh Customers" always visible; "↻ Refresh Products" visible only on product tabs (2/3/4)
- CSV export only on Customers tab
- apiFetch() for all calls — Bearer token automatic
- No raw email in product tabs; no fake product images; fallback placeholder (◻) for missing images
- Handle: loading, empty, not-synced (success=false from backend), 401, 403, 404, 422 per tab

---

## API Response Fields (actual backend contracts)

### Tab 2 — Customer Products
```json
{
  "success": true,
  "customer_id": "...",
  "products": [
    {
      "product_id": "str|null",
      "variant_id": "str|null",
      "product_title": "str",
      "variant_title": "str",
      "sku": "str",
      "image_url": "str|null",
      "total_qty": int
    }
  ],
  "total_products": int,
  "generatedAt": "ISO datetime",
  "completeness_warning": bool
}
```

### Tab 3 — Product Summary
```json
{
  "success": true,
  "threshold": 3,
  "products": [
    {
      "product_id": "str|null",
      "product_title": "str",
      "image_url": "str|null",
      "distinct_customers": int,
      "total_qty": int,
      "variants": [{"variant_id", "variant_title", "sku", "total_qty", "image_url"}]
    }
  ],
  "total_products": int,
  "generatedAt": "ISO datetime",
  "completeness_warning": bool,
  "truncated_orders_count": int
}
```

### Tab 4 — Products Bought Together
```json
{
  "success": true,
  "threshold": 3,
  "pairs": [
    {
      "product_id_a": "str",
      "product_title_a": "str",
      "product_id_b": "str",
      "product_title_b": "str",
      "orders_together": int,
      "distinct_customers": int
    }
  ],
  "total_pairs": int,
  "completeness_warning": bool
}
```

---

## Test Fix Required

`TestEndpointValidation` tests in `backend/tests/test_repeat_customer_products.py` must use `app_.dependency_overrides[m.require_access] = lambda: {}` instead of `patch()` — `Depends()` captures reference at decoration time.

---

## Expected Outputs

- Vite build: `✓ built in <time>` with no errors
- All 33 unit tests pass
- No existing functionality regressed
