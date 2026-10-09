# CONDUIT TASK 7 — Structured Data Discovery

**Date:** 2026-10-09 (updated same day with live browser evidence)
**Owner:** Piranav
**Deadline:** 2026-10-13 18:00 SL
**Status:** UPDATED — live browser evidence added, BreadcrumbList root cause confirmed
**Prepared by:** Claude Code (sinrasu mode)

---

## Scope

Add or correct JSON-LD structured data on the main Conduit Lighting collection page:

1. `ItemList`
2. `BreadcrumbList`
3. `FAQPage` — pending Arudchelvi FAQs going live

**Main page:** https://ledsone.co.uk/collections/conduit-lighting
**Duplicate reference:** https://ledsone.co.uk/collections/conduit-lightings

---

## SECTION 0 — Live Browser Evidence (2026-10-09, post-implementation push)

**Source:** Shopify theme editor screenshot + recursive JSON-LD console scan on `/collections/conduit-lighting`
**Screenshot:** `C:\Users\PC\Downloads\Screenshot 2026-10-09 085745.png`

### Schemas confirmed LIVE on /collections/conduit-lighting

| Schema type | Status | Source |
|---|---|---|
| `WebSite` (×2) | LIVE | `theme.liquid` — two blocks, pre-existing duplicate |
| `Organization` | LIVE | `theme.liquid` |
| `LocalBusiness` | LIVE | `theme.liquid` — co-typed with Organization |
| `FAQPage` | **LIVE** | `product-faq-ui.liquid` via metafield — **Arudchelvi FAQs confirmed populated** |
| `Question` / `Answer` | LIVE | Inside FAQPage block — 5 FAQs visible in theme editor |
| `ItemList` | **STATUS UNCLEAR** — see BreadcrumbList note | `collection-itemlist-schema.liquid` — section appears in sidebar, error status not confirmed |
| `ListItem` / `Product` / `Offer` | Present if ItemList renders | Inside ItemList |
| `PostalAddress` / `GeoCoordinates` / `OpeningHoursSpecification` / `ContactPoint` / `EntryPoint` / `SearchAction` | LIVE | `theme.liquid` — sub-types of Organization/WebSite |
| `BreadcrumbList` | **ABSENT** | Root cause confirmed — see below |

### FAQPage confirmed LIVE

Arudchelvi's FAQs are live on the conduit-lighting collection. 5 questions visible in theme editor preview:
1. What conduit pipe sizes are available?
2. What bulb fitting are the lamp holders compatible with?
3. What finishes are available for the lamp holders and fittings?
4. Can I build a complete light fitting using these components?
5. Are the pendant lights compatible with a dimmer switch?

`collection.metafields.custom.faq_schema` is populated for conduit-lighting — **FAQPage does not need any implementation work.**

### BreadcrumbList — Root cause confirmed

**Liquid error visible in theme editor:**
> `Liquid error (sections/custom-liquid line 1): Could not find asset snippets/collection-breadcrumb-schema.liquid`

**Root cause:** The template JSON (`collection.collection-pipe.json`) was pushed to Shopify with the `schema_breadcrumb` section referencing `{% render 'collection-breadcrumb-schema' %}`. However, the snippet file `collection-breadcrumb-schema.liquid` was **not pushed to Shopify's asset system** alongside the template. The file exists locally but is absent from the live theme.

**Fix required:** Push `snippets/collection-breadcrumb-schema.liquid` to Shopify. No code changes needed — the file is correct as written.

### ItemList — status note

The `collection list schema` section appears in the theme editor left sidebar. The screenshot does not show a Liquid error for that section, but it also does not confirm the schema is rendering in the page HTML. Most likely `collection-itemlist-schema.liquid` has the same problem — it was also not pushed to Shopify. Both snippets must be pushed together.

---

## SECTION 1 — AIOS Duplicate Check

Searched:
- `conduit-stock-price-cards/01_discovery/` — no prior Task 7 or structured data doc found
- `conduit-stock-price-cards/02_implementation/` — no schema/JSON-LD implementation file found
- `prompts/` — no existing JSON-LD collection schema prompt found
- `capability/` — no schema implementation capability found

**Result: NO DUPLICATE — this is a new workstream.**

---

## SECTION 2 — Files Inspected

