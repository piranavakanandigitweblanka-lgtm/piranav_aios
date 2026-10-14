# Evidence — RC-02 Step B1 Backend Implementation

**Date:** 2026-10-14
**Req ID:** RC-02
**Stage:** B1 — Backend
**Prompt ID:** DM-RC-02-B1
**Status:** IMPLEMENTATION COMPLETE — runtime validation pending

---

## Files Created / Modified

| File | Action | Notes |
|---|---|---|
| `backend/app/admin/admin_repeat_customer_products.py` | CREATED | New RC-02 backend module — full implementation |
| `backend/app/main.py` | MODIFIED | Restored lost import lines (post-merge regression) + added RC-02 router |
| `backend/tests/test_repeat_customer_products.py` | CREATED | Unit tests covering all required scenarios |

---

## Module Summary: admin_repeat_customer_products.py

### Constants

| Name | Value |
|---|---|
| `ALLOWED_THRESHOLDS` | `{3, 4}` |
| `MIN_SNAPSHOT_THRESHOLD` | `2` |

### GraphQL Query

Orders scan with line items — 50 orders/page, `lineItems(first:100)`:

```graphql
{
  orders(first:50, query:"...", after: cursor) {
    edges { node {
      legacyResourceId createdAt cancelledAt displayFinancialStatus
      customer { legacyResourceId }
      lineItems(first: 100) {
        edges { node {
          quantity sku title
          variant {
            legacyResourceId title
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

### Datasets Built

| Dataset | Key | Description |
|---|---|---|
| `customer_products` | `{customer_id: [rows]}` | Per-customer product purchase history. Min threshold=2 orders |
| `product_summary_3` / `product_summary_4` | `[rows]` | Aggregate across repeat customers at threshold 3 and 4 |
| `products_bought_together_3` / `products_bought_together_4` | `[rows]` | Co-purchase pairs from qualifying customers |

### 4 Endpoints

| Method | Path | Auth |
|---|---|---|
| GET | `/api/admin/repeat-customers/{customer_id}/products` | `tools.AdminRepeatCustomers` |
| GET | `/api/admin/repeat-customers/product-summary?threshold=3\|4` | `tools.AdminRepeatCustomers` |
| GET | `/api/admin/repeat-customers/products-bought-together?threshold=3\|4` | `tools.AdminRepeatCustomers` |
| POST | `/api/admin/repeat-customers/products/sync/run-now` | `tools.AdminRepeatCustomers` |

### Snapshot

- scope: `admin-repeat-customer-products`
- table: `public.admin_repeat_customer_products_snapshot`
- interval_hours: 24

---

## Import Check Results

```
IMPORT OK
Routes: [
  '/api/admin/repeat-customers/{customer_id}/products',
  '/api/admin/repeat-customers/product-summary',
  '/api/admin/repeat-customers/products-bought-together',
  '/api/admin/repeat-customers/products/sync/run-now'
]
ALLOWED_THRESHOLDS: {3, 4}
MIN_SNAPSHOT_THRESHOLD: 2
```

---

## Full App Import

BLOCKED by pre-existing `python-multipart` missing dependency (not introduced by RC-02 — listed in rc-02-product-data-discovery-validation as pre-existing). RC-02 module imports cleanly in isolation.

---

## Vite Build

```
✓ built in 1.02s
```

PASS — frontend builds cleanly. RC-02 frontend components not yet created (Step B2 pending).

---

## main.py Regression Fix

After `git merge main` (329 commits behind), `piranv-work` branch lost import lines for:

- `admin_conduit_sold_router`
- `admin_conduit_stock_router`
- `admin_repeat_customer_router` + `start_repeat_customer_snapshots`
- `muguntha_budget_alerts_router`

All were restored. New RC-02 imports added:

```python
from .admin.admin_repeat_customer_products import router as admin_repeat_customer_products_router
from .admin.admin_repeat_customer_products import start_snapshots as start_repeat_customer_products_snapshots
```

Router and startup registration also added.

---

## Security Constraints Confirmed

All 10 security constraints from RC-01 carried forward:

- No raw email in snapshot, logs, or responses
- Customer data gated by `make_task_auth("tools.AdminRepeatCustomers")`
- No Shopify tokens in code
- No customer IDs in URLs or analytics events
- Image enrichment failures suppressed silently (no token leaks in errors)

---

## What Was NOT Done in B1

| Item | Stage |
|---|---|
| Frontend tab strip (Customers / Products / Product Summary / Bought Together) | B2 |
| Sub-components for each tab | B2 |
| Live product sync trigger and data verification | B3 |
| UAM browser test for Repeat Customers row | Pending (RC-01 item carried forward) |
| `python-multipart` install | Pre-existing — not RC-02 scope |
