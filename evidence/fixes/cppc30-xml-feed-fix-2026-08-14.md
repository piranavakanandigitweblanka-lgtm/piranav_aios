# CPPC_30 — XML Feed Fix Evidence

**Date:** 2026-08-14  
**Store:** LEDSone UK (ledsone.co.uk)  
**Feed:** CPPC_30 (Feed ID: 408219290, Customer ID: 5308512543)  
**Collection:** `top-selling-lights-now-on-sale`  
**Author:** Piranav (AIOS)  
**Status:** CLOSED — fix applied, GMC approval confirmed by Piranav (no screenshot saved)

---

## Original Error

**Source:** `PRODUCTSSOURCE51.f408219290.u1786700745272000.feeduploadreport.csv` (Downloads)

| Field | Value |
|---|---|
| Upload time | Aug 14, 2026, 2:45 am PDT |
| Line number | 20 |
| Error type | XML formatting error |
| Column | 127 |
| Affected item ID | None — XML broke before first product could be parsed |
| Affected item title | None |

---

## Root Cause

The feed template used the Liquid filter `image_url: width: 800` to generate product image URLs.

This filter generates Shopify CDN URLs in the form:
```
https://cdn.shopify.com/s/files/.../image.jpg?v=123456&width=800
```

The `&width=800` query parameter contains a bare `&` character. When this URL is rendered inside `<g:image_link>` without a CDATA wrapper, the `&` is invalid XML and causes a parse error at approximately column 127 of the image_link line.

**Diagnostic method:** Compared the broken CPPC_30 template against 30+ working LEDSone feed templates in `shopify_projects/ledsone-uk-theme/templates/`. All working feeds use `product_img_url: 'large'` which generates clean URLs without query parameters. The CPPC_30 feed was the only template using `image_url: width: 800`.

**Classification:** PARTIAL — deduced by reference comparison. Live URL output was not inspected directly. Column 127 alignment with the `<g:image_link>` line is consistent with this cause.

---

## Change Made

**Fixed file:** `C:\Users\PC\Downloads\google-feed-fixed.liquid`  
**Template committed to AIOS theme:** PENDING — see gaps below

| Change | Before | After | Reason |
|---|---|---|---|
| Product image filter | `product.featured_image \| image_url: width: 800` | `product.featured_image \| product_img_url: 'large'` | `image_url` generates `&`-containing URLs that break XML |
| Variant image filter | `variant.featured_image \| default: product.featured_image \| image_url: width: 800` | `variant.featured_image \| default: product.featured_image \| product_img_url: 'large'` | Same reason |
| Variant description source | `product.description` | `variant.description` | Matches all working reference templates |
| Variant link | `product.url?variant={{ variant.id }}` | `variant.url` | Matches all working reference templates |
| GTIN — parent product | `{{ current_variant.barcode }}` (no escape) | `{{ current_variant.barcode \| escape }}` | Prevent XML break if barcode contains `&` or `<` |
| GTIN — variant | `{{ variant.barcode }}` (no escape) | `{{ variant.barcode \| escape }}` | Same |
| CDATA injection protection | Not present | `\| replace: "]]>", "]] >"` added to title and description chains | Prevent CDATA block being closed early by product data |

---

## Reference Templates Used for Comparison

| Template | Path |
|---|---|
| Pendant Lights | `shopify_projects/ledsone-uk-theme/templates/page.Pendant Lights-new feed.liquid` |
| Wall Lights | `shopify_projects/ledsone-uk-theme/templates/page.Wall Lights-new feed.liquid` |

Both confirmed: `product_img_url: 'large'`, `variant.description`, `variant.url`, no CDATA injection protection.

---

## Validation

| Step | Result | Evidence |
|---|---|---|
| GMC re-upload | Confirmed by Piranav — product approved | No screenshot saved — ASSUMPTION |
| XML validator output | Not saved | GAP |
| Feed URL inspection | Not performed | GAP |
| Git commit in AIOS | None | GAP |

---

## Evidence Gaps

1. No GMC approval screenshot or re-upload report saved
2. No XML validator output (e.g. W3C validator result) saved
3. `google-feed-fixed.liquid` exists only in Downloads — not committed to AIOS or Shopify theme
4. No git commit records this change in `piranav_aios` repository
5. Original broken template exists only in session chat context — not saved to disk

---

## Files Inspected During This Fix

| File | Location | Role |
|---|---|---|
| `PRODUCTSSOURCE51.f408219290.u1786700745272000.feeduploadreport.csv` | `C:\Users\PC\Downloads\` | Original GMC error report |
| `google-feed-fixed.liquid` | `C:\Users\PC\Downloads\` | Fixed template output |
| `page.Pendant Lights-new feed.liquid` | `shopify_projects/ledsone-uk-theme/templates/` | Working reference |
| `page.Wall Lights-new feed.liquid` | `shopify_projects/ledsone-uk-theme/templates/` | Working reference |

---

## Next Actions Required

1. **Commit `google-feed-fixed.liquid` into AIOS theme** as `shopify_projects/ledsone-uk-theme/templates/page.Top Selling Lights On Sale-feed.liquid`
2. **Save GMC approval confirmation** — screenshot from Merchant Center showing feed CPPC_30 status = approved
3. **Audit all other feed templates** for `image_url: width:` usage — any other template with this filter has the same latent risk

---

## Capability Reference

See: `capability/piranav/shopify-xml-feed-debugging-2026-08-14.md`
