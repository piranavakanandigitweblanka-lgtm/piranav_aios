# Evidence — Repeat Customer Ads Exclusion Step 1 Discovery

**Date:** 2026-10-06  
**Req ID:** RC-01  
**Type:** Read-only data discovery — no code changes

---

## Files Inspected

| File | Purpose |
|---|---|
| `backend/app/main.py` | Router registration, auth middleware, startup hooks |
| `backend/app/sales/sales.py` | ORDERS_QUERY, channel classification, attribution logic |
| `backend/app/admin/admin_dm_campaign.py` | Google Ads tables, campaign/product queries |
| `backend/app/sales/organic_revenue.py` | Organic revenue data source (GA4) |
| `backend/app/core/db.py` | DB connections — `get_conn()` (app DB), `get_business_conn()` (business DB) |
| `docs/dm-dashboard/system-discovery-2026-10-06.md` | Existing architecture reference |

---

## Database Queries Run (READ-ONLY)

### Query 1 — Schema inspection
```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_schema = 'order_management' AND table_name = 'orders'
```
Result: 16 columns. No customer email, phone, or customer_id field.

### Query 2 — All schemas/tables
Result: Confirmed schemas: `customers`, `order_management`, `google_ads`, `google_analytics`, `listings`, `inventory`, `accounting`, `customer_service`, `employee_management`

### Query 3 — customers.customer_info schema
```sql
SELECT column_name FROM information_schema.columns WHERE table_schema='customers' AND table_name='customer_info'
```
Result: id, order_id, first_name, last_name, email, email_invoice, ebay_buyer_id, created_at, updated_at

### Query 4 — Email availability for Shopify UK
```sql
SELECT COUNT(*) as total, COUNT(NULLIF(ci.email,'')) as non_empty_email
FROM order_management.orders o
JOIN customers.customer_info ci ON ci.order_id = o.id
WHERE o.sub_source_id = 38
```
**Result: total=43,602, non_empty_email=0**

### Query 5 — Order status breakdown for Shopify UK
```sql
SELECT status, COUNT(*) FROM order_management.orders WHERE sub_source_id = 38 GROUP BY status
```
Result: Completed=43,521, Cancelled=29, Refunded=21, Inprogress=17, Deleted=14

### Query 6 — Phone availability
```sql
SELECT COUNT(*) as total, COUNT(NULLIF(ba.phone,'')) as with_phone
FROM order_management.orders o
JOIN customers.billing_address ba ON ba.order_id = o.id
WHERE o.sub_source_id = 38
```
Result: total=43,602, with_phone=28,738 (66%)

### Query 7 — Sub-source name
```sql
SELECT id, name FROM order_management.sub_source WHERE id = 38
```
Result: id=38, name="LEDSONEUK"

### Query 8 — Proxy repeat customer count by name
```sql
SELECT COUNT(*) FROM (
  SELECT ci.first_name, COUNT(DISTINCT o.id) as order_count
  FROM customers.customer_info ci JOIN order_management.orders o ON o.id = ci.order_id
  WHERE o.sub_source_id = 38 AND o.status NOT IN ('Cancelled','Deleted') AND ci.first_name IS NOT NULL
  GROUP BY ci.first_name HAVING COUNT(DISTINCT o.id) >= 3
) sub
```
Result: 1,202 names appear 3+ times (name-only, unreliable — PII masked)

### Query 9 — Email fields across all schemas
Result: `customers.customer_info.email` is the ONLY email column relevant to orders. `amazon_fba_orders.buyer_email` exists for Amazon only. No Shopify-specific email table.

---

## Confirmed Facts (from code + DB)

1. Business DB sub_source_id=38 = LEDSONEUK confirmed
2. 43,602 Shopify UK orders in business DB
3. Email is NULL for ALL Shopify UK orders in `customers.customer_info`
4. Phone available for 66% of Shopify UK orders
5. `customerJourneySummary.customerOrderIndex` is already fetched in existing ORDERS_QUERY (sales.py)
6. `_has_paid_evidence()` in sales.py can identify Google Ads-attributed orders
7. Google Ads tables contain NO customer-level data — aggregate only
8. GA4 tables contain NO customer-level data — aggregate only
9. The `customers` schema joins correctly via `customer_info.order_id = orders.id` (1.1M rows confirmed)
10. ScheduledSnapshot pattern is the correct architecture for any new slow query

---

## Assumptions (not yet confirmed from code)

- Shopify Admin GraphQL `customer { id email }` field will be available for all orders (some guest orders may have null customer)
- `customerOrderIndex` accuracy depends on `customerJourneySummary.ready` being true — some orders show `ready=false`
- DE store (ledsone.de) has a different sub_source_id — not investigated in this step

---

## Key Gap Confirmed

**Email is not available in the business DB for Shopify UK.** Customer Match cannot be built from the database alone. The only path is extending the existing Shopify Admin GraphQL ORDERS_QUERY to include `customer { id email }`.
