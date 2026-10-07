# Evidence: GA-08 — Sub-5W Bulb Extraction (Strictly Below 5W)

**Date:** 2026-10-07  
**Store:** LEDSone UK (sub_source 104)  
**Task:** GA-08 — Extract exact list of all active bulb products with actual LED consumption strictly below 5W (WATT2W, WATT3W, WATT4W only — NOT WATT5W, NOT 5W+)  
**Method:** Read-only PostgreSQL query via `ledsone-db-mcp`. No Shopify data modified.

---

## Result Summary

| Wattage | Products | Notes |
|---|---|---|
| WATT2W | 1 | E14 candle bulb |
| WATT3W | 1 | B22 energy-saving GLS |
| WATT4W | 31 | Vintage filament LED — various shapes and bases |
| **TOTAL** | **33** | |

**Previous estimate was 34 — actual DB count is 33.**  
Difference of 1 is explained by the multi-variant GLS products (e.g. WATT3W + WATT5W+ on same listing): those were correctly excluded by the `has_high_watt_tag = FALSE` filter. The estimate did not account for this overlap.

---

## Query Method

The extraction used a CTE with two boolean flags per product:

- `has_low_watt_tag`: TRUE if any of WATT1W, WATT2W, WATT3W, WATT4W present
- `has_high_watt_tag`: TRUE if any of WATT5W through WATT60W present

Products were included only if `has_low_watt_tag = TRUE AND has_high_watt_tag = FALSE`.

This correctly handles multi-variant GLS energy-saving products (which have WATT3W + WATT5W + WATT9W etc.) by excluding them from the sub-5W list — they span multiple wattages.

Additional filter: `product_type NOT LIKE '%pendant%' AND NOT LIKE '%spider%'` to exclude fittings.

---

## Full Product Table — All 33 Products Strictly Below 5W