| File | Purpose |
|---|---|
| `layout/theme.liquid` | Global schema output — every page |
| `sections/breadcrumb.liquid` | BreadcrumbList JSON-LD section |
| `sections/main-collection-product.liquid` | ItemList JSON-LD + product grid UI |
| `sections/collection-meta-filters.liquid` | Custom filter product grid (active on conduit-lighting) |
| `sections/main-collection-heading.liquid` | Visual breadcrumb render only — no JSON-LD |
| `snippets/product-faq-ui.liquid` | FAQPage — reads from `collection.metafields.custom.faq_schema` |
| `snippets/breadcrumbs.liquid` | Visual breadcrumbs only — no JSON-LD |
| `snippets/article-schema.liquid` | Article + FAQPage for blog posts only |
| `blocks/MainFaq.liquid` | Shopify section schema block — no JSON-LD output |
| `blocks/ai_gen_block_41611c2.liquid` | No schema output |
| `blocks/ai_gen_block_c1c9b3a.liquid` | No schema output |
| `templates/collection.collection-pipe.json` | Main conduit-lighting template |
| `templates/collection.conduit-lighting-pk.json` | Duplicate conduit-lightings template |

---

## SECTION 3 — Global Schemas (theme.liquid — every page)

Three JSON-LD blocks are emitted on EVERY page of ledsone.co.uk, including both collection URLs.

### Block 1 — WebSite (legacy, line 148)
```json
{
  "@context": "https://schema.org/",
  "@type": "WebSite",
  "name": "LEDSone UK Ltd",
  "url": "https://ledsone.co.uk",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ledsone.co.uk/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### Block 2 — Organization/LocalBusiness (line 162)
```json
{
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "name": "LEDSone UK Ltd",
  "url": "https://ledsone.co.uk",
  "telephone": "02477220687",
  "address": { "streetAddress": "Unit 3, Green Industrial Estate...", "addressLocality": "Coventry", "postalCode": "CV2 2NW", "addressCountry": "GB" },
  ...
}
```

### Block 3 — WebSite (2026 updated, line 222)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "LEDSone UK Ltd",
  "url": "https://ledsone.co.uk",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": "https://ledsone.co.uk/search?q={search_term_string}" },
    "query-input": "required name=search_term_string"
  }
}
```

**Pre-existing risk: WebSite schema is duplicated (Blocks 1 and 3 are both WebSite). This is outside Task 7 scope but should be flagged to GPT.**

---

## SECTION 4 — Current Schema State Per Page

### A. Main page — /collections/conduit-lighting

**Template:** `collection.collection-pipe.json`

| Schema | Present? | Source | Notes |
|---|---|---|---|
| WebSite | YES × 2 | `theme.liquid` lines 148 + 222 | Duplicate — pre-existing issue |
| Organization/LocalBusiness | YES × 1 | `theme.liquid` line 162 | Correct |
| BreadcrumbList | **NO** | `sections/breadcrumb.liquid` | Breadcrumb section NOT in collection-pipe template |
| ItemList | **NO** | `sections/main-collection-product.liquid` | Section IS in template but `"disabled": true` |
| FAQPage | **CONDITIONAL** | `snippets/product-faq-ui.liquid` | Outputs only if `collection.metafields.custom.faq_schema` is populated — pending Arudchelvi |

**Visual breadcrumb** (Home / Conduit Lighting) is present — rendered by `main-collection-heading` → `{% render 'breadcrumbs' %}` snippet. That snippet is visual only; it does NOT output BreadcrumbList JSON-LD.

### B. Duplicate page — /collections/conduit-lightings

**Template:** `collection.conduit-lighting-pk.json`

| Schema | Present? | Source | Notes |
|---|---|---|---|
| WebSite | YES × 2 | `theme.liquid` | Same as main page |
| Organization/LocalBusiness | YES × 1 | `theme.liquid` | Same as main page |
| BreadcrumbList | **NO** | — | Breadcrumb section not in template either |
| ItemList | **YES** | `sections/main-collection-product.liquid` | `"disabled": false` in conduit-lighting-pk — this is the key difference |
| FAQPage | **CONDITIONAL** | `snippets/product-faq-ui.liquid` | Same metafield condition as main page |

---

## SECTION 5 — Comparison: Main vs Duplicate

