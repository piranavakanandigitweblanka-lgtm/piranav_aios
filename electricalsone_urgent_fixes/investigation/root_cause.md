# Root Cause — Fake Judge.me Star Rating

**Status:** ROOT CAUSE CONFIRMED — FIX VERIFIED
**Investigation date:** 2026-10-05
**Verified date:** 2026-10-05

---

## Confirmed Root Cause

The Judge.me app blocks in `templates/product.json` contained the setting:

```json
"review_data": "sample_data"
```

This is a **development/preview mode flag** built into the Judge.me app block. When set to `"sample_data"`, it forces the widget to display hardcoded sample data regardless of the store's actual review count:

- **Rating displayed:** 4.5 stars
- **Review count displayed:** 10 reviews

This data was not real. It was Judge.me's built-in sample/demo content.

---

## Affected Instances

Three Judge.me app block instances were found in `templates/product.json`:

| Block ID | State | Issue |
|---|---|---|
| `judge_me_reviews_review_widget_BfQ4me` | Disabled | `review_data: "sample_data"` |
| `87e1a6a9-7f1a-4d47-a584-0b641799b215` | Disabled | `review_data: "sample_data"` |
| `judge_me_reviews_review_widget_GRahBm` | **Active** | `review_data: "sample_data"` |

The active block was the one producing the fake 4.5 / 10 display on live product pages. The two disabled blocks were also corrected to prevent the issue reappearing if they are ever re-enabled.

---

## Why It Happened

The `sample_data` setting is commonly left on during theme development and testing. It was never switched to real data before the theme went live.

---

## What Was NOT the Root Cause

The theme's own JSON-LD structured data block (`<script type="application/ld+json">`) in `sections/main-product.liquid` was investigated and found to be **already safe**.

It reads from Shopify native review metafields (`product.metafields.reviews.rating` and `product.metafields.spr.reviews`) and is gated:

```liquid
{%- if ld_review_count > 0 -%}
  "aggregateRating": { ... }
{%- endif -%}
```

It will only emit an `aggregateRating` if those metafields contain real data. The JSON-LD was **not the source** of the fake rating and was **not modified**.

---

## SEO Risk

The fake visible stars created a potential SEO/quality risk:

- Google's quality guidelines discourage misleading review presentation.
- If Google's crawlers rendered the Judge.me widget, the fake rating could have been interpreted as a deceptive signal.
- **No confirmed Google penalty has been recorded.** This is a preventative fix.
