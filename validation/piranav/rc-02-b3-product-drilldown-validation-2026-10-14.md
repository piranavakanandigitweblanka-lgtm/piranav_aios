# Validation — RC-02 Step B3 Product Summary Customer Drill-Down

**Date:** 2026-10-14
**Req ID:** RC-02
**Stage:** B3

---

## Checklist

| Check | Result |
|---|---|
| Module import (isolated) | ✅ PASS — 5 routes registered, no conflicts |
| Vite build | ✅ PASS — `✓ built in 5.35s` |
| All tests (49 cases) | ✅ **49/49 PASS** |
| New endpoint path distinct from existing routes | ✅ PASS — `/product-summary/{product_id}/customers` doesn't conflict |
| `customer_order_counts` added to snapshot payload | ✅ PASS |
| Old snapshot fallback (no customer_order_counts key) | ✅ PASS — tested |
| Distinct customer per row | ✅ PASS |
| total_qty summed across variants | ✅ PASS |
| Threshold applies to order count | ✅ PASS |
| Non-numeric product_id → 422 | ✅ PASS |
| Invalid threshold → 422 | ✅ PASS |
| No customers → 404 | ✅ PASS |
| Snapshot not synced → success:false | ✅ PASS |
| Pagination | ✅ PASS — page_count, non-overlapping pages |
| No raw email in response | ✅ PASS |
| Auth gate unchanged | ✅ PASS |
| "View Products →" in drill-down navigates to Customer Products tab | ✅ CODE — browser test pending |

---

## Browser Tests (Pending — requires live product sync)

| Test | Status |
|---|---|
| Customer count cell is clickable and underlined | PENDING |
| Clicking count opens drill-down panel below table | PENDING |
| Drill-down shows correct product title and ID | PENDING |
| Customer list matches product_id at selected threshold | PENDING |
| total_qty per customer is correct | PENDING |
| "View Products →" navigates to Tab 2 | PENDING |
| Threshold change closes panel and reloads summary | PENDING |
| Clicking same product again closes panel | PENDING |
| Products without product_id show disabled button | PENDING |
| Pagination works for products with >50 customers | PENDING |

---

---

## Regression Fix — 2026-10-14 (RC-02 B3 Fallback Bug)

**Root cause:** `_get_product_customers()` used `MIN_SNAPSHOT_THRESHOLD` (= 2) as the fallback
when `customer_order_counts` is absent (old snapshot). Any valid threshold is ≥ 3, so
`2 < threshold` was always true — ALL customers excluded → endpoint returned 404 → frontend
showed "No qualifying customers found." The bug was masked by the regression test calling
with `threshold=MIN_SNAPSHOT_THRESHOLD` (2 ≥ 2 trivially passes).

**Fix applied:**
- `admin_repeat_customer_products.py` line ~697: fallback changed from `MIN_SNAPSHOT_THRESHOLD` to `threshold`
- `test_repeat_customer_products.py` `test_missing_customer_order_counts_falls_back`: rewritten to
  test at threshold=3 and threshold=4 with two customers, asserting both are admitted

**Test results after fix:** 49/49 PASS | Vite build: ✓ built in 1.06s

**Deployment dependencies (still pending):**
1. Backend restart required — B3 endpoint must be loaded in the running process
2. Product sync required — new snapshot will include `customer_order_counts`; with the fallback
   fix, even the current stale snapshot now serves drill-down results

---

## Overall Status

**PASS (conditional)** — All tests pass, build passes. Fallback bug fixed. Browser validation deferred to after backend restart.
