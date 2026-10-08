# Conduit 1–2 — Discovery Report

**Date:** 2026-10-07
**Status:** DISCOVERY COMPLETE — IMPLEMENTATION NOT STARTED
**Analyst:** Claude Code (session 2026-10-07)
**Architecture confirmed:** 2026-10-07 — Piranav verified active template from Shopify Admin

---

## 1. Existing AIOS Folder — Reuse / New?

**Result: New folder created.**

Search performed across all of `piranav_aios/` for: Conduit, Conduit Lighting, Conduit 1, stock labels, data-available, In Stock, From price, zero-price sale, product card.

**Existing Conduit work found:**

| Folder / File | Scope | Reuse? |
|---|---|---|
| `conduit-accessories-build/` | Content/structure build (guides, stock investigation, structured data) | NO — different scope |
| `evidence/dm-dashboard/conduit-sold-*.md` | dm-dashboard conduit sold tracker | NO — dashboard backend |
| `reports/conduit-collections-sales-apr-sep-2026.*` | Sales reports | NO — analytics only |

**Decision:** New folder `conduit-stock-price-cards/` created. Separate from `conduit-accessories-build` because the fix is in global theme snippets affecting all collections, not conduit-specific templates.

---

## 2. Duplicate Check

**Result: No duplicate exists.**

- No existing AIOS file covers stock-label accuracy for `product-item.liquid`
- No existing AIOS file covers the "From" prefix fix for `price.liquid`
- The previous "collection page out of stock variation fix" (`evidence/fixes/collection page outof stock varation fix.md`) is a different fix — checked but unrelated to this task

**Duplicate-risk assessment:** The fix touches global snippets. Documented in `duplicate-risk/README.md` update required after implementation.

---

## 3. Git Status (at discovery time)

**Modified theme files (not yet committed):**

```
M shopify_projects/ledsone-uk-theme/assets/base.min.css
M shopify_projects/ledsone-uk-theme/assets/third-party-scripts.js
M shopify_projects/ledsone-uk-theme/config/settings_data.json
M shopify_projects/ledsone-uk-theme/layout/theme.liquid
M shopify_projects/ledsone-uk-theme/locales/en.default.json
M shopify_projects/ledsone-uk-theme/sections/wholesale-trendy-discovery.liquid
M shopify_projects/ledsone-uk-theme/snippets/logo.liquid
M shopify_projects/ledsone-uk-theme/snippets/seo-noindex.liquid
M shopify_projects/ledsone-uk-theme/templates/collection.conduit-lighting-pk.json
M shopify_projects/ledsone-uk-theme/templates/product.json
... (multiple template JSONs)
```

**Untracked:**
- `conduit-accessories-build/` — not yet committed
- `.mcp.json`, `docs/dm-dashboard/...`, `evidence/avasam/...`, etc.

**Important:** There are uncommitted theme changes already present. Implementation must be done cleanly on top of these, not obscuring them.

---

## 3a. Confirmed Architecture — /collections/conduit-lighting (added 2026-10-07)

**Source:** Piranav confirmed from Shopify Admin — active Theme Template for this collection is `collection-pipe`.

| Field | Value |
|---|---|
| Shopify collection handle | `conduit-lighting` |
| Assigned Theme Template | **collection-pipe** |
| Theme template file | `templates/collection.collection-pipe.json` |

**Active rendering path (confirmed):**

```
/collections/conduit-lighting
  → templates/collection.collection-pipe.json
    → sections/collection-meta-filters.liquid  [ACTIVE — no "disabled" flag]
      → snippets/product-item.liquid            [product card renderer]
        → snippets/price.liquid                 [price block]
```

**Sections verified from `collection.collection-pipe.json`:**

| Section ID | Type | Status |
|---|---|---|
| `collection_meta_filters_3j6DXw` | `collection-meta-filters` | **ACTIVE** — no `"disabled":true` |
| `product-grid` | `main-collection-product` | **DISABLED** — has `"disabled":true` |

**Correction to initial discovery:**
The initial discovery inspected `collection.conduit-lighting-pk.json` (a different template where `collection-meta-filters` was disabled and `main-collection-product` was active). That template is **not** the one assigned to `/collections/conduit-lighting` in production. The correct template is `collection-pipe`, where the roles are reversed.

**Implication for `data-available`:**
`collection-meta-filters.liquid` generates `data-available` attributes on card wrapper divs. These ARE live on the conduit-lighting page. See Section 6 (updated).

