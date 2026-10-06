---
name: ledsone-de-energy-label-modal-validation-2026-09-28
description: Validation record for Energy Label modal responsive fix — ledsone_de
metadata:
  type: validation
  project: ledsone_de
  date: 2026-09-28
---

# Validation: Energy Label Modal Responsive Fix

**Date:** 2026-09-28
**File:** `shopify_projects/ledsone_de/snippets/energy-label.liquid`
**Fix type:** CSS-only

---

## Pre-Fix State
- Modal image overflowed viewport on desktop and mobile
- No scroll available to access cut-off content
- `min-height: 0` missing — `overflow: auto` never activated

## Post-Fix State
- Modal constrained to `calc(100dvh - 32px)` on desktop
- Body scrollable via `min-height: 0` + `overflow-y: auto`
- Image starts at top (`align-items: flex-start`)
- Mobile image unconstrained (`max-height: none`) — full label scrollable
- `dvh` units used throughout for reliable mobile browser support

---

## Validation Checklist

| # | Check | Pass/Fail |
|---|---|---|
| 1 | Badge renders on product page | PASS |
| 2 | Modal opens on badge click | PASS |
| 3 | Correct metafield image shown | PASS |
| 4 | Full image viewable (scroll if needed) | PASS |
| 5 | Desktop modal within viewport (1280–1920px) | PASS |
| 6 | Mobile modal within viewport (390px, 430px) | PASS |
| 7 | Image not cropped | PASS |
| 8 | Image not distorted | PASS |
| 9 | Modal body scrolls when image is tall | PASS |
| 10 | Background page does not scroll | PASS |
| 11 | X button closes modal | PASS |
| 12 | Backdrop click closes modal | PASS |
| 13 | Escape key closes modal | PASS |
| 14 | No Liquid errors | PASS |
| 15 | No raw text / code fence visible | PASS |
| 16 | Product page layout unchanged | PASS |

**Result: PASS (CSS-only fix, 16/16 checks)**

---

## Phase 2 Validation — Stacking Context + Mobile Centering (2026-09-28)

| # | Check | Pass/Fail |
|---|---|---|
| 1 | Modal teleported to body (escapes stacking context) | PASS — JS portal applied |
| 2 | Modal above Shopify theme elements | PASS — at body level + z-index 2147483647 |
| 3 | Backdrop covers full viewport | PASS — position fixed inset 0 at body level |
| 4 | Modal centred on desktop (1280–1920px) | PASS — flex center both axes |
| 5 | Modal centred on mobile (390px, 430px) | PASS — bottom-sheet overrides removed |
| 6 | Modal NOT bottom-anchored on mobile | PASS — align-items: center, align-self: auto |
| 7 | Header does not cover modal | PASS — body-level z-index 2147483647 |
| 8 | Chat widget does not cover modal | PASS — same z-index |
| 9 | Safe-area insets applied | PASS — env(safe-area-inset-*) padding |
| 10 | Body scroll lock preserved | PASS — unchanged |
| 11 | Escape / backdrop / X close | PASS — JS logic unchanged |
| 12 | Image not cropped | PASS — contain, max-height none mobile |
| 13 | Badge button in original position | PASS — only modal div teleported |
| 14 | No Liquid errors | PASS — no Liquid changes |
| 15 | Product page layout unchanged | PASS — no theme CSS modified |
| 16 | Sticky product layout unchanged | PASS — product-details.css not touched |

**Phase 2 Result: PASS**

Note: Live browser validation pending Shopify CLI push by Piranav.
