---
name: energy-label-snippet-audit-2026-10-30
description: Complete technical audit of snippets/energy-label.liquid on ledsone_de — bugs, risks, compatibility, accessibility findings
metadata:
  type: evidence
  project: ledsone_de
  date: 2026-10-30
  status: AUDIT COMPLETE — AWAITING FIX APPROVAL
---

# Evidence: EU Energy Label Snippet Audit — ledsone_de

**Date:** 2026-10-30
**Auditor:** Claude Code (piranav AIOS session)
**File audited:** `shopify_projects/ledsone_de/snippets/energy-label.liquid`
**Audit type:** Read-only — no files modified
**Prior evidence:** `evidence/shopify/ledsone-de-energy-label-modal-responsive-fix-2026-09-28.md`

---

## Audit Scope

Full static code audit covering:
- Liquid variable handling and metafield access
- CSS — class conflicts, z-index, mobile layout
- JavaScript — event listeners, scope, memory leaks, accessibility
- Theme compatibility — base.css, product.css, product-details.css, product.js, main-product.js
- Render context and style deduplication guard
- ARIA and keyboard accessibility
- Mobile scroll lock behaviour

---

## File Context

| Item | Detail |
|---|---|
| File | `shopify_projects/ledsone_de/snippets/energy-label.liquid` |
| Total lines | 499 |
| Render location | `sections/main-product.liquid:873` — one call per PDP |
| Disabled duplicate | `templates/product.json` block `custom_liquid_XycCf8` — **disabled** |
| Prior fix applied | 2026-09-28: stacking context teleport + modal responsive fix |
| Git status | Modified (unstaged) |

---

## BUG FINDINGS

### BUG-1 — `el_letter` empty when energy_class metafield is missing
**Severity: Medium**
**Lines:** 14–15, 32

```liquid
{%- assign energy_class_raw = product.metafields.custom.energy_class | default: '' -%}
{%- assign energy_class     = energy_class_raw | strip | upcase -%}
...
{%- assign el_letter = energy_class | default: '—' -%}
```

**Problem:** The Liquid `| default` filter only triggers on `nil` or `false` values. It does NOT trigger on empty strings. The chain on line 14 sets `energy_class_raw = ''` when the metafield is missing (via `| default: ''`). After `| strip | upcase`, `energy_class = ''`. On line 32, `energy_class | default: '—'` receives an empty string — the default does NOT fire — so `el_letter = ''`.

**Result:** If a product has `custom.energy_label_data_sheet` populated but `custom.energy_class` missing, the component renders: coloured badge arrow with no letter text (blank). This is visually broken and confusing.

**Fix required:** Replace line 32 with a blank check:
```liquid
{%- if energy_class == blank -%}
  {%- assign el_letter = '—' -%}
{%- else -%}
  {%- assign el_letter = energy_class -%}
{%- endif -%}
```
OR: change line 14 to `| default: '—'` directly (simpler but changes the colour logic fallback too — less clean).

---

### BUG-2 — `el_styles_loaded` deduplication guard is broken by Shopify render scope isolation
**Severity: Low (no current impact — 1 render call per page)**
**Lines:** 165–166, 439

```liquid
{%- unless el_styles_loaded -%}
  {%- assign el_styles_loaded = true -%}
  <style>...</style>
{%- endunless -%}
```

**Problem:** In Shopify Liquid, `{% render %}` tag creates an **isolated variable scope**. Variables assigned inside a `{% render %}` call are NOT visible to any subsequent `{% render %}` call of the same file. The `el_styles_loaded = true` assignment is scoped to that one render invocation only. On any future render call (e.g. quickview modal + PDP both calling `render 'energy-label'`), `el_styles_loaded` starts as `nil` again and the CSS duplicates.

Additionally, the `<script>` block (line 442) is OUTSIDE the `{%- unless -%}` guard entirely — so even if the guard worked, JS would still duplicate.

**Current impact:** None — only one `{% render 'energy-label' %}` call exists in the theme (main-product.liquid:873). The disabled block in product.json is not active.

**Risk:** If a quickview section or second render path is ever added, the CSS and JS will both duplicate silently.

