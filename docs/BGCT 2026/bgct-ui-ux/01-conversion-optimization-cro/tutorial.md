# Tutorial — Conversion Optimization (CRO)

**Status:** DRAFT — Liquid and CSS code examples require review by Sajeesan before team rollout
**Sheet:** Conversion Optimization (CRO) (BGCT workbook, Sheet 1)
**Tasks covered:** CRO-1 through CRO-10
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `Website UI_UX Tasks  BGCT.xlsx`
**Last updated:** 2026-10-09

---

## Prerequisites

- Access to Shopify Admin (Online Store, Settings, Apps permissions)
- Shopify Theme Editor access
- Chrome DevTools (F12) for device emulation and mobile testing
- A duplicate/draft theme created before making any code changes

---

## CRO-1 — Cart Flow Improvements

### Enable Cart Drawer via Theme Settings
1. Shopify Admin → **Online Store → Themes → Customize**.
2. In the Theme Editor, open **Theme Settings** (bottom-left gear icon).
3. Navigate to **Cart**.
4. Set cart type to **"Drawer"**.
5. Turn off "Show vendor" if it adds unnecessary clutter.
6. Click **Save**.
7. Test: add an item to cart on the live store — confirm the drawer opens from the right without page redirect.

### Add a free-shipping progress bar (if applicable)
1. In the Theme Editor, navigate to the **Cart Drawer** section (if your theme exposes this as a section).
2. Look for a "Free shipping threshold" or "Announcement" block setting.
3. Enter the free-shipping threshold amount.
4. Alternatively, install a cart upsell app (e.g., Cart Upsell — Monster, Slide Cart Drawer by AMP).

**References:** https://www.youtube.com/watch?v=xK-JrgZjFrU | https://www.youtube.com/watch?v=T6EXyRCwNgk

---

## CRO-2 — Checkout Flow Improvements

### Configure checkout fields
1. Shopify Admin → **Settings → Checkout**.
2. Under **Customer information**:
   - Set "Customer accounts" to **"Accounts are optional"** (enables Guest Checkout).
   - Uncheck "Company name" or set to optional.
   - Set Phone to "Optional" (confirm with logistics team first).
3. Under **Order processing**: pre-select cheapest shipping.
4. Click **Save**.

### Upload checkout logo
1. Still in Settings → Checkout.
2. Scroll to **"Checkout styling"**.
3. Upload your store logo.
4. Click **Save**.

### Enable express payment methods
1. Shopify Admin → **Settings → Payments**.
2. Under "Accelerated checkouts": enable **Shop Pay, Apple Pay, Google Pay** (availability depends on payment provider and country).
3. Click **Save**.

**Reference:** https://www.youtube.com/watch?v=0CoGpp-pe3M

---

## CRO-3 — Trust Signals: Reviews

### Install Judge.me (recommended free option)
1. Shopify Admin → **Apps → App Store** → search "Judge.me".
2. Install Judge.me Product Reviews.
3. In the Theme Editor: navigate to the **Product template**.
4. Click **"Add block"** → select **"Judge.me Preview Badge"** — position it directly below the product title block.
5. Scroll down in the template: click **"Add section"** → select **"Judge.me Review Widget"** — add near the bottom of the product page.
6. Click **Save**.

**Reference:** https://youtu.be/plkEMDHubsA?si=plPqTEzfUJPDtmiq

---

## CRO-4 — Trust Signals: Badges

### Add trust badge block via Theme Editor
1. Shopify Admin → **Online Store → Themes → Customize**.
2. Navigate to the **Product template**.
3. In the buy box area, click **"Add block"** → select **"Custom Liquid"** or **"Icon with text"**.
4. Add SVG badge HTML:
```html
<div class="trust-badges" style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
  <img src="{{ 'badge-ssl.svg' | asset_url }}" alt="SSL Secure" width="60" height="40">
  <img src="{{ 'badge-visa.svg' | asset_url }}" alt="Visa" width="48" height="32">
  <img src="{{ 'badge-mastercard.svg' | asset_url }}" alt="Mastercard" width="48" height="32">
  <img src="{{ 'badge-paypal.svg' | asset_url }}" alt="PayPal" width="48" height="32">
</div>
```
5. Upload SVG badge files to Shopify Admin → **Content → Files** first.
6. Click **Save**.

**Reference:** https://youtu.be/VhKFTvFeeCg?si=pnLJkRCGnKq7tv_H

---

## CRO-5 — Trust Signals: Guarantees

