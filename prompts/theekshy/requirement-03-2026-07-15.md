# Prompts — Theekshy Requirement 3 — Feed Optimisation

**Staff:** Theekshy
**Requirement:** 3 — Feed Optimisation
**Date:** 2026-07-15
**Dashboard:** Staff-requirements/pages/theekshy.html (Panel 3)

---

## Primary Prompt (User → AIOS)

> **ROLE — You are the execution worker for Theekshy's Google Ads Performance Dashboard.**
>
> Build Theekshy **Requirement 3 — Feed Optimisation** inside the existing `Staff-requirements/pages/theekshy.html` file (Panel 3, replacing the placeholder).
>
> **Data sources:**
> - `google_ads.product_performance` — spend, clicks, impressions, conversions per product (last 30 days)
> - `listings.shopify_listings` — Shopify price, stock, status (site=UK, channel=LEDSone)
> - `google_ads.merchant_products` — GMC availability, price, currency (GB record preferred)
>
> **Campaigns:** THEE_GEMS (23714290257), THEE_MYSTERY (23684837882)
>
> **Rules from CSV:** Feed Review Date = Date Last Optimised + 7 days. 7 conditions. 11-level condition precedence.
>
> **Constraints:** DO NOT overwrite Req 1/Req 2. SELECT only. No git commit/push without approval.

## Data Gathering Queries Executed

### Summary stats (full feed, 2026-06-15 – 2026-07-15)
- Total products: 1,402
- Out of stock (stock=0 OR GMC OOS): 111
- Price mismatches (GBP): 47
- Availability mismatches: 10

### Req 1 dependency check
- Action log: 0 optimisation events → empty state for review scheduling

### GMC eligibility check
- `asset_group_listing_group_filters` WHERE campaign_id IN (...) → 0 rows
- Disapproval/approval status unavailable for Theekshy campaigns

### Date serial
- CSV "Feed Review Date" column: Excel serial 46211 = 2026-07-08 (Date Last Optimised 2026-07-01 + 7 days)
- Not displayed raw in dashboard

### CSV sample rows
- SKU-001, SKU-004, SKU-006 are examples only — not embedded as live data
