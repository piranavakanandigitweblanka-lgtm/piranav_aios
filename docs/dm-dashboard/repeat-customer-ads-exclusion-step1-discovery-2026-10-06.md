# Repeat Customer Ads Exclusion — Step 1 Data Discovery Report

**Discovery Date:** 2026-10-06  
**Inspected by:** Claude Code (read-only, no code changes)  
**Requirement ID:** RC-01  
**Store scope:** Shopify UK (sub_source_id=38, LEDSONEUK)

---

## 1. Business Requirement

Identify customers who have purchased 3–4 times (or more), exclude them from paid Google Ads campaigns, and move them toward organic/free acquisition channels.

Recommended method from team lead: Google Customer Match — requires customer email (hashed).

**Open threshold decision:** 3+ OR 4+ purchases. NOT yet decided. Do not hardcode.

---

## 2. Customer Data Source

| Field | Table | Value for Shopify UK |
|---|---|---|
| first_name (full name stored here) | `customers.customer_info` | POPULATED |
| last_name | `customers.customer_info` | NULL for all Shopify UK |
| email | `customers.customer_info` | **NULL for ALL 43,602 Shopify UK orders** |
| email_invoice | `customers.customer_info` | NULL for all Shopify UK |
| ebay_buyer_id | `customers.customer_info` | NULL |
| phone | `customers.billing_address` | Available for 28,738 / 43,602 (66%) |
| Join key | `customers.customer_info.order_id → order_management.orders.id` | Confirmed working (1.1M rows across all channels) |

**CRITICAL GAP: Email is not stored in the business DB for Shopify UK orders.**

The `customers` schema exists and works for eBay, Amazon, and other channels — but Shopify UK (sub_source_id=38) syncs only `first_name` (full name) and leaves email NULL. This was confirmed by direct query returning 0 non-null emails across all 43,602 UK Shopify orders.

**Alternative path: Shopify Admin GraphQL API.** The existing `sales.py` already fetches Shopify orders via GraphQL. Adding `customer { id email }` to the `ORDERS_QUERY` would provide both the Shopify customer ID and email. This is the required path for Customer Match.

---

## 3. Order Data Source

| Item | Detail |
|---|---|
| Table | `order_management.orders` (business DB, read-only) |
| Sub-source for Shopify UK | `sub_source_id = 38` (confirmed: name = "LEDSONEUK") |
| Total Shopify UK orders | 43,602 |
| Status values | Completed (43,521), Cancelled (29), Refunded (21), Inprogress (17), Deleted (14) |
| Valid order filter | `status NOT IN ('Cancelled', 'Deleted')` |
| Order date field | `order_date` (timestamp) |
| Revenue field | `total` (numeric) |
| Join to customer | `order_management.orders.id = customers.customer_info.order_id` |

**No customer identifier (Shopify customer ID) exists in `order_management.orders`.** The `order_id` field holds the Shopify order number, not a customer ID.

---

## 4. Order Count Logic

### Path A — Business DB (BLOCKED by missing email)
Cannot reliably calculate Customer → order count because email is null for all Shopify UK records. Name-only grouping yields ~1,202 names with 3+ orders but names are not unique identifiers.

### Path B — Shopify Admin GraphQL API (RECOMMENDED)

The existing `ORDERS_QUERY` in `backend/app/sales/sales.py` already fetches `customerJourneySummary.customerOrderIndex`, which is Shopify's own field showing the order's position in the customer's purchase history:

- `customerOrderIndex = 1` → customer's first ever order
- `customerOrderIndex = 3` → customer's third order (repeat buyer at 3+ threshold)
- `customerOrderIndex = 4` → customer's fourth order (repeat buyer at 4+ threshold)

**This field alone can answer: "is this order from a customer who has bought N+ times?"**

To get the customer's email for Customer Match, the existing ORDERS_QUERY must be extended to include:
```graphql
customer {
  id
  email
}
```

This requires a one-line change to the GraphQL query in `sales.py` — no schema changes, no new tables.

**Exact file:** `backend/app/sales/sales.py`, `ORDERS_QUERY` constant (line ~977)

---

## 5. Google Ads Attribution

### What exists in the business DB