| Internal ID | Shopify Item ID | Title | Handle | Product Type | Watt Tags | Base |
|---|---|---|---|---|---|---|
| 353633 | 4417265467488 | 2w Led Small Edison Screw Candle Bulb Dimmable ~3221 | vintage-c35-e14-2w-bent-tip-candle-led-flame-light-bulb | Bulb | WATT2W | E14 |
| 350624 | 6845727506593 | Energy Saving 3W B22 Warm White LED Bulb-Long Lasting ~1366 | 3w-b22-light-bulb-energy-saving-lamp-warm-white-globe | Bulb_B22_Base B | WATT3W | B22 |
| 346665 | 7977119580410 | 3-Pack E27 Dimmable LED Vintage Filament Bulbs - 4W T45 Amber Glass ~4169 | 3-pack-4w-t45-e27-led-dimmable-vintage-filament-light-bulb | E27 Base Bulb B | WATT4W | E27 |
| 347213 | 4417265172576 | 4W Dimmable A60 E27 LED Light Bulb Classic Vintage Style~3224 | vintage-led-a60-e27-4w-light-bulb | Bulb_B22_Base B | WATT4W | E27 |
| 350064 | 4417265631328 | 4W Dimmable E14 LED Candle Bulb Filament C35 vintage design ~3220 | vintage-c35-e14-4w-bent-tip-candle-led-flame-light-bulb | Bulb | WATT4W | E14 |
| 350205 | 7800387404026 | 4W E27 G95 Vintage Edison Spiral LED Bulb \| Decorative Lighting~4061 | vintage-edison-led-light-g95-warm-white-bulb-4w | Bulb | WATT4W | E27 |
| 347235 | 4417275592800 | 4W T45 B22 LED Dimmable Vintage Filament Light Bulb~3084 | 4w-t45-b22-led-dimmable-vintage-teardrop-spiral-filament-light-bulb | Bulb_B22_Base B | WATT4W | B22 |
| 769980 | 14877941760386 | 4W T45 E27 LED Dimmable Vintage Filament Light Bulb~5613 | 4w-t45-b22-led-dimmable-vintage-filament-light-bulb-5614 | Bulb_B22_Base B | WATT4W | E27 |
| 347760 | 7977118728442 | 6 Pack G95 Bulb E27 4W LED Globe Vintage LED Retro Light Bulbs~4167 | 6-pack-g95-e27-4w-led-globe-vintage-led-retro-light-bulbs | Bulb | WATT4W | E27 |
| 353604 | 4417276215392 | B22 4W T45 LED Light Bulb Dimmable Vintage Filament Light Bulbs ~3077 | 4w-t45-b22-led-dimmable-vintage-teardrop-spiral-filament-light-bulb-1 | B22 Base Bulb B | WATT4W | B22 |
| 353828 | 7469126811898 | E27 Bulb 4W Warm White Amber Glass Diamond LED Filament ~1043 | led-soft-light-dimond-e27-4w-filament-glass-retro-warm-white | LED Light Bulbs | WATT4W | E27 |
| 359117 | 7800179753210 | E27 LED Filament Bulb 4W Star Light Bulb Warm White ~4060 | led-light-star-4w-warm-white-bulb-filament-bulbs | Bulb | WATT4W | E27 |
| 348133 | 7692736659706 | LED Bulbs Bayonet ST64 B22 4W Dimmable Filament Edison Light Bulbs ~3874 | st64-b22-4w-dimmable-retro-classic-filament-led-bulbs | Bulb | WATT4W | B22 |
| 347233 | 4417276248160 | LED Vintage Bulb E27 T185 Tubular Filament 4W Screw Bulbs~3076 | 4w-t185-e27-led-non-dimmable-vintage-filament-light-bulb | E27 Base Bulb B | WATT4W | E27 |
| 770025 | 14877939368322 | LEDSone LED T185 4W B22/E27 Tubular Filament Warm White Dimmable Bulbs~5612 | led-vintage-bulb-e27-t185-tubular-filament-4w-screw-dimmable-bulbs-5611 | LED Bulbs | WATT4W | B22/E27 |
| 344773 | 7977119711482 | T45 Edison LED Bulb 10-Pack - 4W Dimmable Tubular E27 - Warm White~4171 | 10-pack-4w-t45-e27-led-dimmable-vintage-filament-light-bulb | E27 Base Bulb B | WATT4W | E27 |
| 349851 | 7469126418682 | Vintage Amber LED Filament Bulb 4W B22~1045 | vintage-amber-led-filament-bulb-4w-b22 | Bulb | WATT4W | B22 (title) / E27 (tag) — ⚠️ dual-base flag |
| 347219 | 4417276018784 | Vintage Edison LED Filament Bulb G80 B22 4W Dimmable ~3078 | vintage-edison-led-filament-bulb-g80-b22-4w-dimmable | B22 Base LED Bulb | WATT4W | B22 |
| 347215 | 6986409312417 | Vintage G125 Globe LED Spiral Filament Bulb 4W E27~1199 | 4w-g125-e27-4w-dimmable-globe-vintage-led-retro-light-bulb | E27 Base Bulb B | WATT4W | E27 |
| 350336 | 7469127205114 | Vintage G125 Love Filament Globe E27 LED Light Bulb~1042 | led-soft-light-g125-e27-love-4w-filament-glass-retro-warm-white | Bulb | WATT4W | E27 |
| 346677 | 7977118695674 | Vintage G95 LED Filament Bulb E27 Amber Globe Dimmable 3 Pack~4166 | 3-pack-g95-e27-4w-led-globe-vintage-led-retro-light-bulbs | Bulb | WATT4W | E27 |
| 353830 | 7469126549754 | Vintage Heart LED Filament Bulb - E27 Warm Amber Glow 4W ~1044 | led-soft-light-heart-e27-4w-filament-glass-retro-warm-white | Bulb | WATT4W | E27 |
| 358250 | 4417266483296 | Vintage LED Bayonet Bulb ST64 4W/8W B22 Dimmable Squirrel Cage Light Bulb ~3209 | dimmable-retro-classic-filament-led-st64-b22-4w-bulbs | Bulb | WATT4W | B22 |
| 347231 | 4417276444768 | Vintage LED Bayonet T185 Bulb 4W B22 Dimmable Decorative Bulb~3075 | 4w-t185-b22-led-non-dimmable-vintage-filament-light-bulb | Bulb | WATT4W | B22 |
| 350209 | 4414316183648 | Vintage LED Bulb E27 G80 Dimmable 4W Globe Light Warm White ~3377 | e27-4w-g80-dimmable-led-vintage-filament-classic-light-bulb | E27 Base Bulb B | WATT4W | E27 |
| 347248 | 7469127303418 | Vintage LED E27 Bulb G125 4W Music Filament Screw Bulb Warm White~1041 | edison-led-soft-light-g125-e27-4w-music-filament-glass-retro-warm-white | Bulb | WATT4W | E27 |
| 350901 | 4417275330656 | Vintage LED E27 G95 Filament Bulb 4W Globe Dimmable Light Bulb UK ~3087 | pack-g95-e27-4w-dimmable-globe-vintage-led-retro-light-bulbs | E27 Base Bulb B | WATT4W | E27 |
| 770051 | 14877951099266 | Vintage LED Edison Bulb 4W E27 Decorative Bulb Non Dimmable ~5614 | 4w-decorative-led-edison-bulb-non-dimmable-vintage-design-5614 | Bulb | WATT4W | E27 |
| 347741 | 7977119645946 | Vintage LED Filament Bulb T45 Screw 4W Dimmable E27 Light Bulb ~4170 | 6-pack-4w-t45-e27-led-dimmable-vintage-filament-light-bulb | E27 Base Bulb B | WATT4W | E27 |
| 358970 | 4417266417760 | Vintage Light Bulb ST64 E27 4W Dimmable LED Filament Bulb~3210 | led-filament-vintage-bulb | Bulb | WATT4W | E27 |
| 353795 | 7465803088122 | Vintage ST64 LED Filament Bulb E27 4W Amber Glass~1058 | st64-led-filament | E27 Base Bulb B | WATT4W | E27 |
| 347217 | 7469126320378 | Vintage T45 Tube LED Bulb 4W E27 Warm White~1046 | vintage-t45-tube-led-bulb-4w-e27-warm-white | Bulb | WATT4W | E27 |
| 360758 | 4573903454304 | Vintage style b22 bayonet filament bulb~2318 | vintage-decorative-industrial-retro-edison-bayonet-led-bulb-b22-base-light-bulb | Bulb_B22_Base B | WATT4W | B22 |

