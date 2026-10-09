# Prompt — Conduit FBT New Section Implementation

**Category:** shopify / implementation
**Date:** 2026-10-09
**Pattern name:** `conduit-fbt-new-section-implementation`
**Status:** ACTIVE

---

## Reusable Prompt

```
TASK: Build a new Frequently Bought Together section for a Shopify product page

Create `sections/frequently-bought-together.liquid`. Requirements:
- Show the current product + related products from `product.metafields.custom.related_products.value`
- Checkbox per item (all pre-selected), plus signs between items
- Combined total price, updates on checkbox/variant change
- "Add selected to cart" via /cart/add.js items array (multi-item add)
- Handles sold-out items, unavailable variants, empty metafield (section hidden)
- Reuses theme cart integration (cart-notification/cart-drawer, getSectionsToRender)
- Section schema with heading, show/hide toggle
- Do NOT modify snippets/frequently-bought.liquid or bls system
- Do NOT add to templates/*.json until placement confirmed

Cart integration pattern (from existing FBT snippet):
  const cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer')
  POST /cart/add.js with { items: [...] }
  On success: update .cart-count, trigger cart.cartAction() + cart.open()

Validation: test on draft theme with at least 1 product that has metafield populated.
```
