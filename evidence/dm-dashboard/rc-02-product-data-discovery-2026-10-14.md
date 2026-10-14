# Evidence — RC-02 Repeat Customer Product Data Discovery

**Date:** 2026-10-14
**Req ID:** RC-02
**Type:** Discovery — read-only inspection
**Prompt ID:** DM-RC-DISC-02

---

## Files Inspected

| File | Purpose |
|---|---|
| `backend/app/admin/admin_repeat_customer.py` | RC-01 backend — current GraphQL query, snapshot structure, valid-order rule |
| `frontend/src/admin/pages/RepeatCustomers.jsx` | RC-01 frontend — current UI structure (413 lines, main branch) |
| `backend/app/dashboard_pages/conduit_sold.py` | Existing line-item query — confirmed product_id, variant_id, SKU, title, quantity pattern |
| `backend/app/core/shopify_client.py` | Shared GraphQL client, store keys, retry logic |
| `backend/app/core/scheduled_snapshot.py` | ScheduledSnapshot pattern — table-per-scope, compute_fn, interval_hours |
| `backend/app/core/db.py` | Three DB pools: app DB, business DB (listings/order_management), business DB 2 |
| `backend/app/automation_task/jefri_nonmoving.py` | Confirmed `featuredImage { url }` pattern for product image via GraphQL products() query |
| `backend/app/dashboard_pages/feed_optimization.py` | Confirmed `listings.shopify_listings` has `item_id, title, main_image_url, price, sku, quantity` |
| `backend/app/dashboard_pages/product_action_dashboard.py` | Confirmed `main_image_url` available by `item_id` from `listings.shopify_listings WHERE site = 'UK'` |
| `backend/app/dashboard_pages/shopify_uk_refunds.py` | Confirmed refunds are tracked separately — not subtracted from conduit_sold gross qty |

---

## Available GraphQL Fields (Order Line Items)

From `conduit_sold.py` ORDERS_QUERY — confirmed working pattern:

```graphql
lineItems(first: 100) {
  edges {
    node {
      quantity
      sku
      title
      originalTotalSet { shopMoney { amount } }
      variant {
        legacyResourceId        # variant_id (numeric string)
        product {
          legacyResourceId      # product_id (numeric string)
          title                 # product title
        }
      }
    }
  }
}
```

**Available via this query:**
| Field | Source | Type |
|---|---|---|
| Order ID | `o.legacyResourceId` | str |
| Customer ID | `customer.legacyResourceId` | str |
| Order date | `createdAt` | ISO datetime |
| cancelledAt | `cancelledAt` | str or null |
| displayFinancialStatus | `displayFinancialStatus` | str |
| Product ID | `variant.product.legacyResourceId` | str → int |
| Variant ID | `variant.legacyResourceId` | str → int |
| Product title | `variant.product.title` | str |
| Variant title | NOT in this query — needs `variant.title` added | — |
| SKU | `lineItem.sku` | str |
| Quantity | `lineItem.quantity` | int |
| Revenue | `originalTotalSet.shopMoney.amount` | str → float |
| Product image | NOT in order lineItem query — available via: (a) separate products() query using `featuredImage { url }`, or (b) `listings.shopify_listings.main_image_url` by item_id (variant_id) | — |

**NOT available directly from the order line-item query:**
- `variant.title` — must be added to GraphQL query
- Product image URL — must be fetched separately (see below)
- Net quantity after refunds — refunds are on a separate Shopify API endpoint

---

## Product Image Strategy — Two Options

### Option A: listings.shopify_listings (business DB) — RECOMMENDED
```sql
SELECT item_id, title, main_image_url, sku
FROM listings.shopify_listings
WHERE item_id = ANY(%s) AND site = 'UK'
```
- `item_id` = Shopify variant_id (numeric)
- `main_image_url` available for most UK products
- Already proven in `feed_optimization.py` and `product_action_dashboard.py`
- No extra Shopify API calls
- May be 1–24 hours stale (nightly sync)

### Option B: Shopify products() GraphQL with `featuredImage { url }`
- Proven in `jefri_nonmoving.py`
- Requires a separate products() scan (~thousands of products, many pages)
- Always fresh but costs extra API quota

**Decision: Use Option A (listings.shopify_listings) as primary source. Fall back to null image if item_id not found.**

---

## Refund Handling

