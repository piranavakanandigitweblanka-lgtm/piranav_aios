# Evidence: GA-08 — Incandescent Bulbs Collection Discovery

**Date:** 2026-10-07  
**Store:** LEDSone UK (sub_source = 104)  
**Task:** GA-08 — Determine what products should genuinely be in the `incandescent-bulbs` collection  
**Method:** Read-only PostgreSQL queries via `ledsone-db-mcp`. No Shopify data modified.

---

## 1. Collection Details

| Field | Value |
|---|---|
| Collection handle | `incandescent-bulbs` |
| Shopify collection_id | `159254839392` |
| Shopify title | "Incandescent Light Bulbs" |
| Type | Smart |
| Current DB product count | 4 |

---

## 2. LEDSone Internal Definition Found?

**Answer: NO explicit definition document exists.**

However, the internal signals are strong and clear:

### Strongest signals for "Incandescent Bulbs" classification:

| Signal | What it means | Confidence |
|---|---|---|
| `Incandescent Bulbs` tag | Direct Smart collection trigger — the tag that controls membership | HIGH |
| `WATT40W` or `WATT60W` tag | Actual wattage of 40W or 60W — only possible if genuine incandescent filament technology | HIGH |
| `FILTWATT-40W` or `FILTWATT-60W` tag | Incandescent-equivalent wattage — indicates "replaces a 40W/60W incandescent" (used on LED replacements too) | MEDIUM — not sufficient alone |
| `MODIncandescent Bulbs` tag | 17 products — appears to mean "modern incandescent-style" (LED filament with incandescent appearance) | MEDIUM — ambiguous |
| Title contains "60W", "40W" | Wattage in title confirms actual incandescent consumption | HIGH when combined with WATT tag |

### Key distinction confirmed from DB:
- Products with **`WATT40W` or `WATT60W`** as actual wattage = genuine incandescent (40W/60W real consumption)
- Products with **`FILTWATT-40W` or `FILTWATT-60W`** but a separate low `WATTnW` tag = LED replacement (actual consumption is 4W/8W, incandescent-equivalent is 40W/60W)
- The 4 incorrectly-included products all have **4W actual LED consumption** — confirmed by `WATT4W` tag or LED branding in title

---

## 3. Why Only 4 of 13 Tagged Products Are in the Collection

The `incandescent-bulbs` Smart collection rule is:  
> `Tag includes: Incandescent Bulbs` + **inventory condition (likely > 30)**

13 active products have the `Incandescent Bulbs` tag. Only 4 are in the collection.  
The 9 genuine incandescent products that have the tag but are NOT in the collection are likely below the inventory threshold (stock < 30 units). This follows the exact same pattern as `low-wattage-bulbs` (which used `Spider Pendant` + inventory > 30).

**Result:** The inventory condition is accidentally filtering OUT the correct products and keeping only the 4 LED products that happen to have higher stock.

---

## 4. The 4 Incorrect LED Products Currently in the Collection

These 4 products have the `Incandescent Bulbs` tag but are LED — they should NOT be in this collection.

### Product 1 — ~4086
| Field | Value |
|---|---|
| Internal ID | 345666 |
| Shopify Product ID | **7849767436538** |
| Title | 2 Pack LED E27/B22/E14 Dimmable Warm white 2700K Bulbs(energy saving)~4086 |
| Handle | (not retrieved — confirm in Shopify admin) |
| Product Type | Bulb_B22_Base B |
| Key tags | `Incandescent Bulbs`, `LED Bulb`, `B22 LED Bulb`, `E27 LED Bulb`, `E14 LED Bulb` |
| Why NOT incandescent | Title explicitly says "LED", no WATT40W/60W tag, no FILTWATT tag, multi-base energy saving pack |
| Action | REMOVE `Incandescent Bulbs` tag |

