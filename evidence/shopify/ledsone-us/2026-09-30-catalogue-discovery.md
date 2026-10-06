# Evidence: LEDSone US Catalogue Discovery — Theme + Data

**Date:** 2026-09-30
**Session:** sinrasu AIOS session
**Requirement ID:** LEDSONE-US-CATALOGUE-DISCOVERY-2026-09-30
**Scope:** Two-phase discovery before any implementation — (A) theme structure, (B) product/variant data from PostgreSQL
**Status:** PASS

---

## Phase A — Theme Discovery

### Theme Identity
- **Theme:** Umino v2.8.0
- **Author:** Nextsky / Blueskytechco
- **CSS namespace:** `bls__` prefix throughout
- **JS namespace:** `BlsEventCollectionShopify` object in `assets/collection.js`
- **Grid system:** Bootstrap (`row`, `col-*`, `container`, `container-fluid`)
- **Product style variants:** 5 (`bls__product-style-1` through `bls__product-style-5`) — confirmed in `config/settings_schema.json`

### Collection Templates (3 present)
| Template file | Purpose |
|---|---|
| `templates/collection.json` | Default — all collections |
| `templates/collection.pendtents-collection.json` | Pendant lights — adds sub-collection list |
| `templates/collection.bulb.json` | Bulb collection — heading section disabled |

All 3 templates share identical active section structure:
`main-collection-heading` → `main-collection-product` (with `filter_by_dynamic` block active) → description liquid → review buttons → subscribe form

### Main Collection Section
- **File:** `sections/main-collection-product.liquid`
- **Grid:** 5 columns (`products_column: 5`), 24 products per page
- **Pagination:** `infinit_scrolling`
- **Sidebar position:** `dropdonw_sidebar` (dropdown)
- **View modes:** Grid only (`enable_list_view: false`)
- **Schema blocks supported:** `categories`, `filter_by_tags`, `filter_by_dynamic` (limit 1), `popular_product`, `image_banner`
- **Filter_by_dynamic block:** ACTIVE in all 3 templates — Shopify S&D already wired

### Product Card
- **Canonical file:** `snippets/product-item.liquid`
- **Metafields referenced:**
  - `product.metafields.bls.custom_product_badge` (line 244)
  - `product.metafields.custom.external_affiliate` (line 427)
- **Color swatch detection:** `snippets/product-color-swatches.liquid` — matches option name against `settings.option_name_color`
- **Variant JSON emitted to DOM:** lines 667–685

### Filter Sidebar
- **File:** `snippets/collection-sidebar.liquid`
- **Filter types supported:** categories (menu), tag-based (URL routing), dynamic (S&D `collection.filters`), price range slider
- **Color/size detection:** `filter.label` compared against `settings.option_name_color` / `settings.option_name_size`
- **Dynamic filter rendering:** lines 209–449 — checkboxes for `list` type, dual slider for `price_range` type

### Reuse Decision
**EXTEND** — do not create new Liquid sections. Create one new `collection.catalogue.json` template file only. All Liquid infrastructure (section, sidebar, product card) is ready.

---

## Phase B — PostgreSQL Data Discovery

### 1. Source and Schema

| Detail | Value |
|---|---|
| Database | PostgreSQL via `ledsone-db-mcp` |
| Schema | `listings` |
| Tables used | `shopify_listings`, `shopify_collections`, `shopify_collection_products` |
| Sub_source (LEDSone US) | 245 |
| Total rows (sub_source 245) | 1,613 |
| Parent products | 316 (is_parent = 1 with selected_variations) |

**Join note:** `shopify_collection_products.product_id` is bigint; `shopify_listings.item_id` is varchar. Cast required: `sl.item_id::bigint`.

### 2. Data Freshness

- `last_sync`: **2026-09-30** (synced today — data is current)

### 3. Collections Inspected (19 US collections)

