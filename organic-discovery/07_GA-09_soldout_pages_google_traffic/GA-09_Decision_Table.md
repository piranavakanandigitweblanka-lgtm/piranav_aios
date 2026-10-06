# GA-09 — Decision Table

**Date:** 2026-10-06  
**Data source:** Shopify Admin API (read-only) + live page verification  
**Stock figures:** Verified via Shopify API on 2026-10-06  

---

## Decision Summary

| # | Sold-Out Product | Replacement Product | Replacement URL | Stock | Confidence | Decision |
|---|---|---|---|---|---|---|
| 1 | 12W LED Adjustable Tilt Downlight | Modern Ultra Slim Recessed LED Tilt Angle ~5581 | `/products/modern-ultra-slim-recessed-led-tilt-angle-ceiling-spot-light-5581` | 289 units (12W: 25, 3W: 264) | HIGH | 301 Redirect |
| 2 | Zip Ties Releasable Heavy Duty Reusable | 100 Pack Reusable Cable Ties Black/White ~6210 | `/products/100-pack-reusable-cable-ties-black-white-nylon-zip-ties` | 2,884 units | HIGH | 301 Redirect |
| 3 | Multi-Shade 2m Pendant Light (5-way spider) | Industrial Spider Adjustable 5-Light E27 ~3399 | `/products/5-way-spider-ceiling-pendant-lamp-metal-curvy-shade` | 2,018 units | HIGH | 301 Redirect |
| 4 | G4 COB 2W LED Bulb (halogen replace) | G4 Cool White 3W/5W Corn Lamp AC 220V ~5037 | `/products/g4-straight-pin-corn-lamp-220v-3w-5w-ceramic-led-bulb-5037` | 2,187 units | MEDIUM | 301 Redirect |
| 5 | Orange Dome Pendant Lampshade (URL/title mismatch) | — | — | — | — | **Manual Review** |
| 6 | LED Outdoor Wall Light Up/Down | Modern 12W LED Outdoor Wall Light IP54 Up Down ~4964 | `/products/led-outdoor-wall-light` | 94 units | HIGH | 301 Redirect |
| 7 | 3W E27 Warm White Globe Bulb | LED E27 A60 18W Warm White 2700K ~1379 | `/products/18w-e27-light-bulb-energy-saving-lamp-warm-white-globe` | 1,334 units | HIGH | 301 Redirect |
| 8 | 12V IR Remote Controller (RGB LED strip) | — | — | 0 units | — | **No Safe Redirect** |
| 9 | Green Retro Metal Pendant Lampshade Easy Fit | Black Metal Retro Ceiling Pendant Shade Easy Fit ~2089 | `/products/black-metal-retro-ceiling-pendant-light-shade-easy-fit-vintage-lampshade` | 2,208 units | HIGH | 301 Redirect |
| 10 | Turkish Moroccan Mosaic Glass Table Lamp | Mosaic Glass Bedside Table Lamp Wooden Base E27 ~5010 | `/products/unique-plug-in-bed-lamp` | 134 units | HIGH | 301 Redirect |
| 11 | 240V to 12V Power Supply Universal Adapter | 12V LED Driver Constant Voltage IP44 AC to DC ~4482 | `/products/led-driver-ac-240v-to-dc-12v-constant-voltage-power-supply-adapter` | 283 units | MEDIUM | 301 Redirect |

---

## Detailed Reasoning

### #1 — 12W LED Tilt Downlight → ~5581 | HIGH

**Source:** 12W, 550 lumens, cool white 6000K, 120° beam, adjustable tilt, aluminium/acrylic, £7.82  
**Replacement:** Same specs — 12W option (25 units), 550 lumens, 6000K, 120° beam, adjustable tilt, aluminium/acrylic, £8.29  
**Validation:** Exact category match. 12W variant confirmed in stock via API. Price difference: £0.47.  
**Intent match:** Customer searching for adjustable tilt recessed downlight → lands on identical product at near-identical price. ✓

---

### #2 — Zip Ties Releasable Heavy Duty → ~6210 | HIGH

**Source:** Releasable heavy-duty reusable nylon cable ties, 100-piece pack, UV-resistant, £11.69  
**Replacement:** 100 Pack Reusable Cable Ties Black/White, nylon, 2,884 units in stock  
**Validation:** Same product category (reusable cable ties), same pack size (100), same material (nylon), explicitly reusable.  
**Intent match:** Customer searching for reusable cable ties → lands on similar product in same range. ✓

---

### #3 — Multi-Shade 2m Pendant (5-way spider) → ~3399 | HIGH

**Source:** 5-way spider pendant lamp, 200cm adjustable cables, E27, max 60W per socket, £83.59  
**Replacement:** Industrial Spider Adjustable Multi Arm 5-Light E27 ~3399, 2,018 units, £67.89–£79.89  
**Validation:** Same arm count (5), same base (E27), adjustable cables, industrial style. Slightly cheaper.  
**Intent match:** Customer searching for multi-arm spider pendant light → lands on 5-arm E27 spider pendant. ✓

---

### #4 — G4 COB 2W LED Bulb → ~5037 | MEDIUM

**Source:** G4 COB chip 2W, 220V–240V, LED halogen replacement, ~£2.59  
**Replacement:** G4 Cool White 3W/5W straight pin corn lamp, AC 220V, from £3.83 (1 unit), 2,187 units  
**Concerns:** Different form factor (corn vs COB), slightly higher wattage (3W vs 2W), cool white only (original colour temp unconfirmed), price 1.5× higher for single unit.  
**Validation:** G4 base ✓, AC 220V ✓, LED halogen replacement ✓. Form factor different but interchangeable in most G4 fittings.  
**Intent match:** Customer replacing G4 halogen with LED → replacement satisfies this. MEDIUM due to form factor difference.

