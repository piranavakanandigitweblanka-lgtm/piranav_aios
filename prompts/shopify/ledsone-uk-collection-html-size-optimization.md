# Prompt: LEDSone UK Collection HTML Size Optimization

**Registered:** 2026-10-14  
**Category:** shopify/performance  
**Status:** ACTIVE  
**Reusable for:** Any Shopify BLS theme collection page with excessive HTML from `product.variants | json`

---

## Problem

The collection-pipe page (`/collections/conduit-lighting`) outputs ~2.28 MB of HTML. The dominant contributor is the `productinfo` block in `snippets/product-item.liquid`, which serializes the full Shopify variant object (`product.variants | json`) — approximately 30+ fields per variant — into an inline `<script type="application/json">` tag on every product card.

With `products_limit: 100` and multiple variants per product, this produces hundreds of kilobytes of redundant JSON per page load.

---

## Root Cause

In `snippets/product-item.liquid` (lines 520–541 at time of analysis):

```liquid
{%- unless product.has_only_default_variant -%}
  {%- unless variant -%}
    <script type="application/json" class="productinfo">
      {{ product.variants | json }}   ← FULL variant object, ~30+ fields
    </script>
    <script type="application/json" class="productVariantsQty">
      ...minimal fields only...       ← already lean
    </script>
  {%- endunless -%}
{%- endunless -%}
```

---

## JS Dependency Analysis

`assets/theme.js` reads `.productinfo` in two places:

1. `BlsColorSwatchesShopify.swapProduct()` (line 2274) — parses full array, calls `updateMasterId`, `updatePrice`, `updateMedia`, `renderProductInfo`
2. `BlsColorSwatchesShopify` add-to-cart guard (line 2651) — parses and calls `updateMasterId` only

Fields actually accessed from `productinfo`:
- `id` — add-to-cart button update
- `options` (array) — `updateMasterId` variant matching
- `option1` — `renderProductInfo` qty lookup
- `compare_at_price` — price display
- `price` — price display
- `unit_price` — unit price display
- `unit_price_measurement.reference_value`, `.reference_unit` — unit price display
- `available` — stock/button state
- `featured_media.preview_image.src` — image swap on swatch click
- `featured_media.id` — included for safety (used in quickview context)

---

## Fix

Replace `{{ product.variants | json }}` with a manually-built minimal JSON using a Liquid loop:

```liquid
<script type="application/json" class="productinfo">
  [{%- for v in product.variants -%}{"id":{{ v.id }},"options":{{ v.options | json }},"option1":{{ v.option1 | json }},"compare_at_price":{{ v.compare_at_price | default: 'null' }},"price":{{ v.price }},"unit_price":{{ v.unit_price | default: 'null' }},"unit_price_measurement":{% if v.unit_price_measurement %}{"reference_value":{{ v.unit_price_measurement.reference_value }},"reference_unit":{{ v.unit_price_measurement.reference_unit | json }}}{% else %}null{% endif %},"available":{{ v.available }},"featured_media":{% if v.featured_media %}{"id":{{ v.featured_media.id }},"preview_image":{"src":{{ v.featured_media.preview_image.src | json }}}}{% else %}null{% endif %}}{%- unless forloop.last -%},{%- endunless -%}{%- endfor -%}]
</script>
```

---

## Files Changed

- `shopify_projects/ledsone-uk-theme/snippets/product-item.liquid` — lines 522–524

---

## Expected Benefit

- Full variant JSON: ~30+ fields × ~50 chars = ~1500 chars per variant
- Minimal JSON: ~9 fields = ~200 chars per variant
- ~87% reduction per variant entry
- With 100 products × avg 5 variants = ~650KB saved from `productinfo` alone

---

## Safety

- `productVariantsQty` is unchanged (already minimal)
- No JS changes required
- Quick view loads its own variant data separately via `?section_id=product-quickview`
- All tested JS consumers verified against field list above
