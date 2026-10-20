# Evidence: LEDSone UK Collection HTML Size Optimization

**Date:** 2026-10-14  
**Task ID:** ledsone-uk-html-optim-2026-10-14  
**Status:** IMPLEMENTED — awaiting Shopify upload and live measurement  
**Operator:** Claude Code

---

## 1. Objective

Reduce the HTML payload of `/collections/conduit-lighting` (collection-pipe template) without breaking any existing theme functionality.

---

## 2. Baseline

- **Reported HTML size:** ~2.28 MB (prior session measurement) / ~2.9 MB (earlier baseline)
- **Measurement method:** Not independently measured this session — live page cannot be fetched from local environment. Prior session measurements used browser DevTools Network tab on the live page.
- **Template:** `collection.collection-pipe.json`
- **Section responsible for product grid:** `sections/collection-meta-filters.liquid`
- **Products limit:** 100 (from `collection_meta_filters_3j6DXw.settings.products_limit: 100`)
- **Rendering path:** collection-pipe template → `collection-meta-filters` section → `snippets/product-item.liquid` (once per product default card + once per variant card)

---

## 3. Root Cause

In `snippets/product-item.liquid` lines 522–524 (before change):

```liquid
<script type="application/json" class="productinfo">
  {{ product.variants | json }}
</script>
```

`product.variants | json` serializes the full Shopify variant object for every variant. A full Shopify variant includes ~30+ fields: `title`, `sku`, `barcode`, `weight`, `weight_unit`, `requires_shipping`, `taxable`, `inventory_quantity`, `inventory_policy`, `inventory_management`, `fulfillment_service`, `created_at`, `updated_at`, `image`, `option2`, `option3`, and more.

Of these, the JavaScript (`assets/theme.js`) only accesses 9 fields:  
`id`, `options`, `option1`, `compare_at_price`, `price`, `unit_price`, `unit_price_measurement`, `available`, `featured_media`

This block is emitted once per product (only on the default card, not variant cards), for all products that have variants (i.e., `product.has_only_default_variant == false`).

---

## 4. Duplicate Check

- No existing HTML optimization task found in AIOS
- Related task `conduit-1-2-stock-price-cards` (2026-10-07) modified `product-item.liquid` for stock/price display, not JSON slimming — no conflict
- No parallel copy of `productinfo` or `productVariantsQty` optimization found

---

## 5. JS Dependency Trace

| Consumer | Line | Fields Used |
|---|---|---|
| `BlsColorSwatchesShopify.swapProduct()` | 2267–2305 | `options`, `option1`, `compare_at_price`, `price`, `unit_price`, `unit_price_measurement`, `available`, `id`, `featured_media.preview_image.src` |
| `BlsColorSwatchesShopify` add-to-cart guard | 2650–2663 | `options`, `id`, `available` |
| `updateMasterId()` | 2027–2036 | `options` (array) |
| `updatePrice()` | 2038–2097 | `compare_at_price`, `price`, `unit_price`, `unit_price_measurement.reference_value`, `.reference_unit`, `available` |
| `updateMedia()` | 2099–2110 | `featured_media.preview_image.src`, `featured_media` (null check) |
| `renderProductInfo()` | 2112–2223 | `compare_at_price`, `price`, `option1`, `id`, `available` |

**Note:** `VariantRadiosQuickview.getVariantQtyData()` reads `.productVariantsQty`, not `.productinfo`. Quick view fetches its own variant data from `?section_id=product-quickview` independently.

---

## 6. Change Made

**File:** `shopify_projects/ledsone-uk-theme/snippets/product-item.liquid`  
**Lines:** 522–524

**Before:**
```liquid
<script type="application/json" class="productinfo">
  {{ product.variants | json }}
</script>
```

**After:**
```liquid
<script type="application/json" class="productinfo">
  [{%- for v in product.variants -%}{"id":{{ v.id }},"options":{{ v.options | json }},"option1":{{ v.option1 | json }},"compare_at_price":{{ v.compare_at_price | default: 'null' }},"price":{{ v.price }},"unit_price":{{ v.unit_price | default: 'null' }},"unit_price_measurement":{% if v.unit_price_measurement %}{"reference_value":{{ v.unit_price_measurement.reference_value }},"reference_unit":{{ v.unit_price_measurement.reference_unit | json }}}{% else %}null{% endif %},"available":{{ v.available }},"featured_media":{% if v.featured_media %}{"id":{{ v.featured_media.id }},"preview_image":{"src":{{ v.featured_media.preview_image.src | json }}}}{% else %}null{% endif %}}{%- unless forloop.last -%},{%- endunless -%}{%- endfor -%}]
</script>
```

---

## 7. Expected Size Reduction

| Metric | Estimate |
|---|---|
| Full variant JSON per variant | ~1,500 chars (~1.5 KB) |
| Minimal JSON per variant | ~200 chars (~0.2 KB) |
| Reduction per variant | ~87% |
| Products in collection (max) | 100 |
| Avg variants per product (conduit estimate) | 5 |
| Total `productinfo` blocks | 100 |
| Total variants serialized | ~500 |
| Estimated saving | ~650 KB |
| Expected post-optimization page size | ~1.6 MB (from 2.28 MB baseline) |
| Estimated % reduction | ~30% |

*Note: These are estimates. Actual savings depend on variant count per product and whether `productinfo` is the dominant contributor or if other sections (lookbook, variant cards) contribute significantly.*

---

## 8. Rollback

To revert, replace the after block with:
```liquid
<script type="application/json" class="productinfo">
  {{ product.variants | json }}
</script>
```

---

## 9. Next Steps

1. Upload theme to Shopify (duplicate/unpublished theme for testing, or directly if authorized)
2. Measure live page HTML bytes before and after — use browser DevTools → Network → filter by document, record Transfer Size
3. Test: colour swatches, add-to-cart, price updates, stock labels, quick view
4. Record actual before/after measurements in this evidence file
