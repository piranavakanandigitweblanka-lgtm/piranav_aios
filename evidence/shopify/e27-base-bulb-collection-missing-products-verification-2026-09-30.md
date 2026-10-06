# Evidence: E27 Base Bulb Collection — Missing Products Verification
**Date:** 2026-09-30  
**Store:** LEDSone UK (sub_source 104)  
**Task:** Verify audit finding `COLLECTION_MISSING_IN_STOCK_PRODUCTS — e27-base-bulb`  
**Audit claimed:** 37 in-stock products missing the `E27 Base Bulb` tag  
**Method:** Read-only PostgreSQL verification — no Shopify data modified  

---

## 1. Architecture Discovered

| Component | Finding |
|---|---|
| Collection ID | `159869304928` |
| Collection handle | `e27-base-bulb` |
| Collection title | E27 Base Bulb |
| Collection type | **Smart** (auto-managed by Shopify tag rule) |
| Sub_source | 104 — LEDSone UK |
| Tag table | `listings.shopify_listing_tag` |
| Correct join key | `shopify_listing_tag.product_id` = `shopify_listings.id` (internal DB int, NOT item_id) |
| Tag storage anomaly | Tag stored as `" E27 Base Bulb"` with leading space (223 rows) AND `"E27 Base Bulb"` without space (22 rows) — must use `TRIM()` in all queries |
| Authoritative stock | `physical_product_stock.quantity` via child SKU → `inventory.products.id` → `physical_product_stock.inventory` |
| Shopify listing qty | NULL for parent rows; 0 for most children — NOT a reliable in-stock signal |
| Products in collection table now | 58 (57 active + 1 draft) |

---

## 2. Two Separate Issues Found

The audit conflates two distinct problems. This verification separates them.

### Issue A: Products TAGGED "E27 Base Bulb" but ABSENT from collection table

These products already have the correct tag. A Shopify Smart collection should auto-include them. Their absence from the `shopify_collection_products` DB table indicates a **stale DB snapshot**, not a missing tag.

| Metric | Count |
|---|---|
| Active sub_source-104 parents with `E27 Base Bulb` tag | 98 |
| Currently in `shopify_collection_products` table | 57 (active) |
| **Tagged but NOT in collection table** | **41** |
| Tagged + not in table + physical stock > 0 | **12** |
| Tagged + not in table + physical stock = 0 | **29** |

### Issue B: Genuine E27 bulb products with NO "E27 Base Bulb" tag (actual tagging gap)

These are the products the audit was likely identifying. They need the tag added.

| Metric | Count |
|---|---|
| Active E27 bulb product-type, E27 in title, no tag, physical stock > 0 | **26** |
| Of those 26: have `tag-removed` tag (deliberate removal suspected) | **4** |
| Net candidates requiring tag review (excl. tag-removed) | **22** |

---

## 3. The 12 In-Stock Products Tagged But Missing From Collection Table

All have `E27 Base Bulb` tag. Missing from `shopify_collection_products` only — not a tag problem.

| # | Product Title | product_type | Physical Stock | item_id |
|---|---|---|---:|---|
| 1 | E27 T185 60W Dimmable Vintage Filament Dimmable Light Bulb~3237 | E27 Base Bulb B | 335 | 4417263763552 |
| 2 | E27 G80 60W DimmableGlobe Industrial Vintage Filament Bulb~3245 | E27 Base Bulb B | 82 | 4417263173728 |
| 3 | T45 E27 60W Dimmable Filament Dimmable Incandescent Bulb~3232 | E27 Base Bulb B | 70 | 4417264418912 |
| 4 | Vintage Neon Filament LED Bulb E27 Dimmable Polycarbonate 4W~5628 | LED Bulbs | 56 | 14879081759106 |
| 5 | E27 T130 60W Dimmable Vintage Light Filament Bulb~3070 | Bulb_B22_Base B | 49 | 4417276903520 |
| 6 | T130 Bulb 60W E27 Dimmable Filament Vintage Light Bulb~3236 | E27 Base Bulb B | 49 | 4417263829088 |
| 7 | Vintage G80 Globe 3D Filament Bulb E27 3W Dimmable 2000K~5063 | E27 Base Bulb B | 41 | 8072448934138 |
| 8 | E27 Screw 5W LED Corn Bulb For Garden Lighting~5030 | Bulb | 6 | 8050371068154 |
| 9 | LED E27 A60 5W Warm White 2700K Non-Dimmable Bulb~1369 | E27 Base Bulb B | 1 | 6845727342753 |
| 10 | LED Corn Bulb 24W E27 For indoor Use~5032 | E27 Base Bulb B | 1 | 8053135212794 |
| 11 | Vintage Amber LED Filament Bulb 3W E27 2000K~5075 | Bulb | 1 | 8073717186810 |
| 12 | B22 ST64 8W Vintage Light Bulb Amber Glass~5173 | B22 Base Bulb B | 1 | 8115891011834 |

