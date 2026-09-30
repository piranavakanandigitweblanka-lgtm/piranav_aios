# Evidence: LEDSone US Catalogue AJAX Fix — 2026-09-30

## Task
Inspect and fix the LEDSone US one-page product catalogue. The page loaded products on first visit but UI broke after filter/sort actions, producing 404 responses.

## Source Inspected
Theme export: `theme_export__ledsone-us-umino-2-8-0__30SEP2026-0213am`

---

## Root Cause Analysis

### Root Cause 1 — `renderUrl` patch reads DOM attribute that is destroyed by `renderSectionFilter`

**File:** `assets/catalogue-page.js` (live/theme-export version)

The `renderUrl` patch read `section.dataset.catalogueHandle` to get the current collection handle:

```js
// BROKEN (live theme)
var handle = section && section.dataset.catalogueHandle;
if (handle && sectionId) {
  return '/collections/' + handle + '?view=catalogue&' + searchParams;
}
// Fallback (broken):
return window.location.pathname + '?section_id=' + fallbackSectionId + '&' + searchParams;
```

`BlsEventCollectionShopify.renderSectionFilter` in `collection.js` (line 325-326) replaces the entire `.section-collection-product` DOM node with a fresh Shopify-rendered node after every filter/sort action:
```js
const newSection = new DOMParser().parseFromString(responseText, 'text/html').querySelector(options.section);
document.querySelector(options.section).replaceWith(newSection);
```

The replacement node is raw Shopify HTML — `data-catalogue-handle` is a custom attribute we set, not something Shopify renders. After the first filter/sort action, `handle` = `undefined`, `renderUrl` falls to the fallback path.

**Fallback URL produced:** `/pages/all-product-catalogue?section_id=catalogue-product-grid&sort_by=...`

This is a 404 because section key `catalogue-product-grid` exists in `collection.catalogue.json` but NOT in the page template `page.all-product-catalogue.json`.

### Root Cause 2 — `catalogue-navigation.liquid` referenced wrong Shopify navigation menu handle

**File:** `sections/catalogue-navigation.liquid` (local repo)

Local repo used `linklists['catalogue-nav']`. Live store's Shopify admin navigation menu is named `catalogue-navigation`. Wrong handle = no tabs rendered = the entire catalogue navigation would disappear after push.

### Root Cause 3 — `catalogue-product-zone.liquid` missing CSS preloads (pre-existing fix not deployed)

The live theme's `catalogue-product-zone.liquid` did not preload `collection.css` and `product.css`. These stylesheets are loaded by `main-collection-product.liquid` at the top of its output, but `DOMParser.parseFromString().querySelector('.section-collection-product')` only extracts the section div, dropping the `<link>` tags. Result: unstyled product grid on first load.

---

## Fix Applied

| File | Change | Decision |
|---|---|---|
| `assets/catalogue-page.js` | Already fixed in local repo — uses `_currentHandle` (module closure) instead of `section.dataset.catalogueHandle`. Also uses `?view=catalogue&section_id=catalogue-product-grid` for section-only fetch. | MODIFY — local version correct, deploy to store |
| `sections/catalogue-navigation.liquid` | Changed `linklists['catalogue-nav']` → `linklists['catalogue-navigation']` | MODIFY — corrects menu handle |
| `sections/catalogue-product-zone.liquid` | Already fixed in local repo — adds `collection.css` and `product.css` preloads | EXTEND — local version better, deploy to store |
| `templates/collection.catalogue.json` | Identical to theme export | REUSE — no change |
| `sections/main-collection-product.liquid` | Not modified | REUSE — Umino source of truth |
| `assets/collection.js` | Not modified | REUSE — Umino source of truth |

## Corrected `renderUrl` patch logic

```js
// CORRECT (local repo version)
BlsEventCollectionShopify.renderUrl = function (searchParams) {
  var section = document.querySelector('.section-collection-product');
  var sectionId = (section && section.dataset.sectionId) || CATALOGUE_SECTION_ID;

  if (_currentHandle) {
    return '/collections/' + _currentHandle + '?view=catalogue&section_id=' + sectionId + '&' + searchParams;
  }

  return window.location.pathname + '?section_id=' + sectionId + '&' + searchParams;
};
```

`_currentHandle` is set by `_loadCollection` and is module-scoped — it survives DOM replacements.

## AIOS Duplicate Check Result

- Prompt `ledsone-us-catalogue-debug-fix` already exists — REUSED (not duplicated)
- Evidence file `2026-09-30-catalogue-discovery.md` exists — separate file created for this fix session
- No duplicate truth created

## Deploy Status

Files ready to deploy via `shopify theme push` from `shopify_projects/ledsone us/`.

**Files to push:**
- `assets/catalogue-page.js`
- `sections/catalogue-navigation.liquid`
- `sections/catalogue-product-zone.liquid`