| Table | What it contains | Customer linkage |
|---|---|---|
| `google_ads.campaign_performance` | Daily impressions, clicks, cost, conversions (aggregate) | NONE |
| `google_ads.product_performance` | Per-product daily impressions, clicks, cost, conversions | NONE |
| `google_ads.campaigns` | Campaign metadata (name, status, budget, group) | NONE |
| `google_ads.google_ads_change_events` | Admin changes to campaigns (user_email = staff, not customer) | NONE |
| `google_ads.keyword_performance` | Keyword-level metrics | NONE |

**None of the Google Ads tables link to individual customer emails or order IDs.**

### What exists via Shopify GraphQL (already used)

The existing `_has_paid_evidence()` function in `sales.py` identifies Google Ads-attributed orders via:
- UTM medium: `cpc`, `ppc`, `paid_search`, `shopping`, `pmax`, etc.
- UTM source: `google_ads`, `googleads`
- Click IDs: `gclid`, `gbraid`, `wbraid` in the landing page URL
- Source type: `ad`

This is session-level attribution from `customerJourneySummary.firstVisit.utmParameters`.

### Question A: Can the system identify Customer → Order → Google Ads attribution?
**YES — via Shopify GraphQL `customerJourneySummary`.** Order-level. But requires adding `customer { email }` to the query to get the customer identifier.

### Question B: Can it identify Customer → Multiple orders → Google Ads attribution?
**PARTIAL.** We can identify individual orders with Google Ads attribution. But linking multiple orders to the same customer requires either:
- Customer email from Shopify GraphQL (not yet fetched)
- OR relying on `customerOrderIndex` to count order position only (no cross-order email linkage)

### Question C: Can it distinguish total orders from Ads-attributed orders?
**YES — for the orders we fetch via Shopify API.** The `_has_paid_evidence()` / `_classify_session()` functions already make this distinction per order. Total orders vs Ads-attributed orders is a filter on `journeyStatus`.

**Known attribution gap:** `customerJourneySummary` has known `UNKNOWN_ATTRIBUTION`, `NO_JOURNEY_DATA`, and `ATTRIBUTION_PENDING` states. Approximately 10–20% of orders fall into these categories based on existing data. These orders cannot be definitively classified as Ads or non-Ads.

---

## 6. Customer Match Data Readiness

Google Customer Match minimum requirement: **email (hashed SHA256)**. Optional: phone, name.

| Field | Business DB (Shopify UK) | Shopify GraphQL (if extended) |
|---|---|---|
| Email | ❌ NULL for all records | ✅ Available via `customer { email }` |
| Phone | ✅ 66% coverage (billing_address) | ✅ Available via `customer { phone }` |
| First name | ✅ Available | ✅ Available |
| Last name | ❌ NULL | ✅ Available |
| Order count | ❌ Cannot calculate (no email) | ✅ Via customerOrderIndex OR customer.ordersCount |
| Shopify Customer ID | ❌ Not stored | ✅ `customer { id }` |

**Conclusion: Customer Match list CANNOT be built from business DB alone. Requires Shopify GraphQL API extension.**

**Privacy constraint noted:** No existing PII-handling, GDPR, or data-export controls exist in this codebase. Adding customer email fetching and export will introduce PII handling requirements. Piranav must confirm: is the Customer Match list generated locally (never stored) or stored in a DB table?

---

## 7. Organic Data Availability

| Source | Table | What it tracks |
|---|---|---|
| GA4 organic sessions | `google_analytics.organic_landing_page_revenue` | Page-level organic sessions, purchases, revenue — aggregated, no customer IDs |
| GA4 traffic source | `google_analytics.traffic_source_revenue` | Source/medium level — aggregated, no customer IDs |
| Shopify journey classification | `sales.py _classify_order_journey_organic()` | Per-order organic classification (FULLY_ORGANIC, MIXED_JOURNEY, etc.) |
| Email channel | `sales.py _classify_order_journey_email()` | Per-order email attribution |

**No customer-level organic tracking exists.** GA4 tables are aggregated by landing page / source — no customer IDs or emails. The journey classification in `sales.py` is per-order, not per-customer.

**For the "move to organic" step**, the existing system can identify whether a specific order came via organic/email/direct — but cannot say "this customer historically converts organically" without building a new per-customer analysis.

---

## 8. Existing APIs/Services We Can Reuse

