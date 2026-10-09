# Checklist — Accessibility

**Status:** DRAFT
**Sheet:** Accessibility (BGCT workbook, Sheet 3)
**Tasks covered:** ACC-1 through ACC-4
**Owner:** Piranav | **Reviewer:** Sajeesan | **Queryability Reviewer:** Tamil Selvan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## ACC-1 — Color Contrast Fixes

| # | Check | Tool | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 1.1 | Primary button passes 4.5:1 contrast | WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/) | Enter button text hex and button background hex | Ratio ≥ 4.5:1 | Ratio < 4.5:1 | Critical | Screenshot of checker result |
| 1.2 | Footer text passes 4.5:1 contrast | WebAIM Contrast Checker | Enter footer text hex and footer background hex | ≥ 4.5:1 | Fails | High | Screenshot |
| 1.3 | Hero text over image is legible | Manual + DevTools | Inspect overlay opacity — calculate contrast including image average | ≥ 4.5:1 (WCAG AA) | Text blends into image | Critical | Screenshot |
| 1.4 | Form placeholder text passes 3:1 | WebAIM Contrast Checker | Enter placeholder text colour and input background hex | ≥ 3:1 | Fails | Medium | Screenshot |
| 1.5 | Lighthouse accessibility score (colour contrast) | Chrome DevTools → Lighthouse | Run Lighthouse accessibility audit on homepage, product page, checkout | Zero contrast errors | Any contrast failures | High | Lighthouse screenshot |
| 1.6 | WAVE or axe browser extension audit | WAVE (https://wave.webaim.org/) | Enter homepage URL → review Errors | Zero contrast errors | Errors flagged | High | WAVE screenshot |

---

## ACC-2 — Keyboard Navigation

| # | Check | Tool | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 2.1 | "Skip to content" link at first tab stop | Keyboard + View Page Source | Press Tab once from homepage | "Skip to main content" link appears visually | No such link, or not visible on focus | High | Screenshot |
| 2.2 | All interactive elements reachable by Tab | Keyboard | Navigate entire page using only Tab | All links, buttons, inputs reached in logical order | Any element unreachable by Tab | Critical | Keyboard test note |
| 2.3 | Focus ring is visible on all focusable elements | Keyboard | Tab through entire page | Visible focus ring on every focused element | Focus ring invisible or disappears | Critical | Screenshot |
| 2.4 | Dropdown menus openable via keyboard | Keyboard | Tab to a main nav dropdown → press Enter or Space | Dropdown opens | Dropdown requires mouse hover | High | Keyboard test note |
| 2.5 | Modal focus trap works | Keyboard | Open cart drawer → press Tab | Focus stays within the drawer | Tab exits the drawer into background page | High | Keyboard test note |
| 2.6 | Escape key closes modal/drawer | Keyboard | Open cart drawer → press Escape | Drawer closes | Drawer remains open | High | Keyboard test note |
| 2.7 | Lighthouse keyboard navigation audit | Chrome DevTools → Lighthouse | Run accessibility audit | No keyboard navigation errors | Errors flagged | High | Lighthouse screenshot |

---

## ACC-3 — ARIA Label Improvements

| # | Check | Tool | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 3.1 | Search icon button has aria-label | View Page Source / DevTools | Find search button HTML — check for `aria-label` | `aria-label="Search"` present | No aria-label | High | Source screenshot |
| 3.2 | Cart icon button has aria-label | View Page Source | Find cart link HTML | `aria-label="View cart"` or equivalent | No aria-label | High | Source screenshot |
| 3.3 | Close buttons (modal/drawer) have aria-label | View Page Source | Find close button HTML | `aria-label="Close"` | No aria-label | High | Source screenshot |
| 3.4 | Modal manages aria-hidden on background | DevTools → Elements | Open cart drawer → inspect `<body>` or wrapper | Background has `aria-hidden="true"` while drawer open | No aria-hidden on background | Medium | DevTools screenshot |
| 3.5 | Toggle controls have aria-expanded | View Page Source / DevTools | Inspect accordion or dropdown toggle button | `aria-expanded="false"` when closed, `"true"` when open | Missing aria-expanded | Medium | DevTools screenshot |
| 3.6 | Decorative icons have aria-hidden="true" | View Page Source | Find decorative SVG/icon elements | `aria-hidden="true"` on decorative elements | Decorative icons announced by screen reader | Medium | Source screenshot |
| 3.7 | WAVE audit for ARIA errors | WAVE | Enter homepage URL in WAVE | Zero ARIA errors | ARIA errors flagged | High | WAVE screenshot |

---

## ACC-4 — Microsoft Clarity

| # | Check | Tool | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 4.1 | Clarity app is installed via official Shopify app | Shopify Admin → Apps | Check app list for "Microsoft Clarity" | Official Clarity Shopify app installed | Clarity installed via raw `<script>` in theme.liquid | High | Screenshot |
| 4.2 | Clarity tracks checkout and thank-you page | Clarity dashboard → Recordings | Review a session recording that completed a purchase | Checkout and order confirmation steps visible in recording | Session ends at cart page | High | Screenshot of recording |
| 4.3 | Rage clicks have been reviewed on cart/checkout | Clarity dashboard → Heatmaps | Filter to Cart and Checkout pages; check for rage click clusters | Known causes identified and documented | No review conducted | High | Screenshot of heatmap |
| 4.4 | GDPR cookie consent covers Clarity | Cookie consent policy review | Review privacy policy and cookie consent popup | Clarity/analytics cookies declared | Clarity not mentioned in consent | Critical | Screenshot of consent config |
| 4.5 | Key findings exported before 30-day retention | Manual check | Review Clarity data age | Findings documented in evidence file | Insights lost due to retention expiry | Medium | Evidence file reference |
