# Checklist — Design & Layout

**Status:** DRAFT
**Sheet:** Design & Layout (BGCT workbook, Sheet 2)
**Tasks covered:** DL-1 through DL-8
**Owner:** Piranav | **Reviewer:** Sajeesan | **Queryability Reviewer:** Tamil Selvan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## DL-1 — Homepage Layout Improvements

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 1.1 | Hero section has a single static image (no carousel) | Desktop + Mobile | Open homepage | Static hero image with single CTA | Auto-playing carousel or slider | High | Screenshot |
| 1.2 | Hero CTA visible above the fold | Mobile (375px) | Open homepage on 375px Chrome DevTools emulation | CTA button visible without scrolling | CTA requires scrolling | High | Screenshot |
| 1.3 | Hero text is legible over background image | Desktop + Mobile | Read hero text | Text clearly readable — sufficient contrast | Text blends into background | High | Screenshot |
| 1.4 | Featured collection visible within 2–3 scrolls | Mobile | Scroll down homepage | Featured products reachable within 3 scrolls | Buried below 5+ sections | Medium | Screenshot |
| 1.5 | Social proof / trust signals present on homepage | Desktop | Scroll homepage | Reviews, testimonials, or trust icons visible | No social proof on homepage | Medium | Screenshot |

---

## DL-2 — Collection Page Layout Improvements

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 2.1 | Desktop grid: 3–4 products per row | Desktop (1280px) | Open any collection page | 3–4 columns visible | 1–2 or 5+ columns | Medium | Screenshot |
| 2.2 | Mobile grid: 2 products per row | Mobile (390px) | Open collection on mobile | 2 columns visible | 1 or 3 columns | High | Screenshot |
| 2.3 | Filters update grid without full page reload | Desktop | Select a filter | Product grid updates without page reload | Full page reload on filter select | High | Screen recording |
| 2.4 | Product images consistent aspect ratio | Desktop | Scan product grid | All images same shape/crop | Mixed portrait/landscape/square | Medium | Screenshot |
| 2.5 | "Sale" badge visible on reduced-price products | Desktop | Check sale products | Red/green "Sale" badge on card | No badge | Medium | Screenshot |
| 2.6 | "Sold Out" badge visible on unavailable products | Desktop | Check any sold-out product | "Sold Out" overlay or badge on card | No badge — card looks same as available | High | Screenshot |
| 2.7 | Second image displays on hover (desktop) | Desktop | Hover over a product card | Second product image slides in | No hover image | Low | Screenshot |

---

## DL-3 — Product Page Layout Improvements

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 3.1 | Desktop: image gallery left, buy box right | Desktop | Open any product page | Two-column layout: images left, buy info right | Buy box below images | Medium | Screenshot |
| 3.2 | Mobile: image gallery swipeable | Mobile | Open product page, swipe gallery | Gallery swipes to next image on touch | Gallery not swipeable | High | Screen recording |
| 3.3 | Price and Add to Cart above the fold on mobile | Mobile (390px) | Open product page | Price and Add to Cart visible without scrolling | Both require scrolling | Critical | Screenshot |
| 3.4 | Descriptions use accordions/collapsible sections | Desktop + Mobile | Check product page below buy box | Detailed info in collapsible sections | All content expanded by default | Medium | Screenshot |
| 3.5 | Product image gallery includes zoom on desktop | Desktop | Click or hover on product image | Zoom or lightbox available | No zoom | Low | Screenshot |

---

## DL-4 — Mobile Responsiveness Fixes

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 4.1 | No horizontal scrolling | Mobile (375px) | Scroll left/right on any page | No horizontal scroll possible | Page scrolls horizontally | Critical | Screenshot / screen recording |
| 4.2 | Body font size 16px minimum | Mobile | Chrome DevTools → Inspect body text | Computed font-size ≥ 16px | Any body text < 14px | High | DevTools screenshot |
| 4.3 | Tap targets 44×44px minimum | Mobile | Chrome DevTools → Lighthouse → Tap targets | All interactive elements ≥ 44×44px | Any element smaller | High | Lighthouse screenshot |
| 4.4 | Add to Cart button easily tappable without zooming | Mobile (physical) | Test on physical iPhone and Android | Tappable without precision or zoom | Requires precise tapping | Critical | Physical test note |
| 4.5 | Header simplifies on mobile (hamburger + cart) | Mobile | Open homepage on mobile | Hamburger menu and cart icon visible | Full desktop nav on mobile | High | Screenshot |

