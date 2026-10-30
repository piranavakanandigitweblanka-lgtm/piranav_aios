---
name: ledsone-de-collection-card-energy-label-implementation
description: Implementation prompt for adding EU Energy Label to collection product cards in the ledsone_de Shopify theme. Dual metafield gating, no JS, AJAX-safe. 4 files.
metadata:
  type: prompt
  category: shopify / implementation
  project: ledsone_de
  created: 2026-10-30
---

# Prompt: EU Energy Label — Collection Product Card Implementation

## Context

Theme: ledsone_de (Umino/Bluesky base, heavy customisation)
Working directory: `shopify_projects/ledsone_de/`
Prerequisite: Discovery completed in `evidence/shopify/ledsone_de/energy-label-collection-card-discovery-2026-10-30.md`

The EU Energy Label currently exists on the PDP only (`snippets/energy-label.liquid`). This prompt adds a lightweight card variant to collection product cards with dual metafield gating.

---

## Task

Implement EU Energy Label on collection product cards.

### Metafield Architecture

**Collection-level gate:** `custom.show_energy_label_on_cards` (boolean)
**Product-level gate:** `custom.show_energy_label_on_cards` (boolean)

Both must be true to display. If either is false/nil, nothing renders.

Truth table:
| Collection | Product | Result |
|---|---|---|
| true | true | Show |
| true | false | Hide |
| false | any | Hide |
| nil | any | Hide |

### Files to Create/Modify

**1. CREATE `snippets/energy-label-card.liquid`**

Lightweight snippet — NO inline `<style>`, NO `<script>`, NO modal.

Required behaviour:
- Outer gate: `{%- if show_label -%}` (collection-level, passed in as parameter)
- Inner gate: `{%- assign elc_product_enabled = product.metafields.custom.show_energy_label_on_cards.value -%}` then `{%- if elc_product_enabled -%}`
- Read: `product.metafields.custom.energy_class | default: '' | strip | upcase`
- Read: `product.metafields.custom.energy_label_data_sheet.value` (List of File)
- Guard: only render if `elc_sheets != blank and elc_sheets.size > 0`
- EU colour map: A+++ (#009640), A++ (#009640), A+ (#52ae32), A (#52ae32), B (#c8d400), C (#ffed00), D (#fbba00), E (#eb6909), F (#e2001a), G (#c0001a). Default: #00a651
- Badge: `<a>` linking to `product.url` (not modal trigger), `aria-label="Energieeffizienzklasse {{ elc_letter }}"`
- Arrow: `<span class="elc-arrow" style="background:{{ elc_color }};">{{ elc_letter }}</span>`
- Caption: `<span class="elc-caption">Energie-<br>label</span>`
- PDF: first item in `elc_sheets` where `sheet.media_type == 'generic_file' or sheet.url contains '.pdf'`, `target="_blank" rel="noopener noreferrer"`, `{%- break -%}` after first match
- Empty letter: if `elc_class == blank`, use `elc_letter = '—'`
- CSS classes only: `elc-row`, `elc-badge`, `elc-arrow`, `elc-caption`, `elc-pdf-link`

**2. CREATE `assets/energy-label-card.css`**

CSS prefix: `elc-*` (no conflicts with `el-*` PDP styles).
Must NOT be loaded from inside the snippet — loaded once from the section.

Key rules:
- `.elc-row` — flex, flex-wrap, gap 8px, margin 6px 0 8px
- `.elc-badge` — inline-flex, align-items center, gap 6px, padding 4px 8px 4px 6px, border 1px #d4d4d4, border-radius 3px, no text-decoration
- `.elc-arrow` — 34×22px, clip-path polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%), white text, 12px bold
- `.elc-caption` — 9px, line-height 1.2
- `.elc-pdf-link` — 11px, underline, data-URI SVG PDF icon via `::before` pseudo-element
- `@media (max-width: 749px)` — arrow 28×18px, smaller font sizes

**3. MODIFY `sections/main-collection-product.liquid`**

Two edits:

Edit A — After existing `stylesheet_tag` lines at top of file:
```liquid
{%- assign show_elc = collection.metafields.custom.show_energy_label_on_cards.value -%}
{%- if show_elc -%}{{ 'energy-label-card.css' | asset_url | stylesheet_tag }}{%- endif -%}
```

Edit B — Add `show_label: show_elc` to the grid-view product-item render call only. Do NOT modify the list-view `product-list-item` render.

**4. MODIFY `snippets/product-item.liquid`**

Insert one line after the price block `{% endif %}`, before `{%- if show_short_description -%}`:
```liquid
{%- render 'energy-label-card', product: product, show_label: show_label -%}
```

No other sections need modification — `show_label` defaults to nil in all other call sites, which is falsy.

---

## Key Technical Constraints

1. **No JS in card snippet** — AJAX filter/load-more uses DOMParser + replaceWith/appendChild. Inline `<script>` tags in injected nodes DO NOT execute.
2. **Use `.value` on boolean metafields** — the metafield object without `.value` is always truthy even when value is false.
3. **CSS loaded once per page** — never inside the snippet; always via section `stylesheet_tag`.
4. **`{% render %}` scope isolation** — variables assigned inside render do not leak out. All gating parameters must be explicitly passed.
5. **List view unmodified** — `product-list-item.liquid` is NOT modified.

---

## Safety Rules

- LOCAL THEME ONLY — do not push to live Shopify theme.
- Do not modify `snippets/energy-label.liquid` (PDP component — separate deploy decision).
- Do not create metafield definitions via API — Piranav does this manually in Shopify Admin.
- Wait for Piranav approval before deploying.

---

## Expected Output

- 4 files created/modified
- 12-scenario static regression PASS
- AIOS evidence filed: `evidence/shopify/ledsone_de/energy-label-collection-card-implementation-2026-10-30.md`
- Validation updated: `validation/piranav/energy-label-snippet-audit-validation-2026-10-30.md`
- Closure entry: LEDSONE-DE-2026-10-30-005
