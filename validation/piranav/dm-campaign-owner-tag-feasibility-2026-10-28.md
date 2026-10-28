---
name: dm-campaign-owner-tag-feasibility-validation-2026-10-28
description: Validation checklist for the DM Campaign owner tag feasibility audit. Read-only code inspection.
metadata:
  type: validation
---

# Validation: DM Campaign — Owner Tag Feasibility Audit

**Date:** 2026-10-28
**Type:** Code-only inspection

| Check | Result | Evidence |
|---|---|---|
| Repository on correct branch/HEAD | PASS | `main` / `8427e22` |
| Shopify tags stored in PostgreSQL — confirmed | PASS | `sales_cache.collection_tag_mapping_products.tags` JSONB (storage.py line 65) |
| Tag values confirmed live against real store | PASS | shopify_products.py docstring line 7–9 (verified 2026-10-19) |
| `listings.shopify_listings` has NO tags column | PASS | Exhaustive grep of all SELECT queries — no `tags` column found anywhere |
| product_item_id format confirmed (`shopify_gb_<PID>_<VID>`) | PASS | dm_campaign.py line 233; mahima_ai.py line 341 |
| product_id extraction pattern confirmed (`split_part(..., '_', 3)`) | PASS | mahima_ai.py lines 340–341 |
| Tags sync schedule documented | PASS | router.py lines 115–125 (daily 2:15 AM) |
| Full product coverage confirmed | PASS | shopify_products.py lines 57–107 (paginated full scan) |
| Classification logic verified for all required tags | PASS | Defined in evidence; exact-match case-insensitive |
| False positive `AguHP` correctly excluded | PASS | `'aguhp'` ∉ SONYA_TAGS |
| Conflict case documented | PASS | Both tag sets present → `'Conflict'` |
| Snapshot stale handling documented | PASS | `?? 'No Tag'` frontend fallback |
| Required changes fully enumerated | PASS | Backend (5 changes) + Frontend (9 changes) documented |
| 6 unresolved questions requiring human approval identified | PASS | Evidence section 12 |
| No source code modified | PASS | Read-only audit |

## Status: PASS — Feasibility audit complete. READY WITH LIMITATIONS. Awaiting human approval to proceed.
