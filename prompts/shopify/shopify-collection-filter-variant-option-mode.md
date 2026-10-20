# Prompt — Shopify Collection Filter: Variant Option Mode

**Category:** shopify / implementation  
**Status:** ACTIVE  
**First used:** 2026-10-19 (S1-PIR-02)

---

## When to Use

Use this prompt when a client-side filter on a collection page must filter by a variant-level attribute (e.g. pack size, colour, finish) where the values are stored as variant options, NOT as product metafields.

**Key distinction:** Product metafields are the same for all variants of a product. If you use a metafield for a filter that should narrow to a specific variant, all variants will match and the filter appears broken.

---

## Prompt

You are modifying a Shopify Liquid client-side filter section. The filter renders product cards as `<div data-f5="...">` and JavaScript hides cards not matching the selected button value.

A filter slot currently reads its value from a product metafield (e.g. `custom.package`). This is broken because the metafield is product-level — all variants of a product get the same value, so selecting any filter option shows all variants.

Fix this by adding a variant option mode:

**Schema changes (in {% schema %}):**
- Add a `filter_5_option_name` text setting alongside the existing `filter_5_metafield` setting
- Info text: "Fill this if the filter value comes from a variant option (e.g. Type, Pack Size). Leave blank to use metafield above."
- No `"default"` key — Shopify rejects `"default": ""` on text settings

**Liquid top section:**
- Assign `f5_option_name = section.settings.filter_5_option_name | default: ''`
- In the product loop, find the option index: loop `product.options`, if `opt == f5_option_name` assign `f5_option_index = forloop.index0`

**Per-variant card rendering:**
```liquid
{%- if f5_option_name != blank and f5_option_index != null -%}
  {%- assign card_f5_variant = variant.options[f5_option_index] | default: '' | downcase | strip -%}
{%- else -%}
  {%- assign card_f5_variant = card_f5 | downcase | strip -%}
{%- endif -%}
<div ... data-f5="{{ card_f5_variant }}" ...>
```

**Button generation — option mode branch:**
```liquid
{%- if f5_option_name != blank -%}
  {%- for product in collection.products limit: 1000 -%}
    {%- for opt in product.options_with_values -%}
      {%- if opt.name == f5_option_name -%}
        {%- for v in opt.values -%}
          [collect unique values into array]
        {%- endfor -%}
      {%- endif -%}
    {%- endfor -%}
  {%- endfor -%}
{%- else -%}
  [existing metafield collection loop]
{%- endif -%}
```

**Note on mixed conditions:** Shopify Liquid does NOT allow `and` + `or` mixed in one condition. Split into two nested `if` statements:
```liquid
{%- if st.filter_5_label != blank -%}
{%- if st.filter_5_metafield != blank or st.filter_5_option_name != blank -%}
...
{%- endif -%}
{%- endif -%}
```

**Theme editor config after upload:**
- Filter 5 Label: `Pack` (or appropriate label)
- Filter 5 Variant Option Name: `Type` (exact option name from Shopify product variants)
- Filter 5 Metafield: leave blank

**Expected result:** Each variant card gets a unique `data-f5` value matching its own option value. Selecting "10 pack" hides all cards where `data-f5 != "10 pack"`.