| Attribute | Main (/conduit-lighting) | Duplicate (/conduit-lightings) |
|---|---|---|
| Template | `collection-pipe` | `conduit-lighting-pk` |
| Active product grid | `collection-meta-filters` (custom filter UI) | `main-collection-product` (standard grid) |
| ItemList schema | NO — main-collection-product **disabled** | YES — main-collection-product **enabled** |
| BreadcrumbList schema | NO | NO |
| FAQPage | Conditional on metafield | Conditional on metafield |
| Visual breadcrumb | YES (from main-collection-heading) | YES (from main-collection-heading) |
| Products listed | Same products (same Shopify collection handle resolves for both) | Same products |
| Canonical tag | Could not confirm via web fetch (JS-rendered page) — must verify in Shopify admin | Same risk |

**Why ItemList exists on duplicate but not main:**
The duplicate uses `conduit-lighting-pk` template which has `main-collection-product` **enabled**. The main page uses `collection-pipe` which has `main-collection-product` **disabled** (because `collection-meta-filters` provides the product grid instead). The ItemList JSON-LD is embedded in `main-collection-product.liquid` lines 221–251 (added 2025-07-14 by piranav comment in file).

**Suitability of duplicate's ItemList for reuse:**
The code in `main-collection-product.liquid` is suitable to copy. It already:
- Uses `collection.title` for the list name
- Uses `request.origin | append: collection.url` for absolute URL
- Uses `collection.products_count` for numberOfItems
- Uses `request.origin | append: product.url` for absolute product URLs
- Includes product image, price, and availability

However, it cannot be reused by simply enabling `main-collection-product` in the collection-pipe template — that would also render the standard product grid UI, which conflicts with `collection-meta-filters`. The JSON-LD must be extracted and added separately.

---

## SECTION 6 — ItemList Implementation Design

**Approach: Add a schema-only custom-liquid section to collection-pipe.**

Extract the ItemList JSON-LD from `main-collection-product.liquid` (lines 221–251) into a new dedicated snippet: `snippets/collection-itemlist-schema.liquid`.

Call it from a new custom-liquid section in `collection.collection-pipe.json`.

**Why a snippet not inline custom-liquid:** Keeps the template JSON clean. Snippet is reusable for other collections. Consistent with existing pattern (`product-faq-ui.liquid` is also a schema snippet).

**Proposed snippet content (no changes to existing files):**
```liquid
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": {{ collection.title | json }},
  "url": {{ request.origin | append: collection.url | json }},
  "numberOfItems": {{ collection.products_count }},
  "itemListElement": [
    {% for product in collection.products %}
      {
        "@type": "ListItem",
        "position": {{ forloop.index }},
        "item": {
          "@type": "Product",
          "name": {{ product.title | json }},
          "url": {{ request.origin | append: product.url | json }},
          "image": [
            {{ product.featured_image | image_url: width: 800 | prepend: "https:" | json }}
          ],
          "offers": {
            "@type": "Offer",
            "priceCurrency": "{{ shop.currency }}",
            "price": "{{ product.price | money_without_currency | replace: ',', '' }}",
            "availability": "https://schema.org/{% if product.available %}InStock{% else %}OutOfStock{% endif %}"
          }
        }
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
}
</script>
```

**Risk — product count limit:** Shopify Liquid's `collection.products` returns up to 250 products. If conduit-lighting has >250 products, the ItemList will be capped at 250. This is a Liquid platform limitation and acceptable for schema purposes.

---

## SECTION 7 — BreadcrumbList Implementation Design

**Current state:** No BreadcrumbList JSON-LD on either page. Visual breadcrumb is present (from `main-collection-heading` → `breadcrumbs` snippet — visual only).

