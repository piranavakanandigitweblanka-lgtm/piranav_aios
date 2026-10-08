# Capability — Shopify Collection Card Stock Label & "From" Price Fix

## Date First Identified
2026-10-07

## Last Updated
2026-10-07

## Status
CODE COMPLETE — Browser validation pending (Piranav must push draft theme)

## Purpose
Fix two common Shopify collection card display bugs: (1) stock label showing "In Stock" for partially-available products, and (2) "From" price prefix never appearing even when a product has variants at different prices.

## Business Problem Solved
These are two independent but related Shopify Liquid bugs that affect collection card accuracy:

**Bug 1 — Misleading stock label:**
`product.available` returns `true` if ANY variant is available, so a product with 1 of 6 colours in stock displays "In Stock". Customers add to cart and discover only one colour is available. Fix: count available variants and show three states — In Stock / Some options sold out / Out of Stock.

**Bug 2 — Missing "From" price prefix:**
`price.liquid` uses the condition `if target == product and product.price_varies` to decide whether to show "From £X.XX". When `product-item.liquid` calls `render 'price', use_variant: true`, Liquid sets `target = product.selected_or_first_available_variant` (a variant object). Comparing a variant object to a product always evaluates `false`, so the "From" prefix is never output on any collection card. Fix: change the condition to check `product.price_varies and variant == nil`.

## When To Use
- Shopify collection cards use `product.available` for the stock label
- Collection cards call `price.liquid` with `use_variant: true`
- Products have multiple variants with different availability or prices

## When NOT To Use
- Single-variant products where three-state stock label adds no value
- Themes that do not use `price.liquid` as a separate snippet (check architecture)
- If `.price__sale` wrapper is used by theme JS (e.g. `updatePrice()` on swatch click) — do NOT remove it; only change line 16's condition

## Required Inputs
- Access to `snippets/product-item.liquid`
- Access to `snippets/price.liquid`
- Knowledge of which line in `price.liquid` contains the `if target == product` check

## Source Task / Requirement
Conduit Parts 1 and 2 — Stock Labels and "From" Price Prefix
LEDSone UK theme, 2026-10-07

## Execution Steps

### Fix 1 — Three-state stock label in `product-item.liquid`

Find the existing stock label block (look for `product.available` check). Replace it:

```liquid
<div class="product-stock">
  {%- if variant != nil -%}
    {%- if variant.available -%}
      <span class="in-stock"><!-- check icon -->In Stock</span>
    {%- else -%}
      <span class="out-of-stock">Out of Stock</span>
    {%- endif -%}
  {%- else -%}
    {%- assign available_count = 0 -%}
    {%- for v in product.variants -%}
      {%- if v.available -%}{%- assign available_count = available_count | plus: 1 -%}{%- endif -%}
    {%- endfor -%}
    {%- if available_count == 0 -%}
      <span class="out-of-stock">Out of Stock</span>
    {%- elsif available_count < product.variants.size -%}
      <span class="partial-stock">Some options sold out</span>
    {%- else -%}
      <span class="in-stock"><!-- check icon -->In Stock</span>
    {%- endif -%}
  {%- endif -%}
</div>
```

Add CSS for `.partial-stock` (amber colour, distinct from green in-stock and red out-of-stock).

### Fix 2 — "From" prefix condition in `price.liquid`

Find the line that reads:
```liquid
if target == product and product.price_varies
```

Change to:
```liquid
if product.price_varies and variant == nil
```

**Do NOT remove `.price__sale` wrapper** — it is required by theme JS for swatch-based price updates.

## Evidence Required
- Browser screenshot: collection card showing "Some options sold out" for a partially-available product
- Browser screenshot: collection card showing "From £X.XX" for a variable-price product

## Evidence Path
- Part 1: `conduit-stock-price-cards/02_implementation/CONDUIT-01-implementation-2026-10-07.md`
- Part 2: `conduit-stock-price-cards/02_implementation/CONDUIT-02-implementation-2026-10-07.md`
- Discovery: `conduit-stock-price-cards/01_discovery/CONDUIT-01-02-discovery-2026-10-07.md`

## Pass / Fail Rule
PASS: Partially-available products show "Some options sold out". Variable-price products show "From £X.XX". Sale price and swatch interactions unchanged.
FAIL: "From" still absent, OR partial stock always shows "In Stock", OR sale/swatch price behaviour broken.

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator

## Known Limits
- The variant-count loop (`for v in product.variants`) adds a small Liquid iteration cost per product card. For very large collections this is negligible but worth noting
- `variant == nil` check in Fix 2 assumes the calling template always passes `variant:` explicitly for variant cards — verify the call signature in `product-item.liquid`
- These two fixes are independent — each can be applied without the other

## Reuse Path
Apply to any Shopify theme where collection cards use `product.available` for stock display or call `price.liquid` with `use_variant: true`. The root cause of the `target == product` failure is structural — it affects any Shopify theme using the standard price snippet pattern.

## Related Capabilities
- `shopify-collection-specific-swatch-guard-2026-10-08.md` — also modifies `product-item.liquid`
- `shopify-theme-html-deduplication-pattern-2026-10-08.md` — also modifies `product-item.liquid`

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-10-07 | Initial capability captured from Conduit Parts 1 and 2 | `conduit-stock-price-cards/02_implementation/CONDUIT-01-implementation-2026-10-07.md`, `CONDUIT-02-implementation-2026-10-07.md` |
