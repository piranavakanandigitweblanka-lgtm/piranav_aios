# Best Practice — Performance (Core Web Vitals)

**Status:** DRAFT
**Sheet:** Performance (Core Web Vitals) (BGCT workbook, Sheet 3)
**Tasks covered:** CWV-1 through CWV-8
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx` · Google Search Central · Shopify Engineering Blog
**Last updated:** 2026-10-09

---

## CWV-1 — Page Speed Audits: LCP (Largest Contentful Paint)

### What it is
LCP measures how long it takes for the largest visible content element on screen — typically the hero image or main product image — to fully render. It is one of Google's three Core Web Vitals.

### Recommended approach
LCP must be under 2.5 seconds for a "Good" rating. Identify the LCP element using PageSpeed Insights or Chrome DevTools. Compress the LCP image. Serve it from Shopify's CDN in WebP format. Apply `fetchpriority="high"` and `loading="eager"` to the LCP image tag. Never lazy-load the LCP element.

### Why it matters
LCP is a confirmed Google ranking signal since the Page Experience update. A slow LCP directly reduces rankings for competitive queries and increases bounce rate.

### Shopify-specific considerations
- Shopify's CDN automatically serves images in WebP when the browser supports it, via the `image_url` filter with `format: 'webp'`.
- In hero section Liquid: `{{ section.settings.image | image_url: width: 1500 | image_tag: loading: 'eager', fetchpriority: 'high' }}`
- Shopify's `image_tag` filter automatically outputs correct `width` and `height` attributes, preventing CLS caused by image dimensions unknown at load time.
- Avoid JavaScript-driven sliders or carousels as the first visual element — they render late and always cause LCP failures.

### Exceptions and trade-offs
- On mobile, the LCP element may be different from desktop (e.g., a product image vs a hero banner). Measure both.
- Preloading the LCP image in `<head>` can further improve LCP but requires the exact image URL to be known at render time.

### Authoritative references
- https://web.dev/articles/lcp
- https://help.shopify.com/en/manual/online-store/web-performance/improving-web-performance

---

## CWV-2 — Page Speed Audits: CLS (Cumulative Layout Shift)

### What it is
CLS measures visual instability — how much the page layout shifts after initial render. Common causes: images without defined dimensions, web fonts loading late (FOUT), promotional banners injected after load.

### Recommended approach
CLS must be under 0.1 for a "Good" rating. Always define explicit `width` and `height` attributes on all `<img>` tags. Preload web fonts. Reserve space for any content injected by apps (chat widgets, review widgets, promo bars).

### Shopify-specific considerations
- Shopify's `image_tag` filter outputs correct `width` and `height` automatically.
- For custom `<img>` HTML in Liquid: always include `width` and `height` attributes.
- App-injected content (chat bubbles, cookie banners, review carousels) is a frequent CLS source. Use `min-height` CSS to reserve space before they load.
- Promo announcement bars injected at the top of the page by apps push all content down — a major CLS source. Set them to a fixed height in CSS.

### Authoritative references
- https://web.dev/articles/cls
- https://www.corewebvitals.io/core-web-vitals/shopify-guide

---

## CWV-3 — Page Speed Audits: INP (Interaction to Next Paint)

### What it is
INP measures responsiveness — how quickly the page visually responds after a user interaction (click, tap, keyboard input). INP replaced FID (First Input Delay) as a Core Web Vital in March 2024. Target: under 200ms.

### Recommended approach
INP must be under 200 milliseconds for a "Good" rating. Minimise JavaScript execution on the main thread. Move analytics, chat widgets, and marketing scripts to load after the page is interactive. Use Shopify's Customer Events (Web Pixels) for marketing tracking instead of inline `<script>` tags.

### Shopify-specific considerations
- Heavy Shopify apps that add JavaScript to every page (upsell popups, loyalty widgets, live chat) are the primary INP cause on Shopify stores.
- Defer non-critical scripts using Google Tag Manager's "Window Loaded" trigger.
- Use Shopify's Web Pixels API for marketing tracking — these run in a separate worker context and do not block the main thread.

### Authoritative references
- https://web.dev/articles/inp
- https://shopify.engineering/core-web-vitals

---

## CWV-4 — Image Compression

### What it is
Image compression reduces file size without significant visual quality loss. Oversized images are one of the most common and most impactful performance issues on e-commerce stores.

### Recommended approach
Compress all images before uploading to Shopify. Keep banner images under 300KB. Keep product images under 150KB. Save photographs as JPEG. Save flat graphics, logos, and icons as SVG or PNG. Never upload raw DSLR files (typically 10–30MB) directly to Shopify.

### Shopify-specific considerations
- Shopify automatically converts uploaded images to WebP and serves them from its CDN. However, it does not reduce the original file dimensions — a 6000×4000px image uploaded at 25MB will still generate a large WebP.
- Compress and resize images to their approximate display dimensions before uploading. A product image displayed at 800×800px on the page does not need to be uploaded at 4000×4000px.
- Recommended tool: TinyPNG (https://tinypng.com) — supports PNG and JPEG batch compression online for free.

### Exceptions and trade-offs
- The 300KB/150KB targets are practical guidelines, not official Google thresholds. The real target is "as small as possible without visible quality loss at the display dimensions used."

---

## CWV-5 — Lazy Loading

### What it is
Lazy loading defers the download of off-screen images until the user scrolls near them. This reduces the initial page payload and improves LCP and Time to Interactive.

### Recommended approach
Apply `loading="lazy"` to all images that are below the initial viewport (below the fold). Never apply lazy loading to the LCP image — this causes LCP failures. Use native browser lazy loading (`loading="lazy"` attribute), not JavaScript lazy loading libraries.

### Shopify-specific considerations
- In Shopify Liquid: `{{ section.settings.image | image_url: width: 600 | image_tag: loading: 'lazy' }}`
- Apply `loading="eager"` or omit the attribute on hero/LCP images (see CWV-1).
- Product grid images in rows 2+ should use `loading="lazy"`. Row 1 (above the fold on desktop) should use `loading="eager"`.

### Authoritative references
- https://web.dev/articles/lazy-loading-images

---

## CWV-6 — Unused JS Removal

### What it is
When Shopify apps are uninstalled, their JavaScript snippet references often remain in `theme.liquid`. The browser still downloads and parses this code on every page load, wasting bandwidth and main-thread processing time.

### Recommended approach
After uninstalling any Shopify app, inspect `theme.liquid` for leftover `{% render 'app-name' %}` or `<script src="old-app.js">` tags and remove them. Use Chrome DevTools → Coverage tab to identify unused JavaScript files. Ask app developers for cleanup instructions before uninstalling.

### Shopify-specific considerations
- Never delete Shopify's core theme JS files (`global.js`, `theme.js`, `pubsub.js`). Only remove code from apps you have confirmed are no longer installed.
- Create a theme duplicate before making deletions — this acts as a rollback point.

---

## CWV-7 — Unused CSS Removal

### What it is
CSS files containing rules for page elements that do not exist consume download time and slow CSS parsing. In older Shopify themes, a single `theme.css` file may contain styles for every section, even sections not used on a given page.

### Recommended approach
Use per-section CSS loading: load each section's CSS file from within the section Liquid file itself rather than from a global stylesheet. This is the OS 2.0 standard. Minify custom CSS before deploying.

### Shopify-specific considerations
- In OS 2.0 themes: `{{ 'component-name.css' | asset_url | stylesheet_tag }}` inside the section Liquid ensures the CSS only loads when that section is on the page.
- Avoid loading all CSS globally in `theme.liquid` if section-level loading is feasible.
- Do not use `!important` excessively — it signals specificity conflicts and leads to CSS bloat.

---

## CWV-8 — Third-party Scripts

### What it is
Third-party scripts (Hotjar, Klaviyo, TikTok Pixel, Meta Pixel, live chat widgets, loyalty apps) add external HTTP requests and JavaScript execution to every page. Individually they appear small; combined they are frequently the largest performance drain on a Shopify store.

### Recommended approach
Audit all active third-party scripts. For each, ask: "Is this generating revenue or operational value that justifies its speed cost?" Load marketing scripts via Google Tag Manager using the "Window Loaded" trigger, not as inline `<script>` tags in `<head>`. Delay chat widget initialisation until the user interacts (scrolls or clicks).

### Shopify-specific considerations
- Shopify's Customer Events (Web Pixels API) runs tracking scripts in a sandboxed iframe, isolated from the main page thread. Migrate tracking from inline scripts to Web Pixels where possible.
- Review apps in the Shopify App Store for their known performance impact using tools like BuiltWith or GTmetrix before installing.

### Authoritative references
- https://web.dev/articles/optimizing-content-efficiency-loading-third-party-javascript
