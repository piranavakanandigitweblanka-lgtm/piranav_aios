---
name: ledsone-us-catalogue-debug-fix
category: shopify
created: 2026-09-30
status: active
---

# Prompt: Shopify One-Page Catalogue — AJAX Debug and Fix

## Purpose

Debug and fix issues in a Shopify one-page product catalogue where collection sections are loaded via AJAX into a page template. Covers 404 errors, broken filter/sort after section replacement, and missing CSS in injected content.

## When to Use

Use this prompt when:
- An AJAX-rendered Shopify section returns 404 despite the section existing in a collection template
- Filters/sort stop working after the first action on an AJAX-injected Shopify collection section
- Injected Shopify section content appears unstyled

## Context

- Theme: Umino v2.8.0 (Blueskytechco), JS namespace: `BlsEventCollectionShopify`
- Page: `/pages/all-product-catalogue` — Shopify `page` template with custom zone section
- Collection section fetched via AJAX using Shopify Section Rendering API (`?section_id=`)
- Template: `collection.catalogue.json` with section key `catalogue-product-grid`
- Filter/sort driven by `BlsEventCollectionShopify.renderUrl` + `renderSectionFilter` in `collection.js`

## The Three Root Causes to Check

### 1. Missing `?view=<suffix>` on section fetch URL

Shopify section rendering API (`?section_id=<key>`) looks for the section key in the template the collection is currently using. If the collection's assigned template is the DEFAULT template (e.g. `collection.json`) and the target section key only exists in a DIFFERENT template (e.g. `collection.catalogue.json`), Shopify returns 404.

**Fix:** Add `?view=<template_suffix>` before `&section_id=<key>`. This forces Shopify to render the specified template regardless of what the collection has assigned.

```js
// Wrong — uses default collection template
var url = '/collections/' + handle + '?section_id=' + sectionId;

// Correct — forces catalogue template
var url = '/collections/' + handle + '?view=catalogue&section_id=' + sectionId;
```

### 2. DOM attribute lost after `renderSectionFilter` replaces section

Shopify's `renderSectionFilter` (in Umino's `collection.js`) replaces the entire `.section-collection-product` DOM node with a fresh server-rendered node on every filter/sort action. Any custom `data-*` attributes set on the original node are gone.

If a patched `renderUrl` function reads the collection handle from a DOM attribute (e.g. `section.dataset.catalogueHandle`), the handle becomes `undefined` after the first filter action.

**Fix:** Store the current collection handle in a module-level closure variable. The patch reads from the closure, not the DOM.

```js
// Wrong — DOM read, lost after renderSectionFilter replaces section
var handle = section && section.dataset.catalogueHandle;

// Correct — closure variable always current regardless of DOM state
if (_currentHandle) {
  return '/collections/' + _currentHandle + '?view=catalogue&section_id=' + sectionId + '&' + searchParams;
}
```

### 3. CSS missing from injected section

Shopify section HTML for `main-collection-product` includes `<link rel="stylesheet">` tags at the TOP of the output (before the section div). `DOMParser.parseFromString(html, 'text/html').querySelector('.section-collection-product')` extracts only the section div — the `<link>` tags land in the parsed document's `<head>` and are discarded.

**Fix:** Explicitly load the required CSS files in the zone section that hosts the AJAX content.

```liquid
{{ 'collection.css' | asset_url | stylesheet_tag }}
{{ 'product.css' | asset_url | stylesheet_tag }}
```

## Files Involved

| File | Role |
|---|---|
| `assets/catalogue-page.js` | AJAX loader, tab nav, `renderUrl` patch |
| `sections/catalogue-product-zone.liquid` | Zone container, CSS preload |
| `assets/collection.js` | Umino filter/sort/pagination engine (do NOT modify) |
| `sections/main-collection-product.liquid` | Collection section (do NOT modify) |
| `templates/collection.catalogue.json` | Target template with `catalogue-product-grid` section key |

## Validation Checklist After Fix

- [ ] `?view=<suffix>&section_id=<key>` format used in all AJAX URLs
- [ ] `renderUrl` patch uses closure variable, not DOM attribute
- [ ] CSS preload tags in zone section
- [ ] `collection.js` not modified
- [ ] First collection loads correctly (200, products visible, styled)
- [ ] Filter action after first load still works (no 404, correct products)
- [ ] Second filter action also works (handle not lost)
- [ ] Collection tab switch works
- [ ] Browser URL stays on `/pages/...` throughout
