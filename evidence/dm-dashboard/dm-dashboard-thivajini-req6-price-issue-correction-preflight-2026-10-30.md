# DM Dashboard — Thivajini Req 6: Price Issue Correction — Pre-Implementation Evidence
**Req ID:** DMDASH-TV-REQ6-2026-10-30
**Date:** 2026-10-30 (updated 2026-10-30 — clarifications pass)
**Phase:** Pre-Implementation (Discovery + Corrections + Final Clarifications)
**Prepared by:** Claude Code
**Status:** AWAITING PIRANAV APPROVAL — no implementation has begun

---

## 1. Summary

Full investigation and corrections pass for Thivajini Req 6 (FR Price Issue Correction). This document consolidates:
- Phase 2 data source + architecture discovery findings
- 5 mandatory corrections issued by Piranav
- DB verification queries and results for all corrections

No application code has been modified. No database records have been modified.

---

## 2. FR Scope Verification

| Field | Value | Source |
|---|---|---|
| FR sub_source | 233 | `dashboard_pages/shared.py` TV_SUB_SOURCE = 233 |
| FR status scope | `active` + `draft` | Piranav correction — NOT active-only |
| FR child rows | `is_child = 1` | Standard Shopify listings pattern |
| FR duplicate handling | Display all rows separately; mark is_fr_duplicate=true | Piranav correction |

---

## 3. DE/UK Price Source Verification

### UK statuses in DB (sub_source=104, is_child=1)

| status | row count |
|---|---|
| active | 17,628 |
| draft | 902 |
| unlisted | 93 |
| archived | 1 |

**Decision:** Include `active`, `draft`, `unlisted`. Exclude `archived` (1 row — not a valid active price source).

### DE statuses in DB (sub_source=108, is_child=1)

| status | row count |
|---|---|
| active | 11,629 |
| draft | 1,581 |

**Decision:** Include `active` and `draft` (no unlisted or archived in DE).

---

## 4. Duplicate SKU Price Analysis (DB-verified)

### Correction 1 — Cross-Store Duplicate Matching Strategy

**Mandate:** Never silently select an arbitrary price row when multiple exist. Use COUNT(DISTINCT price) to determine ambiguity.

#### UK duplicate analysis (FR-matched SKUs)

| Category | Count |
|---|---|
| FR SKUs with any UK match | 4,559 |
| Single UK row (no duplication) | 3,261 |
| Multiple rows — identical price (`distinct_prices = 1`) | 1,175 |
| Multiple rows — conflicting prices (`distinct_prices > 1`) | 123 |

**Rule applied:** `COUNT(DISTINCT price) = 1` → use that price (unambiguous regardless of row count). `COUNT(DISTINCT price) > 1` → CHECK DATA with reason "Multiple UK listings with conflicting prices for this SKU".

**Examples — unambiguous (safe to use):**
- `CRSF100BM`: 12 UK rows, all £4.45
- `CRSFDUMMYSKU1`: 10 rows, all £10.72
- `LSFT220FG+RPR44WH`: 6 rows, all £12.89

**Examples — ambiguous (CHECK DATA):**
- `CRSFDUMMYSKU`: 2 distinct prices (£8.00 vs £23.89)
- `LDMG125E278`: 3 distinct prices (£7.49–£8.49)
- `LDMG80B224`: 2 distinct prices (£4.15 vs £4.74)

#### DE duplicate analysis (FR-matched SKUs)

| Category | Count |
|---|---|
| FR SKUs with any DE match | 2,304 |
| Single DE row | 2,043 |
| Multiple rows — identical price | 154 |
| Multiple rows — conflicting prices | 107 |

Same rule applies for DE.

---

## 5. Warehouse Stock Cardinality (DB-verified)

### Correction 2 — Warehouse Stock Cardinality

**Mandate:** Confirm no aggregation needed. Confirm LEFT JOIN behaviour for missing rows.

#### `inventory.products` cardinality
Query: `SELECT sku, COUNT(*) FROM inventory.products GROUP BY sku HAVING COUNT(*) > 1`
Result: **0 rows** — each SKU is unique. No multi-ID concern. One LEFT JOIN returns at most one product row per SKU.

#### `local_inventory_current_stock_location_wise` cardinality
Query: `SELECT ip.sku, w.warehouse_location, COUNT(*) FROM inventory.products ip LEFT JOIN inventory.local_inventory_current_stock_location_wise w ON w.inventory_id = ip.id GROUP BY ip.sku, w.warehouse_location HAVING COUNT(*) > 1`
Result: **0 rows** — at most one Germany row per product. No aggregation needed.

