# Best Practice — Conversion Optimization (CRO)

**Status:** DRAFT
**Sheet:** Conversion Optimization (CRO) (BGCT workbook, Sheet 1)
**Tasks covered:** CRO-1 through CRO-10
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## CRO-1 — Cart Flow Improvements

### User problem
Users who add items to the cart should not have to navigate away from the product or collection page they are browsing. A redirect to a separate `/cart` page interrupts momentum and increases abandonment.

### Recommended approach
Implement an **AJAX Cart Drawer** — a slide-in panel from the right that shows cart contents without a page reload. The subtotal and Checkout button must be pinned to the bottom of the drawer so they are always visible without scrolling. Include a free-shipping progress bar (e.g., "Add £15 more for free shipping") to incentivise higher order values. Empty cart state must have a clear "Continue Shopping" link.

### Device considerations
- **Mobile:** Drawer should be full-width (100vw) or near-full-width to use available space.
- **Desktop:** A 380–420px wide drawer is standard. Ensure it does not obscure critical page content.

### Exceptions and trade-offs
- Cart drawers work best for simple products. If your catalog has many configuration steps (custom engraving, subscription options), a full cart page may provide a better environment for users to review their choices.
- A cart drawer reduces visibility of cross-sells on the full cart page — compensate by adding cross-sell suggestions inside the drawer itself.

### Common failure modes
- Cart drawer total does not update in real time when quantity is changed.
- Checkout button is buried and requires scrolling within the drawer.
- Drawer opens but displays nothing on page load before first item is added (no empty state handled).

---

## CRO-2 — Checkout Flow Improvements

### User problem
Checkout friction — too many form fields, no express payment options, mandatory account creation — directly causes cart abandonment.

### Recommended approach
Enable **Shop Pay, Apple Pay, and Google Pay** for one-click checkout at the top of the checkout page. Reduce required form fields to the minimum: hide company name, make address line 2 and phone number optional. Enable Guest Checkout — never force account creation. Pre-select the cheapest or free shipping option by default. Upload a logo in the checkout branding area (Shopify Admin → Settings → Checkout → Checkout styling).

### Shopify-specific note
Shopify controls the checkout HTML directly on Shopify Basic and above. Most layout changes are made through settings, not code. Checkout Extensibility (available on Shopify Plus) allows deeper customisation using Checkout UI Extensions.

### Exceptions and trade-offs
- Guest Checkout reduces the store's ability to contact customers for repeat marketing. This is a known trade-off: lower friction vs. lower customer lifetime value data. For most stores, lower friction is the correct choice.
- Phone number may be required for shipping carriers that need it for delivery notifications — confirm with the logistics team before making it optional.

### Common failure modes
- Express payment buttons (Apple Pay, Shop Pay) not visible at the top of checkout.
- Long checkout with unnecessary fields (company name always visible, address line 2 required).
- Checkout page lacks the store logo, reducing brand trust.

---

## CRO-3 — Trust Signals: Reviews

### User problem
Shoppers who have never purchased from the store cannot verify product quality from the brand's own claims alone. User-generated reviews reduce perceived risk and increase purchase confidence.

### Recommended approach
Display the average star rating directly under the product title (linked to the review section below the fold). Show a dedicated full review section at the bottom of the product page. Enable review filtering by star rating and by whether the review includes photos. Use a certified review app (Judge.me, Yotpo, Loox, Okendo). Respond professionally to negative reviews.

### Device considerations
- **Mobile:** Star rating widget must render cleanly at small sizes (18–20px stars minimum).
- Display at least 3–5 reviews without requiring pagination on mobile to give sufficient social proof above the scroll break.

### Claim flag
"Reviews with customer photos convert significantly higher" — widely cited as general guidance in CRO literature (Yotpo, Bazaarvoice reports) but conversion uplift is store- and product-specific. Accept as directional guidance, not a guaranteed metric.

### Common failure modes
- Review widget requires excessive scrolling on mobile before being visible.
- 1-star reviews are hidden, making the site appear to be filtering feedback (reduces trust).
- No reviews at all visible on product pages — app installed but widget not placed in template.

---

## CRO-4 — Trust Signals: Badges

### User problem
First-time buyers are concerned about payment security and data safety. Visual security badges near the checkout action provide reassurance.

### Recommended approach
Place payment security badges (SSL secure, Trusted Store, payment method icons: Visa, Mastercard, PayPal, Apple Pay) near the "Add to Cart" or "Checkout" buttons. Use SVG format for sharp rendering at all screen sizes. Keep badge design elegant and consistent with the theme — avoid oversized, garish "100% SECURE" banner badges that read as low-quality.

### Common failure modes
- Pixelated PNG badges instead of SVG.
- Badges positioned far below the buy box, defeating their purpose.
- Using fake or meaningless badge icons (e.g., "Award Winner 2022" with no source).

---

