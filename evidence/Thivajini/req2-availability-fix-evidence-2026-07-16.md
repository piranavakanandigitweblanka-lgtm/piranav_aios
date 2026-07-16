# Thivajini Req 2 — Availability & Product Title Fix · Evidence
**Date:** 2026-07-16  
**Title:** Thivajini Req 2 — Availability & Product Title Fix  
**Purpose:** Resolve 453 unknown availability values and missing product titles in the Req 2 Product Performance dashboard  
**Requirement source:** Requirement 2 — Product-Level KPI & Decision Table  
**Team member:** Thivajini  
**Business question:** What is the current Shopify availability and correct product title for all 728 Req 2 products?

---

## Root Cause

The original Req 2 build joined `public.ppc_etl_performance_data.sku` to `public.google_merchant_products.product_id` (merchant_id=5551466539, EUR, FR). 453 of the 728 variant IDs had no matching record in `google_merchant_products` — these products are not in the active Google Merchant feed (not submitted, excluded from feed, or the feed snapshot predates their addition). This caused the `(no title)` and `"unknown"` placeholders.

## ID Mapping Method

- **ID type:** Shopify variant ID (stored as `ppc_etl_performance_data.sku`)  
- **Primary match:** `listings.shopify_listings.item_id` (sub_source=233 = LEDSone FR)  
- **Title source:** Parent listing via `listings.shopify_listings_parent_child_mapping` → parent `listings.shopify_listings.title`  
- **Availability source:** `listings.shopify_listings.quantity` + `status` per rules below  
- **URL source:** `listings.shopify_listings.listing_url` (converted from internal myshopify.com domain to ledsone.fr)

## Availability Rules Applied

| Condition | Status |
|-----------|--------|
| status='active' AND quantity > 0 | `in stock` |
| status='active' AND quantity = 0 | `out of stock` |
| status IN ('draft','archived') | `unavailable` |
| No match in listings.shopify_listings | `not found` |

## PostgreSQL Sources Checked (Read-Only)

- `listings.shopify_listings` — sub_source=233, site='France'
- `listings.shopify_listings_parent_child_mapping`
- `google_ads.merchant_products` — merchant_id=5551466539, country='FR' (secondary, partial coverage)

## Resolution Results for 453 Unknown Entries

| Status | Count |
|--------|-------|
| Resolved — in stock | 389 |
| Resolved — out of stock | 51 |
| Resolved — unavailable | 1 |
| Not found in Shopify listings | 12 |
| Remaining unknown | 0 |
| **Total** | **453** |

## Final Availability Counts (All 728 Products)

| Status | Count |
|--------|-------|
| In stock (original 262 + 389 new) | 651 |
| Out of stock (original 13 + 51 new) | 64 |
| Unavailable | 1 |
| Not found | 12 |
| Unknown | 0 |
| **Total** | **728** |

## Files Modified

- `Staff-requirements/pages/thivajini.html`
  - 453 product entries: title and availability updated
  - Availability filter dropdown: added Unavailable, Not Found options
  - Added `avBadge()` JS helper for styled availability display
  - Updated r2Render() row to use `avBadge(p.av)` instead of plain text

## Evidence Location

`evidence/Thivajini/req2-availability-fix-evidence-2026-07-16.md`

## Status

LOCAL ONLY — not deployed. GPT approval required before deployment.

## Known Limitations

- Titles sourced from `listings.shopify_listings` DB snapshot; may differ if products were renamed after last DB sync
- 12 not-found variant IDs could be deleted products, merged variants, or IDs from a different merchant/channel not present in sub_source=233
- `google_ads.merchant_products` only covers 1,625 variants (FR feed subset); was not the primary source for this fix
- The ledsone.fr URL was constructed by replacing `jedsz8-km.myshopify.com` with `ledsone.fr` from the listing_url field

## Owner / Reviewer

**Owner:** Piranav · **Reviewer:** Thivajini

## PASS / FAIL

**PASS** — All 453 unknowns investigated; 441 resolved from DB; 12 marked "not found" with documented reason; 0 remaining unknown without evidence.