**The existing `breadcrumb` section** already outputs correct BreadcrumbList JSON-LD for collections (lines 61–67 of `sections/breadcrumb.liquid`). It handles the `collection` template case correctly:
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ledsone.co.uk" },
    { "@type": "ListItem", "position": 2, "name": "Conduit Lighting", "item": "https://ledsone.co.uk/collections/conduit-lighting" }
  ]
}
```

**Problem:** Adding the `breadcrumb` section to collection-pipe would also render a second visual breadcrumb on the page (the section renders `{% render 'breadcrumbs' %}` visually in addition to the JSON-LD). This would create a duplicate visual breadcrumb.

**Recommended approach:** Create a new snippet `snippets/collection-breadcrumb-schema.liquid` containing ONLY the BreadcrumbList JSON-LD block (no visual output). Add it via a custom-liquid section in collection-pipe.

**Proposed snippet content:**
```liquid
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": {{ shop.url | json }}
    }
    {%- if collection and collection.handle -%}
    ,{
      "@type": "ListItem",
      "position": 2,
      "name": {{ collection.title | json }},
      "item": {{ request.origin | append: collection.url | json }}
    }
    {%- endif -%}
  ]
}
</script>
```

---

## SECTION 8 — FAQPage Status

**CONFIRMED LIVE — 2026-10-09**

`product-faq-ui.liquid` is wired in collection-pipe via `custom_liquid_3pi7zt`. The metafield `collection.metafields.custom.faq_schema` is populated for conduit-lighting. Five FAQs are rendering correctly in the theme editor and on the live page. No implementation work needed.

FAQs live:
1. What conduit pipe sizes are available?
2. What bulb fitting are the lamp holders compatible with?
3. What finishes are available for the lamp holders and fittings?
4. Can I build a complete light fitting using these components?
5. Are the pendant lights compatible with a dimmer switch?

---

## SECTION 9 — Duplicate and Conflict Risks

| Risk | Description | Severity | Resolution |
|---|---|---|---|
| WebSite schema duplicate | `theme.liquid` has 2× WebSite blocks (lines 148 and 222). Present on ALL pages. | Medium | Out of Task 7 scope. Flag to GPT for separate fix. |
| ItemList on duplicate, not on main | Inconsistency — duplicate has ItemList, main does not. After Task 7 implementation, both will have it. | Medium | Resolved by Task 7 implementation |
| BreadcrumbList absent from both pages | Neither page currently has BreadcrumbList JSON-LD despite having visual breadcrumbs | High | Resolved by Task 7 implementation |
| Enabling main-collection-product in collection-pipe | Would render UI conflict with collection-meta-filters | High | Must NOT enable the section — use snippet approach instead |
| collection.products Liquid limit | ItemList capped at 250 products by Shopify Liquid | Low | Acceptable; standard platform limitation |
| FAQPage with no FAQs | If metafield is blank, no FAQPage renders — this is correct behaviour | None | Not a risk |

---

## SECTION 10 — Canonical Tag Status

The canonical tag for both URLs was not directly confirmed via web fetch (page is Shopify-rendered, JS-dependent). This must be verified in Shopify admin.

**What to check:**
- In Shopify admin → Online Store → Preferences — Shopify auto-generates canonical tags for all collection pages
- Verify: does `/collections/conduit-lightings` have a canonical pointing to `/collections/conduit-lighting`?
- If not, the duplicate URL may be indexed and competing with the main — separate SEO issue, out of Task 7 scope

---

## SECTION 11 — Validation Plan

### After implementation, validate with:

**1. Google Rich Results Test** (https://search.google.com/test/rich-results)
- Test URL: `https://ledsone.co.uk/collections/conduit-lighting`
- Expected detectable types: none guaranteed (ItemList and BreadcrumbList are not always eligible for rich results on collection pages)
- Confirms: syntax validity, schema detection, any errors or warnings

