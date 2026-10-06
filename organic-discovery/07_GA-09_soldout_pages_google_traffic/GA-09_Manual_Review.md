# GA-09 — Manual Review Items

**Date:** 2026-10-06  
**Prepared by:** Claude Code (sinrasu mode)  

These 2 products were NOT added to the redirect CSV. Each requires a decision from Piranav before any redirect can be set.

---

## Product #5 — Orange Dome Pendant Lampshade

**Sold-out URL:** `/products/vintage-industrial-loft-style-metal-ceiling-light-modern-orange-dome-pendant-lampshade`  
**Current page title:** "Flush Mount Lamp for Hallway & Entryway Lighting"  
**Current price:** £16.10  

### Problem

The URL handle describes an "orange dome pendant lampshade" (vintage industrial loft style metal ceiling light).  
The current page title shows a completely different product: "Flush Mount Lamp for Hallway & Entryway Lighting".  

This mismatch means:
- Google may have indexed this page for "orange dome pendant" searches
- But the current page content is a flush mount ceiling light
- The product is sold out either way

### Why Not Safe to Redirect

Redirecting without knowing what Google indexed for this URL risks sending traffic to the wrong destination. No in-stock orange dome pendant was found in the catalogue.

### Options for Piranav

**Option A — Check Google Search Console**  
Filter by this URL. See which keywords Google is sending traffic from. This determines the correct destination intent.

**Option B — Redirect to closest dome pendant in stock**  
If GSC confirms "dome pendant" intent:
- `Hanging Dome Industrial Kitchen Light Shade ~3160` → `/products/hanging-kitchen-light` (177 units)
- `Luxury Vintage Industrial Metal Dome Lampshade ~2321` → `/products/luxury-lamp-shades` (104 units)
- `Metal Dome Shape Lampshade ~1894` → `/products/yellow-chandelier-lampshade-ceiling-light-shade-pendant-lights-fixture` (77 units)

**Option C — Redirect to flush mount collection**  
If GSC confirms "flush mount" / "hallway ceiling light" intent, redirect to appropriate collection.

**Option D — Leave the page as-is**  
If the page has very low traffic, no redirect may be needed.

### What Piranav Must Decide

1. What does GSC show for this URL's top keywords?
2. Is the flush mount product truly gone or was the URL accidentally reused?
3. Which replacement option best matches the traffic intent?

---

## Product #8 — 12V IR Remote Controller (RGB LED Strip)

**Sold-out URL:** `/products/12v-ir-remote-controller`  
**Product title:** "RGB LED Strip Controller | 12V IR Remote, 24/44 Keys ~5451"  
**Price:** £4.99 (24-key) / £5.99 (44-key)  

### Problem

No in-stock IR remote controller for RGB LED strips was found in the entire LEDSone catalogue. The Shopify Admin API confirmed all RGB/remote controller products have 0 inventory.

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