| Collection | Handle | Product Count |
|---|---|---|
| All Products US | all-products-us / all-products | largest |
| Pendant Lights | pendant-lights | 61 |
| Lamp Shades | lamp-shades | 19 |
| Lighting Accessories | lighting-accessories | 20 |
| Fabric Electrical Cable US | fabric-electrical-cable-us | 13 |
| Semi Flush Mount | semi-flush-mount-ceiling-lights | 12 |
| Spider Light | spider-light | 7 |
| Wall Lights | wall-lights-us | 9 |
| Bulb Lights | bulbs / bulb-lights | 10 |
| Flush Mount Ceiling Lights | flush-mount-ceiling-lights | (present) |
| Single Pendant Lights | single-pendant-lights | (sub-collection) |
| Pendant Lights With Plug | pendant-lights-with-plug | (sub-collection) |
| + 7 others | various | various |

### 4. Product/Variant Examples

**Multi-option (3 options):**
- *E26 Conduit Mount Pipe Pendant Lighting* — Colour (Green/Grey/Yellow) × Size (80cm/50cm/30cm) × RequiredBulb (Yes/No)
- *Exposed Conduit Hanging Light Fixture* — Colour × Size × RequiredBulb
- *Industrial Conduit Wall Light* — Colour × Required Terminal Box × Required Bulb

**Multi-option (2 options — most common pattern):**
- *40cm Large Dome Shaded Hemp Rope Pendant Light* — Colour (Black/Black Inner Gold) × Bulb (Yes/No)
- *Wire Cage Wall Sconce* — Color (Black/Brushed Silver/Brushed Copper/Rustic Red) × Required Bulb (Yes/No)
- *Chain Hung Pendant Light* — Colour (11 values: Cyan blue/Brushed Silver/Burgundy/Black/etc) × Title (With Bulb/Without Bulb)

**Single option:**
- *Flush Mount Ceiling Light E26* — color (Chrome/Black/Rose Gold)
- *Strain Relief Piece* — Colour × Pack (1/5/10/50/100 Pcs)

### 5. Option-Name Consistency Analysis

**38 distinct option name strings** found across 316 US parent products for what are semantically only 3–4 concepts:

| Semantic Concept | Variant Name Strings Found | Notes |
|---|---|---|
| **Color** | `color` (107), `Colour` (32), `Color` (4), `Shade Colour` (7), `Colur` (1 — typo), `Lamp Colour` (1), `Holder Colour` (1), `Farbe` (German), `Schattenfarbe` (German) | 9 name strings for one concept |
| **Bulb Included?** | `Bulb` (many), `Required Bulb`, `RequiredBulb`, `Required the bulbs?`, `Required a Bulb?`, `Required a bulb?`, `Title` (values: With Bulb/Without Bulb), `Birne` (German), `Brauchen Sie Glühbirnen?`, `Benötigt eine Glühbirne?`, `Erforderlich eine glühbirne?`, `style` (values: With out Bulb/With Bulb) | 12+ name strings. Worst fragmentation. |
| **Pack Quantity** | `Pack`, `size` (used as pack e.g. "1 Pack"), `Quantity` | Mixed with size concept |
| **Size / Length** | `Size`, `size` | 2 variants |
| **Type / Style** | `Type`, `style`, `Outlet` | Inconsistent semantic use |

**German-language contamination confirmed:** `Farbe`, `Schattenfarbe`, `Birne`, `Brauchen Sie Glühbirnen?`, `Benötigt eine Glühbirne?`, `Erforderlich eine glühbirne?` — products appear to be synced from the DE/FR store into the US sub_source.

### 6. Option-Value Examples

**Color values (normalised cross-product):**
Black, Brushed Silver, Brushed Copper, Rustic Red, Chrome, Rose Gold, Yellow Brass, Satin Nickel, Cyan blue, Burgundy, Brushed Brass, Green, Grey, Yellow, White, Orange, Red, Blue, Dark Blue, Light Blue, Black Inner White, Black Inner Gold

