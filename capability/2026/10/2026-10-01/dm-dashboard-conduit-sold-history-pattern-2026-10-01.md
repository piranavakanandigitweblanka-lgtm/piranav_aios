# Capability — DM Dashboard Conduit Sold History Pattern

## Date First Identified
2026-10-01

## Last Updated
2026-10-02

## Status
ACTIVE — Phase 1 (sold history) deployed. Phase 2 (stock component) code complete, browser validation pending.

## Purpose
An admin-only DM Dashboard page that combines Shopify historical sales data for a specific product category with a PostgreSQL stock snapshot, giving management visibility into what sold and what remains in stock.

## Business Problem Solved
Conduit products span 4 Shopify collections and involve a complex relationship between the Shopify order system and the warehouse PostgreSQL inventory. Without this page, understanding conduit category sales trends and current stock requires manual cross-referencing of two separate systems. The pattern builds a unified admin view.

## When To Use
- Building an admin-only category-level sales + stock dashboard for a named product category
- The category products are tracked in the business PostgreSQL DB
- Shopify is the sales channel (orders queryable via GraphQL API)
- Stock is available in `inventory.local_inventory_current_stock_location_wise`

## When NOT To Use
- For staff-facing dashboards (this is admin-only)
- For categories where products are not in the business PostgreSQL DB mirror

## Required Inputs
- Category product IDs from PostgreSQL (`listings.shopify_listings`)
- Shopify store handle + admin token
- Date range for historical sales (e.g. Apr–Sep 2026)
- Warehouse location string (e.g. `'UK'`)

## Source Task / Requirement
Conduit Sold History Phase 1 + Phase 2
dm-dashboard, 2026-10-01 (Phase 1) / 2026-10-02 (Phase 2)

## Architecture

```
Admin Dashboard
  → GET /api/admin/conduit-sold
      → Shopify UK GraphQL (orders, filtered by product IDs + date range)
      → Business DB (product metadata, 4 collections)
      → Response: sold history by month + SKU

  → GET /api/admin/conduit-stock   [Phase 2]
      → PostgreSQL inventory tables (no Shopify API call)
      → Response: current stock by SKU, type, warehouse
```

**Frontend:** `frontend/src/admin/pages/ConduitSold.jsx`
- Phase 1: Tabs for 4 collections, monthly sold data, SKU table with qty breakdown
- Phase 2: Stock tab with summary cards, combinable filters, SKU table, expandable component rows with BOTTLENECK badge

## Key Implementation Details

### Product ID matching (Phase 1)
Shopify GraphQL returns `legacyResourceId` (string). Business DB stores `item_id` as bigint. Match: `int(legacyResourceId) == item_id`.

### VOIDED order exclusion
Exclude orders with `financial_status IN ('voided', 'refunded')` to avoid counting reversed sales.

### Phase 2 stock queries (PostgreSQL-only, no Shopify API)
3 queries:
1. Current UK stock by SKU
2. Stock by component type (4 types)
3. Alternative inventory via `product_mapping.alternative_inventory_id`

5-minute cache on stock queries (stock data changes infrequently).

### BOTTLENECK badge
Flag SKU-type combinations where stock is below a threshold — visible in the expandable component rows.

## Verified Data (Phase 1, 2026-10-01)
- 4 conduit collections: 58 unique products confirmed from business DB
- 44 conduit line items found in a 500-order sample
- Date range: 2026-04-01 → 2026-09-30

## Evidence Required
- Phase 1: Admin page loads, data table shows sold quantities per collection
- Phase 2: Stock tab shows current stock, BOTTLENECK badge visible where applicable

## Evidence Path
`validation/piranav/conduit-sold-phase1-validation-2026-10-01.md`
`validation/piranav/conduit-sold-phase2b-validation-2026-10-02.md`
`validation/piranav/conduit-sold-phase2c-validation-2026-10-02.md`
`prompts/dm-dashboard/conduit-sold-history-phase1.md`
`prompts/dm-dashboard/conduit-sold-phase2b-backend.md`
`prompts/dm-dashboard/conduit-sold-phase2c-frontend.md`

## Pass / Fail Rule
PASS: Phase 1 — Admin page loads sold history table with correct month buckets and SKU quantities. VOIDED orders excluded. Phase 2 — Stock tab shows per-SKU stock with BOTTLENECK badges where applicable.
FAIL: Product IDs don't match between DB and Shopify, OR order data missing, OR stock data stale beyond 5-minute cache.

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator

## Known Limits
- Shopify GraphQL has a 250-orders-per-page limit — for long date ranges, pagination is required
- Stock data is PostgreSQL-only (warehouse system) — Shopify stock quantities are not used
- `product_mapping.alternative_inventory_id` may not exist for all products — handle NULL gracefully
- Phase 2 browser validation was pending as of 2026-10-02

## Reuse Path
Apply to any product category where:
1. Products exist in `listings.shopify_listings`
2. Shopify is the sales channel
3. Stock is tracked in `inventory.local_inventory_current_stock_location_wise`

Replace collection handles, product IDs, and warehouse location as needed. The backend architecture (two separate endpoints: `/conduit-sold` and `/conduit-stock`) is reusable.

## Related Capabilities
- `dm-dashboard-pdf-image-embed-pattern-2026-10-02.md` — related admin module enhancement
- `shopify-listing-health-export-queries-2026-09-21.md` — same Shopify product DB as source

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-10-01 | Phase 1 (sold history) built and validated | `validation/piranav/conduit-sold-phase1-validation-2026-10-01.md` |
| 2026-10-02 | Phase 2 (stock component) backend + frontend built; browser validation pending | `validation/piranav/conduit-sold-phase2b-validation-2026-10-02.md` |
