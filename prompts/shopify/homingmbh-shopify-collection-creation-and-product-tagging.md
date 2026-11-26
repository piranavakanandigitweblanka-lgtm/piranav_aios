# Prompt: Shopify Automated Collection Creation + Bulk Product Tagging

**Category:** shopify / implementation
**Pattern Name:** `homingmbh-shopify-collection-creation-and-product-tagging`
**First used:** 2026-11-26 — Homingmbh DE — Kabel sub-collections

---

## Prompt

You are a senior Shopify developer working on the [STORE] Shopify store via the Admin GraphQL API (2026-10).

Create [N] automated collections and tag all matching products.

### Collections to create

[Insert table: Title | Handle | Tag | Expected product count | Expected in-stock count]

### Rules

1. Pre-flight: batch-query all handles before creation. Stop if any handle exists.
2. Create all collections in one aliased `collectionCreate` mutation.
   - Each collection must have TWO conditions: `productTag TAGGED_WITH [tag]` AND `variantInventory GREATER_THAN 0`, matchType ALL.
3. Publish all collections to Online Store immediately after creation (`publishablePublish`, publication ID: `gid://shopify/Publication/[ID]`).
4. Identify all products to tag: query by parent category tag, classify by SKU prefix. Confirm total count matches expected before tagging.
5. Tag all products in batches of max 15. Use `productUpdate` with the FULL existing tag array plus the new sub-category tag. Never replace existing tags.
6. After tagging, re-fetch all collections and confirm product counts match expected in-stock figures.
7. Report: products tagged per group, errors, final collection counts.

### Constraints

- Do not modify inventory, SKUs, product types, metafields or unrelated product data.
- Do not report success until Shopify confirms mutations and counts are verified.

---

## Technical reference (Admin GraphQL 2026-10)

```graphql
# Collection creation with both conditions
mutation {
  cN: collectionCreate(collection: {
    title: "Title"
    handle: "handle"
    sources: [{
      source: {
        title: "Title"
        targetType: PRODUCTS
        inclusion: {
          matchType: ALL
          conditions: [
            { productTag: { matchType: ALL relation: TAGGED_WITH values: ["tag"] } }
            { variantInventory: { relation: GREATER_THAN value: 0 } }
          ]
        }
      }
    }]
  }) {
    collection { id title handle }
    userErrors { field message }
  }
}

# Publish
mutation {
  pN: publishablePublish(
    id: "gid://shopify/Collection/ID"
    input: { publicationId: "gid://shopify/Publication/ID" }
  ) {
    publishable { ... on Collection { id title } }
    userErrors { field message }
  }
}
```
