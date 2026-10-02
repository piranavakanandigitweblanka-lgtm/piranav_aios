# Evidence — Conduit Sold Phase 2 Discovery
# SKU Structure + Component Logic + Stock Source

**Date**: 2026-10-01
**Session**: DM Dashboard Conduit Sold Phase 2 — Step 1 Discovery Only
**Status**: DISCOVERY COMPLETE — IMPLEMENTATION NOT STARTED
**Requirement ID**: DM-CONDUIT-SOLD-2026-10-01-P2-DISC

---

## Sources Inspected

| Source | What was checked |
|---|---|
| `ledsone-aios-knowledge-base` | `business/rules/sku-format-rules.md`, `stock-calculation-logic.md`, `platform-stock-update-rules.md`, `inventory-stock-management.md`, `database/mysql/configurator_db/tables/components_sot.md` |
| `inventory.products` | SKU/sku_original/inventory_bool for conduit-related prefixes |
| `inventory.local_inventory_current_stock_location_wise` | Live stock by inventory_id + warehouse_location |
| `inventory.product_pk` | Pack size character decoding table |
| `listings.shopify_listings` | Column schema, parent_sku relationship |
| `listings.shopify_collection_products` | Conduit product_ids (58 unique, 4 collections) |
| `configurator.components_sot_skus/attributes/attribute_values` | Component SOT scope check |
| `order_management.order_combo` | Combo order fulfillment records |

---

## A. SKU Structure — Verified

### Single product SKU
- `inventory_bool = true` in `inventory.products`
- Alphanumeric only (A–Z, 0–9)
- No separator
- Examples: `CRSF100BM`, `LHTTAGU10WH`, `PCBI100TP`, `LHTTE27BM`, `PHHC1BMRBM`

### Pack variant SKU
- Single base SKU + `<char>PK` suffix
- `<char>` decoded via `inventory.product_pk` table:
  `A=10, B=15, C=20, D=30, E=50, F=100, G=12, H=16, I=24, J=75, K=150, L=11, M=80, N=200, O=250, P=300, Q=500, R=1000, S=25, 1=1`
- Numeric digits (2, 3, 4, 5…) also used = literal pack quantity
- Pack variants have `inventory_bool = false` — treated as combo in stock calculation (single base ÷ pack size)
- Examples: `PCBI100TP2PK` (2-pack), `PCBSF2MCH3PK` (3-pack), `PCBI200TP5PK` (5-pack)

### Combo product SKU
- Component SKUs joined with `+`
- `inventory_bool = false` in `inventory.products`
- Each component may independently carry a `<char>PK` suffix
- 2-component to 6-component combos observed
- Examples:
  - `CRSF10025BM+PHHC1BMRBM` (2 components)
  - `PCBI20MX+CRFF75BY+LHTKE27BA` (3 components, all conduit-related)
  - `CRSF10025BM+PHSH1HETYB+SPCC360BM+LSLT360BM` (4 components)
  - `CRSF100BM2PK+LHLFE275BM2PK+LSDO300CB2PK` (3 components with 2PK each)

### ENC shortened SKU
- Used when full combo SKU exceeds platform character limit
- `sku` = `ENC{number}` (e.g. `ENC1`, `ENC8046`, `ENC10000`)
- `sku_original` = full combo SKU with `+` components
- `inventory_bool = false`
- Example: `ENC1` → `sku_original` = `CRSF2003BM+PHRB1PBR35BM3PK+LSWB135BM3PK+ICST64E27603PK`
- To decode: look up `inventory.products` where `sku = 'ENCxxx'` → read `sku_original`

### Amazon-only `_` suffix
- NOT used on Shopify
- Ignored for conduit Phase 2

---

## B. Product ID Relationship — Verified

```
inventory.products.id          → internal inventory ID (integer)
inventory.products.sku         → platform SKU (may be ENC code)
inventory.products.sku_original → full original SKU (critical for ENC lookups)
inventory.products.inventory_bool → true = single, false = combo/pack

listings.shopify_listings.item_id  → Shopify variant_id (NOT product_id)
listings.shopify_listings.parent_sku → Shopify handle/parent product identifier
                                       (NOT the bigint product_id from collection_products)

listings.shopify_collection_products.product_id → Shopify product_id (bigint)
```

