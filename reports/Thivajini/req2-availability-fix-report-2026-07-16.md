# Thivajini Req 2 — Availability & Title Fix · Report
**Date:** 2026-07-16  
**Requirement:** Requirement 2 — Product-Level KPI & Decision Table  
**Staff:** Thivajini  
**Build owner:** Piranav (AIOS)

---

## Summary

Resolved 453 missing product titles and unknown availability values in the Req 2 Product Performance dashboard.

**Root cause:** 453 Shopify variant IDs in the Google Ads performance data had no match in `google_merchant_products` (the original data source), because these products were not in the active Google Merchant Center feed at build time.

**Fix:** Matched variant IDs against `listings.shopify_listings` (sub_source=233, LEDSone FR) to obtain live product titles (via parent join) and current availability (from quantity + status).

## Results

| Check | Result |
|-------|--------|
| Products with (no title) before | 453 |
| Products with (no title) after | **0** |
| Unknown availability before | 453 |
| Unknown availability after | **0** |
| Resolved from Shopify listings | 441 |
| Not found in any source | 12 (documented) |

## Final Availability Distribution

| Status | Count |
|--------|-------|
| In Stock | 651 |
| Out of Stock | 64 |
| Unavailable | 1 |
| Not Found | 12 |
| Unknown | 0 |
| **Total** | **728** |

## HTML Changes

- `Staff-requirements/pages/thivajini.html`
  - 453 product data entries updated (title + availability + URL where available)
  - Availability filter dropdown: added Unavailable and Not Found options
  - Added `avBadge()` function for colour-coded availability badges
  - r2Render() updated to render badges instead of plain text

## Data Sources Used (Read-Only)

- `listings.shopify_listings` — sub_source=233
- `listings.shopify_listings_parent_child_mapping`

## PASS / FAIL

**PASS**
