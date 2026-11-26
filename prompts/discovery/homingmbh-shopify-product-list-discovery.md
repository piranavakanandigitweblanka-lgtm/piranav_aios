# Prompt: Homingmbh Shopify — Complete Product List Discovery

---

## Category
discovery / shopify

## Purpose
Fetch the complete product inventory from a connected Shopify store via Admin GraphQL API (paginated). Produces a full product register with all classification fields needed for downstream tagging, SEO, and collection audit tasks.

## When to Use
- First task on any new Shopify store project
- Before any tagging, collection, or SEO work begins
- When a full product inventory snapshot is needed as a baseline

---

## Prompt (reusable for any Shopify store)

> Connect to the Shopify store via MCP.
> Fetch the complete product list using paginated GraphQL (100 per page, follow hasNextPage + endCursor until done).
> For each product return: Product ID, Title, Product Type, Vendor, Status (ACTIVE/DRAFT/ARCHIVED), Tags (comma-separated).
> Save results as a markdown evidence file with:
> - Total product count
> - Full product table
> - Pagination log (pages fetched, cursors used)
> - Any products with no type, no vendor, or no tags flagged separately
> Strictly read-only. Do not modify any products, tags, or collections.

---

## Key Technical Constraints
- Shopify GraphQL returns max 100 products per page
- Must use `pageInfo { hasNextPage endCursor }` for pagination
- Product ID is returned as a GID (`gid://shopify/Product/...`) — strip prefix for readability
- Status values: ACTIVE, DRAFT, ARCHIVED
- Tags returned as a flat array — join with comma for table display

## Expected Output
- Full product table (ID, Title, Type, Vendor, Status, Tags)
- Total count verified against `productsCount`
- Gap report: products missing type / vendor / tags

## First Used
2026-11-26 — Homingmbh DE store, Task HOMING-2026-11-26-001
