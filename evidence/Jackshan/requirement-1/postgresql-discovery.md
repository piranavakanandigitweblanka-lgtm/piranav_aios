---
name: jackshan-r1-postgresql-discovery
description: PostgreSQL schema and table discovery for Jackshan Requirement 1
metadata:
  type: project
---

# Jackshan Requirement 1 — PostgreSQL Discovery

**Title:** PostgreSQL Discovery  
**Purpose:** Identify and verify all PostgreSQL sources used  
**Requirement Source:** GPT-approved business rules  
**Staff Owner:** Jackshan  
**Supporting AIOS Staff / Reviewer:** Piranav  
**Store:** ledsone.co.uk  
**Product Scope:** Jackshan allocated products  
**Reporting Date Range:** 2026-04-07 to 2026-07-07  
**PostgreSQL Sources Checked:** All 13 schemas  
**PostgreSQL Sources Used:** google_search_console.query_page, listings.shopify_listings, listings.shopify_listing_meta  
**External Sources Checked:** None used  
**Files Created:** This file  
**Files Modified:** None  
**Evidence Location:** evidence/Jackshan/requirement-1/  
**Validation Performed:** Yes  
**Duplicate Risk:** None  
**Existing Asset Decision:** N/A  
**Known Limitations:** GSC data only 9 days within 3-month window  
**Next Steps:** N/A  
**Status:** COMPLETE  
**PASS / FAIL:** PASS

---

## Schemas Inspected

13 schemas found: accounting, amazon_campaigns, customer_service, customers, google_ads, google_analytics, google_search_console, inventory, listings, order_management, public, staff, suppliers

## GSC Source: google_search_console.query_page

- **Object type:** Table
- **Row count:** 331,510
- **Date range:** 2026-06-29 to 2026-07-07 (9 days)
- **Site URL for ledsone.co.uk:** `sc-domain:ledsone.co.uk`
- **Search types available:** web, image
- **Used search_type:** web only
- **Key columns:** date, query, page, clicks, impressions, position, site_url, search_type
- **Grain:** date × site_url × search_type × query × page
- **Clicks type:** integer (NOT NULL, default 0)
- **Impressions type:** integer (NOT NULL, default 0)
- **Position type:** numeric (NOT NULL, default 0)
- **Null handling:** clicks and impressions default to 0 — safe to aggregate
- **Status:** SELECTED

### Important: Only 9 Days of Data Available

The maximum available GSC date is 2026-07-07. The full 3-month window (2026-04-07 to 2026-07-07) contains data only from 2026-06-29 to 2026-07-07. All data in the table falls within this 9-day period. This limitation is clearly documented in the dashboard.

## Product Source: listings.shopify_listings

- **Object type:** Table
- **Row count:** 67,269
- **Key columns:** shopify_handle, title, listing_url, item_id, is_parent, channel, site, status
- **Filter for ledsone.co.uk:** channel = 'LEDSone' AND site = 'UK' AND is_parent = 1
- **Status:** SELECTED (for handle resolution and product title/H1)

## Metadata Source: listings.shopify_listing_meta

- **Object type:** Table
- **Row count:** 14,389
- **Key columns:** product_id (Shopify parent product ID), title_tag, description_tag
- **Join key:** product_id → listings.shopify_listings.item_id WHERE is_parent = 1
- **Status:** SELECTED

## Average Position Aggregation

Using impression-weighted average position:
```sql
SUM(position * impressions) / NULLIF(SUM(impressions), 0) AS weighted_avg_position
```
This is the correct method per the requirement ("If raw daily data contains position totals or impression-weighted values, use the source-supported correct method").

## Rejected Sources

- google_search_console.query — query only, no page dimension
- google_search_console.page — page only, no query dimension
- All other schemas — not relevant to GSC/product SEO data