| File | Endpoint / Function | Reusability |
|---|---|---|
| `backend/app/sales/sales.py` | `_fetch_orders_for_month()` | ✅ Direct reuse — fetches orders from Shopify UK/DE GraphQL |
| `backend/app/sales/sales.py` | `_has_paid_evidence(visit)` | ✅ Direct reuse — identifies Google Ads-attributed visits |
| `backend/app/sales/sales.py` | `_classify_session(visit)` | ✅ Direct reuse — full channel classification |
| `backend/app/sales/sales.py` | `_classify_order_journey_organic(order)` | ✅ Direct reuse — organic attribution per order |
| `backend/app/core/scheduled_snapshot.py` | `ScheduledSnapshot` | ✅ Use for caching — query is expected to take 30–90s |
| `backend/app/core/db.py` | `get_business_conn()` | ✅ For any business DB queries |
| `backend/app/core/task_auth.py` | `make_task_auth("tools.AdminRepeatCustomer")` | ✅ New task key — same pattern as existing pages |
| `backend/app/admin/admin_dm_campaign.py` | `PRODUCT_PERF_QUERY` | ✅ Reference for Google Ads spend data (future enhancement) |

---

## 9. Database & Performance Analysis

| Question | Answer |
|---|---|
| Shopify UK order volume | 43,602 orders total |
| Expected query time (new page) | 30–90s — Shopify GraphQL pagination, ~200 pages |
| ScheduledSnapshot required? | **YES** — same reason as Conduit Sold and all sales tabs |
| Business DB connection required? | For phone lookup only (optional, supplementary) |
| Business DB max connections | 4 — do not add more than 1–2 concurrent queries |
| Existing Shopify query pattern | `_fetch_orders_for_month()` with `created_at` date filter |
| New query scope | All-time (no date filter) OR last N years — business decision |

**Note:** The existing Shopify order fetches are month-scoped. A repeat-customer query needs **all-time orders** to count a customer's total purchase history. This is a significantly larger fetch than the existing month-scoped approach. A pre-built snapshot updated weekly/daily is strongly recommended.

---

## 10. Option A — Total Repeat Customers

**Supported: YES — via Shopify Admin GraphQL (requires query extension)**

Logic:
1. Fetch all Shopify UK orders including `customerJourneySummary.customerOrderIndex` and `customer { id email }`
2. Filter: `cancelledAt IS NULL` and `financialStatus != VOIDED`
3. Identify all orders where `customerOrderIndex >= threshold` (3 or 4 — business decision)
4. Deduplicate by `customer.id` to get unique repeat customers
5. Export: email + phone + name → Customer Match list

**Business DB not needed** for this option. Pure Shopify GraphQL.

---

## 11. Option B — Google Ads Repeat Customers

**Supported: PARTIAL — attribution has known gaps**

Logic:
1. Same as Option A but add filter: `_has_paid_evidence(firstVisit) == True`
2. Among repeat customers (customerOrderIndex >= threshold), identify those whose LATEST/FIRST order was attributed to Google Ads
3. These are customers who originally came via Ads and kept buying — prime exclusion candidates

**Limitation:** ~10–20% of orders have `UNKNOWN_ATTRIBUTION` or `NO_JOURNEY_DATA` — these cannot be classified. Some genuine Ads repeat customers may be missed.

**Alternative interpretation of Option B:** A customer is an "Ads repeat customer" if ANY of their orders (not just the first) had Google Ads attribution. This is more inclusive but harder to justify as an exclusion signal.

**Business decision required:** Which orders define "came through Ads"? First order only, last order only, or any order?

---

## 12. 3+ vs 4+ Threshold

`customerJourneySummary.customerOrderIndex` supports any integer threshold. Both 3+ and 4+ are technically feasible with the same query.

**What changes between 3+ and 4+:**
- At 3+: larger list, earlier exclusion, more conservative spend reduction
- At 4+: smaller, higher-confidence list of loyal buyers
- This is a business decision. The system will support a configurable `repeat_threshold` parameter (not hardcoded).

**Recommended implementation:** A URL parameter or admin config value, e.g. `threshold=3` or `threshold=4`, passed to the API endpoint. Default can be set later.

No configuration system currently exists in this codebase. The threshold should be implemented as an API query parameter for now (same as the `mode` parameter in `admin_dm_campaign.py`).

---

## 13. Proposed Data Flow

