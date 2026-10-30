# Prompt: Shopify banner-gallery.liquid — Fix 4 Compatibility Issues

**Category:** shopify / implementation
**Prompt ID:** shopify-banner-gallery-fix
**Created:** 2026-10-29
**Status:** ACTIVE

---

## Context

`sections/banner-gallery.liquid` was verified as having 4 confirmed failures. This prompt documents the fixes applied.

---

## Prompt

Fix the following 4 confirmed issues in `sections/banner-gallery.liquid`. Read-only verification was already completed. Apply only what is listed below.

**Fix 1 — Banner height CSS variables not applied (line 490–496)**

Change `.main-banner { height: auto; }` to use the CSS custom properties that are already set on the `<img>` via inline style:
```css
.main-banner {
  height: var(--desktop-height, 400px);
}
@media screen and (max-width: 768px) {
  .main-banner {
    height: var(--mobile-height, 300px);
  }
}
```

**Fix 2 — JavaScript not scoped to section instance**

Wrap the entire `<script>` block in an IIFE. Resolve the section container via `document.currentScript.closest('.shopify-section')`. Replace all `document.querySelector` / `document.querySelectorAll` calls with `sectionEl.querySelector` / `sectionEl.querySelectorAll`.

For the `handleBannerClick` function, add `sectionEl.contains(banner)` guard before processing.

**Fix 3 — Fade slider `setInterval` return value not stored**

Store the return value: `fadeInterval = setInterval(...)`. Declare `fadeInterval` at IIFE scope.

**Fix 4 — No Theme Editor lifecycle handlers**

Store named function references for all `addEventListener` calls so they can be removed:
- `updateProductsPerSetFn` (for `window.resize`)
- `handleBannerClickFn` (for `document.click`)
- `handleVisibilityChangeFn` (for `document.visibilitychange`)

Add a single `shopify:section:unload` handler at the bottom of the IIFE (outside all conditionals):
```js
document.addEventListener('shopify:section:unload', function (e) {
  if (e.target === sectionEl) {
    clearInterval(rotationInterval);
    clearInterval(fadeInterval);
    clearTimeout(rotationTimeout);
    if (updateProductsPerSetFn) window.removeEventListener('resize', updateProductsPerSetFn);
    if (handleBannerClickFn) document.removeEventListener('click', handleBannerClickFn);
    if (handleVisibilityChangeFn) document.removeEventListener('visibilitychange', handleVisibilityChangeFn);
  }
});
```

**Safety constraints:**
- Do not change Liquid markup, schema, or HTML
- Do not modify any other theme files
- Do not push to live theme — staging draft only
- Commit to git before any `shopify theme push`
