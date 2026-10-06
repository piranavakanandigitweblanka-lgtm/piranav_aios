# GA-01 — "Sale price 0.00" Baseline Test — 15 Products
**Date:** 2026-10-06
**Status:** BASELINE COMPLETE — Fix NOT yet applied
**Source:** Live ledsone.co.uk page source via WebFetch
**Tester:** Claude Code (automated page-source inspection)

---

## Objective

Select 15 active LEDSone UK products and confirm whether the hidden "Sale price 0.00" string appears in their page HTML. This establishes the pre-fix baseline for GA-01.

---

## Key Definitions (for this report)

| Term | Meaning |
|---|---|
| **Type A — DOM zero (no compare set)** | Product has no compare_at_price set in admin. price.liquid renders "Sale price" (visually-hidden label) + £0.00 (struck-through) in DOM. Not visible to sighted users but present in page source and read by screen readers. |
| **Type B — Recommendation zero** | Product itself is OK, but "Sale price £0.00" is visible in its page's "People Also Bought" recommendation cards (from OTHER products with no compare_at_price). |
| **Type C — Actual price £0.00** | The product's current selling price is literally £0.00 in Shopify admin. This is a data entry error — different root cause from Type A. |
| **Type D — Wrong compare price** | compare_at_price IS set but is LOWER than current price. Price used to be lower; compare was not updated when price increased. Struck-through price appears smaller than current price — misleading. |

---

## 15-Product Baseline Results

| # | Product Title | Handle | URL | Current Price | Compare-at Price | "Sale price 0.00" Found? | Issue Type |
|---|---|---|---|---|---|---|---|
| 1 | Ceiling Rose Pendant Light Lamp Fitting | ceiling-rose-pendant-light-lamp-fitting | /products/ceiling-rose-pendant-light-lamp-fitting | £8.49 | Not set (£0) | **YES** — "Sale price" in DOM, £0.00 in struck-through span (visually hidden); £0.00 visible in page's recommendation cards | A |
| 2 | Threaded Lamp Bulb Holder Vintage | threaded-lamp-bulb-holder-vintage | /products/threaded-lamp-bulb-holder-vintage | £9.89 | Not set (£0) | **YES** — same as #1 | A |
| 3 | IP67 DC12V 120W LED Driver Transformer | dc12v-ip67-120w-10a-waterproof-led-driver-power-supply-transformer | /products/dc12v-ip67-120w-10a-waterproof-led-driver-power-supply-transformer | £21.29 | £17.03 (WRONG — lower than current) | NO — £0.00 not found in price area | D |
| 4 | 3 Core Twisted Peach Vintage Cable 0.75mm | 3-core-twisted-peach-vintage-electric-fabric-cable-flex-0-75mm | /products/3-core-twisted-peach-vintage-electric-fabric-cable-flex-0-75mm | £2.99 | £2.39 (WRONG — lower than current) | NO | D |
| 5 | G95 Antique E27 60W Globe Retro Bulb | vintage-g95-antique-e27-60w-globe-retro-industrial-bulb | /products/vintage-g95-antique-e27-60w-globe-retro-industrial-bulb | **£0.00** | £7.89 | **YES** — "Sale price £0.00 GBP" visible directly on main product | C |
| 6 | Black Metal Kitchen Pendant Light | metal-kitchen-pendant-light | /products/metal-kitchen-pendant-light | £14.49 | £10.15 (WRONG — lower) | NO | D |
| 7 | 4W Dimmable A60 E27 LED Vintage Bulb | vintage-led-a60-e27-4w-light-bulb | /products/vintage-led-a60-e27-4w-light-bulb | £1.88 | £1.39 (WRONG — lower) | **YES** — "Sale price £0.00" visible in recommendation cards on this page | B |
| 8 | Cone Vintage Ceiling Pendant Lamp Shade | horn-vintage-ceiling-pendant-lamp-shade | /products/horn-vintage-ceiling-pendant-lamp-shade | £28.61 | £22.89 (WRONG — lower) | NO | D |
| 9 | ST64 E27 60W Industrial Filament Bulb | vintage-st64-e27-60w-industrial-filament-bulb | /products/vintage-st64-e27-60w-industrial-filament-bulb | £4.31 | £3.79 (WRONG — lower) | **YES** — "Sale price £0.00" visible in recommendation cards | B |
| 10 | Industrial 12V 120W Switching PSU | industrial-universal-switching-power-supply-12v-120w-10a-aluminium | /products/industrial-universal-switching-power-supply-12v-120w-10a-aluminium | £14.27 | £11.89 (WRONG — lower) | NO | D |
| 11 | 2 Core Round White Braided Cable 0.75mm | 2-core-round-vintage-braided-fabric-white-coloured-cable-flex-0-75mm | /products/2-core-round-vintage-braided-fabric-white-coloured-cable-flex-0-75mm | **£0.00** | £2.59 | **YES** — "Sale price £0.00 GBP" visible directly on main product | C |
| 12 | Hanging Lights for Kitchen | hanging-lights-for-kitchen | /products/hanging-lights-for-kitchen | £18.99 | £15.19 (WRONG — lower) | NO | D |
| 13 | Industrial Kitchen Lights Square Shape | kitchen-lights-black | /products/kitchen-lights-black | £21.85 | £17.48 (WRONG — lower) | NO | D |
| 14 | Cafeteria Copper Hanging Light Metal | modern-copper-ceiling-light-pendant-lamp-shade | /products/modern-copper-ceiling-light-pendant-lamp-shade | £21.76 | £16.10 (WRONG — lower) | NO | D |
| 15 | E27 G80 60W Globe Filament Bulb | vintage-g80-industrial-e27-60w-globe-filament-bulb | /products/vintage-g80-industrial-e27-60w-globe-filament-bulb | £4.99 | Not set (£0) | **YES** — "Sale price" in DOM (visually hidden), £0.00 in recommendation cards | A |