**Bulb values:**
Yes / No (most common), With Bulb / Without Bulb, Ja / Nein (German), Mit Glühbirne / Ohne Glühbirne (German)

**Pack values:**
1 Pack, 2 Pack, 3 Pack, 6 Pack, 1 Pcs, 5 Pcs, 10 Pcs, 50 Pcs, 100 Pcs

**Size values:**
20cm, 30cm, 40cm, 50cm, 80cm

### 7. Filter Feasibility via Shopify S&D

**Verdict: CONDITIONAL PASS — feasible but requires normalization pre-work**

| Filter Type | Auto-Generate from S&D? | Condition |
|---|---|---|
| Color filter | YES — if option names standardised | Currently generates 9 separate filter groups for "color" concept |
| Bulb Included? | PROBLEMATIC — 12+ name strings | S&D will create 12 separate filter dropdowns for the same concept |
| Pack Quantity | PARTIAL — possible per-product | Fragmented; needs normalization |
| Size / Length | YES for products that have it | Small product count affected |
| Price range | YES — native S&D, no normalization needed | Already wired |

**Root cause:** Shopify S&D `collection.filters` generates one filter group per unique `option.name` on the Shopify product. If LEDSone US Shopify products have the same inconsistency as the PostgreSQL mirror, then without standardising variant option names in Shopify Admin, S&D will generate fragmented filter groups.

**Action required before filter setup:**
1. Audit actual Shopify variant option names via Shopify Admin (or Shopify MCP when authorized)
2. Bulk-rename inconsistent option names to: `Colour`, `Bulb Included`, `Pack`, `Size`
3. Configure S&D option name mappings in Shopify Admin → Search & Discovery app
4. Then `filter_by_dynamic` block (already wired) will auto-generate clean filter groups

### 8. Data Limitations

| Limitation | Impact |
|---|---|
| PostgreSQL is a mirror, not canonical | Shopify Admin is the source of truth for actual variant names. PostgreSQL reflects what was synced — discrepancies possible. |
| `listing_attributes` table: no `listing_id` column | Alternative FK unknown — table not usable with current schema. No structured attribute data available. |
| German-language data in US sub_source | ~7 products with German option names appear in US collections — contamination from multi-market sync |
| Large draft product count | Many products with `status = 'draft'` — filter feasibility only applies to active (published) products |
| No metafield data in PostgreSQL | Structured attributes (wattage, IP rating, etc.) not available in sync tables — cannot assess additional filter dimensions |

### 9. Evidence / Query References

All queries run via `ledsone-db-mcp` MCP tool on 2026-09-30.

| Query | Result |
|---|---|
| `SELECT sub_source, COUNT(*) ... WHERE sub_source = 245` | 1,613 rows confirmed |
| `SELECT * FROM listings.shopify_collections WHERE sub_source = 245` | 19 collections returned |
| `SELECT v->>'Name', COUNT(*) FROM shopify_listings, jsonb_array_elements(selected_variations)` | 38 distinct option names |
| `SELECT title, selected_variations ... JOIN shopify_collection_products` (per collection) | Wall Light 9, Pendant 61, Bulb 10, Lamp Shades 19, Accessories 20 products |
| Multi-option query `jsonb_array_length >= 2` | 25 multi-option products with full JSONB returned |

**Known errors during session:**
- `column ss.site does not exist` — fixed by querying `listings.shopify_listings` directly
- `operator does not exist: bigint = character varying` — fixed with `sl.item_id::bigint` cast
- `listing_attributes.listing_id does not exist` — table schema unknown; skipped

### 10. PASS / FAIL Verdict

**Phase A (Theme Discovery): PASS**
- All 20 discovery questions answered
- Reuse decision confirmed: EXTEND (new template JSON only)
- S&D already wired — `filter_by_dynamic` block active in all 3 collection templates
- No theme files modified

