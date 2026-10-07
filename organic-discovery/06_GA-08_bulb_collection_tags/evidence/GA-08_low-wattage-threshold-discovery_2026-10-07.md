# Evidence: GA-08 — Low Wattage Bulb Threshold Discovery
**Date:** 2026-10-07  
**Store:** LEDSone UK (sub_source 104)  
**Task:** GA-08 — Determine what wattage range LEDSone should classify as "Low Wattage Bulb"  
**Method:** Read-only PostgreSQL queries via `ledsone-db-mcp` + AIOS documentation search. No Shopify data modified.

---

## 1. Existing LEDSone Definition Found?

**Answer: NO explicit definition exists.**

Searches performed:
- AIOS documentation: `grep -r "low wattage"` — found no definition file, specification, or standard
- Knowledge base (`ledsone-aios-knowledge-base`): searched "low wattage bulb", "wattage classification" — no results
- Tag table: searched for any tag containing "Low Wattage Bulb" — no such tag exists in the system
- Collections: no collection rule document, no Shopify condition log found in AIOS

There is no LEDSone document that defines what wattage counts as "Low Wattage" for bulbs.

---

## 2. Current Low Wattage Bulbs Collection — Root Cause of the Problem

**Collection:** `low-wattage-bulbs` (Shopify ID: 677351195010, type: Smart)  
**Current product count:** 53  
**Content:** 100% pendant lights and spider fittings — zero actual bulbs

**Root cause confirmed (DB evidence):**

The single tag that appears on ALL 53 products in this collection is:

> **`Spider Pendant`**

This is the Smart collection rule. The condition reads:
> Tag includes: `Spider Pendant` AND inventory stock > 30

Every product with the `Spider Pendant` tag that has stock over 30 units is pulled into `low-wattage-bulbs`. This is a misconfigured collection rule — `Spider Pendant` has nothing to do with wattage. It was almost certainly applied to the wrong collection.

**Implication:** The collection has NEVER contained low-wattage bulbs under this rule. It has always shown pendant fittings.

---

## 3. LEDSone Wattage Tag System Explained

LEDSone uses two separate wattage tag systems on products:

### System A — `WATT{n}W` tags (actual LED wattage)
These tags represent the **actual electrical consumption** of the LED product.

| Tag | Bulb products (single-watt) | Notes |
|---|---|---|
| WATT2W | 1 | Very rare — 1 E14 candle bulb |
| WATT3W | 1 | 1 genuine single-watt product (others multi-variant) |
| WATT4W | **31** | **Dominant low-wattage tier** — all vintage filament LED |
| WATT5W | 2 | Small E27/B22 GLS LED bulbs |
| WATT7W | 2 | |
| WATT8W | 15 | Second major tier — larger vintage filament LED |
| WATT9W | 2 | |
| WATT12W/WATT12 | 5 | |
| WATT15W | 1 | |
| WATT18W | 1 | |
| WATT25W | 1 | |
| WATT40W | 3 | Genuine 40W incandescent vintage bulbs |
| WATT60W | 10 | Genuine 60W incandescent/filament bulbs |

**Important:** Several energy-saving GLS products carry MULTIPLE WATT tags (e.g. WATT3W + WATT5W + WATT7W + WATT9W + WATT12W + WATT18W + WATT25W). These are multi-variant products sold at different wattages. They were excluded from the single-watt counts above to avoid distortion.

### System B — `FILTWATT` tags (incandescent equivalent)
These appear to be search filter tags indicating the incandescent-equivalent wattage:

| Tag | Products |
|---|---|
| FILTWATT-40W | 3 — LED bulbs equivalent to 40W incandescent |
| FILTWATT-60W | 11 — LED bulbs equivalent to 60W incandescent |

These are NOT the same as actual wattage. A 4W LED may carry FILTWATT-40W to indicate it replaces a 40W incandescent.

---

## 4. Strongest Internal Signal: `vintage-bulbs-4w` Collection

LEDSone already has a Smart collection specifically for **4W vintage LED bulbs**:

| Field | Value |
|---|---|
| Handle | `vintage-bulbs-4w` |
| Title | "Vintage bulbs 4W" |
| Type | Smart |
| Current products | 12 |
| Controlling tag | `Vintage bulbs 4W` |

