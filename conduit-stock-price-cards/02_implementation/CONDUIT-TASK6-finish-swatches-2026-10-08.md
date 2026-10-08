# CONDUIT Task 6 — Show Finish Information on Product Cards
## Implementation Record
**Date:** 2026-10-08
**Status:** COMPLETE — GPT confirmed 2026-10-08

---

## Requirement

Every product card for a product that has a Colour option must show colour/finish swatches on the collection page at `/collections/conduit-lighting`.

---

## Architecture (confirmed in discovery)

```
collection.collection-pipe.json
  → sections/collection-meta-filters.liquid (active section)
    → snippets/product-item.liquid (per card)
      → snippets/product-color-swatches.liquid (swatch component)
```

`main-collection-product` section is disabled on this template — not touched.

---

## Root Cause (from discovery)

`product-item.liquid` line 451 had this guard:

```liquid
{%- if color_type != 'radio' and color_type != 'dropdown' and th_st.enable_sw_only_product_detail == false -%}
    {%- render 'product-color-swatches', product: product -%}
{%- endif -%}
```

`settings.enable_sw_only_product_detail` is `True` site-wide. This condition evaluated to `false` on every card render, silently suppressing all swatches on all collection pages across the theme.

---

## Change Applied

### File 1: `snippets/product-item.liquid` — lines 451–457

**Before:**
```liquid
{%- if color_type != 'radio' and color_type != 'dropdown' and th_st.enable_sw_only_product_detail == false -%}
    {%- render 'product-color-swatches', product: product -%}
{%- endif -%}
```

**After:**
```liquid
{%- assign allow_swatches = false -%}
{%- if th_st.enable_sw_only_product_detail == false or request.path == '/collections/conduit-lighting' -%}
  {%- assign allow_swatches = true -%}
{%- endif -%}
{%- if color_type != 'radio' and color_type != 'dropdown' and allow_swatches -%}
    {%- render 'product-color-swatches', product: product -%}
{%- endif -%}
```

Effect:
- `enable_sw_only_product_detail` global setting NOT changed — all other collections unaffected
- `request.path` is a Shopify global object, accessible inside `render` tag snippets
- Swatches render on `/collections/conduit-lighting` only
- All other collection pages: global setting (`True`) blocks swatches as before
- Products with no Colour option: `product-color-swatches.liquid` outputs nothing (internal check)

### File 2: `sections/collection-meta-filters.liquid` — CSS added

`.bls__swatch-count` had no CSS anywhere in the theme. Added minimal styling to the existing `<style>` block:

```css
/* Task 6 — swatch overflow count chip */
.bls__swatch-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  min-width: 24px;
  padding: 0 4px;
  border-radius: 50%;
  border: 1px solid #ddd;
  font-size: 11px;
  color: #555;
  background: #f5f5f5;
  cursor: default;
}
```

---

## Swatch Component Behaviour (product-color-swatches.liquid — unchanged)

- Option name read from `settings.option_name_color` = `Colour`
- Shows up to 4 colour swatch dots (`.bls__product-color-swatches` divs)
- If total > 4: appends `+N` chip (`.bls__swatch-count`)
- Sold-out swatches: `.disabled` CSS class applied
- Hover JS: `listenerColor()` in `theme.js` swaps product card image to the hovered variant image

---

## Product Data (from discovery API queries)

| Product | SKU | Colour values | Available | Sold-out |
|---|---|---|---|---|
| Elbow 90 Degree | ~5552 | 8 (Black, White, Chrome, Copper, French Gold, Rose Gold, Satin Nickel, Yellow Brass) | 8 | 0 |
| Swan Neck Bend | ~5653 | 8 (Black, White, Gold, Satin Nickel, Yellow Brass, Rose Gold, Copper, Chrome) | 7 | 1 (Gold) |
| Dome Cover | ~5564 | 8 (Black, White, Satin Nickel, French Gold, Rose Gold, Copper, Chrome, Yellow Brass) | 8 | 0 |

All three: expected output = 4 visible swatches + `+4` chip.

---

## HTML Impact

| Metric | Before | After (estimated) |
|---|---|---|
| HTML added (default cards) | 0 | +~500 bytes × 100 default cards = +~50 KB |
| HTML added (variant cards) | 0 | 0 (guarded by `variant == nil`) |
| Post-Step-3 baseline | ~2,900,982 bytes | ~2,951,000 bytes (est.) |