**Phase B (Data Discovery): CONDITIONAL PASS**
- PostgreSQL data confirmed current (synced today)
- 19 collections, 316 parent products, 38 option name strings analysed
- Filter feasibility determined: CONDITIONAL — requires variant option name normalization in Shopify Admin first
- German-language contamination in US store data flagged as risk
- Discovery complete. Implementation cannot proceed until option name audit and normalization is done.

**Overall session result: PASS**

---

## Phase C — Variant Option Normalization Discovery (Phase 2A)

**Date:** 2026-09-30
**Phase:** 2A — DISCOVERY ONLY. NO SHOPIFY CHANGES.
**Req ID:** LEDSONE-US-PHASE2A-NORMALIZATION-2026-09-30

### Summary of Findings

- 38 distinct option name strings confirmed across 316 parent products
- Full normalization mapping table produced with confidence ratings
- 29 option names identified as high-confidence renames (Section B of report)
- 7 ambiguous mapping groups identified requiring GPT Brain decision (Section C)
- 6 products identified requiring structural variant restructuring (not just rename)
- Data quality issues catalogued: typos, German contamination, embedded multi-concept values, inconsistent value formats
- Full report: `reports/ledsone-us-phase2a-normalization-mapping-2026-09-30.md`

### Canonical Filter Vocabulary (evidence-backed)

| Canonical Name | Products | Notes |
|---|---|---|
| `Colour` | ~145 | Largest filter. Includes colour + finish values across all name variants. |
| `Bulb Included` | ~120+ | Covers 15+ name variants. Values must be standardised to Yes/No. |
| `Pack Quantity` | ~25–30 | Lamp/bulb/shade products only. Excludes cable length variants. |
| `Cable Length` | ~15 | Fabric cable products only. |

### STOP Conditions Triggered

1. `color` field (107 products) — 17 products have non-colour values that cannot be renamed without product-level decision
2. `Title` field (82 products) — "Default Title" must be excluded; only With/Without Bulb products map to `Bulb Included`
3. `Type` field (3 products) — 3 completely different meanings
4. `Pack`/`Size` ambiguity — cable length vs quantity requires product-type split
5. `style` field (2 products) — 2 different meanings
6. 6 products with colour+bulb encoded inside single variant values — need structural fix, not rename

**Phase 2A result: PASS — Discovery complete. Pending GPT Brain decisions on Section C before Phase 2B implementation.**

---

## Phase 2B — Shopify Admin Change Plan

**Date:** 2026-09-30
**Phase:** 2B — CHANGE PLAN ONLY. NO SHOPIFY CHANGES PERFORMED.
**Req ID:** LEDSONE-US-PHASE2B-CHANGEPLAN-2026-09-30
**Data source:** PostgreSQL `listings.shopify_listings` (sub_source = 245), synced 2026-09-30

### GPT Brain Approved Decisions

| Decision | Approved |
|---|---|
| Colour — canonical name for colour concept | YES |
| Bulb Included — canonical name for bulb concept | YES |
| Pack Quantity — canonical name for quantity concept | YES |
| Cable Length — canonical name for cable length concept | YES |
| Shade Colour → Colour | YES |
| Holder Colour → Colour | YES |
| Type option — DO NOT NORMALIZE | YES |
| Default Title (82 products) — DO NOT treat as filter | YES |
| style — handle individually per product | YES |
| Pack/Size — context-specific, no bulk rename | YES |
| 6 combined-value products — DO NOT restructure yet | YES |

### Change Plan Summary

**Full report:** `reports/ledsone-us-phase2b-shopify-change-plan-2026-09-30.md`

| Section | Count | Description |
|---|---|---|
| A — Safe renames | ~165 products | Option name changes: color→Colour, Bulb variants→Bulb Included, Pack/Length safe renames, style individual treatment |
| B — Value normalization | ~20 products | With Bulb→Yes/No, German translation, PACK→Pack, pack casing |
| C — Context-split | ~23 products | Pack→Cable Length (cables) vs Pack→Pack Quantity (lamps), Size→Cable Length (cables) |
| D — Excluded | ~19 specific + 82 Default Title | 6 combined-value, Type products, config values, null values, ambiguous |
| E — High-risk | 5 categories | URL risk on active product renames; value change on active variants |

