# Theekshy Req1 — Product Name Fix Implementation
**Date:** 2026-07-16 | **File:** Staff-requirements/pages/theekshy.html | **Type:** Bug Fix

---

## Root Cause

`PRODUCTS[]` JS array had `title:null` for 58/60 rows. `renderProdTable()` had:
```js
var nameCell = p.title ? p.title : '<span ...>ID: ' + p.pid + '</span>';
```
No SKU intermediate fallback. Jumped from null title to Product ID display.

---

## Changes Made

### 1. Added `PROD_META` lookup object (before `var filteredProds=[]`)

- 60 entries keyed by product_item_id (pid)
- Fields: `{ptitle, sku, url, variant}`
- Source: `listings.shopify_listings` (site='UK', channel='LEDSone') + parent join on shopify_handle
- Queried: 2026-07-16

Entry types:
- **20 parent-level products:** ptitle = verified Shopify product title (internal `~NNNN` refs stripped)
- **4 child products with parent join:** ptitle = parent title (internal refs stripped), variant appended at render
- **36 child products, parent join null:** ptitle=null, title derived at runtime from URL handle via `r1HandleToTitle()`

### 2. Added helper functions (before `var filteredProds=[]`)

```js
r1HandleToTitle(url)         // Converts Shopify URL handle → display title
r1ProductTitle(pid)          // Returns full display title: ptitle || handle-derived || null
r1NameCell(p)               // Returns Product Name column HTML with title+sku secondary
```

Display priority in `r1NameCell()`:
1. `ptitle` or handle-derived title → shown as clickable link to product URL; SKU shown below as monospace secondary text
2. `sku` only → shown as primary with Product ID below in muted text
3. Neither → `"ID: {pid}"` in muted italic (final fallback — 0 products hit this)

### 3. Updated `renderProdTable()` line

```js
// Before:
var nameCell = p.title ? p.title : '<span ...>ID: ' + p.pid + '</span>';

// After:
var nameCell = r1NameCell(p);
```

### 4. Updated `applyProdFilters()` search

Search now matches against: Product ID, product title (r1ProductTitle), AND SKU — previously only matched pid and title (which was null).

### 5. Updated Req1 validation box

Changed WARN "Product titles partially available" → PASS "Product titles resolved (2026-07-16)" with coverage details.
