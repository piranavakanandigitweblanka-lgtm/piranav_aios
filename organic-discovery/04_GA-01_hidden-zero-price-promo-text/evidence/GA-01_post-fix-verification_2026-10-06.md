# GA-01 — Post-Fix Verification — 15 Products
**Date:** 2026-10-06
**Status:** TYPE A CODE FIX — PASS 3/3
**Fix verified:** `snippets/price.liquid` — `{%- if compare_at_price > 0 -%}` guard
**Source:** Live ledsone.co.uk page source via WebFetch (fresh fetch, post-theme-push)
**Baseline reference:** `GA-01_sale-price-zero-baseline_2026-10-06.md`
**Tester:** Claude Code (automated page-source inspection)

---

## 15-Product Post-Fix Verification Table

| # | Product | URL | Before (Baseline) | After (Post-Fix) | Own price.liquid false £0.00 gone? | Issue Type |
|---|---|---|---|---|---|---|
| 1 | Ceiling Rose Pendant | /products/ceiling-rose-pendant-light-lamp-fitting | "Sale price" in DOM, £0.00 in struck-through span | **Regular price £8.49 GBP only. "Sale price" absent.** | **YES — FIXED ✓** | A |
| 2 | Threaded Lamp Holder | /products/threaded-lamp-bulb-holder-vintage | "Sale price" in DOM, £0.00 in struck-through span | **Regular price £9.89 GBP only. "Sale price" absent.** | **YES — FIXED ✓** | A |
| 3 | IP67 120W LED Driver | /products/dc12v-ip67-120w-10a-waterproof-led-driver-power-supply-transformer | No £0.00 (Type D — compare set, wrong) | Sale price £21.29 / Regular £17.03. No £0.00. | N/A — not Type A | D |
| 4 | 3-Core Twisted Peach Cable | /products/3-core-twisted-peach-vintage-electric-fabric-cable-flex-0-75mm | No £0.00 (Type D) | Sale price £2.99 / Regular £2.39. No £0.00. | N/A — not Type A | D |
| 5 | G95 Antique E27 Globe Bulb | /products/vintage-g95-antique-e27-60w-globe-retro-industrial-bulb | "Sale price £0.00" on main product (Type C data issue) | Regular price £7.89 only shown. No £0.00. | N/A — was Type C. Price now corrected in admin. | C→resolved |
| 6 | Black Metal Kitchen Pendant | /products/metal-kitchen-pendant-light | No £0.00 (Type D) | Sale price £14.49 / Regular £10.15. No £0.00. | N/A — not Type A | D |
| 7 | 4W A60 E27 Vintage LED Bulb | /products/vintage-led-a60-e27-4w-light-bulb | Type B — M20/wall light £0.00 in recommendations | Main product: Sale £1.88 / Regular £1.39. No £0.00 in main or recommendation cards this fetch. | N/A — not Type A. Recommendations clean this fetch. | B/D |
| 8 | Cone Pendant Lamp Shade | /products/horn-vintage-ceiling-pendant-lamp-shade | No £0.00 (Type D) | Sale price £28.61 / Regular £22.89. No £0.00. | N/A — not Type A | D |
| 9 | ST64 E27 Industrial Bulb | /products/vintage-st64-e27-60w-industrial-filament-bulb | Type B — M20/wall light £0.00 in recommendations | Main product: Sale £4.31 / Regular £3.79. No £0.00 in main or cards this fetch. | N/A — not Type A. Recommendations clean this fetch. | B/D |
| 10 | Industrial 12V 120W PSU | /products/industrial-universal-switching-power-supply-12v-120w-10a-aluminium | Type B — M20/wall light £0.00 in recommendations | Main product: Sale £14.27 / Regular £11.89. No £0.00 in main or cards this fetch. | N/A — not Type A. Recommendations clean this fetch. | B/D |
| 11 | 2-Core Round White Cable | /products/2-core-round-vintage-braided-fabric-white-coloured-cable-flex-0-75mm | "Sale price £0.00" on main product (Type C data issue) | **Regular price £2.59 GBP only. No £0.00.** | N/A — was Type C. Price now corrected in admin. | C→resolved |
| 12 | Hanging Lights for Kitchen | /products/hanging-lights-for-kitchen | No £0.00 (Type D) | Sale price £18.99 / Regular £15.19. No £0.00. | N/A — not Type A | D |
| 13 | Industrial Kitchen Lights Square | /products/kitchen-lights-black | No £0.00 (Type D) | Sale price £21.85 / Regular £17.48. No £0.00. | N/A — not Type A | D |
| 14 | Cafeteria Copper Hanging Light | /products/modern-copper-ceiling-light-pendant-lamp-shade | No £0.00 (Type D) | Sale price £21.76 / Regular £16.10. No £0.00. | N/A — not Type A | D |
| 15 | G80 Globe Filament Bulb | /products/vintage-g80-industrial-e27-60w-globe-filament-bulb | "Sale price" in DOM, £0.00 in struck-through span | **Regular price £4.99 GBP only. "Sale price" absent.** | **YES — FIXED ✓** | A |

