# Capability — Shopify Collection-Specific Swatch Guard

## Date First Identified
2026-10-08

## Last Updated
2026-10-08

## Status
CODE COMPLETE — Browser validation pending (Piranav must push draft theme)

## Purpose
Enable colour/finish swatches on one specific collection page without changing the global theme setting that suppresses swatches everywhere else.

## Business Problem Solved
A Shopify theme may have a global setting (`enable_sw_only_product_detail = True`) that hides swatches on all collection pages. The standard way to enable swatches for one collection — changing the global setting — would expose swatches on every collection across the store, which may not be desired. This pattern enables swatches on a target collection only, with zero impact on all other collection pages.

## When To Use
- A single collection needs swatches displayed on its cards
- The global swatch setting is locked (`True`) and cannot be changed store-wide
- Swatch data already exists on the products (`product-color-swatches.liquid` is present in the theme)

## When NOT To Use
- If you need swatches on ALL collection pages — just change the global setting instead
- If `request.path` is not accessible in the snippet context of the target theme (verify before applying)
- If the swatch component does not already exist in the theme

## Required Inputs
- Target collection handle (e.g. `/collections/conduit-lighting`)
- Confirmed path to the swatch snippet (e.g. `product-color-swatches.liquid`)
- Line number of the swatch guard in `product-item.liquid`

## Source Task / Requirement
Conduit Task 6 — Show Finish Information on Product Cards
LEDSone UK theme, 2026-10-08

## Execution Steps

1. **Find the guard in `product-item.liquid`**
   Look for the line that renders the swatch snippet. It will be gated by a condition that includes `th_st.enable_sw_only_product_detail == false` (or equivalent global setting check).

2. **Replace the simple global check with a path-aware guard**

   **Before:**
   ```liquid
   {%- if color_type != 'radio' and color_type != 'dropdown' and th_st.enable_sw_only_product_detail == false -%}
       {%- render 'product-color-swatches', product: product -%}
   {%- endif -%}
   ```

   **After:**
   ```liquid
   {%- assign allow_swatches = false -%}
   {%- if th_st.enable_sw_only_product_detail == false or request.path == '/collections/YOUR-COLLECTION-HANDLE' -%}
     {%- assign allow_swatches = true -%}
   {%- endif -%}
   {%- if color_type != 'radio' and color_type != 'dropdown' and allow_swatches -%}
       {%- render 'product-color-swatches', product: product -%}
   {%- endif -%}
   ```

3. **Add swatch count CSS** (if `product-color-swatches.liquid` uses `.bls__swatch-count`)
   Add the count chip CSS to the section's existing `<style>` block, not to the snippet.

4. **Push to draft theme** and validate the target collection shows swatches. Validate that an unrelated collection does NOT show swatches.

## Evidence Required
- Before screenshot: swatches absent on target collection
- After screenshot: swatches visible on target collection
- Confirmation that another collection (non-target) still shows no swatches

## Evidence Path
`conduit-stock-price-cards/02_implementation/CONDUIT-TASK6-finish-swatches-2026-10-08.md`

## Pass / Fail Rule
PASS: Swatches render on the target collection path only. No other collection is affected. Global setting value unchanged.
FAIL: Swatches appear on non-target collections, OR target collection still shows no swatches after push.

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator

## Known Limits
- `request.path` is available inside Shopify `render` tag snippets (confirmed in Shopify Liquid docs) but should be tested per theme
- Does not work for collections accessed via custom URL aliases not matching the standard `/collections/handle` path
- If the swatch snippet itself has internal guards, those must also be checked

## Reuse Path
Replace `/collections/conduit-lighting` with the handle of the target collection. All other logic is identical. For multiple collections: use `or request.path == '/collections/second-handle'` chaining.

## Related Capabilities
- `shopify-collection-card-stock-price-fix-2026-10-07.md` — also modifies `product-item.liquid`
- `shopify-theme-html-deduplication-pattern-2026-10-08.md` — also modifies `product-item.liquid` and `collection-meta-filters.liquid`

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-10-08 | Initial capability captured from Conduit Task 6 | `conduit-stock-price-cards/02_implementation/CONDUIT-TASK6-finish-swatches-2026-10-08.md` |