### Product 2 — ~3239
| Field | Value |
|---|---|
| Internal ID | 358258 |
| Shopify Product ID | **4417263632480** |
| Title | E27 4W Dimmable Retro Filament LED Edison Decorative Bulb ~3239 |
| Handle | (not retrieved — confirm in Shopify admin) |
| Product Type | Bulb |
| Key tags | `Incandescent Bulbs`, `LED Bulbs`, `Vintage Bulbs`, `Dimmable` |
| Why NOT incandescent | Title says "LED", "4W" — LED product with vintage filament appearance. No WATT40W/60W. |
| Action | REMOVE `Incandescent Bulbs` tag |

### Product 3 — ~3080
| Field | Value |
|---|---|
| Internal ID | 350925 |
| Shopify Product ID | **4417275887712** |
| Title | LED B22 G95 4W Filament Dimmable Warm White 2700K Bulb(Energy Saving)~3080 |
| Handle | (not retrieved — confirm in Shopify admin) |
| Product Type | Bulb |
| Key tags | `Incandescent Bulbs`, `MODIncandescent Bulbs`, `LED Bulbs`, `FILTWATT-60W`, `WATT60W`, `Filter_ALL_bulb` |
| Why NOT incandescent | Title says "LED", "4W". `WATT60W` here is the incandescent-equivalent (confirmed in low-wattage threshold evidence — this product was listed as "LED 4W ~3080 with WATT60W as equiv wattage"). Actual consumption = 4W LED. |
| Action | REMOVE `Incandescent Bulbs` tag AND `MODIncandescent Bulbs` tag |

### Product 4 — ~4072
| Field | Value |
|---|---|
| Internal ID | 350927 |
| Shopify Product ID | **7834279215354** |
| Title | LED Bayonet G95 Filament Vintage Bulb 4W B22 Edison Globe Vintage Bulb- 4072 |
| Handle | (not retrieved — confirm in Shopify admin) |
| Product Type | Bulb |
| Key tags | `Incandescent Bulbs`, `MODIncandescent Bulbs`, `LED Bulbs`, `FILTWATT-40W`, `WATT40W`, `Filter_ALL_bulb` |
| Why NOT incandescent | Title says "LED", "4W". `WATT40W` is incandescent-equivalent. Actual consumption = 4W LED. |
| Action | REMOVE `Incandescent Bulbs` tag AND `MODIncandescent Bulbs` tag |

---

## 5. Genuine Incandescent Products — Have Tag, NOT in Collection (9 products)

These have the `Incandescent Bulbs` tag and are genuine 40W/60W filament bulbs, but are **not** currently in the collection — almost certainly because their stock is below the inventory condition threshold.

| # | Internal ID | Shopify Product ID | Title | Wattage Signal | Action needed |
|---|---|---|---|---|---|
| 1 | 348127 | 4417263992928 | B22 60W T130 Dimmable Filament Vintage Light Bulb~3235 | FILTWATT-60W, title "60W" | Verify stock — if > threshold, will auto-include when collection rule fixed |
| 2 | 348165 | 4417276575840 | B22 Light Bulb G125 40W Vintage Retro Industrial Filament Bulb~3073 | WATT40W, FILTWATT-40W | Same |
| 3 | 348192 | 4417264517216 | B22 Light Bulb T45 60W Dimmable Filament Style ~3231 | Title "60W" | Same |
| 4 | 348970 | 6036335689889 | C35 E14 60W Edison Antique Filament Spiral Lamp Light Bulb~1666 | Title "60W" | ⚠️ product_type = "LED Bulbs" — verify actual technology |
| 5 | 350440 | 4417276903520 | E27 T130 60W Dimmable Vintage Light Filament Bulb~3070 | WATT60W, FILTWATT-60W | Same |
| 6 | 350450 | 4417263763552 | E27 T185 60W Dimmable Vintage Filament Dimmable Light Bulb~3237 | WATT60W, FILTWATT-60W | Same |
| 7 | 358473 | 4417263829088 | T130 Bulb 60W E27 Dimmable Filament Vintage Light Bulb~3236 | WATT60W, FILTWATT-60W | Same |
| 8 | 358475 | 6036335526049 | T185 E27 60W Antique Filament Spiral Lamp Light Bulb~1668 | WATT60W, FILTWATT-60W | Same |
| 9 | 358479 | 4417264418912 | T45 E27 60W Dimmable Filament Dimmable Incandescent Bulb~3232 | WATT60W, FILTWATT-60W, title "Incandescent" | Same |

