# Evidence: Homingmbh Shopify — Complete Collection List Discovery
**Task ID:** HOMING-2026-11-26-002
**Date:** 2026-11-26
**Store:** homingmbh.de (Homingmbh, Germany, EUR, Basic plan)
**Precursor task:** HOMING-2026-11-26-001 (435 products confirmed)
**Executed by:** Claude Code (read-only, no modifications)

---

## Summary

| Metric | Value |
|---|---|
| Total Collections | **17** |
| Pages Fetched | 1 (hasNextPage = false) |
| Pagination Complete | YES |
| Custom Collections | **1** (Home page — no conditions, manually managed) |
| Smart Collections (conditions-based) | **16** |
| Empty Collections (0 products) | **2** |
| Read-only | YES — no modifications made |

---

## Pagination Log

| Page | Collections Fetched | Cursor | hasNextPage |
|---|---|---|---|
| 1 | 17 | (start) | false — COMPLETE |

---

## Full Collection Inventory

| # | Numeric ID | Title | Handle | Type | Product Count | Condition Rule Summary |
|---|---|---|---|---|---|---|
| 1 | 691024724305 | Home page | frontpage | Smart (empty rules) | 1 | No conditions — manually managed |
| 2 | 692770079057 | Pendelleuchten | pendelleuchten | Smart | **0** ⚠️ | productType = "Pendelleuchten" |
| 3 | 692770111825 | Lampenschirme | lampenschirme | Smart | 111 | productType = "Lampenschirme" |
| 4 | 692770144593 | Netzteile & LED-Treiber | netzteile-und-led-treiber | Smart | 39 | productType = "Netzteile & LED-Treiber" |
| 5 | 692770177361 | Deckenleuchten & Spinnenlampen | deckenleuchten-und-spinnenlampen | Smart | **0** ⚠️ | productType = "Deckenleuchten & Spinnenlampen" |
| 6 | 692770210129 | Textilkabel & Kabelzubehör | textilkabel-und-kabelzubehoer | Smart | 48 | productType = "Textilkabel & Kabelzubehör" |
| 7 | 692770242897 | Abzweigdosen & Verbinder | abzweigdosen-und-verbinder | Smart | 16 | productType = "Abzweigdosen & Verbinder" |
| 8 | 692770275665 | Wandleuchten | wandleuchten | Smart | 94 | productType = "Wandleuchten" |
| 9 | 692770308433 | Baldachine & Deckenrosetten | baldachine-und-deckenrosetten | Smart | 44 | productType = "Baldachine & Deckenrosetten" |
| 10 | 692770341201 | Rohr- & Steampunk-Leuchten | rohr-und-steampunk-leuchten | Smart | 14 | productType = "Rohr- & Steampunk-Leuchten" |
| 11 | 692770373969 | Lampenfassungen | lampenfassungen | Smart | 32 | productType = "Lampenfassungen" |
| 12 | 692770406737 | Tisch- & Stehleuchten | tisch-und-stehleuchten | Smart | 1 | productType = "Tisch- & Stehleuchten" |
| 13 | 692770439505 | Leuchtmittel | leuchtmittel | Smart | 24 | productType = "Leuchtmittel" |
| 14 | 692770472273 | Außenleuchten | aussenleuchten | Smart | 5 | productType = "Außenleuchten" |
| 15 | 692770505041 | Leuchten | leuchten | Smart | 114 | productType IN [Pendelleuchten, Deckenleuchten & Spinnenlampen, Wandleuchten, Rohr- & Steampunk-Leuchten, Tisch- & Stehleuchten, Außenleuchten] — ANY |
| 16 | 692770537809 | Lampenzubehör | lampenzubehoer | Smart | 259 | productType IN [Lampenschirme, Textilkabel & Kabelzubehör, Baldachine & Deckenrosetten, Lampenfassungen, Leuchtmittel] — ANY |
| 17 | 692770570577 | Elektro | elektro | Smart | 55 | productType IN [Netzteile & LED-Treiber, Abzweigdosen & Verbinder] — ANY |

---

## Smart Collection Rules — Detail

All 16 smart collections use `CollectionConditionsSource` with `targetType: PRODUCTS`. All rules are based on `productType` matching. No tag-based, vendor-based, or title-based rules found.

### Single-type collections (match type: ALL, one condition)

| Collection | Rule | Values |
|---|---|---|
| Pendelleuchten | productType EQUALS | "Pendelleuchten" |
| Lampenschirme | productType EQUALS | "Lampenschirme" |
| Netzteile & LED-Treiber | productType EQUALS | "Netzteile & LED-Treiber" |
| Deckenleuchten & Spinnenlampen | productType EQUALS | "Deckenleuchten & Spinnenlampen" |
| Textilkabel & Kabelzubehör | productType EQUALS | "Textilkabel & Kabelzubehör" |
| Abzweigdosen & Verbinder | productType EQUALS | "Abzweigdosen & Verbinder" |
| Wandleuchten | productType EQUALS | "Wandleuchten" |
| Baldachine & Deckenrosetten | productType EQUALS | "Baldachine & Deckenrosetten" |
| Rohr- & Steampunk-Leuchten | productType EQUALS | "Rohr- & Steampunk-Leuchten" |
| Lampenfassungen | productType EQUALS | "Lampenfassungen" |
| Tisch- & Stehleuchten | productType EQUALS | "Tisch- & Stehleuchten" |
| Leuchtmittel | productType EQUALS | "Leuchtmittel" |
| Außenleuchten | productType EQUALS | "Außenleuchten" |

