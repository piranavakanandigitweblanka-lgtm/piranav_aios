# Prompt — Shopify PDP Gallery Navigation: Debug and Fix Click Logic

**Category:** implementation
**Pattern name:** `shopify-pdp-gallery-nav-fix`
**First used:** 2026-07-01
**Task it solved:** ELEC-PDP-GAL-001 (click fix phase)

---

## When to use this prompt

Use when Previous/Next navigation buttons exist on a Shopify PDP gallery but clicking them does nothing — the main image does not change. Applies after `shopify-pdp-gallery-nav-add` has been run and the visual buttons are present but non-functional.

---

## Prompt Template

```
Fix the existing product main gallery Previous/Next buttons.

Problem:
Buttons were added visually, but clicking Next/Previous does not switch the main product image.

Scope:
Work only inside the existing product gallery code.
Do not create a new gallery.
Do not replace the thumbnail slider.
Do not change product form, variant logic, cart, price, or checkout.

First inspect:
- sections/main-product.liquid
- snippets/product-media-gallery.liquid
- snippets/product-media.liquid
- assets/product-media-gallery.js
- assets/global.js
- assets/theme.js
- any file controlling thumbnail click / media change

Find:
1. Which existing JS function changes the active main media.
2. Which thumbnail click event already works.
3. Which data attributes identify media ID or index.
4. Why the new buttons are not triggering the same logic.

Implementation requirement:
Make the Previous/Next buttons trigger the same existing media-change logic used by thumbnails.

Preferred method:
When user clicks Next:
- detect current active media
- calculate next media index
- trigger click on the matching thumbnail OR call the existing gallery function

When user clicks Previous:
- detect current active media
- calculate previous media index
- trigger click on the matching thumbnail OR call the existing gallery function

Rules:
- Must loop correctly or disable at first/last image.
- Must update active thumbnail.
- Must work after variant image changes.
- Must work on desktop and mobile.
- Must not duplicate gallery state.
- Must not create hidden separate slider logic.

Validation:
| Check | Result | Evidence |
|---|---|---|
| Next button changes main image | PASS/FAIL | |
| Previous button changes main image | PASS/FAIL | |
| Thumbnail active state updates | PASS/FAIL | |
| Variant image switching still works | PASS/FAIL | |
| Mobile works | PASS/FAIL | |
| Files modified | List | |

Pass rule:
PASS only if clicking Next/Previous changes the existing main product image and keeps thumbnail state synchronized.

Stop if:
Existing gallery function is unclear, or fixing requires replacing the product gallery.
```

---

## Root cause found in first use (Dawn-based theme)

The `navigateOverlay()` function filtered slides by `clientWidth > 0`. On desktop with thumbnail layout, the CSS rule `.product--thumbnail .product__media-item:not(.is-active) { display: none }` makes all non-active slides have `clientWidth = 0`. The filter returned only the single active slide → navigation index had length 1 → `targetIndex >= length` → early return every time.

**Fix:** Replace `clientWidth` filter with `getNavigableIds()` that reads the thumbnail strip `[data-target]` list — always present, never hidden by active/inactive CSS, correctly ordered, exact match with viewer `data-media-id`.

```js
getNavigableIds() {
  if (this.elements.thumbnails) {
    return Array.from(this.elements.thumbnails.querySelectorAll('[data-target]'))
      .map(el => el.dataset.target);
  }
  return Array.from(this.elements.viewer.querySelectorAll('[data-media-id]'))
    .map(el => el.dataset.mediaId);
}
```

---

## Evidence file

`evidence/shopify/electricalsone/pdp-gallery-nav/2026-07-01_pdp_gallery_nav_closure.md`
