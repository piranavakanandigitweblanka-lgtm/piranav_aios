# Implementation — en-GB hreflang Fix — BOT-20261019-ORGANIC-EXC-03

**Date:** 2026-10-20  
**Status:** IMPLEMENTED — pending upload to Shopify + browser verification  
**File changed:** `shopify_projects/ledsone-uk-theme/snippets/seo-noindex.liquid`

---

## Root Cause Confirmed

Shopify Markets auto-generates hreflang via `content_for_header` (theme.liquid line 83) using language-only ISO codes:
- `hreflang="en"` — no UK region signal
- `hreflang="pl"` — no region
- `hreflang="nl"` — no region
- `hreflang="es"` — no region

Without `hreflang="en-GB"`, Google cannot determine that the English page is specifically for UK users. Polish/Dutch-preference users in the UK may receive Polish/Dutch locale pages in search results rather than the English page.

---

## Fix Applied

**File:** `snippets/seo-noindex.liquid` — added at end of file (lines 44–51)

```liquid
{%- comment -%} en-GB hreflang — Markets outputs 'en' (language-only); this adds UK region signal piranav 2026-10-20 {%- endcomment -%}
{%- for locale in shop.published_locales -%}
  {%- if locale.iso_code == 'en' -%}
    {%- assign en_canonical = canonical_url | replace: request.locale.root_url, locale.root_url -%}
    <link rel="alternate" hreflang="en-GB" href="{{ en_canonical }}">
    {%- break -%}
  {%- endif -%}
{%- endfor -%}
```

**Why this works:**
- `canonical_url` = full URL of current page (e.g. `https://ledsone.co.uk/pl/collections/ceiling-lights`)
- `request.locale.root_url` = current locale prefix (e.g. `/pl`)
- English `locale.root_url` = empty string (default locale has no prefix)
- Result: `/pl` replaced with `` → `https://ledsone.co.uk/collections/ceiling-lights`
- On English pages: replace `""` with `""` = unchanged = correct English URL
- `{% break %}` stops after finding English locale — no iteration waste

**What this does NOT do:**
- Does NOT duplicate Markets auto-tags (pl, nl, es, en remain from content_for_header)
- Does NOT touch the commented-out full hreflang loop (left intact)
- Does NOT require any page-by-page edits — applies to all pages via theme render

---

## Expected Result After Upload

Every page on ledsone.co.uk will output in `<head>`:

```html
<!-- From Shopify Markets (content_for_header, already present) -->
<link rel="alternate" hreflang="en" href="https://ledsone.co.uk/collections/ceiling-lights">
<link rel="alternate" hreflang="pl" href="https://ledsone.co.uk/pl/collections/ceiling-lights">
<link rel="alternate" hreflang="nl" href="https://ledsone.co.uk/nl/collections/ceiling-lights">
<link rel="alternate" hreflang="es" href="https://ledsone.co.uk/es/collections/ceiling-lights">
<link rel="alternate" hreflang="x-default" href="https://ledsone.co.uk/collections/ceiling-lights">

<!-- NEW — from seo-noindex.liquid (our fix) -->
<link rel="alternate" hreflang="en-GB" href="https://ledsone.co.uk/collections/ceiling-lights">
```

---

## Verification Steps (after upload)

1. Open https://ledsone.co.uk/collections/ceiling-lights in browser
2. View page source → search for `hreflang`
3. Confirm `hreflang="en-GB"` is present pointing to English URL
4. Confirm `hreflang="en-GB"` on a /pl/ page points to English equivalent (not /pl/ URL)
5. Confirm no duplicate `en-GB` tags
6. Test with Google Rich Results Test or hreflang checker tool

---

## Safety

- seo-noindex.liquid is rendered on every page via theme.liquid line 148
- Change is additive only — one new `<link>` tag per page
- No noindex, redirect, or Markets settings changed
- Commented-out hreflang loop untouched
