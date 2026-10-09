# Tutorial — Theme Customization

**Status:** DRAFT — All Liquid, CSS, and JavaScript examples require review by Sajeesan before team rollout
**Sheet:** Theme Customization (BGCT workbook, Sheet 4)
**Tasks covered:** TC-1 through TC-6
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## Prerequisites

- Shopify Admin access with Online Store → Themes permissions
- A duplicate/backup theme created before any edits
- Chrome DevTools for viewport testing
- Basic familiarity with Shopify Liquid syntax

---

## TC-1 — Liquid Template Edits

### Step 1: Create a backup theme
1. Shopify Admin → **Online Store → Themes**.
2. Find your current live theme → click **Actions → Duplicate**.
3. Rename the duplicate: `[YYYY-MM-DD]-edit-[task-name]` (e.g., `2026-10-09-edit-footer-links`).
4. All edits are made on this duplicate. The live theme is only updated by publishing the tested duplicate.

### Step 2: Replace `{% include %}` with `{% render %}`
Find any instance of `{% include 'snippet-name' %}` in the codebase and replace with:
```liquid
{% render 'snippet-name' %}
```
Note: `{% render %}` does not inherit the parent template's variables. If the snippet needs a variable, pass it explicitly:
```liquid
{% render 'price-badge', product: product %}
```

### Step 3: Move inline styles to CSS files
If you find Liquid code like:
```html
<div style="margin-top: 20px; color: #333;">
```
Replace with a class:
```html
<div class="product-meta-row">
```
Then add the CSS in `assets/custom.css`:
```css
.product-meta-row {
  margin-top: 20px;
  color: #333;
}
```

### Step 4: Separate logic from HTML
Group all Liquid logic at the top of the template:
```liquid
{%- assign show_badge = false -%}
{%- if product.tags contains 'sale' -%}
  {%- assign show_badge = true -%}
{%- endif -%}

{%- capture product_badge -%}
  {%- if show_badge -%}<span class="sale-badge">Sale</span>{%- endif -%}
{%- endcapture -%}

<!-- HTML section below — logic is already resolved -->
<div class="product-card">
  {{ product_badge }}
  ...
</div>
```

---

## TC-2 — Custom Sections

### Minimal custom section template
```liquid
{% comment %} sections/my-custom-banner.liquid {% endcomment %}
<div class="custom-banner" style="padding-top: {{ section.settings.padding_top }}px; padding-bottom: {{ section.settings.padding_bottom }}px;">
  <h2>{{ section.settings.heading }}</h2>
  <p>{{ section.settings.body_text }}</p>
  {%- if section.settings.image != blank -%}
    {{ section.settings.image | image_url: width: 1200 | image_tag }}
  {%- endif -%}
  {%- if section.settings.button_label != blank -%}
    <a href="{{ section.settings.button_url }}" class="button button--primary">{{ section.settings.button_label }}</a>
  {%- endif -%}
</div>

{% schema %}
{
  "name": "Custom Banner",
  "settings": [
    { "type": "text", "id": "heading", "label": "Heading", "default": "Welcome" },
    { "type": "richtext", "id": "body_text", "label": "Body text" },
    { "type": "image_picker", "id": "image", "label": "Background image" },
    { "type": "text", "id": "button_label", "label": "Button label" },
    { "type": "url", "id": "button_url", "label": "Button link" },
    { "type": "range", "id": "padding_top", "min": 0, "max": 100, "step": 4, "unit": "px", "label": "Padding top", "default": 40 },
    { "type": "range", "id": "padding_bottom", "min": 0, "max": 100, "step": 4, "unit": "px", "label": "Padding bottom", "default": 40 }
  ],
  "presets": [
    { "name": "Custom Banner" }
  ]
}
{% endschema %}
```

---

## TC-3 — Custom Blocks

### Custom section with blocks
```liquid
{% comment %} sections/feature-icons.liquid {% endcomment %}
<div class="feature-icons">
  {%- for block in section.blocks -%}
    <div class="feature-icon-item" {{ block.shopify_attributes }}>
      {%- if block.settings.icon != blank -%}
        {{ block.settings.icon | image_url: width: 80 | image_tag }}
      {%- endif -%}
      <h3>{{ block.settings.title }}</h3>
      <p>{{ block.settings.description }}</p>
    </div>
  {%- else -%}
    <p class="placeholder-text">Add blocks to display feature icons.</p>
  {%- endfor -%}
</div>

{% schema %}
{
  "name": "Feature Icons",
  "max_blocks": 6,
  "blocks": [
    {
      "type": "feature",
      "name": "Feature",
      "settings": [
        { "type": "image_picker", "id": "icon", "label": "Icon" },
        { "type": "text", "id": "title", "label": "Title", "default": "Feature title" },
        { "type": "text", "id": "description", "label": "Description" }
      ]
    },
    { "type": "@app" }
  ],
  "presets": [
    {
      "name": "Feature Icons",
      "blocks": [
        { "type": "feature" },
        { "type": "feature" }
      ]
    }
  ]
}
{% endschema %}
```