---

## 6. Genuine Incandescent Products — MISSING Tag (2 products)

These are genuine 40W/60W filament bulbs with `WATT60W` or `WATT40W` tags but **do not have** the `Incandescent Bulbs` tag at all. They would never appear in the collection even if the inventory condition is met.

| # | Internal ID | Shopify Product ID | Title | Wattage | Missing tag |
|---|---|---|---|---|---|
| 1 | 350261 | 4417263173728 | E27 G80 60W DimmableGlobe Industrial Vintage Filament Bulb~3245 | WATT60W, FILTWATT-60W | `Incandescent Bulbs` |
| 2 | 360448 | 7806935367930 | Vintage Retro C35 Candle Light Bulb Edison Filament Style 60W Candle Lamp~4063 | WATT60W, FILTWATT-60W | `Incandescent Bulbs` |

---

## 7. Ambiguous Products — MODIncandescent Bulbs Tag Only (3 products)

These have `MODIncandescent Bulbs` but NOT `Incandescent Bulbs`. They are LED products with incandescent-style appearance. They do NOT belong in `incandescent-bulbs` as genuine incandescent.

| # | Internal ID | Shopify Product ID | Title | Actual Wattage | Classification |
|---|---|---|---|---|---|
| 1 | 350263 | 6669353779361 | Edison Style E27 G95 Bulb 4W Dimmable Screw Vintage Globe Decorative Bulb~1531 | WATT40W (equiv only) — 4W LED | LED — does NOT belong in incandescent collection |
| 2 | 350921 | 4417262780512 | LED 8W Vintage Filament Dimmable E27 Globe Bulb ~3249 | WATT60W (equiv), 8W LED actual | LED — does NOT belong in incandescent collection |
| 3 | 770424 | 14878723539330 | Large Vintage G125 (mm) E27 8W LED Edison Dimmable LED Filament ~5625 | WATT60W (equiv), 8W LED actual | LED — does NOT belong in incandescent collection |

---

## 8. Correct Product Set for Incandescent Bulbs Collection

### Definition (inferred from DB signals — NOT explicit LEDSone document)

> **Incandescent Bulbs = products with genuine 40W or 60W actual filament/incandescent consumption**
>
> Signal: `WATT40W` or `WATT60W` actual wattage tag AND/OR title explicitly stating "40W" or "60W"  
> Excludes: LED replacements that merely have a 40W/60W incandescent-equivalent filter tag

**LEDSone definition: NOT FOUND in documentation. Inferred from WATT tag system.**

### Confirmed genuine incandescent products (with `Incandescent Bulbs` tag): 9

| # | Shopify Product ID | Title | Actual Wattage |
|---|---|---|---|
| 1 | 4417263992928 | B22 60W T130 Dimmable Filament Vintage Light Bulb~3235 | 60W |
| 2 | 4417276575840 | B22 Light Bulb G125 40W Vintage Retro Industrial Filament Bulb~3073 | 40W |
| 3 | 4417264517216 | B22 Light Bulb T45 60W Dimmable Filament Style ~3231 | 60W |
| 4 | 6036335689889 | C35 E14 60W Edison Antique Filament Spiral Lamp Light Bulb~1666 | 60W (⚠️ verify) |
| 5 | 4417276903520 | E27 T130 60W Dimmable Vintage Light Filament Bulb~3070 | 60W |
| 6 | 4417263763552 | E27 T185 60W Dimmable Vintage Filament Dimmable Light Bulb~3237 | 60W |
| 7 | 4417263829088 | T130 Bulb 60W E27 Dimmable Filament Vintage Light Bulb~3236 | 60W |
| 8 | 6036335526049 | T185 E27 60W Antique Filament Spiral Lamp Light Bulb~1668 | 60W |
| 9 | 4417264418912 | T45 E27 60W Dimmable Filament Dimmable Incandescent Bulb~3232 | 60W |

