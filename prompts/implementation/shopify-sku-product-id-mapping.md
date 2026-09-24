# Prompt: Shopify SKU → Product ID Mapping

**Category:** implementation  
**Registered:** 2026-09-24  
**Used for:** New_Product_Assignments sajee.xlsx — 99 products mapped to UK Shopify Product IDs

---

## Prompt

Given an Excel file with columns `Title` and `SKU`, find the Shopify Product ID for each product using the UK Shopify Admin GraphQL API (read-only).

**Input:** Excel file with Title and SKU columns  
**Output:** Mapping of Excel row → Shopify Product ID + GID + Shopify Title + Match Status

### Matching Strategy (3-pass)

**Pass 1 — Primary SKU component:**
- Split SKU on `+` (composite SKUs)
- Use `productVariants(first: 10, query: "sku:<PRIMARY_SKU>")` GraphQL query
- If returns single product → MATCHED
- If returns 0 → SKU_NOT_FOUND
- If returns multiple products → DUPLICATE_SKU or TITLE_MISMATCH

**Pass 2 — Secondary components (composite SKUs only):**
- Try each `+`-separated component in order
- First component returning a single unique product → use it
- If multiple products → try title matching

**Pass 3 — Full composite SKU + title search:**
- Try full composite SKU string as exact variant SKU lookup
- If still unresolved → extract ~NNNN product number from title, run `products(query: "NNNN")` title search

### Match Status Codes
- `MATCHED` — SKU uniquely identifies product, Product ID verified
- `SKU_NOT_FOUND` — no variant found for SKU
- `DUPLICATE_SKU` — SKU on multiple different products, unresolvable
- `TITLE_MISMATCH` — SKU matched product but title differs materially
- `AMBIGUOUS` — multiple candidates, insufficient evidence

### Key Technical Details
- **Store:** ledsone_uk (ledsone.myshopify.com)
- **Client:** `dm-dashboard/backend/app/shopify_client.py` → `graphql('ledsone_uk', query, vars)`
- **Token env:** `SHOPIFY_UK_ADMIN_TOKEN` (read-only)
- **API version:** 2024-10
- **NEVER modify Shopify** — use only productVariants and products queries

### Required Output Fields
Excel Row | Excel Title | Excel SKU | Primary SKU Searched | Shopify Product Title | Shopify Product ID | Shopify Product GID | Match Status | Match Method | Notes

---

## Reuse Notes
- Works for any staff member's product assignment Excel file against the UK store
- Composite SKUs (with `+`) are common for bundled/assembled products — full SKU lookup resolves them
- Rate limit: 0.05s sleep between requests is sufficient for this volume
