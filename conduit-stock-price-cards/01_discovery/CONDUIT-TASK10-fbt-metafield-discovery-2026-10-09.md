# CONDUIT TASK 10 — Frequently Bought Together: Metafield Discovery

**Date:** 2026-10-09
**Owner:** Piranav
**Deadline:** Friday, 16 October 2026, 18:00 SL
**Status:** DISCOVERY COMPLETE — awaiting implementation approval
**Prepared by:** Claude Code (sinrasu mode)

---

## SECTION 0 — AIOS Duplicate Check

Search completed across: `closure/`, `prompts/`, `evidence/`, `capability/`, `validation/`, `conduit-stock-price-cards/`.

**Result: No existing Task 10 documentation found.** This is the first record. Prompt saved to `prompts/shopify/conduit-fbt-metafield-discovery.md` before task execution (Rule 1 PASS).

---

## SECTION 1 — Files Inspected

| File | Type | Purpose |
|---|---|---|
| `snippets/frequently-bought.liquid` | Snippet | FBT UI + collection-based recommendation logic |
| `snippets/product-bought-together.liquid` | Snippet | Theme app extension bought-together (different metafield) |
| `sections/main-product.liquid` | Section | Product page section — renders FBT at line 1647 |
| `sections/related-products-app.liquid` | Section | App-based related products (disabled) |
| `templates/product.json` | Template | Default product template — FBT block active |
| `templates/product.conduit-people-also-bough.json` | Template | Conduit product template — no FBT block found |

---

## SECTION 2 — Full Render Chain

```
templates/product.json
  └── sections/main-product (type: main-product)
        ├── setting: bought_together = true  (line 57 + schema at line 1988)
        ├── line 1646: {% if bought_together %}
        │     └── {% render 'product-bought-together', st: st %}   ← theme app (bls.bought_together metafield)
        └── main-product block: custom_liquid_CnPLXD
              type: custom_liquid
              name: "frequently-bought"
              content: "{% render 'frequently-bought' %}"
              disabled: false
              position: 11 in block_order
              └── snippets/frequently-bought.liquid  ← OUR TARGET
```

**Key finding:** `frequently-bought.liquid` is NOT rendered via a section's `render` call in a `.liquid` file. It is called via a `custom_liquid` block inside the `main-product` section block in `templates/product.json`. The block name is `custom_liquid_CnPLXD`.

**`product.conduit-people-also-bough.json`:** Does NOT contain a `frequently-bought` custom_liquid block. FBT is absent on that template.

---

## SECTION 3 — Two Separate Bought-Together Systems

There are two distinct bought-together implementations in this theme. They are independent and must not be conflated.

| System | Snippet | Metafield | Who populates | Renders when |
|---|---|---|---|---|
| Theme app (BLS) | `product-bought-together.liquid` | `bls.bought_together` (comma-separated GIDs) | App/admin | `section.settings.bought_together = true` AND metafield populated |
| Custom FBT | `frequently-bought.liquid` | None (collection rules only) → **`custom.related_products` is the Task 10 target** | Piranav/staff | Always when collection rules match |

**Task 10 affects only `frequently-bought.liquid`.** Do not modify `product-bought-together.liquid` or `bls.bought_together`.

---

## SECTION 4 — Current Recommendation Logic (frequently-bought.liquid)

The snippet uses collection-membership rules to select which products to show.

### Step 1: Collection matching (lines 1–23)

