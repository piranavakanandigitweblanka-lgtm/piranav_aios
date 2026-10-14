# Prompt: RC-02 Repeat Customer Product Data Discovery

**Registered:** 2026-10-14
**Prompt ID:** DM-RC-DISC-02
**Category:** dm-dashboard
**Status:** EXECUTED — 2026-10-14

---

## What to discover

Inspect the existing Repeat Customers page (RC-01) and all related DM Dashboard infrastructure to determine what product-level data is available for three new analytics tabs:

1. Customer Products — products purchased by an individual qualifying repeat customer
2. Product Summary — combined product totals across all qualifying repeat customers
3. Products Bought Together — product pairs purchased in the same valid order

---

## Files to inspect

- `backend/app/admin/admin_repeat_customer.py`
- `frontend/src/admin/pages/RepeatCustomers.jsx`
- `backend/app/dashboard_pages/conduit_sold.py` — existing line-item query pattern
- `backend/app/core/shopify_client.py` — shared GraphQL client
- `backend/app/core/scheduled_snapshot.py` — snapshot pattern
- `backend/app/core/db.py` — DB pools and connection helpers
- `backend/app/core/task_auth.py` — auth pattern
- Existing RC-01 AIOS documentation

---

## What to determine

1. GraphQL fields available for order line items (product_id, variant_id, SKU, title, image, quantity, refunds)
2. Whether `listings.shopify_listings` (business DB) provides product images and titles by variant item_id
3. Valid-order and refund rules — gross vs net quantities
4. Recommended snapshot design for each of the three datasets
5. Performance estimate — API call volume and pagination requirements
6. Product/variant identity strategy — how to avoid merging different SKUs
7. Missing data or blockers

---

## Constraints

- Reuse RC-01's valid-order rule: `cancelledAt IS NULL` AND `displayFinancialStatus NOT IN {VOIDED}`
- Preserve all RC-01 privacy rules — raw email never stored or exposed
- Reuse ScheduledSnapshot pattern — no live scan on tab switch
- Reuse existing `tools.AdminRepeatCustomers` UAM permission
- Do not invent product records or assume product_id = variant_id
- Do not modify application code during discovery

---

## Expected output

Full discovery report: available fields, recommended data structures, snapshot design, performance risks, blockers, and Stage B implementation plan.
