---
name: energy-label-collection-card-discovery-2026-10-30
description: Read-only discovery for adding EU Energy Label to product cards on one selected collection — ledsone_de. Architecture decision, AJAX safety finding, rendering chain traced.
metadata:
  type: evidence
  project: ledsone_de
  date: 2026-10-30
  status: DISCOVERY COMPLETE — AWAITING IMPLEMENTATION APPROVAL
---

# Evidence: Collection Product Card Energy Label Discovery — ledsone_de

**Date:** 2026-10-30
**Type:** Read-only discovery
**Files inspected:** 6 theme files + 1 JS asset
**No files modified.**

---

## Rendering Chain — Confirmed

```
templates/collection.json
  → sections/main-collection-product.liquid  (section id: "product-grid")
      → for product in collection.products
          → {%- render 'product-item', product: product -%}   ← line 175
                → bls__product-details (lines 523–697)
                    ← TARGET INSERTION POINT: after price block (line 553)
```

**Key facts:**
- Only `product` is passed to `product-item` — no `collection` parameter
- `collection` is a Shopify global Liquid object — accessible inside `{% render %}` without explicit passing
- `collection.metafields.custom.show_energy_label_on_cards` is accessible anywhere on a collection page

---

## product-item.liquid Call Sites — Full Inventory

`render 'product-item'` is called from **9 section files**:

| Section File | Context | `collection` available? |
|---|---|---|
| `main-collection-product.liquid` | Collection page grid | YES — global object |
| `main-search.liquid` | Search results | nil (no active collection) |
| `search-predictive-grid.liquid` | Predictive search overlay | nil |
| `product-recommendations.liquid` | PDP related products | nil |
| `products-recently-viewed.liquid` | Recently viewed section | nil |
| `page-recently-viewed.liquid` | Recently viewed page | nil |
| `page-wishlist.liquid` | Wishlist page | nil |
| `shop-the-look.liquid` | Shop the look section | nil |
| `horizontal-menu.liquid` | Mega menu | nil |

**Conclusion:** `collection` is only a meaningful global on the collection page itself. On all other pages, `collection` is nil. An explicit `show_label` parameter with nil/false default is safer and more predictable than reading `collection.metafields` inside `product-item.liquid` directly.

---

## Can energy-label.liquid Be Reused Directly on Cards?

**NO — three reasons:**

### Reason 1: CSS duplication
`energy-label.liquid` emits a `<style>` block of ~280 lines on every render call. A collection page with 24 products would emit 24 × 280 lines = 6,720 lines of duplicate CSS. The `el_styles_loaded` guard that was intended to prevent this was structurally broken (render scope isolation — confirmed in Phase 1 audit) and has been removed.

### Reason 2: JS duplication
`energy-label.liquid` emits a `<script>` IIFE of ~60 lines on every render call. 24 products = 24 IIFE executions, 24 separate `document.addEventListener('keydown', ...)` listeners, 24 modal initialisations. While functionally not broken (each IIFE is isolated by `product.id`), this is significant page weight and event listener accumulation.

### Reason 3: AJAX script execution failure (CRITICAL)
The collection page uses two AJAX patterns:

**Filter (renderSectionFilter, collection.js:316–340):**
```javascript
const newSection = new DOMParser().parseFromString(responseText, 'text/html').querySelector(options.section);
document.querySelector(options.section).replaceWith(newSection);
```
Scripts in DOMParser-parsed nodes do NOT execute when appended/replaced into the live DOM. This is a browser security spec constraint.

**Load-more / infinite scroll (loadMoreProducts, collection.js:373–398):**
```javascript
const productNodesHtml = productNodes.querySelectorAll('#bls__product-grid .bls__grid__item');
productNodesHtml.forEach(prodNode => document.getElementById("bls__product-grid").appendChild(prodNode));
```
Same constraint: scripts inside `appendChild`-ed nodes from a DOMParser document DO NOT execute.

**Impact:** Any product loaded via filter update or load-more would have:
- Modal HTML present in the DOM
- Modal `<script>` NOT executed — no event listeners attached
- Badge click does nothing
- Escape key does nothing

The `finally` blocks in collection.js only re-initialize specific Bls* modules. There is no generic script re-execution mechanism.

---

## Collection Context for Gating

`collection.metafields.custom.show_energy_label_on_cards` is accessible as a global in collection page context.

**Safe access pattern in `main-collection-product.liquid`:**
```liquid
{%- assign show_energy_label = collection.metafields.custom.show_energy_label_on_cards | default: false -%}
```

