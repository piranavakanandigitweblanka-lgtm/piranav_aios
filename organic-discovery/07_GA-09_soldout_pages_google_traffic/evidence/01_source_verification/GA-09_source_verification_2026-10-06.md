# GA-09 — Source Product Verification

**Date:** 2026-10-06  
**Method:** Live WebFetch of each URL + Shopify Admin API confirmation  
**Store:** ledsone.co.uk  

---

| # | URL Handle | Page Title | HTTP | Sold Out | Price | Redirect Exists | Notes |
|---|---|---|---|---|---|---|---|
| 1 | `12w-modern-led-adjustable-tilt-angle-downlight-recessed-round-ceiling-spotlights` | 12W LED Adjustable Tilt Downlight – Recessed Round Ceiling Spotlight | 200 | YES | £7.82 | No | 12W, 550lm, 6000K, 120°, tilt, aluminium/acrylic |
| 2 | `zip-ties-releasable-heavy-duty-reusable-cable-ties-wraps` | Cable Ties & Zip Ties – Metal Wire Tie | 200 | YES | £11.69 | No | 100-pack, releasable nylon, UV-resistant. Shopify API confirms ~5362, 0 inventory |
| 3 | `multi-shade-2m-pendant-light` | Multi-Shade 2m Pendant Light - Industrial Vintage Style | 200 | YES | £83.59 | No | 5-way spider lamp, 200cm cable, E27, max 60W |
| 4 | `g4-cob-chip-2w-220v-240v-led-light-replace-halogen-bulb-5035` | G4 Led Bulb | 200 | YES | £2.59 | No | G4 COB 2W, 220V-240V, halogen replacement, "Notify me when in stock" present |
| 5 | `vintage-industrial-loft-style-metal-ceiling-light-modern-orange-dome-pendant-lampshade` | Flush Mount Lamp for Hallway & Entryway Lighting | 200 | YES | £16.10 | No | **URL/title mismatch** — URL implies orange dome pendant but page shows flush mount ceiling light |
| 6 | `led-decorative-outdoor-wall-light-up-down-lights` | Up & Down Outdoor Wall Lights | 200 | YES | £20.39 | No | 8W, 22×8×4.5cm, aluminium, white, warm white, 2-year warranty |
| 7 | `3w-e27-light-bulb-energy-saving-lamp-warm-white-globe` | LED Bulb E27 3W Warm white light | 200 | YES | £0.45 | No | E27, 3W, 2700K, globe, non-dimmable, "Only 0 left in stock!" |
| 8 | `12v-ir-remote-controller` | RGB LED Strip Controller \| 12V IR Remote, 24/44 Keys ~5451 | 200 | YES | £4.99/£5.99 | No | 24-key and 44-key variants, 12V, Shopify API confirms 0 inventory |
| 9 | `green-retro-metal-pendant-lampshade-ceiling-light-shade-easy-fit` | Green Retro Metal Pendant Lampshade Ceiling Light Shade Easy Fit | 200 | YES | £15.89 | No | Metal, green, industrial style, easy fit, reducer plate included |
| 10 | `turkish-moroccan-style-table-lamp-mosaic-glass-bedside-desk-table-lamp` | Handmade Turkish Mosaic Table Lamp – Colourful Glass | 200 | YES | £46.79 | No | Mosaic glass, E27, antique brass base, 29×13cm, handmade. Shopify API handle ~4968, 0 inventory |
| 11 | `240v-to-12v-power-supply-universal-adapter` | 240V to 12V Power Supply Universal Adapter | 200 | YES | £5.35–£13.89 | No | AC 100-240V to DC 12V, 1A-10A variants, 5.5mm barrel jack, CE/ROHS |

---

## Key Finding — Product #5 URL/Title Mismatch

The URL `vintage-industrial-loft-style-metal-ceiling-light-modern-orange-dome-pendant-lampshade` strongly implies an orange dome pendant lampshade. However the current page title is "Flush Mount Lamp for Hallway & Entryway Lighting." This suggests either:
- The product was changed and the URL was reused for a different product
- Or the URL was always misleading

This creates redirect ambiguity. See `GA-09_Manual_Review.md` for resolution options.