**Fix required:** Remove the false guard (`unless/endunless`). Accept that CSS is emitted once per render call. OR move styles to a dedicated asset file `assets/energy-label.css` loaded via stylesheet_tag (proper deduplication).

---

### BUG-3 — Mobile scroll lock fails on iOS Safari < 15
**Severity: Medium**
**Lines:** 398–400, 464

```css
body.el-no-scroll {
  overflow: hidden;
}
```
```js
document.body.classList.add('el-no-scroll');
```

**Problem:** On iOS Safari versions below 15, `overflow: hidden` on the `<body>` element does NOT prevent the page from scrolling behind the modal. The user can still scroll the product page while the energy label modal is open.

The sister component `product-faq-ui.liquid` handles this correctly using `position: fixed; top: -scrollPos` with scroll position restoration. The energy label snippet does not implement this.

**Fix required:**
```css
body.el-no-scroll {
  overflow: hidden;
  position: fixed;
  width: 100%;
}
```
Plus in JS, save scroll position before locking and restore on unlock:
```js
function openModal() {
  lastFocus = document.activeElement;
  var scrollY = window.pageYOffset;
  document.body.style.top = '-' + scrollY + 'px';
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('el-no-scroll');
  var closeBtn = modal.querySelector('.el-dialog__close');
  if (closeBtn) closeBtn.focus();
}
function closeModal() {
  var scrollY = parseInt(document.body.style.top || '0') * -1;
  document.body.classList.remove('el-no-scroll');
  document.body.style.top = '';
  window.scrollTo(0, scrollY);
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}
```

---

### BUG-4 — Permanent document-level keydown listener accumulates on AJAX navigation
**Severity: Low (no current impact on standard PDP)**
**Lines:** 479–481

```js
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});
```

**Problem:** This listener is added on page initialisation and never removed. On a standard Shopify PDP (full page load per navigation), this is harmless — the listener disappears with the page. If the theme ever adds AJAX page transitions (turbo/instant-page/SPA pattern), this listener accumulates with each PDP visit.

**Current impact:** None on standard Shopify navigation.

**Fix if ever needed:** Store the handler reference and call `document.removeEventListener` in a cleanup function triggered on page unload.

---

## RISK FINDINGS

### RISK-1 — Modal image uses `loading: 'lazy'` — EU regulatory content loads with visible delay
**Severity: Medium**
**Lines:** 148–151

```liquid
| image_tag:
  loading: 'lazy',
  class: 'el-energy-image',
  alt: 'Energieeffizienzlabel'
```

**Problem:** The modal image is marked `loading: 'lazy'`. Since the modal is hidden on page load (`hidden` attribute), the browser defers image loading. When the user clicks the badge to open the modal, the image loads for the first time — the user sees a blank space while it loads. The EU Energy Label is a regulatory display requirement. A visible loading delay is a UX and compliance risk.

**Fix required:** Change `loading: 'lazy'` to `loading: 'eager'` (or remove the attribute entirely) on the modal image specifically. The thumbnail image (line 73) can remain lazy.

---

### RISK-2 — `sheet.media_type == 'generic_file'` assumption for PDF detection
**Severity: Medium**
**Lines:** 83–93

```liquid
{%- if sheet.media_type == 'generic_file' -%}
  <a href="{{ sheet.url }}" ...>Produktdatenblatt</a>
```

**Problem:** The code assumes Shopify will classify a PDF file upload with `media_type == 'generic_file'`. This is currently correct. However:
- If a PDF is accidentally uploaded as an image type, `media_type` will be `'image'` and it will be used as the label thumbnail instead
- If Shopify changes its media type taxonomy, this comparison silently fails
- There is no fallback message when no PDF is found in the loop

**Risk:** PDF link disappears silently if media type classification changes. No error shown to user.

**Mitigation (optional):** Add a fallback or check for URL extension:
```liquid
{%- if sheet.media_type == 'generic_file' or sheet.url contains '.pdf' -%}
```

---

### RISK-3 — `dvh` unit support on older mobile browsers
**Severity: Low**
**Lines:** 287, 319, 385, 413