## CRO-5 — Trust Signals: Guarantees

### User problem
Return risk and uncertain shipping times are top reasons users abandon before purchase. Clear guarantees remove this perceived risk before the user has to ask.

### Recommended approach
Summarise guarantees in short bullet points or icon-with-text blocks near the Add to Cart button. Include: shipping time estimate, return policy, warranty. Write in plain language — avoid legal jargon. Example: "Free returns within 30 days. No questions asked."

### Common failure modes
- Return shipping cost buried deep in a policy page instead of stated at the point of purchase.
- Guarantee language is vague: "We aim to dispatch promptly" vs. "Ships within 24 hours".
- Guarantee icons present but not linked to the full policy (unverifiable claim reduces trust).

---

## CRO-6 — Sticky Headers

### User problem
On long product or collection pages, users who scroll to the bottom lose access to the navigation and cart icon. Sticky headers keep primary navigation and the cart accessible at all times.

### Recommended approach
Enable a sticky header that condenses on scroll: a slim bar showing the logo, hamburger menu (mobile), search icon, and cart icon with item count. Use the "On scroll up" behaviour — the header hides when scrolling down (saving vertical space) and reappears instantly when scrolling up. Do not include the announcement bar in the sticky header — it wastes vertical space.

### Device considerations
- **Mobile:** The sticky header consumes 50–60px of the visible viewport. Ensure it does not block critical UI elements (especially product images or "Add to Cart" buttons at the top of the product page).

### Common failure modes
- Sticky header includes the full announcement bar, reducing content viewport significantly.
- Sticky header animation is janky or slow.
- On mobile, the sticky header overlaps pop-up notifications or chat widgets.

---

## CRO-7 — Floating Cart

### User problem
Users want a quick way to access their cart without having to scroll to the header.

### Recommended approach
A floating cart button (fixed to bottom-right corner) is generally **unnecessary if a sticky header with cart icon is already in place.** Implement only if the sticky header is not available or if analytics (e.g., Microsoft Clarity heatmaps) show users are struggling to find the cart. If implemented: display current item count, ensure it does not overlap with chat widgets or "Back to Top" buttons, and make it easily tappable on mobile (min 44×44px).

### Common failure modes
- Floating cart and sticky header both present — redundant UI clutters the screen.
- Floating cart overlaps the live chat widget and blocks it.
- Item count badge not visible or not updated in real time.

---

## CRO-8 — Quick View

### User problem
Users browsing a collection page want to check basic product details and add simple products to cart without navigating away from the grid.

### Recommended approach
Enable Quick View for **simple products only** (single variants or simple option selections). The Quick View modal must load via AJAX (no page reload), include a clear "X" close button, and close on background click. Include a "View full details" link inside the modal for products that need full page context. Main product images should link to the product page — do not trigger Quick View on the image click.

### Exceptions and trade-offs
- Quick View can reduce average order value by removing users from the product page where cross-sells and detailed descriptions are visible. Monitor this if adding Quick View to a store that relies on product page content for conversion.
- Complex products (custom dimensions, multiple required variant selections) should never use Quick View — they need the full product page.

### Common failure modes
- Quick View modal triggered by clicking the product image (should link to product page instead).
- Modal does not close on background click or Escape key.
- Quick View used for products requiring many variant selections — creates a confusing or cramped modal.

---

## CRO-9 — Upsell UI

### User problem
Users who are ready to purchase may benefit from an upgrade at the right moment — but poorly timed or intrusive upsell prompts interrupt the purchase flow and increase frustration.

### Recommended approach
Offer the upsell **after checkout** (post-purchase upsell page) or **dynamically inside the cart drawer** (before checkout). Never interrupt the user between "Add to Cart" and the checkout button. The upsell offer must present clear, quantified added value (e.g., "Buy the 3-pack for £2.50 per unit — save 20%"). One-click to accept the upsell.

### Common failure modes
- Upsell popup triggered immediately when user clicks "Add to Cart" — interrupts the purchase flow.
- Upsell value proposition is vague ("upgrade now").
- Too many upsell options presented simultaneously causing decision paralysis.

---

## CRO-10 — Cross-sell UI

### User problem
Users purchasing one product may need or want complementary products, but may not discover them without a prompt.

### Recommended approach
Display "Frequently Bought Together" on the product page (below the main buy box) and complementary items in the cart drawer. Cross-sell products must make logical sense — paired by actual usage relationship (LED driver with LED strip, mounting clips with LED channel). Cross-sell items should be lower in price than the main item. Use an easy checkbox or one-click add UI. Configure pairings via Shopify's "Search & Discovery" app.

### Common failure modes
- Cross-sells showing completely unrelated products (auto-generated by an algorithm without curation).
- Cross-sell section placed above the main buy box, distracting from the primary conversion action.
- Cross-sells shown in Quick View modal — wrong context, creates choice overload before the main purchase is confirmed.
