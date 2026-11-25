# Prompt — LEDSone US Homepage Section Build (Shopify Liquid)

**Category:** shopify / implementation
**First used:** 2026-11-25
**Status:** ACTIVE

---

## Context

Build new Shopify Liquid sections for the ledsone.us store based on an approved HTML design preview. Sections must:
- Match preview CSS/design exactly (from `ledsone-us-homepage-preview/index.html` and `design/Homepage-desktop-html/Main.dc.html`)
- Use native theme patterns (`bls__section`, `color_scheme`, `container`, padding vars, animations)
- Be manually uploaded to the theme by Piranav (not CLI)
- Have full schema controls so all content is editable in the Shopify theme editor

---

## Reusable Prompt Pattern

```
Build a new Shopify Liquid section for ledsone us theme at:
`shopify_projects/ledsone us/sections/[filename].liquid`
and CSS at:
`shopify_projects/ledsone us/assets/[filename].css`

Design source:
- Preview HTML: C:\Users\PC\Downloads\piranav-handover-ledsone-us\piranav-handover-ledsone-us\ledsone-us-homepage-preview\index.html
- Design file: C:\Users\PC\Downloads\piranav-handover-ledsone-us\piranav-handover-ledsone-us\design\Homepage-desktop-html\Main.dc.html

Requirements:
1. Read preview HTML for exact CSS values before writing any code
2. Use `bls__section` wrapper + `color-{{ color_scheme }} gradient` class
3. Use `--section-padding-top/bottom` CSS vars with spt/spb tablet/mobile helpers
4. Use `container` / `container-fluid` / `strecth-width` / `full-width` selector in schema
5. All content editable: image_picker, collection picker, text, url, color fields in schema
6. `auto-fit` grid for any card/grid layout (avoids blank trailing cells)
7. Mobile: `flex`, `overflow-x: auto`, `scroll-snap-type: x mandatory`, bleed via negative margin
8. CSS scoped under `.bls__ld-[name]` prefix — no global overrides
9. `disabled_on: groups: ["header", "footer"]` unless it is a header section
10. Preset with real content from the preview pre-filled

Preview CSS tokens:
--ink: #141414 | --paper: #F4F2EE | --navy: #1C2B5A | --gold: #E0B464
--night: #17150F | --brown: #7A5414 | --red: #B42318 | --star: #C98A1B
--sand: #EDE7DC | --muted: #5B5B5B | --pill: #D8D3CB | --line: #E6E2DC
```

---

## Key Technical Constraints

- Sections are manually uploaded — no Shopify CLI deploy
- Images set via `image_picker` in schema — no hardcoded URLs
- Collections set via `collection` picker — no hardcoded handles
- Never use translation keys that don't exist in the theme (`| t:` only for known keys)
- `auto-fit` grid always preferred over fixed column count to avoid blank trailing cells
- Mobile swipe: bleed via `margin-left: calc(-1 * var(--bs-gutter-x, 15px))`

---

## Sections Built Under This Pattern

| Section | File | Date |
|---|---|---|
| Shop by Category | `sections/ld-categories.liquid` | 2026-11-24 |
| Featured Product Tabs | `sections/featured-product-tabs.liquid` | 2026-11-24 |
| Shop by Room | `sections/ld-shop-by-room.liquid` | 2026-11-24 |
| Customer Reviews | `sections/ld-reviews.liquid` | 2026-11-24 |
| Trust Bar | `sections/ld-trust-bar.liquid` | 2026-11-24 |
| Hero (Black Friday) | `sections/ld-hero.liquid` | 2026-11-25 |
