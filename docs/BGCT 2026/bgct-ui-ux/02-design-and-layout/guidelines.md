# Guidelines — Design & Layout

**Status:** DRAFT
**Sheet:** Design & Layout (BGCT workbook, Sheet 2)
**Tasks covered:** DL-1 through DL-8
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## DL-1 — Homepage Layout Improvements

| Rule | Detail |
|---|---|
| **No auto-playing carousel as hero** | Hero section must use a static image with a single CTA. |
| **Hero CTA above the fold** | Visible on 375px mobile without scrolling. |
| **Featured collection: within 2–3 scrolls** | Must not be buried below blog posts, social feeds, or multiple promotional sections. |
| **Each section must serve the user journey** | Remove any section that does not contribute to discovery, trust, or conversion. |
| **Escalation: Business Validator** | Homepage hero copy and featured collection selection require business validator approval before publishing. |

---

## DL-2 — Collection Page Layout Improvements

| Rule | Detail |
|---|---|
| **Desktop: 3–4 products per row** | Use 4-column grid on wide screens (1200px+), 3-column on mid-range. |
| **Mobile: 2 products per row** | 1-column wastes space; 3-column makes products too small. |
| **AJAX filters: mandatory** | Filter selections must update the grid without a page reload. |
| **Product image aspect ratio: uniform** | All product images in the grid must use the same aspect ratio (recommend 4:5 or 1:1). |
| **Sold Out + Sale badges required** | These must be visible without hovering or clicking into the product. |
| **Escalation: Developer** | AJAX filter implementation beyond theme settings requires developer involvement. |

---

## DL-3 — Product Page Layout Improvements

| Rule | Detail |
|---|---|
| **Desktop: image left, buy box right** | Standard two-column product page layout. |
| **Mobile: image top, buy box immediately below** | No content between gallery and buy box on mobile. |
| **Buy box must include** | Price, variant selectors, Add to Cart button — all visible without scrolling. |
| **Detailed content: below the fold** | Descriptions, specs, reviews use accordions/collapsible tabs. |
| **Sticky buy box on desktop: recommended** | If product description is long, sticky buy box keeps Add to Cart always accessible. |
| **Escalation: Developer** | Sticky buy box and accordion implementations require developer for themes that do not include them natively. |

---

## DL-4 — Mobile Responsiveness Fixes

| Rule | Detail |
|---|---|
| **Minimum tap target: 44×44px** | All tappable elements must meet this minimum (WCAG 2.5.5). |
| **Minimum body font size: 16px** | No body text smaller than 16px on mobile. |
| **No horizontal scroll** | Zero horizontal scrolling at any viewport width from 320px–768px. |
| **Test viewports** | Required test widths: 375px (iPhone SE), 390px (iPhone 15), 414px (older Plus), 768px (tablet portrait). |
| **Test devices + emulators** | Test on both Chrome DevTools emulation AND physical iOS/Android devices. |
| **Escalation: Developer** | CSS media query fixes for horizontal scrolling and font sizing require developer. |

---

## DL-5 — CTA Placement

| Rule | Detail |
|---|---|
| **Primary CTA above the fold** | Must be visible on all devices without scrolling on the product page. |
| **No secondary CTAs equal in size to primary** | Wishlist, share, compare must be visually smaller or differently styled. |
| **Sticky Add to Cart bar: recommended for long product pages** | Appears when user scrolls past main buy box. |
| **Cart drawer: Checkout button at bottom** | Always pinned — never requires scrolling within the drawer. |
| **Escalation: Developer** | Sticky Add to Cart bar implementation requires developer CSS/JS. |

---

## DL-6 — CTA Design

| Rule | Detail |
|---|---|
| **Primary button: high-contrast accent colour** | A dedicated colour reserved only for conversion buttons. |
| **Button text: action-oriented** | "Add to Cart", "Buy Now", "Checkout" — not "Submit", "Continue", "Go". |
| **Hover state: required on desktop** | Slight colour darken, scale, or shadow on hover — confirms interactivity. |
| **Minimum text size on buttons: 16px** | Smaller button text reduces usability, especially on mobile. |
| **Prohibited** | Outline-only button as primary CTA. Button text too small. No hover state. |
| **Escalation: Developer** | Custom hover states in CSS beyond theme settings require developer. |

---

## DL-7 — Typography Consistency

| Rule | Detail |
|---|---|
| **Maximum 2 typefaces** | Heading font + body font. No third or decorative typeface without business validator approval. |
| **Use Shopify CSS variables** | `var(--font-heading-family)`, `var(--font-body-family)` — do not hardcode font families. |
| **Body line-height: minimum 1.5** | Below 1.5 is too dense for extended reading. |
| **No display/script fonts for body, buttons, or descriptions** | Readability is mandatory. |
| **Consistent heading scale** | H1/H2/H3 must follow a defined size scale used across all pages. |
| **Escalation: Business Validator** | Font selection changes require business validator or brand owner approval. |

---

## DL-8 — Color Consistency

| Rule | Detail |
|---|---|
| **Define 5 colour roles** | Primary, secondary, background, text, conversion/accent. |
| **Accent colour: conversion only** | Used exclusively on Add to Cart and Checkout buttons. No other use. |
| **Exact hex codes** | No near-matches — same hex values throughout all theme files. |
| **Light backgrounds for content** | Dark backgrounds acceptable for hero sections; use light for product descriptions and text-heavy areas. |
| **Use OS 2.0 Color Schemes** | Define colour schemes in Theme Settings → Colors and apply via Theme Editor. |
| **Prohibited** | Using the same colour for non-interactive headings and interactive links simultaneously. |
| **Escalation: Business Validator** | Brand colour palette changes require brand owner or business validator approval. |