### Parent / group collections (match type: ANY, multi-value condition)

| Collection | Included Product Types |
|---|---|
| Leuchten | Pendelleuchten, Deckenleuchten & Spinnenlampen, Wandleuchten, Rohr- & Steampunk-Leuchten, Tisch- & Stehleuchten, Außenleuchten |
| Lampenzubehör | Lampenschirme, Textilkabel & Kabelzubehör, Baldachine & Deckenrosetten, Lampenfassungen, Leuchtmittel |
| Elektro | Netzteile & LED-Treiber, Abzweigdosen & Verbinder |

### Home page

`CollectionConditionsSource` present but `conditions: []` (empty) and `matchType: null` — behaves as a manually managed/custom collection. Currently has 1 product.

---

## Collection Hierarchy Map

```
Leuchten (114)
  ├── Pendelleuchten (0) ⚠️
  ├── Deckenleuchten & Spinnenlampen (0) ⚠️
  ├── Wandleuchten (94)
  ├── Rohr- & Steampunk-Leuchten (14)
  ├── Tisch- & Stehleuchten (1)
  └── Außenleuchten (5)

Lampenzubehör (259)
  ├── Lampenschirme (111)
  ├── Textilkabel & Kabelzubehör (48)
  ├── Baldachine & Deckenrosetten (44)
  ├── Lampenfassungen (32)
  └── Leuchtmittel (24)

Elektro (55)
  ├── Netzteile & LED-Treiber (39)
  └── Abzweigdosen & Verbinder (16)

Home page (1)  — standalone / manually managed
```

---

## Product Count Verification

| Verification | Expected | Actual | Match |
|---|---|---|---|
| Total store products | 435 | 435 | ✓ |
| Leuchten sub-collections sum | 114 | 0+0+94+14+1+5 = 114 | ✓ |
| Lampenzubehör sub-collections sum | 259 | 111+48+44+32+24 = 259 | ✓ |
| Elektro sub-collections sum | 55 | 39+16 = 55 | ✓ |
| Assigned across all leaf collections | 428 | 114+259+55 = 428 | ✓ |
| Unassigned products (not in any leaf collection) | 7 | 435−428 = 7 | ✓ |

**The 7 unassigned products match exactly the 7 gap products from HOMING-2026-11-26-001:**
- 3 untagged DRAFT products (vendor: homingmbh, types: Switching Mode Power Supplies, Ceiling and Pendant Lights, Lighting Parts — none match any collection's productType rule)
- 4 Transformatoren & Netzteile products (type = "Transformatoren & Netzteile", not "Netzteile & LED-Treiber" — typo/mismatch means they are ACTIVE but excluded from Elektro collection)

---

## Key Findings

1. **17 collections total** — all fetched in 1 page, no pagination needed.
2. **All 16 smart collections use productType-based rules only** — no tag, vendor, or title rules in use.
3. **3-level hierarchy confirmed**: 3 parent groups (Leuchten, Lampenzubehör, Elektro) → 13 leaf collections + Home page.
4. **2 empty collections**: Pendelleuchten (0) and Deckenleuchten & Spinnenlampen (0) — no products with these productType values exist in the store.
5. **7 products excluded from all collections** — matches Task 1 gap report exactly (3 homingmbh DRAFT + 4 Transformatoren with wrong type name).
6. **The 4 Transformatoren products are a naming mismatch**: productType = "Transformatoren & Netzteile" but the collection rule matches "Netzteile & LED-Treiber". These are ACTIVE products with no collection home.
7. **Home page collection has 1 product** — manually managed, no conditions.
8. **Collection strategy is entirely productType-driven** — the `cat:*` and `dept:*` tags on products are NOT used by any collection rule.

---

## Flags for Next Task

| Flag | Severity | Detail |
|---|---|---|
| Pendelleuchten collection empty | HIGH | No products have productType = "Pendelleuchten" — collection will never populate without products or rule change |
| Deckenleuchten & Spinnenlampen empty | HIGH | Same issue — no matching productType in store |
| 4 Transformatoren products excluded | MEDIUM | productType = "Transformatoren & Netzteile" does not match any collection rule — either rename type or add to Elektro rule |
| 3 homingmbh DRAFT products excluded | LOW | DRAFT, untagged, no productType match — require full setup before any collection assignment |
| Tags not used in collection rules | INFO | The `cat:*`, `dept:*`, `batch:*` tag system exists on products but no collection currently uses tags as criteria |

---

## Queryability
YES — this evidence file is self-contained and can be read by any future session without needing the API responses.