**Key finding**: `listings.shopify_listings.parent_sku` is NOT equal to `shopify_collection_products.product_id`. These are different identifiers. Direct join between these two tables via those columns returned 0 rows.

**Phase 2 implication**: To look up Shopify listing SKUs for conduit products, a different join path is needed (via `shopify_listings_parent_child_mapping` or Shopify API `legacyResourceId` matching).

---

## C. Component Relationship — Verified

**The component relationship is encoded directly in `inventory.products.sku` via the `+` separator.**

There is no separate component mapping table for Shopify products.

### Decode algorithm (from `sku-format-rules.md`):
1. If SKU starts with `ENC` → look up `sku_original` in `inventory.products`
2. If SKU contains `+` → split on `+` → each part is a component
3. For each component, strip trailing `<char>PK` if present → base component SKU + pack quantity
4. Look up each base component in inventory

### `order_management.order_combo` — NOT a product definition table
Records what components were physically dispatched per order line.
Columns: `id`, `order_item_info_id`, `sku`, `qty`, `color`
Sample: `order_item_info_id=1259395 → PCBI20GMBM qty=2 + WSWTBC qty=1`
This is fulfillment data (after-the-fact), not the product → component mapping.

### `configurator.components_sot_skus` — NOT applicable to conduit
Contains 332 SKUs, **all with `source_tab = 'ceilingrose'`** (Ceiling Rose family only).
Verified: `CRFF10020BA`, `CRFF100BM`, `CRFF100CH` etc. — all Ceiling Rose, no conduit bushes/pipes.
NOT relevant for Conduit Phase 2.

---

## D. Stock Source — Verified

**Authoritative stock table**: `inventory.local_inventory_current_stock_location_wise`

| Column | Meaning |
|---|---|
| `inventory_id` | FK → `inventory.products.id` |
| `warehouse_location` | `UK`, `Germany`, `US`, `Canada` |
| `stock` | Pre-calculated available stock (integer, floored at 0) |

For Shopify UK conduit stock → filter `warehouse_location = 'UK'`.

**Contains both single product stock AND pre-calculated combo stock.**

### Query pattern:
```sql
SELECT p.sku, p.sku_original, p.inventory_bool, l.stock
FROM inventory.products p
JOIN inventory.local_inventory_current_stock_location_wise l ON l.inventory_id = p.id
WHERE p.sku IN ('CRSF100BM', 'LHTTAGU10WH', ...)
  AND l.warehouse_location = 'UK';
```

### Do NOT use:
- `listings.shopify_listings.quantity` — reflects platform caps and rules, not raw stock
- Physical warehouse tables — for dashboard purposes, pre-calculated stock is correct

---

## E. Combo Stock Logic — Verified

**Combo stock is pre-calculated by `GetInvStock` and stored in `local_inventory_current_stock_location_wise`.**

### Formula (`stock-calculation-logic.md`):
For each component:
1. `primaryStock` = sum(quantity - reserved_quantity) across UK warehouses
2. If `primaryStock ≤ 5` AND combo has > 1 component → check `alternativeStock`
3. `effectiveStock` = primary if > 5, else alternative (fallback to primary if alt ≤ 0)
4. `adjustedStock` = `floor(effectiveStock / packSize)` — never negative
5. Combo stock = `min(adjustedStock)` across all non-bulb components

### Verified example:
| SKU | Type | UK Stock |
|---|---|---|
| `CRSF10025BM` | single component | 0 |
| `PHHC1BMRBM` | single component | 92 |
| `CRSF10025BM+PHHC1BMRBM` | combo | **92** |

Observation: combo shows 92 even though CRSF10025BM has 0 UK primary stock. This is because `CRSF10025BM` primary stock ≤ 5 triggered the alternative warehouse lookup — alternative warehouse supplied 92+ units, making `effectiveStock = 92`. `min(92, 92) = 92`.

**Critical implication**: component standalone stock and combo stock may diverge when alternative warehouses are involved. Use the stored combo stock directly — do NOT re-derive by looking up component stocks.

