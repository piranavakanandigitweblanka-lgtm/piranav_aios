---
name: conduit-sold-history-phase1
category: dm-dashboard
created: 2026-10-01
status: IMPLEMENTED
---

# Conduit Sold History — Phase 1 (dm-dashboard Admin Page)

## Purpose
Build an Admin-only DM Dashboard page showing Shopify UK sold units for the 4 Conduit collections, organized by Collection → Product ID → SKU → Monthly Units Sold for Apr–Sep 2026.

## Files to Create
- `backend/app/admin_conduit_sold.py` — FastAPI router, Shopify order fetching, aggregation logic
- `frontend/src/admin/pages/ConduitSold.jsx` — React UI with collection tabs, SKU table, product totals

## Files to Modify
- `backend/app/main.py` — register `admin_conduit_sold_router`
- `frontend/src/admin/AdminLayout.jsx` — add sidebar item + panel for `conduit-sold` key

## Collections (sub_source=104 = ledsone.co.uk UK store)
From `listings.shopify_collections`:
- `conduit-accessories` (collection_id: 647662076290) — 37 products
- `conduit-lamp-holder` (collection_id: 647662338434) — 3 products
- `conduit-lighting` (collection_id: 426407592186) — 49 products
- `conduit-lightings` (collection_id: 665354469762) — 20 products

## Data Sources
1. **Business Postgres** `listings.shopify_collection_products` → conduit product_ids (JOIN on `listings.shopify_collections` WHERE handle IN (...) AND sub_source=104 AND is_deleted=0)
2. **Shopify UK API** (`ledsone_uk` store via `shopify_client.graphql()`) → orders with line items → product_id, variant_id, SKU, quantity

## Why Shopify API (not business DB orders)?
`order_management.order_item_info.product_id` is NULL for UK Shopify orders — only `item_sku` is populated. Shopify API is the only source with product_id at line-item grain.

## Key Technical Constraints
- Use existing `shopify_client.graphql("ledsone_uk", ...)` — do NOT create a second Shopify client
- Use existing `verify_admin_token(request.headers.get("Authorization"))` for admin-only protection
- Use existing `get_business_conn()` for business DB
- Sidebar panels must NOT unmount (use `tabPanelClass(active, key)` CSS visibility pattern)
- Backend must NOT run with `--reload`
- In-memory cache with 15-min TTL (same as shopify_uk_refunds.py pattern) — first load takes 1-3 min (250+ pages of orders)

## Sales Rule
Gross units sold on non-VOIDED orders (PAID, PARTIALLY_PAID, PARTIALLY_REFUNDED, AUTHORIZED, PENDING).
Refunded quantities NOT subtracted — gross sold is standard for sales history reports.
Exclude VOIDED orders (never shipped/paid).

## API Endpoint
`GET /api/admin/conduit-sold` — admin JWT required in `Authorization: Bearer {token}` header
Response: `{ success, generatedAt, period, months, store, collections: [{ handle, title, products: [...], grand_total }], meta }`

## Reused Code
- `shopify_client.graphql()` — Shopify API client
- `verify_admin_token()` from `auth.py`
- `get_business_conn()` from `db.py`
- `tabPanelClass` / `LazyPanel` from `Sidebar.jsx`
- `jreq-*` CSS classes for consistent styling
- `VITE_API_URL || 'http://localhost:8499'` pattern
- `localStorage.getItem('dm_token')` for auth header

## Expected Output
Page shows collection tabs (e.g. "Conduit Accessories (183)"), each tab has product blocks with SKU table (columns: SKU, Title, Apr, May, Jun, Jul, Aug, Sep, Total), plus a product-level total row.