```liquid
{% if product.collections contains collections['conduit-lightings'] %}
  {% assign matched_collection = collections['conduit-accessories'] %}
{% elsif product.collections contains collections['conduit-accessories'] %}
  {% assign matched_collection = collections['conduit-lightings'] %}
{% elsif product.collections contains collections['pipe-lighting'] %}
  {% assign matched_collections_array = 'pipe-lighting-accessories,easy-fit-shades' | split: ',' %}
{% elsif product.collections contains collections['plugin-lighting'] %}
  {% assign matched_collection = collections['diy-lighting-new'] %}
{% elsif product.collections contains collections['all-transformers'] %}
  {% assign matched_collection = collections['led-modules'] %}
{% elsif product.collections contains collections['pendant-lights'] %}
  {% assign matched_collections_array = 'easy-fit-shades,led-bulbs' | split: ',' %}
{% elsif product.collections contains collections['vintage-cables'] %}
  {% assign matched_collections_array = 'single-outlet-ceiling-rose,metal-holders' | split: ',' %}
{% elsif product.collections contains collections['single-outlet-ceiling-rose'] %}
  {% assign matched_collections_array = 'vintage-cables,metal-holders' | split: ',' %}
{% elsif product.collections contains collections['spider-light'] %}
  {% assign matched_collections_array = 'hooks-and-rings,wire-cage' | split: ',' %}
{% elsif product.collections contains collections['easy-fit-shades'] %}
  {% assign matched_collections_array = 'pendant-holder,pendant-lights' | split: ',' %}
{% endif %}
```

Full mapping table:

| Product is in | Shows products from |
|---|---|
| `conduit-lightings` | `conduit-accessories` (single) |
| `conduit-accessories` | `conduit-lightings` (single) |
| `pipe-lighting` | `pipe-lighting-accessories` + `easy-fit-shades` (two) |
| `plugin-lighting` | `diy-lighting-new` (single) |
| `all-transformers` | `led-modules` (single) |
| `pendant-lights` | `easy-fit-shades` + `led-bulbs` (two) |
| `vintage-cables` | `single-outlet-ceiling-rose` + `metal-holders` (two) |
| `single-outlet-ceiling-rose` | `vintage-cables` + `metal-holders` (two) |
| `spider-light` | `hooks-and-rings` + `wire-cage` (two) |
| `easy-fit-shades` | `pendant-holder` + `pendant-lights` (two) |
| Any other collection | **Nothing rendered — FBT hidden** |

### Step 2: Normalisation (lines 25–31)

Both paths (`matched_collection` single / `matched_collections_array` multi) are unified into `matched_collections_array` as a comma-split array. `has_matched_collections` is set to `true` if either path matched.

### Step 3: Render gate (line 33)

`{% if has_matched_collections %}` — if no collection matched, the entire FBT block (including wrapper, header, styles, JS) is suppressed. Nothing is output on the page.

### Step 4: Card rendering — two paths

**Single-collection path** (lines 80–191): Loops `col1.products`. Excludes the current product. Assigns `data-page` as `ceil(index / 2)` — 2 products per page. Renders the card (image, title, variant selector, price, add-to-cart button).

**Two-collection path** (lines 199–459): Counts products in col1 and col2 separately, calculates pages per column, renders col1 products first then col2 products. Both columns share the same page grid — col1 appears in left column, col2 in right column of the 2-column CSS grid. 2 items per column per page.

### Step 5: Card layout (same in both paths)

Each card (`.fbt-item`) contains:
- **Left:** 56×56px image link → `p.url`, `p.featured_image | image_url: width: 120`
- **Middle:** Product name link, variant `<select>` (if `p.variants.size > 1`), price with compare-at
- **Right:** `+ Add` button with `data-variant="{{ active_val.id }}"`, AJAX add-to-cart

### Step 6: JavaScript

Three behaviours in the `<script>` block (IIFE):
1. **Auto-slide** — reads/writes `localStorage.fbt_current_page` and `fbt_last_slide_time`. Advances page if away > 1 minute. Checks every 1 second.
2. **Variant select** — updates `btn.data-variant`, price display, and stock state on `<select>` change.
3. **AJAX add-to-cart** — `POST /cart/add.js` with variant ID + `properties[_source]=Frequently Bought Together`. Updates cart count, triggers cart drawer if present.

---

## SECTION 5 — Metafield Access and Population Findings

### Metafield definition (from Shopify admin screenshot)

| Field | Value |
|---|---|
| Name | Custom Related Products |
| Namespace and key | `custom.related_products` |
| Type | List of products |
| Storefront API access | Enabled |

### How to access in Liquid

```liquid
{% assign fbt_products = product.metafields.custom.related_products.value %}
```

`product.metafields.custom.related_products.value` returns an **array of product objects** (not handles, not IDs). Each item in the array is a full Shopify product object with `.title`, `.url`, `.featured_image`, `.variants`, `.available`, etc.

