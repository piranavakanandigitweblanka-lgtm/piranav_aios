# Evidence — RC-02 B3 Drill-Down Live Failure Investigation

**Date:** 2026-10-14
**Req ID:** RC-02-B3-FIX
**Status:** FIX APPLIED — browser verification pending (requires backend restart)

---

## Symptom

Clicking the customer count button in Product Summary tab (e.g. 345 customers for "E27 2m Fabric
Cable UK Plug in Pendant Lamp Light Set Fitting") showed no customers — either a "No qualifying
customers found" error or the panel never opened.

---

## Investigation Trace

### Step 1 — Frontend click path

Verified in `RepeatCustomers.jsx`:
- Button at line ~789: `onClick={() => handleDrillDown(p)}`
- `handleDrillDown` at line ~710: checks `p.product_id`, sets `expandedProduct`
- `ProductCustomerDrillDown` renders at line ~826 when `expandedProduct` is set
- URL constructed correctly: `/api/admin/repeat-customers/product-summary/{product_id}/customers?threshold={th}&page={pg}`
- Frontend handles 404 → shows "No qualifying customers found for this product at this threshold."
- **Frontend code: correct. No defect found.**

### Step 2 — Backend route registration

`main.py` confirms router registered at lines 116–117, 277, 408.
Route `GET /product-summary/{product_id}/customers` registered at line 726 of
`admin_repeat_customer_products.py`. No routing conflict with `/{customer_id}/products`
(FastAPI matches literal segments before path parameters).
**Backend routing: correct.**

### Step 3 — Database investigation

MCP tool connects to ph_dashboard (PriceHeritage), not the dm-dashboard's Neon Postgres.
No snapshot tables exist in ph_dashboard — correct, they're in a separate database.
Live snapshot cannot be directly queried via available MCP tools.

### Step 4 — Snapshot key analysis

The `_compute_repeat_customer_products()` function added `customer_order_counts` in **B3**.
Any snapshot computed before B3 was deployed will NOT have this key.

### Step 5 — Root cause found

In `_get_product_customers()` (`admin_repeat_customer_products.py` line ~692–700):

```python
# BEFORE fix:
raw_counts: dict = payload.get("customer_order_counts", {})
...
order_count = raw_counts.get(cid, MIN_SNAPSHOT_THRESHOLD)  # fallback = 2
if order_count < threshold:  # threshold is 3 or 4
    continue
```

For any pre-B3 snapshot:
- `raw_counts = {}` (key absent)
- `order_count = 2` (fallback)
- `2 < 3 = True` → customer skipped

**Every customer in a pre-B3 snapshot is excluded at threshold 3 or 4.**

Result: `total = 0` → endpoint raises HTTP 404 → frontend shows the "No qualifying customers"
error message.

The test `test_missing_customer_order_counts_falls_back` did not catch this because it called
`_get_product_customers(... threshold=MIN_SNAPSHOT_THRESHOLD)` — i.e., `threshold=2`.
At `threshold=2`: `2 < 2 = False` → customer passes trivially. The bug was latent.

**Secondary cause:** If the backend was never restarted after B3 was pushed, the endpoint
`/product-summary/{product_id}/customers` doesn't exist in the running process.
FastAPI returns `404 {"detail": "Not Found"}`, frontend shows same "No qualifying customers"
message. This is indistinguishable to the user from the code bug.

---

## Fix Applied

### `backend/app/admin/admin_repeat_customer_products.py`

Changed fallback constant from `MIN_SNAPSHOT_THRESHOLD` to `threshold`:

```python
# AFTER fix:
raw_counts: dict = payload.get("customer_order_counts", {})
# Fall back to `threshold` so all customers in old snapshots pass the
# threshold check — they were already filtered at MIN=2 when stored.
order_count = raw_counts.get(cid, threshold)
```

Semantics: if we don't know a customer's exact order count (old snapshot), assume they qualify at
the requested threshold. All customers in `customer_products` already have ≥ MIN=2 orders, so
this is a safe, inclusive fallback.

### `backend/tests/test_repeat_customer_products.py`

Rewrote `test_missing_customer_order_counts_falls_back` to test at `threshold=3` and `threshold=4`
with two customers, asserting both are admitted (the real-world failure scenario).

---

## Test Results

```
49/49 PASS  (pytest, 3.92s)
Vite build: ✓ built in 1.06s
```

No regressions.

---

## Deployment Requirements for Live Resolution

| Action | Who | Notes |
|---|---|---|
| Restart dm-dashboard backend | Piranav | Loads B3 endpoint into the running process |
| Click ↻ Refresh Products | Piranav | 15–30 min scan; new snapshot includes `customer_order_counts` |
| Open Product Summary, click a customer count | Piranav | Verify drill-down panel opens with real customer IDs |

**Note:** With the fallback fix, the drill-down ALSO works on the current stale snapshot
(no resync needed for the fix to take effect). However, after a resync the threshold
filtering will use exact order counts rather than the fallback admission.

---

## Privacy

- No customer emails in investigation, fix, or evidence
- No Shopify credentials or tokens exposed
- Auth gate (`tools.AdminRepeatCustomers`) unchanged