**LEFT JOIN behaviour confirmed:**
- SKU exists in `inventory.products` + Germany row exists → de_stock = stock value (may be 0)
- SKU exists in `inventory.products` + no Germany row → de_stock = NULL → CHECK DATA
- SKU not in `inventory.products` → no join row → de_stock = NULL → CHECK DATA

---

## 6. Calculation Logic — Corrections Applied

### Correction 3 — Price Validation

| Condition | Both Methods Result |
|---|---|
| DE stock > 0, DE price valid (> 0) | Use DE price as calc (already EUR) |
| DE stock > 0, DE price NULL / zero / negative | CHECK DATA — "DE stock exists but no valid DE price". NO UK fallback. |
| DE stock = 0, UK price valid | Method 1: ROUND((uk_price + 1.50) × 1.19, 2). Method 2: ROUND((uk_price × rate + 1.50) × 1.19, 2) |
| DE stock = 0, UK price NULL / zero / negative | CHECK DATA — "No DE stock and no valid UK price" |
| de_stock = NULL (no inventory record) | CHECK DATA — "No DE inventory record — cannot determine stock status" |
| UK price ambiguous (distinct prices > 1) | CHECK DATA — "Multiple UK listings with conflicting prices for this SKU" |
| DE price ambiguous (distinct prices > 1) | CHECK DATA — "Multiple DE listings with conflicting prices for this SKU" |
| ECB rate fetch fails (EcbRateError) | Method 2 only → CHECK DATA — "ECB rate unavailable". Method 1 unaffected. |

### Correction 4 — Difference Threshold

**Rule:** `ABS(fr_price - calc_price) > 0.01` → issue = YES. `<= 0.01` → issue = NO.

**Boundary test cases:**
| fr_price | calc_price | ABS diff | Result |
|---|---|---|---|
| 12.99 | 12.99 | 0.000 | NO |
| 12.99 | 13.00 | 0.010 | NO (not > 0.01) |
| 12.99 | 13.01 | 0.020 | YES |
| 13.10 | 12.99 | 0.110 | YES |
| 0.00 (calc=CHECK DATA) | n/a | n/a | CHECK DATA |

---

## 7. KPI Definitions — Corrections Applied

### Correction 5 — Separate KPI per Method

| KPI | Definition |
|---|---|
| Normal YES | Rows where issue_normal = YES |
| Normal CHECK DATA | Rows where issue_normal = CHECK DATA |
| Converted YES | Rows where issue_converted = YES |
| Converted CHECK DATA | Rows where issue_converted = CHECK DATA |
| Total FR Variants | All rows in result (FR duplicates counted separately) |

**Not permitted:** Combined issue count. Each method reported independently.

---

## 8. Route and UAM

| Property | Value |
|---|---|
| Route | `GET /api/thivajini/req6` |
| UAM key | `thivajini.PriceIssueCorrection` |
| Router prefix | `/api/thivajini` (existing, shared with Req1–Req5) |
| Route collision check | Confirmed CLEAR — `/req6` not used by any other Thivajini or other prefix |

---

## 9. ECB Rate Module

| Property | Value |
|---|---|
| File | `backend/app/dev_tasks/ledsone_de_order_sync/ecb_rate.py` |
| Import | `from ..dev_tasks.ledsone_de_order_sync.ecb_rate import fetch_gbp_eur_rate, EcbRateError, RateResult` |
| Returns | `RateResult(rate: float, reference_date: str, retrieved_at: str, source: str)` |
| Cache | None — must call once per endpoint invocation |
| Fallback behaviour | Raises `EcbRateError` if all 3 sources fail |

---

## 10. Files to Create / Modify

| File | Action | Notes |
|---|---|---|
| `backend/app/dashboard_pages/price_issue_correction.py` | CREATE | New file — Req 6 backend router |
| `frontend/src/dashboard_pages/PriceIssueCorrection.jsx` | CREATE | New file — Req 6 frontend |
| `backend/app/main.py` | MODIFY | +1 import line + 1 app.include_router call |
| `frontend/src/taskRegistry.jsx` | MODIFY | +1 entry at line 148 |

No other files require modification.

---

## 11. Remaining Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | 123 UK SKUs have ambiguous prices (multi-price) — these will produce CHECK DATA | LOW | Expected and documented — correct per spec |
| R2 | 107 DE SKUs have ambiguous prices | LOW | Same |
| R3 | ECB rate API could be down at fetch time | LOW | `EcbRateError` caught — Method 2 returns CHECK DATA, not 500 |
| R4 | FR duplicate display (362 FR SKUs appear 2–3× per earlier query) | INFO | Each row shown separately + `is_fr_duplicate` flag — no data hidden |
| R5 | UK `unlisted` (93 rows) included in price lookup | INFO | Confirmed intentional — valid UK price source |

