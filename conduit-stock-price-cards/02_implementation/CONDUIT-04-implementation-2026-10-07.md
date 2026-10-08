# Conduit Task 4 — Filter 3: Finish / Colour — Implementation Record

**Date:** 2026-10-07
**Req ID:** CONDUIT-4-2026-10-07-001
**Status:** IMPLEMENTED — BROWSER VALIDATION PENDING
**Part:** Add Finish / Colour filter using Shopify variant option

---

## File Changed

| File | Change type |
|---|---|
| `shopify_projects/ledsone-uk-theme/sections/collection-meta-filters.liquid` | Filter 3 added — CSS, Liquid, HTML, JavaScript, Schema |

**Files NOT changed this session:**
- `snippets/product-item.liquid` — Part 1 changes already in place from 2026-10-07 session 1
- `snippets/price.liquid` — Part 2 change already in place from 2026-10-07 session 2
- `templates/collection.collection-pipe.json` — untouched
- All product data, metafields, inventory — untouched

---

## Global Setting Reused

`settings.option_name_color` confirmed live value: `"Colour"` (from `config/settings_data.json`).

No new global theme setting needed. Filter 3 reads directly from `settings.option_name_color` with `| default: 'Colour'` as safety fallback.

Section schema adds one new field: `filter_3_label` (display label, default `"FINISH / COLOUR"`).

---

## Implementation Summary

### 1. CSS (lines 117–143)

Three new rules added to `<style>` block:
- `.colour-buttons` — flex wrap container matching existing `.size-buttons` / `.type-buttons` layout
- `.colour-btn` — pill button matching `.size-btn` / `.type-btn` style exactly
- `.colour-btn:hover` and `.colour-btn.active` — matching existing hover/active states

### 2. Liquid top block (line 19)

```liquid
assign f3_option_name = settings.option_name_color | default: 'Colour'
```

Reads global setting. Falls back to `'Colour'` if setting is blank.

### 3. Product card loop — colour_index detection (lines 315–320)

Per product, before the card wrappers are rendered:

```liquid
assign colour_index = nil
for opt in product.options
  if opt == f3_option_name
    assign colour_index = forloop.index0
  endif
endfor
```

- Resets `colour_index` to `nil` for every product (prevents bleed between products)
- Loops `product.options` (array of option name strings)
- Matches by exact name — case-sensitive, using live store value `"Colour"`
- Stores 0-based index for use with `variant.options[index]`
- Works whether Colour is option1, option2, or option3

### 4. Variant card wrapper — data-f3 (lines 331–338)

```liquid
{%- assign card_f3 = variant.options[colour_index] | default: '' | downcase | strip -%}
<div class="... is-variant-card hidden"
     data-f1="..."
     data-f2="..."
     data-f3="{{ card_f3 }}"
     data-available="...">
```

- `variant.options[colour_index]` — reads the variant's option value at the detected position
- `| default: ''` — safe when colour_index is nil (product has no Colour option)
- `| downcase | strip` — normalises for case-insensitive JS comparison
- Default product card does NOT get `data-f3` — it is always hidden when any filter is active

### 5. Filter 3 button group HTML (lines 255–288)

Placed between Type filter group and Reset button.

Button generation loop:
- Iterates `collection.products limit: 1000`
- For each product, loops `product.options_with_values`
- Matches option name == `f3_option_name`
- Collects all `opt.values` (unique, deduped via `|` separator string check)
- Sorts alphabetically
- Renders one `<button class="colour-btn" data-f3="{{ colour | downcase | strip }}">{{ colour }}</button>` per value
- "All Finishes" button has `data-f3=""` (matches the empty `selectedColour` state)

### 6. JavaScript — filterProducts() extended (lines 363–468)

New state variable: `let selectedColour = '';`

Changes to `filterProducts()`:
- Added `const availableF3 = new Set();`
- `isFilterActive` now checks all three: `selectedSize !== '' || selectedType !== '' || selectedColour !== ''`
- F3 parsed: `const cardF3s = f3Attr !== '' ? [f3Attr] : [];` (single value per variant, not comma-split like F1/F2)
- F3 visibility check added in variant card branch:
  ```javascript
  if (isVisible && selectedColour) {
    if (!cardF3s.includes(selectedColour.toLowerCase())) isVisible = false;
  }
  ```
- Dynamic facets restructured — three independent checks:
  - F1 buttons: available when card matches current Type **and** Colour
  - F2 buttons: available when card matches current Size **and** Colour
  - F3 buttons: available when card matches current Size **and** Type

### 7. New helper function (lines 479–481)