```
Shopify UK Store
      ↓
Shopify Admin GraphQL API
(ORDERS_QUERY + customer { id email } — REQUIRES QUERY EXTENSION)
      ↓
All-time order fetch (not month-scoped — NEW)
      ↓
Valid Order Filter
(cancelledAt IS NULL AND financialStatus != VOIDED)
      ↓
customerOrderIndex (already in existing ORDERS_QUERY)
      ↓
Threshold Filter (>= 3 OR >= 4 — business decision pending)
      ↓
Repeat Customer list (Shopify customer ID + email)
      ↓
┌────────────────────┬────────────────────────────────────┐
│ Option A           │ Option B                           │
│ Total Repeat       │ Ads-Attributed Repeat              │
│ (all channels)     │ (_has_paid_evidence on any order)  │
│ FULLY SUPPORTED    │ PARTIAL (attribution gaps ~15%)    │
└────────────────────┴────────────────────────────────────┘
      ↓
Customer Match List
(email SHA256 hash + optional: phone, name)
      ↓
[MANUAL STEP — outside dashboard scope]
Upload to Google Ads Customer Match
      ↓
Exclude from active campaigns
```

**Steps marked UNSUPPORTED in current system:**
- ❌ `customer { id email }` not in ORDERS_QUERY — must be added
- ❌ All-time order fetch across all months — new query scope needed
- ❌ Customer Match CSV export — new feature needed
- ❌ Business DB email — not available for Shopify UK

---

## 14. Missing Data

| Missing item | Impact | Resolution |
|---|---|---|
| Email in business DB for Shopify UK | Cannot build Customer Match from DB alone | Add `customer { email }` to Shopify GraphQL query |
| Shopify customer ID in business DB | Cannot deduplicate customers across orders | Same resolution — fetch from GraphQL |
| All-time order history | Cannot count lifetime orders without a full scan | New query scope beyond existing month-scoped approach |
| Google Ads customer-level attribution | Cannot confirm which orders were Google Ads-driven per customer | Use session UTM attribution as proxy (existing `_has_paid_evidence`) |
| DE store repeat customers | Only UK investigated so far | DE (sub_source_id TBD) would need same analysis |

---

## 15. Risks

| Risk | Severity | Detail |
|---|---|---|
| All-time Shopify fetch is slow | HIGH | 43,602+ orders, ~200 API pages, 30–90s. Must use ScheduledSnapshot. |
| Business DB email gap | HIGH | Cannot use DB-only approach. Full dependency on Shopify GraphQL extension. |
| Attribution gaps for Option B | MEDIUM | ~10–20% of orders have unknown attribution. Option B list will be incomplete. |
| PII: customer emails in dashboard | MEDIUM | Adding email fetching introduces GDPR-sensitive data. Must confirm storage policy. |
| customerOrderIndex reliability | LOW | Shopify's own field — reliable. But `customerJourneySummary.ready=false` can delay it. |
| 3+ vs 4+ threshold not decided | LOW | System can support either. Do not hardcode until Piranav confirms. |

---

## 16. Recommendation for Step 2

**Step 2 should build: Repeat Customer Admin Page (Option A first)**

Scope for Step 2:
1. Add `customer { id email }` to `ORDERS_QUERY` in `sales.py` — minimal one-line change
2. Create new `backend/app/admin/admin_repeat_customer.py`:
   - Fetch all-time Shopify UK orders with customer data + customerOrderIndex
   - Filter valid orders (not cancelled/voided)
   - Group by customer.id, count orders, identify those with >= threshold
   - ScheduledSnapshot (weekly refresh recommended)
3. Endpoint: `GET /api/admin/repeat-customers?threshold=3&store=uk`
4. Create `frontend/src/admin/RepeatCustomers.jsx`:
   - Summary KPI: total repeat customers at threshold 3 / threshold 4
   - Table: masked email, order count, first order, last order, channel breakdown
   - Export: CSV with hashed email + phone for Customer Match
5. Auth: `make_task_auth("tools.AdminRepeatCustomers")`

**Do NOT build Option B (Ads-attributed) in Step 2.** Build Option A first, validate the data, then extend to Option B in Step 3.

**Decision required from Piranav before Step 2 starts:**
1. Threshold: 3+ or 4+? (or configurable?)
2. Store scope: UK only or UK + DE?
3. PII policy: should customer emails be stored in local DB or computed on-the-fly only?
4. Option A or Option B for the first build?
