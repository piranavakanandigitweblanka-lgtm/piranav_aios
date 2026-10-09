# Validation — Conduit Task 7 Structured Data Discovery

**Date:** 2026-10-09
**Task:** CONDUIT-TASK7-2026-10-09
**Type:** Discovery validation — read-only
**Status:** PASS

---

## Files inspected

| File | Inspected | Finding |
|---|---|---|
| `layout/theme.liquid` | YES | WebSite×2 + Organization/LocalBusiness×1 — globally present |
| `sections/breadcrumb.liquid` | YES | BreadcrumbList JSON-LD present — section NOT in collection-pipe template |
| `sections/main-collection-product.liquid` | YES | ItemList JSON-LD present — section DISABLED in collection-pipe |
| `sections/collection-meta-filters.liquid` | YES | No JSON-LD schema output |
| `sections/main-collection-heading.liquid` | YES | Visual breadcrumb only — no JSON-LD |
| `snippets/product-faq-ui.liquid` | YES | FAQPage — conditional on metafield `collection.metafields.custom.faq_schema` |
| `snippets/breadcrumbs.liquid` | YES | Visual only — no JSON-LD |
| `templates/collection.collection-pipe.json` | YES | main-collection-product disabled, no breadcrumb section |
| `templates/collection.conduit-lighting-pk.json` | YES | main-collection-product ENABLED — ItemList present on duplicate |
| Live page — /collections/conduit-lighting | YES (web fetch) | 10 products confirmed, no JSON-LD returned by web fetch (JS-rendered) |
| Live page — /collections/conduit-lightings | YES (web fetch) | Same 10 products, same structure |

## Schema audit result

| Schema | Main page | Duplicate page | Expected after Task 7 |
|---|---|---|---|
| WebSite ×2 | PRESENT | PRESENT | Unchanged |
| Organization/LocalBusiness | PRESENT | PRESENT | Unchanged |
| BreadcrumbList | MISSING | MISSING | ADD to main |
| ItemList | MISSING | PRESENT | ADD to main |
| FAQPage | CONDITIONAL / PENDING | CONDITIONAL / PENDING | Unchanged — awaiting metafield |

## Duplicate check

- No prior Task 7 or schema implementation doc found in AIOS
- No existing `collection-itemlist-schema.liquid` or `collection-breadcrumb-schema.liquid` snippets exist
- `conduit-structured-data-discovery.md` prompt saved as new — no duplicate in prompts/shopify/

## Discovery checklist

- [x] AIOS duplicate search completed
- [x] theme.liquid inspected — global schemas confirmed
- [x] Both collection templates inspected
- [x] Disabled vs enabled sections compared
- [x] All schema-outputting sections and snippets identified
- [x] Live pages fetched — product list confirmed
- [x] FAQPage mechanism confirmed (metafield-conditional)
- [x] Implementation design documented
- [x] Risks documented
- [x] Validation plan written
- [x] No files modified (discovery only)

## Result: PASS — Discovery complete, no implementation performed