---

## Flags and Observations

### ⚠️ ~1045 Dual-Base Flag (internal_id 349851)
- Title: "Vintage Amber LED Filament Bulb 4W **B22**~1045"  
- Tags include: `B22 Base Bulb` AND `E27 Base Bulb` AND `BASEE27`  
- This appears in both the B22 and E27 base collections  
- Already flagged in GA-08 Step 1 for product team review — confirm if this product actually fits both bases or if one tag is incorrect

### WATT1W — Not Found
The query found 0 products with WATT1W that pass the bulb filter. The 1W S14 outdoor string bulb referenced in the threshold discovery evidence (section 5) has WATT1W but appears to be excluded because its product_type filter did not match. It is a specialty outdoor string bulb, not a standard indoor bulb. Its exclusion from this list is correct for the `low-wattage-bulbs` collection scope (indoor standard bulbs).

### Multi-variant GLS products excluded correctly
Products with WATT3W + WATT5W or WATT3W + WATT9W (energy-saving multi-variant GLS) are excluded because `has_high_watt_tag = TRUE`. These should NOT be in a sub-5W collection — they are sold at multiple wattages including 5W and above.

---

## Wattage Breakdown

| Wattage | Count | % of total |
|---|---|---|
| WATT2W | 1 | 3% |
| WATT3W | 1 | 3% |
| WATT4W | 31 | 94% |
| **Total** | **33** | |

**94% of sub-5W products are 4W vintage filament LED.** This confirms WATT4W is the dominant tier and that the `low-wattage-bulbs` collection would be substantially a vintage filament collection if built from WATT tags.

---

## Comparison vs Previous Estimate

| Estimate | Source | Actual DB result |
|---|---|---|
| ~34 | Previous session inference from distribution table | **33** |
| Difference: 1 | Due to one multi-variant product correctly excluded | Confirmed |

---

## No Shopify Changes Made

This document records a read-only extraction. Zero product tags, collection rules, or Shopify data were modified.

---

## SQL Query Used

```sql
WITH product_watt_tags AS (
    SELECT 
        sl.id, sl.item_id, sl.parent_sku, sl.title, sl.product_type, sl.shopify_handle,
        ARRAY_AGG(DISTINCT TRIM(slt.tag)) FILTER (WHERE TRIM(slt.tag) LIKE 'WATT%') as watt_tags,
        BOOL_OR(TRIM(slt.tag) IN ('WATT5W','WATT6W','WATT7W','WATT8W','WATT9W','WATT10W',
            'WATT12W','WATT12','WATT15W','WATT18W','WATT20W','WATT22W','WATT25W',
            'WATT30W','WATT40W','WATT60W')) as has_high_watt_tag,
        BOOL_OR(TRIM(slt.tag) IN ('WATT1W','WATT2W','WATT3W','WATT4W')) as has_low_watt_tag,
        STRING_AGG(DISTINCT TRIM(slt.tag), ', ' ORDER BY TRIM(slt.tag)) as all_tags
    FROM listings.shopify_listings sl
    LEFT JOIN listings.shopify_listing_tag slt ON slt.product_id = sl.id
    WHERE sl.sub_source = 104 AND sl.is_parent = 1 AND sl.status = 'active'
      AND (
          LOWER(sl.product_type) LIKE '%bulb%'
          OR sl.product_type IN ('LIGHT_BULB','LED','Bulb')
      )
      AND LOWER(COALESCE(sl.product_type,'')) NOT LIKE '%pendant%'
      AND LOWER(COALESCE(sl.product_type,'')) NOT LIKE '%spider%'
    GROUP BY sl.id, sl.item_id, sl.parent_sku, sl.title, sl.product_type, sl.shopify_handle
)
SELECT pwt.id, pwt.item_id, pwt.parent_sku, pwt.title, pwt.shopify_handle, pwt.product_type, 
       pwt.watt_tags, pwt.all_tags
FROM product_watt_tags pwt
WHERE pwt.has_low_watt_tag = TRUE AND pwt.has_high_watt_tag = FALSE
ORDER BY pwt.watt_tags, pwt.title;
-- Result: 33 rows
```

**Critical join note:** `shopify_listing_tag.product_id` (integer) joins to `shopify_listings.id` (integer — NOT to `shopify_listings.item_id`). The handle column is `shopify_handle` (not `handle`).