```javascript
function updateColourButtons(activeColour) {
  colourButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.f3 === activeColour));
}
```

### 8. New click handler (lines 499–505)

```javascript
colourButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    selectedColour = this.dataset.f3;
    updateColourButtons(selectedColour);
    filterProducts();
  });
});
```

### 9. Reset button updated (lines 507–515)

```javascript
clearBtn.addEventListener('click', function() {
  selectedSize   = '';
  selectedType   = '';
  selectedColour = '';
  updateSizeButtons('');
  updateTypeButtons('');
  updateColourButtons('');
  filterProducts();
});
```

### 10. Schema — F3 settings (lines 587–597)

```json
{
  "type": "header",
  "content": "Filter 3 Settings"
},
{
  "type": "text",
  "id": "filter_3_label",
  "label": "Filter 3 Label",
  "default": "FINISH / COLOUR",
  "info": "Filter 3 reads from the variant option name set in Theme Settings > Product > Option name > Color."
}
```

---

## Static Logic Traces

### Initial page load (no filters)
- `isFilterActive = false`
- All `.is-default-product` cards: visible
- All `.is-variant-card` cards: hidden
- `filterProducts()` runs once on `DOMContentLoaded` ✓

### Colour filter selected (e.g. "copper")
- `selectedColour = 'copper'`
- `isFilterActive = true`
- Default cards: hidden ✓
- Variant cards: visible only if `data-available != 'false'` AND `data-f3 == 'copper'` ✓
- Products with no Colour option: `cardF3s = []`, `[].includes('copper') = false` → hidden (correct — no matching colour) ✓

### 20mm + Lamp Holders + Copper
- `selectedSize = '20mm'`, `selectedType = 'lamp holders'` (or whatever the exact Type value is), `selectedColour = 'copper'`
- Card passes only if: available, F1 contains '20mm', F2 contains the type string, F3 == 'copper' ✓

### Dynamic facets when Copper is selected
- F1 buttons: show diameters available in any Copper variant matching current Type ✓
- F2 buttons: show types available in any Copper variant matching current diameter ✓
- F3 buttons: show colours available in any variant matching current Size + Type ✓

### Products without Colour option
- `colour_index = nil` → `variant.options[nil]` → Liquid returns empty string → `data-f3=""`
- In JS: `f3Attr = ''` → `cardF3s = []`
- When no colour filter active: these variants still contribute to F1/F2 dynamic facets ✓
- When colour filter active: they are excluded from results (correct behaviour) ✓

---

## Browser Validation — PENDING

Piranav must push to draft theme and validate the 17-point checklist from the implementation brief.

Key tests:
| # | Test | Expected |
|---|---|---|
| 1 | Page loads | No JS errors |
| 2 | Three filter rows | Diameter, Type, Finish/Colour all visible |
| 3 | Colour buttons | Chrome, Satin Nickel, Yellow Brass, Rose Gold, French Gold, Black, Copper, White |
| 4 | ~5539 + Copper | Only Copper available variants shown |
| 5 | Diameter alone | 20mm still works as before |
| 6 | Type alone | Existing types still work |
| 7 | 20mm + Lamp Holders + Copper | Only matching variants |
| 8 | 20mm + Copper | Correct variants |
| 9 | Lamp Holders + Black | Correct variants |
| 10 | Impossible combo | No results message shown |
| 11 | Reset All Filters | All three reset, all "All" buttons active |
| 12–13 | Stock labels + From pricing | Unchanged |
| 14 | Sale pricing | Unchanged |
| 15 | No products lost | Unrelated products not affected |
| 16 | Mobile | Three groups wrap correctly |
| 17 | Console | No JS errors |

---

---

## UI Refinement — 2026-10-07 (CSS-only, post-implementation)

**Reason:** Filter panel too tall after adding Filter 3. Compacted to feel like one panel.

**Changes (CSS values only — no Liquid, JS, or data attributes touched):**

| Property | Before | After |
|---|---|---|
| `.custom-collection-filters` padding | `20px` | `12px 16px` |
| `.custom-collection-filters` margin-bottom | `30px` | `20px` |
| `.filter-controls` gap | `25px` | `12px` |
| `.filter-group` gap | `12px` | `7px` |
| `.filter-group label` font-size | `15px` | `13px` |
| `.size-buttons / .type-buttons / .colour-buttons` gap | `10px` | `6px` |
| `.size-btn / .type-btn / .colour-btn` padding | `8px 22px` | `5px 14px` |
| `.size-btn / .type-btn / .colour-btn` font-size | `13px` | `12px` |
| `.btn-clear-filters` padding | `12px 25px` | `7px 18px` |
| `.btn-clear-filters` font-size | `14px` | `12px` |
| `.btn-clear-filters` margin-top | `10px` | `4px` |
| active box-shadow | `0 4px 10px` | `0 2px 6px` |
| mobile: `.filter-controls` gap | `20px` | `10px` |
| mobile: added responsive rule | — | `.size-btn, .type-btn, .colour-btn { padding: 5px 12px; font-size: 12px; }` |

