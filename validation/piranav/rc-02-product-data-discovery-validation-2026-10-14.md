# Validation — RC-02 Product Data Discovery

**Date:** 2026-10-14
**Req ID:** RC-02
**Type:** Discovery validation — read-only

---

## Inspection Checklist

| Check | Result |
|---|---|
| RC-01 backend module read and understood | ✅ PASS |
| RC-01 frontend (413-line main branch version) read | ✅ PASS |
| conduit_sold.py line-item GraphQL query inspected | ✅ PASS |
| shopify_client.py shared client confirmed | ✅ PASS |
| scheduled_snapshot.py pattern confirmed | ✅ PASS |
| db.py pools confirmed (app DB + business DB) | ✅ PASS |
| featuredImage pattern confirmed (jefri_nonmoving.py) | ✅ PASS |
| listings.shopify_listings.main_image_url confirmed | ✅ PASS |
| Refund convention confirmed (gross qty, not net) | ✅ PASS |
| No existing RC-02 docs (no duplicates) | ✅ PASS — confirmed zero pre-existing RC-02 files |
| No application code modified | ✅ PASS — discovery only |

---

## Data Availability Summary

| Required Field | Available | Source |
|---|---|---|
| Order ID | ✅ | Shopify order.legacyResourceId |
| Customer ID | ✅ | Shopify customer.legacyResourceId |
| Product ID | ✅ | variant.product.legacyResourceId |
| Variant ID | ✅ | variant.legacyResourceId |
| Product title | ✅ | variant.product.title |
| Variant title | ⚠️ NEEDS ADDING | Add `variant { title }` to query |
| SKU | ✅ | lineItem.sku |
| Quantity | ✅ | lineItem.quantity |
| Product image | ✅ | listings.shopify_listings.main_image_url (business DB) |
| Valid-order filter | ✅ | cancelledAt IS NULL + NOT VOIDED (RC-01 rule reused) |
| Refund qty | N/A | Gross convention — not subtracted |

---

## Overall Status

**PASS** — All required fields confirmed available. No blockers to Stage B implementation. One minor addition needed: `variant { title }` in the extended GraphQL query.