---

## TC-4 — Navigation Menu Restructuring

### Step 1: Review current navigation structure
1. Shopify Admin → **Online Store → Navigation → Main menu**.
2. Count top-level items. If more than 7, identify which can be consolidated or moved to a secondary menu.
3. Check Analytics → what are the top 3 revenue-generating collections? Ensure these appear in positions 1–3.

### Step 2: Restructure menu items
1. Drag and drop menu items to reorder in the Navigation admin panel.
2. Move low-traffic items into a sub-menu (nested under a relevant top-level parent).
3. Click **Save**.

### Step 3: Verify mobile accordion behaviour
1. Open store in Chrome DevTools at 375px.
2. Click the hamburger menu icon.
3. Tap a top-level item that has a dropdown.
4. The dropdown should expand as an accordion on tap.
5. If it does not respond to tap (hover-only CSS), escalate to Sajeesan for JavaScript fix.

---

## TC-5 — Footer Redesigns

### Step 1: Add legal policy links via Shopify Navigation
1. Admin → **Online Store → Navigation → Footer menu**.
2. Ensure the following items exist and link to the correct Shopify policy pages:
   - Privacy Policy → `/policies/privacy-policy`
   - Terms of Service → `/policies/terms-of-service`
   - Refund Policy → `/policies/refund-policy`
3. Click **Save**.

### Step 2: Update footer newsletter copy via Theme Customizer
1. Admin → **Online Store → Themes → Customize**.
2. Scroll to the footer section → click on the Email Signup or Newsletter block.
3. Update the heading to a value proposition: "Get 10% off your first order"
4. Update the button label: "Claim my discount"
5. Click **Save**.

---

## TC-6 — Header Redesigns

### Step 1: Test header at both viewport sizes
1. Open Chrome DevTools (F12).
2. Toggle device toolbar (Ctrl+Shift+M).
3. Test at 375px (mobile) and disable device toolbar for 1440px (desktop).
4. At 375px: confirm logo, hamburger, and cart icon are all visible and not overlapping.
5. At 1440px: confirm header height is proportionate (≤ 80px).

### Step 2: Verify and fix cart badge count
1. Add a product to the cart.
2. Check the cart badge in the header — it should show `1`.
3. Add another product — it should show `2`.
4. If the count is not updating dynamically, the JavaScript AJAX cart update is broken — escalate to Sajeesan.

### Step 3: Add border to header via custom CSS
If the header has no visual separator from the content below:
1. Edit Code → find `base.css` or `header.css`.
2. Add:
```css
.header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
```

### Step 4: Reduce sticky header height on scroll (developer task)
```javascript
window.addEventListener('scroll', function () {
  const header = document.querySelector('.header');
  if (window.scrollY > 80) {
    header.classList.add('header--scrolled');
  } else {
    header.classList.remove('header--scrolled');
  }
});
```
```css
.header--scrolled {
  padding-top: 8px;
  padding-bottom: 8px;
  transition: padding 0.3s ease;
}
```

---

## DO's and DON'Ts

| DO | DON'T |
|---|---|
| DO: Duplicate live theme before every code change. | DON'T: Edit the live theme directly. |
| DO: Use `{% render %}` for all snippet calls. | DON'T: Use deprecated `{% include %}`. |
| DO: Expose all section content as schema settings. | DON'T: Hardcode copy, images, or prices in Liquid templates. |
| DO: Include `{{ block.shopify_attributes }}` on every block wrapper. | DON'T: Create block sections without a `max_blocks` limit. |
| DO: Put bestselling categories in nav positions 1–3. | DON'T: Bury high-revenue categories in deep dropdown levels. |
| DO: Include all three legal policy links in the footer. | DON'T: Use "Subscribe" as the only newsletter CTA copy. |
| DO: Keep header height ≤ 80px and test on 375px and 1440px. | DON'T: Remove the cart badge count from the header. |
