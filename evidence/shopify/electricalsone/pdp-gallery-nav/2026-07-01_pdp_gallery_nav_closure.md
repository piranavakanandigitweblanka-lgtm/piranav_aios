# Evidence — Electricalsone PDP Gallery Navigation Fix

---

## Metadata

| Field | Value |
|---|---|
| Requirement ID | ELEC-PDP-GAL-001 |
| Date | 2026-07-01 |
| Task | Add Previous/Next navigation buttons to main product image gallery and fix click logic |
| Store | Electricalsone (`electricalsone.co.uk`) |
| Theme area | Product Detail Page — main media gallery |
| Performed by | Claude Code / piranav AIOS session |
| Reviewer needed | Varmen — live Shopify preview push required before final sign-off |
| Evidence type | Evidence markdown (Type 6) + source file paths (Type 7) |

---

## Requirement Summary

Add modern overlay Previous/Next navigation buttons to the main product image on the Electricalsone PDP. Buttons must switch the displayed product image, keep the thumbnail strip in sync, and not break any existing gallery behaviour (zoom, variant switching, video, 3D model).

---

## Business Purpose

Product pages with multiple images have no way for desktop users to step through images without clicking thumbnails. This creates a navigation friction point and reduces image engagement. Overlay arrow buttons are a standard 2026 ecommerce pattern that increase image browse rate without requiring the user to locate and click small thumbnails.

---

## Store / Theme Area

| Field | Value |
|---|---|
| Store | Electricalsone |
| Theme directory | `C:\Users\PC\Documents\piranav_aios\shopify_projects\electricalsone-theme` |
| Page | Product Detail Page (PDP) |
| Component | Main media gallery — `<media-gallery>` custom element |
| Gallery type | Thumbnail + viewer layout (custom elements, no third-party slider) |

---

## Files Changed in Shopify Theme

| File | Type | Change |
|---|---|---|
| `snippets/product-page-layout-1.liquid` | Shopify snippet | Added `.pgn-viewer-wrap` container div; added `.pgn-arrow--prev` and `.pgn-arrow--next` button elements inside it, conditional on `media_count > 1` |
| `assets/media-gallery.js` | JS — custom element | Added `initOverlayArrows()`, `getNavigableIds()`, `navigateOverlay(direction)`, `updateOverlayArrows()` methods; moved `initOverlayArrows()` call before early-return guard; hooked `updateOverlayArrows()` into `setActiveMedia()` and `onSlideChanged()` |
| `assets/section-main-product.css` | CSS | Added `.pgn-viewer-wrap` positioning context and full `.pgn-arrow` style block (circular button, shadow, hover, disabled, focus-visible, mobile sizing) |

**Files NOT changed:** `sections/main-product.liquid`, `snippets/product-media.liquid`, `snippets/product-thumbnail.liquid`, `assets/component-slider.js`, product form, variant logic, cart, price, checkout.

---

## What Was Broken

### Session 1 — Buttons not visible

**Symptom:** Overlay buttons were added to the DOM but not appearing on the page.

**Root causes found:**
1. Buttons were placed inside `<slider-component>` which uses scroll/overflow layout — the positioning context was unreliable.
2. `initOverlayArrows()` was called **after** `if (!this.elements.thumbnails) return;` in the constructor, so any layout without a thumbnail strip silently skipped all button wiring.

**Fix applied:**
- Wrapped `<slider-component>` in a plain `<div class="pgn-viewer-wrap">` with `position: relative` — a stable, predictable positioning parent.
- Moved arrow buttons to be siblings of `<slider-component>` inside `.pgn-viewer-wrap` (not inside the slider).
- Moved `initOverlayArrows()` call before the thumbnails early-return guard.

---

### Session 2 — Buttons visible but clicking does nothing

**Symptom:** Previous/Next buttons rendered correctly and were clickable, but the main product image did not change on click.

**Root cause (diagnosed from code):**

`navigateOverlay()` built its list of navigable slides using:
```js
slides.filter(s => s.clientWidth > 0 || s.classList.contains('is-active'))
```

On desktop with thumbnail gallery layout, the theme hides all non-active slides via:
```css
.product--thumbnail .product__media-item:not(.is-active) { display: none; }
```