---

## 12. DB Queries Executed (Evidence)

```sql
-- Query 1: UK duplicate price disambiguation
WITH fr_skus AS (
    SELECT DISTINCT sku FROM listings.shopify_listings
    WHERE sub_source = 233 AND is_child = 1 AND sku IS NOT NULL AND sku != ''
),
uk_analysis AS (
    SELECT uk.sku,
           COUNT(*) AS uk_row_count,
           COUNT(DISTINCT uk.price) AS distinct_uk_prices
    FROM listings.shopify_listings uk JOIN fr_skus f ON f.sku = uk.sku
    WHERE uk.sub_source = 104 AND uk.is_child = 1
    GROUP BY uk.sku
)
SELECT
    COUNT(*) AS fr_skus_with_uk_match,
    COUNT(*) FILTER (WHERE uk_row_count = 1) AS single_uk_row,
    COUNT(*) FILTER (WHERE uk_row_count > 1 AND distinct_uk_prices = 1) AS multi_row_same_price,
    COUNT(*) FILTER (WHERE uk_row_count > 1 AND distinct_uk_prices > 1) AS multi_row_diff_price
FROM uk_analysis;
-- Result: {4559, 3261, 1175, 123}

-- Query 2: DE duplicate price disambiguation
-- Result: {2304, 2043, 154, 107}

-- Query 3: inventory.products cardinality
-- Result: 0 rows (no duplicate SKUs)

-- Query 4: warehouse stock cardinality
-- Result: 0 rows (no duplicate stock rows per SKU+warehouse)

-- Query 5: UK/DE listing statuses
-- UK: active=17628, draft=902, unlisted=93, archived=1
-- DE: active=11629, draft=1581
```

---

## 13. Clarifications Pass — DB Findings (2026-10-30)

### Point 1 — FR Row Count

| Status | Count |
|---|---|
| active | 5,338 |
| draft | 368 |
| **Total** | **5,706** |

No other statuses exist for FR child listings. `status IN ('active', 'draft')` captures **100% of all FR child rows**. The 4,712 figure in the previous API response example was an illustrative placeholder only — not a real query result. Zero rows are excluded.

### Point 2 — NULL Prices in Duplicate Groups

| Store | Multi-row SKUs | Mixed NULL + valid (same price) | Mixed NULL + conflicting prices | All NULL | No NULL same price | No NULL diff price |
|---|---|---|---|---|---|---|
| UK | 1,298 | **0** | **0** | **0** | 1,175 | 123 |
| DE | 261 | **0** | **0** | **0** | 154 | 107 |

**Finding:** Zero NULL prices exist in any multi-row duplicate group for UK or DE. All rows in every duplicate group carry a non-null price. `COUNT(DISTINCT price)` is safe — no NULLs are masking ambiguity.

The separate price validity rule (NULL / zero price = CHECK DATA) still applies to single-row SKUs.

### Point 3 — Product ID and Variant ID Schema

Full `shopify_listings` column inventory (32 columns). ID-relevant columns for FR child rows:

| Column | Type | Nullable | Populated (FR child) | Distinct | Meaning |
|---|---|---|---|---|---|
| `id` | integer | NOT NULL | 5,706/5,706 | 5,706 | Internal DB row ID — not a Shopify ID |
| `item_id` | varchar | YES | **5,706/5,706** | **5,706** | **Shopify variant ID** |
| `shop_inv_item_id` | varchar | YES | **5,706/5,706** | 5,706 | Shopify inventory item ID |
| `parent_sku` | varchar | YES | **0/5,706 — ALL NULL** | 0 | Not populated for FR child rows |

**Shopify product ID: not available.** The table has no `product_id` column. `parent_sku` is NULL for all 5,706 FR child rows — cannot be used to derive or join to a parent product ID. No derivation possible without an explicit column.

**Available IDs to expose:**
- `item_id` — Shopify variant ID — include in API response and table ✓
- `shop_inv_item_id` — Shopify inventory item ID — include as supplementary field ✓
- Shopify product ID — **NOT available** — do not invent or derive

## 14. Status

**AWAITING PIRANAV APPROVAL.**

All discovery and clarifications complete. No implementation has begun.
- Prompt file: `prompts/dm-dashboard/dm-dashboard-thivajini-req6-price-issue-correction.md`
- This evidence file updated in-place — no duplicate document created.