### LHTTAGU10WH+LDGU10WW5 (appeared in Phase 1 orders):
| SKU | Type | UK Stock |
|---|---|---|
| `LHTTAGU10WH` | single | 0 |
| `LHTTAGU10WH+LDGU10WD5` | combo | 0 |
| `LHTTAGU10WH+LDGU10WW5` | combo | 0 |

Component is OOS → both combos OOS. Consistent.

---

## F. Out-of-Stock Logic — Verified

From `platform-stock-update-rules.md`:

| Condition | What gets pushed to Shopify |
|---|---|
| `available_stock = 0` | 0 (OOS on channel) |
| `available_stock` 1–3 (non-exempt) | **0** (zeroed out — threshold rule) |
| `available_stock > 3` | real number |

**Effective OOS threshold for Shopify = stock ≤ 3** (not just = 0)

For Phase 2 stock alert dashboard:
- **Hard OOS**: `stock = 0`
- **Near OOS** (channel shows 0 despite having some stock): `stock` 1–3
- **Low stock warning**: configurable threshold (e.g. ≤ 10)

---

## G. Live Stock Examples — Conduit SKUs

### Component SKUs with stock
| SKU | Description | UK Stock |
|---|---|---|
| CRSF100BM | Ceiling Rose 100mm Black | 2316 |
| CRSF100CH | Ceiling Rose 100mm Chrome | 1217 |
| CRSF100CO | Ceiling Rose 100mm Copper | 1976 |
| LHTTAGU10BM | GU10 lamp holder Black | 464 |
| LHTTAGU10YB | GU10 lamp holder Yellow Brass | 302 |
| LHTTE27BM | E27 lamp holder Black | 415 |
| PCBI100TP | Conduit pipe 100mm | (not yet queried) |

### Component SKUs at zero/near-zero
| SKU | Description | UK Stock |
|---|---|---|
| CRSF10025BM | Ceiling Rose 100x25mm Black | 0 |
| LHTTAGU10WH | GU10 lamp holder White | 0 |
| LHTTAGU10EBM | GU10 holder with cable Black | 0 |
| LHTTAGU10EYB | GU10 holder with cable YB | 0 |
| LHTTE27WH | E27 lamp holder White | 0 |

---

## H. PCBSF Prefix — GAP FOUND

**Phase 1 orders contained SKU `PCBSF2MCH3PK`** (conduit bush female, 20mm, Chrome, 3-pack).

Query for `PCBS%` and `PCBSF%` in `inventory.products` returned **0 rows**.

This means either:
1. PCBSF-prefix SKUs are in inventory but with a slightly different naming (e.g. `PCBSF` is actually a Shopify-specific SKU not in the PG mirror yet)
2. They are in the MySQL source (`order_management.inv_products` on vultr1) but not yet synced to `inventory.products` in PostgreSQL
3. They are listed as `wrong_sku = 1` on Shopify (and have no inventory record)

**ACTION REQUIRED**: Verify PCBSF SKUs via direct MySQL query on vultr1 or Shopify API variant lookup before implementing Phase 2 stock display for this SKU family.

---

## Recommended Phase 2 Data Model

### Backend query for conduit stock alert:

```sql
-- Step 1: get conduit product_ids (already done in Phase 1 via business DB)
-- Step 2: get Shopify listing SKUs for those products
-- Step 3: for each SKU, decode components and look up stock

-- Get stock for all conduit-related single component SKUs:
SELECT p.sku, p.sku_original, p.inventory_bool, l.stock
FROM inventory.products p
JOIN inventory.local_inventory_current_stock_location_wise l ON l.inventory_id = p.id
WHERE l.warehouse_location = 'UK'
  AND (
    p.sku IN (<list of conduit component SKUs from Shopify order history>)
    OR p.sku IN (<list of conduit combo SKUs>)
  );
```

### Phase 2 alert tiers (recommended):
| Tier | Condition | Alert |
|---|---|---|
| CRITICAL | `stock = 0` | "Out of stock — channel shows 0" |
| WARNING | `stock` 1–3 | "Near zero — channel shows 0 (threshold rule)" |
| LOW | `stock` 4–10 | "Low stock — monitor" |
| OK | `stock > 10` | No alert |

