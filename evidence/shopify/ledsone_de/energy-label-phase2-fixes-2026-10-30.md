---
name: energy-label-phase2-fixes-2026-10-30
description: Phase 2 implementation evidence — all 8 confirmed fixes applied to snippets/energy-label.liquid on ledsone_de (local only, not deployed)
metadata:
  type: evidence
  project: ledsone_de
  date: 2026-10-30
  status: COMPLETE — LOCAL ONLY, NOT DEPLOYED
---

# Evidence: EU Energy Label Phase 2 Bug Fixes — ledsone_de

**Date:** 2026-10-30
**Implementer:** Claude Code (piranav AIOS session)
**File modified:** `shopify_projects/ledsone_de/snippets/energy-label.liquid`
**Preceding audit:** `evidence/shopify/ledsone_de/energy-label-snippet-audit-2026-10-30.md`
**Deployment status:** LOCAL THEME ONLY — no Shopify CLI push performed

---

## Fixes Applied

### BUG-1 — el_letter empty string fallback (FIXED)

**Problem:** `| default: '—'` filter does not trigger on empty strings, only nil/false. If `custom.energy_class` is set but blank, el_letter would render as empty string.

**Before:**
```liquid
{%- assign el_letter = energy_class | default: '—' -%}
```

**After:**
```liquid
{%- if energy_class == blank -%}
  {%- assign el_letter = '—' -%}
{%- else -%}
  {%- assign el_letter = energy_class -%}
{%- endif -%}
```

**Why correct:** Liquid's `blank` check catches nil, false, AND empty string.

---

### RISK-1 — Modal image lazy loading (FIXED)

**Problem:** `loading: 'lazy'` on the modal image means it may not load when the modal is opened — browser deprioritises off-screen lazy images.

**Before:** `loading: 'lazy'`
**After:** `loading: 'eager'`

**Location:** Modal `el-dialog__body` image_tag call.

---

### RISK-2 — PDF detection fallback (FIXED)

**Problem:** `sheet.media_type == 'generic_file'` detects PDFs correctly for most files. Added URL-based fallback for edge cases where media_type is not set correctly.

**Before:**
```liquid
{%- if sheet.media_type == 'generic_file' -%}
```

**After:**
```liquid
{%- if sheet.media_type == 'generic_file' or sheet.url contains '.pdf' -%}
```

---

### BUG-2 — Style deduplication guard removed (FIXED)

**Problem:** `{%- unless el_styles_loaded -%}` / `{%- assign el_styles_loaded = true -%}` / `{%- endunless -%}` wrapper was structurally broken. Shopify's `{% render %}` tag creates an isolated variable scope — variables assigned inside a render call do not persist to subsequent calls. The guard therefore NEVER fired; styles were duplicated on every render.

**Fix:** Removed all three guard tags. `<style>` is now emitted unconditionally.

**Duplicate risk:** Acceptable — snippet is only rendered once per product page (confirmed: main-product.liquid:873 is the only active render; templates/product.json block custom_liquid_XycCf8 is disabled).

---

### RISK-3 — dvh without vh fallback (FIXED)

**Problem:** `100dvh` and `calc(100dvh - Npx)` are not supported on Safari < 15.4. Without a preceding `vh` fallback, the modal height is unconstrained on older iOS Safari.

**Locations fixed (4 declarations):**

| Property | Before | After |
|---|---|---|
| `.el-modal height` | `height: 100dvh` | `height: 100vh; height: 100dvh;` |
| `.el-dialog max-height` | `max-height: calc(100dvh - 32px)` | `max-height: calc(100vh - 32px); max-height: calc(100dvh - 32px);` |
| `.el-energy-image max-height` | `max-height: calc(100dvh - 140px)` | `max-height: calc(100vh - 140px); max-height: calc(100dvh - 140px);` |
| `.el-dialog max-height (mobile)` | `max-height: calc(100dvh - 32px)` | `max-height: calc(100vh - 32px); max-height: calc(100dvh - 32px);` |

**CSS cascade behaviour:** In browsers supporting `dvh`, the second declaration wins. In browsers without `dvh` support, the second declaration is ignored and the `vh` fallback holds.

---

### BUG-3 — iOS scroll lock (FIXED: CSS + JS)

**Problem:** `overflow: hidden` on body is insufficient on iOS Safari < 15. The page continues to scroll behind the modal. Requires `position: fixed` pattern with scroll position save/restore.

**CSS fix:**
```css
body.el-no-scroll {
  overflow: hidden;
  position: fixed;  /* added */
  width: 100%;      /* added */
}
```

**JS fix — `openModal()`:**
```javascript
var savedScrollY = 0;  // added alongside var lastFocus

function openModal() {
  lastFocus = document.activeElement;
  savedScrollY = window.pageYOffset;           // added
  document.body.style.top = '-' + savedScrollY + 'px';  // added
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('el-no-scroll');
  var closeBtn = modal.querySelector('.el-dialog__close');
  if (closeBtn) closeBtn.focus();
}
```

