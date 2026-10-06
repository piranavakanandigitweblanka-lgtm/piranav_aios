---
name: energy-label-modal-responsive-fix
description: CSS fix for Energy Label modal viewport overflow on desktop and mobile — Shopify Liquid snippet
metadata:
  type: prompt
  project: ledsone_de
  date: 2026-09-28
---

# Prompt: Energy Label Modal Responsive UI Fix

## Context
Shopify theme snippet `snippets/energy-label.liquid` renders an energy efficiency badge and modal. The modal opens correctly but the image overflows the viewport on both desktop and mobile, causing the label to be visually cut off.

## Problem
- Modal dialog exceeds viewport height — image not fully visible
- `overflow: auto` on `.el-dialog__body` never activates because flex parent has no `min-height: 0`
- Image `max-height` set in `svh` units, not accounting for header height overhead
- Mobile image has a fixed `max-height` that prevents full label from being scrolled

## Fix Pattern
Apply these targeted CSS changes only — do not rebuild functionality or change metafields:

1. `.el-dialog` — change `max-height` from `90svh` to `calc(100dvh - 32px)`, widen to `min(620px, calc(100vw - 32px))`
2. `.el-dialog__body` — add `min-height: 0` (critical for flex scroll), change `align-items: center` to `align-items: flex-start`, add `-webkit-overflow-scrolling: touch`
3. `.el-energy-image` desktop — change `max-height` to `calc(100dvh - 140px)` (accounts for header ~69px + padding ~40px + safety buffer)
4. Mobile `.el-dialog` — change `max-height: 92svh` to `92dvh`
5. Mobile `.el-energy-image` — set `max-height: none` so tall image scrolls freely inside body

## Key Rule
Never use `object-fit: cover` on energy label images. Always `contain` or unconstrained.

## Files
- `shopify_projects/ledsone_de/snippets/energy-label.liquid`

## Metafields (do not change)
- `custom.energy_label` — file_reference (image)
- `custom.energy_class` — single_line_text
