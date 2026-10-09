# Checklist — Conversion Optimization (CRO)

**Status:** DRAFT
**Sheet:** Conversion Optimization (CRO) (BGCT workbook, Sheet 1)
**Tasks covered:** CRO-1 through CRO-10
**Owner:** Piranav | **Reviewer:** Sajeesan | **Queryability Reviewer:** Tamil Selvan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## How to Use
Mark each item PASS, FAIL, or N/A. Record the device tested (Desktop / Mobile / Tablet). Save screenshots for any FAIL. A section is PASS only when all applicable items are PASS.

---

## CRO-1 — Cart Flow Improvements

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 1.1 | Cart type is drawer (not /cart page redirect) | Desktop + Mobile | Add item to cart — observe behaviour | Cart drawer slides in from right, no page redirect | Browser navigates to /cart page | High | Screenshot |
| 1.2 | Cart total updates without page reload | Desktop + Mobile | Change item quantity in drawer | Total updates instantly | Page reloads or total stays static | High | Screen recording |
| 1.3 | Subtotal and Checkout button are pinned to bottom | Desktop + Mobile | Open cart drawer with 5+ items | Buttons always visible without scrolling drawer | Buttons require scrolling within drawer | High | Screenshot |
| 1.4 | Empty cart state has "Continue Shopping" link | Mobile | Open cart drawer with no items | "Continue Shopping" or equivalent CTA visible | Empty white panel with no CTA | Medium | Screenshot |
| 1.5 | Free-shipping progress bar present (if applicable) | Desktop + Mobile | Open cart drawer with items below threshold | Progress bar visible: "Add £X for free shipping" | No progress indicator | Medium | Screenshot |
| 1.6 | Remove item button works without page reload | Desktop + Mobile | Click remove on a cart item | Item disappears, total updates, no page reload | Page reloads | High | Screen recording |

---

## CRO-2 — Checkout Flow Improvements

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 2.1 | Guest Checkout available | Mobile | Begin checkout without logging in | Option to continue as guest is visible | Only "Create account" shown | Critical | Screenshot |
| 2.2 | Express payments visible (Shop Pay/Apple Pay/Google Pay) | Mobile + Desktop | Open checkout page | Express payment buttons visible above address form | Not visible or below fold | High | Screenshot |
| 2.3 | Company name field is hidden | Desktop | Open checkout address form | No company name field | Company name field visible | Low | Screenshot |
| 2.4 | Address line 2 is optional | Desktop | Check checkout form field labels | Address line 2 labelled "optional" | Required field | Medium | Screenshot |
| 2.5 | Phone number is optional | Desktop | Check checkout form | Phone labelled "optional" or absent | Required field | Medium | Screenshot |
| 2.6 | Store logo displayed in checkout | Desktop | Open checkout | Store logo visible in checkout header | No logo, generic Shopify UI | Medium | Screenshot |
| 2.7 | Default shipping option pre-selected | Desktop | Open checkout shipping step | Cheapest/free option pre-selected | No option pre-selected | Medium | Screenshot |

---

## CRO-3 — Trust Signals: Reviews

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 3.1 | Star rating widget below product title | Desktop + Mobile | Open any product page with reviews | Star rating visible directly under product title | Star rating missing or below buy box | High | Screenshot |
| 3.2 | Star rating links to review section | Desktop | Click star rating widget | Page scrolls smoothly to review section | Click does nothing | Medium | Screenshot |
| 3.3 | Full review section present on product page | Desktop + Mobile | Scroll to bottom of product page | Dedicated review section with individual reviews | No review section | High | Screenshot |
| 3.4 | Reviews filterable by star rating | Desktop | Use review filter | Can filter by 5-star, 4-star, etc. | No filter available | Low | Screenshot |
| 3.5 | 1-star reviews are visible | Desktop | Check review section for 1-star reviews (if any exist) | 1-star reviews visible and not suppressed | 1-star reviews hidden | High | Screenshot |
| 3.6 | Review app correctly installed | Shopify Admin | Admin → Apps | Review app (Judge.me/Yotpo/Loox) listed as active | Not installed | Critical | Screenshot |

---

## CRO-4 — Trust Signals: Badges

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 4.1 | Security/payment badges present near buy button | Desktop + Mobile | Open product page | Trust badges visible within view of "Add to Cart" | No badges near buy button | Medium | Screenshot |
| 4.2 | Badges are SVG or high-resolution | Desktop | Right-click badge → Inspect | `<img>` tag shows .svg source or 2x retina PNG | Blurry/pixelated badge | Medium | DevTools screenshot |
| 4.3 | Badge design matches theme aesthetic | Desktop | Visual review | Badges look integrated with theme style | Oversized, garish, or mismatched badges | Medium | Screenshot |
| 4.4 | Badges do not make unverifiable claims | Manual review | Read each badge label | Only factual, verifiable badges (SSL, payment icons) | "Award Winner" or "Best Rated" without source | High | Screenshot |

---