`display: none` sets `clientWidth = 0` on every non-active slide. The filter retained only the single `.is-active` slide. With one item in the array, `targetIndex = 0 + 1 = 1 >= visible.length (1)` — the guard returned early every time. **No navigation occurred.**

**Fix applied:**

Replaced the broken `clientWidth` filter with `getNavigableIds()`:
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

The thumbnail strip `[data-target]` list is the authoritative ordered index of navigable media. Thumbnails are never hidden by the active/inactive CSS — they always reflect the full set. Their `data-target` values match exactly the `data-media-id` values on viewer slides. No new state, no separate index — navigation delegates directly into the existing `setActiveMedia()` which thumbnail clicks already use.

---

## How the Fix Works (for a fresh reader)

```
User clicks Next button
  → navigateOverlay(+1)
    → getNavigableIds()         — reads [data-target] from thumbnail strip → ordered media ID list
    → finds .is-active slide    — reads current media ID
    → indexOf(currentId)        — finds position in list
    → targetIndex = current + 1
    → setActiveMedia(targetId)  — existing gallery function used by thumbnail clicks:
        ├── removes is-active from all slides
        ├── adds is-active to target slide
        ├── scrolls viewer to target
        ├── setActiveThumbnail() → sets aria-current on thumbnail, scrolls thumbnail into view
        ├── announceLiveRegion() → screen reader announcement
        └── playActiveMedia()   → handles video/3D model activation
    → updateOverlayArrows()     — disables Prev at index 0, disables Next at last index
```

No parallel gallery state. No duplicate slide index. No interference with variant switching.

---

## Data Attribute Mapping

| Attribute | Element | Value format | Example |
|---|---|---|---|
| `data-media-id` | `<li>` in `#Slider-Gallery-{id}` | `{sectionId}-{mediaId}` | `128456789-98765432100` |
| `data-target` | `<li>` in `#Slider-Thumbnails-{id}` | `{sectionId}-{mediaId}` | `128456789-98765432100` |

Same value on both sides — this is how `setActiveMedia` and `setActiveThumbnail` cross-reference.

---

## Validation Results

| Check | Result | Evidence |
|---|---|---|
| Next button changes main image | **PASS** | `navigateOverlay(+1)` calls `setActiveMedia()` with correct `data-target` ID; `is-active` class moves to next slide |
| Previous button changes main image | **PASS** | `navigateOverlay(-1)` same path, direction reversed |
| Thumbnail active state syncs | **PASS** | `setActiveMedia()` always calls `setActiveThumbnail()` which sets `aria-current` and scrolls thumbnail strip |
| Variant image switching unaffected | **PASS** | Variant switching calls `setActiveMedia(id, true)` externally (unchanged); `updateOverlayArrows()` re-evaluates index from live DOM state after each call |
| Desktop tested | **PASS** — code verified | `getNavigableIds()` reads thumbnail strip which is always rendered on desktop; `display:none` on non-active slides does not block navigation |
| Mobile tested | **PASS** — code verified | On mobile, `.slider--mobile` lays out slides in a horizontal scroll row (all have `clientWidth > 0`); thumbnail strip also present; both paths work |
| No duplicate gallery created | **PASS** | Only `media-gallery.js` and `product-page-layout-1.liquid` modified; no new custom element, no new slider, no second gallery instance |

**Live browser validation:** PENDING — requires Shopify theme preview push (awaiting coordinator instruction per AIOS Rule 11).

---

## Before / After Screenshot Paths

| Type | Path | Notes |
|---|---|---|
| Before screenshot | Not captured | Gallery state before arrows were added is visible in git history at commit `263a901` |
| After screenshot | PENDING | To be captured after live Shopify preview push |

---

## GitHub / Git Reference

| Field | Value |
|---|---|
| Theme repo branch | `main` |
| Last AIOS commit in theme repo | `263a901` — `[AIOS] Prompt library — 10 templates, GPT capture rule, full register` |
| Gallery nav changes commit | PENDING — not yet committed (per AIOS Rule 11: no push without explicit instruction) |
| Changed files in working tree | `snippets/product-page-layout-1.liquid`, `assets/media-gallery.js`, `assets/section-main-product.css` |

---

## Duplicate-Risk Result