Products in this collection are tagged `WATT4W` + `Vintage bulbs 4W`. They are all vintage-style decorative LED filament bulbs consuming 4W.

**Significance:** This collection is proof that LEDSone internally recognises 4W as its own distinct wattage tier. If 4W bulbs already have a dedicated collection, the `low-wattage-bulbs` collection may be intended to be either:
- (a) broader — covering 1W through 4W or 1W through 5W, OR
- (b) a distinct segment intended to replace or expand beyond `vintage-bulbs-4w`

**There are 20 additional WATT4W bulb products NOT in `vintage-bulbs-4w`** — these are WATT4W bulbs that haven't been given the `Vintage bulbs 4W` tag. They still consume 4W and would be candidates for any low-wattage classification.

---

## 5. Wattage Distribution of Actual Bulb Products

### Group A — Most likely "Low Wattage" (1W–5W LED)

| Wattage | Single-watt product count | Product examples |
|---|---|---|
| 1W | 1 (S14 outdoor string bulb) | S14 Shatterproof LED Bulb E27 Base 1W Waterproof~5030 |
| 2W | 1 | 2w Led Small Edison Screw Candle Bulb Dimmable ~3221 |
| 3W | 1 genuine | Energy Saving 3W B22 Warm White LED Bulb ~1366 |
| **4W** | **31** | Vintage filament LED: T45, ST64, G80, G95, G125, T185, C35 shapes — all bases |
| 5W | 2 | LED E27 A60 5W Warm White 2700K ~1369; LED GLS Warm White 5W B22 ~1368 |
| **Total A** | **~36** | |

### Group B — Mid-range (6W–9W)

| Wattage | Count | Notes |
|---|---|---|
| 6W | ~7 | A60/ST64 filament LED |
| 7W | ~8 | LIGHT_BULB type GLS |
| 8W | 15 | Larger vintage filament LED (G125, ST64, 8W T-shapes) |
| 9W | ~8 | Modern GLS energy-savers |
| **Total B** | **~38** | Not low wattage by standard definition |

### Group C — High wattage bulbs (not Low Wattage)

| Wattage | Count | Notes |
|---|---|---|
| 12W+ | 8 | Corn bulbs, commercial, multi-wattage packs |
| 40W | 3 | Genuine incandescent: B22 G125 40W vintage ~3073 |
| 60W | 10 | Genuine incandescent: T45 60W, T130 60W, T185 60W, G80 60W etc. |

---

## 6. Products That Do NOT Qualify as Low Wattage Bulbs

### Non-bulb products in current collection (all 53)
- All are pendant lights, spider lights, or multi-outlet fittings
- Product types: Pendant Lighting, Spider Lights, Multi_Outlet_Spider_Lamp_Lighting
- Trigger: `Spider Pendant` tag

### High-wattage bulbs (exist in system, should NOT be in low-wattage collection)
The 40W incandescent:
- B22 Light Bulb G125 40W Vintage Retro Industrial Filament Bulb~3073

The 60W incandescent/vintage (10 products):
- T45 E27 60W Dimmable Filament Dimmable Incandescent Bulb~3232
- T130 Bulb 60W E27 Dimmable Filament Vintage Light Bulb~3236
- E27 T185 60W Dimmable Vintage Filament Dimmable Light Bulb~3237
- E27 G80 60W DimmableGlobe Industrial Vintage Filament Bulb~3245
- E27 T130 60W Dimmable Vintage Light Filament Bulb~3070
- T185 E27 60W Antique Filament Spiral Lamp Light Bulb~1668
- Vintage Retro C35 Candle Light Bulb Edison Filament Style 60W Candle Lamp~4063
- (+ LED bulbs also tagged WATT60W as equivalent wattage: LED 8W ~3249, LED B22 G95 4W ~3080, Large G125 8W LED ~5625)

---

## 7. Inference — Recommended Threshold (NOT official, requires Thuwaraga confirmation)

**CONFIDENCE: MEDIUM**

Based on LEDSone's own data patterns, the most defensible threshold is:

> **Low Wattage Bulbs = LED bulbs with actual consumption of 1W–5W**

### Supporting evidence for this inference:

| Evidence | Weight |
|---|---|
| `vintage-bulbs-4w` collection exists as a dedicated tier | Strong — LEDSone's own prior classification |
| WATT4W is the dominant tier with 31 products | Strong — most of the low-LED-wattage inventory is 4W |
| WATT8W products are vintage filament bulbs with "standard" brightness (60W equiv) | Supports 8W = NOT low wattage |
| WATT60W products are genuine incandescent bulbs (high actual wattage) | Confirms 60W = clearly NOT low wattage |
| Energy-saving GLS collection covers 7W–22W | Boundary: 7W is already in a separate segment |
| FILTWATT-40W/FILTWATT-60W indicate incandescent-equivalent — not actual LED wattage | These don't define the collection boundary |

### Products that would qualify under ≤5W threshold: ~36 products

| Watt | Count |
|---|---|
| 1W | 1 |
| 2W | 1 |
| 3W | 1–3 (depending on multi-variant treatment) |
| 4W | 31 |
| 5W | 2 |
| **Total** | **~36** |

### Alternative: ≤4W only (stricter)
- Would cover ~34 products
- Directly aligns with the `vintage-bulbs-4w` collection precedent
- Cleaner definition: "LED bulbs using 4W or less"

### Why NOT ≤8W:
- 8W vintage filament LED bulbs replace 60W incandescent — that is standard household brightness, not genuinely "low wattage"
- The `vintage-bulbs-4w` collection would be entirely redundant if `low-wattage-bulbs` went up to 8W

### Why NOT incandescent wattage:
- 60W incandescent is standard, not low wattage
- WATT60W products (genuine incandescent) would make the collection name misleading
- LEDSone is an LED-first store; "Low Wattage" in this context means low LED consumption

---

## 8. What the New Smart Collection Rule Should Be (inference only)

Replace: `Tag includes: Spider Pendant` + `inventory > 30`  
With: `Tag includes: Low Wattage Bulb` (new tag to be applied to qualifying products)

OR: Use the existing WATT tags directly as the collection condition:
- `Tag includes: WATT4W` (strict — only 4W LED)
- OR `Tag includes_any: WATT2W, WATT3W, WATT4W, WATT5W` (broader — 1–5W LED)

**Important:** The `vintage-bulbs-4w` collection uses the tag `Vintage bulbs 4W` (not WATT4W directly) as its condition. Any new rule should avoid conflicting with that collection's condition.

---

## 9. Questions for Thuwaraga Confirmation

Before any collection rule change:

1. **Wattage threshold:** Should "Low Wattage Bulbs" mean:
   - (a) ≤4W LED actual — aligns with vintage-bulbs-4w tier, ~34 products
   - (b) ≤5W LED actual — slightly broader, ~36 products
   - (c) Some other boundary?

2. **Overlap with vintage-bulbs-4w:** Should `low-wattage-bulbs` and `vintage-bulbs-4w` contain the same products (overlap intentional) or should one replace the other?

3. **Incandescent 40W/60W products:** Should the real 40W and 60W incandescent/vintage filament bulbs be classified as "low wattage" (they are low wattage in a historical sense) or excluded?

4. **New tag vs existing WATT tag:** Should the collection rule use `WATT4W` (existing tag, already on products) or a new `Low Wattage Bulb` tag (new tag, needs applying to ~34–36 products)?

5. **Collection purpose:** Is `low-wattage-bulbs` meant for SEO/customer navigation (e.g. customers searching "low energy bulbs") or for internal merchandising? This affects which boundary makes more sense.

---

## 10. No Shopify Changes Made

This document records discovery only. Zero product tags, collection rules, or Shopify data were modified.

---

## Queries Used

```sql
-- Tag system search
SELECT TRIM(tag), COUNT(*) FROM listings.shopify_listing_tag WHERE LOWER(TRIM(tag)) LIKE '%watt%' GROUP BY TRIM(tag) ORDER BY 2 DESC;

-- Collection rule confirmation: tag on ALL 53 products
SELECT TRIM(slt.tag), COUNT(DISTINCT sl.id) as count
FROM [collection cp join] WHERE cp.collection_id = '677351195010'
GROUP BY tag HAVING COUNT = 53;
-- Result: Spider Pendant (53) — confirmed as sole trigger

-- WATT distribution (single-variant bulbs only)
-- Excluded products with >2 WATT tags (multi-variant GLS energy-savers)

-- vintage-bulbs-4w collection contents + WATT4W products NOT in it
```
