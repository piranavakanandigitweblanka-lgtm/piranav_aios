# Evidence: LEDSone US Catalogue UI Fix — 2026-09-30

## Task
Fix broken collection UI after AJAX injection on `/pages/all-product-catalogue`.
Products loaded but sort/filter controls appeared open/broken, product grid was pushed down.

## Working Directory
`C:\Users\PC\Downloads\led us`

---

## Discovery

### Files Inspected
- `assets/catalogue-page.js`
- `sections/catalogue-product-zone.liquid`
- `sections/catalogue-navigation.liquid`
- `sections/main-collection-product.liquid`
- `snippets/collection-toolbar.liquid`
- `snippets/collection-sidebar.liquid`
- `assets/collection.js`
- `assets/collection.css`
- `snippets/scripts-tag.liquid`
- `layout/theme.liquid`
- `templates/page.all-product-catalogue.json`
- `templates/collection.catalogue.json`

### Key Architecture Found

**`scripts-tag.liquid` (rendered at bottom of `theme.liquid`):**
```liquid
{%- assign t = template | split: '.' | first -%}
{%- case t -%}
  {%- when 'collection' -%}
    <script src="{{ 'collection.js' | asset_url }}" defer="defer"></script>
  {%- when 'search' -%}
    <script src="{{ 'collection.js' | asset_url }}" defer="defer"></script>
{%- endcase -%}
```
`collection.js` is **only loaded on collection and search templates**. Not on `page` template.

**`collection.css` and `product.css`:**
Loaded only by `main-collection-product.liquid` section header tags. Not loaded globally.

**`.select-custom .select__select` (in `collection.css` line 1038–1063):**
```css
.select-custom .select__select {
  opacity: 0;
  visibility: hidden;  /* closed by default */
}
.select-custom.actived .select__select {
  opacity: 1;
  visibility: visible; /* opened by JS toggling .actived */
}
```
Without `collection.css`, the sort dropdown is always visible (no CSS to hide it).

---

## Root Causes

### Root Cause 1 — `collection.js` not loaded on page template
The catalogue page uses `template = 'page'`. `scripts-tag.liquid` conditional only loads `collection.js` for `template = 'collection'` and `template = 'search'`.

**Consequence:** `BlsEventCollectionShopify` is undefined. The `renderUrl` patch in `catalogue-page.js` exits immediately (`if (typeof BlsEventCollectionShopify === 'undefined') return`). No filter/sort/pagination JS ever binds to the injected section HTML. Filter sidebar and sort controls render into the DOM but have no event handlers.

### Root Cause 2 — `collection.css` / `product.css` not loaded on page template
`catalogue-product-zone.liquid` only loaded `catalogue-page.js`. Neither `collection.css` nor `product.css` were included.

**Consequence:** 
- Sort dropdown default closed state (`visibility: hidden`) absent → always shown open
- Filter sidebar layout CSS absent → sidebar displays vertically/incorrectly
- Product grid CSS absent → grid pushed down / unstyled

### Root Cause 3 — `_patchRenderUrl` used DOM attribute instead of closure variable
`catalogue-page.js _patchRenderUrl` read `section.dataset.catalogueHandle` to get current handle. `renderSectionFilter` in `collection.js` replaces the entire `.section-collection-product` DOM node on every filter/sort. The replacement node has no `data-catalogue-handle`. After first filter action, `handle` = undefined → fallback URL → 404.

---

## Fix Applied

### Fix 1: `sections/catalogue-product-zone.liquid`
Added before `catalogue-page.js`:
```liquid
{{ 'collection.css' | asset_url | stylesheet_tag }}
{{ 'product.css' | asset_url | stylesheet_tag }}
<script src="{{ 'collection.js' | asset_url }}"></script>
```

**Why this works:**
- All three are inline (synchronous) scripts/tags, executing before DOMContentLoaded
- `collection.js` loads first → defines `BlsEventCollectionShopify`, calls `.init()` (no section in DOM yet, safe — all querySelectorAll return empty)
- `catalogue-page.js` loads next → `CataloguePageShopify` registered, waits for DOMContentLoaded
- DOMContentLoaded fires → `CataloguePageShopify.init()` runs → `BlsEventCollectionShopify` is defined → patch applies ✓