### Component decode at query time:
For combo SKUs, to show which component is the bottleneck:
1. Parse `+` in `sku` (or `sku_original` for ENC codes)
2. Strip `<char>PK` suffix from each component → base SKU + pack_qty
3. Look up each component in `inventory.local_inventory_current_stock_location_wise`
4. `floor(component_stock / pack_qty)` for each
5. Min = the bottleneck component
6. Display: "Combo out of stock because LHTTAGU10WH = 0"

---

---

## Phase 2A — Data Gap Verification (2026-10-02)

**Status: ALL 4 GAPS RESOLVED**

### GAP 1 — PCBSF SKUs: RESOLVED

Previous search used too-narrow pattern. All PCBSF SKUs confirmed in `inventory.products` PG mirror:

| SKU | inv_id | inventory_bool | UK Stock |
|---|---|---|---|
| PCBSF2MCH | 34679 | true (single) | 911 |
| PCBSF2MCH2PK | 35129 | false (2-pack) | 455 |
| PCBSF2MCH3PK | 34680 | false (3-pack) | 303 |
| PCBSF2MSN | 32922 | true (single) | 159 |

All appear in conduit-accessories collection (product_id=14822482411906). No MySQL vultr1 query needed.

---

### GAP 2 — Collection Product ID → SKU Join: RESOLVED

**Confirmed join path:**
```
listings.shopify_collections.handle
  → shopify_collections.collection_id (Shopify bigint)
  → listings.shopify_collection_products.collection_id
  → shopify_collection_products.product_id (Shopify product bigint)
  → listings.shopify_listings.item_id WHERE is_parent=1 AND sub_source=104
  → shopify_listings.id (internal integer)
  → listings.shopify_listings_parent_child_mapping.parent_id
  → shopify_listings_parent_child_mapping.child_id
  → listings.shopify_listings.id → .sku (variant rows)
```

Key facts:
- `shopify_listings` parent rows: `is_parent=1`, `sku=null`, `item_id` = Shopify product_id (bigint as varchar)
- `shopify_listings` variant rows: `is_parent=0`, `sku` populated, `item_id` = Shopify variant_id
- `sub_source=104` = UK LEDSone store
- `shopify_listings_parent_child_mapping` columns: `id`, `parent_id`, `child_id`, `child_order` (all ref shopify_listings.id)

**Evidence:** Traced product_id=8009880633594 → listing id=357670 → children with SKUs: PCGZ20MX, PCGZ20MX2PK, PCGZ20MX3PK, PCGZ20MX5PK. Confirmed working.

---

### GAP 3 — Complete UK Conduit SKU List: RESOLVED

**288 unique SKUs** across 4 UK conduit collections (sub_source=104):

| Collection | SKU Count | Product Count |
|---|---|---|
| conduit-accessories | 158 | 37 |
| conduit-lamp-holder | 22 | 3 |
| conduit-lighting | 253 | 49 |
| conduit-lightings | 125 | 20 |
| **TOTAL UNIQUE (deduplicated)** | **288** | **109** |

Per-collection counts sum to 558 — overlap because products appear in multiple collections. Unique count = 288.

List includes: single SKUs, pack variants (2PK/3PK/5PK/APK), combo SKUs (e.g. `PCBM20MX+PCDO20BM+PCBSM2FBM+RW1FG2PK`), ENC codes (e.g. ENC8047, ENC8401).

---

### GAP 4 — Alternative Warehouse Logic: RESOLVED

**Configuration column:** `inventory.product_mapping.alternative_inventory_id`

**Verified example:**
- `CRSF10025BM` (id=2559): `alternative_inventory_id = 344` = `CRSF100BM`
- `CRSF100BM` UK stock = 2316
- Trigger: if primaryStock ≤ 5 → use alternative stock
- Result: combo `CRSF10025BM+PHHC1BMRBM` = UK stock 92 (not 0), because alt-warehouse supplies 2316 → adjusted = 2316, min with PHHC1BMRBM (92) = 92

