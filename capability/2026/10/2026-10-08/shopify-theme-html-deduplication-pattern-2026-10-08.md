# Capability — Shopify Theme HTML Deduplication Pattern

## Date First Identified
2026-10-08

## Last Updated
2026-10-08

## Status
CODE COMPLETE — Browser validation pending (Piranav must push draft theme to measure reduction)

## Purpose
Dramatically reduce HTML page weight on Shopify collection pages that use variant card rendering loops, by moving repeated inline content (SVG icons, `<style>` blocks, JSON scripts) out of the per-card snippet into a page-level location that emits them once.

## Business Problem Solved
A Shopify collection page rendering both default product cards AND hidden variant cards (for filter-based UI) multiplies every inline element by the total card count. With ~1,100 card renders, a 7.83 MB HTML page was measured on the conduit-lighting collection. This causes: slow browser parse times, excessive DOM size, and poor Core Web Vitals. The pattern below resolved this without changing visible UI or filter behavior.

## When To Use
- Shopify collection page has variant card loops (each product renders N+1 cards: 1 default + 1 per variant)
- HTML page weight exceeds 2–3 MB
- The same `<style>` block, SVG icons, or JSON scripts appear inside the per-card snippet
- Fixes 1–3 below can be applied independently — use only the ones that apply

## When NOT To Use
- Single-card collections (no variant card loops) — the gain is minimal
- If the section emitting cards is not the one that also wraps the `<style>` block (check architecture first)
- Fix 4 (lightweight variant card) requires a full snippet rewrite — do not apply unless Fixes 1–3 are insufficient

## Required Inputs
- Confirmed variant card loop structure (section → snippet → variant loop)
- Baseline HTML size measurement (Chrome DevTools → Network → Doc)
- Identification of the section file (`sections/`) that wraps the per-card render calls

## Source Task / Requirement
Conduit Step 3 — HTML Reduction (Fixes 1–3)
LEDSone UK theme, 2026-10-08

## Execution Steps

### Fix 1 — Move `<style>` block out of per-card snippet

1. Find the `<style>` block inside the per-card snippet (e.g. `product-item.liquid`)
2. Cut it out of the snippet entirely
3. Paste it into the section's existing `<style>` block (e.g. `collection-meta-filters.liquid`)
4. Verify: `0 <style>` blocks remain in the snippet; section `<style>` contains the added rules

### Fix 2 — SVG symbol/use deduplication

1. Identify all inline SVG blocks in the per-card snippet (look for `<svg viewBox`, `<path d=`)
2. For each distinct icon, create a `<symbol id="icon-NAME">` containing the inner SVG content
3. Place all symbols inside a hidden `<svg style="display:none">` block at the top of the section file (emitted once)
4. In the snippet, replace each full SVG block with `<svg><use href="#icon-NAME"/></svg>`
5. Verify: `0 <path d=` elements remain in the snippet; all icon usage points to `<use>` references

### Fix 3 — Suppress JSON scripts on variant cards

1. Find `<script type="application/json">` blocks in the per-card snippet that output `product.variants | json` or similar product data
2. Wrap them with `{%- unless variant -%}...{%- endunless -%}`
3. Verify: `render 'snippet', product: product` (variant nil) → scripts emit; `render 'snippet', product: product, variant: v` (variant set) → scripts suppressed

## Baseline and Measurement (Conduit, 2026-10-08)

| Metric | Baseline | Fix scope |
|---|---|---|
| HTML size | 7,832,594 bytes (7.83 MB) | Fixes 1–3 target the duplicate content |
| DOM elements | 19,966 | Not directly affected by Fixes 1–3 |
| `<script>` elements | 703 | Fix 3 reduces these |
| `<svg>` elements | 1,221 | Fix 2 reduces these |

**Note:** Post-fix measurement is PENDING browser validation. No confirmed reduction percentage is available at the time of this capability creation.

## Evidence Required
- Baseline HTML size (DevTools or curl measurement)
- Static verification (grep for `<style>`, `<path d=`, JSON script in snippet = 0)
- Post-deploy HTML size measurement

## Evidence Path
`conduit-stock-price-cards/02_implementation/CONDUIT-STEP3-html-reduction-2026-10-08.md`

## Pass / Fail Rule
PASS: All 3 static checks pass (0 `<style>` in snippet, 0 `<path d=` in snippet, JSON scripts wrapped in `unless variant`). Post-deploy HTML size smaller than baseline.
FAIL: Any static check fails, OR visible UI changes (filter behavior, icon rendering, product data broken).

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator

## Known Limits
- Fix 2 requires all SVG icon variants (hover states, aria labels) to be captured inside the symbol — verify no icon uses dynamic Liquid attributes that vary per card
- Fix 3 assumes variant cards do not need the JSON scripts for filter/JS operations — verify with the theme's filter JS before applying
- Fix 4 (lightweight variant card) was deferred pending measurement of Fixes 1–3 and is NOT documented here

## Reuse Path
Apply to any Shopify theme's collection snippet where variant card loops exist. The three fixes are independent and can be applied in any order.

## Related Capabilities
- `shopify-collection-specific-swatch-guard-2026-10-08.md` — also modifies `product-item.liquid`
- `shopify-collection-card-stock-price-fix-2026-10-07.md` — also modifies `product-item.liquid`

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-10-08 | Initial capability captured from Conduit Step 3 | `conduit-stock-price-cards/02_implementation/CONDUIT-STEP3-html-reduction-2026-10-08.md` |
