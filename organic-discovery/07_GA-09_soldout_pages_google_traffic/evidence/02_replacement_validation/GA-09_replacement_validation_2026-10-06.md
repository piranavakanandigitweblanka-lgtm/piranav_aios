# GA-09 — Replacement Product Validation

**Date:** 2026-10-06  
**Data source:** Shopify Admin API — ledsone.myshopify.com (read-only)  
**API call:** GraphQL productByHandle + product search queries  

---

## Validated Replacements

### #1 — 12W Tilt Downlight

| Field | Value |
|---|---|
| Replacement title | Modern Ultra Slim Recessed LED Tilt Angle Ceiling Down Lights ~5581 |
| Handle | `modern-ultra-slim-recessed-led-tilt-angle-ceiling-spot-light-5581` |
| Shopify status | ACTIVE |
| Total inventory | 289 |
| 12W variant stock | 25 units |
| 3W variant stock | 264 units |
| Price (12W) | £8.29 |
| Relevance | Exact category — same tilt angle, same wattage, same specs |

---

### #2 — Zip Ties Releasable

| Field | Value |
|---|---|
| Replacement title | 100 Pack Reusable Cable Ties Black \| White Nylon Zip Ties ~6210 |
| Handle | `100-pack-reusable-cable-ties-black-white-nylon-zip-ties` |
| Shopify status | ACTIVE |
| Total inventory | 2,884 |
| Price | Not queried individually (in-stock confirmed) |
| Relevance | Same category — 100 pack, nylon, reusable |

---

### #3 — Multi-Shade 5-Way Spider Pendant

| Field | Value |
|---|---|
| Replacement title | Industrial Spider Adjustable Multi Arm Pendant Light 5-Light E27~3399 |
| Handle | `5-way-spider-ceiling-pendant-lamp-metal-curvy-shade` |
| Shopify status | ACTIVE |
| Total inventory | 2,018 |
| Red/No variant | 217 units @ £67.89 |
| Red/Yes variant | 217 units @ £79.89 |
| Black/No variant | 258 units @ £67.89 |
| Relevance | 5-arm, E27, adjustable, industrial spider pendant |

---

### #4 — G4 COB LED Bulb (MEDIUM)

| Field | Value |
|---|---|
| Replacement title | G4 Cool White 28D 3W/51D 5W straight pin corn Lamp AC 220V ~5037 |
| Handle | `g4-straight-pin-corn-lamp-220v-3w-5w-ceramic-led-bulb-5037` |
| Shopify status | ACTIVE |
| Total inventory | 2,187 |
| 3W/1 unit price | £3.83 (524 units) |
| 3W/Two pack | £3.88 (262 units) |
| Concern | Different form factor (corn vs COB chip), cool white only |

---

### #6 — Outdoor Up/Down Wall Light

| Field | Value |
|---|---|
| Replacement title | Modern 12W LED Outdoor Wall Light \| Black IP54 Up Down Garden & Patio Sconce ~4964 |
| Handle | `led-outdoor-wall-light` |
| Shopify status | ACTIVE |
| Total inventory | 94 |
| Single unit stock | 63 units @ £16.19 |
| Twin pack stock | 31 units @ £29.99 |
| Relevance | Outdoor, LED, up/down, IP54, aluminium |

---

### #7 — E27 3W Warm White Globe

| Field | Value |
|---|---|
| Replacement title | LED E27 A60 18W Warm White 2700K Non-Dimmable Bulb(Energy Saving)~1379 |
| Handle | `18w-e27-light-bulb-energy-saving-lamp-warm-white-globe` |
| Shopify status | ACTIVE |
| Total inventory | 1,334 |
| 1-pack price | £1.35 (581 units) |
| 2-pack price | £2.25 (290 units) |
| Handle similarity | Handle pattern identical except wattage (3w→18w) — same product line |

---

### #9 — Green Retro Easy Fit Lampshade

| Field | Value |
|---|---|
| Replacement title | Black Metal Retro Ceiling Pendant Light Shade Easy Fit Lampshade ~2089 |
| Handle | `black-metal-retro-ceiling-pendant-light-shade-easy-fit-vintage-lampshade` |
| Shopify status | ACTIVE |
| Total inventory | 2,208 |
| Black variant | 1,136 units @ £14.99 |
| Black Inner White | 795 units @ £10.35 |
| Black Inner Gold | 277 units @ £14.29 |
| Concern | Black not green — colour different. Check handle `modern-green-colour-metal-easy-fit-lampshade` for green variant |

---

### #10 — Turkish Moroccan Mosaic Table Lamp

| Field | Value |
|---|---|
| Replacement title | Mosaic Glass Bedside Table Lamp Wooden Base E27 Plug-In~5010 |
| Handle | `unique-plug-in-bed-lamp` |
| Shopify status | ACTIVE |
| Total inventory | 134 |
| Relevance | Mosaic glass, bedside table lamp, E27 — same style and use case |
| Note | Wooden base vs antique brass — different base material |

---

### #11 — 240V to 12V Power Supply (MEDIUM)

| Field | Value |
|---|---|
| Replacement title | 12V LED Driver Constant Voltage Power Supply IP44 AC to DC~4482 |
| Handle | `led-driver-ac-240v-to-dc-12v-constant-voltage-power-supply-adapter` |
| Shopify status | ACTIVE |
| Total inventory | 283 |
| 7W variant | 43 units @ £3.99 |
| 35W variant | 113 units @ £7.11 |
| 60W variant | 127 units @ £11.99 |
| Concern | Hardwired terminal block driver vs original plug-in barrel jack adapter — different form factor |

---

## Products With No Safe Replacement

| # | Product | Reason |
|---|---|---|
| 5 | Orange dome pendant lampshade | URL/title mismatch — intent unclear; no orange dome in stock |
| 8 | 12V IR remote controller | 0 in-stock remote controllers found across entire catalogue |
