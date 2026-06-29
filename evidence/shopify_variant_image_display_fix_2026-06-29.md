# Shopify Variant Image Display Fix — 2026-06-29

**Date Fixed:** 2026-06-29
**Reviewed by:** Piranavakanan / Digitweblanka
**Store:** Ledsone UK

---

## Problem

Product images were present in the Shopify admin and hosted on the Shopify CDN, but they did not appear on the live product detail page (PDP). The product page rendered with no images — or a broken/empty image slot — despite the images being queryable via the Admin API and visible inside the Shopify admin product editor.

This is a data-layer issue, not a theme code issue. The theme was reading images correctly; the images simply were not attached to the correct product/variant records in the expected way.

---

## Product / Store Context

| Field | Value |
|---|---|
| Store | Ledsone UK |
| Product URL | https://ledsone.co.uk/products/water-lily-iron-wire-cage-lamp-industrial-lighting-decoration-shade |
| Product ID | `gid://shopify/Product/4417288732768` (numeric: `4417288732768`) |
| Affected page | Product Detail Page (PDP) |
| Date issue observed | 2026-06-29 |
| Channel affected | Online Store (live storefront) |

---

## Observed Evidence

| Item | Evidence | Status | Gap |
|---|---|---|---|
| Images visible in Shopify admin | Confirmed — images appeared in product editor media tab | PASS | No screenshot saved |
| Images hosted on CDN | Confirmed — Shopify CDN URLs were resolvable | PASS | No URL recorded |
| PDP showed no images | Confirmed — product page rendered without images in storefront preview | PASS | Before screenshot not saved |
| After fix — images visible on PDP | Confirmed by visual check of live product page | PASS | After screenshot not saved |
| Product URL | https://ledsone.co.uk/products/water-lily-iron-wire-cage-lamp-industrial-lighting-decoration-shade | PASS | — |
| Product ID (GID) | `gid://shopify/Product/4417288732768` | PASS | — |
| Before screenshot path | Not saved to disk | FAIL | `C:\Users\PC\Desktop\screenshots\2026-06-29-before-variant-image.png` — required |
| After screenshot path | Not saved to disk | FAIL | `C:\Users\PC\Desktop\screenshots\2026-06-29-after-variant-image.png` — required |
| Fixed by | Piranavakanan / Digitweblanka | PASS | — |
| Date fixed | 2026-06-29 | PASS | — |

---

## Root Cause Assumption

Shopify's storefront image rendering for products uses the **variant-to-image association** as the primary binding. If images are uploaded to a product's general media library without being explicitly assigned to specific variants (or to the product's first position), the storefront theme may not receive or render them correctly via the `product.images` or `variant.image` Liquid objects.

Likely cause: images were uploaded programmatically or via a third-party app and were **detached from variant associations** — they existed in the CDN/media library but were not linked in the variant image assignment table. This means `variant.image` returned `nil` and the PDP image container had nothing to render.

This is distinct from a theme bug — the Liquid code was functioning correctly; it was reading a valid but empty association.

---

## Fix Applied

**Manual re-attachment via Shopify Admin — variant-by-variant image assignment.**

Steps performed:
1. Opened the product in Shopify Admin → Products → [product].
2. Identified all existing product images in the Media section.
3. Deleted all existing media attachments from the product.
4. Re-uploaded each image fresh via the Media tab.
5. For each variant (color/size/type), explicitly assigned the correct image using the variant editor: variant row → image selector → assigned image.
6. Saved and published.
7. Checked the live product page — images now displayed correctly.

**No theme code was changed. This was a pure data-layer fix.**

---

## Validation Steps

1. Open the product URL in a private/incognito browser window (no cache).
2. Confirm the main product image loads on page arrival.
3. Click each variant (color, size, etc.) — confirm the image swaps to the correct variant image.
4. Check mobile viewport (375px width) — confirm image renders and is not clipped.
5. Check the Shopify admin → Product → Media — confirm variant image assignments show the correct image icon next to each variant row.

---

## Pass / Fail Rule

| Condition | Status |
|---|---|
| This file exists in `piranav_aios/evidence/` | PASS |
| Fix is documented outside chat/verbal memory | PASS |
| Product URL recorded | PASS — https://ledsone.co.uk/products/water-lily-iron-wire-cage-lamp-industrial-lighting-decoration-shade |
| Product ID recorded | PASS — `gid://shopify/Product/4417288732768` |
| Before screenshot saved to disk | FAIL — gap, must be filled |
| After screenshot saved to disk | FAIL — gap, must be filled |
| A clean LLM reading this tomorrow can reproduce the fix | PASS |

**Current status: PARTIAL PASS — structural record saved. Evidence gaps (product URL, ID, screenshots) must be filled before this task can be marked fully CLOSED.**

---

## Next Step

1. Open the Shopify admin for Ledsone UK, locate the fixed product, and record:
   - Product URL (storefront URL, e.g. `https://ledsone.co.uk/products/[handle]`)
   - Product Admin GID (e.g. `gid://shopify/Product/XXXXXXXXXX`)
2. Take a screenshot of the working product page and save to `C:\Users\PC\Desktop\screenshots\2026-06-29-after-variant-image.png`.
3. If a before screenshot was taken earlier in the session, save it as `C:\Users\PC\Desktop\screenshots\2026-06-29-before-variant-image.png`.
4. Update this file's evidence table with those values.
5. Update `evidence/README.md` Evidence Index row for this task to PASS.

---

## Known Limits

- This fix is manual and not automated — if the product is re-imported by a third-party app (e.g. New OM 2024), the variant image associations may be overwritten again.
- Shopify's native event log does not record image assignment changes at the field level, so there is no automatic audit trail for this type of fix.
- The root cause (detachment mechanism) was assumed, not confirmed. If images break again on this product, investigate whether a feed/import app is overwriting the media associations.
- This document describes the pattern only. The specific product ID and URL must be filled in to make this record fully queryable.

---

## Reusable Pattern — When to Apply This Fix

Apply this fix whenever:
- Images are visible in Shopify admin media but do not appear on the live PDP.
- `variant.image` is `nil` in the theme but the product has images in its media library.
- A product was imported via a third-party app and images were not variant-assigned.
- Images were bulk-uploaded but variant associations were skipped.

**Do not** apply this fix if:
- The theme's image rendering Liquid is broken (that requires a theme code fix).
- Images are missing from the CDN entirely (that requires re-upload).
- The issue is limited to one breakpoint/device (that is a CSS/theme issue).

---

*Document created: 2026-06-29 | Source: Live Shopify admin fix session | Authored by: Claude Code / piranav_aios AIOS*
