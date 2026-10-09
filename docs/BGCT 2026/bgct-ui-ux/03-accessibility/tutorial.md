# Tutorial — Accessibility

**Status:** DRAFT — HTML/Liquid code examples require review by Sajeesan before team rollout
**Sheet:** Accessibility (BGCT workbook, Sheet 3)
**Tasks covered:** ACC-1 through ACC-4
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## Prerequisites

- Chrome browser with DevTools (F12)
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- WAVE accessibility tool: https://wave.webaim.org/
- Shopify Admin access
- A duplicate/draft theme for code edits

---

## ACC-1 — Color Contrast Fixes

### Step 1: Check contrast with WebAIM Contrast Checker
1. Open https://webaim.org/resources/contrastchecker/
2. In Chrome DevTools, open the product page.
3. Inspect the primary "Add to Cart" button → note the background colour hex (e.g., `#005eb8`) and text colour (e.g., `#ffffff`).
4. Enter both hex codes into WebAIM Contrast Checker.
5. Result must show ≥ 4.5:1 for "Normal Text".

### Step 2: If contrast fails — darken the button colour
1. Admin → **Online Store → Themes → Customize → Theme Settings → Colors**.
2. Select **"Primary button background"**.
3. Darken the colour (lower the lightness value in HSL) until the WebAIM checker shows ≥ 4.5:1 with white text.
4. Click **Save**. Re-test.

### Step 3: Fix hero text over background image
1. In the Theme Editor → Hero section → find the overlay or image overlay opacity setting.
2. Increase overlay opacity until white text is legible.
3. If no overlay setting exists: add CSS to the hero section (developer task):
```css
.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}
```

---

## ACC-2 — Keyboard Navigation

### Step 1: Test keyboard navigation manually
1. Open your store in Chrome.
2. Put the mouse aside completely.
3. Press **Tab** to move forward through interactive elements.
4. Press **Shift+Tab** to move backwards.
5. Press **Enter** to activate buttons/links.
6. Press **Space** to activate checkboxes and toggle buttons.
7. Press **Escape** to close modals and drawers.
8. Document each element where focus is invisible or the keyboard gets trapped.

### Step 2: Fix invisible focus states via CSS
If `:focus` ring has been removed somewhere in the CSS, find and restore it:

1. In Edit Code → find `base.css` or `global.css`.
2. Search for `outline: none` or `outline: 0`.
3. For each instance, replace with a custom visible outline:
```css
:focus-visible {
  outline: 3px solid #005eb8;
  outline-offset: 2px;
  border-radius: 2px;
}
```
4. Do not remove `outline: none` from `:focus` without adding `:focus-visible` instead.

### Step 3: Add "Skip to content" link
1. In Edit Code → open `layout/theme.liquid`.
2. As the **very first element inside `<body>`**, add:
```html
<a href="#MainContent" class="skip-to-content-link" tabindex="0">
  Skip to main content
</a>
```
3. Add CSS to hide it but show on focus:
```css
.skip-to-content-link {
  position: absolute;
  top: -999px;
  left: 0;
  padding: 8px 16px;
  background: #fff;
  color: #000;
  z-index: 10000;
}
.skip-to-content-link:focus {
  top: 0;
}
```
4. Ensure your main content area has `id="MainContent"`.

---

## ACC-3 — ARIA Label Improvements

### Add aria-label to cart icon in header
1. In Edit Code → open `sections/header.liquid` (or equivalent).
2. Find the cart anchor/button element. It should look like:
```html
<a href="/cart" class="header__icon header__icon--cart">
  {% render 'icon-cart' %}
</a>
```
3. Add `aria-label`:
```html
<a href="/cart" class="header__icon header__icon--cart" aria-label="View cart, {{ cart.item_count }} items">
  {% render 'icon-cart' %}
</a>
```

### Add aria-label to search icon
```html
<button type="button" class="header__icon header__icon--search" aria-label="Search">
  {% render 'icon-search' %}
</button>
```

### Add aria-hidden to decorative icons
```html
<!-- Decorative icon: screen reader should skip -->
<svg aria-hidden="true" focusable="false">...</svg>
```

### Add aria-expanded to accordion toggle
```html
<button class="accordion__toggle" aria-expanded="false" aria-controls="accordion-content-1">
  FAQ Question Here
</button>
<div id="accordion-content-1" hidden>
  Answer here
</div>
```
In JavaScript: toggle `aria-expanded="true"/"false"` and `hidden` attribute together.

---

## ACC-4 — Microsoft Clarity Setup

### Step 1: Install the official Shopify app
1. Shopify Admin → **Apps → App Store** → search "Microsoft Clarity".
2. Install the **official Microsoft Clarity app** by Microsoft.
3. Connect to your Clarity project or create a new one.
4. The app handles checkout tracking automatically.

### Step 2: Verify checkout tracking
1. Complete a test purchase on the store.
2. In Clarity dashboard → **Recordings** → find the most recent session.
3. Watch the recording — confirm the checkout and order confirmation pages are captured.

### Step 3: Analyse rage clicks on cart and checkout
1. Clarity dashboard → **Heatmaps**.
2. Select the **Cart** page.
3. Switch to **Rage click** heatmap.
4. Identify any elements that are receiving frustrated repeated clicks.
5. Open the session recordings filtered to sessions with rage clicks on that element.
6. Identify the UX cause and document it as an evidence note.

---

## DO's and DON'Ts

| DO | DON'T |
|---|---|
| DO: Use dark grey (#333) instead of pure black for body text. | DON'T: Put thin white text on a busy, un-darkened hero image. |
| DO: Use native `<button>` and `<a>` tags for focusable elements. | DON'T: Use `outline: none` on focus states without a replacement. |
| DO: Use `aria-hidden="true"` on decorative icons. | DON'T: Add `aria-label` to text links that already have descriptive text. |
| DO: Install Clarity via the official Shopify app. | DON'T: Enable Clarity session recordings without confirming GDPR/cookie consent compliance. |
