# Evidence — Conduit Stock Alert Phase 2B — API Design + Validation

**Date**: 2026-10-02
**Session**: DM Dashboard Conduit Sold Phase 2B — Backend/API Design
**Status**: BACKEND COMPLETE — FRONTEND NOT STARTED
**Requirement ID**: DM-CONDUIT-STOCK-2026-10-02-P2B

---

## 1. Existing Architecture Review

Phase 1 file: `dm-dashboard/backend/app/admin_conduit_sold.py`

Reusable components:
| Component | Reuse Decision |
|---|---|
| `CONDUIT_HANDLES` list | Copied verbatim — same 4 collections |
| `_fetch_conduit_collections()` | NOT reused — Q1 in Phase 2 replaces it with richer query |
| `verify_admin_token()` from `.auth` | Reused — same admin-only pattern |
| `get_business_conn()` from `.db` | Reused — same DB connection |
| In-memory cache pattern (`_CACHE`, `_CACHE_VERSION`, `_CACHE_TTL`) | Reused pattern, own cache instance |
| `ShopifyNotConfigured` / `graphql` imports | NOT imported — Phase 2 is PostgreSQL-only |

---

## 2. API Decision: Dedicated `/api/admin/conduit-stock`

**Decision: Dedicated endpoint.**

Reason: The two endpoints have fundamentally different characteristics:

| Dimension | Phase 1 `/conduit-sold` | Phase 2 `/conduit-stock` |
|---|---|---|
| Data source | Shopify API (GraphQL pagination) | PostgreSQL only |
| First-load time | 1–3 minutes | Sub-second |
| Cache TTL | 15 min (Shopify rate limit) | 5 min (stock updates periodically) |
| Response shape | Nested order history by month | Flat SKU list with stock |
| Blocking concern | Shopify pagination blocks response | No blocking |

Mixing them would couple two incompatible TTL requirements and force the stock tab to wait on Shopify pagination. A dedicated endpoint allows the stock tab to load instantly and independently.

---

## 3. API Contract

**Endpoint**: `GET /api/admin/conduit-stock`
**Auth**: `Authorization: Bearer {admin_jwt}`
**Query param**: `?refresh=1` to bypass cache

### Response structure

```json
{
  "success": true,
  "generatedAt": "2026-10-02T10:00:00+00:00",
  "store": "ledsone.co.uk (UK)",
  "collections": ["conduit-accessories", "conduit-lamp-holder", "conduit-lighting", "conduit-lightings"],
  "summary": {
    "total": 288,
    "by_alert": { "CRITICAL": 34, "WARNING": 23, "LOW": 56, "OK": 175 },
    "by_type": { "single": 135, "pack": 34, "combo": 74, "enc": 45 }
  },
  "skus": [
    {
      "sku": "CRSF100BM",
      "sku_original": null,
      "sku_type": "single",
      "inv_id": 344,
      "collections": ["conduit-accessories", "conduit-lighting"],
      "product_ids": ["14822482411906"],
      "stock": 2316,
      "alert_status": "OK",
      "alternative_inventory_id": null,
      "alternative_sku": null
    },
    {
      "sku": "CRSF10025BM",
      "sku_original": null,
      "sku_type": "single",
      "inv_id": 2559,
      "collections": ["conduit-accessories", "conduit-lighting"],
      "product_ids": ["..."],
      "stock": 0,
      "alert_status": "CRITICAL",
      "alternative_inventory_id": 344,
      "alternative_sku": "CRSF100BM"
    },
    {
      "sku": "PCBSF2MCH3PK",
      "sku_original": null,
      "sku_type": "pack",
      "inv_id": 34680,
      "collections": ["conduit-accessories"],
      "product_ids": ["14822482411906"],
      "stock": 303,
      "alert_status": "OK",
      "alternative_inventory_id": null,
      "alternative_sku": null
    },
    {
      "sku": "LHTTAGU10WH+LDGU10WD5",
      "sku_original": null,
      "sku_type": "combo",
      "inv_id": "...",
      "collections": ["conduit-lighting", "conduit-lightings"],
      "product_ids": ["..."],
      "stock": 0,
      "alert_status": "CRITICAL",
      "alternative_inventory_id": null,
      "alternative_sku": null,
      "components": [
        { "sku": "LHTTAGU10WH", "stock": 0, "alert_status": "CRITICAL", "is_bottleneck": true },
        { "sku": "LDGU10WD5",   "stock": 0, "alert_status": "CRITICAL", "is_bottleneck": true }
      ]
    },
    {
      "sku": "ENC8401",
      "sku_original": "PCGZ20MT+PCDO20CO+PCBSM2FCO+LHNSE27CO",
      "sku_type": "enc",
      "inv_id": "...",
      "collections": ["conduit-accessories"],
      "product_ids": ["14881090568578"],
      "stock": 6,
      "alert_status": "LOW",
      "alternative_inventory_id": null,
      "alternative_sku": null,
      "components": [
        { "sku": "PCGZ20MT",    "stock": 6,    "alert_status": "LOW", "is_bottleneck": true },
        { "sku": "PCDO20CO",    "stock": 100,  "alert_status": "OK",  "is_bottleneck": false },
        { "sku": "PCBSM2FCO",   "stock": 56,   "alert_status": "OK",  "is_bottleneck": false },
        { "sku": "LHNSE27CO",   "stock": 1015, "alert_status": "OK",  "is_bottleneck": false }
      ]
    }
  ],
  "meta": {
    "stockSource": "inventory.local_inventory_current_stock_location_wise, warehouse_location='UK'",
    "comboRule": "Stored combo stock is authoritative — never recalculated. Components decoded from '+' separator for display only.",
    "alertTiers": {
      "CRITICAL": "stock = 0 (channel shows 0)",
      "WARNING": "stock 1–3 (channel shows 0, platform threshold rule)",
      "LOW": "stock 4–10 (monitor)",
      "OK": "stock > 10"
    }
  }
}
```

