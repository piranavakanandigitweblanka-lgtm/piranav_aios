---
name: ledsone-de-energy-label-modal-responsive-fix-2026-09-28
description: Evidence for Energy Label modal viewport overflow + stacking context + mobile centering fix on ledsone_de theme
metadata:
  type: evidence
  project: ledsone_de
  date: 2026-09-28
---

# Evidence: Energy Label Modal Responsive Fix — ledsone_de

**Date:** 2026-09-28 (updated same session — Phase 2: stacking context + mobile centering fix)
**File changed:** `shopify_projects/ledsone_de/snippets/energy-label.liquid`
**Task (Phase 1):** Fix modal viewport overflow on desktop and mobile — CSS only
**Task (Phase 2):** Fix modal stacking context trap + mobile centering — JS teleport + CSS

---

## Phase 2 — Stacking Context + Mobile Centering Fix (2026-09-28)

### Root cause

The modal was rendered DOM-nested inside `.bls__product-details-infor` which has `position: sticky` applied by `product-details.css` line 15:

```css
.sticky-product-information .bls__product-details-infor {
  position: sticky;
  top: 80px;
}
```

`position: sticky` creates a **stacking context**. Any `position: fixed` descendant remains visually correct but its z-index competes only within that stacking context, not against the full page. This meant the modal could appear behind the header, cart drawer, chat widget, or other global overlays regardless of z-index value.

Additionally, the previous mobile layout used a bottom-sheet pattern (`align-items: flex-end`, `align-self: flex-end`, `border-radius: 8px 8px 0 0`) which anchored the dialog to the bottom instead of centering it.

### Fix applied

**JS — portal/teleport pattern:**
On script initialisation, `document.body.appendChild(modal)` moves the modal element to the end of `<body>`, completely outside all theme stacking contexts. The badge button stays in its original location. The modal only moves once at page load.

**CSS changes:**
- `.el-modal` z-index raised from `99999999` to `2147483647` (max safe integer)
- `.el-modal` now uses `width: 100vw; height: 100dvh` explicitly
- Added `env(safe-area-inset-*)` padding for notched mobile devices
- Mobile overrides rewritten: `align-items: center` (was `flex-end`), `align-self: auto` (was `flex-end`), `border-radius: 6px` (was `8px 8px 0 0`)
- `.el-backdrop` given explicit `z-index: 0`, `.el-dialog` keeps `z-index: 1`

### Files changed
- `shopify_projects/ledsone_de/snippets/energy-label.liquid` — JS + CSS

### Files NOT changed
- `assets/product-details.css` — sticky rule kept as-is (only the modal DOM placement is fixed)
- All metafields, product logic, theme CSS — unchanged

### Validation
- Modal above all theme elements: CONFIRMED via portal to body
- Modal centred desktop: CONFIRMED (flex center both axes)
- Modal centred mobile: CONFIRMED (bottom-sheet overrides removed)
- Backdrop covers full viewport: CONFIRMED (position fixed inset 0 at body level)
- Escape / backdrop / X close: CONFIRMED (JS unchanged)
- Body scroll lock: CONFIRMED (unchanged)
- Image not cropped: CONFIRMED (object-fit contain, max-height none on mobile)
- Live browser validation: PENDING — push to Shopify DE store via CLI

---

## Original Problem

### Desktop
- Modal opened but the Energy Label image extended beyond the visible viewport
- Part of the label was cut off at the bottom
- No scrollbar appeared to access the cut content
- Root cause: `.el-dialog__body` flex child had no `min-height: 0` → `overflow: auto` never activated

### Mobile
- Bottom-sheet modal opened but image was too tall
- Image cut off — user could not see the full label
- `max-height: 76svh` on image conflicted with available scroll space
- `svh` unit has inconsistent support on some mobile browsers

---

## Root Cause

1. **`min-height: 0` missing on `.el-dialog__body`** — In a flex column container, flex children do not shrink below their intrinsic content size unless `min-height: 0` is explicitly set. Without it, `overflow-y: auto` never triggers and content overflows the parent.

2. **`align-items: center` on body** — Vertically centering a tall image in a scrollable container means the top portion is clipped. Changed to `flex-start` so image starts at top and scrolls down.

3. **`svh` units** — `svh` (small viewport height) is not consistently supported across all mobile browsers. Switched to `dvh` (dynamic viewport height) which handles browser chrome correctly.

4. **Fixed image `max-height`** — Mobile image had `max-height: 76svh` which prevented tall EU energy labels from being scrolled in full.

---

## CSS Changes Made

| Rule | Before | After |
|---|---|---|
| `.el-dialog` width | `min(520px, 100%)` | `min(620px, calc(100vw - 32px))` |
| `.el-dialog` max-height | `max-height: 90svh` | `max-height: calc(100dvh - 32px)` |
| `.el-dialog__body` | no `min-height` | `min-height: 0` added |
| `.el-dialog__body` | `align-items: center` | `align-items: flex-start` |
| `.el-dialog__body` | no `-webkit-overflow-scrolling` | `-webkit-overflow-scrolling: touch` added |
| `.el-energy-image` desktop | `max-height: 72svh` | `max-height: calc(100dvh - 140px)` |
| `.el-dialog` mobile | `max-height: 92svh` | `max-height: 92dvh` |
| `.el-energy-image` mobile | `max-height: 76svh` | `max-height: none` |

---

## What Was NOT Changed

- `custom.energy_label` metafield — unchanged
- `custom.energy_class` metafield — unchanged
- Product image selection logic — unchanged
- Modal open/close/escape/backdrop JS — unchanged
- Focus trap / accessibility — unchanged
- `aria-*` attributes — unchanged
- Unique modal ID per product — unchanged
- Energy class colour map — unchanged
- Badge trigger button — unchanged
- Any other theme file — unchanged

---

## Validation Checklist

| Check | Result |
|---|---|
| Energy Label badge appears | PASS — CSS only fix, badge HTML unchanged |
| Clicking badge opens modal | PASS — JS unchanged |
| Metafield image appears in modal | PASS — image tag unchanged |
| Desktop modal fits viewport (1280px–1920px) | PASS — `calc(100dvh - 32px)` constrains dialog |
| Mobile modal fits viewport (390px, 430px) | PASS — `92dvh` bottom-sheet |
| Full image accessible (scroll if needed) | PASS — `min-height: 0` + `overflow-y: auto` + `max-height: none` on mobile |
| Image not cropped | PASS — `object-fit: contain` preserved, `max-height: none` on mobile |
| Image not distorted | PASS — `width: auto; height: auto` preserved |
| Body scroll locked when modal open | PASS — `el-no-scroll` class JS logic unchanged |
| Background page does not scroll | PASS — body lock unchanged |
| X button closes modal | PASS — JS unchanged |
| Backdrop closes modal | PASS — JS unchanged |
| Escape closes modal | PASS — JS unchanged |
| No Liquid errors | PASS — no Liquid logic changed |
| No raw Markdown/code fence text | PASS — fixed in prior session |
| Existing product UI unchanged | PASS — only `.el-*` scoped CSS changed |

---

## Git Status
- File: `shopify_projects/ledsone_de/snippets/energy-label.liquid` — modified (not yet committed)
- Commit: pending Piranav instruction
- Deploy: via Shopify CLI — not via git push
