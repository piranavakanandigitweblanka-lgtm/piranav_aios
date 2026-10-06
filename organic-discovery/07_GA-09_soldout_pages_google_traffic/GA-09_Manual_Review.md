# GA-09 — Manual Review Items

**Date:** 2026-10-06 (updated — #5 resolved 2026-10-06)  
**Prepared by:** Claude Code (sinrasu mode)  

1 product was NOT added to the redirect CSV. It requires a decision from Piranav before any redirect can be set.

---

## Product #5 — Orange Dome Pendant Lampshade — RESOLVED

**Resolved:** 2026-10-06  
**Redirect added to CSV:** `/products/vintage-industrial-loft-style-metal-ceiling-light-modern-orange-dome-pendant-lampshade` → `/products/orange-metal-cylinder-dome-light-shade-lamp-shade-ceiling-light`  
**Replacement:** Orange Metal Cylinder Dome Light Shade ~1891 — 116 units — ACTIVE  
**Confidence:** HIGH — exact colour (orange) and shape (dome) match  

Previously flagged as manual review due to URL/title mismatch and no orange dome found in initial search. A second comprehensive dome search returned the exact product.

---

## Product #8 — 12V IR Remote Controller (RGB LED Strip)

**Sold-out URL:** `/products/12v-ir-remote-controller`  
**Product title:** "RGB LED Strip Controller | 12V IR Remote, 24/44 Keys ~5451"  
**Price:** £4.99 (24-key) / £5.99 (44-key)  

### Problem

No in-stock IR remote controller for RGB LED strips was found in the entire LEDSone catalogue. The Shopify Admin API confirmed all RGB/remote controller products have 0 inventory. A second broader search (dimmer, LED controller, dimmer switch) confirmed no compatible replacement exists — results were all plug-in pendant lamp dimmers, not LED strip accessories.

### Why Not Safe to Redirect

The customer intent is specifically: "IR remote to control a 12V RGB LED strip." There is no equivalent in-stock product. Redirecting to an unrelated product (chandelier remote, ceiling fan controller) would be a clear intent mismatch and would harm user experience.

### Options for Piranav

**Option A — Restock**  
If Purchasing can confirm a restock date for the 24-key or 44-key controller, add a restock notice to the page and keep it live. Do not redirect.

**Option B — Redirect to LED strip collection**  
If restock is not planned, redirect to the LED strips collection so the customer can at least find related products:  
`/collections/led-strips` (if this collection exists and is relevant)

**Option C — Leave as-is**  
Keep the sold-out page live. Google traffic may be low. No redirect needed if traffic is negligible (confirm in GSC).

**Option D — Redirect to RGB LED strip kit**  
Note: The RGB LED Strip Kit ~2408 (`/products/rgb-high-quality-splash-proof-led-strip-light-5050`) also has 0 inventory so cannot be used.

### What Piranav Must Decide

1. Is there a confirmed restock date for this product?
2. Is a relevant collection redirect acceptable?
3. What does GSC show for this URL's traffic volume? (If low, leaving as-is may be fine.)