### Key Evidence Points

- `color` (107 products): ~86 clean → rename to `Colour`; 17 excluded or context-split
- Bulb concept: 14 distinct option name variants mapped to `Bulb Included` across ~45 products
- German products: 2 Colour translations + 4 Bulb translations with full value mapping
- `Pack` cable products (10): rename to `Cable Length`
- `Pack` lamp/bulb products (11): rename to `Pack Quantity`
- `Size` cable products (2): rename to `Cable Length`
- `Size` fixture products (2): excluded — too few for filter

**Phase 2B result: PASS — Change plan complete. Awaiting Piranav manual execution in Shopify Admin.**

---

## Phase 3 — Catalogue Template Implementation

**Date:** 2026-09-30
**Phase:** 3 — IMPLEMENTATION. Template file created locally. NOT yet pushed to Shopify via CLI.
**Req ID:** LEDSONE-US-PHASE3-CATALOGUE-TEMPLATE-2026-09-30

### File Created

`shopify_projects/ledsone us/templates/collection.catalogue.json`

### Architecture Decision

**Approach:** Reuse existing section types — identical to existing collection templates. One new JSON file only. No Liquid modifications.

**Sections (7 total):**

| Section Key | Type | Status | Purpose |
|---|---|---|---|
| `catalogue-heading` | `main-collection-heading` | enabled | Dynamic collection title — reads `collection.title` automatically |
| `catalogue-product-grid` | `main-collection-product` | enabled | Product grid with `filter_by_dynamic` block — renders `collection.products` |
| `catalogue-sub-collection` | `sub-collection` | disabled | Child collection carousel — merchant can enable per collection |
| `catalogue-divider` | `divider` | enabled | Visual separator |
| `catalogue-description` | `custom-liquid` | enabled | Renders `collection.description` if present (SEO) |
| `catalogue-reviews` | `custom-html` | enabled | Google + Trustpilot review buttons (brand consistency) |
| `catalogue-subscribe` | `subscribe-form` | enabled | Email signup |

**Sections excluded vs default collection.json (all were disabled demo data):**
- `lookbook` — required hardcoded product handle (`3-light-cage-pendant-light-black`)
- `collection-list` blocks with hardcoded clothing slugs (`women-s-shirts`, `top-dresses`, etc.) — Umino theme demo leftover
- `spacing` decorative section — not needed

**Product grid key settings:**
- `products_column: 4` (vs 5 in default — better density with filter sidebar visible)
- `number_products_grid: 24`
- `pagination: infinit_scrolling`
- `sidebar_position: dropdonw_sidebar`
- `filter_by_dynamic` block active — Shopify S&D filters will auto-generate from normalized option names

### Static Validation Results

| Check | Result |
|---|---|
| JSON parses without errors | PASS — `python json.load()` successful |
| All 7 sections present in `sections` and `order` | PASS |
| `order` array length matches `sections` dict keys | PASS — 7/7 |
| No hardcoded product handles | PASS |
| No hardcoded collection handles | PASS |
| `filter_by_dynamic` block present and enabled | PASS |
| `main-collection-product` type matches existing templates | PASS |
| No existing templates modified (git diff shows no changes) | PASS |
| Whole templates folder untracked (ledsone us = local theme) | CONFIRMED |

### Reuse Evidence