**Note:** #5 (Bulb_B22_Base B) and #12 (B22 Base Bulb B) are B22-primary products — AMBIGUOUS for E27 collection inclusion. Human review required.

---

## 4. The 26 Genuine E27 Bulbs Missing the Tag (Issue B — actual tagging gap)

Ordered by physical stock descending.

| # | parent_id | Product Title | product_type | Physical Stock | tag-removed? |
|---|---|---|---|---:|---|
| 1 | 985430 | Dimmable Globe Filament LED Bulb – G125/G95/G80 \| B22 & E27~6736 | Bulb | 85,416 | NO |
| 2 | 770021 | LED Filament ST64 E27 Bulb Dimmable LED Squirrel Cage Edison~5610 | Bulb | 14,826 | NO |
| 3 | 347229 | LED 4W ST64 E27 Warm White 2700K Dimmable Bulb~1200 | Bulb_E27_Base | 11,403 | NO |
| 4 | 347239 | 4W Retro E27 base Filament LED Edison Bulb Dimmable~4160 | Bulb | 11,403 | NO |
| 5 | 1017139 | 9W (60W eqv) 806lm E27 LED Bulb A60 GLS 6400K~6913 | LIGHT_BULB | 7,536 | NO |
| 6 | 350207 | E27 Dimmable Antique Globe Industrial Retro Bulbs | Bulb_E27_Base | 7,130 | **YES** |
| 7 | 1016703 | LED E27 A60 Light Bulb 7W 600Lumens~6910 | LIGHT_BULB | 7,030 | NO |
| 8 | 360033 | A60 Dimmable E27 4W/8W light bulb Filament Edison Screw~4418 | Bulb_E27_Base | 5,990 | NO |
| 9 | 763920 | LED 8/4W Christmas Bulb Set Warm White 2700K E27~5579 | LED | 4,513 | NO |
| 10 | 1017112 | 12W E27 LED Light Bulbs 1160 Lumens~6911 | LIGHT_BULB | 4,016 | NO |
| 11 | 1017118 | 7W (60W eqv) E27 A60 GLS Bulb 560 Lumens~6912 | LIGHT_BULB | 3,098 | NO |
| 12 | 347237 | LED T45 E27 4W Filament Amber Glass 2700K Dimmable~1198 | Bulb_B22_Base B | 2,589 | NO |
| 13 | 350216 | ST64 LED Edison Bulb E27 6W Dimmable Amber~4161 | Bulb_E27_Base | 2,486 | NO |
| 14 | 347912 | LED 8W A60 E27 Warm White 2700K Dimmable Bulb~4073 | Bulb_E27_Base | 2,152 | **YES** |
| 15 | 349914 | Dimmable led light filament Amber Warm white bulb_E27 A60 8W~4419 | Bulb_E27_Base | 2,152 | **YES** |
| 16 | 770025 | LEDSone LED T185 4W B22/E27 Tubular Filament Dimmable~5612 | LED Bulbs | 2,094 | NO |
| 17 | 353677 | G95 LED Filament Globe Bulb E27 8W Dimmable Amber~4062 | E27_Base_Bulb | 952 | **YES** |
| 18 | 932524 | S14 Shatterproof LED Bulb E27 Base 1W Waterproof~6428 | LED Bulbs | 464 | NO |
| 19 | 763034 | Retro Vintage Edison Light Bulb Flexible LED Filament E27~5567 | LED Bulb | 253 | NO |
| 20 | 358973 | Vintage Edison LED Non dimmable Screw Bulb E27~5041 | Bulb | 191 | NO |
| 21 | 353664 | LED Corn Candle Bulb Screw E27 Light~5026 | Bulb | 189 | NO |
| 22 | 356356 | LED A60 E27 25W CoolWhite 6000K Non-Dimmable GLS Bulb~4150 | LED Bulbs | 161 | NO |
| 23 | 770034 | Vintage E27 LED Light Bulb 3W Non Dimmable~5619 | Bulb | 158 | NO |
| 24 | 347221 | 4W LED E27 Coloured Golf Ball Bulb Party Decor~5450 | Bulb | 118 | NO |
| 25 | 985745 | Non Dimmable 3W Amber Glass E27 LED Globe Light Bulb~6738 | Bulb | 65 | NO |
| 26 | 931797 | E27 5W Deco Glow Edition LED Bulb Dimmable Warm White~6425 | Bulb | 9 | NO |

**Total physical stock across all 26:** ~176,394 units  
**Products with tag-removed (deliberate exclusion — do NOT tag without human approval):** #6, #14, #15, #17

### Ambiguous candidates requiring human review before tagging:
- #1 (985430): B22 & E27 dual-base multi-model product — collection fit unclear
- #9 (763920): Christmas bulb set — seasonal product, may not belong in permanent collection
- #12 (347237): Bulb_B22_Base B product type — dual base
- #16 (770025): B22/E27 dual base
- #18 (932524): S14 outdoor string light bulb — unusual use case for this collection

