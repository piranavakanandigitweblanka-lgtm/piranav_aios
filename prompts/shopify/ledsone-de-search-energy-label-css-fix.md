---
name: ledsone-de-search-energy-label-css-fix
description: Fix energy label CSS breaking on search results page when shared product-item snippet renders without its CSS being loaded
metadata:
  type: prompt
  category: shopify
  project: ledsone_de
  date: 2026-11-02
---

# Prompt: Fix Energy Label CSS on Search Results Page

## Context

The ledsone_de theme uses a shared `product-item.liquid` snippet across collection pages, search results, wishlist, and recommendations. An energy label snippet (`energy-label-card.liquid`) is rendered inside `product-item.liquid`. The CSS file (`energy-label-card.css`) was only loaded on the collection page section — not on the search section. This caused the badge button to inherit the theme's default button styles (black oval) on search results.

## Task

1. Find the search results section file (`sections/main-search.liquid`)
2. Add `{{ 'energy-label-card.css' | asset_url | stylesheet_tag }}` at the top alongside existing stylesheet_tag lines
3. In `assets/energy-label-card.css`, add `!important` to all `.elc-trigger` properties that the theme button styles could override: `display`, `background`, `border`, `border-radius`, `padding`, `margin`, `line-height`, `box-shadow`, `min-width`, `min-height`, `width`, `height`

## Key Constraints

- Do NOT add a gate/condition — load the CSS unconditionally on search
- Do NOT touch `snippets/energy-label-card.liquid` or `snippets/product-item.liquid`
- Only 2 files change: `sections/main-search.liquid` and `assets/energy-label-card.css`
- Push via Shopify CLI: `shopify theme push --only sections/main-search.liquid assets/energy-label-card.css`

## Expected Output

Energy label arrow badge renders with correct styles on search results page. Collection page unaffected.