**Filtering logic: completely unchanged.**

---

---

## UI Refinement 2 — 2026-10-07: Remove numbered headings + mobile accordion

**Requirement:** Remove "1. DIAMETER:", "2. TYPE:", "3. FINISH / COLOUR:" from all viewports. Add mobile accordion on ≤767px. Desktop stays as horizontal pill rows.

**Changes (CSS + HTML + mobile JS only — filter logic completely unchanged):**

### Labels removed
Three `<label>` elements deleted from HTML. Label text moved to `data-filter-label` attribute on the group div (used by accordion JS to identify each row). No filter functionality depended on these labels.

### Mobile accordion added
- **CSS** (`@media (max-width: 767px)`): `.filter-accordion-header` (hidden on desktop, visible on mobile), `.filter-accordion-body` (hidden until `acc-open` class added), chevron rotation on open.
- **HTML**: Each filter group gets a `<button class="filter-accordion-header">` as first child and a `<div class="filter-accordion-body">` wrapping the pill button row. The header shows the filter name (no number) and a right-side summary (`acc-selected-label`) showing the current selection or "All".
- **JS** (`initMobileAccordion()`): Accordion open/close logic — click to toggle, closes other groups. Attaches secondary listeners to existing `sizeButtons`, `typeButtons`, `colourButtons` click events to update the summary label. Attaches to existing `clearBtn` to reset summaries. Does NOT replace or conflict with the main `filterProducts()` logic.

### Key design decisions
- Desktop: `.filter-accordion-header { display: none }` — accordion buttons exist in DOM but invisible on desktop; no visual effect.
- Mobile: `.filter-accordion-body { display: none }` by default — pill rows hidden until row tapped.
- Accordion listener is additive (does not replace existing click handlers on filter buttons).
- Accordion logic lives entirely inside `initMobileAccordion()` — isolated from `filterProducts()`.

---

---

## UI Refinement 3 — 2026-10-07: Remove blue open-state from mobile accordion header

**Issue:** When accordion row opened on mobile, header showed blue background + white text (inherited from theme's global `<button>` `:focus`/`:active` styles).

**Fix:** Added explicit overrides in `@media (max-width: 767px)`:
- Base `.filter-accordion-header`: `background: #fff`, `outline: none`, `box-shadow: none`
- `:focus` and `:active` pseudo-states: `background: #fff`, `color: #111`, `outline: none`, `box-shadow: none`
- `.filter-group.acc-open .filter-accordion-header`: `background: #fff`, `color: #111`, `border-color: #e5e5e5`
- `.filter-group.acc-open .filter-accordion-header .acc-right` and `.acc-chevron`: `color: #111`

No JS changes. No desktop changes. Filter logic unchanged.

**Validate at:** 375px / 390px / 430px — open each accordion row, confirm white background + dark text on open state.

---

---

## UI Refinement 4 — 2026-10-07: Remove blue hover/focus on mobile accordion header

**Issue:** `:hover` state on `.filter-accordion-header` was not overridden, allowing browser default button highlight (blue) to appear. Previous fix covered `:focus` and `:active` but missed `:hover` and `:focus-visible`. `-webkit-tap-highlight-color` was also not set, causing blue flash on iOS touch.

**Fix (CSS only, no JS or filter logic touched):**
- Combined `.filter-accordion-header` base declaration with `:hover`, `:focus`, `:focus-visible`, `:active` into one selector block — all states share `background: #fff; color: #111; outline: none; box-shadow: none; -webkit-tap-highlight-color: transparent`
- `:focus-visible` gets a subtle grey outline (`2px solid #bbb`) for keyboard accessibility without blue
- Open-state block (`.filter-group.acc-open .filter-accordion-header`) extended with `:hover`, `:focus`, `:active` variants

**Validate:** Open each accordion row on mobile at 375/390/430px — hover, tap, focus each header — confirm no blue background at any state.

---

## Status

**IMPLEMENTED (incl. all UI refinements) — BROWSER VALIDATION PENDING PIRANAV PUSH TO DRAFT THEME**
