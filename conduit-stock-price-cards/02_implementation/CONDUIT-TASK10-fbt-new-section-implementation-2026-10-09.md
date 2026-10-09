# CONDUIT TASK 10 — Frequently Bought Together: New Section Implementation

**Date:** 2026-10-09
**Owner:** Piranav
**Deadline:** Friday, 16 October 2026, 18:00 SL
**Status:** PARTIAL — section created, browser validation required
**Prepared by:** Claude Code (sinrasu mode)

---

## Files Created / Modified

| File | Action | Notes |
|---|---|---|
| `sections/frequently-bought-together.liquid` | **CREATED** | New standalone section — full FBT with checkboxes, combined total, add-to-cart |
| `templates/product.json` | **MODIFIED** | `fbt2_section` inserted at order position 3 (after `main`) |

### Files NOT modified

| File | Reason |
|---|---|
| `snippets/frequently-bought.liquid` | Untouched per scope — collection rules preserved |
| `snippets/product-bought-together.liquid` | Untouched — separate bls system |
| `templates/product.conduit-people-also-bough.json` | Not in scope for this phase |

---

## Section Architecture

**Section type:** `frequently-bought-together`
**File:** `sections/frequently-bought-together.liquid`
**Render condition:** Self-gating — entire section is wrapped in `{%- if fbt2_has_items -%}`. If `product.metafields.custom.related_products.value` is blank, the section outputs nothing at all.

**Template placement:** `product.json` → `fbt2_section` → order position 3, immediately after `main` (product form), before `product-sidebar`.

---

## Implementation Detail

### Liquid layer

1. Reads `product.metafields.custom.related_products.value` into `fbt2_related`.
2. Gate: if blank or empty → nothing renders.
3. Current product is always the first card. Uses `product.selected_or_first_available_variant`.
4. Related products looped from metafield array. Each is a full Shopify product object.
5. For multi-variant products: a `<select>` renders all variants with `data-price` and `data-available` on each `<option>`.
6. For single-variant: no select, variant ID stored in `card.dataset.variantId` via `card.data-variant-id`.
7. Current product: checkbox pre-checked, always available (product is the page product).
8. Related products: checkbox pre-checked if `rp_variant.available`, disabled if sold out.

### JavaScript layer (IIFE, scoped to section)

- **`syncCardFromVariant(card)`** — on variant select change: updates `card.dataset.price`, `card.dataset.available`, price display, sold-out state, and checkbox disabled state.
- **`recalcTotal()`** — sums `card.dataset.price` for all checked, enabled cards. Displays formatted total. Disables add button if nothing selected.
- **Add to cart** — builds `items` array from all checked, available cards. POSTs to `/cart/add.js` with `Content-Type: application/json`. Follows the same cart integration pattern as `frequently-bought.liquid`: `getSectionsToRender`, `cart.cartAction()`, `cart.open()`, `.cart-count` update, `free-ship-progress-bar`, `BlsLazyloadImg`.
- **Money format** — `formatMoney(cents)` → `'£' + (cents/100).toFixed(2)` with thousands separator. Appropriate for GBP.

### Cart API: multi-item add

Uses the Shopify `items` array format:
```json
POST /cart/add.js
Content-Type: application/json

{
  "items": [
    { "id": 12345, "quantity": 1, "properties": { "_source": "Frequently Bought Together" } },
    { "id": 67890, "quantity": 1, "properties": { "_source": "Frequently Bought Together" } }
  ]
}
```
This is Shopify's supported pattern for adding multiple items in one request.

### CSS

- Custom properties scoped to `.fbt2-wrapper` — no conflict with `.fbt-*` (existing FBT) classes.
- Desktop: horizontal flex row, cards share equal width (`flex: 1 1 120px`), `+` separators between.
- Mobile (≤767px): column layout, cards switch to horizontal row layout (image left, text right).
- Sold-out card: `opacity: 0.55`, checkbox disabled.
- Theme accent colour `#00a8c5` reused for price, add button, checked checkbox.

### Section schema

Three settings: heading (text), margin_top (range 0–80), margin_bottom (range 0–80), padding_horizontal (range 0–40). Configurable in theme editor.

---

## Static Validation