### Add guarantee icons via Theme Editor
1. Shopify Admin → **Online Store → Themes → Customize**.
2. Navigate to the **Product template** → buy box area.
3. Click **"Add block"** → **"Icon with text"**.
4. Add three blocks: one for shipping, one for returns, one for warranty.
5. Set icon (truck, shield, refresh arrow) and write text: "Ships within 24 hours", "Free 30-day returns", "2-year warranty".
6. Click **Save**.

**Reference:** https://www.youtube.com/watch?v=qfq5F1X7RPM

---

## CRO-6 — Sticky Headers

### Enable sticky header via Theme Settings
1. Shopify Admin → **Online Store → Themes → Customize**.
2. Select the **Header** section.
3. Check **"Enable sticky header"**.
4. Choose behaviour: **"On scroll up"** (hides on scroll down, shows on scroll up).
5. Click **Save**.
6. Test on mobile: scroll down on a long product page → confirm the header is slim and does not obscure content.

**Reference:** https://www.youtube.com/watch?v=cGRFYUQPz8g

---

## CRO-7 — Floating Cart

### When to implement
Only implement if sticky header is not available or analytics data shows users struggle to find the cart.

### Custom implementation (requires developer)
1. Duplicate live theme → work on duplicate.
2. In `layout/theme.liquid`, add a fixed cart button before `</body>`:
```html
<div id="floating-cart" style="position:fixed;bottom:20px;right:20px;z-index:999;">
  <a href="/cart" class="btn-floating-cart" aria-label="View cart ({{ cart.item_count }} items)">
    🛒 <span class="cart-count">{{ cart.item_count }}</span>
  </a>
</div>
```
3. Style with CSS. Ensure it is hidden when cart item count is 0.
4. Test on mobile: confirm no overlap with chat widget.
5. If conflicts arise: adjust `bottom` or `right` values, or hide floatin cart when sticky header is scrolled into view via JavaScript.

---

## CRO-8 — Quick View

### Enable Quick View via Theme Settings
1. Shopify Admin → **Online Store → Themes → Customize**.
2. Navigate to the **Collection template** or **Product grid** section.
3. Check **"Enable quick add"** or **"Quick view"** (terminology varies by theme).
4. Click **Save**.
5. Test: hover over a product card → confirm "Quick Add" button appears. Click it → modal opens via AJAX.
6. Test: click the product image on the card → confirm it navigates to the product page (not Quick View).

**Reference:** https://www.youtube.com/watch?v=557MnL8mzJU

---

## CRO-9 — Upsell UI

### Install a post-purchase upsell app
1. Shopify Admin → **Apps → App Store** → search "OneClickUpsell" or "Rebuy".
2. Install the app.
3. Configure a post-purchase funnel: set the trigger to "After order confirmed" and the offer to a complementary product.
4. Set the upsell offer to one-click accept.
5. Test: complete a test order → confirm the upsell page appears after the order confirmation.

**Reference:** https://apps.shopify.com/zipify-oneclickupsell

---

## CRO-10 — Cross-sell UI

### Configure complementary products via Search & Discovery
1. Shopify Admin → **Apps → Search & Discovery**.
2. Click **"Product recommendations"**.
3. Select a product → click **"Add manual recommendation"**.
4. Add 2–4 complementary products.
5. In the Theme Editor → **Product template**, click **"Add block"** → **"Complementary products"**.
6. Click **Save**.
7. Test on the product page: confirm the cross-sell section is visible below the buy box.

**Reference:** https://help.shopify.com/en/manual/online-store/storefront-search/search-and-discovery-recommendations

---

## DO's and DON'Ts

| DO | DON'T |
|---|---|
| DO: Add a free-shipping progress bar in the cart drawer. | DON'T: Force users to a /cart page to see what they added. |
| DO: Pre-select the cheapest shipping option by default. | DON'T: Require account creation to check out. |
| DO: Respond to negative reviews professionally. | DON'T: Hide 1-star reviews — it makes the site look untrustworthy. |
| DO: Use recognisable payment icons (Visa, Mastercard, PayPal). | DON'T: Use massive pixelated "100% SECURE SSL" banners. |
| DO: Honor guarantees effortlessly. | DON'T: Hide return shipping costs in the policy page. |
| DO: Keep sticky header background solid/slightly blurred. | DON'T: Include the announcement bar in the sticky header. |
| DO: Make floating cart easily tappable on mobile (44×44px min). | DON'T: Add floating cart if sticky header already has a cart icon. |
| DO: Include a "View full details" link inside Quick View modal. | DON'T: Force Quick View when user clicks the product image. |
| DO: Highlight upsell savings clearly. | DON'T: Show upsell before the user has committed to the first purchase. |
| DO: Keep cross-sell items lower in price than the main item. | DON'T: Show cross-sells for completely unrelated products. |
