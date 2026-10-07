# Evidence: GA-08 — Shopify UK Product ID Mapping for Verified <5W Bulbs

**Date:** 2026-10-07  
**Store:** LEDSone UK (sub_source = 104)  
**Task:** Confirm exact Shopify UK product IDs for all 33 verified sub-5W bulb products  
**Source:** Same PostgreSQL extraction that produced the verified 33-product result — cross-referenced by internal DB ID  
**Method:** Read-only query via `ledsone-db-mcp`. No Shopify data modified.

---

## About the Shopify Product ID

In the LEDSone DB schema, `shopify_listings.item_id` (varchar) is the Shopify product ID — the numeric ID used in Shopify admin URLs, the API, and bulk tag operations.

Format: `gid://shopify/Product/{item_id}` in GraphQL  
Format: plain integer in REST API and Shopify CSV imports

All 33 `item_id` values below are LEDSone UK only (sub_source = 104, confirmed).

---

## About SKUs

Parent listing records in the DB have `sku = NULL` and `parent_sku = NULL` for all 33 products. No child variant records were found in the DB for these products. **SKUs are not available from this data source.** The Shopify product ID (`item_id`) is the correct identifier for bulk tagging operations.

---

## About the CSV File

**File:** `sample_listing_id_file.csv` (copied from Downloads into this evidence folder 2026-10-07)  
**Contents:** One row — `Product ID: 8631889854714`

**Cross-reference result: NO MATCH**

- ID `8631889854714` is **not** one of the 33 verified sub-5W products
- ID `8631889854714` does **not** exist anywhere in the LEDSone DB (checked all sub_sources)
- This ID does not belong to LEDSone UK or any other LEDSone store in the system
- The CSV appears to contain a sample/test product ID, not a real LEDSone listing

**Conclusion:** The CSV does not affect or conflict with the 33-product extraction. All 33 verified Shopify IDs remain as listed below.

---

## Complete Shopify UK Product ID Table — All 33 Verified <5W Products