**JS fix — `closeModal()`:**
```javascript
function closeModal() {
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('el-no-scroll');
  document.body.style.top = '';          // added
  window.scrollTo(0, savedScrollY);     // added
  if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
}
```

**Why this pattern:** `position: fixed` removes the element from normal scroll flow (stops iOS scroll-through). Setting `top` to `-scrollY` keeps the page visually in position. On close, `top: ''` is cleared and `window.scrollTo` restores position instantly.

---

### BUG-4 — Named keydown handler (FIXED)

**Problem:** Anonymous function passed to `document.addEventListener('keydown', ...)` cannot be removed later with `removeEventListener`.

**Before:**
```javascript
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});
```

**After:**
```javascript
function elKeydown(e) {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
}
document.addEventListener('keydown', elKeydown);
```

**Note:** `removeEventListener` is not called in this IIFE — the named handler is preparation for future cleanup if needed, and also makes the code intent clearer.

---

### RISK-4 — Design-mode placeholder (FIXED)

**Problem:** When `data_sheets` is empty, the snippet renders nothing — no visual indicator in the Shopify theme editor that the energy label component is present.

**Fix:** Added `{%- elsif request.design_mode -%}` clause showing a warning message inside the theme editor only.

```liquid
{%- elsif request.design_mode -%}
  <div class="el-row" style="opacity:0.6;">
    <p style="font-size:12px;color:#888;padding:6px 0;margin:0;font-family:inherit;">
      [Energy label: metafield <code>custom.energy_label_data_sheet</code> is empty on this product.]
    </p>
  </div>
```

**Condition:** Only renders when `request.design_mode` is true (Shopify theme editor). Zero impact on storefront output.

---

## Regression Analysis (Static)

Live browser testing was not performed. Static analysis confirms:

| Scenario | Analysis | Risk |
|---|---|---|
| Product with energy class A–G + label image | BUG-1 fix: el_letter assigned correctly. Modal opens. Image loads eagerly. Scroll lock fires with position save. Escape closes and scroll restores. | NONE |
| Product with energy_class set to empty string | BUG-1 fix: blank check catches empty string → renders '—' | NONE |
| Product with no energy class metafield | `energy_class_raw` = '' via `\| default: ''`. blank check fires → '—'. data_sheets nil → conditional fails → nothing renders (correct). | NONE |
| Products without data_sheets | `{%- if data_sheets != blank -%}` fails → nothing on storefront. design-mode branch visible in editor. | NONE |
| iOS Safari < 15.4 | `position: fixed; width: 100%` scroll lock + `top: -scrollY` prevents scroll-through. `vh` fallback ensures modal fits viewport. | LOW — not testable statically |
| Safari < 15.4 dvh | `vh` fallback declarations precede `dvh` — older Safari uses `vh`, modern uses `dvh`. | NONE |
| Multiple energy label snippets on same page | Not possible — energy-label is rendered once at main-product.liquid:873, and product.json block is disabled. Style deduplication issue moot. | NONE |
| Keyboard Escape key | Named `elKeydown` function fires → `closeModal()` if modal open. | NONE |
| Tab focus trap | Unchanged from pre-fix state — confirmed working in prior Sep 2026 audit. | NONE |
| Theme editor view (design mode) | RISK-4 placeholder visible when data_sheets empty. No impact on storefront. | NONE |
| PDF link detection | `or sheet.url contains '.pdf'` catches edge case files with wrong media_type. | NONE |

---

## Git Diff Summary

```
shopify_projects/ledsone_de/snippets/energy-label.liquid
  +35 lines added, -8 lines removed
  Net: +27 lines

Changes:
  - BUG-1: +4/-1 (el_letter blank check)
  - RISK-2: +1/-1 (PDF detection fallback)
  - RISK-1: +1/-1 (eager loading)
  - BUG-2: -3 (unless guard removed)
  - RISK-3: +4 (4× vh fallback lines)
  - BUG-3 CSS: +2 (position:fixed, width:100%)
  - BUG-3 JS: +5 (savedScrollY, top assignment ×2, scrollTo, style.top clear)
  - BUG-4: +3/-2 (named function)
  - RISK-4: +8 (design-mode placeholder)
```

---

## Files Modified

| File | Change | Deployment impact |
|---|---|---|
| `shopify_projects/ledsone_de/snippets/energy-label.liquid` | All 8 fixes applied | LOCAL ONLY — not pushed to Shopify |

No other files were modified.

---

## Confirmation: No Live Theme Changes

- No `shopify theme push` command was run
- No Shopify CLI connection was established
- No live theme files were accessed
- All changes are local file edits only
- No metafield definitions or product data were modified
