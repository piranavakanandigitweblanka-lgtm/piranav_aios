# Validation — Thivajini Req 6: Price Issue Correction
**Req ID:** DMDASH-TV-REQ6-2026-10-30
**Date:** 2026-10-30
**Branch:** `feature/thivajini-req6-price-issue-correction`

## Static Checks

| # | Check | Result |
|---|---|---|
| 1 | Route `GET /api/thivajini/req6` — no collision with existing routes | PASS — confirmed pre-implementation |
| 2 | UAM key `thivajini.PriceIssueCorrection` — unique, not used elsewhere | PASS |
| 3 | Backend module imports (`from ..dev_tasks.ledsone_de_order_sync.ecb_rate`) path valid | PASS — ecb_rate.py confirmed at that path |
| 4 | SQL: FR scope `sub_source=233, is_child=1, status IN ('active','draft')` — captures all 5,706 rows | PASS — confirmed by DB query |
| 5 | SQL: UK scope includes `unlisted` (93 rows exist) | PASS |
| 6 | SQL: DE scope `active+draft` only (no unlisted rows exist in DE) | PASS — rechecked at implementation |
| 7 | Duplicate disambiguation: `COUNT(DISTINCT price)` used — no DISTINCT ON or MIN/MAX | PASS |
| 8 | NULL prices excluded from disambiguation CTEs (`AND price IS NOT NULL`) | PASS |
| 9 | Stock join: LEFT JOIN with `warehouse_location` in ON clause — no WHERE filter that turns LEFT to INNER | PASS |
| 10 | Row cardinality: no multiplication — de_stock/uk_stock unique per SKU (DB confirmed) | PASS |
| 11 | `is_fr_duplicate` flag derived from Counter — not hardcoded | PASS |
| 12 | ECB rate fetched once per endpoint call — no stale caching | PASS |
| 13 | EcbRateError caught — endpoint returns 200, not 500 | PASS |
| 14 | Issue threshold `> 0.01` (not `>= 0.01`) | PASS — `abs(...) > 0.01` in `_issue()` |
| 15 | Both `item_id` and `shop_inv_item_id` included in response | PASS |
| 16 | No Shopify write calls anywhere in backend file | PASS — read-only SQL only |
| 17 | `main.py` import and `include_router` added correctly | PASS |
| 18 | `taskRegistry.jsx` entry added with correct `taskKey` | PASS |
| 19 | Frontend uses `apiFetch` (not raw `fetch`) | PASS |
| 20 | CSV export uses `downloadCsv` from `lib/csv.js` — BOM-prefixed | PASS |
| 21 | CSV filename includes method + date | PASS |
| 22 | Frontend build: `✓ built in 4.00s` — zero errors | PASS |

## Backend Tests

| Result | Count | Notes |
|---|---|---|
| PASS | 239 | All pre-existing tests pass |
| FAIL | 22 | Pre-existing failures in unrelated modules (muguntha, promotion_automation, repeat_customer_products) |
| Collection errors | 15 | Pre-existing — `curl_cffi` missing in dev_tasks test files |
| New failures introduced | **0** | |

## Dynamic Calculation Audit (Items 4 & 5)

### Defect found and fixed: float rounding error in Method 1 and Method 2

**Root cause:** `round(float_expr, 2)` uses Python's float representation of `1.19` = `1.18999...`. For whole-pound UK prices, this causes systematic €0.01 underestimates.

**Example:** `£6.00 → (6.00 + 1.50) × 1.19 = 8.925`. Python float gives `8.924999...` → rounds DOWN to `8.92`. Correct: `8.93`.

**Confirmed with 5 real DB rows:**
| SKU | UK Price | Python float (wrong) | Decimal ROUND_HALF_UP (correct) |
|---|---|---|---|
| CL2RAG5PK | £6.00 | 8.92 | **8.93** |
| CL2RRSAPK | £11.00 | 14.87 | **14.88** |
| CRFF4002BM+ | £35.00 | 43.43 | **43.44** |
| CRFF500BM+ | £32.00 | 39.86 | **39.87** |
| CRSF100BL+ | £17.00 | 22.01 | **22.02** |

**Fix applied** to `backend/app/dashboard_pages/price_issue_correction.py`:
- Added `from decimal import Decimal, ROUND_HALF_UP` import
- Replaced both `round(float_expr, 2)` calls with `Decimal` arithmetic using `.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)`
- Verified: all 5 cases now return correct value
- Syntax check: PASS

## Calculation Scenario Tests

| Test | Scenario | Result |
|---|---|---|
| T1 | de_stock > 0, valid de_price → use de_price directly | PASS |
| T2 | de_stock NULL → CHECK DATA | PASS |
| T3 | de_price NULL/zero → CHECK DATA | PASS |
| T4 | de_stock = 0, uk_price = £6.00 → c_normal = 8.93 | PASS (after Decimal fix) |
| T5 | de_stock = 0, uk_price = £11.00 → c_normal = 14.88 | PASS (after Decimal fix) |
| T6 | uk_price_ambiguous → CHECK DATA | PASS |
| T7 | de_stock = 0, uk_price missing → CHECK DATA | PASS |
| T8 | ECB rate unavailable → c_converted = CHECK DATA, c_normal still computed | PASS |

## Result: PASS (22/22 static checks, 0 new test regressions, build clean, defect found and fixed)

## Pending (runtime)
- Live endpoint test requires backend running with dev tunnel active
- UAM access_grants row for `thivajini.PriceIssueCorrection` not yet created (requires Piranav action)