This means the existing card loop can be adapted directly — the same `{% for p in ... %}` pattern works.

### Theme references to custom.related_products

**None found.** Searched all `.liquid` and `.json` files in the theme. `custom.related_products` is not yet referenced anywhere in the codebase. This discovery is the first.

### Population status

**Unknown — cannot confirm from code alone.** The metafield definition exists. Whether any specific products have values populated cannot be determined from the theme files. Must be verified in Shopify admin → Products → [product] → Metafields → `custom.related_products`. Assume **BLANK on all products until Piranav confirms otherwise.**

---

## SECTION 6 — Proposed Minimal File Changes

**Only one file changes: `snippets/frequently-bought.liquid`**

No template JSON changes. No new snippets. No section changes. No CSS or JS changes.

### Change description (not code — approval required first)

**Replace lines 1–31** (the collection-matching and normalisation block) with a three-way priority check:

```
PRIORITY 1: Check product.metafields.custom.related_products.value
  → If populated and size > 0:
      Assign fbt_source = 'metafield'
      Assign fbt_metafield_products = that array
      Set has_matched_collections = true

PRIORITY 2: Fall back to existing collection rules
  → Run the existing {% if product.collections contains ... %} chain
  → Set matched_collection / matched_collections_array as today
  → Set has_matched_collections = true if a match found

PRIORITY 3: Neither matched → has_matched_collections stays false → nothing renders
```

**The render gate (`{% if has_matched_collections %}`) is unchanged.**

**Inside the card render block**, add a third render path before the existing two:

```
IF fbt_source == 'metafield':
  → Loop fbt_metafield_products (single flat list)
  → Exclude current product by p.id == product.id check
  → Use the SINGLE-collection card template exactly as-is
  → data-page logic: same ceil(index/2) formula
  → data-collection attribute: set to 'metafield' for identification
```

**Existing single-collection and two-collection paths remain unchanged as the fallback.**

### What does NOT change

- Card HTML structure (`.fbt-item`, `.fbt-img-wrapper`, `.fbt-info`, `.fbt-bottom-row`, `.fbt-btn`)
- All CSS variables and responsive breakpoints
- All JavaScript (auto-slide, variant change, AJAX add-to-cart, cart update, localStorage)
- `product-bought-together.liquid` (bls metafield — untouched)
- All template JSON files
- `section.settings.bought_together` toggle behaviour

---

## SECTION 7 — Fallback Strategy Recommendation

**Recommendation: Keep collection rules as fallback. Do not remove them.**

Rationale:
1. `custom.related_products` will be blank on most products initially. Without the fallback, FBT disappears site-wide on day 1.
2. Staff can populate the metafield product-by-product. Each product transitions from collection-rule FBT to metafield FBT as soon as its metafield is saved.
3. Collection rules are still correct for non-conduit products (pendant-lights, vintage-cables, etc.). These will likely never get metafield values.
4. The only risk of keeping both is showing collection-rule products on products where metafield is intentionally blank. Accept this — it is preferable to a blank FBT section.

**For conduit-specific products specifically:** Piranav + GPT should confirm whether conduit-lightings and conduit-accessories products will have metafield values populated before implementation. If they will, the metafield takes priority automatically with no further change needed.

---

## SECTION 8 — Risks and Compatibility

| Risk | Severity | Mitigation |
|---|---|---|
| `custom.related_products.value` returns `nil` if metafield is blank | LOW | Guard with `{% if fbt_metafield_products and fbt_metafield_products.size > 0 %}` |
| Metafield returns archived or unavailable products | MEDIUM | The card already handles `{% unless active_val.available %}disabled{% endunless %}` — Out of Stock renders, not blank |
| Metafield list product is the same as current product | LOW | Add `{% unless p.id == product.id %}` guard (same as collection path) |
| Shopify product object in List of products type — confirm `.value` returns full objects | LOW | Confirmed: `List of products` type in Liquid returns full product objects via `.value` |
| bls.bought_together also enabled — two FBT sections could appear | LOW | `product-bought-together.liquid` only renders if `bls.bought_together` metafield is populated. Currently: that is the theme app block, not our snippet. They are separate blocks, separate positions on page. |
| localStorage page state from previous collection-rule session carried forward after metafield switch | LOW | Auto-slide resets after 1 minute. Page 1 is the default if stored page > totalPages. Acceptable. |
| Metafield populated with >20 products → large page count | LOW | Pagination handles this. No cap. Acceptable. |
| conduit-people-also-bough template has no FBT block | CONFIRMED | That template is unaffected — Task 10 only targets `product.json` template. |