---

## 5. Classification Summary

### GROUP A — CONFIRMED: Tagged, not in collection table, in stock (12 products)
Root cause: DB snapshot lag. Tag exists in Shopify. Smart collection should auto-include.  
**Action required:** Verify Smart collection sync in Shopify admin; no tag change needed.

### GROUP B — AMBIGUOUS: Genuine E27 bulbs but needs human decision (approx. 9 products)
Products with tag-removed, dual-base types, seasonal, or unusual use cases.  
**Action required:** Human review before any tag action.

### GROUP C — CONFIRMED MISSING TAG: Clear E27 bulb, no tag, in stock (approx. 17 products)
Products #1–#26 excluding tag-removed (4) and ambiguous (5).  
Highest priority: #2 (14,826 stock), #3 & #4 (11,403 each), #5/#7/#10/#11 (LIGHT_BULB type, 3,098–7,536 stock).  
**Action required (pending coordinator approval):** Add `E27 Base Bulb` tag in Shopify admin.

---

## 6. Audit Figure Comparison

| Interpretation | DB Count | Audit Claimed | Match? |
|---|---|---|---|
| Tagged + not in collection table (all) | 41 | 37 | ✗ |
| Tagged + not in collection + in-stock | 12 | 37 | ✗ |
| Untagged E27 bulb type + in-stock (strict types) | 26 | 37 | ✗ |
| Untagged + E27+bulb in title/type + in-stock (broad) | 125 | 37 | ✗ |

**Conclusion:** The audit's "37" figure does not precisely match any single DB interpretation.  
Closest match: the untagged genuine E27 bulb products (26 confirmed + ~9 ambiguous = ~35, near 37).  
The audit likely used a slightly different product_type filter or stock threshold.  
**The spirit of the audit finding is VALID** — genuine E27 bulbs are missing the tag — but the exact count is **26 confirmed + ~9 ambiguous**, not definitively 37.

---

## 7. Order Impact — Last 90 Days (Tagged but Missing From Collection)

Orders found for 9 of the 41 missing-from-collection products:

| Product (item_id) | Orders | Units | Revenue |
|---|---:|---:|---:|
| Vintage Neon Filament LED Bulb E27 4W~5628 | 3 | 8 | £89.20 |
| Vintage Amber LED Filament Bulb 3W E27~5075 | 3 | 6 | £41.70 |
| Vintage E27 3W Edison Tubular Light Bulbs~5066 | 3 | 6 | £29.10 |
| Vintage LED 8W Soft Filament E27~1149 | 3 | 6 | £18.58 |
| Vintage G80 Globe 3D Filament Bulb E27~5063 | 1 | 3 | £17.55 |
| LED Globe GLS Bulb 12W E27~1375 | 5 | 17 | £14.45 |
| E27 Screw 5W LED Corn Bulb~5030 | 2 | 5 | £24.95 |
| 4W Vintage LED E27 Soft Filament Bulb~1146 | 1 | 4 | £10.20 |
| **TOTAL** | **21** | **55** | **~£245.73** |

These products are selling but customers are reaching them via search/other collections, not the E27 Base Bulb collection. Missing collection placement = reduced discoverability.

---

## 8. Key Anomaly: `tag-removed` Flag

Four genuine E27 bulb products have a custom `tag-removed` tag and are missing the `E27 Base Bulb` tag:

| parent_id | title | Stock |
|---|---|---:|
| 350207 | E27 Dimmable Antique Globe Industrial Retro Bulbs | 7,130 |
| 347912 | LED 8W A60 E27 Warm White 2700K Dimmable Bulb~4073 | 2,152 |
| 349914 | Dimmable led light filament Amber Warm white bulb_E27 A60 8W~4419 | 2,152 |
| 353677 | G95 LED Filament Globe Bulb E27 8W Dimmable Amber~4062 | 952 |

**Do NOT add `E27 Base Bulb` tag to these without checking with the product/operations team** — the removal may have been deliberate (e.g., seasonal exclusion, pricing strategy, or duplicate listing management).

---

## 9. Queries Used

All queries run on `ledsone-db-mcp` (PostgreSQL). Key tables:
- `listings.shopify_listings` — product master (is_parent=1 for parent rows)
- `listings.shopify_listing_tag` — tags (join on `.id`, not `.item_id`; use `TRIM()` on tag value)
- `listings.shopify_collection_products` — collection membership snapshot
- `listings.shopify_collections` — collection metadata
- `listings.shopify_listings_parent_child_mapping` — parent-child variant map
- `inventory.products` — internal SKU master
- `inventory.physical_product_stock` — warehouse stock (join: `ps.inventory = ip.id::bigint`)
- `order_management.order_item_info` + `order_management.orders` — order history

Critical discovery: `shopify_listing_tag.product_id` (integer) joins to `shopify_listings.id` (integer), NOT to `shopify_listings.item_id` (varchar Shopify ID).
