# Prompt — DM Dashboard: Thivajini Req 6 / Price Issue Correction
**Category:** dm-dashboard / implementation
**Status:** ACTIVE — build prompt (Phase 2 corrections incorporated)
**Date:** 2026-10-30
**Req ID:** DMDASH-TV-REQ6-2026-10-30

---

## What to Build

A new Thivajini dashboard requirement page: **FR Price Issue Correction**.

For every active/draft FR product variant, calculate what the price *should* be using two independent methods (Normal and Converted), then flag variants where the actual FR price differs from the calculated price by more than €0.01.

---

## Approved Specification

### Scope
- FR child listings only: `sub_source = 233`, `is_child = 1`, `status IN ('active', 'draft')`.
- Display **all** FR variants, including those that show up on more than one FR row — display each row separately and mark duplicates with a note in the response.

### Two Calculation Methods (independent — run both for every variant)

**Method 1 — Normal (no currency conversion)**
```
IF de_stock > 0 AND de_price valid:
    calc_normal = de_price          # already EUR

IF de_stock > 0 AND de_price missing/invalid/zero:
    calc_normal = CHECK DATA        # no UK fallback — reason: "DE stock exists but no valid DE price"

IF de_stock = 0 AND uk_price valid:
    calc_normal = ROUND((uk_price + 1.50) × 1.19, 2)   # no currency conversion

IF de_stock = 0 AND uk_price missing/invalid/zero:
    calc_normal = CHECK DATA        # reason: "No DE stock and no valid UK price"

IF de_stock record missing (no inventory row):
    calc_normal = CHECK DATA        # reason: "No DE inventory record — cannot determine stock status"
```

**Method 2 — Converted (GBP→EUR before formula)**
```
Same DE path as Method 1 (DE price used as-is — already EUR).

IF de_stock = 0 AND uk_price valid:
    calc_converted = ROUND((uk_price × ecb_rate + 1.50) × 1.19, 2)

IF de_stock = 0 AND uk_price missing/invalid/zero:
    calc_converted = CHECK DATA     # reason: "No DE stock and no valid UK price"

IF de_stock record missing:
    calc_converted = CHECK DATA     # reason: same as Normal
```

**Issue flag (per method):**
- `issue_normal = YES` if `ABS(fr_price - calc_normal) > 0.01` AND calc_normal is not CHECK DATA
- `issue_normal = NO` if `ABS(fr_price - calc_normal) <= 0.01`
- `issue_normal = CHECK DATA` if calc_normal is CHECK DATA (propagate reason)

Same logic for `issue_converted` / `check_data_reason_converted`.

### Price validity rule
A price is **invalid/missing** if it is NULL, zero, or negative. Any such value → CHECK DATA for that method.

### Duplicate SKU matching rule (verified from DB data)
For a given FR SKU, look up UK/DE prices in `listings.shopify_listings` grouped by SKU:
- If `COUNT(DISTINCT price) = 1` across all rows for that store → price is **unambiguous** — use it.
- If `COUNT(DISTINCT price) > 1` → price is **ambiguous** → CHECK DATA with reason `"Multiple UK/DE listings with conflicting prices for this SKU"`.
- Do NOT use DISTINCT ON or arbitrary row selection.

### UK listing scope for price lookup
Include `status IN ('active', 'draft', 'unlisted')` — **exclude `archived`** (only 1 row exists but confirmed not a valid active price source).

### DE listing scope for price lookup
Include `status IN ('active', 'draft')` — no `unlisted` or `archived` rows exist in DE.

### Warehouse stock lookup
Join: `inventory.products ip` (unique per SKU, confirmed) → `inventory.local_inventory_current_stock_location_wise w ON w.inventory_id = ip.id` filtered `w.warehouse_location = 'Germany'`.
- At most one row per SKU in `inventory.products` → no aggregation needed.
- At most one Germany row per product_id → no aggregation needed.
- LEFT JOIN: if no Germany row → de_stock = NULL → CHECK DATA.
- de_stock = 0 (row exists with stock = 0) → proceed to UK fallback.

### ECB Rate
Use `ecb_rate.py` → `fetch_gbp_eur_rate()`. Fetch **once per endpoint call** (no internal cache in the module). Wrap in try/except EcbRateError — if rate fetch fails, all Method 2 results that require conversion → CHECK DATA with reason `"ECB rate unavailable"`.

### KPI definitions (4 separate counts + 1 total)
| KPI | Definition |
|---|---|
| Normal YES | Count of variants where issue_normal = YES |
| Normal CHECK DATA | Count of variants where issue_normal = CHECK DATA |
| Converted YES | Count of variants where issue_converted = YES |
| Converted CHECK DATA | Count of variants where issue_converted = CHECK DATA |
| Total FR Variants | Total rows in result set (incl. FR duplicates — each counted separately) |

---

## Files to Create / Modify

| File | Action |
|---|---|
| `backend/app/dashboard_pages/price_issue_correction.py` | CREATE — Thivajini Req 6 backend router |
| `frontend/src/dashboard_pages/PriceIssueCorrection.jsx` | CREATE — Thivajini Req 6 frontend component |
| `backend/app/main.py` | MODIFY — +1 import + app.include_router(thivajini_price_issue_correction_router) |
| `frontend/src/taskRegistry.jsx` | MODIFY — +1 entry: thivajini.PriceIssueCorrection |

---

## Backend Router Pattern

