# Evidence: Homingmbh DE — Cable Sub-Collections Creation + 45-Product Tagging
**Task ID:** HOMING-2026-11-26-006
**Date:** 2026-11-26
**Requirement:** REQ-1 — Navigation Restructure — Kabel sub-collections

---

## 1. Collections Created

| Title | Handle | Shopify ID | Tag condition | Inventory condition | Published |
|---|---|---|---|---|---|
| 2-adrige gedrehte Kabel | `2-adrige-gedrehte-kabel` | `gid://shopify/Collection/699937522001` | `cable-2t` TAGGED_WITH | GREATER_THAN 0 | ✓ Online Store |
| 2-adrige Rundkabel | `2-adrige-rundkabel` | `gid://shopify/Collection/699937554769` | `cable-2r` TAGGED_WITH | GREATER_THAN 0 | ✓ Online Store |
| 3-adrige gedrehte Kabel | `3-adrige-gedrehte-kabel` | `gid://shopify/Collection/699937587537` | `cable-3t` TAGGED_WITH | GREATER_THAN 0 | ✓ Online Store |
| 3-adrige Rundkabel | `3-adrige-rundkabel` | `gid://shopify/Collection/699937620305` | `cable-3r` TAGGED_WITH | GREATER_THAN 0 | ✓ Online Store |

Parent collection: `Textilkabel & Kabelzubehör` (`textilkabel-und-kabelzubehoer`, ID `gid://shopify/Collection/692770210129`)

---

## 2. Product Tagging — 45 Products, 3 Batches, 0 Errors

| Batch | Tag | Products | Errors |
|---|---|---|---|
| 1 | `cable-2t` | 10 | 0 |
| 1 | `cable-2r` | 5 | 0 |
| 2 | `cable-3t` (1–15) | 15 | 0 |
| 3 | `cable-3t` (16–19) | 4 | 0 |
| 3 | `cable-3r` | 11 | 0 |
| **Total** | | **45** | **0** |

Non-cable accessories (3 products with CGMLAG/SPSDP2YB/SPUSBM SKUs) correctly skipped.

Tags were ADDED to existing tag set — no existing tags removed. All products preserved: `["agent-work","batch:H-L57-1","cat:textilkabel-und-kabelzubehoer","dept:Lampenzubehör","src:shopify:108","verified"]`

---

## 3. Final Collection Counts (Shopify confirmed)

| Collection | Tagged products | In-stock (inventory > 0) | Collection count | Expected | Match |
|---|---|---|---|---|---|
| 2-adrige gedrehte Kabel | 10 | 10 | **10** | 10 | ✓ |
| 2-adrige Rundkabel | 5 | 4 (CL2RLG = 0 stock) | **4** | 4 | ✓ |
| 3-adrige gedrehte Kabel | 19 | 18 (CL3TLB = 0 stock) | **18** | 18 | ✓ |
| 3-adrige Rundkabel | 11 | 7 (4 zero-stock excluded) | **7** | 7 | ✓ |

Zero-stock products correctly excluded by inventory condition. They remain tagged and will auto-enter their collection when stock is added.

---

## 4. API Method

- `collectionCreate` mutation (aliased batch, single API call) — both conditions (tag + inventory) set at creation
- `publishablePublish` mutation (aliased batch) — publication ID `gid://shopify/Publication/362678681937`
- `productUpdate` mutation (3 batches of 15) — tags array passed in full preserving existing tags
- All zero `userErrors` on all mutations
