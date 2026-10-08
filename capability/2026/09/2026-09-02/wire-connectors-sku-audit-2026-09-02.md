# Capability — Wire Connectors & Junction Box SKU Audit
**Date:** 2026-09-02

## Reusable Pattern: Shopify Collection SKU Audit

### What This Session Proved
A full collection SKU audit can be done entirely via Shopify GraphQL MCP with no manual work:
1. `search_collections` — find collection by keyword
2. `collection.products(first:25).variants(first:50)` — get all variants in one query
3. `productVariants(query: "sku:BASE*")` — verify pack variants exist
4. Batch multiple SKU lookups in a single GraphQL query using aliases

### Pack SKU Naming Convention (LEDSone UK)
| Suffix | Meaning |
|---|---|
| (none) | 1 unit base SKU |
| 2PK | 2 pack |
| 3PK | 3 pack |
| 5PK | 5 pack |
| APK | 10 pack |
| CPK | 20 pack |
| DPK | 25 pack |
| EPK | 50 pack |
| FPK | 100 pack |

### Gap Analysis Approach
- Cross-reference base SKUs from internal CSV vs Shopify variant queries
- Check if base exists, which packs exist, which are missing
- Check if missing-from-collection SKUs exist elsewhere in store

### MCP Tools Used
- `mcp__claude_ai_Shopify__search_collections`
- `mcp__claude_ai_Shopify__graphql_query`

### CSV Output Template
Columns: `Group, Base SKU, Product ID, Title, Tags` — useful for collection assignment decisions.
