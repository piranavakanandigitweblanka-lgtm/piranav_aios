# Guidelines — Accessibility

**Status:** DRAFT
**Sheet:** Accessibility (BGCT workbook, Sheet 3)
**Tasks covered:** ACC-1 through ACC-4
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## ACC-1 — Color Contrast Fixes

| Rule | Detail |
|---|---|
| **Standard: WCAG 2.1 AA** | Minimum 4.5:1 ratio for normal text. 3:1 for large text and UI components. |
| **Never sacrifice readability for aesthetics** | If the brand colour fails contrast, it must be darkened or paired with dark text — do not override the standard. |
| **Hero text over images** | Always apply a semi-transparent dark overlay on hero images behind white text. |
| **Placeholder text** | Must also meet 3:1 ratio against input background. Very light grey placeholder text commonly fails. |
| **Priority fixes** | 1. Primary buttons. 2. Footer text. 3. Hero text on image. 4. Placeholder text. 5. Secondary descriptions. |
| **Escalation: Developer** | Changes to button colours, overlay opacity, and text colour require developer CSS edits on a duplicate theme. |
| **Escalation: Business Validator** | Changes that alter brand colours (even to fix contrast) require business validator / brand owner approval. |
| **Verification tool** | https://webaim.org/resources/contrastchecker/ |

---

## ACC-2 — Keyboard Navigation

| Rule | Detail |
|---|---|
| **All interactive elements must be focusable** | `<button>`, `<a>`, `<input>`, `<select>` — these are natively focusable. Custom `<div>` buttons are not unless `tabindex="0"` and keyboard events are added. |
| **Focus states must be visible** | `:focus-visible` styles must provide a clear visual indicator (outline, border, shadow). |
| **Prohibited** | `outline: none` without an equivalent visible replacement. This fails WCAG 2.4.7. |
| **"Skip to content" link required** | Must be the first tab stop in the DOM. Hidden by default, visible on focus. |
| **Tab order follows visual flow** | Left to right, top to bottom. Out-of-order tab sequences require developer fix. |
| **Dropdown menus keyboard navigable** | Arrow keys move between menu items. Escape closes dropdowns. |
| **Modal focus trap** | When a modal opens, focus must move into the modal and stay there until the modal is closed. |
| **Escalation: Developer** | All keyboard navigation fixes require developer CSS and JavaScript. |

---

## ACC-3 — ARIA Label Improvements

| Rule | Detail |
|---|---|
| **Icon-only elements must have aria-label** | Any button or link with no visible text must have a descriptive `aria-label`. |
| **Dynamic count in cart label** | Cart button label should include item count: `aria-label="View cart, {{ cart.item_count }} items"` |
| **Modals must manage aria-hidden** | When a modal/drawer is open, background content must have `aria-hidden="true"`. When closed, remove it. |
| **aria-expanded on toggle controls** | Any button that opens/closes a panel (accordion, drawer, dropdown) must have `aria-expanded="true"` or `aria-expanded="false"` updated via JavaScript. |
| **Semantic HTML first** | Use native `<button>` not `<div>` with click events. ARIA is a last resort, not a first choice. |
| **Prohibited** | `aria-label` on text links that already have descriptive content. ARIA roles on meaningless `<div>` wrappers. |
| **Escalation: Developer** | ARIA improvements require editing theme Liquid and JavaScript files. |

---

## ACC-4 — Microsoft Clarity

| Rule | Detail |
|---|---|
| **Install via official Shopify app** | Never via raw `<script>` tag — checkout tracking requires the app integration. |
| **Analysis starting point: frustration signals** | Begin with rage clicks and dead clicks in the Cart and Checkout areas — highest conversion impact. |
| **Segment paid traffic** | Create a separate segment for paid traffic vs organic for fair comparison of behaviour. |
| **Export findings within 30 days** | Do not rely on Clarity's storage as a long-term evidence archive — export before data expires. |
| **GDPR/PECR compliance required** | Clarity session recordings must be declared in cookie consent policy. Confirm with legal/compliance team. |
| **Escalation: Business Validator** | Acting on Clarity findings that affect the purchase flow or checkout requires business validator approval. |
| **Escalation: Legal** | Enabling session recordings requires confirmation that consent management is compliant in all operating jurisdictions. |
