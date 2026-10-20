# Validation: LEDSone UK Collection HTML Size Optimization

**Date:** 2026-10-14  
**Task:** ledsone-uk-html-optim-2026-10-14  
**Validator:** Claude Code  
**Status:** IN PROGRESS — local change applied, live validation pending upload

---

## Acceptance Criteria

### HTML Criteria
- [ ] Total HTML bytes decrease measurably vs baseline
- [ ] Product count unchanged
- [ ] Product ordering unchanged
- [ ] No empty grid spaces

### Functional Criteria

| Test | Result | Notes |
|---|---|---|
| Product cards render on desktop | NOT TESTED | Requires Shopify upload |
| Product cards render on mobile | NOT TESTED | Requires Shopify upload |
| Colour/variant swatches select correct variant | NOT TESTED | Requires Shopify upload |
| Swatch change updates correct price | NOT TESTED | Requires Shopify upload |
| Swatch change updates correct media/image | NOT TESTED | Requires Shopify upload |
| Stock availability label correct after swatch | NOT TESTED | Requires Shopify upload |
| Add-to-cart uses correct variant ID after swatch | NOT TESTED | Requires Shopify upload |
| Quick view opens and works | NOT TESTED | Requires Shopify upload |
| Collection filters (size/type/colour) work | NOT TESTED | Requires Shopify upload |
| No new console errors | NOT TESTED | Requires Shopify upload |
| No failed network requests | NOT TESTED | Requires Shopify upload |

---

## Code-Level Verification (Local)

- [x] Change is syntactically valid Liquid
- [x] JSON structure matches what JS expects: array of variant objects
- [x] All 9 required fields present: `id`, `options`, `option1`, `compare_at_price`, `price`, `unit_price`, `unit_price_measurement`, `available`, `featured_media`
- [x] Null handling: `compare_at_price`, `unit_price` default to `null`; `unit_price_measurement` outputs null if not set; `featured_media` outputs null if not set
- [x] `productVariantsQty` block unchanged
- [x] Change only triggers when `product.has_only_default_variant == false` and `variant` is blank (same guard as before)
- [x] No other files changed

---

## Before/After (to be completed after upload)

| Metric | Before | After | Change |
|---|---|---|---|
| HTML bytes (conduit-lighting page) | 2,280,000 (est.) | — | — |
| Measurement method | — | — | — |
| Product count | — | — | — |

---

## Blocker

Live functional tests require the theme to be uploaded to Shopify (unpublished duplicate for safety). This cannot be done from the local environment without Shopify CLI or Piranav authorization to push theme files.

**Next action for Piranav:** Upload the modified theme file to a duplicate unpublished theme using Shopify CLI or the Theme Editor. Then test the conduit-lighting collection page for the functional criteria above.
