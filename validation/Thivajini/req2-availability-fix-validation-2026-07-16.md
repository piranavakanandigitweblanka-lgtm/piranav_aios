# Thivajini Req 2 — Availability & Title Fix · Validation
**Date:** 2026-07-16  
**File validated:** Staff-requirements/pages/thivajini.html

---

## Reconciliation Table

| Check | Original Count | Resolved | Unresolved | PASS / FAIL |
|---|---|---|---|---|
| Total products in dashboard | 728 | 728 | 0 | PASS |
| Product titles — (no title) | 453 | 453 | 0 | PASS |
| In stock | 262 | 651 (after resolving 389 more) | 0 | PASS |
| Out of stock | 13 | 64 (after resolving 51 more) | 0 | PASS |
| Unknown availability | 453 | 441 resolved to real status | 0 remaining unknown | PASS |
| Unavailable | 0 | 1 | — | PASS |
| Not found (no Shopify match) | 0 | 12 | 12 (documented) | PASS |
| Shopify product matches | 0 of 453 | 441 of 453 | 12 not found | PASS |

## Final Availability Distribution (728 total)

| Status | Count |
|--------|-------|
| in stock | 651 |
| out of stock | 64 |
| unavailable | 1 |
| not found | 12 |
| unknown | 0 |
| **Total** | **728** |

## Validation Checks

| Check | Result |
|-------|--------|
| Total rows = 728 | PASS |
| Every row has Product ID | PASS |
| Every row has Product Title (no "(no title)") | PASS |
| No "unknown" availability values | PASS |
| Every "not found" has documented reason (no DB match) | PASS |
| Availability filter dropdown includes all statuses | PASS |
| avBadge() renders styled badges per status | PASS |
| Panel-1 (Conversion Tracking) unchanged | PASS |
| Panel-3 (Stock-Spend Tracker) unchanged | PASS |
| Panel-4 (Order Data) unchanged | PASS |

## Not Found IDs — Documented Reason

12 variant IDs from `ppc_etl_performance_data.sku` have no matching record in `listings.shopify_listings` (sub_source=233). These could be:
- Deleted Shopify variants
- Variants from a different channel/merchant
- IDs that were merged or replaced

These are marked `av="not found"` and `t="not found"` — visible in the dashboard with a pink "Not Found" badge. They should be reviewed by Thivajini to confirm disposition.

## PASS / FAIL

**PASS** — All 728 rows validated. Zero unknown values remain without investigation. 12 not-found IDs are documented and visible in the dashboard.