### Fix 2: `assets/catalogue-page.js` — `_patchRenderUrl`
Changed from reading DOM attribute to reading closure variable:

```js
// BEFORE (broken)
var handle = section && section.dataset.catalogueHandle;
var sectionId = section && section.dataset.sectionId;
if (handle && sectionId) {
  return '/collections/' + handle + '?view=catalogue&' + searchParams;
}
// handle lost after first renderSectionFilter replaces section node

// AFTER (fixed)
if (_currentHandle) {
  return '/collections/' + _currentHandle + '?view=catalogue&' + searchParams;
}
// _currentHandle is module-level, set by _loadCollection, never lost
```

### Fix 3: `assets/catalogue-page.js` — `_loadCollection` comment
Removed misleading comment "Do not re-initialize BlsEventCollectionShopify here". Replaced with correct explanation. The code correctly calls `BlsEventCollectionShopify.init()` after injection to bind events on the new DOM.

---

## Files Modified

| File | Change |
|---|---|
| `sections/catalogue-product-zone.liquid` | Added `collection.css`, `product.css`, `collection.js` before `catalogue-page.js` |
| `assets/catalogue-page.js` | Fixed `_patchRenderUrl` to use `_currentHandle` closure variable |
| `assets/catalogue-page.js` | Fixed misleading comment in `_loadCollection` |

## Files NOT Modified (Reused as-is)
- `assets/collection.js` — Umino source of truth
- `sections/main-collection-product.liquid` — Umino source of truth
- `snippets/collection-toolbar.liquid` — Umino source of truth
- `snippets/collection-sidebar.liquid` — Umino source of truth
- All product card snippets — Umino source of truth
- `templates/collection.catalogue.json` — no change

## Architecture Decision
REUSE/EXTEND — no new product-grid, filter, or sort logic created.
All collection functionality remains the Umino implementation.
Only the integration layer (asset loading + renderUrl patch) was corrected.

---

## Validation

### Pre-Deploy Logic Trace

**Page load:**
1. `collection.css`, `product.css` loaded → sort dropdown closed by default ✓
2. `collection.js` loaded → `BlsEventCollectionShopify` defined ✓
3. `catalogue-page.js` loaded → registers DOMContentLoaded
4. DOMContentLoaded: `CataloguePageShopify.init()` → patches `renderUrl` ✓
5. `_loadCollection('bulb', false)` → fetches `/collections/bulb?view=catalogue`
6. Section injected → `BlsEventCollectionShopify.init()` → binds filter/sort/pagination events ✓

**Sort action:**
1. User clicks sort → `facetFiltersSort` handler → `renderUrl('sort_by=price-asc')`
2. Patched `renderUrl` → `_currentHandle = 'bulb'` ✓ → `/collections/bulb?view=catalogue&sort_by=price-asc`
3. `renderSectionFilter` fetches, replaces section, re-inits ✓

**Second sort action (was 404 before fix):**
1. `renderUrl` → `_currentHandle = 'bulb'` still set ✓ → correct URL ✓

**Collection switch:**
1. `_loadCollection('fabric-cable', true)` → `_currentHandle = 'fabric-cable'` ✓
2. New section injected, events re-bound ✓

### Post-Deploy Checklist (to complete after Shopify CLI push)
- [ ] Sort dropdown displays closed on initial load
- [ ] Filter sidebar displays correctly (not open/vertical)
- [ ] Product grid correct desktop layout
- [ ] Product grid correct mobile layout
- [ ] Filter open/close works
- [ ] Sort selection triggers AJAX update
- [ ] Second sort/filter works (no 404)
- [ ] Collection tab switch works
- [ ] Infinite scroll/pagination works
- [ ] Browser URL stays on `/pages/all-product-catalogue`
- [ ] No console errors

## Status
PRE-DEPLOY PASS — files ready for `shopify theme push`
