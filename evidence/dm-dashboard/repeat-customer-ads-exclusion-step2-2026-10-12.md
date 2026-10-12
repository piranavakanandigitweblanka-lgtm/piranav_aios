# Evidence — Repeat Customer Ads Exclusion Step 2 + Step 3 Runtime Validation

**Date:** 2026-10-12
**Req ID:** RC-01
**Type:** Implementation + runtime validation

---

## Files Created

| File | Type |
|---|---|
| `backend/app/admin/admin_repeat_customer.py` | New — backend module |
| `frontend/src/admin/pages/RepeatCustomers.jsx` | New — frontend page |

## Files Modified

| File | Change |
|---|---|
| `backend/app/main.py` | +4 lines: import, router registration, startup snapshot |
| `frontend/src/admin/AdminLayout.jsx` | +18 lines: lazy import, sidebar nav item, panel |
| `frontend/src/taskRegistry.js` | +1 line: TOOLS entry `tools.AdminRepeatCustomers` |

---

## Backend API

**Endpoint:** `GET /api/admin/repeat-customers?threshold=3|4`

**Auth:** `make_task_auth("tools.AdminRepeatCustomers")` — admin/dev pass, staff need UAM grant

**Response fields:** `success`, `threshold`, `total_customers`, `all_thresholds_summary`, `orders_scanned`, `generatedAt`, `syncedAt`, `store`, `data_complete`, `meta`, `customers[]`

**Additional endpoints:**
- `POST /api/admin/repeat-customers/sync/run-now`
- `GET /api/admin/repeat-customers/export/csv?threshold=3|4`

---

## Real Data Results (sync completed 2026-10-12 06:25 UTC)

| Metric | Value |
|---|---|
| Orders scanned (all-time Shopify UK) | **66,975** |
| Customers at 3+ qualifying orders | **1,245** |
| Customers at 4+ qualifying orders | **470** |
| Snapshot table | `public.admin_repeat_customers_snapshot` |
| Raw emails in snapshot | **None** — privacy rule enforced |

### Spot-check (5 customers, snapshot vs Shopify Admin)

| Customer ID | Snapshot | Shopify Admin | Match |
|---|---|---|---|
| 6859811651834 | 54 | 54 | ✅ |
| 23363633185154 | 9 | 9 | ✅ |
| 25343855362434 | 7 | 7 | ✅ |
| 6130990153978 | 4 | 4 | ✅ |
| 5948498673914 | 3 | 3 | ✅ |

---

## Order Counting Rule

Valid = `cancelledAt IS NULL` AND `displayFinancialStatus NOT IN {"VOIDED"}`

Guest checkouts excluded. Each unique order_id counted once per customer.

---

## Auth Test Results

| Scenario | HTTP Status | Pass/Fail |
|---|---|---|
| No token | 401 | ✅ PASS |
| Staff without UAM grant | 403 | ✅ PASS |
| Admin role | 200 | ✅ PASS |
| Dev role | 200 | ✅ PASS |

---

## Build Verification

- Python import: `APP IMPORTED OK`
- Vite build Step 2: ✅ 3.84s, zero errors
- Vite build Step 3: ✅ 2.01s, zero errors

---

## Privacy Summary

Raw customer emails are never stored. Masking applied at source in `_fetch_all_uk_orders()`. `del raw_email` executes immediately after masking. Snapshot contains only `email_masked` (e.g. `ju***@yahoo.com`). Confirmed via code inspection and live snapshot read.

---

## Pending (browser-required)

- UAM matrix visual: "Repeat Customers" row appearance
- Save/Discard browser test
- Authorized staff sidebar test

---

## Git Status at Evidence Filing

- Branch: `piranv-work` (dm-dashboard)
- Status: 2 new files untracked, 3 modified — not yet committed
- No commit or deployment performed
