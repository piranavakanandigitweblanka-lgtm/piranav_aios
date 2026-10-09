# Best Practice — Design & Layout

**Status:** DRAFT
**Sheet:** Design & Layout (BGCT workbook, Sheet 2)
**Tasks covered:** DL-1 through DL-8
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## DL-1 — Homepage Layout Improvements

### User problem
Users arriving at the homepage need to immediately understand what the store sells, why they should trust it, and where to go next. A homepage that fails to communicate its value proposition in the first three seconds loses the user.

### Recommended approach
Structure the homepage as a vertical narrative:
1. **Hero section** — high-quality image with a single, clear CTA (not a carousel)
2. **Bestsellers grid** — immediately accessible, within one scroll
3. **Value proposition / Trust signals** — shipping, returns, social proof
4. **Footer / Newsletter** — secondary engagement

Use "Image with Text" alternating sections on scroll to maintain visual interest. Every section should serve a purpose — remove sections that do not contribute to the user journey.

### Device considerations
- **Mobile:** Hero CTA must be above the fold on a 375px screen. Featured collection must be reachable within 2–3 scrolls.
- **Desktop:** Use horizontal sections above the fold; vertical stacking below.

### Common failure modes
- Auto-playing carousel as the hero (extremely low click-through rate on carousels; distracts and confuses).
- Hero image without readable text overlay (no background overlay or contrast layer).
- Featured products buried below a blog section, social feed, and three promotional banners.

---

## DL-2 — Collection Page Layout Improvements

### User problem
Users on a collection page need to quickly find relevant products. Too many products on one page with no filtering causes decision paralysis. A confusing filter UI makes users give up.

### Recommended approach
Use a **left-sidebar or sticky top-bar** for filters. Show **3–4 products per row on desktop, 2 per row on mobile**. Product cards must show: title, price, second hover image (desktop), and clear "Sale" / "Sold Out" badges. Filters must update the grid without a full page reload (AJAX). Make hover effects explicit on desktop to communicate what is clickable.

### Device considerations
- **Mobile:** 2 columns is the correct default. 1 column wastes screen width. 3 columns makes products too small to evaluate.
- **Tablet:** 3 columns on landscape, 2 on portrait.

### Common failure modes
- Filters that cause a full page reload on each selection — slow and frustrating.
- Product grid images inconsistently cropped — creates an uneven, unprofessional grid.
- No "Sold Out" or "Sale" badge on cards — user wastes time clicking into unavailable products.

---

## DL-3 — Product Page Layout Improvements

### User problem
The product page is where the purchase decision is made. If users cannot quickly find the price, images, and "Add to Cart" button, or if the page is overwhelming, they leave without buying.

### Recommended approach
- **Desktop:** Product image gallery on the left, sticky buy box on the right.
- **Mobile:** Image gallery (swipeable) on top, buy box immediately below.
- Below the fold: detailed description, spec tables, and reviews in accordions/collapsible tabs (saves space, reduces overwhelm).
- Price and "Add to Cart" button must be **highly prominent** — above the fold on all devices.
- Include a video or 3D model in the gallery if available.

### Device considerations
- **Mobile:** Swipeable image gallery is mandatory. "Add to Cart" must not be pushed below the fold by long variant selectors or description text.

### Common failure modes
- Price or variant selector buried below a long marketing description.
- No collapsible accordions — all content expanded, making the page exhausting to scan.
- No sticky buy box on desktop — user must scroll up to add to cart after reading reviews.

---

## DL-4 — Mobile Responsiveness Fixes

### User problem
Layouts designed for desktop often break on mobile: text too small to read, horizontal scrolling, tap targets too small for fingers.

### Recommended approach
Design for "fat fingers": minimum tap target size is **44×44 CSS pixels** (WCAG 2.5.5). Body text minimum **16px**. No horizontal scrolling required at any viewport width. Use Chrome DevTools device emulation to test on common iPhone and Android sizes (375px, 390px, 414px). Use CSS media queries to fix mobile-specific margins, paddings, and layouts.