| Component | Reused from | Verified |
|---|---|---|
| `main-collection-heading` section type | All 3 existing collection templates | YES |
| `main-collection-product` section settings | Copied from default collection.json | YES |
| `filter_by_dynamic` block | Active in all 3 existing templates | YES |
| `sub-collection` type + settings | Copied from default collection.json | YES |
| `divider` settings | Copied from default collection.json | YES |
| `custom-liquid` description liquid | Copied from default collection.json | YES |
| `custom-html` review buttons | Copied from pendant collection.json (US Google link) | YES |
| `subscribe-form` settings | Copied from default collection.json | YES |
| Colour scheme ID | `scheme-d127e173-a562-42f4-a41e-3483b672d918` from default collection heading | YES |

### Known Limitations

1. **Live browser test not yet possible** — template must be pushed via `shopify theme push` (or Shopify CLI) before it can be assigned to a collection and tested in a browser.
2. **Filter sidebar depends on variant option name normalization** — if Phase 2B changes not yet executed in Shopify Admin, S&D filters will still be fragmented (38 option names instead of 4 canonical groups). Template is correct; filter quality depends on Phase 2B execution.
3. **`sub-collection` section is disabled** — if a collection has child sub-collections, a merchant must enable this section in Shopify Theme Editor per collection.
4. **Review buttons link to ledsone.co.uk Trustpilot** — currently matches the existing default template. If LEDSone US has a separate Trustpilot profile, the URL in `catalogue-reviews` should be updated.
5. **`products_column: 4`** — changed from 5 (default) to 4. Rationale: filter sidebar takes horizontal space; 4 columns provides better card sizing. This is a theme editor setting and can be changed by merchant without code change.

### Next Steps

1. Push via `shopify theme push --store [store-domain] --theme [theme-id]`
2. In Shopify Admin → Online Store → Navigation / Collections → assign `catalogue` template to target collections
3. Visit collections in browser — confirm products load, filters appear, sorting works
4. After Phase 2B execution: verify S&D filter groups show `Colour`, `Bulb Included`, `Pack Quantity`, `Cable Length`

**Phase 3 result: PASS (static) — Template file created and validated. Live browser test pending CLI push.**

---

## Phase 3B — Architecture Correction: One-Page Catalogue Design

**Date:** 2026-09-30
**Phase:** 3B — ARCHITECTURE REPORT. NO IMPLEMENTATION YET. Pending GPT Brain approval.
**Req ID:** LEDSONE-US-PHASE3B-ARCHITECTURE-2026-09-30

### Requirement Correction

Business requirement clarified: ONE catalogue page/experience where the customer switches between collections within a single unified UI. NOT separate collection templates per collection.

### Critical Constraint Discovered

`main-collection-product.liquid` uses `collection.products` (line 112) — the `collection` Liquid object only exists on collection pages (`/collections/handle`). It is nil on page templates (`/pages/catalogue`). The existing S&D `collection.filters` object is also collection-page-only.

The existing `collection-tab.liquid` section works on page templates but is limited to 20 products/tab, max 5 tabs, and has NO S&D filter support — too limited for a real catalogue.

### Architecture Decision

**Recommended: Collection Template + Cross-Collection Navigation Strip**

