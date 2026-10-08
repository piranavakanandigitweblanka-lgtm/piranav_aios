# Conduit 1–2 Part 2 — Price Discovery Validation

**Date:** 2026-10-07
**Req ID:** CONDUIT-1-2-2026-10-07-003
**Type:** Discovery validation — no code changed

---

## Discovery Checklist — PASS

| Check | Finding | Status |
|---|---|---|
| Active collection template confirmed | `collection-pipe` → `collection-meta-filters.liquid` → `product-item.liquid` → `price.liquid` | PASS |
| "From" root cause identified | `price.liquid` line 16: `target == product` is always false when `use_variant: true` because `target` is set to a variant object, not the product | PASS |
| "From" fix proposed | One-line change: `if product.price_varies and variant == nil` | PASS |
| Locale key confirmed | `products.product.price.from_price_html: "From {{ price }}"` exists in `locales/en.default.json` | PASS |
| JS interaction with price.liquid checked | `collection.js` — no price manipulation. `theme.js` `updatePrice()` — modifies `.price__sale` on swatch click but does not call price.liquid | PASS |
| `.price__sale` wrapper risk assessed | `theme.js` line 2075 depends on `.price__sale` existing in DOM — removing the wrapper would silently break compare-price injection on swatch click on other collection pages | PASS |
| "274 zero-price strings" characterised | Empty `<div class="price__sale grey-color"></div>` wrapper nodes when no sale — visually invisible, structurally required for JS. Not safe to remove. | PASS |
| Part 2b dropped | Decision: do NOT remove `.price__sale` wrapper. Accepted as non-harmful pattern. | PASS |
| Discovery doc updated | Sections 10–15 of `conduit-stock-price-cards/01_discovery/CONDUIT-01-02-discovery-2026-10-07.md` fully rewritten with all findings | PASS |
| Closure entry written | `closure/README.md` row CONDUIT-1-2-2026-10-07-003 added | PASS |
| Sale badge / compare-at price interaction verified | "From" change does not affect `price--on-sale` class, `special-price` class, or struck-through compare price — those depend on `compare_at_price > price`, not the "From" condition | PASS |
| Proposed change scope | ONE LINE in `snippets/price.liquid` only — nothing else | PASS |

---

## Files Checked (Read-Only)

| File | Lines Inspected | Outcome |
|---|---|---|
| `snippets/price.liquid` | All 69 lines | Root cause confirmed on line 16 |
| `locales/en.default.json` | `from_price_html` key | Confirmed present |
| `assets/collection.js` | Price manipulation search | None found — only range slider |
| `assets/theme.js` | Lines 2038–2096 `updatePrice()` | JS dependency on `.price__sale` confirmed |
| `sections/collection-meta-filters.liquid` | Lines 252–266 card rendering | No interactive swatches — conduit page unaffected by JS swatch risk, but other pages are |
| `snippets/product-item.liquid` | Line 444 price call | `render 'price', product: product, variant: variant, use_variant: true` confirmed |

---

## Files NOT Changed

All files — Part 2 discovery is read-only. No implementation until Piranav approves.

---

## Pending — Awaiting Piranav Approval

**If approved, the only change is:**

File: `snippets/price.liquid`, line 16

Before:
```liquid
if target == product and product.price_varies
```

After:
```liquid
if product.price_varies and variant == nil
```

**Post-implementation validation checklist (to be done after push to draft theme):**

- [ ] Product ~5542 (different variant prices): default card shows "From £X.XX"
- [ ] Products where all variants share the same price: no "From" prefix
- [ ] Products with a single variant: no "From" prefix
- [ ] Variant cards (after filter click): exact variant price, no "From"
- [ ] Products with sale: struck-through compare price unchanged
- [ ] Sale badge (%) unchanged
- [ ] Non-conduit collection pages: prices correct
- [ ] PDP: "From" does not appear when a specific variant is selected

---

## Status: DISCOVERY PASS — IMPLEMENTATION PENDING PIRANAV APPROVAL