```css
height: 100dvh;
max-height: calc(100dvh - 32px);
max-height: calc(100dvh - 140px);
max-height: calc(100dvh - 32px);
```

**Problem:** `dvh` (dynamic viewport height) is not supported on Safari < 15.4 and Android WebView < 108. On unsupported browsers, these properties are silently ignored and fall back to no height constraint — the dialog may be oversized or cropped.

**Current risk:** Low — modern device penetration. Older device users (iOS 14 and below) will experience modal sizing issues.

**Fix (optional):** Add `100vh` fallback before `100dvh` declarations using the cascade:
```css
height: 100vh;
height: 100dvh;
```

---

### RISK-4 — No visual indicator when energy_class exists but data_sheets is empty
**Severity: Low**
**Lines:** 38

```liquid
{%- if data_sheets != blank and data_sheets.size > 0 -%}
```

**Problem:** The entire widget (badge + modal) is silently suppressed if `custom.energy_label_data_sheet` is empty. A product may have an energy class set but no data sheet uploaded. In this case, no badge appears at all — no indication to the merchant that the label is missing. This is invisible during QA.

**Mitigation (optional):** Show a placeholder badge in Shopify design mode (`request.design_mode`):
```liquid
{%- if data_sheets != blank and data_sheets.size > 0 -%}
  ... (full widget)
{%- elsif request.design_mode and energy_class != blank -%}
  <p style="color:red">⚠ Energieeffizienzlabel-Datei fehlt</p>
{%- endif -%}
```

---

## CORRECTLY WORKING FUNCTIONALITY

