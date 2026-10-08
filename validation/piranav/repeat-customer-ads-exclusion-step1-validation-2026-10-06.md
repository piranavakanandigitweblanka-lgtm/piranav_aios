# Validation — Repeat Customer Ads Exclusion Step 1

**Date:** 2026-10-06  
**Req ID:** RC-01  
**Type:** Read-only discovery validation

---

## Checklist

| Check | Result | Detail |
|---|---|---|
| Customer data found in business DB | ✅ YES | `customers.customer_info` — name, email (null), phone via billing_address |
| Order data found in business DB | ✅ YES | `order_management.orders` — 43,602 UK Shopify orders |
| Order count calculable via business DB | ❌ NO | Email is NULL for all Shopify UK orders — cannot group by customer |
| Order count calculable via Shopify API | ✅ YES | `customerOrderIndex` already in ORDERS_QUERY — gives order position per customer |
| Google Ads attribution found | ✅ YES (session-level) | `_has_paid_evidence()` in sales.py identifies paid orders via UTM/click ID |
| Google Ads customer-level linkage exists | ❌ NO | No customer ID in google_ads tables — aggregate data only |
| Customer Match fields available (business DB) | ❌ NO | Email missing for Shopify UK |
| Customer Match fields available (Shopify API) | ✅ YES (with extension) | Requires adding `customer { id email }` to ORDERS_QUERY |
| Option A (Total Repeat Customers) supported | ✅ YES (with API extension) | Shopify GraphQL + customerOrderIndex |
| Option B (Google Ads Repeat Customers) | ⚠️ PARTIAL | Attribution gap ~10–20% (UNKNOWN/NO_JOURNEY_DATA) |
| Organic data available per customer | ❌ NO | GA4 and organic_revenue tables are aggregated only |
| ScheduledSnapshot needed | ✅ YES | All-time order fetch will take 30–90s |
| Existing APIs reusable | ✅ YES | `_fetch_orders_for_month()`, `_has_paid_evidence()`, ScheduledSnapshot |
| Business-rule ambiguity documented | ✅ YES | 3+ vs 4+ threshold, Option A vs B, UK vs UK+DE |

---

## Discovery Status

**PASS** — All investigation questions answered. Blockers documented. Ready for Step 2 design once Piranav confirms the 4 business decisions listed in the discovery report.

---

## Pre-Step-2 Decisions Required from Piranav

1. **Threshold:** 3+ orders or 4+ orders (or configurable)?
2. **Store scope:** UK only, or UK + DE?
3. **PII policy:** Store customer emails in local app DB, or compute on-the-fly only?
4. **Option A vs B:** Build total repeat customers first, or Ads-attributed repeat customers first?