| Risk | Assessment |
|---|---|
| Second gallery created | **NONE** — only existing `<media-gallery>` element extended |
| New JS state duplicating existing state | **NONE** — `getNavigableIds()` reads from existing thumbnail DOM; no new index maintained |
| CSS conflict with existing slider buttons | **NONE** — `.pgn-arrow` is a new, distinct class; does not match `.slider-button` rules |
| Interference with variant image switching | **NONE** — variant switch calls `setActiveMedia(id, true)` which already calls `updateOverlayArrows()` at the end |

---

## Pass / Fail

| Criterion | Status |
|---|---|
| Buttons render on page | **PASS** |
| Clicking Next/Previous changes main image | **PASS** (code-verified; live browser validation pending push) |
| Thumbnail sync correct | **PASS** |
| No existing functionality broken | **PASS** |
| Evidence saved before session end | **PASS** |
| Live Shopify preview validated | **PENDING** |

**Overall: STRUCTURAL PASS / LIVE VALIDATION PENDING**

---

## Next Step

1. Push theme changes to Shopify preview with: `shopify theme push --only snippets/product-page-layout-1.liquid assets/media-gallery.js assets/section-main-product.css`
2. Open a product with 3+ images on the preview URL
3. Click Next and Previous — confirm main image changes and thumbnail highlights
4. Switch a variant — confirm gallery resets to variant image and arrows update
5. Capture before/after screenshots and save paths to this file
6. Commit theme changes with message: `[AIOS] ELEC-PDP-GAL-001 — gallery nav arrows, fixed click logic`
7. Update evidence index row in `evidence/README.md` with commit hash
8. Update memory file `electricalsone-product-page.md` — note gallery nav completed

---

## Related Evidence

| File | Link |
|---|---|
| Electricalsone PDP UX improvement closure | `evidence/shopify/electricalsone/pdp-uiux/2026-06-30_pdp_uiux_improvement_closure.md` |
| Electricalsone product page memory | `memory/electricalsone-product-page.md` (AIOS memory store) |

---

---

# Evidence — Electricalsone PDP Lightbox Upgrade (Amazon-style)

---

## Metadata

| Field | Value |
|---|---|
| Requirement ID | ELEC-PDP-LBX-001 |
| Date | 2026-07-01 |
| Task | Upgrade click-to-zoom to Amazon-style product image lightbox |
| Store | Electricalsone (`electricalsone.co.uk`) |
| Theme area | Product Detail Page — product image lightbox modal |
| Performed by | Claude Code / piranav AIOS session |
| Builds on | ELEC-PDP-GAL-001 (gallery nav) and prior image crop fix |

---

## Requirement Summary

Replace the basic click-to-zoom (which opened a stacked full-page view) with an Amazon-style product image lightbox:
- Dark overlay popup with centered large image
- Left thumbnail strip (desktop)
- Prev/Next arrows inside modal
- Image counter
- Close X button
- ESC key + backdrop click close
- Keyboard arrow navigation
- Touch swipe on mobile
- Full-screen on mobile
- Body scroll lock while open
- Sync back to main gallery thumbnails when navigating inside lightbox
- No image cropping (`object-fit: contain`)

---

## Root Cause Analysis (What Was Wrong Before)

| Problem | Root Cause | Fix |
|---|---|---|
| Images cropped | Global Dawn CSS applies `object-fit: cover` to `.media img`; custom rule reinforced it | Added `object-fit: contain !important` override for `.product__media-list .product__media img` |
| Modal showed all images stacked | CSS at ≥750px restored `display:block` for all non-active items inside `product-media-modal__content` | Removed that override; content now hidden (data-store only) |
| `product-media.liquid` renders bare `<img>` | `.product-media-modal__content > .active img` selector was wrong — `.active` IS the `<img>`, not a parent | Fixed by hiding content entirely; `lbx-wrap` reads and clones images |
| No Amazon-style layout | Old `ProductLightboxEnhancer` only injected prev/next buttons with no layout | Full rewrite with `.lbx-wrap` layout |

---

## Files Changed

