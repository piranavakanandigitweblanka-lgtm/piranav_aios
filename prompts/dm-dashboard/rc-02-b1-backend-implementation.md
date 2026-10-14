# Prompt: RC-02 Step B1 — Repeat Customer Product Analytics Backend

**Prompt ID:** DM-RC-02-B1
**Category:** implementation
**Registered:** 2026-10-14
**Status:** ACTIVE

---

## Objective

Build the backend module for RC-02 Repeat Customer Product Analytics. This module extends the RC-01 Repeat Customers feature (admin_repeat_customer.py) by adding product-level data: what each repeat customer has bought, cross-customer product summaries, and products frequently bought together.

---

## Files to Create / Modify

| File | Action |
|---|---|
| `backend/app/admin/admin_repeat_customer_products.py` | CREATE — full implementation |
| `backend/app/main.py` | MODIFY — add router import + include_router + startup |
| `backend/tests/test_repeat_customer_products.py` | CREATE — unit tests |

---

## Technical Constraints

- Store: Shopify UK only (`ledsone_uk`)
- Valid-order rule (same as RC-01): `cancelledAt IS NULL` AND `displayFinancialStatus NOT IN {"VOIDED"}`
- Guest checkout excluded: skip orders where `customer` is null
- Gross quantity convention: PARTIALLY_REFUNDED = valid, quantities not subtracted
- Product identity: `variant.product.legacyResourceId` = product_id (never confused with variant_id)
- Product-level totals = sum of all variants sharing the same product_id
- Line items cap: `lineItems(first: 100)` — detect truncation via `hasNextPage`, log in `truncated_order_ids`
- Image source: `listings.shopify_listings.main_image_url WHERE item_id = variant_id AND site = 'UK'` (batch query, no extra Shopify API calls)
- Snapshot compute: single pass builds all 3 datasets
- Pre-compute at threshold=3 and threshold=4 during snapshot; filter at request time only
- Auth: `make_task_auth("tools.AdminRepeatCustomers")` on all endpoints
- Security: no raw email in snapshot, no customer PII in logs

---

## GraphQL Query Pattern

```graphql
query($cursor: String) {
  orders(first: 50, query: "...", after: $cursor) {
    edges { node {
      legacyResourceId createdAt cancelledAt displayFinancialStatus
      customer { legacyResourceId }
      lineItems(first: 100) {
        edges { node {
          quantity sku title
          variant {
            legacyResourceId
            title
            product { legacyResourceId title }
          }
        } }
        pageInfo { hasNextPage }
      }
    } }
    pageInfo { hasNextPage endCursor }
  }
}
```

---

## Three Datasets

### 1. customer_products
- Dict keyed by customer_id
- Per entry: list of `{product_id, variant_id, product_title, variant_title, sku, image_url, total_qty, order_ids}`
- Min threshold: 2 orders (MIN_SNAPSHOT_THRESHOLD)
- Sorted by total_qty desc per customer

### 2. product_summary (at threshold=3 and threshold=4)
- List sorted by total_qty desc
- Per row: `{product_id, product_title, image_url, distinct_customers, total_qty, variants: [...]}`
- Only customers with N+ orders qualify
- Variant list shows per-variant SKU, qty breakdown

### 3. products_bought_together (at threshold=3 and threshold=4)
- List sorted by orders_together desc
- Per row: `{product_id_a, product_title_a, product_id_b, product_title_b, orders_together, distinct_customers}`
- Canonical pair key: `(min(pid_a, pid_b), max(pid_a, pid_b))`
- Using `itertools.combinations(sorted(products_in_order), 2)`
- One count per order regardless of duplicate line items
- Only qualifying customers

---

## Snapshot

```python
ScheduledSnapshot(
    scope="admin-repeat-customer-products",
    table_name="public.admin_repeat_customer_products_snapshot",
    compute_fn=_compute_repeat_customer_products,
    interval_hours=24,
)
```

Payload structure:
```json
{
  "generatedAt": "<ISO datetime>",
  "store": "Shopify UK",
  "orders_scanned": 66975,
  "customer_products": { "<customer_id>": [ <product rows> ] },
  "product_summary_3": [ <rows> ],
  "product_summary_4": [ <rows> ],
  "products_bought_together_3": [ <pair rows> ],
  "products_bought_together_4": [ <pair rows> ],
  "truncated_order_ids": [ "<order_id>", ... ],
  "completeness_warning": true,
  "meta": { "threshold_3_customers": N, "threshold_4_customers": N }
}
```

---

## 4 Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/repeat-customers/{customer_id}/products` | Per-customer product list from snapshot |
| GET | `/api/admin/repeat-customers/product-summary?threshold=3\|4` | Cross-customer product summary |
| GET | `/api/admin/repeat-customers/products-bought-together?threshold=3\|4` | Co-purchase pairs |
| POST | `/api/admin/repeat-customers/products/sync/run-now` | Manual snapshot trigger |

Router prefix: `/api/admin/repeat-customers` (same as RC-01, no prefix conflict — paths are distinct)

---

## main.py Wiring

```python
from .admin.admin_repeat_customer_products import router as admin_repeat_customer_products_router
from .admin.admin_repeat_customer_products import start_snapshots as start_repeat_customer_products_snapshots

app.include_router(admin_repeat_customer_products_router)

# In startup function:
start_repeat_customer_products_snapshots()
```

---

## Test Coverage Required

| Scenario | Class |
|---|---|
| Order deduplication | TestBuildCustomerProducts |
| Threshold exclusion (below MIN) | TestBuildCustomerProducts |
| Variants not merged | TestBuildCustomerProducts |
| Gross qty aggregation | TestBuildProductSummary |
| Threshold 3 vs 4 filtering | TestBuildProductSummary |
| Product aggregates variants | TestBuildProductSummary |
| Pair generation (combinations) | TestBuildProductsBoughtTogether |
| Pair order-deduplication | TestBuildProductsBoughtTogether |
| Pair aggregate across orders | TestBuildProductsBoughtTogether |
| Distinct customer count | TestBuildProductsBoughtTogether |
| Non-qualifying customers excluded | TestBuildProductsBoughtTogether |
| Missing image → None | TestEnrichImages |
| DB failure → graceful None | TestEnrichImages |
| Invalid threshold → 422 | TestEndpointValidation |
| Snapshot=None → not-synced | TestEndpointValidation |
| Customer not found → 404 | TestEndpointValidation |

---

## Expected Output

- Module imports cleanly in isolation: `IMPORT OK`
- Routes list shows 4 paths
- Vite build passes
- All test scenarios covered

## What Is NOT Part of This Step

- Frontend tab strip and sub-components (B2)
- Live product sync trigger and data verification (B3)
- UAM changes (no new access grants needed — uses same task_key as RC-01)
