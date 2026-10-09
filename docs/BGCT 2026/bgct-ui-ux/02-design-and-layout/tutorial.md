# Tutorial — Design & Layout

**Status:** DRAFT — CSS and Liquid code examples require review by Sajeesan before team rollout
**Sheet:** Design & Layout (BGCT workbook, Sheet 2)
**Tasks covered:** DL-1 through DL-8
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## Prerequisites

- Shopify Admin access with Online Store permissions
- Chrome DevTools (F12) for testing
- A duplicate/draft theme created before any code changes

---

## DL-1 — Homepage Layout Improvements

1. Shopify Admin → **Online Store → Themes → Customize**.
2. Click on the **Homepage** template.
3. Drag sections to reorder: Hero at top → Featured Collection → Trust Signals → Newsletter → Footer.
4. Click the hero section → disable any "Autoplay" or "Enable slideshow" option.
5. Set a single hero image and a single CTA button.
6. Add an "Image with Text" section: drag alternate text-left / image-right and text-right / image-left sections for visual interest on scroll.
7. Click **Save**. Test on mobile: confirm CTA is above the fold at 375px.

**Reference:** https://www.youtube.com/watch?v=YLeBuBmEMiI

---

## DL-2 — Collection Page Layout Improvements

### Enable filtering
1. In Theme Editor → select the **Collection template**.
2. Find the collection section settings → enable **"Enable filtering"** and **"Enable sorting"**.
3. In Shopify Admin → **Apps → Search & Discovery** → configure which filters appear (by type, colour, size, etc.).

### Set product grid columns
1. In the collection section settings, set **"Products per row"** to 4 (desktop) and 2 (mobile) if your theme exposes these settings.

### Enable product card hover image
1. In product card section settings, enable **"Show second image on hover"**.

**Reference:** https://www.fudge.ai/guides/how-to-add-sorting-options-to-a-shopify-collection-page/

---

## DL-3 — Product Page Layout Improvements

### Add collapsible content blocks below the buy box
1. In Theme Editor → **Product template** → scroll past the buy box.
2. Click **"Add block"** → **"Collapsible row"**.
3. Repeat for each section: "Shipping Info", "Materials", "Sizing Chart", "Returns".
4. Write the content for each block.
5. Click **Save**. Test on mobile: confirm content is collapsed by default.

### Verify image gallery is swipeable on mobile
1. Open Chrome DevTools → enable mobile emulation (375px).
2. Open a product page → attempt to swipe the image gallery.
3. If not swipeable, this requires developer CSS/JS fix — escalate to Sajeesan.

---

## DL-4 — Mobile Responsiveness Fixes

### Inspect with Chrome DevTools device emulation
1. Open Chrome → press **F12** (DevTools).
2. Click the **Toggle device toolbar** icon (phone/tablet icon) or press **Ctrl+Shift+M**.
3. Select a device from the dropdown (iPhone SE = 375px, iPhone 15 = 390px).
4. Navigate through the store: homepage, collection, product page.
5. Look for horizontal scrolling, small text, or tiny tap targets.

**Reference:** https://developer.chrome.com/docs/devtools/device-mode

### Fix horizontal scrolling via CSS (developer task)
```css
@media screen and (max-width: 749px) {
  /* Example: prevent a full-width banner from causing overflow */
  .banner-section {
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }
}
```

### Fix oversized padding on mobile product page
```css
@media screen and (max-width: 749px) {
  .product__info-wrapper {
    padding: 16px;
  }
}
```

---

## DL-5 — CTA Placement

### If Add to Cart is below the fold on mobile: reduce padding
1. In Edit Code → find `main-product.liquid` or the product info section file.
2. Locate the CSS controlling padding above the Add to Cart button.
3. Reduce padding on mobile using a media query (see DL-4 code example above).
4. Test: refresh product page at 390px — confirm Add to Cart is visible without scrolling.

### Add a sticky Add to Cart bar (developer task)
This requires custom CSS/JS or a theme that includes this natively. Escalate to developer if required.

---

## DL-6 — CTA Design

### Set primary button colour via Theme Settings
1. Admin → **Online Store → Themes → Customize → Theme Settings → Colors**.
2. Set **"Primary button background"** to your designated conversion colour.
3. Set **"Primary button text"** to a contrasting colour (typically white).
4. Click **Save**.

### Add hover effect to primary button (via custom CSS)
1. In Edit Code → find `base.css` or `custom.css`.
2. Add:
```css
.button--primary:hover,
.btn-primary:hover {
  filter: brightness(0.9);
  transform: scale(1.01);
  transition: all 0.2s ease;
}
```

**Reference:** https://community.shopify.com/t/how-can-i-change-the-button-color-on-hover/242136

---

## DL-7 — Typography Consistency

### Set fonts via Shopify Theme Settings
1. Admin → **Online Store → Themes → Customize → Theme Settings → Typography**.
2. Select heading font and body font from Shopify's font library (these are performance-optimised).
3. Do not add `@font-face` or hardcoded font-family declarations in CSS — use Shopify's CSS variables instead:
```css
/* Correct approach */
.custom-heading { font-family: var(--font-heading-family); }

/* Incorrect approach — creates inconsistency */
.custom-heading { font-family: 'Helvetica Neue', sans-serif; }
```

**Reference:** https://community.shopify.com/t/how-can-i-change-the-button-color-on-hover/242136

---

## DL-8 — Color Consistency

### Set up Color Schemes in OS 2.0
1. Admin → **Online Store → Themes → Customize → Theme Settings → Colors**.
2. Define your main palette: primary, secondary, background, text, and accent.
3. Create named "Color Schemes" (Dawn theme calls these "Color Schemes 1–6").
4. In each section of the homepage, set the Color Scheme to the appropriate scheme.
5. Click **Save**.

**Reference:** https://www.youtube.com/watch?v=ho46jkFGet8

---

## DO's and DON'Ts

| DO | DON'T |
|---|---|
| DO: Ensure hero text is legible with a background overlay. | DON'T: Use an automatic carousel slider in the hero section. |
| DO: Keep product images uniformly cropped. | DON'T: Show "Add to Cart" on the grid for complex multi-variant products. |
| DO: Include video or 3D in the product gallery where possible. | DON'T: Bury price or variant selectors below a large text block. |
| DO: Simplify the header to hamburger + cart on mobile. | DON'T: Rely on hover states to convey critical information. |
| DO: Implement a sticky "Add to Cart" bar on long product pages. | DON'T: Place secondary CTAs adjacent and equal in size to the primary. |
| DO: Use full-width buttons on mobile. | DON'T: Use outline style for the primary conversion button. |
| DO: Ensure adequate spacing between paragraphs. | DON'T: Use display/script fonts for body text or buttons. |
| DO: Reserve accent colour for conversion buttons only. | DON'T: Overwhelm users with many saturated, conflicting colours. |
