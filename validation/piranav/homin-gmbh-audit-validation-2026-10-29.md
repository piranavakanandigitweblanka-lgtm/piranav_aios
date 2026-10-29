# Validation: Homin GmbH Shopify Theme Audit — Phase 1 Read-Only

**Date:** 2026-10-29
**Req ID:** AIOS-2026-10-29-HOMIN-001
**Task:** Phase 1 read-only audit of Homin GmbH Shopify theme
**Auditor:** Claude Code

---

## File Coverage Checklist

| Category | Files Inspected | Status |
|---|---|---|
| layout/ | theme.liquid, password.liquid | PASS |
| sections/ | header, footer, main-product, main-collection-product-grid, featured-collection, image-banner, hero-split, utility-bar, value-props, category-circles, collection-chips, image-tile-grid, reviews-band | PASS |
| snippets/ | meta-tags, card-product, product-sticky-bar, product-details-table, product-faq-ui, breadcrumbs | PASS |
| assets/ | base.css, section-main-product.css, selected component CSS files | PASS |
| config/ | settings_data.json | PASS |
| locales/ | de.json | PASS |
| templates/ | Directory listed (json-based templates confirmed) | PASS |

## Rule Checks

| Rule | Check | Result |
|---|---|---|
| Read-only — no theme files changed | Confirmed by audit process | PASS |
| No git commit in theme directory | No git repo in theme dir; parent repo status unchanged | PASS |
| No Shopify CLI commands run | Not run | PASS |
| AIOS docs created in piranav_aios only | Yes — only files in piranav_aios modified | PASS |

## Issues Found

| Count | Severity |
|---|---|
| 1 | CRITICAL |
| 5 | HIGH |
| 7 | MEDIUM |
| 4 | LOW |
| 5 | DESIGN RECOMMENDATION |

**Total issues logged: 22**

## AIOS Assets Created This Session

| # | Asset | Path | Status |
|---|---|---|---|
| 1 | Prompt | `prompts/shopify/shopify-theme-read-only-audit.md` | DONE |
| 2 | Evidence | `evidence/piranav/homin-gmbh-shopify-theme-audit-2026-10-29.md` | DONE |
| 3 | Capability | N/A — audit only; no new system capability created | N/A |
| 4 | Closure | `closure/README.md` | DONE |
| 5 | PROMPT_REGISTER | Updated | DONE |
| 6 | Validation | This file | DONE |
| 7 | Source-map | `source-map/README.md` — Homin theme path added | DONE |
| 8 | Docs | `docs/homingmbh/README.md` — theme audit row added | DONE |
| 9 | Handover | N/A — no handover to another person; awaiting Piranav approval | N/A |
| 10 | Reports | N/A — audit evidence file covers reportable output | N/A |
| 11 | Duplicate-risk | No duplicate risk — evidence file is new unique named file | N/A |

## Pass/Fail

**PASS** — read-only audit complete; 22 issues documented; 7 AIOS assets created/updated; no theme files changed; closure written.
### Fix Applied

| Check | Result |
|---|---|
| Root cause identified | PASS — `utility-bar__grid--3-col` constrains `.announcement-bar` to 40% width (4/10 columns) when `enable_language_selector: true` and blocks present |
| Fix applied to local file | PASS — `grid-column: 1 / -1` added to `.announcement-bar--marquee` in `{% stylesheet %}` block of `sections/announcement-bar.liquid` |
| CSS cascade verified | PASS — section `{% stylesheet %}` loads after `assets/base.css`; `grid-column` overrides column placement of `grid-area: announcements` |
| No other files modified | PASS — only `sections/announcement-bar.liquid` changed |
| Non-marquee mode unaffected | PASS — `grid-column: 1 / -1` only applies to `.announcement-bar--marquee` class; standard/slideshow branches unchanged |
| Mobile layout unaffected | PASS — `utility-bar__grid--3-col` is desktop-only (≥990px); `grid-column: 1 / -1` on 1-col grid = no change |

