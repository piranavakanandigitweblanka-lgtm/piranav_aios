# Conduit 1–2 Part 2 — Implementation Validation

**Date:** 2026-10-07
**Req ID:** CONDUIT-1-2-2026-10-07-004
**Type:** Static validation PASS — browser validation pending

---

## Static Validation — PASS

| Case | Input | Expected | Result |
|---|---|---|---|
| Default card, `price_varies = true` | `variant = nil`, `use_variant: true`, `product.price_varies = true` | "From £X.XX" | PASS ✓ |
| Default card, `price_varies = false` | `variant = nil`, `use_variant: true`, `product.price_varies = false` | Exact price, no "From" | PASS ✓ |
| Variant card | `variant = object`, `use_variant: true` | Exact variant price, no "From" | PASS ✓ |
| Sale product — `price--on-sale` class | `compare_at_price > price` — unchanged condition | Class applied | PASS ✓ |
| Sale product — `special-price` class | `compare_at_price > price` — unchanged condition | Class applied | PASS ✓ |
| Sale product — compare-price display | `if compare_at_price > 0` — unchanged guard | `<s>` element rendered | PASS ✓ |
| `.price__sale` wrapper preserved | Not touched in edit | `<div class="price__sale grey-color">` always rendered | PASS ✓ |
| PDP — selected variant | `variant` passed explicitly → `variant == nil = false` | Exact price, no "From" | PASS ✓ |
| Single-variant product | `product.price_varies = false` | No "From" | PASS ✓ |

**No unexpected interactions identified. All 9 static cases pass.**

---

## Known Limitation (non-blocking)

`money_price` when "From" applies = `target.price` = `selected_or_first_available_variant.price`. This may not equal `product.price_min` if Shopify returns variants in non-price-ascending order. If Piranav observes "From £X.XX" showing a non-lowest price during browser validation, the follow-up fix is to use `product.price_min` rather than `target.price` in the "From" branch.

---

## Browser Validation — PENDING

Push to draft theme "Conduit build 2026-10", then check:

| Check | Product/Location | Expected | Pass? |
|---|---|---|---|
| A | ~5542 default card | "From £X.XX" | — |
| B | Same-price product default card | No "From" | — |
| C | Variant card (after colour filter) | Exact price | — |
| D | Sale product card | Struck-through compare price present | — |
| D | Sale product card | Sale badge unchanged | — |
| E | Colour swatch click | Price updates correctly | — |
| E | Inspect source | `.price__sale` div present | — |
| F | PDP — selected variant | Exact price, no "From" | — |
| G | Non-conduit collection | Prices unchanged | — |

---

## Exact Diff Applied

```diff
-  if target == product and product.price_varies
+  if product.price_varies and variant == nil
```

File: `shopify_projects/ledsone-uk-theme/snippets/price.liquid`, line 16. One line changed. No other files modified.

---

## Status: STATIC PASS — BROWSER VALIDATION PENDING PIRANAV PUSH TO DRAFT THEME
