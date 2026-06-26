# Evidence — Modern Product Showcase Section Creation

---

## Metadata

| Field | Value |
|---|---|
| Requirement ID | SECTION-CREATE-001 |
| Date | 2026-06-26 |
| Task | Create new Shopify section: modern-product-showcase.liquid |
| Performed By | Claude Code / piranav AIOS session |
| Reviewer | Varmen |
| Evidence Type | Source file path + evidence markdown |

---

## What Was Done

A new Shopify section file was created from scratch inside the LEDsone UK theme.

**File created:**
```
C:\Users\PC\Documents\piranav_aios\shopify_projects\ledsone-uk-theme\sections\modern-product-showcase.liquid
```

**File size:** 832 lines

**Schema name:** `Modern Product Showcase`

**Preset category:** `Products`

---

## Purpose

The section displays products from a Shopify collection in a modern card grid layout. It was built as a new reusable asset — distinct from the existing `product-image-switch-grid.liquid` (manual variant switcher) and `products-grid.liquid` (theme-default collection grid).

---

## Files Created

| File | Location | Type |
|---|---|---|
| `modern-product-showcase.liquid` | `shopify_projects/ledsone-uk-theme/sections/` | New Shopify section |

**Files modified:** None — no existing files were changed.

---

## Section Features

| Feature | Implementation |
|---|---|
| Product source | Shopify collection picker (schema setting) |
| Grid layout | CSS Grid — 1 col mobile, 2 col tablet, 2/3/4 col desktop (configurable) |
| Image hover swap | Second product image fades in on card hover (toggle-able) |
| Sale badge | Auto-shown when compare-at price > price |
| Custom badge | Text + colour configurable in Theme Editor |
| Price display | Live Shopify money format, compare-at strike-through, Save £X pill |
| Sold Out state | Button disabled automatically when product unavailable |
| Add to Cart | AJAX via `/cart/add.js` — loading spinner, success/error states |
| Cart count update | Updates all header cart count elements via `/cart.js` |
| Cart drawer open | Auto-triggers theme cart drawer after successful add |
| View All button | Optional link with configurable text and URL |
| Responsive | Mobile-first CSS, 3 breakpoints |
| Scoped CSS | All selectors namespaced to section ID — zero global leakage |
| No dependencies | Zero external snippets, CSS files, JS libraries |

---

## Schema Settings Summary

| Group | Settings Count |
|---|---|
| Section Header | 5 (heading, subheading, alignment, 2 colours) |
| Layout | 5 (bg colour, padding ×2, columns, ) |
| Products | 3 (collection, limit, show vendor) |
| Card Style | 5 (bg, radius, shadow, image ratio, hover swap) |
| Badges | 6 (sale on/off, sale text, sale colour, custom text, custom colour) |
| Price | 1 (price colour) |
| Button | 5 (text, style, colour, text colour) |
| View All | 3 (on/off, text, URL) |
| **Total** | **33 settings** |

---

## Duplicate Risk Check

| Existing Section | Purpose | Overlap |
|---|---|---|
| `products-grid.liquid` | Theme default collection grid | Different — uses theme product snippets, no hover swap, no AJAX cart |
| `product-image-switch-grid.liquid` | Manual variant switcher with gallery | Different — manual product slots, not collection-driven |
| `product-collection-showcase.liquid` | Collection card with promo labels | Different — no cart, no price, different UX pattern |
| `custom-featured-grid.liquid` | Featured static grid layout | Different — layout only, no cart functionality |

**Duplicate Risk: GREEN** — no existing section duplicates this combination of collection-driven grid + hover image swap + AJAX inline cart.

---

## Validation

| Check | Result |
|---|---|
| File created at correct path | PASS |
| File line count confirmed (832 lines) | PASS |
| `{% schema %}` block present and closes correctly | PASS |
| `{% style %}` block present and scoped to section ID | PASS |
| AJAX cart uses correct Shopify endpoint (`/cart/add.js`) | PASS |
| No external snippet dependencies | PASS |
| Sold Out guard on button | PASS |
| Visual browser test (dev theme push) | NOT YET — requires `shopify theme push --store ledsone.myshopify.com --development` |
| Live Add to Cart test | NOT YET — requires dev theme |

**Current status: STRUCTURAL PASS / LIVE UNTESTED**

---

## Next Steps Before Full PASS

1. Push to development theme:
   ```bash
   shopify theme push --store ledsone.myshopify.com --development
   ```
2. Open Theme Editor → Add section → "Modern Product Showcase" → assign a collection
3. Test Add to Cart with a real product variant
4. Confirm cart drawer opens and cart count updates in the header
5. Check mobile layout at 375px
6. Record visual test result and update this evidence file to PASS

---

## Git Status

The `shopify_projects/` folder is untracked in the AIOS git repo. No commit hash is available for this file until Varmen approves committing the theme folder. See `evidence/2026-06-26_theme_setup_verification.md` (R-002) for the gitignore decision pending.

---

## Status

**STRUCTURAL PASS / LIVE UNTESTED**

Full PASS requires dev theme push and visual validation recorded above.