---

## 4. Relevant Theme Files

| File | Role |
|---|---|
| `snippets/product-item.liquid` | **PRIMARY** — renders every product card (called from collection-meta-filters) |
| `snippets/price.liquid` | **PRIMARY** — renders price block, includes "from" logic |
| `snippets/product-price.liquid` | Secondary price snippet used in other contexts — NOT called by product-item |
| `snippets/product-label.liquid` | Renders badge labels (Sold Out, Sale %, Pre-order) on card images |
| `sections/collection-meta-filters.liquid` | **ACTIVE section** — loops products, generates `data-available` on wrappers, calls `product-item` |
| `sections/main-collection-product.liquid` | DISABLED on the conduit-lighting page — not in the active rendering path |
| `templates/collection.collection-pipe.json` | **Active template** for `/collections/conduit-lighting` — confirmed from Shopify Admin |
| `templates/collection.conduit-lighting-pk.json` | A different template (not active for this collection) — inspected in error during initial discovery |

---

## 5. Current Stock Label Flow

**File:** `snippets/product-item.liquid`, lines 447–458

```liquid
{% comment %} piranav add stock icon 2026/01/22 {% endcomment %}
<div class="product-stock">
  {% if product.available %}
    <span class="in-stock">
      <svg ...>...</svg>
      In Stock
    </span>
  {% else %}
    <span class="out-of-stock">Out of Stock</span>
  {% endif %}
</div>
```

**How it works:**
- Uses `product.available` — a Shopify boolean that returns `true` if ANY variant is available
- A product with 1 of 6 colours available → `product.available = true` → card shows "In Stock"
- A product with 0 variants available → `product.available = false` → card shows "Out of Stock"

**No `data-available` attribute on the product card wrapper.** The `data-available` attribute only exists in `collection-meta-filters.liquid` (which is DISABLED on the conduit-lighting-pk template).

---

## 6. Current data-available Flow

**Updated 2026-10-07 — architecture correction applied.**

`sections/collection-meta-filters.liquid` IS the active section on the conduit-lighting page. `data-available` attributes ARE live in the DOM.

| File | Line | Context | Status on conduit page |
|---|---|---|---|
| `sections/collection-meta-filters.liquid` | 255 | Default product card wrapper — `data-available="{{ product.available }}"` | **ACTIVE** |
| `sections/collection-meta-filters.liquid` | 263 | Variant card wrappers (hidden class, one per variant) — `data-available="{{ variant.available }}"` | **ACTIVE** |
| `snippets/variant-matrix.liquid` | 72 | Variant matrix UI — unrelated | Not relevant |
| `sections/variation-split.liquid` | 349 | Variation split section — unrelated | Not relevant |

**How the section works (from `collection-meta-filters.liquid`):**

```liquid
{# Default product card — shown without filter selection #}
<div class="bls__grid__item product-card-wrapper is-default-product"
     data-available="{{ product.available }}">
  {%- render 'product-item', product: product -%}
</div>

{# Hidden variant cards — one per variant, JS shows the matching one when a filter is applied #}
{%- for variant in product.variants -%}
  <div class="bls__grid__item product-card-wrapper is-variant-card hidden"
       data-available="{{ variant.available }}">
    {%- render 'product-item', product: product, variant: variant -%}
  </div>
{%- endfor -%}
```

**What this means for the stock label:**
- The `data-available` on the **wrapper div** controls whether JavaScript shows or hides the card when a filter is active. It is NOT the source of the "In Stock" text.
- The **"In Stock" / "Out of Stock" text** is generated inside `product-item.liquid` using `product.available` — this is the broken logic that needs fixing.
- On the default (unfiltered) view, visitors see the default product card. Its stock label uses `product.available`, which is `true` even for partially-stocked products.
- On variant cards (shown when a filter is selected), the wrapper has `data-available="{{ variant.available }}"` but the stock label inside still uses `product.available` (not the specific variant). This is also incorrect but secondary to the default card.

**Conclusion:** The task brief's mention of `data-available="false"` is accurate — those variant card wrappers DO exist on the live page. The fix is still in `product-item.liquid` (stock label logic), because that is what generates the visible text. The `data-available` wrapper attribute is separate and does not need to be changed.

---

## 7. Current Price Flow

**Call site — `snippets/product-item.liquid`, line 444:**

```liquid
{%- render 'price', product: product, variant: variant, use_variant: true, price_class: 'price--large' -%}
```

