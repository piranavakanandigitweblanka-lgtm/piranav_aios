# Conduit 1–2 Part 2 — Implementation Record

**Date:** 2026-10-07
**Req ID:** CONDUIT-1-2-2026-10-07-004
**Status:** PART 2 IMPLEMENTED — BROWSER VALIDATION PENDING
**Part:** Conduit 2 — "From" prefix on collection cards with multiple variant prices

---

## File Changed

| File | Change type |
|---|---|
| `shopify_projects/ledsone-uk-theme/snippets/price.liquid` | One-line condition change (line 16) |

No other files were modified. Part 1 (`product-item.liquid`) untouched.

---

## Exact Change

**File:** `snippets/price.liquid`, line 16

### BEFORE

```liquid
if target == product and product.price_varies
```

### AFTER

```liquid
if product.price_varies and variant == nil
```

---

## Why the Change Was Required

When `product-item.liquid` calls `render 'price', ..., use_variant: true`, the Liquid block sets:

```liquid
elsif use_variant
  assign target = product.selected_or_first_available_variant
```

`target` becomes a variant object. The original check `target == product` compares a variant to a product — always `false`. The `from_price_html` translation was never applied on any collection card.

The fix changes the condition to check directly:
1. `product.price_varies` — does this product have variants at different prices?
2. `variant == nil` — is this a default product card (not a variant-specific card)?

Both must be true for "From" to apply. This matches the intended behaviour exactly.

---

## Why `.price__sale` Was Preserved (Intentional)

The `<div class="price__sale grey-color">` wrapper at line 35 was **not touched**.

`assets/theme.js` line 2075 depends on this div existing in the DOM:

```javascript
var ps = bls__price.querySelector(".price__sale");
if (ps) { ps.appendChild(sp) }
```

This fires on colour-swatch click to inject compare-price HTML dynamically. Removing the wrapper would silently break sale price display on any collection page using colour swatches. The empty wrapper divs (present when no sale) are structurally necessary and harmless.

---

## Git Diff

```diff
-  if target == product and product.price_varies
+  if product.price_varies and variant == nil
```

One hunk, one line changed.

---

## Static Logic Trace

### Default product card — different variant prices (~5542 connector)
- `variant = nil`, `use_variant: true` → `target = product.selected_or_first_available_variant`
- `product.price_varies = true`
- `variant == nil = true`
- Condition: `true and true` → "From" applied → **From £X.XX** ✓

### Default product card — same variant prices
- `product.price_varies = false`
- Condition: `false and ...` → no "From" → **exact price** ✓

### Variant card (after filter click)
- `variant = specific variant object`
- `variant == nil = false`
- Condition: `... and false` → no "From" → **exact variant price** ✓

### Sale product — compare-at price
- `compare_at_price = target.compare_at_price` — computed from `target`, unchanged
- `price--on-sale` class: `compare_at_price > price` — unchanged
- `price__sale` wrapper: always rendered — **preserved** ✓
- `<s class="compare-price">`: guarded by `if compare_at_price > 0` — unchanged ✓

### PDP — selected variant
- Theme passes `variant` explicitly → `variant != nil` → condition false → no "From" → **exact variant price** ✓

### Single-variant product
- `product.price_varies = false` → no "From" ✓

### Known limitation
`money_price` when "From" applies uses `target.price` = `selected_or_first_available_variant.price`. This may not always equal `product.price_min` if Shopify returns variants in non-ascending price order. If "From" shows a mid-range price rather than the lowest, a follow-up fix would change `price = target.price` to `price = product.price_min` for this branch only.

---

## Browser Validation — PENDING

Piranav must push to draft theme ("Conduit build 2026-10") and validate:

| Test | Product / Check | Expected | Pass? |
|---|---|---|---|
| A | ~5542 connector — default card | "From £X.XX" | — |
| B | Any same-price product — default card | No "From" | — |
| C | Variant card (after filter) — any product | Exact variant price, no "From" | — |
| D | Sale product | Struck-through compare price present | — |
| D | Sale product | Sale badge / % unchanged | — |
| E | Colour swatch click | Price updates still work | — |
| E | Colour swatch click | `.price__sale` div present in source | — |
| F | PDP — selected variant | Exact price, no "From" | — |
| G | Non-conduit collection (e.g. pendants) | Prices unchanged | — |

---

## AIOS Files Updated This Session

| File | Update |
|---|---|
| `conduit-stock-price-cards/01_discovery/CONDUIT-01-02-discovery-2026-10-07.md` | Sections 10–15 rewritten with Part 2 deep-dive findings |
| `conduit-stock-price-cards/02_implementation/CONDUIT-02-implementation-2026-10-07.md` | This file — Part 2 implementation record |
| `validation/piranav/conduit-part2-price-discovery-validation-2026-10-07.md` | Discovery validation checklist |
| `closure/README.md` | Rows -003 and -004 added |
| `PROMPT_REGISTER.md` | Existing conduit row — no update needed (prompt unchanged) |

---

## Status

**PART 1 — IMPLEMENTED AND VALIDATED (Piranav confirmed PASS)**
**PART 2 — IMPLEMENTED — BROWSER VALIDATION PENDING**
