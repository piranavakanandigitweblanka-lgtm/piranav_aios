---
name: energy-label-search-css-fix-2026-11-02
description: Evidence for ledsone_de energy label CSS fix on search results page — black oval button resolved by loading energy-label-card.css on main-search.liquid and adding !important overrides to elc-trigger
metadata:
  type: evidence
  project: ledsone_de
  date: 2026-11-02
  status: PASS — pushed to live theme
---

# Evidence: Energy Label Search Page CSS Fix — ledsone_de

**Date:** 2026-11-02
**Session:** Piranav + Claude Code
**Issue reported:** Energy label badge showing as broken black oval on search results page
**Root cause:** `energy-label-card.css` not loaded on search page template

---

## Problem

The energy label snippet (`energy-label-card.liquid`) renders on the search page because `product-item.liquid` is shared between collection and search sections. On the search page, `energy-label-card.css` was not loaded — so the `.elc-trigger` button inherited the theme's default button styles (black background, large border-radius, large padding = black oval pill).

---

## Files Changed

### 1 — `sections/main-search.liquid` (+1 line)

Added CSS load at top of file alongside other stylesheet_tag lines:

```liquid
{{ 'energy-label-card.css' | asset_url | stylesheet_tag }}
```

### 2 — `assets/energy-label-card.css` — `.elc-trigger` hardened with `!important`

Added `!important` to all properties that the theme could override:

```css
.elc-trigger {
  display: inline-flex !important;
  align-items: center !important;
  background: none !important;
  border: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  cursor: pointer;
  flex-shrink: 0;
  line-height: 0 !important;
  box-shadow: none !important;
  min-width: 0 !important;
  min-height: 0 !important;
  width: auto !important;
  height: auto !important;
}
```

---

## Result

- Search page: energy label renders with correct arrow badge style
- Collection page: unaffected — still working as before
- Other pages (wishlist, recommendations): snippet renders but CSS now also correct if ever seen

---

## Deploy

Pushed via Shopify CLI:
```
shopify theme push --only sections/main-search.liquid assets/energy-label-card.css
```

---

## Linked Files

- Prompt: `prompts/shopify/ledsone-de-search-energy-label-css-fix.md`
- Validation: `validation/piranav/energy-label-search-css-fix-validation-2026-11-02.md`
- Prior evidence: `evidence/shopify/ledsone_de/energy-label-collection-card-implementation-2026-10-30.md`