This is called from both card types in `collection-meta-filters.liquid`:
- Default card: `variant` is nil (no variant passed)
- Variant cards: `variant` is the specific variant object

**File:** `snippets/price.liquid`, lines 1–18 (key logic):

```liquid
if variant
  assign target = variant
elsif use_variant
  assign target = product.selected_or_first_available_variant
else
  assign target = product
endif
assign compare_at_price = target.compare_at_price
assign price = target.price | default: 1999
assign money_price = price | money
if target == product and product.price_varies
  assign money_price = 'products.product.price.from_price_html' | t: price: money_price
endif
```

**How it works on the default product card (variant = nil):**
- `variant` parameter is nil → `elsif use_variant` branch → `target = product.selected_or_first_available_variant` (a variant object, not the product)
- `target == product` → **always false** (a variant object ≠ the product object in Liquid)
- "from" logic **never triggers** on the default collection card
- Card shows the price of the first available variant only, regardless of whether other variants cost more

**How it works on variant cards (variant = specific variant):**
- `variant` parameter is the specific variant → `target = variant`
- `target == product` → still false
- "from" logic still never triggers — variant cards always show that variant's exact price (correct behaviour for variant cards)

---

## 8. Current Sale-Price Flow

**File:** `snippets/price.liquid`, lines 35–48:

```liquid
<div class="price__sale grey-color">
  {%- if compare_at_price > 0 -%}
    {%- unless product.price_varies == false and product.compare_at_price_varies %}
      <span>
        <s class="price-item compare-price">
          {{ compare_at_price | money }}
        </s>
      </span>
    {%- endunless -%}
  {%- endif -%}
</div>
```

**How zero-price strings occur:**
- The `<div class="price__sale grey-color">` wrapper is **always output**, even when there is no sale
- When `compare_at_price = 0` or `nil`, the inner `if compare_at_price > 0` guard is false → no visible content
- **However:** The wrapper div is always in the DOM. With 259 products × at least 1 card each, there can be 259+ empty `price__sale` divs rendered on the page
- The "274 hidden zero-price strings" reported likely refers to these empty wrapper divs (or possibly the struck-through `£0.00` text output in some edge case from the `productVariantsQty` JSON data in the card)
- **Note:** `price = target.price | default: 1999` — in Liquid, `0 | default: 1999` = 1999 (0 is falsy). A variant priced at £0 would display as £19.99. This is a separate pre-existing issue and NOT in scope for this task.

---

## 9. Root Cause — Incorrect "In Stock" Label (Part 1)

**Root cause:** `product-item.liquid` line 448 uses `product.available` which is `true` whenever at least one variant is available, regardless of how many are sold out.

**What needs to change:**
- Count how many variants are available
- If ALL variants are available → show "In Stock"
- If SOME variants are available → show "Some colours/options sold out" (partial stock message)
- If NO variants are available → show "Out of Stock"

**Liquid variables already computed earlier in the same file (lines 37–193):**
- `sold_out` (boolean) — true when `product.available == false`
- `product_avail` (boolean) — true if at least one variant is available
- `product_qty` (integer) — total quantity across variants
- `pre_order` (boolean)

**But none count available vs. total variants for a partial message.** New Liquid logic is needed.

---

## 10. Root Cause — Missing "From" Prefix (Part 2)

**Updated: 2026-10-07 — Part 2 deep-dive complete.**

### A. Exact price rendering path

```
collection-meta-filters.liquid
  → render 'product-item', product: product           (default card, no variant)
  → render 'product-item', product: product, variant: variant  (variant cards)
    → product-item.liquid line 444:
        render 'price', product: product, variant: variant, use_variant: true
      → price.liquid
```

No JavaScript modifies the "From" prefix or the price text on page load. `collection.js` only handles the filter range slider (no price output). `theme.js` `updatePrice()` runs only on colour-swatch click — not on page load.

### B. Exact file and line responsible for displayed price

**`snippets/price.liquid`, lines 1–18 (full logic block):**

```liquid
{%- liquid
  if variant
    assign target = variant                                    ← variant card: target = specific variant
  elsif use_variant
    assign target = product.selected_or_first_available_variant ← default card: target = variant object
  else
    assign target = product                                    ← never reached when use_variant: true
  endif
  assign compare_at_price = target.compare_at_price
  assign price = target.price | default: 1999
  assign available = target.available | default: false
  assign money_price = price | money
  if settings.currency_code_enabled
    assign money_price = price | money_with_currency
  endif
  if target == product and product.price_varies              ← "From" logic — line 16
    assign money_price = 'products.product.price.from_price_html' | t: price: money_price
  endif
-%}
```