---

## SECTION 9 — Product-by-Product Implementation and Validation Checklist

To be completed after Piranav + GPT confirm which products are in scope for metafield population.

### Implementation checklist (per product)

| Step | Task | Who | Done |
|---|---|---|---|
| 1 | Piranav: confirm which product handles are in scope for metafield | Piranav | OPEN |
| 2 | GPT: approve implementation plan | GPT | OPEN |
| 3 | Claude: edit `snippets/frequently-bought.liquid` — add metafield priority path | Claude | OPEN — awaiting approval |
| 4 | Piranav: push snippet to Shopify draft theme | Piranav | OPEN |
| 5 | Piranav: populate `custom.related_products` metafield on at least 1 test product | Piranav | OPEN |
| 6 | Piranav: verify FBT shows metafield products on test product (not collection products) | Piranav | OPEN |
| 7 | Piranav: verify FBT shows collection-rule products on a product with blank metafield | Piranav | OPEN |
| 8 | Piranav: verify add-to-cart works on metafield product card | Piranav | OPEN |
| 9 | Piranav: verify variant selector works on metafield product with multiple variants | Piranav | OPEN |
| 10 | Piranav: verify mobile layout (single column, row cards) | Piranav | OPEN |
| 11 | Claude: write validation record | Claude | OPEN |
| 12 | Claude: git commit all AIOS docs | Claude | OPEN |

### Validation test matrix (post-implementation)

| Test | Product state | Expected FBT output | Pass criteria |
|---|---|---|---|
| Metafield populated | Product A has 3 related products in metafield | Shows those 3 products | FBT renders, NOT collection products |
| Metafield blank | Product B has no metafield | Falls back to collection rules | FBT shows collection products if rule matches; hidden if no rule |
| Metafield populated with current product | Product A metafield includes itself | Current product excluded | FBT does not show the page product |
| No collection match + blank metafield | Product C | FBT hidden | `.fbt-list-wrapper` not in page source |
| Add to cart (metafield path) | Click + Add on a metafield product | Variant added to cart | Cart count increments, no JS error |
| Mobile | Any product with FBT | Single column layout | Grid switches to 1 column at ≤767px |

---

## SECTION 10 — Unresolved Questions

| # | Question | Owner | Priority |
|---|---|---|---|
| 1 | Which specific products will have `custom.related_products` populated? Any conduit products currently have values? | Piranav | HIGH — needed before implementation |
| 2 | Should conduit-lightings and conduit-accessories collection rules be retained as fallback, or removed once metafield is populated on all conduit products? | Piranav + GPT | MEDIUM |
| 3 | Is the `bought_together` section setting currently `true` on all product templates, or only `product.json`? (Check `product.conduit-people-also-bough.json` setting.) | Claude — can check locally | LOW |
| 4 | Should `product.conduit-people-also-bough.json` also get an FBT block? | Piranav + GPT | LOW |

---

## SECTION 11 — Next Approved Step

**Piranav + GPT to confirm:**
1. Approve the fallback strategy (keep collection rules OR remove for conduit products)
2. Confirm which products are in scope for metafield population
3. Approve implementation plan as described in Section 6

**Once approved, Claude implements:**
- Edit `snippets/frequently-bought.liquid` — add metafield priority path at lines 1–31
- No other files change
- Static validation (Liquid syntax check, fallback logic review)
- Commit to git
- Piranav pushes to draft theme
- Piranav populates metafield on 1 test product
- Validation checklist (Section 9) executed

**Do not publish.** Do not populate metafield on live products before draft validation passes.
