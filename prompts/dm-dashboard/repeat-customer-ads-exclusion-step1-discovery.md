# Prompt: Repeat Customer / Ads Exclusion — Step 1 Data Discovery

**Registered:** 2026-10-06  
**Prompt ID:** DM-RC-DISCOVERY-01  
**Category:** dm-dashboard / data-discovery  
**Reusable for:** Any new dashboard page requiring customer order-count analysis

---

## Purpose

Discover and validate the data architecture for a repeat-customer identification system. This prompt investigates what customer, order, and attribution data exists across the business DB and Shopify API before building any UI.

---

## Reusable Prompt

```
You are performing a READ-ONLY data discovery for a repeat-customer identification feature on the DM Dashboard.

OBJECTIVE: Determine whether the existing data sources (business PostgreSQL DB + Shopify Admin GraphQL API) can support identifying customers who have placed N or more orders, and whether those orders can be attributed to Google Ads.

DO NOT modify any code, database, or config files.

INVESTIGATE:
1. Customer data: Which tables have customer email, phone, name? Join key to orders?
2. Order data: Which table/sub_source_id holds Shopify UK orders? What status values exist? What fields are available?
3. Order count: Can we calculate Customer → count of valid orders? Via DB or via Shopify API?
4. Google Ads attribution: Do any Google Ads tables link to customer IDs or order IDs? What session-level attribution exists?
5. Existing Shopify GraphQL query: Does it already fetch customerOrderIndex? Does it fetch customer { email }?
6. Customer Match readiness: Is email available? Is phone available? What's missing?
7. Performance: How many orders exist? Will a new query need ScheduledSnapshot?

REPORT:
- Confirmed facts only (tested via DB queries or code reading)
- Separate from assumptions
- Answer YES/NO for: email in DB, order count calculable, Google Ads linkage, Customer Match ready
- Identify any business-rule decisions that must come from the team lead before building
- Recommend what Step 2 should build based on what is actually supported
```

---

## Context Required When Using This Prompt

- DM Dashboard path: `C:\Users\PC\Documents\piranav_aios\dm-dashboard`
- Business DB: `get_business_conn()` — schemas: `customers`, `order_management`, `google_ads`, `google_analytics`
- Shopify UK sub_source_id: 38 (LEDSONEUK)
- Existing order query: `backend/app/sales/sales.py` — `ORDERS_QUERY` — fetches `customerJourneySummary.customerOrderIndex`
- Attribution function: `_has_paid_evidence()` in sales.py
- Use `mcp__ledsone-db-mcp__execute_sql` for read-only DB queries

---

## Known Findings (2026-10-06)

- Email is NULL for ALL Shopify UK orders in business DB
- Phone available for 66% of Shopify UK orders
- customerOrderIndex already in ORDERS_QUERY — key field for repeat detection
- Google Ads tables have NO customer-level data
- Must add `customer { id email }` to ORDERS_QUERY for Customer Match
- ScheduledSnapshot required — all-time scan is 30–90s