**Root cause of missing "From":**
On a default product card: `variant = nil` → `use_variant` branch → `target = product.selected_or_first_available_variant`. This is a variant *object*, not the product. The check on line 16 is `target == product` — comparing a variant to a product — always `false`. "From" never renders.

**Translation key confirmed in `locales/en.default.json`:**
```
"products.product.price.from_price_html": "From {{ price }}"
```

### C. Exact logic responsible for compare_at_price / sale price

**`snippets/price.liquid`, lines 35–50:**

```liquid
<div class="price__sale grey-color">
  {%- if compare_at_price > 0 -%}
    {%- unless product.price_varies == false and product.compare_at_price_varies %}
      <span class="visually-hidden ...">{{ 'products.product.price.sale_price' | t }}</span>
      <span>
        <s class="price-item compare-price">
          {{ compare_at_price | money }}
        </s>
      </span>
    {%- endunless -%}
  {%- endif -%}
</div>
```

- `compare_at_price` = `target.compare_at_price` (nil or integer in pence)
- Inner guard `if compare_at_price > 0` prevents struck-through price when no sale
- `unless product.price_varies == false and product.compare_at_price_varies` suppresses the compare display when price varies but compare_at_price also varies (edge case — e.g. different sale prices per variant)

### D. Why zero/empty sale-price strings are rendered

**The `<div class="price__sale grey-color">` wrapper is ALWAYS rendered**, regardless of whether there is a sale. When there is no sale (`compare_at_price = 0` or `nil`), the `if compare_at_price > 0` guard prevents any inner content, but the div itself is still output as an empty node.

With 100 products shown per page (collection-meta-filters `products_limit: 100`) × multiple variant cards each, there can be hundreds of empty `<div class="price__sale grey-color"></div>` nodes in the page source. The "274 hidden zero-price strings" from the previous audit refers to these empty wrapper divs — they are not visible to the user but are present in the HTML source.

**Critical constraint — DO NOT remove this wrapper div:**

`assets/theme.js` line 2075 actively depends on `.price__sale` existing in the DOM:

```javascript
updatePrice(currentVariant, productTarget) {
  // ...
  if (compare_at_price && compare_at_price > price) {
    if (!bls__price.querySelector(".compare-price")) {
      var ps = bls__price.querySelector(".price__sale");  // ← line 2075: looks for this div
      var sp = document.createElement("span");
      var cp = document.createElement("s");
      cp.classList.add("price-item", "compare-price");
      sp.appendChild(cp);
      if (ps) {
        ps.appendChild(sp)  // ← injects compare-price into .price__sale
      }
    }
    bls__price.querySelector(".compare-price").innerHTML = compare_format;
    bls__price.classList.add("price--on-sale");
  }
}
```

This function fires when a user clicks a colour swatch on a collection card (via `bls__option-swatch-js` click → `checkSwatches` → `updatePrice`). It dynamically injects a `<s class="price-item compare-price">` element into `.price__sale`. **If `.price__sale` does not exist, the compare price injection silently fails.** This would affect other collection pages that use colour swatches (e.g. pendants, wall lights) when a user switches to an on-sale variant.

**Conclusion on zero-price wrapper:** The wrapper div must remain always-rendered. The "274 hidden zero-price strings" are empty but structurally necessary. **Part 2b (remove empty wrapper) is NOT SAFE to implement.** This is a revision to the original discovery recommendation.

### E. How the card currently determines the displayed price

On a **default product card** (`variant = nil`):
1. `use_variant: true` → `target = product.selected_or_first_available_variant`
2. `price = target.price` (price of first available variant, in pence)
3. `money_price = price | money` → e.g. `£2.49`
4. No "From" prefix applied (broken — root cause above)
5. Displayed: `£2.49` — even if other variants cost £24.90

On a **variant card** (`variant = specific variant`):
1. `target = variant`
2. `price = variant.price`
3. `money_price = price | money` → that variant's exact price
4. No "From" prefix (correct for variant cards — they show one specific price)
5. Displayed: e.g. `£24.90` for a 10-pack

### F. How to safely determine whether a product has multiple different variant prices

Shopify provides `product.price_varies` — a built-in boolean that is `true` when the product has variants with different prices. This is the correct and only check needed.

`product.price_min` — the lowest variant price (what "From" should show).