---

## Summary

| Metric | Count |
|---|---|
| Total tested | 15 |
| "Sale price 0.00" found (any form) | **8 / 15** |
| Not affected | 7 / 15 |

### Breakdown by issue type

| Type | Count | Description | Fix |
|---|---|---|---|
| **A — DOM zero (no compare_at_price)** | 3 (##1, 2, 15) | compare_at_price not set → price.liquid renders "Sale price" + £0.00 in DOM | **Code fix in price.liquid** |
| **B — Recommendation zero (other products)** | 2 (##7, 9) | Other products with no compare_at_price show £0.00 in recommendation cards | **Code fix in price.liquid** (fixes those OTHER products' cards) |
| **C — Actual price = £0.00** | 2 (##5, 11) | Current selling price literally set to £0 in Shopify admin | **Data fix in Shopify admin** |
| **D — Wrong compare price (compare < current)** | 9 (##3, 4, 6, 7, 8, 9, 10, 12, 13, 14) | compare_at_price set but lower than current price — misleading struck-through | **Data fix in Shopify admin** |

*Note: Types B and D can overlap (products #7, #9 are both B and D).*

---

## Consistently Appearing £0.00 Products in Recommendations

The following two products appeared as "Sale price £0.00 GBP" in the recommendation sections of **5 out of 15** pages tested. They are the most visible symptom of the Type A issue:

| Product | ~ID | Appears on pages |
|---|---|---|
| M20 Female Thread Ceiling Rose 100mm Conduit Pendant Kit | ~6817 | ##1, 2, 7, 9, 15 |
| Industrial Wall Light E27 G95 LED Elbow Arm Wall Sconce | ~6829 | ##1, 2, 7, 9, 15 |

These two products have no compare_at_price set. Once the price.liquid code fix is applied, their product cards will no longer output £0.00 anywhere.

---

## What the Code Fix Will and Will Not Solve

| Problem | Fixed by price.liquid code fix? |
|---|---|
| "Sale price £0.00" in DOM for products with no compare_at_price (Type A) | **YES** — guard condition removes the struck-through £0.00 entirely |
| "Sale price £0.00" visible in recommendation cards (Type B) | **YES** — same fix, applied to those products' cards |
| Actual current price = £0.00 (Type C) | **NO** — must be corrected in Shopify admin (set correct price) |
| Wrong compare_at_price lower than current price (Type D) | **NO** — must be corrected in Shopify admin (clear or update compare_at_price) |

---

## Type D Finding — Widespread Wrong Compare Price

**9 of 15 products tested have compare_at_price set LOWER than current price.** This is a systematic data issue. Examples:

| Product | Current | Compare (wrong) | Gap |
|---|---|---|---|
| IP67 120W Driver | £21.29 | £17.03 | +£4.26 |
| Kitchen Pendant Black | £14.49 | £10.15 | +£4.34 |
| Hanging Lights Kitchen | £18.99 | £15.19 | +£3.80 |
| Kitchen Lights Square | £21.85 | £17.48 | +£4.37 |
| Copper Pendant | £21.76 | £16.10 | +£5.66 |

Pattern: compare_at_price appears to be ~20-25% lower than current price across all affected products. This suggests compare_at_price was set at a previous (lower) price point and was not cleared/updated when prices were increased. These products show a struck-through lower price implying they used to be cheaper — which is the opposite of a genuine sale.

**This is a separate data audit task — not in scope for GA-01 code fix.**

---

## Next Steps

| Step | Action | Scope |
|---|---|---|
| GA-01 code fix | Apply `{%- if compare_at_price > 0 -%}` guard to price.liquid | Type A fix |
| Data fix — Type C | Set correct current price for G95 bulb and white cable in Shopify admin | 2 products minimum |
| Data audit — Type D | Review and clear/correct compare_at_price for all 9+ affected products | Separate task |
| Post-fix verification | Re-test same 15 URLs after price.liquid fix deployed | Confirm Type A/B resolved |

**GA-01 is NOT complete. Code fix pending.**