## CRO-5 — Trust Signals: Guarantees

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 5.1 | Guarantee icons/bullets near Add to Cart | Desktop + Mobile | Open product page | Shipping, returns, warranty icons visible near buy box | Guarantees absent or only in footer | High | Screenshot |
| 5.2 | Shipping time is specific | Desktop | Read shipping guarantee text | Specific time (e.g., "Ships within 24 hours") | Vague ("dispatched promptly") | High | Screenshot |
| 5.3 | Return policy is clearly accessible | Desktop | Check guarantee block | Return policy linked or summarised near buy box | Only in footer/policy page | High | Screenshot |
| 5.4 | Return shipping cost explicitly stated | Desktop | Read return policy near buy box | Free returns / or cost stated plainly | "See returns policy" with no cost indication | Medium | Screenshot |

---

## CRO-6 — Sticky Headers

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 6.1 | Sticky header activates on scroll | Desktop + Mobile | Scroll down on any long page | Slim header appears pinned to top | Header disappears on scroll | High | Screenshot mid-scroll |
| 6.2 | Sticky header does not include announcement bar | Desktop + Mobile | Observe sticky header content | Only logo, nav, cart, search | Full announcement bar included | Medium | Screenshot |
| 6.3 | Cart icon in sticky header shows item count | Desktop + Mobile | Add item to cart, scroll down | Cart icon badge shows correct count | Count not shown or incorrect | High | Screenshot |
| 6.4 | Sticky header does not overlap critical content | Mobile | Scroll on product page with sticky header active | CTA buttons and images not obscured | Sticky header covers Add to Cart or images | Critical | Screenshot |
| 6.5 | Sticky header animates smoothly | Desktop | Scroll up and down | Header appears/disappears with smooth animation | Janky or immediate jump | Low | Screen recording |

---

## CRO-7 — Floating Cart

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 7.1 | Floating cart not present if sticky header exists | Desktop + Mobile | Check for floating cart icon | Not present when sticky header with cart is active | Both present simultaneously | Medium | Screenshot |
| 7.2 | If present: item count is live | Mobile | Add item, observe floating cart | Count updates in real time | Count static or absent | High | Screenshot |
| 7.3 | If present: does not overlap chat or back-to-top | Mobile | Open page with chat widget active | No overlap between floating cart, chat, and back-to-top | Overlap occurs | High | Screenshot |

---

## CRO-8 — Quick View

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 8.1 | Quick View modal loads via AJAX (no page reload) | Desktop | Click Quick View button on collection card | Modal opens without page reload | Page navigates away | High | Screen recording |
| 8.2 | Modal has clear "X" close button | Desktop + Mobile | Open Quick View modal | Close button (×) is clearly visible | No visible close button | High | Screenshot |
| 8.3 | Modal closes on background click | Desktop | Click outside the Quick View modal | Modal closes | Modal remains open | Medium | Screen recording |
| 8.4 | Modal closes on Escape key | Desktop | Press Escape while Quick View open | Modal closes | Escape key has no effect | Medium | Keyboard test |
| 8.5 | "View full details" link inside modal | Desktop | Open Quick View modal | Link to full product page visible | No link to product page | High | Screenshot |
| 8.6 | Product image click goes to product page (not Quick View) | Desktop + Mobile | Click main product image on collection card | Navigates to product page | Opens Quick View instead | High | Screenshot |
| 8.7 | Quick View not used for complex products | Manual audit | Identify products with 3+ variant types | Quick View disabled or not available for complex products | Quick View enabled on complex multi-variant products | High | Screenshot |

---

## CRO-9 — Upsell UI

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 9.1 | Upsell does not interrupt Add to Cart → Checkout flow | Desktop + Mobile | Click "Add to Cart" → observe | Proceeds to cart without upsell interruption | Upsell popup appears before cart drawer | High | Screen recording |
| 9.2 | Upsell price difference clearly displayed | Desktop | Review upsell offer | Savings clearly quantified (£ and/or %) | Only "Upgrade!" with no price context | High | Screenshot |
| 9.3 | Maximum one upsell per interaction | Desktop | Count simultaneous upsell prompts | One offer at a time | 2+ simultaneous upsell options | Medium | Screenshot |

---

## CRO-10 — Cross-sell UI

| # | Check | Device | Procedure | Expected Result | Failure Condition | Severity | Evidence |
|---|---|---|---|---|---|---|---|
| 10.1 | Cross-sells are logically related to main product | Manual audit | Review cross-sell pairings for top 5 products | Products are functionally complementary | Unrelated products shown | High | Screenshot |
| 10.2 | Cross-sells below main buy box (not above) | Desktop | Check cross-sell position on product page | Below buy box or in cart drawer | Above buy box | High | Screenshot |
| 10.3 | Cross-sell items lower-priced than main item | Manual check | Compare cross-sell prices to main product price | Cross-sells are cheaper | Cross-sells more expensive than main item | Medium | Screenshot |
| 10.4 | Add cross-sell is one click | Desktop + Mobile | Attempt to add cross-sell to cart | Single click or checkbox adds item | Multi-step required | Medium | Screen recording |
