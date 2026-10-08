# Capability — Shopify Modal Responsive Fix Pattern

## Date First Identified
2026-09-28

## Last Updated
2026-09-28

## Status
ACTIVE — Deployed to ledsone.de (confirmed `validation/piranav/ledsone-de-energy-label-modal-validation-2026-09-28.md`)

## Purpose
Fix Shopify theme modals that overflow or are not usable on mobile screens, without breaking their desktop presentation.

## Business Problem Solved
Shopify modals built for desktop often overflow on mobile viewports — the modal is too wide, lacks internal scroll, or has no close button reachable on small screens. For the Energy Label modal on ledsone.de, this meant EU-required energy label information was inaccessible to mobile users.

## When To Use
- A Shopify modal content is not scrollable or overflows on mobile
- The modal uses a fixed width or does not have a `max-width: 100vw` constraint
- The modal appears to be blocked by the viewport (close button off-screen)

## When NOT To Use
- The modal is built as a third-party app embed — modifying theme CSS won't affect it
- The layout issue is caused by the modal content being too tall (height overflow is a different fix from width overflow)

## Required Inputs
- Confirmed CSS selector for the modal container (inspect with DevTools on mobile viewport)
- Access to the Shopify theme CSS or the section/snippet where the modal is defined

## Source Task / Requirement
LEDSone DE Energy Label Modal Responsive Fix
ledsone-de theme, 2026-09-28
Evidence: `validation/piranav/ledsone-de-energy-label-modal-validation-2026-09-28.md`

## Execution Steps

### Step 1 — Inspect the modal on a mobile viewport
Use Chrome DevTools → responsive mode (375px width). Identify the modal container selector.

### Step 2 — Apply mobile-first constraints
Add to the section or snippet's `<style>` block (or the theme's CSS file):
```css
@media (max-width: 768px) {
  .your-modal-container {
    width: 95vw !important;
    max-width: 95vw !important;
    max-height: 85vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    left: 50% !important;
    transform: translateX(-50%);
    margin: 0 !important;
  }
}
```

### Step 3 — Ensure close button is reachable
If the close button is positioned absolutely inside the modal:
```css
@media (max-width: 768px) {
  .your-modal-close-btn {
    position: sticky;
    top: 8px;
    float: right;
    z-index: 10;
  }
}
```

### Step 4 — Test on mobile viewport
Check: modal fits within the viewport (no horizontal overflow). Content is scrollable if taller than viewport. Close button is visible and tappable.

## Evidence Required
- Screenshot: modal working correctly on mobile viewport (375px)
- Confirmation that desktop modal is unchanged

## Evidence Path
`validation/piranav/ledsone-de-energy-label-modal-validation-2026-09-28.md`
`prompts/shopify/energy-label-modal-responsive-fix.md`

## Pass / Fail Rule
PASS: Modal fits within 375px viewport. Content scrollable. Close button reachable. Desktop unaffected.
FAIL: Modal still overflows on mobile, OR desktop modal is broken.

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator

## Known Limits
- CSS overrides with `!important` may conflict with future theme updates — prefer to add classes to the theme's component-level CSS if possible
- `95vw` is a general safe value; adjust based on the modal's minimum required width
- `overflow-y: auto` requires the modal container to have a defined `max-height` — without it, the scroll never triggers

## Reuse Path
Apply to any Shopify theme modal with mobile overflow. The CSS snippet is generic. Adjust the selector and `max-width` value for each modal.

## Related Capabilities
- `shopify-collection-specific-swatch-guard-2026-10-08.md` — also a theme CSS addition; different concern

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-09-28 | Initial capability captured from ledsone.de energy label modal fix | `validation/piranav/ledsone-de-energy-label-modal-validation-2026-09-28.md` |