### Device considerations
- Test on physical devices as well as emulators — physical device scroll behaviour and rendering can differ.
- Test on both iOS Safari and Chrome for Android — they render some CSS properties differently.

### Common failure modes
- Horizontal scrolling caused by a full-width element with fixed pixel width.
- Font size shrinks below 12px on mobile due to container constraints.
- "Add to Cart" button requires precise tapping — too small or too close to other tap targets.

---

## DL-5 — CTA Placement

### User problem
If users cannot see the primary conversion action (Add to Cart, Buy Now, Checkout) without scrolling, conversion rate drops.

### Recommended approach
The primary CTA must be **above the fold** on the product page on both desktop and mobile. On long pages, implement a **sticky "Add to Cart" bar** that appears at the bottom of the screen when the user scrolls past the main buy box. Checkout button must be at the top and bottom of the cart drawer. Secondary CTAs (share, wishlist, compare) must not be visually equal in size or position to the primary CTA.

### Device considerations
- **Mobile:** Hero CTA on the homepage must be visible without any scrolling on a 375px screen.
- **Mobile product page:** Add to Cart must not be pushed below the fold by variant selectors.

### Common failure modes
- "Add to Cart" pushed below the fold by a long title, variant labels, and description.
- Secondary CTAs ("Save to Wishlist", "Ask a Question") positioned adjacent and equal in size to the primary CTA.
- Cart drawer has a Checkout button only at the bottom — not visible without scrolling.

---

## DL-6 — CTA Design

### User problem
Buttons that look like text, or buttons without visible click states, reduce conversion because users do not recognise them as interactive.

### Recommended approach
Use a **high-contrast colour** specific to conversion buttons (Add to Cart, Checkout) that is distinct from the rest of the brand palette. Buttons must look "clickable": adequate padding, border-radius, slight shadow, hover effect (darken or scale). Button text must be action-oriented: "Add to Cart", "Add to Bag", "Buy Now" — not "Submit" or "Continue". Text must be large (minimum 16px) and bold on the primary button.

### Common failure modes
- Outline-style button used as the primary CTA — too subtle for conversion.
- Hover effect absent — button does not confirm interactivity on desktop.
- Primary button colour identical to secondary elements — no visual hierarchy.

---

## DL-7 — Typography Consistency

### User problem
Inconsistent fonts, sizes, and weights make a store look unprofessional and reduce readability.

### Recommended approach
Limit to **2 typefaces**: one for headings (more expressive/stylistic) and one for body text (optimised for readability). Heading scale example: H1 = 40px, H2 = 32px, H3 = 24px. Body text line-height: minimum 1.5. Maintain consistent font-weight and letter-spacing across the site. Do not hardcode font families in CSS — use Shopify's CSS variables (`var(--font-heading-family)`, `var(--font-body-family)`). Do not use display or script fonts for body text, buttons, or product descriptions.

### Common failure modes
- Three or more typefaces used across the site.
- CSS custom font declarations overriding Shopify's theme font settings — creates inconsistencies.
- Body text line-height below 1.4 — dense and difficult to read.

---

## DL-8 — Color Consistency

### User problem
Random or conflicting colors across UI elements create visual confusion and reduce brand trust.

### Recommended approach
Define a **palette of 5 roles**: primary brand colour, secondary colour, background, text, and a distinct conversion/accent colour. Apply the accent colour exclusively to conversion elements (Add to Cart, Checkout buttons) and to nothing else — this reserves the colour as a visual cue for action. Use OS 2.0 Color Schemes to apply consistent colour groups to sections via the Theme Editor. Ensure exact same hex codes are used throughout — no near-matches. Use light backgrounds for content areas to maximise readability.

### Common failure modes
- Primary brand colour also used on buttons, links, badges, and headings simultaneously — removes its signalling power.
- Multiple shades of a color used inconsistently (slightly different blues for different links).
- Dark backgrounds on content-heavy sections reducing text readability.
