# Tutorial — Performance (Core Web Vitals)

**Status:** DRAFT — Liquid code examples require review by Sajeesan before team rollout
**Sheet:** Performance (Core Web Vitals) (BGCT workbook, Sheet 3)
**Tasks covered:** CWV-1 through CWV-8
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx`
**Last updated:** 2026-10-09

---

## Prerequisites

- Access to Shopify Admin (Theme Editor and Edit Code access)
- Google PageSpeed Insights: https://pagespeed.web.dev (no login required)
- Google Search Console access (for field data / CrUX metrics)
- Chrome browser with DevTools (F12)
- TinyPNG account for image compression: https://tinypng.com
- Google Tag Manager access (if applicable)

---

## CWV-1 — LCP: Fix the Largest Contentful Paint

### Step 1: Identify the LCP element
1. Open https://pagespeed.web.dev/
2. Enter your homepage or main product page URL.
3. Click **Analyze**.
4. In the results, scroll to **"Diagnostics"** → click **"Largest Contentful Paint element"**.
5. Note which element is identified (usually the hero image or product image).

### Step 2: Compress the LCP image
1. Download the current LCP image from Shopify (Admin → Files, or via DevTools → right-click image → Save as).
2. Go to https://tinypng.com and drag the image into the compressor.
3. Download the compressed version.
4. Re-upload to Shopify Admin → Products (for product images) or via Files for theme assets.

### Step 3: Apply eager loading and fetch priority in Liquid
In your hero section Liquid file (`sections/image-banner.liquid` or similar):
```liquid
{{- section.settings.image
  | image_url: width: 1500
  | image_tag:
    loading: 'eager',
    fetchpriority: 'high',
    width: 1500,
    height: 600,
    alt: section.settings.image_alt -}}
```

### Step 4: Re-test
1. After saving and publishing the theme, return to PageSpeed Insights.
2. Re-run the test. LCP should improve.
3. Save a screenshot comparing before and after scores as evidence.

---

## CWV-2 — CLS: Fix Cumulative Layout Shift

### Step 1: Identify the CLS source
1. Run PageSpeed Insights → note CLS score.
2. Open Chrome DevTools → **Performance** tab.
3. Click the record button, then reload the page.
4. Stop recording. In the timeline, look for **Layout Shift** events (shown in red).
5. Click on a layout shift event to see which element caused it.

### Step 2: Fix missing image dimensions in Liquid
For any image tag without dimensions, add them:
```liquid
{{- image | image_url: width: 800 | image_tag: width: 800, height: 600 -}}
```
Or for standard HTML:
```html
<img src="image.jpg" width="800" height="600" alt="description">
```

### Step 3: Reserve space for app widgets via CSS
For a chat widget or review carousel that loads late:
```css
.chat-widget-container {
  min-height: 60px; /* Reserve space before widget loads */
}
```

### Step 4: Preload web fonts (if applicable)
In `theme.liquid` `<head>` section:
```html
<link rel="preload" href="{{ 'your-font.woff2' | asset_url }}" as="font" type="font/woff2" crossorigin>
```

---

## CWV-3 — INP: Reduce Interaction Blocking

### Step 1: Move scripts to GTM with Window Loaded trigger
1. Log in to **Google Tag Manager**.
2. For each marketing/analytics tag (Meta Pixel, TikTok, Hotjar):
   - Edit the tag → Triggering → change trigger from **"Page View"** to **"Window Loaded"**.
3. Publish the GTM container.
4. Re-test PageSpeed Insights; check "Total Blocking Time" (TBT) — a reduction here corresponds to INP improvement.

### Step 2: Delay chat widget initialisation
Wrap the chat widget's init script in a scroll or interaction listener:
```html
<script>
window.addEventListener('scroll', function initChat() {
  // paste your chat widget init code here
  window.removeEventListener('scroll', initChat);
}, { once: true });
</script>
```

### Step 3: Use Shopify Web Pixels for tracking (recommended)
1. In Shopify Admin → Settings → Customer events.
2. Add a Web Pixel for your analytics platform (Meta Pixel, Google Analytics).
3. Remove the corresponding inline script from GTM or theme.liquid.
4. Web Pixels run in a sandboxed worker — they do not block the main thread.

---

## CWV-4 — Image Compression

### Steps

1. Download images you want to compress (from Shopify Admin → Files, or from the product page).
2. Go to **https://tinypng.com**.
3. Drag up to 20 images at a time into the upload area.
4. TinyPNG compresses them automatically (typically 50–80% file size reduction).
5. Click **"Download all"**.
6. Re-upload the compressed images to Shopify:
   - For product images: Admin → Products → click the product → drag new images into the Media section (or delete old and re-add).
   - For theme/banner images: Admin → Online Store → Themes → Customize → navigate to the section and replace the image.
7. After upload, verify the file size in Chrome DevTools → Network → Images → click the image → check the "Size" column.

### How to interpret results
- Banner < 300KB → acceptable.
- Product image < 150KB → acceptable.
- Any image > 500KB → must be recompressed before upload.

---

## CWV-5 — Lazy Loading

### Apply lazy loading to a section image in Liquid
```liquid
{{- section.settings.image
  | image_url: width: 600
  | image_tag:
    loading: 'lazy',
    width: 600,
    height: 400,
    alt: section.settings.image_alt -}}
