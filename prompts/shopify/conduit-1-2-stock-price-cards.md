# Prompt: Conduit 1–2 — Fix Stock Labels + "From" Price on Collection Cards

**Saved:** 2026-10-07
**Category:** shopify / theme / collection-cards
**Reusable for:** Any Shopify theme using `product-item.liquid` with a `product.available` stock label and a `price.liquid` snippet with a variant-target "From" check

---

## Context

The ledsone-uk-theme renders product cards via `snippets/product-item.liquid`. The stock label and price display have two bugs that affect the conduit-lighting collection page (and all other collection pages):

1. **Stock label always says "In Stock"** even when only some variants are available
2. **"From" prefix never shows** on cards when product variants have different prices
3. **Empty `price__sale` div** is always rendered even when there is no sale price

---

## Part 1 — Fix Stock Label Accuracy

**File:** `snippets/product-item.liquid`

**Location:** The `<div class="product-stock">` block (around line 447)

**Current broken logic:**
```liquid
{% if product.available %}
  <span class="in-stock">In Stock</span>
{% else %}
  <span class="out-of-stock">Out of Stock</span>
{% endif %}
```

**Fix:**
Replace with a three-state check using a variant loop:

```liquid
{%- liquid
  assign available_count = 0
  assign total_variant_count = product.variants.size
  for v in product.variants
    if v.available
      assign available_count = available_count | plus: 1
    endif
  endfor
-%}
<div class="product-stock">
  {%- if available_count == 0 -%}
    <span class="out-of-stock">Out of Stock</span>
  {%- elsif available_count < total_variant_count -%}
    <span class="partial-stock">
      [check SVG icon here]
      Some options sold out
    </span>
  {%- else -%}
    <span class="in-stock">
      [check SVG icon here]
      In Stock
    </span>
  {%- endif -%}
</div>
```

**Done-check:**
- Products with all variants available → "In Stock"
- Products with some variants available → "Some options sold out"
- Products with no variants available → "Out of Stock"

---

## Part 2a — Fix "From" Price Prefix

**File:** `snippets/price.liquid`

**Current broken condition (line ~16):**
```liquid
if target == product and product.price_varies
  assign money_price = 'products.product.price.from_price_html' | t: price: money_price
endif
```

**Why it fails:** When called from `product-item.liquid` with `use_variant: true`, `target` is set to `product.selected_or_first_available_variant` (a variant), not the product object. `target == product` is always false.

**Fix:**
```liquid
if product.price_varies and variant == nil
  assign money_price = 'products.product.price.from_price_html' | t: price: money_price
endif
```

**Done-check:**
- Products with multiple price points → "From £X.XX" shown on collection card
- Products with a single price → no "From" prefix
- Product detail page with a selected variant → no "From" prefix (variant != nil on PDP)

---

## Part 2b — Remove Empty Sale-Price Wrapper

**File:** `snippets/price.liquid`

**Current (always renders the wrapper):**
```liquid
<div class="price__sale grey-color">
  {%- if compare_at_price > 0 -%}
    ...
  {%- endif -%}
</div>
```

**Fix (wrap the outer div too):**
```liquid
{%- if compare_at_price > 0 -%}
  <div class="price__sale grey-color">
    {%- unless product.price_varies == false and product.compare_at_price_varies %}
      <span>
        <s class="price-item compare-price">
          {% if settings.currency_code_enabled %}
            {{ compare_at_price | money_with_currency }}
          {% else %}
            {{ compare_at_price | money }}
          {% endif %}
        </s>
      </span>
    {%- endunless -%}
  </div>
{%- endif -%}
```

**Done-check:**
- Products with no sale → no `price__sale` div in page source
- Products with sale → struck-through compare price still displays correctly

---

## Safety Rules

- Do NOT change product prices or inventory
- Do NOT modify template JSONs
- Do NOT modify `product-label.liquid` (badge system is separate)
- Test on non-conduit collections after change (the fix is global)
- Commit before deploying (Rule 2)
