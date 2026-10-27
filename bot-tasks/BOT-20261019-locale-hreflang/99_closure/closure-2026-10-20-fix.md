# Closure — BOT-20261019-ORGANIC-EXC-03 — hreflang Fix Session 2026-10-20

| Field | Value |
|---|---|
| Requirement ID | BOT-20261019-FIX-2026-10-20 |
| Task | Add en-GB hreflang to seo-noindex.liquid |
| File changed | `shopify_projects/ledsone-uk-theme/snippets/seo-noindex.liquid` |
| Status | IMPLEMENTED — pending Shopify upload + browser verification |

## Root Cause

Shopify Markets outputs `hreflang="en"` (language-only) via `content_for_header`. No `en-GB` regional signal exists. Google cannot distinguish UK English from global English — Polish/Dutch-preference users in the UK may receive locale pages instead of the English page.

## Fix

Added en-GB hreflang block to `seo-noindex.liquid` (lines 44–51). Runs via `shop.published_locales` loop, constructs English URL by replacing current locale root_url, outputs one `<link rel="alternate" hreflang="en-GB">` tag per page. Applies to all pages automatically via theme.liquid render at line 148.

## Next Steps for Piranav

1. Upload `snippets/seo-noindex.liquid` to Shopify Admin (ledsone-uk theme)
2. View source on https://ledsone.co.uk/collections/ceiling-lights — verify `hreflang="en-GB"` in head
3. View source on https://ledsone.co.uk/pl/collections/ceiling-lights — verify `en-GB` points to English URL
4. Screenshot both as validation evidence → save to `03_evidence/`
5. Run Google hreflang checker to confirm full tag set
6. Git commit seo-noindex.liquid once verified