| # | Feature | Lines | Status |
|---|---|---|---|
| 1 | Metafield `.value` access for List of File type | 16 | CORRECT |
| 2 | Energy class colour map — A+++ through G (all EU classes) | 19–30 | CORRECT |
| 3 | Unique modal/title IDs via product.id | 35–36 | CORRECT — safe for multiple products on same page if ever needed |
| 4 | Loop guard: only first image used as thumbnail, first PDF as link | 69–81, 83–93 | CORRECT — `break` prevents multiple thumbnails |
| 5 | Image thumbnail with Shopify CDN sizing (width: 60) | 71–77 | CORRECT |
| 6 | PDF link with `target="_blank" rel="noopener noreferrer"` | 85–90 | CORRECT — security compliant |
| 7 | Modal DOM teleport to `<body>` on first open | 452–454 | CORRECT — escapes sticky stacking context |
| 8 | Modal `hidden` attribute + CSS `[hidden] { display: none }` pattern | 108, 300–302 | CORRECT — proper show/hide |
| 9 | `aria-hidden` toggled correctly on open/close | 463, 471 | CORRECT |
| 10 | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` | 104–106 | CORRECT ARIA |
| 11 | `aria-haspopup="dialog"` on trigger button | 48 | CORRECT |
| 12 | `aria-label="Schließen"` on close button | 133 | CORRECT |
| 13 | Focus moved to close button on modal open | 465–466 | CORRECT |
| 14 | Focus restored to trigger element on modal close | 461, 472–473 | CORRECT |
| 15 | Focus trap — Tab/Shift+Tab cycles within modal | 483–494 | ADEQUATE (selector covers all current modal elements) |
| 16 | Escape key closes modal | 479–481 | CORRECT |
| 17 | Backdrop click closes modal | 113, 457, 477 | CORRECT |
| 18 | `overscroll-behavior: contain` on dialog body | 374 | CORRECT — prevents page scroll while scrolling modal |
| 19 | `-webkit-overflow-scrolling: touch` | 373 | CORRECT — smooth iOS scroll |
| 20 | `min-height: 0` on dialog body | 371 | CORRECT — prevents flex overflow (fixed 2026-09-28) |
| 21 | `env(safe-area-inset-*)` padding | 293–296, 405–409 | CORRECT — notched device support |
| 22 | CSS class prefix `el-*` — isolated from theme | All CSS | CORRECT — no conflicts found in base.css, product.css, product-details.css |
| 23 | z-index `2147483647` (max safe int) | 288 | CORRECT — exceeds all theme z-index values (max found: 9999999) |
| 24 | `object-fit: contain` on modal image | 387 | CORRECT — no distortion |
| 25 | Modal image CDN width: 1000 | 147 | CORRECT — adequate quality |
| 26 | `clip-path: polygon(...)` arrow shape on badge | 234 | CORRECT — EU energy label arrow shape |

---

## THEME COMPATIBILITY

| Check | Result |
|---|---|
| CSS class conflicts in base.css | NONE — `el-*` prefix not used by Umino/Bluesky theme |
| CSS class conflicts in product.css | NONE |
| CSS class conflicts in product-details.css | NONE |
| Z-index conflicts | NONE — theme max z-index is 9999999 (base.css:3823); energy label uses 2147483647 |
| Stacking context conflict | RESOLVED — DOM teleport to body escapes `position: sticky` on `.bls__product-details-infor` (product-details.css:15) |
| JavaScript conflicts in product.js | NONE — no Escape handler, no `el-no-scroll` class interaction |
| JavaScript conflicts in main-product.js | NONE |
| swiper-bundle.min.js interaction | NONE — no carousel dependency |
| easydlg.min.js interaction | NONE — not used by energy label |
| pubsub.js interaction | NONE — energy label does not publish/subscribe events |

---

## MOBILE AND DESKTOP ISSUES

| Issue | Platform | Severity |
|---|---|---|
| Scroll lock fails on iOS Safari < 15 (BUG-3) | Mobile | Medium |
| Modal image loads lazily — delay on open (RISK-1) | All | Medium |
| `dvh` unit unsupported on Safari < 15.4 (RISK-3) | Mobile | Low |
| Desktop: no issues found | Desktop | — |

---

## RECOMMENDED FIXES — IMPLEMENTATION ORDER

| Priority | Fix | Severity | Files |
|---|---|---|---|
| 1 | RISK-1: Change modal image `loading: 'lazy'` → `loading: 'eager'` | Medium | energy-label.liquid:149 |
| 2 | BUG-1: Fix `el_letter` empty string — replace `| default` with blank check | Medium | energy-label.liquid:32–34 |
| 3 | BUG-3: Fix iOS scroll lock — add `position: fixed; width: 100%` + scroll position save/restore | Medium | energy-label.liquid:398–400, 460–474 |
| 4 | BUG-2: Remove false `el_styles_loaded` guard (or move CSS to asset file) | Low | energy-label.liquid:165–439 |
| 5 | RISK-3: Add `100vh` fallback before `100dvh` declarations | Low | energy-label.liquid:287,319,385,413 |
| 6 | RISK-4 (optional): Design-mode placeholder for missing data sheet | Low | energy-label.liquid:38 |
| 7 | BUG-4 (optional): Store keydown handler reference for future cleanup | Low | energy-label.liquid:479–481 |

---

## AUDIT SUMMARY

| Category | Count |
|---|---|
| Confirmed bugs | 4 |
| Potential risks | 4 |
| Critical severity | 0 |
| High severity | 0 |
| Medium severity | 3 (BUG-1, BUG-3, RISK-1) |
| Low severity | 5 |
| Correctly working items | 26 |
| Theme compatibility issues | 0 |

**Overall assessment:** The snippet is fundamentally sound — the architecture, ARIA, event handling, and CSS scoping are all correctly implemented. Three medium-severity issues require fixes before this snippet can be considered production-complete: the EU regulatory image lazy-load delay, the iOS scroll lock failure, and the empty badge letter edge case.

---

## Files Inspected (Read-Only)

- `snippets/energy-label.liquid` — full file (499 lines)
- `sections/main-product.liquid` — lines 860–890 (render call context)
- `templates/product.json` — energy-label block reference
- `assets/base.css` — z-index, overflow, modal CSS conflict check
- `assets/product.css` — z-index conflict check
- `assets/product-details.css` — z-index, stacking context check
- `assets/product.js` — keydown, scroll lock conflict check
- `assets/main-product.js` — Escape key conflict check
- `assets/cart.js` — scroll lock conflict check
- `assets/pubsub.js` — event bus conflict check
- `evidence/shopify/ledsone-de-energy-label-modal-responsive-fix-2026-09-28.md` — prior fix record
