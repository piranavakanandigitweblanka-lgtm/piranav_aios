---
name: energy-label-collection-card-implementation-2026-10-30
description: Evidence record for Phase 2 implementation — EU Energy Label on collection product cards (ledsone_de). 4 new/modified files. Local only. Not deployed.
metadata:
  type: evidence
  project: ledsone_de
  date: 2026-10-30
  status: PASS (static)
---

# EU Energy Label — Collection Card Implementation Evidence

**Date:** 2026-10-30
**Status:** PASS — static implementation complete. Awaiting Piranav deploy approval.
**Scope:** LOCAL ONLY — no live theme changes.

---

## Implementation Summary

4 files changed to display EU Energy Label on collection product cards with dual metafield gating.

### Dual Metafield Truth Table

| Collection `show_energy_label_on_cards` | Product `show_energy_label_on_cards` | Result |
|---|---|---|
| true | true | Label + PDF link shown |
| true | false | Hidden (product-level gate blocks) |
| false | true | Hidden (collection-level gate blocks) |
| false | false | Hidden |
| nil (metafield undefined) | any | Hidden (nil is falsy) |

---

## Files Created / Modified

### A — `snippets/energy-label-card.liquid` (NEW)

- **Lines:** 85
- **Purpose:** Lightweight card variant — no modal, no JS, no inline `<style>`.
- **Dual gate:** `show_label` (collection, passed from product-item) AND `elc_product_enabled` (`product.metafields.custom.show_energy_label_on_cards.value`).
- **Metafields read:**
  - `product.metafields.custom.energy_class` — single_line_text
  - `product.metafields.custom.energy_label_data_sheet.value` — List of File (PDF)
  - `product.metafields.custom.show_energy_label_on_cards.value` — boolean