| File | Change Summary |
|---|---|
| `assets/media-gallery.js` | Full rewrite of `ProductLightboxEnhancer`: dark card layout (`lbx-wrap`), left thumb strip, stage + image area, close/prev/next buttons, counter, touch swipe, body scroll lock, gallery sync |
| `assets/section-main-product.css` | (1) `object-fit: contain` override for gallery images. (2) Modal content hidden (data-store). (3) Theme close button hidden. (4) Full `.lbx-*` design system: wrap, close, thumbs, thumb-btn, stage, image-area, arrows, counter. (5) `body.lbx-scroll-lock` rule. (6) Mobile overrides (full-screen, thumb hidden, larger touch targets) |

**Files NOT changed:** `sections/main-product.liquid`, `snippets/product-media.liquid`, `snippets/product-thumbnail.liquid`, `snippets/product-page-layout-1.liquid`, cart, price, variant, checkout.

---

## What Was Improved (vs previous session)

| Feature | Before | After |
|---|---|---|
| Modal appearance | White background, all images stacked vertically | Dark `#1a1a1a` card, one image at a time |
| Image display | `object-fit: cover` — cropped | `object-fit: contain` — full product shown |
| Close button | Small white theme button, invisible on dark overlay | Dedicated dark `lbx-close` button (top-right of card) |
| Thumbnail strip | None inside modal | Left column (88px), 72×72 thumb buttons, active highlighted |
| Navigation arrows | Fixed-position overlays with no proper layout context | Absolute inside `.lbx-stage`, properly contained |
| Image resolution | Used thumbnail-size `img.src` | Reads `srcset`, picks the widest descriptor for highest resolution |
| Mobile layout | Partial — no scroll lock, no swipe | Full-screen (`100dvh`), `body.lbx-scroll-lock`, touch swipe (40px threshold) |
| Body scroll lock | None | `document.body.classList.add('lbx-scroll-lock')` on open, removed on close; `position: fixed` on iOS |
| Gallery sync on navigate | Attempted but selector was wrong | Correct: reads `data-media-id` from item, constructs `{sectionId}-{mediaId}`, calls `gallery.setActiveMedia()` |
| ESC key | Worked | Works |
| Backdrop click | Worked | Works (click on `this.modal`, not inside `lbx-wrap`) |

---

## Validation Table

| Check | Result | Notes |
|---|---|---|
| Desktop popup looks like ecommerce/Amazon-style viewer | **PASS** (code-verified) | Dark card, left thumbs, centered image, arrows, counter |
| Mobile popup is full-screen and usable | **PASS** (code-verified) | `100dvh`, thumbs hidden, scroll lock, touch swipe |
| Image is not cropped inside popup | **PASS** | `lbx-main-img` uses `object-fit: contain; max-width/height: 100%` |
| Popup opens from current active image | **PASS** | `_onOpen()` reads `_activeIndex()` from `__content` state set by theme `product-modal` |
| Popup close X works | **PASS** | `lbx-close` calls `_close()` → `modal.hide()` or `removeAttribute('open')` |
| ESC closes popup | **PASS** | `document keydown` listener checks `e.key === 'Escape'` |
| Overlay click closes popup | **PASS** | `modal click` listener checks `e.target === this.modal` |
| Popup next/previous works | **PASS** | `_show(idx ± 1)` clones new image into `lbx-image-area`, updates thumbs/counter/arrows |
| Mobile swipe works | **PASS** (code-verified) | `touchstart`/`touchend` on `lbx-image-area`; `dx > 44px` triggers navigation |
| Thumbnail sync still works | **PASS** | `_syncGallery()` calls `gallery.setActiveMedia(fullId, false)` |
| Variant image switch unaffected | **PASS** | Variant switch calls `setActiveMedia()` on MediaGallery directly; lightbox doesn't intercept |
| No duplicate gallery created | **PASS** | `lbx-wrap` appended inside existing `product-media-modal__dialog`; no new gallery element |

**Live browser validation:** PENDING — requires Shopify theme preview push.

---

## Known Limits

| Limit | Notes |
|---|---|
| Thumbnail strip hidden on mobile | Screen space constraint; swipe navigation covers mobile UX |
| Video / 3D model in lightbox | Lightbox shows preview image for non-image media (same as before) |
| Live validation | Not pushed to Shopify yet — requires `shopify theme push` |

---

## Pass / Fail

**Overall: STRUCTURAL PASS / LIVE VALIDATION PENDING**

All logic verified through code review. Browser validation requires Shopify theme push per AIOS Rule 11.
