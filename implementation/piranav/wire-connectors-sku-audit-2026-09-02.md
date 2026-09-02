# Implementation — Wire Connectors & Junction Box SKU Audit
**Date:** 2026-09-02

## Approach
Data-only audit — no Shopify data was modified. All work was read + export.

## Queries Executed

### GraphQL — Collection Products + Variants
```
collection(id: "gid://shopify/Collection/665480921474") {
  products(first: 25) {
    node { id title variants(first: 50) { node { title sku price } } }
  }
}
```

### GraphQL — Variant SKU Search (batched)
Used `productVariants(query: "sku:BASESKU*")` across 4 batched queries covering all 61 base SKUs.

### GraphQL — Product ID + Tags
Used `productVariants(query: "sku:X")` with `product { id title tags }` for the 24 non-collection SKUs.

## Files Created
| File | Rows | Description |
|---|---|---|
| wire-connectors-collection.csv | 120 | All 21 products, full variants |
| sku-gap-analysis.csv | 61 | Gap status for each base SKU |
| product-id-tags-full.csv | 45 | Product ID + Tags, both groups |

## Saved To
`C:\Users\PC\Documents\`
