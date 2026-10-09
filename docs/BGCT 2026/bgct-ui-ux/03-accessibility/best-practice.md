# Best Practice — Accessibility

**Status:** DRAFT
**Sheet:** Accessibility (BGCT workbook, Sheet 3)
**Tasks covered:** ACC-1 through ACC-4
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## ACC-1 — Color Contrast Fixes

### User problem
Users with visual impairments, colour blindness, or who are reading on a screen in bright sunlight cannot read text that does not have sufficient contrast against its background.

### Recommended approach
Meet **WCAG 2.1 AA** contrast standard:
- **Normal text** (under 18pt / 14pt bold): minimum ratio **4.5:1**
- **Large text** (18pt+ or 14pt+ bold): minimum ratio **3:1**
- **UI components and graphics**: minimum ratio **3:1**

Use **dark grey (#333333 or similar)** instead of pure black (#000000) for body text — this maintains high contrast while reducing eye strain. White text on a brand colour must meet 4.5:1.

### Priority areas to check
1. Primary buttons (white text on brand background colour)
2. Footer (light grey text on dark background — often fails)
3. Hero text over a background image (must use a darkening overlay)
4. Placeholder text in form inputs (very commonly fails)
5. Grey text used for secondary descriptions (often too light)

### Exceptions and trade-offs
- Pure white text on very light brand colours will always fail. Either darken the brand colour or switch to dark text.
- "Near-white" background with light grey text fails most commonly in footer sections and product metadata.

### Authoritative reference
- https://www.w3.org/WAI/WCAG21/quickref/#contrast-minimum
- WCAG 2.1 Success Criterion 1.4.3

---

## ACC-2 — Keyboard Navigation

### User problem
Users with motor disabilities, those who prefer keyboard navigation, and automated testing tools depend entirely on keyboard access. Sites where focus gets trapped, disappears, or skips content are unusable for these users.

### Recommended approach
Every interactive element must be focusable and have a **clearly visible focus state** (`:focus-visible` CSS). Tab order must follow the visual flow of the page (left to right, top to bottom). A **"Skip to content"** link must be the very first focusable element in the DOM (visible on focus, hidden otherwise). Dropdown menus and drawer components must be fully navigable via keyboard. Never suppress focus outlines without providing an alternative visible indicator.

### Testing method
Put the mouse away. Press Tab repeatedly. Watch where the focus ring goes. If focus is invisible, gets trapped in a modal, or jumps unpredictably, each instance is a failure.

### Device considerations
- Focus states must be visible on all screen sizes. Mobile physical keyboard users (connected keyboards on iPad) follow the same standards.

### Authoritative reference
- https://www.w3.org/WAI/WCAG21/quickref/#keyboard
- WCAG 2.1 Success Criterion 2.1.1, 2.4.3, 2.4.7

---

## ACC-3 — ARIA Label Improvements

### User problem
Screen readers announce HTML elements by their text content. Icon-only buttons (magnifying glass for search, bag for cart, × for close) have no text content and announce nothing useful. ARIA labels provide hidden text for screen readers.

### Recommended approach
Use `aria-label` on all **icon-only buttons** and **icon-only links**:
- Search button: `aria-label="Search"`
- Cart button: `aria-label="View cart"` (or "View cart, 3 items" for dynamic count)
- Close button (modal/drawer): `aria-label="Close"`
- Social media icons: `aria-label="Follow us on Instagram"` (not just "Instagram")

**First rule of ARIA:** prefer semantic HTML over ARIA. Use native `<button>` and `<a>` elements — they are keyboard focusable automatically. Never add ARIA to elements that already have descriptive text content.

Use `aria-hidden="true"` on decorative SVG icons and images that add no meaning.

Modals and drawers must manage `aria-expanded` and `aria-hidden` states via JavaScript when they open and close.

### Common failure modes
- `aria-label` added to `<div>` elements — `<div>` is not a focusable element; use `<button>` or `<a>`.
- `aria-label` added to text links that already have descriptive text ("Visit our blog" does not need an aria-label).
- Modal/drawer opens but does not update `aria-hidden="true"` on the background content, causing screen readers to read background content while the modal is open.

### Authoritative reference
- https://www.w3.org/WAI/ARIA/apg/
- WCAG 2.1 Success Criterion 4.1.2

---

## ACC-4 — Microsoft Clarity

### What it is
Microsoft Clarity is a **free user behaviour analytics tool** that captures heatmaps (click, scroll, area/attention) and session recordings. It auto-detects frustration signals: rage clicks, dead clicks, and excessive scrolling.

**Note on workbook categorisation:** Clarity is placed in the Accessibility worksheet in the source workbook. It is primarily a CRO/analytics tool. This classification is preserved from the source but noted here.

### Recommended approach
Install via the **official Clarity Shopify app** (not by adding raw JavaScript), so checkout and thank-you pages track correctly under Shopify's checkout extensibility. 

Start each analysis from a **drop-off point or frustration signal** — rage clicks and dead clicks on cart and checkout pages are the highest-priority investigation starting point. Use **conversion heatmaps** to prioritise elements that affect revenue. Segment paid traffic separately from organic to compare behaviour.

Treat Clarity's **Copilot AI insights** as a fast first pass — verify findings before acting on them. Export key findings before the 30-day data retention window expires.

### Limitations and data considerations
- Clarity data is retained for **approximately 30 days** — verify current retention period in Clarity settings as this may change.
- Clarity is free. No sampling limits on session recordings (at time of writing).
- GDPR/PECR compliance: Clarity must be declared in your cookie consent policy. Confirm with your legal or compliance team before enabling session recordings that capture personal data.

### Authoritative reference
- https://clarity.microsoft.com/
- https://learn.microsoft.com/en-us/clarity/shopify
