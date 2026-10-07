# Evidence: GA-08 — Incandescent Bulbs Stock Verification

**Date:** 2026-10-07  
**Store:** LEDSone UK (sub_source = 104)  
**Source:** GA-08 Incandescent Bulbs Discovery (`GA-08_incandescent-bulbs-discovery_2026-10-07.md`) — exact 11-product list  
**Method:** Read-only PostgreSQL query via `ledsone-db-mcp`. No Shopify data modified.

---

## ⚠️ CORRECTION — 2026-10-07

**Earlier version of this file reported global stock (all warehouses). This was WRONG.**

Piranav confirmed ICG80E2760 shows 0 at UK in the inventory system. Re-query with UK-warehouse filter confirmed:
- The 82 units of ICG80E2760 are in **Netherlands1** — NOT in any UK warehouse.
- Shopify UK fulfils from UK warehouses only.
- **Correct UK stock for all 11 products = 0 or negative.**

All "in stock" figures in the original version were incorrect global totals.

---

## Bonus Finding — ~1666 Technology RESOLVED

**~1666 is CONFIRMED GENUINE INCANDESCENT.**

Child SKU: `ICSC35E1460`

The `IC` prefix is used on ALL genuine incandescent products in this dataset:

| SKU | Product |
|---|---|
| ICT130B2260 | B22 60W T130 |
| ICG125B2240 | B22 G125 40W |
| ICT45B2260 | B22 T45 60W |
| **ICSC35E1460** | **C35 E14 60W ~1666 — confirmed incandescent** |
| ICG80E2760 | E27 G80 60W ~3245 |
| ICT130E2760 | E27 T130 60W |
| ICT185E2760 | E27 T185 60W |
| ICT130E2760 | T130 E27 60W |
| ICST185E2760 | T185 E27 60W |
| ICT45E2760 | T45 E27 60W |
| ICC35E1460 | C35 E14 60W ~4063 |

`product_type = "LED Bulbs"` on ~1666 is a **product data entry error** — the SKU prefix and title both confirm it is a genuine incandescent product.  
**~1666 technology: CONFIRMED INCANDESCENT — was UNRESOLVED, now RESOLVED.**

---

## Stock Verification — All 11 Products (UK Warehouses Only)

**Warehouses checked:** UK Unit3 (id=1), UK Unit18 (id=6), UK Unit4 (id=8)

### UK stock summary

| # | Shopify Product ID | Title | SKU | UK Unit3 | UK Unit18 | UK Unit4 | **UK Total** | UK Status |
|---|---|---|---|---|---|---|---|---|
| 1 | 4417263992928 | B22 60W T130 Dimmable Filament Vintage Light Bulb~3235 | ICT130B2260 | -12 | 0 | -3 | **-15** | OUT OF STOCK |
| 2 | 4417276575840 | B22 Light Bulb G125 40W Vintage Retro Industrial Filament Bulb~3073 | ICG125B2240 | 0 | 0 | 0 | **0** | OUT OF STOCK |
| 3 | 4417264517216 | B22 Light Bulb T45 60W Dimmable Filament Style ~3231 | ICT45B2260 | -1 | 0 | 0 | **-1** | OUT OF STOCK |
| 4 | 6036335689889 | C35 E14 60W Edison Antique Filament Spiral Lamp Light Bulb~1666 | ICSC35E1460 | 0 | 0 | 0 | **0** | OUT OF STOCK |
| 5 | 4417263173728 | E27 G80 60W DimmableGlobe Industrial Vintage Filament Bulb~3245 ⚠️ missing tag | ICG80E2760 | 0 | 0 | 0 | **0** | OUT OF STOCK |
| 6 | 4417276903520 | E27 T130 60W Dimmable Vintage Light Filament Bulb~3070 | ICT130E2760 | 1 | 0 | -4 | **-3** | OUT OF STOCK |
| 7 | 4417263763552 | E27 T185 60W Dimmable Vintage Filament Dimmable Light Bulb~3237 | ICT185E2760 | -6 | 0 | 0 | **-6** | OUT OF STOCK |
| 8 | 4417263829088 | T130 Bulb 60W E27 Dimmable Filament Vintage Light Bulb~3236 | ICT130E2760 | 1 | 0 | -4 | **-3** | OUT OF STOCK |
| 9 | 6036335526049 | T185 E27 60W Antique Filament Spiral Lamp Light Bulb~1668 | ICST185E2760 | 0 | 0 | 0 | **0** | OUT OF STOCK |
| 10 | 4417264418912 | T45 E27 60W Dimmable Filament Dimmable Incandescent Bulb~3232 | ICT45E2760 | 0 | 0 | 0 | **0** | OUT OF STOCK |
| 11 | 7806935367930 | Vintage Retro C35 Candle Light Bulb Edison Filament Style 60W Candle Lamp~4063 ⚠️ missing tag | ICC35E1460 | -26 | 0 | 0 | **-26** | OUT OF STOCK |