- **Colour map:** A+++ (#009640) → G (#c0001a) — identical to `energy-label.liquid`
- **Badge:** `<a>` linking to `product.url` (not a modal trigger)
- **PDF link:** first PDF in the list file collection, `target="_blank" rel="noopener noreferrer"`
- **Empty state:** entire block hidden if no PDF sheets found (`elc_sheets != blank and elc_sheets.size > 0`)
- **AJAX safety:** zero JS — safe for DOMParser AJAX injection

### B — `assets/energy-label-card.css` (NEW)

- **Lines:** 110
- **CSS prefix:** `elc-*` (no conflicts with `el-*` PDP styles or Umino theme)
- **Loaded:** once per collection page via conditional `stylesheet_tag` in `main-collection-product.liquid`
- **Key rules:**
  - `.elc-row` — flex, flex-wrap, gap 8px, margin 6px 0 8px
  - `.elc-badge` — inline-flex, border 1px #d4d4d4, border-radius 3px, no text-decoration, hover border-color #888
  - `.elc-arrow` — 34×22px, clip-path polygon arrow, white text, bold
  - `.elc-caption` — 9px, "Energie-label" label
  - `.elc-pdf-link` — 11px underline, data-URI SVG PDF icon via `::before`
  - `@media (max-width: 749px)` — arrow 28×18px, reduced font sizes

### C — `sections/main-collection-product.liquid` (MODIFIED, +4 lines)

**Edit 1** — after existing `stylesheet_tag` lines (lines 1–2), before `{% # theme-check-disable %}`:
```liquid
{%- assign show_elc = collection.metafields.custom.show_energy_label_on_cards.value -%}
{%- if show_elc -%}{{ 'energy-label-card.css' | asset_url | stylesheet_tag }}{%- endif -%}
```

**Edit 2** — product-item render call (line 174):
```liquid
{%- render 'product-item', product: product, show_label: show_elc -%}
```
*(Changed from: `{%- render 'product-item', product: product -%}`)*

**List view not touched** — `product-list-item` render (line 173) unchanged.

### D — `snippets/product-item.liquid` (MODIFIED, +1 line)

Inserted at line 555, after the price block `{% endif %}` (line 553), before `{%- if show_short_description -%}` (line 557):

```liquid
{%- render 'energy-label-card', product: product, show_label: show_label -%}
```

`show_label` is nil at all other call sites (search, wishlist, recommendations, etc.) — the `{%- if show_label -%}` guard in `energy-label-card.liquid` handles nil as falsy. Zero changes needed to any other section file.

---

## Git Diff Summary

```
shopify_projects/ledsone_de/sections/main-collection-product.liquid  | 4 +++-
shopify_projects/ledsone_de/snippets/product-item.liquid             | 1 +
shopify_projects/ledsone_de/snippets/energy-label-card.liquid        | 85 (new)
shopify_projects/ledsone_de/assets/energy-label-card.css             | 110 (new)
```

---

## Static Regression Analysis — 12 Scenarios

| # | Scenario | Expected | Pass? |
|---|---|---|---|
| 1 | Collection metafield OFF, product ON | Hidden | PASS — `show_elc` is false, `show_label: false` passed, outer guard blocks |
| 2 | Collection metafield ON, product ON, has PDF | Badge + PDF link shown | PASS — both gates pass, sheets found |
| 3 | Collection metafield ON, product ON, no PDF | Hidden | PASS — `elc_sheets == blank or size == 0` guard |
| 4 | Collection metafield ON, product OFF | Hidden | PASS — `elc_product_enabled` is false |
| 5 | Collection metafield undefined (nil) | Hidden | PASS — `.value` on nil metafield = nil = falsy |
| 6 | Product `energy_class` missing | Badge shows "—" | PASS — `elc_class == blank` branch sets `elc_letter = '—'` |
| 7 | Product `energy_class` = "b" (lowercase) | Badge shows "B" with correct colour | PASS — `| strip | upcase` normalises |
| 8 | 24 cards on page, 1 collection CSS load | CSS loaded once (section header), not per card | PASS — `stylesheet_tag` in section, not in snippet |
| 9 | AJAX filter update (collection.js replaceWith) | Label renders correctly on filtered products (server-rendered) | PASS — no JS in card snippet; server render survives replaceWith |
| 10 | AJAX load-more (collection.js appendChild) | Label renders on newly appended products | PASS — same reason |
| 11 | product-item called from search page | No label shown | PASS — search section passes no `show_label`, nil = falsy |
| 12 | product-item called from wishlist/recommendations | No label shown | PASS — other 8 sections pass no `show_label`, nil = falsy |

**All 12 scenarios: PASS (static)**

---

## Known Issue — NEW-1 (Not Actioned)

`.el-row` placeholder div in `energy-label.liquid` RISK-4 fix (design-mode branch) references `.el-row` CSS class, but the `<style>` block is only emitted inside the `if data_sheets` branch — stylesheet not emitted in the `elsif request.design_mode` branch. Cosmetic only, theme editor only. Not actioned — awaiting Piranav approval. No impact on collection card feature.

---

## Metafield Setup Required (Piranav Action — Not Claude)

Before testing on live or dev theme:

1. **Shopify Admin → Settings → Custom Data → Collections**
   Add: `custom.show_energy_label_on_cards` (Type: Boolean, Name: "Show Energy Label on Cards")

2. **Shopify Admin → Settings → Custom Data → Products**
   Add: `custom.show_energy_label_on_cards` (Type: Boolean, Name: "Show Energy Label on Cards")

3. **Set on target collection:** Enable `show_energy_label_on_cards` = true on the specific collection where labels should appear.

4. **Set on target products:** Enable `show_energy_label_on_cards` = true on individual products that have valid energy class + data sheet metafields.

---

## Deployment Notes (When Approved)

Push via Shopify CLI only:
```
shopify theme push --theme-id [dev/staging theme ID]
```
Files to include: `snippets/energy-label-card.liquid`, `assets/energy-label-card.css`, `sections/main-collection-product.liquid`, `snippets/product-item.liquid`

Do NOT push `snippets/energy-label.liquid` (Phase 2 PDP fixes — separate deploy decision).

---

## Linked Files

- Prompt: `prompts/shopify/ledsone-de-collection-card-energy-label-implementation.md`
- Discovery evidence: `evidence/shopify/ledsone_de/energy-label-collection-card-discovery-2026-10-30.md`
- Validation: `validation/piranav/energy-label-snippet-audit-validation-2026-10-30.md`
- Architecture: `docs/shopify/ledsone-de-theme-architecture.md`
