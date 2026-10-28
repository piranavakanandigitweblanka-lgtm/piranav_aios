---
name: dm-campaign-single-product-notag-unknown-ENC10233-validation-2026-10-28
description: Validation record for read-only investigation of ENC10233 Owner=No Tag + Stock=Unknown. Confirms all DB traces completed, no code changes made.
metadata:
  type: validation
---

# Validation: DM Campaign Single-Product Investigation — ENC10233

**Date:** 2026-10-28
**Task:** Read-only root cause investigation for `shopify_gb_15388397830530_56874289561986`

---

## Checklist

| Check | Result |
|---|---|
| Product item ID parsed correctly (pid=15388397830530, vid=56874289561986) | PASS |
| Variant listing found in `listings.shopify_listings` (id=1018958, sku=ENC10233) | PASS |
| UK parent listing found (id=1018957, sub_source=104, is_parent=1) | PASS |
| `has_listing = TRUE` confirmed | PASS |
| All 4 raw tags retrieved from `listings.shopify_listing_tag` (is_deleted=0) | PASS |
| Tags match screenshot (`2026New`, `LMS`, `Pendant Lights`, `SJNEW26`) | PASS |
| `strip().lower()` normalisation applied and checked against `SONYA_TAGS` | PASS |
| `strip().lower()` normalisation applied and checked against `SAJEEPAN_TAGS` | PASS |
| `SJNEW26` confirmed NOT in either approved tag set (exact match only) | PASS |
| `_classify_owner()` trace confirmed: `No Tag` because no approved tag matched | PASS |
| `inventory.products` queried for ENC10233 → `inventory_bool=false` confirmed | PASS |
| UK stock row found in `local_inventory_current_stock_location_wise` → `stock=0` | PASS |
| `_classify_stock()` trace confirmed: `inventory_bool=False` fires second guard | PASS |
| Frontend `ukStock` display checked: `0` = real raw stock, not None→0 conversion | PASS |
| No code changes made | PASS |
| No DB data changes made | PASS |
| No commits made during investigation | PASS |
| `SJNEW26` not inferred as Sajeepan without authoritative documentation | PASS |

## Overall: PASS

All investigation steps completed. Root causes confirmed from live DB data. No ambiguity in UI display for this product. Proposed fixes documented, awaiting Piranav approval before implementation.