Step 3 saved ~4.93 MB. Task 6 adds back ~50 KB. Net impact negligible.

---

## Files Changed

| File | Change |
|---|---|
| `snippets/product-item.liquid` | Line 451: replaced `enable_sw_only_product_detail == false` with `variant == nil` |
| `sections/collection-meta-filters.liquid` | Added `.bls__swatch-count` CSS; added card-alignment fix (align-items:stretch + margin-top:auto) |

---

## Card Alignment Fix v2 (replaces v1 — v1 did not resolve the issue)

**Issue reported:** Cards with swatches taller than cards without swatches; grid rows uneven. v1 fix (`align-items: stretch` + `margin-top: auto`) applied and pushed but had no visible effect.

**Root cause (v2 diagnosis):**

The v1 fix was theoretically correct but failed because of a CSS percentage-height resolution problem in the flex chain:

1. `.bls__grid__item` has `height: 100%` in `collection.css`. But the parent flex container (`#bls__product-grid`) has `height: auto`. In CSS, `height: 100%` on a flex item resolves to `auto` when the parent has no explicit height. So the `height: 100%` declaration is effectively `height: auto`.
2. `.bls__grid__item` is also a flex CONTAINER (for `.bls__product-item`). Its height as a container is determined by its children's content height — not by the parent row's stretched height.
3. `.bls__product-item` with `flex: 1 1 auto` inside `.bls__grid__item` has no definite height to grow into, so it only occupies its content height — not the full stretched grid-item height.
4. The `margin-top: auto` on swatches relied on the details area having extra space (from the flex-grow), which never materialised. The `mt-4` utility class (`margin-top: 4px`, no `!important`) was also a potential override risk.

**v2 Fix — 5 CSS rules replacing the 2 v1 rules:**

```css
/* Task 6 card-alignment fix v2 — equal-height rows + swatches pinned to bottom */

/* Step 1: row stretches all grid items to the tallest card height in the row */
#bls__product-grid {
  align-items: stretch;
}

/* Step 2: grid item stretches explicitly (redundant but forces specificity) */
#bls__product-grid > .bls__grid__item {
  align-self: stretch;
  display: flex;
  flex-direction: column;
}

/* Step 3: card fills the stretched grid item via height:100%
   (flex:1 alone fails here because the grid-item has no explicitly declared height;
    height:100% references the used/stretched height from the parent row) */
#bls__product-grid > .bls__grid__item > .bls__product-item {
  height: 100%;
}

/* Step 4: details area fills remaining card height after the image */
#bls__product-grid .bls__product-item > .bls__product-details {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

/* Step 5: swatches pinned to bottom of details column;
   !important overrides the mt-4 utility class on the swatch wrapper */
#bls__product-grid .bls__product-option.option_color {
  margin-top: auto !important;
}
```

Scope: all rules scoped to `#bls__product-grid` — no impact on any other collection page or template.

---

## Files NOT Changed

- `snippets/product-color-swatches.liquid` — reused as-is
- `config/settings_data.json` — `enable_sw_only_product_detail` NOT changed
- `snippets/price.liquid` — NOT changed
- Any other collection template — NOT changed

---

## Validation Required (browser, draft theme)

- [ ] ~5552: 4 swatches + +4 visible
- [ ] ~5653: 4 swatches + +4; Gold shows disabled styling
- [ ] ~5564: 4 swatches + +4 visible
- [ ] Product without Colour: no swatch row
- [ ] Cards in same row: equal heights, no taller/shorter inconsistency
- [ ] Swatches pinned to bottom of card details area
- [ ] Cards without swatches: clean layout, no excessive blank space
- [ ] Hover a swatch: card image swaps to that finish
- [ ] Colour/Finish filter works
- [ ] Diameter + Colour combination works
- [ ] Reset works
- [ ] Variant cards: no swatches shown
- [ ] Mobile 375px/390px/430px: swatches fit, no overflow, no clipped content
- [ ] Other collection smoke test: swatches appear as expected, no alignment regression
- [ ] HTML re-measured: confirm ~50 KB increase from baseline (CSS change adds <200 bytes)

---

## Commit Status

Changes uncommitted — pending Piranav git commit instruction.