RC-01 and conduit_sold.py both use **gross quantities** — PARTIALLY_REFUNDED orders are included, refunded quantities are not subtracted. The `shopify_uk_refunds.py` module is a separate page tracking refunds independently.

**RC-02 will follow the same convention: gross quantities. PARTIALLY_REFUNDED = valid order, all quantities counted.**

---

## Recommended Data Structures

### Tab 1 — Customer Products
Endpoint: `GET /api/admin/repeat-customers/{customer_id}/products`

Served from the product snapshot (filtered by customer_id at request time).

Per row:
```json
{
  "product_id": "1234567890",
  "variant_id": "9876543210",
  "product_title": "LED Strip 5m",
  "variant_title": "White / 5m",
  "sku": "LSTR-5M-W",
  "image_url": "https://cdn.shopify.com/...",
  "total_qty": 3,
  "order_ids": ["111", "222", "333"]
}
```

### Tab 2 — Product Summary
Endpoint: `GET /api/admin/repeat-customers/product-summary?threshold=3|4`

Served from the product snapshot (aggregated across all qualifying customers at threshold).

Per row:
```json
{
  "product_id": "1234567890",
  "product_title": "LED Strip 5m",
  "sku": "LSTR-5M-W",
  "image_url": "https://cdn.shopify.com/...",
  "distinct_customers": 42,
  "total_qty": 87
}
```

Note: product-level totals = sum of all variant-level quantities for that product_id. Variant breakdown available on drill-down.

### Tab 3 — Products Bought Together
Endpoint: `GET /api/admin/repeat-customers/products-bought-together?threshold=3|4`

Served from the product snapshot.

Per row:
```json
{
  "product_id_a": "111",
  "product_title_a": "LED Strip 5m",
  "product_id_b": "222",
  "product_title_b": "LED Driver 60W",
  "orders_together": 18,
  "distinct_customers": 15
}
```

Pair = unique (min(a,b), max(a,b)) per order. Counted once per order regardless of line-item duplicates.

---

## Snapshot Design

**One new snapshot table: `public.admin_repeat_customer_products_snapshot`**

Computed alongside the existing customer snapshot (same compute cycle or triggered together).

Payload structure:
```json
{
  "generatedAt": "...",
  "store": "Shopify UK",
  "orders_scanned": 66975,
  "customer_products": { "<customer_id>": [ <product rows> ] },
  "product_summary": { "<product_id>": { <summary row> } },
  "products_bought_together": [ <pair rows> ],
  "meta": { ... }
}
```

**Single compute fn** runs one full Shopify order scan (with line items), then builds all three datasets from the same pass. No duplicate scans.

---

## Performance Estimate

| Metric | Value |
|---|---|
| Total UK orders (all-time) | ~66,975 (from RC-01 sync) |
| Pages at 50 orders/page | ~1,340 pages |
| Pages at 200 orders/page (current RC-01 rate) | ~335 pages |
| Estimated scan time | 8–20 minutes (same as RC-01 full scan) |
| Extra cost vs RC-01 | +lineItems(first:100) field per order = ~2–3× larger payloads per page |
| Extra API quota impact | Moderate — each page is heavier; expect 15–30 min total |
| Business DB lookup (images) | One batch query: `item_id = ANY(array)` — fast, <1s |

**Risk:** Orders with >100 line items will be truncated by `lineItems(first: 100)`. For a B2B electrical supplier this is very unlikely but should be noted.

---

## Blockers / Missing Data

| Item | Status |
|---|---|
| `variant.title` not in current RC-01 query | Minor — add `variant { title legacyResourceId ... }` to new query |
| Product image from listings.shopify_listings | Available — confirmed `main_image_url` by `item_id` WHERE site='UK' |
| Refund quantities | Not subtracted — gross-only, matching existing convention |
| Line items >100 per order | Edge case — `lineItems(first: 100)` truncates; acceptable for UK B2C/B2B mix |
| Snapshot size | With ~1,245 customers × avg 8 products = ~10k rows in customer_products dict. Manageable in JSONB |
| Customer_id not in current snapshot for product lookup | Solved: the new compute_fn builds customer_products keyed by customer_id during the same scan |

---

## No RC-02 Documentation Existed Before This Session

Search confirmed: zero files matching `rc-02` or `RC-02` existed in `piranav_aios` before this session.
