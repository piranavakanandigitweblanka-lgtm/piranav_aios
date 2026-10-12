# Prompt: Repeat Customer Ads Exclusion — Step 2 Implementation

**Registered:** 2026-10-12
**Prompt ID:** DM-RC-IMPL-02
**Category:** dm-dashboard
**Status:** EXECUTED — 2026-10-12

---

## What to build

Build the Repeat Customers admin page in the DM Dashboard (dm-dashboard project).

The page identifies Shopify UK customers who have placed 3 or more (or 4 or more) qualifying orders, for customer retention analysis and advertising-exclusion preparation.

---

## Confirmed business decisions

| Decision | Value |
|---|---|
| Store | Shopify UK only (ledsone.myshopify.com, store key: ledsone_uk) |
| Threshold | Configurable: 3+ or 4+ (both must work from one snapshot) |
| Initial scope | All repeat customers regardless of advertising attribution |
| Email storage | Never persist raw email. Mask at source. Never store in snapshot. |
| Google Ads | No automatic upload. Reporting and export-prep only. |
| Access | UAM permission matrix — tools.AdminRepeatCustomers |

---

## Files to create

| File | Purpose |
|---|---|
| `backend/app/admin/admin_repeat_customer.py` | Backend module: Shopify fetch, customer aggregation, ScheduledSnapshot, API endpoints |
| `frontend/src/admin/pages/RepeatCustomers.jsx` | Admin page: threshold selector, KPI cards, customer table, CSV export |

---

## Files to modify

| File | Change |
|---|---|
| `backend/app/main.py` | Import router + start_snapshots, register router, add start_repeat_customer_snapshots() to startup |
| `frontend/src/admin/AdminLayout.jsx` | Add lazy import, sidebar nav item, panel |
| `frontend/src/taskRegistry.js` | Add TOOLS entry: taskKey tools.AdminRepeatCustomers |

---

## Technical constraints

- STORE = "ledsone_uk" — existing shopify_client.py key
- Valid order rule: cancelledAt IS NULL AND displayFinancialStatus NOT IN ("VOIDED") — same as admin_conduit_sold.py
- Guest checkouts (customer is null) excluded — no stable identity
- Deduplication: count unique order IDs per customer
- customer.legacyResourceId is the identity key, not email
- Email masked at source (first 2 chars + *** + @domain), never stored
- ScheduledSnapshot: 24-hour interval, scope "admin-repeat-customers"
- Snapshot stores customers with >= 2 orders; UI threshold filters at request time
- API: GET /api/admin/repeat-customers?threshold=3|4 (422 for other values)
- Auth: make_task_auth("tools.AdminRepeatCustomers") on all endpoints

---

## Expected output

- Backend module passes Python import check
- Vite build passes with no errors
- UAM matrix shows new "Repeat Customers" row under Tools
- Admin sidebar shows "Repeat Customers" nav item (Sales & Performance section)
- Page renders with threshold selector, KPIs, table, export button
- Unauthorized request returns 403
- CSV export is streamed, never written to disk
