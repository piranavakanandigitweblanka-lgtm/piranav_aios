---
name: ledsone-de-collection-card-energy-label-discovery
description: Discovery prompt for adding EU Energy Label badge and PDF link to product cards on a selected collection — ledsone_de. Covers architecture, collection metafield gating, AJAX safety, and snippet reuse evaluation.
metadata:
  type: prompt
  category: shopify / discovery
  project: ledsone_de
  created: 2026-10-30
---

# Prompt: LEDSone DE — Collection Product Card Energy Label Discovery

## Context

The ledsone_de Shopify theme (Umino/Bluesky base) already has a working EU Energy Label
snippet (`snippets/energy-label.liquid`) that renders a colour-coded badge + modal + PDF link
on the product detail page (PDP). This prompt covers discovery for showing a lightweight
version of that label on product cards within one selected collection only.

## Objective

Investigate how to display the EU Energy Label badge and Product Data Sheet link inside
product cards for one selected collection only.

## Inspect

- `snippets/product-item.liquid` — product card template
- `snippets/energy-label.liquid` — full PDP energy label (reference only)
- `sections/main-collection-product.liquid` — primary collection section
- `templates/collection.json` — template structure
- `assets/collection.js` — AJAX filter and load-more implementation

## Key Questions

1. Where exactly is `render 'product-item'` called, and how many call sites exist?
2. Is `collection` accessible inside `product-item.liquid` without explicit passing?
3. Can `energy-label.liquid` be reused directly on cards? (CSS/JS duplication, AJAX safety)
4. What happens to inline `<script>` blocks when products are loaded via AJAX?
5. What is the cleanest architecture for collection-scoped gating?

## Known Architecture Facts (confirmed 2026-10-30)

- `main-collection-product.liquid` renders `product-item` at line 175 with only `product` passed
- `product-item.liquid` is called from 9 section files — modification affects all contexts
- `collection` is a global Liquid object accessible inside `{% render %}` snippets
- `collection.js` uses DOMParser + appendChild for load-more — inline scripts DO NOT execute
- `collection.js` uses DOMParser + replaceWith for filter updates — inline scripts DO NOT execute
- `energy-label.liquid` contains inline `<style>` (~280 lines) and `<script>` (~60 lines) per render call

## Recommended Architecture (confirmed 2026-10-30)

1. Create `snippets/energy-label-card.liquid` — lightweight, NO modal, NO `<script>`, NO inline `<style>`
2. Create `assets/energy-label-card.css` — loaded once in `main-collection-product.liquid`
3. Metafield: `custom.show_energy_label_on_cards` (type: boolean, owner: Collection)
4. In `main-collection-product.liquid`: read metafield, conditionally load CSS, pass `show_label` to product-item
5. In `product-item.liquid`: call `energy-label-card` if `show_label` is truthy (nil-safe for all other contexts)
6. Card display: badge arrow (energy class letter + EU colour, links to PDP) + PDF `<a href>` (no modal)

## Files to Modify (implementation phase)

| File | Change |
|---|---|
| `snippets/energy-label-card.liquid` | CREATE — lightweight card badge + PDF link |
| `assets/energy-label-card.css` | CREATE — card-scoped styles (no duplication) |
| `sections/main-collection-product.liquid` | Metafield read + CSS load + pass `show_label` |
| `snippets/product-item.liquid` | Add `render 'energy-label-card'` call in details block |

## Metafield Definition Required

| Field | Value |
|---|---|
| Namespace | `custom` |
| Key | `show_energy_label_on_cards` |
| Type | `boolean` |
| Owner | Collection |
| Define via | Shopify Admin → Settings → Custom Data → Collections |

## Expected Output Per Card

When collection metafield = true AND product has `custom.energy_label_data_sheet`:
- EU colour-coded arrow badge with energy class letter (matches PDP badge style)
- "Produktdatenblatt" PDF link (`<a href>` direct download, no modal)

When collection metafield = false / nil, OR product missing metafields:
- Nothing rendered — no empty space, no error

## Regression Risk

- LOW — `show_label: nil` default keeps all 8 other `product-item` call sites unchanged
- NO AJAX risk — no inline scripts in card snippet
- NO CSS conflict — `elc-*` prefix for card-specific styles
