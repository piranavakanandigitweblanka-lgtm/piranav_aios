# Validation — Conduit Task 10 FBT New Section

**Date:** 2026-10-09
**Task:** CONDUIT-TASK10-2026-10-09
**Type:** Implementation validation
**Status:** PARTIAL — desktop layout CONFIRMED via browser screenshot. Mobile and cart functionality checks still pending.

---

## Amendment 5 — 2026-10-09 (browser screenshot evidence received — desktop CONFIRMED)

Piranav provided screenshot (`Screenshot 2026-10-09 151344.png`) showing the FBT section rendering on the Shopify theme.

**Desktop layout — CONFIRMED from screenshot:**
- Section renders with 4 product cards (conduit pipe 5757, connector 5542, dome cover 5564, lamp holder 5540)
- Checkboxes visible, variant selects present (20cm / 1 PACK / Black / Rose Gold)
- Prices in cards: €2.95, €1.95, €1.95, €7.95
- **Total: £2.95 — far left** ✓
- **Add Selected To Cart button — far right** ✓
- **Both on same horizontal row** ✓
- Layout matches requirement: `justify-content: space-between` working correctly

**Evidence file:** `C:\Users\PC\Downloads\Screenshot 2026-10-09 151344.png`

Browser validation checks updated:

| # | Check | Status |
|---|---|---|
| 1 | Section renders when metafield populated | PASS — screenshot confirms |
| 3 | Current product shown first | PASS — 5757 is first card |
| 4 | Related products match metafield (5542, 5564, 5540) | PASS |
| 5 | Total price displays left-aligned | PASS — Total: £2.95 visible left |
| 6 | Add button displays right-aligned | PASS — button visible right |
| 7 | Total and button on same horizontal row (desktop) | PASS — confirmed in screenshot |

Remaining checks (not yet confirmed):
- Checkbox toggle recalculates total
- Add Selected To Cart adds products to cart
- Cart drawer opens
- Mobile layout (430/390/375px)
- No JS/Liquid errors in console

---

## Amendment 4 — 2026-10-09 (root cause diagnosis — section never pushed)

Task submitted again: footer alignment still not showing in browser. Diagnosis performed via git status + product.json inspection.

**Root cause confirmed:** `sections/frequently-bought-together.liquid` is UNTRACKED in git (never committed, never pushed to Shopify). `templates/product.json` is modified but uncommitted. Neither file has ever been uploaded to any Shopify theme. Browser is rendering OLD `snippets/frequently-bought.liquid` via `custom_liquid_CnPLXD` block in `main-product` section. New section does not exist on Shopify.

**No CSS change needed.** CSS in local file is correct.

**Action required by Piranav:**
```
cd C:\Users\PC\Documents\piranav_aios\shopify_projects\ledsone-uk-theme
shopify theme push --only sections/frequently-bought-together.liquid templates/product.json
```
Select a DRAFT theme (not live). Then open draft preview on a product with `custom.related_products` populated.

Shopify CLI auth check run: requires login (code `TZHR-BSJJ` issued, timed out — run `shopify theme list` interactively to authenticate first).

---

## Amendment 3 — 2026-10-09 (summary bar fix re-verification)

Task 10 summary bar fix re-submitted. File inspection confirmed fix is already present from Amendment 2 — no additional CSS changes needed. Static CSS re-check PASS. Summary bar rules verified in file:

| Rule | Value in file | Required | Status |
|---|---|---|---|
| `flex-direction` (desktop) | `row` | `row` | PASS |
| `align-items` (desktop) | `center` | `center` | PASS |
| `justify-content` (desktop) | `space-between` | `space-between` | PASS |
| `flex-wrap` (desktop) | `nowrap` | `nowrap` | PASS |
| `width` (desktop) | `100%` | `100%` | PASS |
| `.fbt2-total-label flex-shrink` | `0` | `0` | PASS |
| `.fbt2-total-label white-space` | `nowrap` | `nowrap` | PASS |
| `flex-direction` (mobile <768px) | `column` | `column` | PASS |
| `align-items` (mobile) | `flex-start` | `flex-start` | PASS |
| `.fbt2-add-btn width` (mobile) | `100%` | `100%` | PASS |