---

## 4. SQL/Data Query Design

**3 queries total. All PostgreSQL. No Shopify API.**

### Q1 — Collection → SKU mapping

```sql
WITH conduit_products AS (
  SELECT DISTINCT scp.product_id, sc.handle
  FROM listings.shopify_collections sc
  JOIN listings.shopify_collection_products scp ON scp.collection_id = sc.collection_id
  WHERE sc.handle = ANY(%s) AND sc.sub_source = 104 AND scp.is_deleted = 0
),
parent_listings AS (
  SELECT sl.id AS listing_id, cp.product_id, cp.handle
  FROM conduit_products cp
  JOIN listings.shopify_listings sl
    ON sl.item_id = cp.product_id::varchar AND sl.is_parent = 1 AND sl.sub_source = 104
)
SELECT sl_child.sku, pl.handle AS collection, pl.product_id
FROM parent_listings pl
JOIN listings.shopify_listings_parent_child_mapping m ON m.parent_id = pl.listing_id
JOIN listings.shopify_listings sl_child ON sl_child.id = m.child_id
WHERE sl_child.sku IS NOT NULL
ORDER BY sl_child.sku, pl.handle
```

Returns ~500 rows (SKU × collection pairs). Deduplicated in Python to `{sku: [collections]}`.

**Duplicate collection membership handling**: 244 of 288 SKUs appear in 2 collections, 13 in 3 collections. Python aggregates them into `collections: []` per SKU. The API returns exactly 1 record per unique SKU. No duplicate SKU records.

### Q2 — Inventory metadata + UK stock

```sql
SELECT DISTINCT ON (p.sku)
  p.id, p.sku, p.sku_original, p.inventory_bool, l.stock,
  pm.alternative_inventory_id, alt.sku AS alt_sku
FROM inventory.products p
JOIN inventory.local_inventory_current_stock_location_wise l
  ON l.inventory_id = p.id AND l.warehouse_location = 'UK'
LEFT JOIN inventory.product_mapping pm ON pm.inventory_id = p.id
LEFT JOIN inventory.products alt ON alt.id = pm.alternative_inventory_id
WHERE p.sku = ANY(%s)
ORDER BY p.sku, pm.alternative_inventory_id NULLS LAST
```

`DISTINCT ON (p.sku)` eliminates duplicate product_mapping rows (one row per warehouse per SKU in product_mapping; all carry the same alternative_inventory_id). Returns exactly 1 row per SKU.

### Q3 — Component stock (bulk)

```sql
SELECT DISTINCT ON (p.sku) p.sku, l.stock
FROM inventory.products p
JOIN inventory.local_inventory_current_stock_location_wise l
  ON l.inventory_id = p.id AND l.warehouse_location = 'UK'
WHERE p.sku = ANY(%s)
ORDER BY p.sku
```