| Check | Result |
|---|---|
| Section gate: blank metafield → no output | PASS — `{%- if fbt2_has_items -%}` wraps entire section |
| Current product always first | PASS |
| Related products from `.value` (full product objects) | PASS |
| Multi-variant: `<select>` rendered | PASS |
| Single-variant: no select, variant ID in card data-attribute | PASS |
| Sold-out: checkbox disabled, price hidden, "Sold out" shown | PASS |
| Pre-check: current product checked, related checked if available | PASS |
| `data-price` in raw pence (integer) for JS calculation | PASS |
| Money format: `£` + toFixed(2) | PASS |
| Cart: items array format | PASS |
| Cart integration: matches existing FBT pattern | PASS |
| No `.fbt-*` class conflicts with old FBT snippet | PASS — all classes prefixed `.fbt2-` |
| Section is self-gating — no output if metafield blank | PASS |
| `product.json` template updated — fbt2_section at position 3 | PASS |
| Existing blocks in `product.json` unchanged | PASS |

---

## Browser Validation — NOT YET RUN

All checks below require Piranav to:
1. Push theme to Shopify draft: `shopify theme push --only sections/frequently-bought-together.liquid templates/product.json`
2. Populate `custom.related_products` metafield on at least one test product
3. Open that product page on the draft theme preview

| Check | Status |
|---|---|
| Section renders when metafield populated | NOT RUN |
| Section absent when metafield blank | NOT RUN |
| Current product shown first | NOT RUN |
| Related products match metafield | NOT RUN |
| Checkbox toggle recalculates total | NOT RUN |
| Variant change updates price and availability | NOT RUN |
| Unchecked item excluded from cart request | NOT RUN |
| All selected items added to cart | NOT RUN |
| Cart count updates | NOT RUN |
| Cart drawer opens | NOT RUN |
| Sold-out item handled (disabled checkbox, sold-out label) | NOT RUN |
| Mobile layout (no overflow, column stack) | NOT RUN |
| Existing FBT (frequently-bought.liquid) unaffected | NOT RUN |
| No JS errors in DevTools console | NOT RUN |
| No Liquid errors in page source | NOT RUN |

---

## Risks

| Risk | Severity | Status |
|---|---|---|
| `custom.related_products` blank on all test products → section invisible | LOW | Expected until metafield populated. Correct behaviour. |
| `rp_variant` is nil if product has no variants (edge case) | LOW | Guarded by `| default: rp.variants.first` |
| Cart `items` array with 0 items (all unchecked) | LOW | Guarded by `if (items.length === 0) return` |
| JSON.stringify payload rejected by Shopify on old theme JS interception | LOW | Uses native fetch, not theme AJAX wrappers |
| `product.selected_or_first_available_variant` nil on a product with no variants | VERY LOW | Extremely rare — `product.variants.first` fallback set |
| Current product already in cart — duplicate line item | LOW | Shopify merges same variant ID by default — acceptable |
| `sections/frequently-bought-together.liquid` name differs from `snippets/frequently-bought.liquid` — no conflict | CONFIRMED | Different file type (section vs snippet), different class names |

---

## Unresolved Before Final Acceptance

| # | Item | Owner |
|---|---|---|
| 1 | Confirm 10 target product IDs (brief lists 9 distinct approximate IDs — 1 missing) | Piranav |
| 2 | Populate `custom.related_products` on at least 1 test product | Piranav |
| 3 | Push theme and run browser validation checklist | Piranav |
| 4 | Confirm `product.conduit-people-also-bough.json` needs the new section too | Piranav + GPT |
| 5 | Populate all 10 target product metafields after validation passes | Piranav/staff |

---

## Next Steps

1. **Piranav push to draft:**
   ```
   shopify theme push --only sections/frequently-bought-together.liquid templates/product.json
   ```
2. **Piranav: populate `custom.related_products`** on 1 conduit product (e.g. 5757 — 20mm pipe) with 3 related products (5542, 5564, 5540)
3. **Browser validation** — run all 15 checks in the checklist above
4. **If conduit template also needs FBT:** add `fbt2_section` to `product.conduit-people-also-bough.json` (same pattern)
5. **Populate remaining 9 product metafields** after draft validation passes
6. **Mark Task 10 PASS** only after all 10 product pages verified

**Do not publish theme until all validation checks pass.**