Prompt saved: `prompts/shopify/conduit-fbt-summary-bar-alignment.md`
PROMPT_REGISTER updated: row added for `conduit-fbt-summary-bar-alignment`

---

## Amendment 2 — 2026-10-09 (summary bar fix)

`.fbt2-summary-bar` had `flex-wrap: wrap` which allowed the total and button to stack on desktop. Fix: `flex-wrap: nowrap`, `flex-direction: row`, `justify-content: space-between`, `align-items: center`, `width: 100%`. `.fbt2-total-label` gets `flex-shrink: 0`. Mobile override corrected: `flex-direction: column`, `align-items: flex-start`, total label `text-align: left`. No HTML, JS, or Liquid changes.

---

## Amendment 1 — 2026-10-09 (responsive UI fix)

Root cause of layout problem: `.fbt2-inner` had `max-width: 100%` with no container alignment. Fix: added `class="container"` to `.fbt2-inner` so horizontal padding matches the `main` product section (both use `container`). CSS rewritten: cards enlarged (150–210px min/max on desktop), proper `gap: 8px` on products row, tablet breakpoint at 1023px, mobile cards switch to horizontal row layout, plus signs hidden on mobile, summary bar stacks vertically on mobile, add button full-width on mobile.

---

## Static Validation — PASS (14/14)

| # | Check | Result |
|---|---|---|
| 1 | Section gate: blank metafield → zero output | PASS |
| 2 | Current product always first card | PASS |
| 3 | Related products from `product.metafields.custom.related_products.value` | PASS |
| 4 | Multi-variant: select rendered with all options | PASS |
| 5 | Single-variant: no select, variant ID in card `data-variant-id` | PASS |
| 6 | Sold-out: checkbox disabled, "Sold out" label, opacity 0.55 | PASS |
| 7 | Pre-select: current product checked, related products checked if available | PASS |
| 8 | `data-price` = raw pence integer on card and option elements | PASS |
| 9 | Money format: `formatMoney(cents)` → `£X.XX` | PASS |
| 10 | Cart: POST `/cart/add.js` with `items` array (multi-item) | PASS |
| 11 | Cart integration: getSectionsToRender, cartAction, cart.open, cart-count, free-ship-progress-bar | PASS — matches existing FBT pattern |
| 12 | No class name conflicts — all classes prefixed `.fbt2-` | PASS |
| 13 | `product.json` updated — `fbt2_section` at order position 3, after `main` | PASS |
| 14 | Existing blocks in `product.json` unchanged | PASS |

---

## Browser Validation — NOT YET RUN

Requires push to draft theme and metafield population on test product.

Push command:
```
shopify theme push --only sections/frequently-bought-together.liquid templates/product.json
```

| # | Check | Status | Evidence |
|---|---|---|---|
| 1 | Section renders when metafield populated | NOT RUN | — |
| 2 | Section absent when metafield blank | NOT RUN | — |
| 3 | Current product shown first, pre-selected | NOT RUN | — |
| 4 | Related products match metafield values | NOT RUN | — |
| 5 | Checkbox toggle recalculates total correctly | NOT RUN | — |
| 6 | Variant change updates price and availability | NOT RUN | — |
| 7 | Unchecked item excluded from cart request | NOT RUN | — |
| 8 | All selected items added to cart | NOT RUN | — |
| 9 | Cart count updates correctly | NOT RUN | — |
| 10 | Cart drawer opens after add | NOT RUN | — |
| 11 | Sold-out item: disabled checkbox, no add | NOT RUN | — |
| 12 | Mobile layout: column stack, no overflow | NOT RUN | — |
| 13 | `frequently-bought.liquid` (old FBT) unaffected | NOT RUN | — |
| 14 | No JS errors in DevTools console | NOT RUN | — |
| 15 | No Liquid errors in page source | NOT RUN | — |

---

## Files Changed

| File | Change | Tracked |
|---|---|---|
| `sections/frequently-bought-together.liquid` | CREATED | Untracked — pending commit |
| `templates/product.json` | MODIFIED — fbt2_section added at position 3 | Uncommitted |

---

## Result: PARTIAL — Static PASS, Browser Validation Required