The current code already uses `product.price_varies` in the broken "From" check on line 16. The fix needs to activate this existing logic, not build new logic.

**Verification of `product.price_varies` for ~5542 (connector, different pack prices):**
- Single piece price ≠ 10-pack price → `product.price_varies = true` ✓
- The "From" fix will cause this card to show `From £X.XX` where X.XX = the lowest variant price

### G. Best minimal implementation location

**One-line change in `snippets/price.liquid` line 16.**

Change:
```liquid
if target == product and product.price_varies
```
to:
```liquid
if product.price_varies and variant == nil
```

**Why `variant == nil`:** This is the parameter passed into price.liquid from product-item.liquid. On the default product card, no variant is passed → `variant = nil` → condition true → "From" shows. On variant cards, `variant` = specific variant → condition false → exact price shows (correct). On PDP, a variant is always selected → condition false → exact price shows (correct).

**Why NOT change the call site in product-item.liquid:** Changing `use_variant: false` on the default card call would change `target = product` and let the existing logic work, but would lose the `price--sold-out` class and `available` logic that depends on `target.available`. The one-line fix in price.liquid is safer.

### H. Interaction / risk with existing product card price badges

**Badge (%) on card image:** Rendered by `snippets/product-label.liquid` and by `product-item.liquid` lines 204–209 directly using local `compare_at_price` and `price` variables — these are computed independently of `price.liquid` and are not affected by the "From" change.

**`price--on-sale` CSS class on the price wrapper:** Set in `price.liquid` line 24: `{%- if compare_at_price > price %} price--on-sale {% endif -%}`. This uses `target.compare_at_price` and `target.price` (variant-level values). Not affected by the "From" change.

**`special-price` class on the price span:** Set in `price.liquid` line 31: `{%- if compare_at_price > price %} special-price {%- endif -%}`. Not affected.

**`updatePrice` JS on swatch click:** Uses `currentVariant.price` and formats it directly — does NOT call `price.liquid`. The "From" text is set only at Liquid render time. Clicking a swatch replaces the price text (line 2062: `prp.innerHTML = price_format`), which would overwrite "From £X.XX" with the specific variant price. This is correct behaviour — once a specific option is selected, the exact price should show.

**Summary: The one-line "From" fix has no interactions with badges, classes, or JS.** It only affects the initial `money_price` string that appears in `<span class="price">` on page load for the default product card.

### I. Concrete test products for validation

| Product | Handle / ID | Expected result |
|---|---|---|
| ~5542 connector | Has single + 10-pack variants at different prices | Default card: "From £X.XX" |
| ~6829 wall light | Has colour variants, some at same price | Confirm: does NOT show "From" if all colours have same price |
| ~5539 E27 lamp holder | Multiple options | Check if prices differ → "From" or not |
| Any single-option product (e.g. a conduit pipe length) | `price_varies = false` | No "From" prefix — just the price |
| Any product on sale (has compare_at_price) | Struck-through "was" price | Must remain unchanged after fix |

---

## 11. Root Cause — Zero-Price Sale Strings (Part 2) — REVISED

**Original recommendation: remove outer `.price__sale` wrapper. THIS IS NO LONGER RECOMMENDED.**

**Revised finding:** The `.price__sale` div must remain always-rendered. Removing it would silently break the compare-price injection in `theme.js` for collection pages that use colour swatches (non-conduit collections). See Section 10D above for full JS dependency analysis.

**What "274 zero-price strings" actually are:** Empty `<div class="price__sale grey-color"></div>` wrapper nodes in the HTML source — one per product card with no active sale. They are invisible to the user. They are structurally necessary for JS. They are not functional bugs.

**Decision:** Do not change the `.price__sale` wrapper. Accept the empty divs as a non-harmful DOM pattern. Remove "reduce zero-price strings to 0" from the validation checklist — it cannot be safely done.

If this must be addressed in a future session, the safe approach would be adding a `data-no-sale` attribute and a CSS `display:none` rule rather than removing the element — preserving the DOM node while hiding it from source audits.

---

## 12. Recommended Minimal Implementation — REVISED

### Part 1 — Stock label fix (`product-item.liquid`) — DONE ✓

Implemented 2026-10-07. See `conduit-stock-price-cards/02_implementation/CONDUIT-01-implementation-2026-10-07.md`.

### Part 2a — "From" prefix fix (`price.liquid`) — ONE LINE CHANGE

**File:** `snippets/price.liquid`, line 16