```python
from fastapi import APIRouter, Depends
from ..core.task_auth import make_task_auth
from ..core.db import get_business_conn
from ..dev_tasks.ledsone_de_order_sync.ecb_rate import fetch_gbp_eur_rate, EcbRateError

router = APIRouter(prefix="/api/thivajini", tags=["thivajini"])
auth = make_task_auth("thivajini.PriceIssueCorrection")

@router.get("/req6")
async def get_price_issue_correction(conn=Depends(get_business_conn), _=Depends(auth)):
    ...
```

Route: `GET /api/thivajini/req6`
UAM key: `thivajini.PriceIssueCorrection`

---

## SQL Design (no DISTINCT ON — price uniqueness checked explicitly)

```sql
WITH fr AS (
    SELECT sku, item_id, price AS fr_price, status
    FROM listings.shopify_listings
    WHERE sub_source = 233 AND is_child = 1 AND status IN ('active', 'draft')
),
uk_price AS (
    SELECT sku,
           CASE WHEN COUNT(DISTINCT price) = 1 THEN MIN(price) ELSE NULL END AS uk_price,
           COUNT(DISTINCT price) > 1 AS uk_price_ambiguous
    FROM listings.shopify_listings
    WHERE sub_source = 104 AND is_child = 1 AND status IN ('active', 'draft', 'unlisted')
    GROUP BY sku
),
de_price AS (
    SELECT sku,
           CASE WHEN COUNT(DISTINCT price) = 1 THEN MIN(price) ELSE NULL END AS de_price,
           COUNT(DISTINCT price) > 1 AS de_price_ambiguous
    FROM listings.shopify_listings
    WHERE sub_source = 108 AND is_child = 1 AND status IN ('active', 'draft')
    GROUP BY sku
),
de_stock AS (
    SELECT ip.sku, w.stock AS de_stock
    FROM inventory.products ip
    LEFT JOIN inventory.local_inventory_current_stock_location_wise w
        ON w.inventory_id = ip.id AND w.warehouse_location = 'Germany'
)
SELECT
    fr.sku, fr.item_id, fr.fr_price, fr.status,
    ds.de_stock,
    dp.de_price, dp.de_price_ambiguous,
    up.uk_price, up.uk_price_ambiguous
FROM fr
LEFT JOIN de_stock ds ON ds.sku = fr.sku
LEFT JOIN de_price dp ON dp.sku = fr.sku
LEFT JOIN uk_price up ON up.sku = fr.sku
```

Calculation logic is applied in Python after fetching rows.

---

## API Response Shape

```json
{
  "kpi": {
    "total_fr_variants": 5706,
    "normal_yes": 312,
    "normal_check_data": 88,
    "converted_yes": 287,
    "converted_check_data": 91
  },
  "ecb_rate": 1.1842,
  "ecb_rate_reference_date": "2026-10-30",
  "rows": [
    {
      "sku": "...",
      "item_id": "67229921476683",
      "shop_inv_item_id": "69201114005579",
      "fr_price": 12.99,
      "status": "active",
      "de_stock": 5,
      "de_price": 12.99,
      "uk_price": null,
      "calc_normal": 12.99,
      "calc_converted": 12.99,
      "issue_normal": "NO",
      "issue_converted": "NO",
      "check_data_reason_normal": null,
      "check_data_reason_converted": null,
      "is_fr_duplicate": false
    }
  ]
}
```

---

## Frontend Component Pattern

- File: `frontend/src/dashboard_pages/PriceIssueCorrection.jsx`
- Use `apiFetch('/api/thivajini/req6')` for auth + error handling
- 4 KPI cards: Normal YES / Normal CHECK DATA / Converted YES / Converted CHECK DATA
- Table columns: SKU, FR Price, DE Stock, DE Price, UK Price, Calc Normal, Calc Converted, Issue Normal, Issue Converted, Reason
- Filter: Issue Normal / Issue Converted (All / YES / NO / CHECK DATA)
- CSV export via `downloadCsv` from `lib/csv.js`
- Show ECB rate + reference date in footer

---

## Test Plan (7 scenarios)

| # | Scenario | Expected |
|---|---|---|
| T1 | DE stock > 0, DE price 12.99, FR price 12.99 | issue_normal=NO, issue_converted=NO |
| T2 | DE stock > 0, DE price 12.99, FR price 14.00 | issue_normal=YES, issue_converted=YES |
| T3 | DE stock > 0, DE price NULL, FR price 12.99 | issue_normal=CHECK DATA, issue_converted=CHECK DATA |
| T4 | DE stock = 0, UK price 10.00, FR price 13.69 | calc_normal=ROUND((10+1.50)×1.19,2)=13.69 → issue_normal=NO |
| T5 | DE stock = 0, UK price 10.00, rate=1.18, FR price 13.63 | calc_converted=ROUND((10×1.18+1.50)×1.19,2)=15.58 → issue_converted=YES |
| T6 | No DE inventory row, FR price any | issue_normal=CHECK DATA, issue_converted=CHECK DATA, reason="No DE inventory record" |
| T7 | UK price ambiguous (2 distinct prices), DE stock=0 | issue_normal=CHECK DATA, reason="Multiple UK listings with conflicting prices" |

**Threshold boundary tests:**
- `ABS(diff) = 0.010` → NO (not > 0.01)
- `ABS(diff) = 0.011` → YES

---

## Linked AIOS Files

- Evidence: `evidence/dm-dashboard/dm-dashboard-thivajini-req6-price-issue-correction-preflight-2026-10-30.md`
- Validation: `validation/piranav/dm-dashboard-thivajini-req6-price-issue-correction-validation.md` (create at implementation)
- Closure: `closure/README.md` — DMDASH-TV-REQ6-2026-10-30