**Key finding:** Most conduit components have `alternative_inventory_id = null`. Alt-warehouse only applies to specifically configured SKUs. The stored combo stock in `local_inventory_current_stock_location_wise` already incorporates alt-warehouse logic — Phase 2 must NOT re-derive combo stock.

**Warehouse identifiers confirmed (all UK):**
- warehouse 1 = UK Unit3
- warehouse 6 = UK Unit18
- warehouse 8 = UK Unit4

`CRSF10025BM` is mapped to all 3 UK warehouses with the same alternative_inventory_id=344.

---

### End-to-End Validation — 5 SKUs

| SKU | Type | Collection | Shopify product_id | inv_id | UK Stock | Notes |
|---|---|---|---|---|---|---|
| CRSF100BM | single | conduit-accessories (component) | 14822482411906 | 344 | 2316 | OK |
| CRSF10025BM | single | conduit collections | linked via shopify_listings | 2559 | 0 | Alt-warehouse = CRSF100BM (2316); combo stock uses alt |
| PCBSF2MCH3PK | pack (3-pack) | conduit-accessories | 14822482411906 | 34680 | 303 | OK — was previously thought missing |
| CRSF10025BM+PHHC1BMRBM | combo (2-component) | conduit collections | N/A (combo product) | 36078 | 92 | Alt-warehouse active; do NOT re-derive |
| ENC8047 | ENC combo | conduit-accessories | 14881090568578 | 33552 | 110 | sku_original = PCFT90LBM+PCBSM2FYB+LHNSE27YB+SCRN70BM+LSFT220BM |

---

### Phase 2 Implementation — Recommended Queries

**Step 1: Get all conduit SKUs**
```sql
WITH conduit_products AS (
  SELECT DISTINCT scp.product_id
  FROM listings.shopify_collections sc
  JOIN listings.shopify_collection_products scp ON scp.collection_id = sc.collection_id
  WHERE sc.handle IN ('conduit-accessories','conduit-lamp-holder','conduit-lighting','conduit-lightings')
    AND sc.sub_source = 104 AND scp.is_deleted = 0
),
parent_listings AS (
  SELECT sl.id as listing_id, cp.product_id
  FROM conduit_products cp
  JOIN listings.shopify_listings sl ON sl.item_id = cp.product_id::varchar
    AND sl.is_parent = 1 AND sl.sub_source = 104
)
SELECT DISTINCT sc.handle, pl.product_id, sl_child.sku, sl_child.item_id as variant_id
FROM listings.shopify_collections sc
JOIN listings.shopify_collection_products scp ON scp.collection_id = sc.collection_id
JOIN parent_listings pl ON pl.product_id = scp.product_id
JOIN listings.shopify_listings_parent_child_mapping m ON m.parent_id = pl.listing_id
JOIN listings.shopify_listings sl_child ON sl_child.id = m.child_id
WHERE sc.handle IN ('conduit-accessories','conduit-lamp-holder','conduit-lighting','conduit-lightings')
  AND sc.sub_source = 104 AND scp.is_deleted = 0 AND sl_child.sku IS NOT NULL;
```

**Step 2: Get stock for all conduit SKUs**
```sql
SELECT p.sku, p.sku_original, p.inventory_bool, l.stock
FROM inventory.products p
JOIN inventory.local_inventory_current_stock_location_wise l ON l.inventory_id = p.id
WHERE p.sku IN (<conduit_sku_list>)
  AND l.warehouse_location = 'UK';
```

---

## Unknowns / Needs Confirmation

| # | Unknown | Impact |
|---|---|---|
| 1 | PCBSF prefix SKUs not in `inventory.products` PG mirror | Cannot show stock for this SKU family without MySQL lookup or Shopify API |
| 2 | `listings.shopify_listings.parent_sku` ↔ `shopify_collection_products.product_id` join path not confirmed | Need to verify correct join to get listing SKUs from product_ids |
| 3 | Which conduit products are sold as combo vs single on Shopify UK | Phase 1 order data is the best source — needs full SKU list from live data |
| 4 | Alternative warehouse identifiers for conduit components | Relevant for interpreting combo stock vs component standalone stock discrepancy |