| # | Shopify Product ID | Internal DB ID | Title | Handle | Wattage | Base | Flags |
|---|---|---|---|---|---|---|---|
| 1 | **4417265467488** | 353633 | 2w Led Small Edison Screw Candle Bulb Dimmable ~3221 | vintage-c35-e14-2w-bent-tip-candle-led-flame-light-bulb | 2W | E14 | — |
| 2 | **6845727506593** | 350624 | Energy Saving 3W B22 Warm White LED Bulb-Long Lasting ~1366 | 3w-b22-light-bulb-energy-saving-lamp-warm-white-globe | 3W | B22 | — |
| 3 | **7977119580410** | 346665 | 3-Pack E27 Dimmable LED Vintage Filament Bulbs - 4W T45 Amber Glass ~4169 | 3-pack-4w-t45-e27-led-dimmable-vintage-filament-light-bulb | 4W | E27 | — |
| 4 | **4417265172576** | 347213 | 4W Dimmable A60 E27 LED Light Bulb Classic Vintage Style~3224 | vintage-led-a60-e27-4w-light-bulb | 4W | E27 | — |
| 5 | **4417265631328** | 350064 | 4W Dimmable E14 LED Candle Bulb Filament C35 vintage design ~3220 | vintage-c35-e14-4w-bent-tip-candle-led-flame-light-bulb | 4W | E14 | — |
| 6 | **7800387404026** | 350205 | 4W E27 G95 Vintage Edison Spiral LED Bulb \| Decorative Lighting~4061 | vintage-edison-led-light-g95-warm-white-bulb-4w | 4W | E27 | — |
| 7 | **4417275592800** | 347235 | 4W T45 B22 LED Dimmable Vintage Filament Light Bulb~3084 | 4w-t45-b22-led-dimmable-vintage-teardrop-spiral-filament-light-bulb | 4W | B22 | — |
| 8 | **14877941760386** | 769980 | 4W T45 E27 LED Dimmable Vintage Filament Light Bulb~5613 | 4w-t45-b22-led-dimmable-vintage-filament-light-bulb-5614 | 4W | ⚠️ SEE NOTE | Title=E27; product_type=Bulb_B22_Base B; handle=b22; has FILTB22-Base + E27 Base Bulb tags |
| 9 | **7977118728442** | 347760 | 6 Pack G95 Bulb E27 4W LED Globe Vintage LED Retro Light Bulbs~4167 | 6-pack-g95-e27-4w-led-globe-vintage-led-retro-light-bulbs | 4W | E27 | — |
| 10 | **4417276215392** | 353604 | B22 4W T45 LED Light Bulb Dimmable Vintage Filament Light Bulbs ~3077 | 4w-t45-b22-led-dimmable-vintage-teardrop-spiral-filament-light-bulb-1 | 4W | B22 | — |
| 11 | **7469126811898** | 353828 | E27 Bulb 4W Warm White Amber Glass Diamond LED Filament ~1043 | led-soft-light-dimond-e27-4w-filament-glass-retro-warm-white | 4W | E27 | — |
| 12 | **7800179753210** | 359117 | E27 LED Filament Bulb 4W Star Light Bulb Warm White ~4060 | led-light-star-4w-warm-white-bulb-filament-bulbs | 4W | E27 | — |
| 13 | **7692736659706** | 348133 | LED Bulbs Bayonet ST64 B22 4W Dimmable Filament Edison Light Bulbs ~3874 | st64-b22-4w-dimmable-retro-classic-filament-led-bulbs | 4W | B22 | — |
| 14 | **4417276248160** | 347233 | LED Vintage Bulb E27 T185 Tubular Filament 4W Screw Bulbs~3076 | 4w-t185-e27-led-non-dimmable-vintage-filament-light-bulb | 4W | E27 | — |
| 15 | **14877939368322** | 770025 | LEDSone LED T185 4W B22/E27 Tubular Filament Warm White Dimmable Bulbs~5612 | led-vintage-bulb-e27-t185-tubular-filament-4w-screw-dimmable-bulbs-5611 | 4W | B22/E27 | Genuine dual-base product — title explicitly states both |
| 16 | **7977119711482** | 344773 | T45 Edison LED Bulb 10-Pack - 4W Dimmable Tubular E27 - Warm White~4171 | 10-pack-4w-t45-e27-led-dimmable-vintage-filament-light-bulb | 4W | E27 | — |
| 17 | **7469126418682** | 349851 | Vintage Amber LED Filament Bulb 4W B22~1045 | vintage-amber-led-filament-bulb-4w-b22 | 4W | ⚠️ SEE NOTE | Title=B22; has both B22 and E27 base tags — flagged in GA-08 Step 1 for product team review |
| 18 | **4417276018784** | 347219 | Vintage Edison LED Filament Bulb G80 B22 4W Dimmable ~3078 | vintage-edison-led-filament-bulb-g80-b22-4w-dimmable | 4W | B22 | — |
| 19 | **6986409312417** | 347215 | Vintage G125 Globe LED Spiral Filament Bulb 4W E27~1199 | 4w-g125-e27-4w-dimmable-globe-vintage-led-retro-light-bulb | 4W | E27 | — |
| 20 | **7469127205114** | 350336 | Vintage G125 Love Filament Globe E27 LED Light Bulb~1042 | led-soft-light-g125-e27-love-4w-filament-glass-retro-warm-white | 4W | E27 | — |
| 21 | **7977118695674** | 346677 | Vintage G95 LED Filament Bulb E27 Amber Globe Dimmable 3 Pack~4166 | 3-pack-g95-e27-4w-led-globe-vintage-led-retro-light-bulbs | 4W | E27 | — |
| 22 | **7469126549754** | 353830 | Vintage Heart LED Filament Bulb - E27 Warm Amber Glow 4W ~1044 | led-soft-light-heart-e27-4w-filament-glass-retro-warm-white | 4W | E27 | — |
| 23 | **4417266483296** | 358250 | Vintage LED Bayonet Bulb ST64 4W/8W B22 Dimmable Squirrel Cage Light Bulb ~3209 | dimmable-retro-classic-filament-led-st64-b22-4w-bulbs | 4W | B22 | Title mentions "4W/8W" — DB confirms only WATT4W tag, no WATT8W. Included correctly. |
| 24 | **4417276444768** | 347231 | Vintage LED Bayonet T185 Bulb 4W B22 Dimmable Decorative Bulb~3075 | 4w-t185-b22-led-non-dimmable-vintage-filament-light-bulb | 4W | B22 | — |
| 25 | **4414316183648** | 350209 | Vintage LED Bulb E27 G80 Dimmable 4W Globe Light Warm White ~3377 | e27-4w-g80-dimmable-led-vintage-filament-classic-light-bulb | 4W | E27 | — |
| 26 | **7469127303418** | 347248 | Vintage LED E27 Bulb G125 4W Music Filament Screw Bulb Warm White~1041 | edison-led-soft-light-g125-e27-4w-music-filament-glass-retro-warm-white | 4W | E27 | — |
| 27 | **4417275330656** | 350901 | Vintage LED E27 G95 Filament Bulb 4W Globe Dimmable Light Bulb UK ~3087 | pack-g95-e27-4w-dimmable-globe-vintage-led-retro-light-bulbs | 4W | E27 | — |
| 28 | **14877951099266** | 770051 | Vintage LED Edison Bulb 4W E27 Decorative Bulb Non Dimmable ~5614 | 4w-decorative-led-edison-bulb-non-dimmable-vintage-design-5614 | 4W | E27 | — |
| 29 | **7977119645946** | 347741 | Vintage LED Filament Bulb T45 Screw 4W Dimmable E27 Light Bulb ~4170 | 6-pack-4w-t45-e27-led-dimmable-vintage-filament-light-bulb | 4W | E27 | — |
| 30 | **4417266417760** | 358970 | Vintage Light Bulb ST64 E27 4W Dimmable LED Filament Bulb~3210 | led-filament-vintage-bulb | 4W | E27 | — |
| 31 | **7465803088122** | 353795 | Vintage ST64 LED Filament Bulb E27 4W Amber Glass~1058 | st64-led-filament | 4W | E27 | — |
| 32 | **7469126320378** | 347217 | Vintage T45 Tube LED Bulb 4W E27 Warm White~1046 | vintage-t45-tube-led-bulb-4w-e27-warm-white | 4W | E27 | — |
| 33 | **4573903454304** | 360758 | Vintage style b22 bayonet filament bulb~2318 | vintage-decorative-industrial-retro-edison-bayonet-led-bulb-b22-base-light-bulb | 4W | B22 | — |