**Passing to product-item:**
```liquid
{%- render 'product-item', product: product, show_label: show_energy_label -%}
```

Inside `product-item.liquid`, `show_label` is nil/false for all other call sites (they don't pass it) — `{%- if show_label -%}` guard handles this correctly.

---

## Recommended Architecture

### New files to create

**`snippets/energy-label-card.liquid`** — lightweight card variant:
- Accepts: `product`, `show_label`
- Gate: `{%- if show_label -%}` at top
- Reads: `product.metafields.custom.energy_class`, `product.metafields.custom.energy_label_data_sheet.value`
- Renders: EU colour-coded arrow badge (links to PDP) + PDF `<a href>` link
- NO `<style>` block — styles loaded via asset file
- NO `<script>` block — zero JS
- NO modal — links to PDP where full label is available

**`assets/energy-label-card.css`** — card-specific styles:
- CSS class prefix: `elc-*` (isolated from both `el-*` PDP styles and Umino theme)
- Loaded once: conditionally in `main-collection-product.liquid`

### Files to modify (implementation phase)

| File | Change | Risk |
|---|---|---|
| `snippets/product-item.liquid` | Add `render 'energy-label-card'` in `.bls__product-details` after price | LOW — nil-safe on all other call sites |
| `sections/main-collection-product.liquid` | Read metafield, conditionally load CSS, pass `show_label` | LOW — additive only |

### Files NOT to modify

| File | Reason |
|---|---|
| `snippets/energy-label.liquid` | PDP-only — leave as-is |
| All 8 other `product-item` call sites | No changes needed — nil default on `show_label` |
| `assets/collection.js` | No JS in card snippet, so no re-init needed |

---

## HTML Placement

Target: inside `bls__product-details` in `product-item.liquid`, after the price block.

Current structure (relevant lines):
```
bls__product-details (line 523)
  → vendor (line 524–528, conditional)
  → product title h3 (lines 529–537)
  → price div (lines 546–553)          ← INSERT AFTER HERE
  → short description (lines 556–563, conditional)
  → product style 4 close (line 565)
  → color swatches (lines 567–569)
  → action buttons (lines 570–697)
```

**Insertion point:** After line 553 (price div close), before line 556 (short description check).

---

## Metafield Definition Required

Before implementation, this metafield must be defined in Shopify Admin:

| Field | Value |
|---|---|
| Namespace | `custom` |
| Key | `show_energy_label_on_cards` |
| Type | `boolean` |
| Owner resource | Collection |
| Define via | Shopify Admin → Settings → Custom Data → Collections → Add definition |

After defining, set the value on the target collection via Shopify Admin → Collections → [collection] → Metafields.

---

## Mobile and Desktop Layout

The card energy label area is placed below the price in the `.bls__product-details` block. Both product grid (desktop, 4–5 columns) and mobile (2 columns) use the same `bls__product-item` structure. The label will adapt to column width naturally if `elc-*` CSS uses `flex-wrap` and `font-size: inherit`.

Caution: card width varies by column count (2 on mobile, up to 5 on desktop). The badge should scale or truncate gracefully at narrow widths. This requires careful CSS in `energy-label-card.css`.

---

## Regression Risks

| Risk | Severity | Mitigation |
|---|---|---|
| `show_label` nil on non-collection pages | NONE | `{%- if show_label -%}` guard in snippet |
| CSS conflict with `el-*` PDP styles | LOW | Use `elc-*` prefix for all card styles |
| Duplicate CSS | NONE | Styles in asset file, not inline |
| AJAX script failure | NONE | No `<script>` in card snippet |
| Missing metafield on product | NONE | `data_sheets != blank` guard in snippet |
| Collection metafield not yet defined | LOW | Feature silently disabled until defined |
| Layout shift on narrow cards | LOW | Test at 2-column mobile width |

---

## Regression Tests Required (implementation phase)

1. Collection with metafield = true: energy label visible on cards with data_sheets
2. Collection with metafield = true: product without data_sheets — nothing renders, no empty space
3. Collection with metafield = false / not set: no label on any card
4. Other collections: no label on cards (nil default)
5. Search results page: no label (collection = nil)
6. Product recommendations on PDP: no label
7. Load-more (pagination): labels appear on newly loaded products
8. Filter update (AJAX): labels present after filter change
9. Desktop 4-column and 5-column layout: badge fits without overflow
10. Mobile 2-column layout: badge fits without overflow
11. PDP energy label unchanged: existing modal and badge still work
12. PDF link opens correctly in new tab