**Before:**
```liquid
if target == product and product.price_varies
```

**After:**
```liquid
if product.price_varies and variant == nil
```

That is the entire change for Part 2. Nothing else in price.liquid needs to change.

### Part 2b — Zero-price sale wrapper — DROPPED ✓

Not safe to implement due to `theme.js` DOM dependency. See Section 11 above.

---

## 13. Files Expected to Change — REVISED

| File | Change |
|---|---|
| `snippets/product-item.liquid` | ✓ DONE — stock label (Part 1) |
| `snippets/price.liquid` | One-line change: "From" condition on line 16 (Part 2a only) |

---

## 14. Files That Should NOT Be Changed

| File | Reason |
|---|---|
| `snippets/product-label.liquid` | Badge labels — separate, not in scope |
| `sections/collection-meta-filters.liquid` | Active section but no changes needed |
| `sections/main-collection-product.liquid` | Disabled on conduit page |
| `snippets/product-price.liquid` | Not called by product-item |
| `assets/theme.js` | Contains `updatePrice` which depends on `.price__sale` DOM structure |
| `assets/collection.js` | Only handles filter UI |
| Any template JSON | No template changes needed |
| Any collection/product/inventory data | Never touch |

---

## 15. Validation Plan — REVISED

**Part 1 — Stock labels (already implemented, pending browser push):**
- [ ] Product ~6829: card shows "Some options sold out"
- [ ] Products with ALL variants in stock: "In Stock"
- [ ] Products with ZERO variants in stock: "Out of Stock"

**Part 2 — "From" prefix:**
- [ ] Product ~5542 (different pack prices): default card shows "From £X.XX"
- [ ] Products where all variants have identical price: no "From" prefix
- [ ] Products with single variant: no "From" prefix
- [ ] Variant cards (shown after filter click): show exact variant price, no "From"
- [ ] Products with a sale price: struck-through compare price still displays correctly
- [ ] On-sale badge (%) on card image: unchanged

**~~Zero-price string count: REMOVED from validation checklist~~** (not fixable without JS risk)

**Regression checks:**
- [ ] Non-conduit collection pages (pendants, wire cage, etc.): prices correct
- [ ] Product detail pages: price display unchanged — "From" must NOT appear on PDP when a variant is selected
- [ ] Colour swatch click on any collection page: compare price still injects correctly for sale variants

---

## 16. Evidence Plan

| Evidence type | File to create |
|---|---|
| Before screenshots | `conduit-stock-price-cards/03_validation/before/` |
| After screenshots | `conduit-stock-price-cards/03_validation/after/` |
| Code diff | Git commit hash recorded in closure |
| Page source extract | Save HTML snippet showing before/after for zero-price strings |
| Validation checklist | `conduit-stock-price-cards/03_validation/validation-checklist.md` |

---

## 17. Risks / Edge Cases

| Risk | Severity | Mitigation |
|---|---|---|
| Products with untracked inventory (`inventory_management = nil`) — `available` is always true even with qty=0 | Medium | The `variant.available` check covers this correctly since Shopify sets `available=true` for untracked variants |
| Single-variant products | Low | Use `product.has_only_default_variant` to short-circuit the variant loop — `sold_out` is already correct for these |
| Very large variant counts (e.g. 30+ variants) | Low | Liquid `for` loop is acceptable; no pagination needed as product.variants returns all |
| "From" prefix appearing on sale products | Low | The "from" logic uses `product.price_min` which is the lowest price — this is correct |
| Global impact — `price.liquid` and `product-item.liquid` affect ALL collection pages site-wide | High | Test on non-conduit collection pages after implementation (pendants, wire cage, etc.) |
| Conduit build duplicate theme (Step 1 of conduit-accessories-build) | Medium | Implementation should be done on the LIVE theme. The duplicate "Conduit build 2026-10" draft theme exists separately and would need the same fix applied if it's to go live |
| `price.liquid` is used on product detail pages too | Medium | Validate PDP price display after change — the "From" fix uses `variant == nil` which means on PDPs where a variant IS selected, no "From" prefix will show (correct behaviour) |
| Partial stock label text: "Some options sold out" vs "Some colours sold out" | Low | Use generic "Some options sold out" to cover products with non-colour variants (connectors, lamp holders use size/count options, not colour) |

---

## 18. Status

**STATUS: DISCOVERY COMPLETE — IMPLEMENTATION NOT STARTED**

Next step: Piranav approves this discovery report → Claude implements the two-file fix.
