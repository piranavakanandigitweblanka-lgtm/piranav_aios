---
name: sajeepan-ads-scope-level6a-lifetime-scope
description: Verify and correct Sajeepan Ads Product Scope to use lifetime product membership with windowed performance metrics
metadata:
  type: prompt
---

# Prompt: Sajeepan Ads Product Scope — Lifetime Verification + Correction (Level 6A)

## What This Prompt Does

Verifies campaign ownership, builds the lifetime product ID population, corrects
the Admin Ads Product Scope page from 30-day product membership to lifetime product
membership, and validates the result.

## When to Use

When an Ads Product Scope page is using a date-windowed product population but the
business requirement is lifetime product membership (all products ever in the campaigns).

## Prompt

```
We have an Admin Ads Product Scope page. Currently it filters products by a 30-day window,
so the product list changes every day. The business requirement is:

PRODUCT MEMBERSHIP = LIFETIME (all products ever in the verified campaigns)
PERFORMANCE METRICS = SELECTED WINDOW (7 / 30 / 90 days)

Task:

1. VERIFY campaign ownership — confirm all campaign IDs are definitively assigned to
   this staff member via google_ads.campaigns.group_name and campaign_name fields.

2. BUILD LIFETIME SCOPE — query google_ads.product_performance with no date filter
   to get all distinct product_item_ids ever in the staff's campaigns.

3. NORMALIZE with Jefri pattern (shopify_* → split_part last segment, else use directly).

4. DEDUPLICATE — products appearing in both shopify_GB_* and bare-numeric format
   should resolve to a single row per shopify_id.

5. MATCH to listings.shopify_listings (site=UK). Products not found = UNMATCHED
   (removed from catalogue — keep in scope, classify as UNMATCHED).

6. CLASSIFY using existing business rules (GROUP_A / GROUP_B / ON_SALE / etc.).

7. SPLIT the query into:
   - LIFETIME_SCOPE_QUERY (no date filter, returns classified products, no metrics)
   - METRICS_QUERY (date-filtered aggregation, fast, returns {shopify_id: spend/clicks/etc.})

8. SNAPSHOT stores lifetime classification only. Metrics overlaid at endpoint time per window.

9. FRONTEND — update to clearly show:
   "Lifetime Product Scope" + "Performance Window: Last N days"

Do NOT change existing staff dashboards or other admin pages.
Do NOT deploy or commit.
```

## Technical Constraints

- Business DB pool: max 4, do not increase
- No LATERAL joins (N+1 anti-pattern — use CTE pre-aggregation for merchant_products)
- No ::text cast on item_id (prevents index use — remove it)
- Snapshot stores lifetime scope; metrics always fetched fresh per window request
- sajeepan.py must remain unchanged

## Expected Lifetime Counts (Sajeepan, verified 2026-09-25)

- Raw distinct product_item_ids: 19,350
- Distinct normalized shopify_ids: 17,137
- GROUP_A: ~4,814
- GROUP_B: ~1,577
- ON_SALE: ~7,566
- SALE_SIGNAL_CONFLICT: ~5
- NON_SALE_INACTIVE: ~85
- UNMATCHED: ~3,083
- UNRESOLVED: ~7
- Total: 17,137
