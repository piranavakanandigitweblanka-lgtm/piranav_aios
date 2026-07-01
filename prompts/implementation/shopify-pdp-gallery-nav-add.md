# Prompt — Shopify PDP Gallery Navigation: Add Previous/Next Buttons

**Category:** implementation
**Pattern name:** `shopify-pdp-gallery-nav-add`
**First used:** 2026-07-01
**Task it solved:** ELEC-PDP-GAL-001

---

## When to use this prompt

Use when a Shopify product page has a media gallery with thumbnails but no overlay Previous/Next navigation on the main image. Applies to any Dawn-based or custom-element-based Shopify theme using `<media-gallery>` and `<slider-component>`.

---

## Prompt Template

```
Role:
Senior Shopify Theme Developer & UI/UX Engineer.

Project
[STORE NAME] Shopify Theme
Working inside the existing product media gallery.

Objective
Upgrade the Product Detail Page gallery by adding Previous and Next navigation buttons directly on the main product image.

Do NOT replace the current gallery.
Extend the existing gallery only.

Before coding
Search first for the existing product gallery implementation.

Inspect:
- sections/main-product.liquid
- snippets/product-media-gallery.liquid
- snippets/product-media.liquid
- snippets/media-gallery.liquid
- assets/*.js
- assets/theme.js
- assets/global.js
- assets/product.js
- any slider library (Swiper, Flickity, Splide, Glide, Slick)

Determine:
• which gallery controls the active media
• how thumbnails change images
• how variant image switching works
• existing slider events
• media index handling

Output the findings before implementation.

Implementation
If arrows already exist: Improve them.
If arrows do not exist: Create modern overlay navigation.

Requirements

Desktop
• Left arrow vertically centered
• Right arrow vertically centered
• Floating circular buttons
• White background
• Soft shadow
• Hover animation
• 44px minimum click target

Mobile
• Same controls
• Proper spacing
• Touch friendly

Functionality
Previous button → show previous media
Next button → show next media

When image changes:
• active thumbnail updates
• zoom still works
• variant image logic still works
• videos still work
• 3D models still work

Buttons should hide when only one media exists.

Accessibility
Add aria-label="Previous image"
Add aria-label="Next image"
Keyboard support: Left Arrow / Right Arrow

Files
Modify only existing gallery files.
Do NOT create a second gallery.

Styling
Modern 2026 ecommerce style.
Smooth transition.

Evidence
Return:
- Files modified
- Screenshot before
- Screenshot after
- Validation

Validation:
- Desktop PASS
- Mobile PASS
- Variant switching PASS
- Thumbnail sync PASS
- Zoom PASS
- Video PASS
- Accessibility PASS

Pass rule:
PASS only if the main image has working Previous and Next buttons synchronized with the existing thumbnail gallery.
FAIL if a second gallery is created or existing functionality is broken.
```

---

## Key findings from first use (Dawn-based theme, no third-party slider)

- Gallery orchestrated by `<media-gallery>` custom element (`media-gallery.js`)
- `setActiveMedia(mediaId, prepend)` is the single correct function to call for any media switch
- Thumbnails use `[data-target]` attributes matching `[data-media-id]` on viewer slides
- **Critical:** On desktop, non-active slides have `display: none` → `clientWidth = 0` — do NOT filter by `clientWidth` to build navigation index; use thumbnail `[data-target]` list instead
- Position arrow buttons inside a plain `div.pgn-viewer-wrap` (not inside `<slider-component>`) for reliable `position: absolute` behaviour
- Call `initOverlayArrows()` BEFORE the `if (!this.elements.thumbnails) return` guard in the constructor

---

## Evidence file

`evidence/shopify/electricalsone/pdp-gallery-nav/2026-07-01_pdp_gallery_nav_closure.md`