```

### Apply loading="eager" to the hero/LCP image
```liquid
{{- section.settings.hero_image
  | image_url: width: 1500
  | image_tag:
    loading: 'eager',
    fetchpriority: 'high',
    width: 1500,
    height: 600 -}}
```

### Verify in browser
1. Open DevTools → **Network** tab → **Images**.
2. Reload the page.
3. Hero image should load immediately.
4. Scroll down; watch for additional images appearing in the Network tab as you scroll — this confirms lazy loading is working.

---

## CWV-6 — Unused JS Removal

### Steps

1. In Shopify Admin → **Online Store → Themes → your live theme → Edit Code**.
2. Open `layout/theme.liquid`.
3. Search for (Ctrl+F): `{% render '`, `<script src=`, `{% include '`
4. For each script or render tag found, verify the corresponding app is still installed:
   - Admin → Apps → check if the app name matches.
5. For any orphaned tag (app uninstalled): delete the render call or script tag from the file.
6. Save. Test the live site to confirm nothing is broken.
7. In Chrome DevTools → **Coverage** tab (open via More Tools → Coverage):
   - Click the reload button in the Coverage panel.
   - After page loads, look for JS files with a high % shown in red.
   - Files with >70% unused code are candidates for removal or deferral.

### Rollback
If removing a script breaks functionality, immediately restore from the theme duplicate you created before making changes.

---

## CWV-7 — Unused CSS Removal

### Implement per-section CSS loading (OS 2.0 pattern)
1. Open a section Liquid file in Edit Code (e.g., `sections/featured-collection.liquid`).
2. At the top of the file, add:
```liquid
{{ 'featured-collection.css' | asset_url | stylesheet_tag }}
```
3. This ensures the CSS only loads on pages where this section is active.
4. Move any CSS rules specific to this section from `base.css` or `theme.css` into `featured-collection.css`.

### Minify custom CSS
Before adding custom CSS to a theme file:
1. Paste the CSS into https://cssminifier.com/
2. Copy the minified output.
3. Add the minified version to the theme file.

---

## CWV-8 — Third-party Script Optimisation

### Delay a chat widget until user scrolls
```html
<script>
window.addEventListener('scroll', function loadChat() {
  // Replace this comment with the full chat widget initialisation code
  window.removeEventListener('scroll', loadChat);
}, { once: true });
</script>
```

### Audit third-party scripts with GTmetrix
1. Go to https://gtmetrix.com (free account).
2. Enter your store URL and run a test.
3. In the **Waterfall** tab, look for requests from external domains (e.g., `widget.gorgias.io`, `static.klaviyo.com`).
4. Note the load time and blocking time for each.
5. Any script adding >500ms blocking time is a priority optimisation candidate.

### Consolidate via Google Tag Manager
1. Ensure all tracking scripts are routed through GTM.
2. Open GTM → **Tags** → for each tag, edit the trigger.
3. Change triggers from **Page View** to **Window Loaded** for all non-critical tags.
4. Publish.

---

## DO's and DON'Ts

| DO | DON'T |
|---|---|
| DO: Serve images from Shopify's CDN in WebP format via `image_url`. | DON'T: Use a heavy JS carousel at the top of the page (hurts LCP). |
| DO: Set `min-height` on containers that receive app-injected content. | DON'T: Inject promo banners at the top of the DOM 3 seconds after load. |
| DO: Keep cart AJAX calls optimised and fast. | DON'T: Run complex visual animations tied to scroll events. |
| DO: Save photographs as JPEGs and flat graphics as SVGs. | DON'T: Upload 4000×4000px DSLR images directly to Shopify. |
| DO: Use native `loading="lazy"` attribute. | DON'T: Lazy-load the main hero or first product image. |
| DO: Ask app developers for cleanup instructions before uninstalling. | DON'T: Delete Shopify's core JS files (global.js, theme.js). |
| DO: Minify custom CSS before deploying. | DON'T: Use `!important` excessively. |
| DO: Use Google Tag Manager to consolidate tracking scripts. | DON'T: Place multiple non-critical `<script>` tags synchronously in `<head>`. |
