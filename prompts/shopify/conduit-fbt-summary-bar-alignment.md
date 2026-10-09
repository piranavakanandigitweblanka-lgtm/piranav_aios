# Prompt: FBT Summary Bar Horizontal Alignment Fix

**Category:** shopify
**Registered:** 2026-10-09
**Task:** CONDUIT-TASK10-2026-10-09
**Reusable for:** Any Shopify theme section where a price total + CTA button need to appear on the same horizontal row

---

## Prompt

You are fixing a Shopify theme section's summary/footer row.

**Problem:** A flex container holding a price total on the left and a CTA button on the right is wrapping — both elements stack vertically instead of appearing side by side.

**Fix required:**

1. On the summary bar container:
   - `display: flex`
   - `flex-direction: row`
   - `align-items: center`
   - `justify-content: space-between`
   - `flex-wrap: nowrap`
   - `width: 100%`
   - Preserve existing `gap`, `padding`, and `border-top`

2. On the total label element:
   - `white-space: nowrap`
   - `flex-shrink: 0`
   - This prevents the label from compressing and causing the button to push it off-line

3. Mobile override (e.g. `@media (max-width: 767px)`):
   - `flex-direction: column`
   - `align-items: flex-start`
   - `flex-wrap: nowrap`
   - Full-width button: `width: 100%; min-width: 0`
   - Total label: `text-align: left`

**Constraints:**
- Do not change HTML structure, JS logic, or Liquid variables
- Scope all CSS to the section's own class prefix to avoid theme-wide conflicts
- Preserve all card, checkbox, variant select, and cart functionality

**Expected result:**
- Desktop/tablet (≥768px): Total on left, button on far right, same horizontal line, vertically centred
- Mobile (<768px): Total above full-width button, no horizontal overflow