---

## Flags — Products Requiring Base Confirmation

### ⚠️ Product #8 — ID 14877941760386 (~5613)
- **Title:** "4W T45 **E27** LED Dimmable Vintage Filament Light Bulb~5613"
- **product_type:** Bulb_B22_Base B
- **Handle:** contains "b22"
- **Tags:** has `E27 Base Bulb`, `E27 LED Bulbs` AND `FILTB22-Base`
- **Assessment:** Title says E27, product_type and handle suggest B22. May be a dual-base product. Needs product team confirmation.
- **Impact on tagging:** Can still receive `Low Wattage Bulb` tag regardless of base — wattage is confirmed 4W. Base question is separate from this task.

### ⚠️ Product #17 — ID 7469126418682 (~1045)
- **Title:** "Vintage Amber LED Filament Bulb 4W **B22**~1045"
- **Tags:** has both `B22 Base Bulb` AND `E27 Base Bulb`
- **Assessment:** Already flagged in GA-08 Step 1 as a dual-base issue. Flagged in OD-A5 for review.
- **Impact on tagging:** Can still receive `Low Wattage Bulb` tag — wattage confirmed 4W. Base question is separate.

### Product #23 — ID 4417266483296 (~3209)
- **Title:** "Vintage LED Bayonet Bulb ST64 **4W/8W** B22..."
- **Tags:** Only WATT4W — no WATT8W tag present in DB
- **Assessment:** Title mentions 8W variant but no 8W tag exists. DB correctly includes this product as 4W only. Include in list.

---

## Wattage Cross-Check — Confirm No 5W Products

| Wattage | Count | 5W present? |
|---|---|---|
| WATT2W | 1 | NO |
| WATT3W | 1 | NO |
| WATT4W | 31 | NO |
| WATT5W | 0 | CONFIRMED EXCLUDED |
| **Total** | **33** | ✓ |

All 33 products were extracted using `has_high_watt_tag = FALSE` which explicitly excludes WATT5W through WATT60W. Any product with a WATT5W (or higher) tag — even if it also has a WATT4W tag — was excluded from the 33.

---

## Validation Summary

| Check | Result |
|---|---|
| Expected products | 33 |
| Found in DB | **33** |
| 2W products | 1 |
| 3W products | 1 |
| 4W products | 31 |
| Duplicates | 0 |
| Missing Shopify IDs | 0 — all 33 have confirmed item_id values |
| Products with uncertain Shopify mapping | 0 — all are directly from shopify_listings.item_id (sub_source=104) |
| 5W products included | 0 — CONFIRMED EXCLUDED |
| Non-bulb products included | 0 — product_type filter applied |
| Products from other LEDSone stores | 0 — sub_source=104 filter applied throughout |
| SKUs available | 0 — parent listings have NULL sku; child variant records not present in DB |
| CSV cross-reference | NOT POSSIBLE — `sample_listing_id_file (1).csv` not found in AIOS directory |

---

## No Shopify Changes Made

This document records a read-only extraction. Zero product tags, collection rules, or Shopify data were modified.

---

## Plain ID List (for bulk operations)

```
4417265467488
6845727506593
7977119580410
4417265172576
4417265631328
7800387404026
4417275592800
14877941760386
7977118728442
4417276215392
7469126811898
7800179753210
7692736659706
4417276248160
14877939368322
7977119711482
7469126418682
4417276018784
6986409312417
7469127205114
7977118695674
7469126549754
4417266483296
4417276444768
4414316183648
7469127303418
4417275330656
14877951099266
7977119645946
4417266417760
7465803088122
7469126320378
4573903454304
```
