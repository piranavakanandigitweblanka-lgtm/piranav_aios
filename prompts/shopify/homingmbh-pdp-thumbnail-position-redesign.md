# Prompt: Homingmbh PDP Thumbnail Position Redesign

**Category:** implementation
**Project:** homingmbh-de Shopify theme
**Registered:** 2026-11-26
**Status:** ACTIVE

---

## Context

Homingmbh uses a custom Dawn-based theme where `base.css` lines 3933–3939 force product page thumbnails into a narrow 5.6rem LEFT vertical strip via CSS Grid. The goal was to match electricalsone's layout: thumbnails below the main image in a horizontal row, with a Theme Editor toggle to switch between Left and Bottom.

---

## Prompt

```
You are a senior Shopify theme developer working on a Dawn-based custom theme.

The product page (sections/main-product.liquid) uses gallery_layout: "thumbnail_slider".
The theme's base.css forces thumbnails into a left-side vertical strip via:
  .product--thumbnail_slider media-gallery { display: grid; grid-template-columns: 5.6rem minmax(0, 1fr); }
  .product--thumbnail_slider media-gallery > .thumbnail-slider { grid-column: 1; flex-direction: column; }

Task:
1. Add a "thumbnail_position" select setting (options: left / bottom, default: bottom) to the section schema in sections/main-product.liquid
2. Add a conditional {% style %} block scoped to #MainProduct-{{ section.id }} that:
   - For BOTH positions: applies premium thumbnail styling (9rem×9rem, 2px transparent border → solid on active, opacity 0.65 → 1 on hover/active, border-radius: 4px, background: #f5f5f5)
   - For LEFT: widens grid-template-columns to 9rem, keeps vertical layout
   - For BOTTOM: switches media-gallery to flex-column, thumbnail-slider order:2 flex-direction:row, thumbnail-list to horizontal scroll row (overflow-x: auto, scroll-snap-type: x mandatory, scrollbar-width: none), thumbnail items flex: 0 0 9rem
3. Do NOT modify base.css or section-main-product.css globally — scope all overrides to #MainProduct-{{ section.id }}

Files to edit:
- sections/main-product.liquid (schema + style block)
- assets/section-main-product.css (remove any hardcoded overrides if present)

Expected output: Theme Editor shows "Thumbnail position" dropdown. Switching Left ↔ Bottom changes layout live in preview without page reload.
```

---

## Key Technical Notes

- `{% style %}` renders Liquid so section.id is available — use `#MainProduct-{{ section.id }}` to scope without polluting global CSS
- `{% stylesheet %}` does NOT render Liquid — cannot use section variables there
- Dawn's `thumbnail_slider` layout in this theme is non-standard — base.css was manually customised by a previous developer
- `theme_bash` must be used to upload file changes; local edits are not auto-synced
- After `theme_bash`, always run `theme_commit` before previewing

---

## Evidence

- Closure: `closure/README.md` → HOMING-2026-11-26-010
- Validation: pending next session