- `collection.catalogue.json` (already created) is KEPT and CORRECT
- A new `sections/catalogue-navigation.liquid` is added — renders a horizontal tab/link strip reading from a Shopify Navigation menu (`linklists['catalogue-nav']`)
- Each catalogue collection URL (`/collections/wall-lights`, etc.) uses the catalogue template
- Active tab is detected from `collection.handle` in Liquid — no JS required
- Full S&D filters, sorting, infinite scroll work natively (we're on a collection page)
- Merchant manages collection list via Shopify Admin → Navigation menu (no code change)

### Files Expected

| File | Action |
|---|---|
| `sections/catalogue-navigation.liquid` | CREATE NEW — nav strip section |
| `templates/collection.catalogue.json` | MODIFY — add nav section to order |

### Status

APPROVED — implemented.

---

## Phase 3B — Catalogue Navigation Implementation

**Date:** 2026-09-30
**Phase:** 3B — IMPLEMENTATION COMPLETE (static). NOT yet pushed to Shopify.
**Req ID:** LEDSONE-US-PHASE3B-IMPLEMENTATION-2026-09-30

### Files Created / Modified

| File | Action | Notes |
|---|---|---|
| `sections/catalogue-navigation.liquid` | CREATED | New section — reads `linklists['catalogue-nav']`, renders horizontal tab strip, active state from `collection.handle` |
| `templates/collection.catalogue.json` | MODIFIED | Added `catalogue-nav` section at position 1 (after heading, before product grid) |

### Section Architecture

**`catalogue-navigation.liquid` key behaviors:**

| Behavior | Implementation |
|---|---|
| Reads navigation menu | `linklists['catalogue-nav']` |
| Guard for empty menu | `if catalogue_nav != blank and catalogue_nav.links.size > 0` |
| Handle extraction from link URL | `link.url \| split: '/collections/' \| last \| split: '?' \| first \| split: '/' \| first` |
| Active state | `if collection != blank and collection.handle == link_handle` |
| Active CSS class | `.active` on the `<a>` element (matches `bls__collection-tab-item.active` theme CSS) |
| Accessibility | `aria-current="page"` on active item, `aria-label` on nav |
| XSS protection | `link.title \| escape` |
| Mobile horizontal scroll | `overflow-x: auto`, `scrollbar-width: none`, `-webkit-overflow-scrolling: touch` |
| CSS scoping | All styles prefixed with `#catalogue-nav-{{ section.id }}` |
| Umino class reuse | `bls__collection-tab-item`, `bls__section-heading`, `bls__collection-tab`, `bls__section-header`, `tab-header`, `tab-desgin-*` |
| Merchant management | Add/remove/reorder collections via Shopify Admin → Navigation → `catalogue-nav` menu |
| Tab style | Configurable 1–5 in schema — matches existing `collection-tab.liquid` design variants |

### Static Validation Results — All PASS

JSON valid, 8 sections, 8 in order, catalogue-nav at position 1, 13/13 Liquid checks pass, 0 unauthorized file changes.

### Known Limitations

1. **Live test pending** — requires `shopify theme push` before browser validation
2. **Merchant one-time setup required** — must create `catalogue-nav` navigation menu in Shopify Admin and assign `catalogue` template to each collection
3. **Handle extraction assumes `/collections/` URL pattern** — works for standard Shopify collection URLs; custom URL redirects may not match
4. **Tab style CSS** — `tab-desgin-*` class relies on existing theme CSS for visual variants; if the theme CSS doesn't include style variants beyond 3, styles 4/5 will fall back to default appearance

---

## Phase 4 — One-Page Catalogue Debug/Fix (2026-09-30)

**Req ID:** LEDSONE-US-CATALOGUE-DEBUG-2026-09-30

### Files Modified

| File | Change |
|---|---|
| `assets/catalogue-page.js` | 3 fixes — see below |
| `sections/catalogue-product-zone.liquid` | Added CSS preload for `collection.css` + `product.css` |

### Root Cause 1 — 404 on Section Fetch

**Symptom:** Network inspector shows HTTP 404 on `/collections/<handle>?section_id=catalogue-product-grid`

**Root cause:** `_loadCollection` was fetching `/collections/<handle>?section_id=catalogue-product-grid` without `?view=catalogue`. Shopify rendered the collection using its assigned template (typically the default `collection.json`). The key `catalogue-product-grid` does NOT exist in `collection.json` — it only exists in `collection.catalogue.json`. Shopify's section rendering API returns 404 when the requested section key is not in the rendered template.

**Fix (line 87):**
```js
// Before
var url = '/collections/' + handle + '?section_id=' + CATALOGUE_SECTION_ID;

// After
var url = '/collections/' + handle + '?view=catalogue&section_id=' + CATALOGUE_SECTION_ID;
```
`?view=catalogue` forces Shopify to render `collection.catalogue.json` regardless of the collection's assigned template, making `catalogue-product-grid` available for section rendering.

### Root Cause 2 — Filter/Sort Breaks After First Filter Action

**Symptom:** Filter/sort actions work on first collection load, then break (wrong URL or undefined handle).

**Root cause:** `_patchRenderUrl` was reading `handle` from `section.dataset.catalogueHandle` (a custom DOM attribute we set at inject time). Shopify's `renderSectionFilter` in `collection.js` replaces the entire `.section-collection-product` DOM node with a fresh one from the server on every filter update. That fresh node has no `data-catalogue-handle` attribute — Shopify does not know about our custom attribute. So `handle` became `undefined` after the first filter action.

Additionally, the patched `renderUrl` was returning `/collections/<handle>?section_id=...` without `?view=catalogue`, which would also produce 404 for the same reason as Root Cause 1.

**Fix (`_patchRenderUrl`):**
```js
// Before — reads from DOM (lost after renderSectionFilter replaces section)
var handle = section && section.dataset.catalogueHandle;
return '/collections/' + handle + '?section_id=' + sectionId + '&' + searchParams;

// After — reads from module closure (always current, survives DOM replacement)
if (_currentHandle) {
  return '/collections/' + _currentHandle + '?view=catalogue&section_id=' + sectionId + '&' + searchParams;
}
```

### Root Cause 3 — Injected Section Unstyled

**Symptom:** Injected product grid renders without proper styling.

**Root cause:** `main-collection-product.liquid` outputs `<link rel="stylesheet">` tags for `collection.css` and `product.css` at the TOP of the section HTML (before `.section-collection-product`). When `DOMParser.parseFromString(html, 'text/html').querySelector('.section-collection-product')` extracts the section div, the `<link>` tags land in the parsed document's `<head>` and are discarded. The catalogue page template has no other mechanism to load these stylesheets.

**Fix (`catalogue-product-zone.liquid`):**
Added explicit stylesheet preload tags so the CSS is always available before the first AJAX inject:
```liquid
{{ 'collection.css' | asset_url | stylesheet_tag }}
{{ 'product.css' | asset_url | stylesheet_tag }}
```

### Static Validation — Phase 4 Fix

| Check | Result |
|---|---|
| `?view=catalogue` present in `_loadCollection` fetch URL | PASS |
| `?view=catalogue` present in `_patchRenderUrl` return URL | PASS |
| `section.dataset.catalogueHandle` DOM read removed from patch | PASS — grep returns no matches |
| `_currentHandle` (closure) used in patch | PASS |
| `_currentHandle` set in `_loadCollection` before fetch | PASS |
| `collection.css` stylesheet tag in `catalogue-product-zone.liquid` | PASS |
| `product.css` stylesheet tag in `catalogue-product-zone.liquid` | PASS |
| No new files created | PASS — 2 existing files modified only |
| `collection.js` not modified | PASS — no changes |
| `main-collection-product.liquid` not modified | PASS — no changes |
| `templates/collection.catalogue.json` not modified | PASS — no changes |

**Phase 4 static: 11/11 PASS**

### Live Validation (pending CLI push)

| Check | Status |
|---|---|
| `/collections/<handle>?view=catalogue&section_id=catalogue-product-grid` returns 200 | PENDING |
| Products display correctly on first load | PENDING |
| Filter sidebar + S&D filters work | PENDING |
| Filter action does NOT break after first use | PENDING |
| Second filter action uses correct collection URL | PENDING |
| Sort dropdown updates products | PENDING |
| Collection tab switch loads different collection | PENDING |
| URL stays on `/pages/all-product-catalogue?collection=<handle>` throughout | PENDING |
| Browser Back/Forward navigates between collections | PENDING |
| Infinite scroll loads page 2 | PENDING |
| No console errors on load or after filter | PENDING |
| Product images and swatches styled correctly | PENDING |

**Phase 3B result: STATIC PASS — implementation complete, live test pending CLI push.**
