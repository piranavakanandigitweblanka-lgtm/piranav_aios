# Guidelines — Conversion Optimization (CRO)

**Status:** DRAFT
**Sheet:** Conversion Optimization (CRO) (BGCT workbook, Sheet 1)
**Tasks covered:** CRO-1 through CRO-10
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## CRO-1 — Cart Flow Improvements

| Rule | Detail |
|---|---|
| **Cart type: Drawer** | Use AJAX cart drawer, not a separate /cart page redirect. |
| **Subtotal + Checkout always visible** | Pin to bottom of drawer — must not require scrolling within the drawer. |
| **Empty state handled** | Cart drawer must display a "Continue Shopping" CTA when cart is empty. |
| **Quantity edit** | Users must be able to increase, decrease, and remove items from within the drawer without a page reload. |
| **Escalation: Developer** | Cart drawer customisation beyond theme settings requires developer involvement. |
| **Safe boundary** | Do not modify cart drawer JavaScript without a duplicate theme backup. |

---

## CRO-2 — Checkout Flow Improvements

| Rule | Detail |
|---|---|
| **Guest Checkout: mandatory** | Guest Checkout must be enabled. Never require account creation to complete a purchase. |
| **Express payments: enabled** | Shop Pay, Apple Pay, Google Pay must be enabled and visible. Confirm with payment provider setup. |
| **Optional fields** | Address line 2: optional. Phone number: optional (confirm with logistics team first). Company name: hidden. |
| **Escalation: Business Validator** | Making phone number optional must be confirmed with the team responsible for order fulfilment and delivery. |
| **Escalation: Shopify Plus only** | Deep checkout layout customisation (beyond settings) requires Shopify Plus and Checkout Extensibility. |
| **Safe boundary** | Checkout settings changes should be tested on a development store before applying to production. |

---

## CRO-3 — Trust Signals: Reviews

| Rule | Detail |
|---|---|
| **Position: under product title** | Star rating widget must be positioned directly below the product title, above the price. |
| **Full review section: below fold** | Complete review list with rating filter must exist in the product page template. |
| **Do not hide negative reviews** | All reviews (including 1-star) must be visible. Filtering or hiding negative reviews reduces trust. |
| **Certified app required** | Judge.me, Yotpo, Loox, or Okendo. Schema injection is automatic. |
| **Respond to all negative reviews** | A professional response to a negative review is required within 5 business days (recommended SLA). |
| **Escalation: Business Validator** | Review moderation policy (what counts as a violation for removal) requires business validator sign-off. |

---

## CRO-4 — Trust Signals: Badges

| Rule | Detail |
|---|---|
| **Format: SVG preferred** | Avoid raster badge images — they pixelate on high-density screens. |
| **Position: near buy button** | Badges must be within visual proximity of the "Add to Cart" or "Checkout" button. |
| **Style: subtle and on-brand** | Must match theme aesthetic — no garish or oversized badge banners. |
| **Only use verifiable badges** | Do not display award badges, certification logos, or trust marks that the store does not actually hold. |
| **Escalation: Business Validator** | Any badge claiming a certification or award must be approved by the business validator who can confirm the claim is current and accurate. |

---

## CRO-5 — Trust Signals: Guarantees

| Rule | Detail |
|---|---|
| **Plain language** | All guarantee copy must be readable without legal background. Maximum 15 words per bullet. |
| **Shipping time must be specific** | "Ships within 24 hours" not "dispatched promptly". |
| **Return cost must be stated** | If return shipping has a cost, state it explicitly near the guarantee — do not bury in policy. |
| **Escalation: Business Validator** | All guarantee claims (return windows, warranty periods, shipping times) require business validator confirmation before publishing. |

---

## CRO-6 — Sticky Headers

| Rule | Detail |
|---|---|
| **Slim on scroll** | Sticky header must be shorter than the main header. Excludes announcement bar. |
| **Minimum content** | Logo, hamburger menu (mobile), cart icon with count. Optional: search icon. |
| **Scroll behaviour** | "On scroll up" preferred — hides when scrolling down, appears instantly on scroll up. |
| **No overlap with chat widget** | Header z-index must not overlap Gorgias, Tidio, or equivalent chat widget. |
| **Escalation: Developer** | Custom scroll behaviour beyond theme settings requires developer CSS/JS. |

---

## CRO-7 — Floating Cart

| Rule | Detail |
|---|---|
| **Only implement if sticky header is absent** | If a sticky header with cart icon already exists, do not add a floating cart — it creates redundant UI. |
| **Item count must be live** | Must update in real time when items are added. |
| **No overlap** | Must not cover chat widgets, "Back to Top" buttons, or cookie notices. |
| **Escalation: Developer** | Custom CSS/JS required. Use duplicate theme only. |

---

## CRO-8 — Quick View

| Rule | Detail |
|---|---|
| **Simple products only** | Quick View must not be enabled for products with 3+ variant types or complex configuration. |
| **AJAX load** | Modal must open without page reload. |
| **Close on background click and Escape** | Standard modal behaviour — mandatory. |
| **"View full details" link required** | Every Quick View modal must include a link to the full product page. |
| **Image click → product page** | Clicking the main product image on a card must go to the product page, not open Quick View. |
| **Escalation: Business** | Whether Quick View is appropriate for a specific product type requires business review of the product complexity. |

---

## CRO-9 — Upsell UI

| Rule | Detail |
|---|---|
| **Timing: post-checkout or in-cart** | Upsell prompt must never appear between "Add to Cart" and the checkout button. |
| **Clear value proposition** | Show price difference and savings quantified (e.g., "Save 20% with the bundle"). |
| **Maximum 1 upsell per interaction** | More than one simultaneous upsell causes decision fatigue. |
| **Escalation: Business Validator** | Upsell product pairings must be approved by the relevant product owner or business validator. |
| **App required** | Rebuy, OneClickUpsell, or equivalent. Do not build custom upsell from scratch without developer. |

---

## CRO-10 — Cross-sell UI

| Rule | Detail |
|---|---|
| **Logical pairings only** | Products must be functionally related (e.g., LED driver + LED strip). Random or algorithm-generated pairings must be reviewed before going live. |
| **Position: below buy box or in cart drawer** | Not above the buy box. Not in Quick View. |
| **Price: lower than main item** | Cross-sell should feel like an easy add-on, not a secondary major purchase. |
| **Easy add interaction** | Checkbox or single-click add — never multi-step. |
| **Escalation: Business Validator** | Cross-sell product pairings require business validator sign-off before going live. |
| **Configure via Search & Discovery app** | Use Shopify's Search & Discovery app for curated complementary product recommendations. |
