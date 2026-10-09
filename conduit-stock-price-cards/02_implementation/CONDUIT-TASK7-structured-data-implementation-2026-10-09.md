# CONDUIT TASK 7 — Structured Data Implementation

**Date:** 2026-10-09
**Owner:** Piranav
**Status:** PARTIAL — CODE COMPLETE, BROWSER VALIDATION CONFIRMED, SCHEMA MARKUP VALIDATOR + ARCHITECTURE DECISION PENDING
**Prepared by:** Claude Code (sinrasu mode)

---

## Amendment — 2026-10-09 (template correction)

`schema_breadcrumb` section removed from `collection.collection-pipe.json` per Piranav's instruction. Piranav manually added a Custom Liquid section calling the same snippet via the Shopify theme editor (draft theme, collection-pipe template). The local file must not have a duplicate. See discovery SECTION 15 for full sync-risk warning.

**Critical:** Do not push `collection.collection-pipe.json` before pulling the Shopify version first — manual addition would be lost.

---

## Files Changed

### Created

| File | Purpose |
|---|---|
| `shopify_projects/ledsone-uk-theme/snippets/collection-itemlist-schema.liquid` | ItemList JSON-LD — schema only, no visual output |
| `shopify_projects/ledsone-uk-theme/snippets/collection-breadcrumb-schema.liquid` | BreadcrumbList JSON-LD — schema only, no visual output |

### Modified

| File | Change |
|---|---|
| `shopify_projects/ledsone-uk-theme/templates/collection.collection-pipe.json` | Added `schema_itemlist` and `schema_breadcrumb` custom-liquid sections; inserted before `custom_liquid_3pi7zt` (FAQ Schema) in section order |

### NOT modified

| File | Reason |
|---|---|
| `sections/main-collection-product.liquid` | Not touched — snippet reuses same logic, section remains disabled |
| `layout/theme.liquid` | WebSite duplicate is a separate issue — out of scope |
| `snippets/product-faq-ui.liquid` | FAQPage already wired — awaiting metafield population |
| `templates/collection.conduit-lighting-pk.json` | Duplicate page not in scope |

---

## Implementation Detail

### collection-itemlist-schema.liquid

Logic extracted from `sections/main-collection-product.liquid` lines 221–251 (original added 2025-07-14 by piranav).

Key attributes:
- `name`: `collection.title` — dynamic
- `url`: `request.origin | append: collection.url` — absolute URL
- `numberOfItems`: `collection.products_count`
- Each item: `@type: Product`, absolute product URL, featured image at 800px width, price + currency + availability
- Trailing comma guard: `{% unless forloop.last %},{% endunless %}` — prevents invalid JSON

Shopify Liquid limit: `collection.products` returns up to 250 products. If conduit-lighting exceeds 250, the list is capped. This is a platform limitation.

### collection-breadcrumb-schema.liquid

Schema-only (no `{% render 'breadcrumbs' %}` call, no visual HTML).

Two-item list:
- Position 1: Home → `shop.url` (absolute)
- Position 2: Collection title → `request.origin | append: collection.url` (absolute)

Guarded with `{%- if collection and collection.handle -%}` so the second item only renders when a collection context exists.

### collection.collection-pipe.json changes

Two new sections added:

```json
"schema_itemlist": {
  "type": "custom-liquid",
  "name": "ItemList Schema",
  "settings": { "content_liquid": "{% render 'collection-itemlist-schema' %}", ... }
},
"schema_breadcrumb": {
  "type": "custom-liquid",
  "name": "BreadcrumbList Schema",
  "settings": { "content_liquid": "{% render 'collection-breadcrumb-schema' %}", ... }
}
```

Section order (tail):
```
... → schema_itemlist → schema_breadcrumb → custom_liquid_3pi7zt (FAQ Schema)
```

`product-grid` (main-collection-product) remains `"disabled": true`.

---

## Static Validation — 9/9 PASS

| Check | Result |
|---|---|
| ItemList JSON (simulated) | VALID |
| BreadcrumbList JSON (simulated) | VALID |
| ItemList uses request.origin (absolute URL) | PASS |
| BreadcrumbList uses request.origin + shop.url | PASS |
| No relative-only URL risk | PASS |
| product-grid still disabled | PASS |
| schema_itemlist in template | PASS |
| schema_breadcrumb in template | PASS |
| FAQ Schema still last in order | PASS |
| schema_itemlist before FAQ | PASS |
| schema_breadcrumb before FAQ | PASS |
| forloop.last comma guard present | PASS |
| ItemList @type correct | PASS |
| BreadcrumbList @type correct | PASS |

---

## Browser Validation — CONFIRMED (2026-10-09)

Draft theme: "Promotion Week 4.2 Mega Digital" — page: `https://ledsone.co.uk/collections/conduit-lighting`

| Check | Result | Evidence |
|---|---|---|
| 5 JSON-LD blocks | CONFIRMED | `2026-10-09-task7-devtools-block-count-final.png` |
| 16 unique schema types | CONFIRMED | `2026-10-09-task7-devtools-block-count-final.png` |
| 0 invalid JSON-LD blocks | CONFIRMED | `2026-10-09-task7-devtools-block-count-final.png` |
| BreadcrumbList present | CONFIRMED | TinySEO + DevTools screenshots |
| BreadcrumbList: 1 instance only | CONFIRMED | `2026-10-09-task7-breadcrumb-no-duplicate.png` |
| BreadcrumbList: 2 entries | CONFIRMED | `2026-10-09-task7-breadcrumb-no-duplicate.png` |
| BreadcrumbList URLs correct | CONFIRMED — absolute | `2026-10-09-task7-breadcrumb-url-validation.png` |
| ItemList present | CONFIRMED | TinySEO screenshot |
| ItemList no duplicate | CONFIRMED — product-grid disabled | Template inspection |
| FAQPage present — 5 questions | CONFIRMED | TinySEO + theme confirmation |
| Google Rich Results Test | CONFIRMED — 2 valid (LocalBusiness, Organisation) | `2026-10-09-task7-google-rich-results-test.png` |
| Schema Markup Validator | NOT RUN | Open — not blocking |
| ItemList product URL spot-check | NOT RUN | Open — not blocking |

Evidence folder: `evidence/shopify/conduit-task7-structured-data/` (10 screenshots + manifest)

---

## FAQPage Status

**CONFIRMED LIVE — 2026-10-09.** `collection.metafields.custom.faq_schema` is populated (confirmed by FAQPage rendering with 5 questions). TinySEO detects FAQPage. Arudchelvi populated the metafield. No action required.

---

## Pre-existing Issue — WebSite Duplicate (not fixed in Task 7)

`layout/theme.liquid` outputs two `WebSite` schema blocks (lines 148 and 222). Both fire on every page. This is outside Task 7 scope. Recommend raising as a separate task with GPT.

---

## Next Steps

1. Resolve sections/ vs snippets/ architecture discrepancy (Piranav decision)
2. Commit all Task 7 AIOS files to git (awaiting Piranav instruction)
3. Optionally run Schema Markup Validator (`validator.schema.org`) — not blocking
4. Optionally run ItemList product URL spot-check in DevTools — not blocking
5. Do not publish theme without GPT + Piranav approval
