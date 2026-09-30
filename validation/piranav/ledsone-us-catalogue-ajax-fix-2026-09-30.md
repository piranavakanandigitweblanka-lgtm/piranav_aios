# Validation: LEDSone US Catalogue AJAX Fix — 2026-09-30

## Files Validated (Pre-Deploy)

| File | Check | Result |
|---|---|---|
| `assets/catalogue-page.js` | `_currentHandle` used in `renderUrl` patch (not DOM attr) | PASS |
| `assets/catalogue-page.js` | URL format: `?view=catalogue&section_id=catalogue-product-grid` | PASS |
| `assets/catalogue-page.js` | Fallback path does not hard-use `/pages/...` pathname | PASS |
| `sections/catalogue-navigation.liquid` | Menu handle = `catalogue-navigation` (matches live Shopify nav) | PASS |
| `sections/catalogue-product-zone.liquid` | Preloads `collection.css` and `product.css` before zone div | PASS |
| `templates/collection.catalogue.json` | Section key `catalogue-product-grid` maps to `main-collection-product` | PASS |
| `assets/collection.js` | Not modified | PASS |
| `sections/main-collection-product.liquid` | Not modified | PASS |

## Logic Trace (Manual)

### Scenario: Initial page load
1. `CataloguePageShopify.init()` runs
2. `_patchRenderUrl()` overrides `BlsEventCollectionShopify.renderUrl` — uses `_currentHandle` closure
3. `_resolveInitialHandle()` → first nav link handle
4. `_loadCollection('fabric-electrical-cable', false)`
5. `_currentHandle = 'fabric-electrical-cable'`
6. Fetch: `/collections/fabric-electrical-cable?view=catalogue&section_id=catalogue-product-grid`
7. Shopify renders only the `catalogue-product-grid` section from `collection.catalogue.json`
8. Response: section HTML with `data-section-id="catalogue-product-grid"`
9. Section injected into `#catalogue-product-zone` ✓
10. `BlsEventCollectionShopify.init()` called — event listeners attached ✓

### Scenario: User applies sort filter
1. `facetFiltersSort` click → `renderUrl('sort_by=price-ascending')`
2. Patched `renderUrl` → `_currentHandle = 'fabric-electrical-cable'` ✓
3. Returns: `/collections/fabric-electrical-cable?view=catalogue&section_id=catalogue-product-grid&sort_by=price-ascending`
4. `renderSectionFilter` fetches this URL → section-only response ✓
5. Section replaced in DOM → new section has no `data-catalogue-handle` (expected, no longer needed) ✓
6. `BlsEventCollectionShopify.init()` re-called in `.finally()` ✓

### Scenario: User applies second filter action
1. Same as above — `_currentHandle` still `'fabric-electrical-cable'` ✓
2. No DOM lookup needed → no breakage ✓

### Scenario: User clicks different collection tab
1. `_bindNavClicks` handler fires
2. `_loadCollection('vintage-bulbs', true)`
3. `_currentHandle = 'vintage-bulbs'`
4. Fetch: `/collections/vintage-bulbs?view=catalogue&section_id=catalogue-product-grid`
5. New section injected ✓
6. `_pushCatalogueUrl('vintage-bulbs')` → browser URL: `/pages/all-product-catalogue?collection=vintage-bulbs` ✓

## Pre-Deploy Checklist

- [x] `collection.js` NOT modified
- [x] `main-collection-product.liquid` NOT modified
- [x] No new collection/filter/product-grid logic created (existing Umino reused)
- [x] `catalogue-navigation.liquid` menu handle fixed
- [x] `catalogue-product-zone.liquid` CSS preloads in place
- [x] `catalogue-page.js` uses closure variable for handle

## Post-Deploy Validation (to complete after Shopify CLI push)

- [ ] `/pages/all-product-catalogue` loads without JS errors
- [ ] Collection tabs visible (navigation section renders links)
- [ ] First collection loads correctly (200, products visible, styled)
- [ ] Apply sort — verify no 404, correct products shown
- [ ] Apply second sort/filter — verify handle not lost
- [ ] Switch collection tab — products change correctly
- [ ] Browser URL stays on `/pages/all-product-catalogue?collection=<handle>` throughout

## Status

PRE-DEPLOY PASS — ready for `shopify theme push`