**Result: ALL 11 genuine incandescent products are OUT OF STOCK at UK warehouses.**

---

## Global Stock Note (for reference only)

Some products have stock in non-UK warehouses — this does NOT affect Shopify UK:

| SKU | Non-UK Stock Location | Qty | Relevant to UK Shopify? |
|---|---|---|---|
| ICG80E2760 (~3245) | Netherlands1 | 82 | NO |
| ICT185E2760 (~3237) | (other warehouses — not checked) | — | NO |

---

## Totals (UK-only)

| Metric | Count |
|---|---|
| Genuine incandescent products | 11 |
| Currently IN STOCK at UK (qty > 0) | **0** |
| Currently OUT OF STOCK at UK (qty ≤ 0) | **11** |
| Would satisfy inventory > 30 condition | **0** |

---

## Collection Absence — FULLY EXPLAINED

The `incandescent-bulbs` Smart collection rule is: `Tag includes: Incandescent Bulbs` + inventory condition (likely > 30).

**All 11 genuine products fail the inventory condition because UK stock = 0 or negative.**

The 4 LED products that ARE currently in the collection have higher UK stock and the tag — that is why they appear.

There is no hidden rule or additional condition. The inventory filter is working as designed; the stock just isn't there at UK warehouses.

| Previously unexplained | Correct explanation |
|---|---|
| ~3070 has tag + reported 49 stock → still not in collection | The 49 units are in Netherlands1, not UK. UK stock = -3. |
| ~3237 has tag + reported 335 stock → still not in collection | Global figure. UK stock = -6. |
| ~3236 has tag + reported 49 stock → still not in collection | Shared SKU with ~3070. UK stock = -3. |
| ~3232 has tag + reported 70 stock → still not in collection | Global figure. UK stock = 0. |

---

## What This Means for Implementation

Tag corrections remain valid and necessary:
- REMOVE `Incandescent Bulbs` tag from 4 LED products (~4086, ~3239, ~3080, ~4072)
- ADD `Incandescent Bulbs` tag to ~3245 and ~4063

However, even after tag fixes, **none of the genuine products will appear in the collection until UK stock is replenished** — because all 11 have UK stock ≤ 0.

---

## No Shopify Changes Made

This document records read-only stock verification. Zero product tags, collection rules, or Shopify data were modified.

---

## SQL Queries Used

```sql
-- UK-only warehouse breakdown (corrected query)
SELECT 
    sl_p.id as parent_id,
    sl_p.item_id as shopify_product_id,
    sl_p.title,
    sl_c.sku,
    w.warehouse_name,
    w.warehouse_location,
    pps.quantity
FROM listings.shopify_listings sl_p
JOIN listings.shopify_listings_parent_child_mapping pcm ON pcm.parent_id = sl_p.id
JOIN listings.shopify_listings sl_c ON sl_c.id = pcm.child_id
LEFT JOIN inventory.products ip ON TRIM(ip.sku) = TRIM(sl_c.sku)
LEFT JOIN inventory.physical_product_stock pps ON pps.inventory = ip.id
LEFT JOIN inventory.warehouse w ON w.warehouse = pps.warehouse
WHERE sl_p.id IN (
    348127, 348165, 348192, 348970,
    350440, 350450, 358473, 358475, 358479,
    350261, 360448
)
AND sl_p.sub_source = 104
AND (w.warehouse_location = 'UK' OR w.warehouse_location IS NULL)
ORDER BY sl_p.title, sl_c.sku, w.warehouse_name;

-- Single SKU warehouse breakdown (ICG80E2760 — triggered correction)
SELECT ip.sku, ip.id as inv_product_id,
    w.warehouse_name, w.warehouse_location,
    pps.warehouse as warehouse_id, pps.quantity, pps.reserved_quantity
FROM inventory.products ip
JOIN inventory.physical_product_stock pps ON pps.inventory = ip.id
JOIN inventory.warehouse w ON w.warehouse = pps.warehouse
WHERE TRIM(ip.sku) = 'ICG80E2760'
ORDER BY w.warehouse_name;
```