---

### #5 — Orange Dome Pendant Lampshade → MANUAL REVIEW

**Issue:** URL handle = `vintage-industrial-loft-style-metal-ceiling-light-modern-orange-dome-pendant-lampshade` but current page title = "Flush Mount Lamp for Hallway & Entryway Lighting". URL and page content do not match.  
**Google traffic intent:** Likely indexed for "orange dome pendant lampshade" / "industrial dome ceiling light" — NOT "flush mount lamp".  
**Stock search:** No orange dome pendant currently in stock (API search confirmed). Closest dome shapes in stock: `hanging-kitchen-light` (177 units), `luxury-lamp-shades` (104 units), `yellow-chandelier-lampshade-ceiling-light-shade-pendant-lights-fixture` (77 units).  
**Why not redirected:** The URL/title mismatch means the customer intent is unclear. Redirecting to a non-orange dome risks intent mismatch. Piranav must decide based on what Google actually indexed for this page.  
**See:** `GA-09_Manual_Review.md` for options.

---

### #6 — LED Outdoor Wall Light Up/Down → ~4964 | HIGH

**Source:** LED outdoor wall light, up/down illumination, 8W, aluminium, white/warm white, 2-year warranty, £20.39  
**Replacement:** Modern 12W LED Outdoor Wall Light, IP54, up/down, aluminium, 94 units, £16.19 (single)  
**Validation:** Same function (outdoor, up/down), similar material, IP54 rated (better than source), slightly more power (12W vs 8W). Price similar (£16.19 vs £20.39).  
**Intent match:** Customer searching for outdoor up/down LED wall light → lands on equivalent product. ✓

---

### #7 — 3W E27 Warm White Globe → ~1379 | HIGH

**Source:** 3W, E27 screw, warm white 2700K, globe shape, non-dimmable, £0.45  
**Replacement:** LED E27 A60 18W Warm White 2700K, non-dimmable, 1 pack £1.35, 1,334 units  
**Note:** Handle pattern of replacement (`18w-e27-light-bulb-energy-saving-lamp-warm-white-globe`) is near-identical to source (`3w-e27-light-bulb-energy-saving-lamp-warm-white-globe`), strongly indicating same product line successor.  
**Validation:** E27 base ✓, warm white 2700K ✓, globe shape ✓, non-dimmable ✓, energy saving ✓. Wattage higher (18W vs 3W) but intent (warm white E27 bulb) is fully satisfied.  
**Intent match:** Customer searching for E27 warm white bulb → lands on exact product line successor. ✓

---

### #8 — 12V IR Remote Controller → NO SAFE REDIRECT

**Source:** RGB LED strip IR remote controller, 24-key and 44-key variants, 12V, £4.99–£5.99  
**API search result:** No in-stock IR/RF remote controllers for LED strips found in entire catalogue. All RGB controller products: 0 inventory. Closest in-stock results (crystal chandelier remote, ceiling fan remote) are completely different product intent.  
**Decision:** No safe redirect. Sending traffic to an unrelated product would harm user experience.  
**See:** `GA-09_Manual_Review.md` for options.

---

### #9 — Green Retro Metal Pendant Lampshade → ~2089 | HIGH

**Source:** Green metal retro lampshade, industrial style, easy fit, reducer plate, £15.89  
**Replacement:** Black Metal Retro Ceiling Pendant Shade Easy Fit ~2089, 2,208 units, from £10.35–£14.99  
**Validation:** Same category (metal retro easy fit lampshade), same fitting style, same price range. Only difference: colour (black vs green). The easy-fit mechanism and industrial/retro style are identical.  
**Note:** Check if a green variant exists — `modern-green-colour-metal-easy-fit-lampshade` handle was found in earlier search suggesting a green lampshade product may exist. Recommend Piranav check this handle before import.  
**Intent match:** Customer searching for retro metal easy-fit lampshade → lands on same category. ✓

---

### #10 — Turkish Moroccan Mosaic Table Lamp → ~5010 | HIGH

**Source:** Handmade Turkish mosaic glass table lamp, bedside/desk, E27, antique brass base, £46.79  
**Replacement:** Mosaic Glass Bedside Table Lamp Wooden Base E27 Plug-In ~5010, 134 units  
**Validation:** Same style (mosaic glass), same use (bedside table lamp), same base (E27), plug-in. Wooden base vs antique brass — different material but same aesthetic category.  
**Intent match:** Customer searching for mosaic glass bedside table lamp → lands on equivalent product. ✓

---

### #11 — 240V to 12V Power Supply Adapter → ~4482 | MEDIUM

**Source:** AC 100–240V to DC 12V plug-in adapter, 1A–10A variants, 5.5mm barrel jack connector, CE/ROHS, £5.35–£13.89  
**Replacement:** 12V LED Driver Constant Voltage IP44 AC to DC ~4482, 283 units, 7W–60W variants  
**Concerns:** Original was a plug-in wall adapter with 5.5mm barrel jack (consumer-style). Replacement is a hardwired LED driver with terminal block connections (professional-style). Form factor is different.  
**Validation:** 12V output ✓, AC mains input ✓, CE certified ✓, used for LED strips ✓. Form factor different but core use (power 12V LED strips) is the same.  
**Intent match:** Customer searching for 12V power adapter for LED strips → replacement satisfies the LED strip powering need. MEDIUM due to connector/form factor difference.

---

## Google Traffic Priority

**Status: Needs GSC check**

Unable to determine top 3 by Google traffic — SEMrush API units exhausted, GSC not queried from AIOS. Piranav must check Search Console for clicks/impressions per URL to prioritise implementation order.

Suggested GSC filter: Last 28 days, Page = each of the 11 URLs, sort by Clicks descending.
