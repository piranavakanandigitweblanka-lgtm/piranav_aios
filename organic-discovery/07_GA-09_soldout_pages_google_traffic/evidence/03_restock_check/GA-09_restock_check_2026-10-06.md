# GA-09 — Restock Check

**Date:** 2026-10-06  
**Method:** Shopify Admin API stock query + live page "Notify me when in stock" indicator  

---

## Summary

No confirmed restock dates found for any of the 11 sold-out products.  
No purchasing data available through AIOS sources.

---

## Product-by-Product

| # | Product | Restock Indicator on Page | API Inventory | Restock Date |
|---|---|---|---|---|
| 1 | 12W LED Tilt Downlight | Not visible | 0 | No confirmed date |
| 2 | Zip Ties Releasable | Not visible | 0 | No confirmed date |
| 3 | Multi-Shade Spider Pendant | Not visible | 0 | No confirmed date |
| 4 | G4 COB LED Bulb | "Notify me when in stock" present | 0 | No confirmed date |
| 5 | Orange Dome Pendant | Not visible | 0 | No confirmed date |
| 6 | LED Outdoor Wall Light Up/Down | Not visible | 0 | No confirmed date |
| 7 | 3W E27 Warm White | "Only 0 left in stock!" message | 0 | No confirmed date |
| 8 | 12V IR Remote Controller | "Notify me when in stock" present | 0 | No confirmed date |
| 9 | Green Retro Lampshade | Not visible | 0 | No confirmed date |
| 10 | Turkish Moroccan Table Lamp | "Notify me when in stock" present | 0 | No confirmed date |
| 11 | 240V to 12V Power Supply | Not visible | 0 | No confirmed date |

---

## Note

Products #4, #8, and #10 have "Notify me when in stock" widgets active, suggesting LEDSone has not internally confirmed these as discontinued — they may be expected to restock. Piranav should check with Purchasing before applying redirects to these, especially:

- **#8** (12V IR Remote): "Notify me" widget is live — could be restocking. If restock confirmed, do NOT redirect; add restock date to page instead.
- **#4** (G4 COB): Same consideration.
- **#10** (Turkish Table Lamp): Has the "Notify me" widget — but a close replacement exists. Redirect is still recommended as the mosaic table lamp ~5010 serves the same intent.
