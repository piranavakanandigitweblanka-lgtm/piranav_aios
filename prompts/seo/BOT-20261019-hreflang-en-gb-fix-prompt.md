---
name: bot-20261019-hreflang-en-gb-fix
description: Add en-GB hreflang tag to ledsone.co.uk Shopify theme via seo-noindex.liquid. Supplements Shopify Markets auto-hreflang (which outputs language-only codes) with a region-specific UK English signal. One file change, applies to all 2,612+ pages automatically.
metadata:
  type: implementation
  ticket: BOT-20261019-ORGANIC-EXC-03
  created: 2026-10-20
---

# BOT-20261019 — Add en-GB hreflang to ledsone.co.uk

## Problem

Shopify Markets auto-generates hreflang via `content_for_header` using language-only ISO codes:
- `hreflang="en"` — English (no region)
- `hreflang="pl"` — Polish (no region)
- `hreflang="nl"` — Dutch (no region)
- `hreflang="es"` — Spanish (no region)

Without `hreflang="en-GB"`, Google has no region-specific signal for UK English. Polish/Dutch-preference users in the UK may be served Polish/Dutch locale pages instead of the English one.

## Fix

Add `hreflang="en-GB"` tag in `snippets/seo-noindex.liquid`, supplementing (not replacing) Markets auto-tags.

**File to edit:** `shopify_projects/ledsone-uk-theme/snippets/seo-noindex.liquid`

**Code to add** (after existing noindex rules, before closing):

```liquid
{% comment %} en-GB hreflang — supplement Markets language-only 'en' tag with UK region signal {% endcomment %}
{% for locale in shop.published_locales %}
  {% if locale.iso_code == 'en' %}
    {% assign en_canonical = canonical_url | replace: request.locale.root_url, locale.root_url %}
    <link rel="alternate" hreflang="en-GB" href="{{ en_canonical }}">
    {% break %}
  {% endif %}
{% endfor %}
```

## Why This Works

- `canonical_url` — full URL of current page (e.g. `https://ledsone.co.uk/pl/collections/ceiling-lights`)
- `request.locale.root_url` — current locale prefix (e.g. `/pl`)
- `locale.root_url` for English — empty string (default locale has no prefix)
- Result: replaces `/pl` with `` → `https://ledsone.co.uk/collections/ceiling-lights`
- On English pages: `request.locale.root_url` is `""`, replace `""` with `""` = unchanged = correct

## Constraints

- Do NOT uncomment the full hreflang loop (would duplicate Markets auto-tags)
- Do NOT add pl-PL / nl-NL / es-ES unless Markets is confirmed to NOT output those
- This is a supplement only — one additional `<link>` tag per page

## Files

- `shopify_projects/ledsone-uk-theme/snippets/seo-noindex.liquid` — add en-GB block
- `shopify_projects/ledsone-uk-theme/layout/theme.liquid` — READ ONLY, do not modify