---

## Summary

| Metric | Baseline | Post-Fix |
|---|---|---|
| Total tested | 15 | 15 |
| Type A — false "Sale price £0.00" from own price.liquid | **3/15** (#1, #2, #15) | **0/15** |
| Type B — £0.00 in third-party app recommendation cards | 3 pages affected | 0 this fetch (MRP app — varies by page load) |
| Type C — actual selling price = £0.00 in admin | 2 products (#5, #11) | 0 — both now show correct prices (admin corrected) |
| Type D — wrong compare_at_price (lower than current) | 9/15 | 9/15 — unchanged (separate data task) |

---

## Type A — Code Fix Result

**PASS. 3/3 Type A products fixed.**

| # | Product | Before | After |
|---|---|---|---|
| 1 | Ceiling Rose £8.49 | "Sale price £0.00" in DOM | **"Sale price" absent — Regular price £8.49 only** |
| 2 | Lamp Holder £9.89 | "Sale price £0.00" in DOM | **"Sale price" absent — Regular price £9.89 only** |
| 15 | G80 Bulb £4.99 | "Sale price £0.00" in DOM | **"Sale price" absent — Regular price £4.99 only** |

The `{%- if compare_at_price > 0 -%}` guard is working. When no compare_at_price is set, the entire sale-price block is now skipped — "Sale price" label and struck-through £0.00 do not appear in page source.

---

## Type B — Third-Party App Recommendation Cards

In this verification fetch, no "Sale price £0.00" was detected in recommendation cards on any of the 15 pages. Previously (#7, #9, #10), the MRP app cards for M20 Ceiling Rose and Industrial Wall Light were showing £0.00. This may have cleared due to admin price correction for those products, or variability in app rendering. **The third-party app (`related-products-app.liquid`) remains outside the scope of the price.liquid fix.**

---

## Type C — Admin Data Issues

Both Type C products from the baseline now show correct prices:
- **#5 G95 Bulb** — now showing regular prices (£7.89 / £9.89 by variant). Was showing "Sale price £0.00" at baseline. Corrected in Shopify admin.
- **#11 White Cable** — now showing "Regular price £2.59 GBP". Was showing "Sale price £0.00" at baseline. Corrected in Shopify admin.

---

## Type D — Wrong Compare Price (Separate Task)

9/15 products still show compare_at_price set lower than current price (e.g. "Regular £10.15 / Sale £14.49"). This is a data audit issue — not in scope for GA-01 code fix. No £0.00 involved. Requires a separate admin review.

---

## GA-01 Code Fix — Verification Conclusion

The `price.liquid` fix is **verified live**. The Type A false "Sale price £0.00" issue is resolved. No further code changes needed for this issue.

**GA-01 is NOT marked complete** — Type D data audit (wrong compare prices) remains as a separate pending task.