### Browser Validation

| Check | Status |
|---|---|
| Desktop: full-width marquee | PENDING — fix not yet pushed to Shopify draft theme |
| Seamless scroll animation | PENDING |
| Language selector no overlap | PENDING |
| Marquee OFF restores Dawn behaviour | PENDING |
| Reduced motion fallback | PENDING |

**Action required:** Piranav must run `shopify theme push` targeting the staging draft theme, then verify in preview.

### Pass/Fail

**PASS (code-level)** — root cause confirmed, fix applied and verified by CSS analysis. Browser validation pending theme push.

### Fix Checklist

| Check | Result |
|---|---|
| Root cause Fix A confirmed | PASS — `5.6rem` thumbnail column in base.css custom CSS; reduced to `4.8rem` via override |
| Root cause Fix B confirmed | PASS — `component-slider.css` line 332: `.slider--mobile + .slider-buttons { display: none; }` at ≥750px; `<ul>` class is `slider slider--mobile` |
| CSS override in correct file | PASS — appended to `assets/section-main-product.css` (loads after base.css and component-slider.css) |
| Fix A scoped to ≥990px | PASS |
| Fix B scoped to ≥750px | PASS |
| Both fixes scoped to `.product--thumbnail_slider` | PASS |
| No Liquid / JS files modified | PASS |
| Thumbnail rail unaffected | PASS — `:not(.thumbnail-slider)` exclusion |
| No other product page elements changed | PASS |

### Browser Validation

| Check | Status |
|---|---|
| Thumbnail strip visibly narrower | PENDING |
| Overlay arrows visible on main image | PENDING |
| Arrows hover state correct | PENDING |
| Mobile no regression | PENDING |

**PASS (code-level)** — CSS analysis confirms correct override cascade. Browser validation pending `shopify theme push`.

---

## Verification Session — banner-gallery.liquid (2026-10-29) — Req AIOS-2026-10-29-009

| Check | Result |
|---|---|
| All 57 CSS assets searched for class name conflicts | PASS — zero conflicts |
| `templates/index.json` read — section not on homepage | PASS |
| Schema setting types verified | PASS |
| Liquid filter syntax verified | PASS |
| Banner height CSS variable usage | FAIL — `height: auto` ignores `--desktop-height`/`--mobile-height` |
| JS scoped to section instance | FAIL — all selectors are `document.querySelector` |
| Fade slider interval clearable | FAIL — return value not stored |
| Theme Editor lifecycle handlers present | FAIL — none present |
| No theme files modified | PASS |

**Result: CONDITIONALLY INCOMPATIBLE — 4 FAIL confirmed by static inspection. Browser validation required for 5 additional items.**

---

## Fix Session 4 — banner-gallery.liquid Fixes (2026-10-29) — Req AIOS-2026-10-29-010

| Fix | Check | Result |
|---|---|---|
| Fix 1 — CSS height vars | `height: var(--desktop-height, 400px)` present in CSS | PASS |
| Fix 1 — Mobile media query | `@media (max-width: 768px) { .main-banner { height: var(--mobile-height, 300px); } }` present | PASS |
| Fix 2 — IIFE wrapper | Script wrapped in `(function () { ... })()` | PASS |
| Fix 2 — Section scope | `document.currentScript.closest('.shopify-section')` used | PASS |
| Fix 2 — All selectors scoped | `sectionEl.querySelector`/`querySelectorAll` used throughout | PASS |
| Fix 3 — Interval stored | `fadeInterval = setInterval(...)` | PASS |
| Fix 4 — Named functions | `updateProductsPerSetFn`, `handleBannerClickFn`, `handleVisibilityChangeFn` | PASS |
| Fix 4 — Unload handler | `shopify:section:unload` clears all intervals and listeners | PASS |
| No other files modified | Confirmed by inspection | PASS |

**PASS (code-level)** — all 4 fixes applied and verified by code inspection. Browser validation pending.
