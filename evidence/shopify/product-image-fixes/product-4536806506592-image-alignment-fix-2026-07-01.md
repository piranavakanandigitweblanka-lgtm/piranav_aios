# Evidence — Product Image Alignment Fix
# Product ID: 4536806506592

---

## Metadata

| Field | Value |
|---|---|
| Evidence ID | PROD-IMG-FIX-4536806506592 |
| Date Fixed | 2026-07-01 |
| Product ID (numeric) | `4536806506592` |
| Product Title | Modern Retro Style Drum Metal Ceiling Pendant Lampshade |
| Product Handle | `brushed-brass-colour-drum-lampshade-modern-metal-shade-retro-style` |
| Variant SKU | `WCB4BB+RPR44WH` |
| Collection | Easy Fit Lamp Shades & Cages |
| Store | Not confirmed — assumed Electricalsone or Ledsone UK (see Notes) |
| Fix type | Manual — data-layer (image re-upload + variant assignment) |
| Fixed by | Piranavakanan / Digitweblanka |
| Reviewer needed | Confirm store name and add screenshot paths |
| Related prior fix | `evidence/fixes/shopify_variant_image_display_fix_2026-06-29.md` (product `4417288732768`, same pattern) |

---

## What Happened

Product `4536806506592` had image alignment / display issues visible on the product detail page (PDP). Images were either showing for the wrong variants, appearing in the wrong order, or not correctly mapped to their respective colour/size variations.

The fix was performed manually inside the Shopify Admin: all existing product images were removed, and fresh images were re-uploaded and assigned variation-by-variation.

**No theme code was changed. This is a data-layer fix.**

---

## Problem

| Symptom | Detail |
|---|---|
| Image alignment / display issue | Product images were not correctly associated with their variants |
| Likely trigger | Images uploaded without explicit variant assignment, or variant-image mapping was broken (e.g. after a bulk import or re-save) |
| Affected page | Product Detail Page (PDP) |
| Theme code involved | None — the theme was reading correctly; the data association was broken |

The root cause follows the same pattern documented in the prior fix (`4417288732768`): Shopify's storefront renders variant images via the `variant.image` Liquid object. If images exist in the media library but are not explicitly assigned to variants, the PDP either shows no image, shows a mismatched image, or shows images in an incorrect sequence when the user switches variants.

---

## Manual Fix Performed

Steps completed in Shopify Admin:

1. Opened Shopify Admin → Products → located product `4536806506592`.
2. Navigated to the **Media** tab for the product.
3. **Deleted all existing product images** from the media library.
4. **Re-uploaded each image fresh** via the Media tab.
5. For each variant (colour/size), explicitly assigned the correct image:
   - Variant editor row → image selector → selected and saved the correct image.
6. Saved and published the product.
7. Verified the fix visually on the live PDP.

**Method: Remove all → re-upload → re-assign per variant.**
This is the same pattern as the approved fix for product `4417288732768`.

---

## Source / Evidence Used

| Source | Detail | Status |
|---|---|---|
| Catalog audit cross-reference | Product found in `docs/shopify/catalog/google_product_category_audit_selected_collections.md` line 158 — product ID, handle, SKU, collection all confirmed | CONFIRMED |
| Prior fix reference | `evidence/fixes/shopify_variant_image_display_fix_2026-06-29.md` — identical fix pattern on same store type | CONFIRMED |
| Shopify Admin action | Fix performed manually inside Shopify Admin by Piranavakanan | CONFIRMED — verbal/session |
| Before screenshot | Not captured | MISSING |
| After screenshot | Not captured | MISSING |
| Storefront URL | Not recorded | MISSING |

---

## Validation Status

| Check | Status | Notes |
|---|---|---|
| Product ID recorded | PASS | `4536806506592` |
| Product title recorded | PASS | Drum Metal Ceiling Pendant Lampshade |
| Handle recorded | PASS | `brushed-brass-colour-drum-lampshade-modern-metal-shade-retro-style` |
| SKU recorded | PASS | `WCB4BB+RPR44WH` |
| Fix method documented | PASS | Delete → re-upload → re-assign per variant |
| Store confirmed | AMBER | Catalog audit context points to Electricalsone or Ledsone UK — needs confirmation |
| Before screenshot | MISSING | Not captured at time of fix |
| After screenshot | MISSING | Not captured at time of fix |
| Live URL recorded | MISSING | Storefront product URL not recorded |
| Variant-by-variant assignment confirmed | AMBER | Performed — not screenshot-evidenced |

---

## Known Limits

| Limit | Detail |
|---|---|
| Screenshots absent | Fix was performed before evidence protocol was applied — no before/after visual proof |
| Store ambiguous | Product appears in catalog covering both stores — the specific store where the fix was applied was not recorded in session |
| Re-occurrence risk | If the product is re-imported or re-saved by a bulk import tool, variant-image associations may break again |
| Shopify audit trail | Shopify does not log variant image assignment changes at field level — no native audit trail |
| Root cause not confirmed | Whether the original misalignment was caused by a bulk import, API write, or manual error is not known |

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Fix performed by | Piranavakanan / Digitweblanka |
| Evidence authored by | Claude Code / piranav AIOS |
| Reviewer | Piranavakanan — confirm store, add screenshots, add storefront URL |

---

## Next Steps

1. **Confirm store** — open Shopify Admin, check whether `4536806506592` belongs to Electricalsone or Ledsone UK, update the Store field above.
2. **Record storefront URL** — e.g. `https://[store]/products/brushed-brass-colour-drum-lampshade-modern-metal-shade-retro-style` — update the Source table.
3. **Take screenshot** — open the product page in a private browser, screenshot the working variant image display, save to `C:\Users\PC\Desktop\screenshots\` and update this file with the path.
4. **Check variant switching** — click each variant and confirm the image swaps correctly; record result in validation table.
5. **Update evidence/README.md** — add a row for this evidence file in the Evidence Index.

---

## Pass / Fail Rule

| Condition | Status |
|---|---|
| Evidence file exists in `piranav_aios/evidence/` | **PASS** |
| Fix is documented outside chat / verbal memory | **PASS** |
| Product ID recorded and queryable | **PASS** |
| Fix method documented and reproducible | **PASS** |
| Store confirmed | **AMBER — needs update** |
| Before/after screenshots | **MISSING — needs capture** |
| Storefront URL recorded | **MISSING — needs capture** |
| A clean LLM reading this tomorrow can reproduce the fix | **PASS** |

**Current overall status: AMBER**
Core facts are recorded and queryable. Store name, storefront URL, and screenshots are missing — collect these to move to GREEN / PASS.

---

## Reusable Pattern Reference

This fix follows the standard **"Delete → Re-upload → Re-assign per variant"** pattern.
Full pattern documentation: `evidence/fixes/shopify_variant_image_display_fix_2026-06-29.md`

Apply this fix whenever:
- Product images show for the wrong variant on the PDP
- Variant switching does not change the displayed image
- Images exist in the media library but appear misaligned or out of sequence
- Product was recently re-imported or bulk-updated

---

*Document created: 2026-07-01 | Fix performed: 2026-07-01 | Source: Shopify Admin manual fix + catalog audit cross-reference | Authored by: Claude Code / piranav AIOS*
