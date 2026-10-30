---
name: ledsone-de-energy-label-snippet-audit
description: Reusable prompt for a complete technical audit of a Shopify EU Energy Label snippet — covers Liquid, CSS, JS, ARIA, mobile scroll lock, theme compatibility
metadata:
  type: prompt
  category: shopify / audit
  project: ledsone_de
  date: 2026-10-30
---

# Prompt: Shopify EU Energy Label Snippet — Complete Technical Audit

## Context

Use this prompt to perform a full read-only technical audit of the EU Energy Label snippet on the LEDSone DE Shopify theme. The audit should cover Liquid variable handling, metafield safety, CSS conflicts, JavaScript correctness, accessibility, mobile behaviour, and Umino theme compatibility.

**Target file:** `shopify_projects/ledsone_de/snippets/energy-label.liquid`

**Metafields used:**
- `custom.energy_class` — single_line_text (e.g. A, A+, B, C, D, E, F, G)
- `custom.energy_label_data_sheet` — List of File (image + PDF)

---

## Audit Checklist

### 1. Liquid and Metafield Safety
- [ ] Does `| default` handle empty strings correctly? (It does NOT — only handles nil/false)
- [ ] Does the energy class colour map cover all required EU classes?
- [ ] Is `data_sheets.size > 0` check sufficient for empty list metafields?
- [ ] Does `sheet.media_type` classification correctly distinguish image vs PDF?
- [ ] Are unique IDs generated correctly for multi-product pages?

### 2. CSS
- [ ] Are all CSS classes scoped with unique prefix (no theme conflicts)?
- [ ] Does z-index exceed theme maximum?
- [ ] Does the modal escape any CSS stacking contexts (sticky/transform parents)?
- [ ] Is `overflow: hidden` on body sufficient for scroll lock on all mobile browsers?
- [ ] Are `dvh` units used with correct fallbacks?

### 3. JavaScript
- [ ] Are event listeners properly scoped (no global leakage)?
- [ ] Is the `el_styles_loaded` deduplication guard effective within Shopify `{% render %}` scope?
- [ ] Is the keydown listener removed after use or accumulated?
- [ ] Does the DOM teleport pattern correctly move modal to body?

### 4. Accessibility
- [ ] Are all required ARIA attributes present?
- [ ] Does focus move to close button on modal open?
- [ ] Is focus restored to trigger on modal close?
- [ ] Does the focus trap cover all focusable elements?
- [ ] Does Escape key work?

### 5. Theme Compatibility
- [ ] Check base.css, product.css, product-details.css for class conflicts
- [ ] Check product.js, main-product.js for Escape key / scroll lock conflicts
- [ ] Confirm z-index is above all theme modals and drawers

### 6. Mobile
- [ ] Does scroll lock work on iOS Safari?
- [ ] Does modal centre correctly on all breakpoints?
- [ ] Does image render without cropping?

---

## Known Issues (from 2026-10-30 audit)

| ID | Issue | Severity | Lines |
|---|---|---|---|
| BUG-1 | `el_letter` is empty string when energy_class metafield missing — `| default: '—'` does not trigger on empty string | Medium | 32 |
| BUG-2 | `el_styles_loaded` guard broken by `{% render %}` scope isolation — CSS/JS deduplication is non-functional | Low | 165–439 |
| BUG-3 | Mobile scroll lock fails on iOS Safari < 15 — `overflow: hidden` on body is insufficient | Medium | 398–400, 460–474 |
| BUG-4 | Permanent document-level keydown listener — not removed on cleanup | Low | 479–481 |
| RISK-1 | Modal image `loading: 'lazy'` causes visible delay for EU regulatory content | Medium | 148–151 |
| RISK-2 | PDF detection relies on `media_type == 'generic_file'` — no fallback if classification changes | Medium | 83–93 |
| RISK-3 | `dvh` units have no `vh` fallback for Safari < 15.4 | Low | 287,319,385,413 |
| RISK-4 | No design-mode placeholder when data_sheets is empty but energy_class is set | Low | 38 |

---

## Fix Implementation Order

1. **RISK-1 (line 149):** `loading: 'lazy'` → `loading: 'eager'` on modal image
2. **BUG-1 (line 32):** Replace `| default: '—'` with explicit blank check
3. **BUG-3 (lines 398–400, 460–474):** Add `position: fixed; width: 100%` to scroll lock + save/restore scroll position
4. **BUG-2 (lines 165–439):** Remove false `el_styles_loaded` guard
5. **RISK-3:** Add `100vh` fallback before `100dvh` declarations
6. **RISK-4 (optional):** Add design-mode placeholder
7. **BUG-4 (optional):** Store keydown handler reference for future cleanup

---

## Evidence File

`evidence/shopify/ledsone_de/energy-label-snippet-audit-2026-10-30.md`

## Prior Fix Record

`evidence/shopify/ledsone-de-energy-label-modal-responsive-fix-2026-09-28.md`