Bulk fetch for all component SKUs decoded from combo/ENC SKUs. Single query regardless of how many components exist. Returns ~100–200 rows.

---

## 5. SKU Classification

```python
def _classify_sku(sku: str, inventory_bool: bool) -> str:
    if sku.upper().startswith("ENC"):  return "enc"
    if "+" in sku:                     return "combo"
    if not inventory_bool:             return "pack"
    return "single"
```

Rules applied in priority order:
1. ENC prefix → always `enc` (may contain + in sku_original but the sku itself is ENC)
2. `+` in SKU → `combo`
3. `inventory_bool = false`, no `+`, no ENC → `pack` (e.g. PCBSF2MCH3PK)
4. Otherwise → `single`

**Validated type counts (288 unique SKUs):**
- single: 135
- combo: 74
- enc: 45
- pack: 34
- Total: 288 ✅

---

## 6. Combo Explanation Logic

### Component decode

```python
def _decode_components(sku: str, sku_original: str | None) -> list[str]:
    raw = sku_original if (sku_original and sku_original != sku) else sku
    if "+" not in raw:
        return []
    return [c.strip() for c in raw.split("+") if c.strip()]
```

For ENC: uses `sku_original` (the full combo string).
For combo: uses `sku` directly.

### is_bottleneck rule

```python
is_bottleneck = (stock <= 10) and (comp_stock_val <= stock + 2)
```

Logic:
- Only fire when combo is not healthy (stock ≤ 10: LOW, WARNING, or CRITICAL)
- A component is the bottleneck when its stock is within 2 units of the combo stock (the constraining component)
- Does NOT recalculate combo stock — purely approximate identification for display

**Validation:**

| Combo | stock | Component | comp_stock | is_bottleneck |
|---|---|---|---|---|
| LHTTAGU10WH+LDGU10WD5 | 0 | LHTTAGU10WH | 0 | `(0≤10) AND (0≤2)` = ✅ True |
| LHTTAGU10WH+LDGU10WD5 | 0 | LDGU10WD5 | 0 | `(0≤10) AND (0≤2)` = ✅ True |
| ENC8401 | 6 | PCGZ20MT | 6 | `(6≤10) AND (6≤8)` = ✅ True |
| ENC8401 | 6 | LHNSE27CO | 1015 | `(6≤10) AND (1015≤8)` = ✅ False |
| CRSF10025BM+PHHC1BMRBM | 92 | CRSF10025BM | 0 | `(92≤10)` = ✅ False (combo OK via alt-warehouse) |

---

## 7. Stock Logic

| Stock value | alert_status | Channel state |
|---|---|---|
| 0 | CRITICAL | Shows 0 on Shopify |
| 1–3 | WARNING | Shows 0 on Shopify (platform threshold rule) |
| 4–10 | LOW | Shows real number; monitor |
| > 10 | OK | Healthy |

Source: `inventory.local_inventory_current_stock_location_wise WHERE warehouse_location = 'UK'`

**Alternative inventory**: Stored in `inventory.product_mapping.alternative_inventory_id`. Displayed in API (`alternative_inventory_id`, `alternative_sku`) for transparency. Does NOT replace the authoritative stored stock.

---

## 8. Validation Results

### Check 1 — Total unique SKU count = 288 ✅
Query returned 288. Confirmed.

### Check 2 — Every SKU belongs to at least one of 4 collections ✅
All SKUs come from the collection→parent→child join restricted to the 4 conduit handles.

### Check 3 — Collection membership deduplication ✅
- 31 SKUs in 1 collection
- 244 SKUs in 2 collections
- 13 SKUs in 3 collections
- API returns 1 record per SKU with `collections: []` array.

### Check 4 — Stock from authoritative source ✅
All stock values from `inventory.local_inventory_current_stock_location_wise WHERE warehouse_location='UK'`.

### Check 5 — Combo stock NOT recalculated ✅
`CRSF10025BM+PHHC1BMRBM` stored stock=92 returned as-is. `CRSF10025BM` single stock=0 does not override combo.

### Check 6 — ENC resolution via sku_original ✅
`ENC8401` → sku_original = `PCGZ20MT+PCDO20CO+PCBSM2FCO+LHNSE27CO` decoded via `_decode_components`.

### Check 7 — Component explanation works ✅
ENC8401 (stock=6): PCGZ20MT identified as bottleneck (stock=6, is_bottleneck=True). 3 other components with OK stock not flagged.

