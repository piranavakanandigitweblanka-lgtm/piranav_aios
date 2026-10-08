# Shopify XML Feed Debugging — Reference Comparison Method

**Date:** 2026-08-14  
**Author:** Piranav (AIOS)  
**Discovered via:** CPPC_30 XML formatting error fix  
**Reuse potential:** HIGH — applies to all Shopify Google Shopping XML feeds

---

## Problem This Solves

Google Merchant Center reports an XML formatting error with only a line/column number and no product-level detail. The error prevents any products from being parsed. Standard Liquid debugging tools do not surface XML validity issues.

---

## Method

### Step 1 — Read the GMC error CSV

Download the feed upload report from GMC (Content API → Feeds → View update history → Download report). The CSV contains:

| Field | What to read |
|---|---|
| Line number | Maps to rendered XML line, not Liquid line |
| Column number | Character offset on that line — use to identify which tag is breaking |
| Message | "XML formatting error" — column is the key signal |

Column ~127 on a `<g:image_link>` or `<g:title>` line → look at those tags first.

### Step 2 — Find working reference templates

In `shopify_projects/ledsone-uk-theme/templates/`, 30+ working feed templates exist. Read 2–3 and compare structure against the broken template.

Key comparison points:

| Element | Working Pattern | Broken Pattern (risk) |
|---|---|---|
| Image URL filter | `product_img_url: 'large'` | `image_url: width: 800` |
| Image URL output | Clean CDN URL, no query params | URL contains `&width=800` — bare `&` breaks XML |
| Variant description | `variant.description` | `product.description` (wrong but not XML-breaking) |
| Variant link | `variant.url` | `product.url?variant={{ variant.id }}` (the `?` is safe) |
| CDATA protection | Not present in references | Should add `\| replace: "]]>", "]] >"` |
| GTIN escaping | Not present in references | Should add `\| escape` |

### Step 3 — Identify the `&` source

The most common XML-breaking `&` sources in Shopify feed templates:

| Source | How it breaks XML | Fix |
|---|---|---|
| `image_url: width: N` filter | Generates `?v=xxx&width=N` URL outside CDATA | Switch to `product_img_url: 'large'` or wrap in `<![CDATA[...]]>` |
| Product description with raw `&` | Only breaks if NOT inside CDATA | Ensure description is inside CDATA |
| Barcode/GTIN with `&` | Breaks `<g:gtin>` (not in CDATA) | Add `\| escape` |
| `<g:link>` with `&` in URL | Query string params with `&` | Wrap in CDATA or escape |

### Step 4 — Apply the fix

1. Replace `image_url: width: N` with `product_img_url: 'large'` on all image_link lines
2. Add `\| escape` to all `<g:gtin>` fields
3. Add `\| replace: "]]>", "]] >"` to all CDATA chains (title + description)
4. Align variant description and link to match reference template pattern
5. Do NOT remove existing `&#39;`, `&#34;`, `&mdash;` etc. from inside CDATA — these are valid inside CDATA and match the LEDSone standard pattern used across all feeds

### Step 5 — Validate before re-upload

1. Open the live feed URL in a browser → Save Page As XML
2. Paste into https://validator.w3.org → check for XML errors
3. If clean → re-upload to GMC and wait for processing

---

## Key Finding: `image_url` vs `product_img_url`

| Filter | Output | XML-safe outside CDATA? |
|---|---|---|
| `product_img_url: 'large'` | `//cdn.shopify.com/s/files/.../image_large.jpg` | YES — no query params |
| `image_url: width: 800` | `//cdn.shopify.com/s/files/...?v=123&width=800` | NO — `&` breaks XML |

`product_img_url` is the Shopify legacy filter. `image_url` is the newer API-style filter but requires CDATA wrapping when used in XML feeds.

---

## Risk: Other Feed Templates

The same `image_url` risk exists in any LEDSone feed template that was created after the `image_url` filter became available. An audit of all 30+ templates for `image_url: width:` usage would identify other feeds at risk.

---

## Evidence

- `evidence/fixes/cppc30-xml-feed-fix-2026-08-14.md`
- Original error: `PRODUCTSSOURCE51.f408219290.u1786700745272000.feeduploadreport.csv` (Downloads)
- Fixed file: `C:\Users\PC\Downloads\google-feed-fixed.liquid`
- Reference templates: `shopify_projects/ledsone-uk-theme/templates/page.Pendant Lights-new feed.liquid`

---

## Can Another Developer Use This?

YES. The method is self-contained:
1. Read GMC error CSV → get line/column
2. Open broken template + 2 working reference templates
3. Compare `<g:image_link>` filter and other non-CDATA output fields
4. Replace `image_url` with `product_img_url` or wrap in CDATA
5. Add `\| escape` to bare output fields
6. Validate XML before re-upload