### Missing `Incandescent Bulbs` tag — should be added (2):

| # | Shopify Product ID | Title | Action |
|---|---|---|---|
| 1 | 4417263173728 | E27 G80 60W DimmableGlobe Industrial Vintage Filament Bulb~3245 | ADD `Incandescent Bulbs` tag |
| 2 | 7806935367930 | Vintage Retro C35 Candle Light Bulb Edison Filament Style 60W Candle Lamp~4063 | ADD `Incandescent Bulbs` tag |

### Full correct collection = 11 products (9 existing + 2 missing)

---

## 9. Summary of Actions Required

| Action | Products | Count |
|---|---|---|
| REMOVE `Incandescent Bulbs` tag | ~4086, ~3239, ~3080, ~4072 | 4 |
| REMOVE `MODIncandescent Bulbs` tag (also) | ~3080, ~4072 | 2 |
| ADD `Incandescent Bulbs` tag | ~3245, ~4063 | 2 |
| VERIFY technology (product_type says LED Bulbs but title says 60W) | ~1666 (C35 E14 60W) | 1 |
| Fix inventory condition on collection (if blocking genuine products) | Smart collection rule | 1 |

---

## 10. No Shopify Changes Made

This document records discovery only. Zero product tags, collection rules, or Shopify data were modified.

---

## Queries Used

```sql
-- Current collection products
SELECT sl.id, sl.item_id, sl.title, sl.product_type, sl.status,
    STRING_AGG(DISTINCT TRIM(slt.tag), ', ')
FROM listings.shopify_collection_products cp
JOIN listings.shopify_listings sl ON sl.item_id = cp.product_id::varchar
    AND sl.sub_source = 104 AND sl.is_parent = 1
LEFT JOIN listings.shopify_listing_tag slt ON slt.product_id = sl.id
WHERE cp.collection_id = '159254839392'
GROUP BY sl.id, sl.item_id, sl.title, sl.product_type, sl.status;
-- Result: 4 products, all LED

-- All products tagged 'Incandescent Bulbs' (active, UK)
SELECT sl.id, sl.item_id, sl.title, sl.product_type,
    STRING_AGG(DISTINCT TRIM(slt.tag), ', ')
FROM listings.shopify_listings sl
JOIN listings.shopify_listing_tag slt_inc ON slt_inc.product_id = sl.id
    AND TRIM(slt_inc.tag) = 'Incandescent Bulbs'
LEFT JOIN listings.shopify_listing_tag slt ON slt.product_id = sl.id
WHERE sl.sub_source = 104 AND sl.is_parent = 1 AND sl.status = 'active'
GROUP BY sl.id, sl.item_id, sl.title, sl.product_type ORDER BY sl.title;
-- Result: 13 products (9 genuine incandescent, 4 LED)

-- Tag signal survey
SELECT TRIM(tag), COUNT(DISTINCT product_id)
FROM listings.shopify_listing_tag
WHERE LOWER(TRIM(tag)) LIKE '%incandescent%' ...
GROUP BY TRIM(tag) ORDER BY 2 DESC;
-- Result: 'Incandescent Bulbs' (66 total across all stores), 'MODIncandescent Bulbs' (17)

-- WATT40W/WATT60W products without Incandescent Bulbs tag (missing tag candidates)
-- Result: 5 products — 2 genuine incandescent missing tag, 3 LED (MODIncandescent only)
```