### Check 8 — Alternative inventory doesn't replace stored stock ✅
`CRSF10025BM` stored stock=0 returned as stock=0 with `alternative_sku: "CRSF100BM"` as supplementary info.

### Real examples by type and alert status

**Singles:**
| SKU | Stock | Alert |
|---|---|---|
| CRSF100BM | 2316 | OK |
| PCBSF2MCH | 911 | OK |
| CRSF10025BM | 0 | CRITICAL (alt=CRSF100BM, stock=2316) |
| CRFF65YB | 1 | WARNING |
| PCGZ400TP | 0 | CRITICAL (alt=PCRN400TP) |

**Packs:**
| SKU | Stock | Alert |
|---|---|---|
| PCBSF2MCH3PK | 303 | OK |
| PCBSF2MCH2PK | 455 | OK |
| PCGZ20MX2PK | 66 | OK |
| PCGZ20MX3PK | 44 | OK |

**Combos:**
| SKU | Combo Stock | Alert | Bottleneck |
|---|---|---|---|
| CRSF10025BM+PHHC1BMRBM | 92 | OK | None (healthy) |
| CRSF100BM+PHHC1BMRBM | 92 | OK | None |
| LHTTAGU10WH+LDGU10WD5 | 0 | CRITICAL | Both components (stock=0) |
| CRFF65YB+LHTTAGU10YB+LDGU10WW5 | 1 | WARNING | At least 1 component |

**ENC:**
| SKU | sku_original | Stock | Alert | Bottleneck |
|---|---|---|---|---|
| ENC8047 | PCFT90LBM+PCBSM2FYB+LHNSE27YB+SCRN70BM+LSFT220BM | 110 | OK | None |
| ENC8401 | PCGZ20MT+PCDO20CO+PCBSM2FCO+LHNSE27CO | 6 | LOW | PCGZ20MT (stock=6) |
| ENC8051 | (decoded at runtime) | 1 | WARNING | TBD at runtime |

---

## 9. Performance Assessment

| Metric | Value |
|---|---|
| Number of queries | 3 (all PostgreSQL) |
| Shopify API calls | 0 |
| Expected response time (uncached) | < 200ms |
| Expected response time (cached) | < 5ms |
| Estimated response size | ~120–150KB JSON (288 SKUs × avg 200 bytes + 119 combo/ENC × 5 components × 100 bytes) |
| Cache TTL | 5 minutes |
| Cache invalidation | `?refresh=1` or `_CACHE_VERSION` bump |

Cache TTL = 5 min chosen because:
- Stock syncs every few hours (more frequent than monthly order history)
- Repeated clicks on the stock tab (e.g., during incident triage) should get fresh data sooner
- 5 min still prevents DB hammering on rapid reloads

---

## 10. Security Assessment

| Control | Implementation |
|---|---|
| Admin authentication | `verify_admin_token(request.headers.get("Authorization"))` — same as all admin endpoints |
| 401/403 on invalid token | Enforced by `verify_admin_token` (raises HTTPException) |
| No DB credentials in response | No connection strings, passwords, or DSN in payload |
| No Shopify token | No Shopify imports or calls in this file |
| No internal infra details | Only stock counts, SKU names, and alert tiers exposed |
| Sensitive inventory data scope | Only UK stock counts — no cost, supplier, or warehouse location details |

---

## 11. Files Changed

| File | Action | Notes |
|---|---|---|
| `dm-dashboard/backend/app/admin_conduit_stock.py` | CREATED | New endpoint, 180 lines |
| `dm-dashboard/backend/app/main.py` | MODIFIED | +2 lines: import + `include_router` |

Frontend files: NOT modified. No React, no CSS, no components.

---

## 12. Implementation Readiness

```
READY FOR FRONTEND DESIGN
```

All 8 validation checks pass. Backend written and registered. API contract documented.
Blocked items: none.

---

## Files Created/Modified This Session
- `dm-dashboard/backend/app/admin_conduit_stock.py` — CREATED
- `dm-dashboard/backend/app/main.py` — MODIFIED (+2 lines)
- `evidence/dm-dashboard/conduit-sold-phase2b-api-design-2026-10-02.md` — this file
- `validation/piranav/conduit-sold-phase2b-validation-2026-10-02.md` — CREATED
- `prompts/dm-dashboard/conduit-sold-phase2b-backend.md` — CREATED
- `closure/README.md` — UPDATED