**2. Schema Markup Validator** (https://validator.schema.org)
- Test URL: `https://ledsone.co.uk/collections/conduit-lighting`
- Confirms: full JSON-LD syntax correctness, schema.org type validity

**3. Browser DevTools — manual JSON-LD inspection**
- Open DevTools → Elements → search `application/ld+json`
- Confirm: all expected blocks present, no malformed JSON, correct product URLs
- Count: should have WebSite×2, Organization×1, ItemList×1, BreadcrumbList×1, FAQPage×1 (when live)

**Important distinction:**
- Schema syntax valid ≠ eligible for Google rich result
- BreadcrumbList on collection pages may or may not produce a breadcrumb rich result in SERPs — this depends on Google's crawl and eligibility criteria, not just the schema being present
- No ranking improvement or rich result display can be promised

---

## SECTION 12 — Recommended Minimal Implementation (Awaiting Approval)

**Files to create (new snippets):**
1. `snippets/collection-itemlist-schema.liquid` — ItemList JSON-LD only
2. `snippets/collection-breadcrumb-schema.liquid` — BreadcrumbList JSON-LD only

**Files to modify:**
1. `templates/collection.collection-pipe.json` — add two new custom-liquid sections calling the above snippets
   - Position: before `custom_liquid_3pi7zt` (FAQ Schema section) so all schema blocks are grouped at the end of the template

**Files NOT to modify:**
- `sections/main-collection-product.liquid` — do not change
- `sections/collection-meta-filters.liquid` — do not change
- `layout/theme.liquid` — do not change (WebSite duplicate fix is a separate task)
- `snippets/product-faq-ui.liquid` — do not change

**FAQPage:** No implementation work needed. Awaiting Arudchelvi metafield population.

---

## SECTION 13 — Evidence References

| Item | Location |
|---|---|
| ItemList source code | `sections/main-collection-product.liquid` lines 221–251 |
| BreadcrumbList source code | `sections/breadcrumb.liquid` lines 15–98 |
| FAQPage mechanism | `snippets/product-faq-ui.liquid` lines 1–65 |
| Global schema | `layout/theme.liquid` lines 147–237 |
| Main template | `templates/collection.collection-pipe.json` |
| Duplicate template | `templates/collection.conduit-lighting-pk.json` |
| Live page products (main) | 10 products confirmed via web fetch — relative URLs use `/collections/conduit-lighting/products/...` |
| Live page products (duplicate) | 10 products confirmed via web fetch — same products, different collection path in URL |

---

## SECTION 14 — Status (updated 2026-10-09 post-push)

| Schema | Main page now | Reason | Action |
|---|---|---|---|
| WebSite ×2 | LIVE (pre-existing duplicate) | theme.liquid — out of scope | None |
| Organization/LocalBusiness | LIVE | theme.liquid | None |
| FAQPage | **LIVE** | metafield populated — Arudchelvi confirmed | None — complete |
| ItemList | UNCLEAR — snippet not pushed | collection-itemlist-schema.liquid missing from Shopify | Push snippet file |
| BreadcrumbList | **ABSENT** — Liquid error | collection-breadcrumb-schema.liquid missing from Shopify | Push snippet file |

## SECTION 15 — Template Placement Finding and Resolution (2026-10-09)

### What the screenshot confirmed

Piranav manually added a Custom Liquid section (`{% render 'collection-breadcrumb-schema' %}`) in the Shopify theme editor. The screenshot confirms it was placed in the **`collection-pipe`** template (draft theme "promotion week 4.2 Mega di..."). The section appears in the left sidebar as "collection-breadcrumb-sch...".

### Local vs Shopify state after Piranav's manual addition

| Item | Local (working tree) | Shopify (draft theme) |
|---|---|---|
| `collection.collection-pipe.json` | Had `schema_breadcrumb` (our previous implementation) | Had our `schema_breadcrumb` PLUS Piranav's manually-added section → potential duplicate |
| `snippets/collection-breadcrumb-schema.liquid` | EXISTS — correct, schema-only | Not yet pushed — Liquid error confirmed this |
| `snippets/collection-itemlist-schema.liquid` | EXISTS — correct, schema-only | Likely not pushed — same root cause |

### Piranav's instruction

"I do NOT want this schema section added to `templates/collection.collection-pipe.json`. Do not add another instance there."

Interpretation: the `schema_breadcrumb` section added by our previous implementation must be removed from the local `collection.collection-pipe.json`. Piranav's manually-added section in the Shopify theme editor is the intended live version.

### Action taken

Removed `schema_breadcrumb` from local `collection.collection-pipe.json`. Verified:
- `schema_breadcrumb` no longer in sections or order
- `schema_itemlist` (ItemList) remains — enabled
- `custom_liquid_3pi7zt` (FAQ Schema) remains — last in order
- `product-grid` remains disabled
- JSON valid

### Critical sync risk — READ BEFORE NEXT PUSH

**If Piranav pushes the local `collection.collection-pipe.json` to Shopify, it will OVERWRITE Shopify's version — removing the manually-added breadcrumb section.**

Before any push of `collection.collection-pipe.json`, Piranav must first pull the current Shopify theme to sync the manual addition into the local file:
```
shopify theme pull --only templates/collection.collection-pipe.json
```
Then commit the pulled version before pushing other changes.

### Snippet push still required

`collection-breadcrumb-schema.liquid` exists locally but is NOT in Shopify (confirmed by Liquid error). It must be pushed separately:
```
shopify theme push --only snippets/collection-breadcrumb-schema.liquid snippets/collection-itemlist-schema.liquid
```
This is safe — schema-only files, no visual output, no duplicate risk.