---

## DL-5 — CTA Placement

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 5.1 | Primary Add to Cart above the fold on product page | Mobile (390px) | Open product page | Add to Cart visible without scrolling | Add to Cart below fold | Critical | Screenshot |
| 5.2 | Secondary CTAs visually smaller than primary | Desktop | Compare wishlist/share buttons to Add to Cart | Clear visual hierarchy: primary is dominant | Secondary CTAs same size as primary | High | Screenshot |
| 5.3 | Sticky Add to Cart bar appears on scroll (if implemented) | Mobile | Scroll past buy box on product page | Sticky bar appears at bottom | Not present | Medium | Screenshot |
| 5.4 | Cart drawer Checkout button always visible | Mobile | Open cart drawer with items | Checkout button pinned to bottom | Button requires scrolling in drawer | High | Screenshot |

---

## DL-6 — CTA Design

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 6.1 | Primary button has high-contrast accent colour | Desktop | Visual review of Add to Cart button | Distinct, high-contrast colour vs rest of page | Same colour as nav, links, or text | High | Screenshot |
| 6.2 | Primary button text is action-oriented | Desktop | Read button text | "Add to Cart", "Buy Now", "Checkout" | "Submit", "Continue", "Go", "Click here" | Medium | Screenshot |
| 6.3 | Button has hover effect (desktop) | Desktop | Hover over Add to Cart button | Colour darkens, scales, or shadow appears | No visual change on hover | Medium | Screenshot |
| 6.4 | Button text is bold and 16px+ | DevTools | Inspect primary button | `font-size ≥ 16px`, `font-weight ≥ 600` | Small or thin button text | High | DevTools screenshot |
| 6.5 | Primary button is not outline-only style | Desktop | Visual check | Filled button | Outline-only (transparent fill) | High | Screenshot |

---

## DL-7 — Typography Consistency

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 7.1 | Maximum 2 typefaces used across the site | Desktop | Inspect fonts via Chrome DevTools → Computed styles | 2 font families in use | 3 or more distinct typefaces | Medium | DevTools screenshot |
| 7.2 | Body line-height is at least 1.5 | DevTools | Inspect paragraph `line-height` | ≥ 1.5 | < 1.4 | High | DevTools screenshot |
| 7.3 | Heading scale is consistent (H1/H2/H3 sizes) | Desktop | Compare H1, H2, H3 across homepage and product pages | Same size for each level everywhere | H2 is 28px on homepage and 20px on product page | Medium | Screenshot |
| 7.4 | No display or script fonts in body text or buttons | Desktop | Visual check product descriptions and buttons | Clean, readable fonts | Decorative or script font in body or CTA | High | Screenshot |

---

## DL-8 — Color Consistency

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 8.1 | Accent colour used exclusively on conversion buttons | Desktop | Check all pages for accent colour usage | Only appears on Add to Cart / Checkout | Accent used on headings, links, banners also | High | Screenshots of multiple pages |
| 8.2 | Exact same hex codes used throughout | DevTools | Inspect colours on buttons, links, headings | Exact hex match across pages | Slight variations (e.g., #1a73e8 vs #1a74e8) | Medium | DevTools screenshot |
| 8.3 | Light background for content areas | Desktop | Check product description and collection page background | White or light grey background | Dark background under product descriptions | High | Screenshot |
| 8.4 | Interactive links distinguished from non-interactive headings | Desktop | Compare link colour to heading colour | Links are a different colour from static headings | Same colour used for clickable and non-clickable text | High | Screenshot |
