# CONDUIT Step 3 — HTML Reduction Implementation
## Fixes 1–3 (Phased Approach)
**Date:** 2026-10-08
**Status:** CODE COMPLETE — Browser validation pending

---

## Baseline (before changes)

| Metric | Value |
|---|---|
| HTML size | 7,832,594 bytes (7.83 MB) |
| DOM elements | 19,966 |
| `<script>` elements | 703 |
| `<svg>` elements | 1,221 |

---

## Approved scope

Fixes 1–3 only. Fix 4 (lightweight variant card) deferred pending measurement of Fixes 1–3.

---

## Fix 1 — Move `<style>` block out of product-item.liquid

**Problem:** `product-item.liquid` lines 581–610 contained a `<style>` block (stock icon CSS) that was emitted on every single card render — both default and variant cards.

**Change:**
- Removed the `<style>` block from `snippets/product-item.liquid` entirely
- Added the same CSS rules into the existing `<style>` block in `sections/collection-meta-filters.liquid` (before the closing `</style>` at line 227)
- CSS now emitted exactly once per page load

**File changed:** `snippets/product-item.liquid`, `sections/collection-meta-filters.liquid`

---

## Fix 2 — SVG symbol/use deduplication

**Problem:** 4–6 inline SVGs (wishlist, compare, quickview, cart, 2× stock check) were embedded in full inside every product-item render. Each SVG was ~300–1,800 chars. With ~1,100 renders, these SVGs alone account for the majority of the 7.83 MB.

**Change:**
- Added a hidden `<svg style="display:none">` block containing 5 `<symbol>` elements (`#icon-wishlist`, `#icon-compare`, `#icon-quickview`, `#icon-cart`, `#icon-check`) at the top of `sections/collection-meta-filters.liquid` — output once per page
- Replaced all 8 inline SVG blocks in `snippets/product-item.liquid` with short `<svg><use href="#icon-id"/></svg>` references (~45 chars each vs ~600–1,800 chars each)

**File changed:** `snippets/product-item.liquid`, `sections/collection-meta-filters.liquid`

**SVG refs in product-item.liquid:** 9 (wishlist ×2, compare ×2, quickview ×1, cart ×1, check ×3)
**Raw `<path d=` elements in product-item.liquid:** 0 ✓

---

## Fix 3 — Prevent JSON scripts from emitting on variant cards

**Problem:** `product.variants | json` and `productVariantsQty` JSON were emitted inside every product-item render — including all hidden variant cards. For a product with 10 variants, the identical variants JSON was output 11 times.

**Change:**
- Wrapped both `<script type="application/json">` blocks in `{%- unless variant -%}...{%- endunless -%}`
- JSON now emits only on default product cards (where `variant` is nil)
- Variant cards no longer emit these scripts — they are not needed for filter operation

**File changed:** `snippets/product-item.liquid`

**Logic:**
- `render 'product-item', product: product` → `variant` is nil → scripts emit ✓
- `render 'product-item', product: product, variant: variant` → `variant` is set → scripts suppressed ✓

---

## Files changed

| File | Change |
|---|---|
| `snippets/product-item.liquid` | Remove `<style>` block; replace 8 SVG blocks with `<use>` refs; wrap JSON scripts in `unless variant` |
| `sections/collection-meta-filters.liquid` | Add stock CSS to existing `<style>` block; add SVG `<symbol>` defs block after `</style>` |

---

## Verification checks (static)

| Check | Result |
|---|---|
| `<use href="#icon-*">` refs in product-item.liquid | 9 ✓ |
| Raw `<path d=` elements in product-item.liquid | 0 ✓ |
| `<style>` blocks in product-item.liquid | 0 ✓ |
| `unless variant` guard around JSON scripts | 1 ✓ |
| `productinfo` + `productVariantsQty` script blocks present | 2 ✓ |
| `<symbol id=` defs in collection-meta-filters.liquid | 5 ✓ |
| Stock CSS in collection-meta-filters.liquid | 5 rules ✓ |

---

## Expected reduction (estimated)

| Fix | Expected saving |
|---|---|
| Fix 1 (style dedup) | ~0.66 MB |
| Fix 2 (SVG symbols) | ~5.5 MB |
| Fix 3 (JSON dedup) | ~0.4 MB |
| **Total estimated** | **~6.5 MB → target ~1.3 MB** |

---

## Preserved features (unchanged)

- Tasks 1–2: stock labels (In Stock / Some options sold out / Out of Stock) ✓
- Tasks 1–2: "From" pricing via price.liquid line 16 fix ✓
- Task 4: Finish/Colour filter (F3) — data-f3 on wrapper divs unchanged ✓
- Diameter filter (F1), Type filter (F2) — data attributes unchanged ✓
- Mobile filter accordion — JS unchanged ✓
- Product card markup, images, Judge.me badge, price block — unchanged ✓
- Variant selection — `current_variant` logic unchanged ✓

---

## Measurement After Fixes 1–3 (Browser — Post-Push)

**Measured:** 2026-10-08
**Source:** GPT-provided measurement after Fixes 1–3 applied to draft theme

| Metric | Before | After Fixes 1–3 | Change | Target |
|---|---|---|---|---|
| HTML size | 7,832,594 bytes | **2,900,982 bytes** | −4,931,612 bytes (−63%) | **< 2,000,000 bytes** |
| DOM elements | 19,966 | 18,594 | −1,372 | — |
| `<script>` elements | 703 | 229 | −474 | — |
| `<svg>` elements | 1,221 | 1,222 | +1 | — |

**Result: SHORT OF TARGET**
2,900,982 bytes ≈ 2.9 MB. Target is under 2 MB. Gap remaining: ~900,000 bytes (~0.9 MB).

Fixes 1–3 achieved a 63% reduction — significant progress but target not met.
Fix 4 (lightweight variant card rendering) is required to close the gap.

---

## Next step

Fix 4 must be scoped and implemented.

Fix 4 approach (pre-approved scope): Replace full `product-item.liquid` render on variant cards with a lightweight custom render — suppressing images, price block, badges, and other non-filter elements that are not needed on hidden variant cards. Only `data-*` filter attributes are required on variant cards.

Push Fix 4 to draft theme → re-measure HTML → confirm below 2 MB → validate all filters still pass.

If HTML < 2 MB and all tests pass: task COMPLETE.
Record browser measurement as evidence before closing.

---

## Commit status

Changes uncommitted — pending Piranav git commit instruction.
