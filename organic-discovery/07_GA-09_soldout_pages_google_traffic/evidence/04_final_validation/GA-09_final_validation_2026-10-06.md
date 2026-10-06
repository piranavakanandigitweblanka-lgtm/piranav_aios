# GA-09 — Final Redirect Validation

**Date:** 2026-10-06  
**Prepared by:** Claude Code (sinrasu mode)  
**Validated via:** Shopify Admin API (read-only, 2026-10-06)  

---

## Validation Checklist — All 9 CSV Redirects

| # | From | To | Destination Live | In Stock | Relevant | Not Another GA-09 Sold-Out | Confidence |
|---|---|---|---|---|---|---|---|
| 1 | `/products/12w-modern-led-...downlight...` | `/products/modern-ultra-slim-recessed-led-tilt-angle-ceiling-spot-light-5581` | ✓ ACTIVE | ✓ 289 units | ✓ Same category/specs | ✓ | HIGH |
| 2 | `/products/zip-ties-releasable-...` | `/products/100-pack-reusable-cable-ties-black-white-nylon-zip-ties` | ✓ ACTIVE | ✓ 2,884 units | ✓ Same category | ✓ | HIGH |
| 3 | `/products/multi-shade-2m-pendant-light` | `/products/5-way-spider-ceiling-pendant-lamp-metal-curvy-shade` | ✓ ACTIVE | ✓ 2,018 units | ✓ 5-arm E27 spider | ✓ | HIGH |
| 4 | `/products/g4-cob-chip-2w-...` | `/products/g4-straight-pin-corn-lamp-220v-3w-5w-ceramic-led-bulb-5037` | ✓ ACTIVE | ✓ 2,187 units | ✓ G4 LED halogen replace | ✓ | MEDIUM |
| 5 | `/products/vintage-industrial-loft-style-metal-ceiling-light-modern-orange-dome-pendant-lampshade` | `/products/orange-metal-cylinder-dome-light-shade-lamp-shade-ceiling-light` | ✓ ACTIVE | ✓ 116 units | ✓ Orange dome shape exact match | ✓ | HIGH |
| 6 | `/products/led-decorative-outdoor-wall-light-up-down-lights` | `/products/led-outdoor-wall-light` | ✓ ACTIVE | ✓ 94 units | ✓ Outdoor up/down LED wall | ✓ | HIGH |
| 7 | `/products/3w-e27-light-bulb-energy-saving-lamp-warm-white-globe` | `/products/18w-e27-light-bulb-energy-saving-lamp-warm-white-globe` | ✓ ACTIVE | ✓ 1,334 units | ✓ E27 warm white 2700K | ✓ | HIGH |
| 9 | `/products/green-retro-metal-pendant-lampshade-...` | `/products/black-metal-retro-ceiling-pendant-light-shade-easy-fit-vintage-lampshade` | ✓ ACTIVE | ✓ 2,208 units | ✓ Metal retro easy fit | ✓ | HIGH |
| 10 | `/products/turkish-moroccan-style-table-lamp-...` | `/products/unique-plug-in-bed-lamp` | ✓ ACTIVE | ✓ 134 units | ✓ Mosaic glass table lamp | ✓ | HIGH |
| 11 | `/products/240v-to-12v-power-supply-universal-adapter` | `/products/led-driver-ac-240v-to-dc-12v-constant-voltage-power-supply-adapter` | ✓ ACTIVE | ✓ 283 units | ✓ 12V LED driver | ✓ | MEDIUM |

---

## Excluded Products

| # | Product | Reason Excluded |
|---|---|---|
| 8 | 12V IR remote controller | No in-stock replacement found across entire catalogue (confirmed by two search passes). |

---

## Post-Import Verification Required

After Piranav imports the CSV into Shopify, verify each redirect:

```
curl -I https://ledsone.co.uk/products/12w-modern-led-adjustable-tilt-angle-downlight-recessed-round-ceiling-spotlights
# Expected: HTTP/1.1 301 Moved Permanently
# Location: https://ledsone.co.uk/products/modern-ultra-slim-recessed-led-tilt-angle-ceiling-spot-light-5581
```

Repeat for all 9 redirects. Confirm:
- HTTP 301 returned (not 302)
- Destination URL is correct
- Destination page loads successfully
- Product is in stock on destination page

---

## Notes for Piranav

1. **#9 Green Lampshade**: Before importing, check if handle `modern-green-colour-metal-easy-fit-lampshade` has a green variant in stock. If yes, consider using it instead of the black retro lampshade for a better colour match.
2. **#4 G4 Bulb** and **#8 IR Remote**: Both have "Notify me when in stock" — check with Purchasing if restock is expected before redirecting.
3. **#11 Power Supply**: Form factor difference noted (hardwired driver vs plug-in adapter). If this causes customer complaints post-redirect, revisit.
