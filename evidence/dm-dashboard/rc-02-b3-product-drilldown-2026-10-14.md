# Evidence — RC-02 Step B3 Product Summary Customer Drill-Down

**Date:** 2026-10-14
**Req ID:** RC-02
**Stage:** B3 — Product drill-down
**Status:** IMPLEMENTATION COMPLETE — browser test pending (requires live product sync)

---

## Problem Identified in Preflight

`product_summary_3` / `product_summary_4` rows store `distinct_customers` as an integer count.
Customer IDs are in `customer_products` (keyed by customer_id), but the snapshot did not store
per-customer order counts — making threshold-filtered drill-down impossible without re-scanning.

**Solution:** Added `customer_order_counts: {cid: int}` to snapshot payload (from already-computed
`cust_order_counts` set — no extra Shopify API call).

---

## Files Modified

| File | Action |
|---|---|
| `backend/app/admin/admin_repeat_customer_products.py` | Added `customer_order_counts` to snapshot payload, `_get_product_customers()` helper, `DRILL_DOWN_PAGE_SIZE`, `GET /product-summary/{product_id}/customers` endpoint |
| `backend/tests/test_repeat_customer_products.py` | Added `TestGetProductCustomers` (10 cases) + `TestProductCustomersEndpoint` (6 cases) |
| `frontend/src/admin/pages/RepeatCustomers.jsx` | Added `ProductCustomerDrillDown` component, updated `ProductSummaryTab` with clickable customer counts + expanded drill-down panel |

---

## Backend: New Endpoint

```
GET /api/admin/repeat-customers/product-summary/{product_id}/customers
  ?threshold=3|4   (required, 3 or 4)
  &page=1          (1-based, default 1)
```

**Auth:** `tools.AdminRepeatCustomers` (unchanged)

**Response:**
```json
{
  "success": true,
  "product_id": "7654321",
  "threshold": 3,
  "generatedAt": "...",
  "syncedAt": "...",
  "total": 42,
  "page": 1,
  "page_size": 50,
  "page_count": 1,
  "customers": [
    {"customer_id": "1234567890", "total_qty": 8, "variant_count": 2},
    ...
  ]
}
```

**Error cases:**
- `422` — non-numeric product_id or invalid threshold
- `404` — no qualifying customers for this product at this threshold
- `200 + success:false` — snapshot not yet synced

**No Shopify API call.** Served entirely from snapshot.

---

## Backend: Snapshot Change

Added one field to snapshot payload in `_compute_repeat_customer_products()`:

```python
customer_order_counts_int = {cid: len(oids) for cid, oids in cust_order_counts.items()}
# Stored in payload as: "customer_order_counts": customer_order_counts_int
```

Old snapshots without this key: `_get_product_customers()` falls back to `MIN_SNAPSHOT_THRESHOLD`
(admits all customers in `customer_products`). No backward-compatibility breakage.

---

## Backend: Helper `_get_product_customers()`

- Filters by `customer_order_counts[cid] >= threshold`
- For each qualifying customer, sums `total_qty` across all `customer_products` rows where `product_id` matches
- Returns `{customer_id, total_qty, variant_count}` — distinct one row per customer_id
- Sorted by total_qty desc
- Paginated: `DRILL_DOWN_PAGE_SIZE = 50`

---

## Frontend: Drill-Down UX

### ProductSummaryTab changes
- Customer count cells are now clickable buttons (underlined dotted, blue, hover style)
- Clicking a count toggles a `ProductCustomerDrillDown` panel below the table
- Clicking same product again collapses the panel
- Threshold change closes the panel and re-fetches the summary
- Products without a numeric product_id show the count but disable the button

### ProductCustomerDrillDown component
- Shows product image, title, product_id, and customer count summary
- Fetches `GET /product-summary/{product_id}/customers?threshold=N&page=P`
- Customer table: Customer ID | Total Qty | Variants | View Products →
- "View Products →" per row → navigates to Customer Products tab (same `handleViewProducts` as Tab 1)
- Pagination (prev/next, page X of Y, total count)
- Close (✕) button
- Loading, error, and empty states

---

## Data Accuracy

| Claim | Verified |
|---|---|
| Distinct customers — one row per customer_id | ✅ |
| total_qty = sum across all variants of that product | ✅ |
| Threshold applied to order count, not product purchase count | ✅ |
| No double-counting customers | ✅ |
| Old snapshots without customer_order_counts fall back gracefully | ✅ tested |

---

## Test Results

| Suite | Count | Result |
|---|---|---|
| Pre-existing (B1+B2) tests | 33 | 33/33 PASS |
| TestGetProductCustomers (helper) | 10 | 10/10 PASS |
| TestProductCustomersEndpoint | 6 | 6/6 PASS |
| **Total** | **49** | **49/49 PASS** |

Vite build: `✓ built in 5.35s` — no errors.

---

## Privacy

- No customer email returned or stored — customer_id only
- No PII in API response or drill-down panel
- Auth gate unchanged: `tools.AdminRepeatCustomers`
