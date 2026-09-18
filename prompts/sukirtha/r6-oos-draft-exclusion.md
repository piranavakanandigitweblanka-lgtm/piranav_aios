---
name: sukirtha-r6-oos-draft-exclusion
description: Exclude OOS and Draft products from Sukirtha R6 Missing Meta list — wasted work to optimise unavailable products
metadata:
  type: implementation
---

# Prompt: Sukirtha R6 — OOS and Draft Product Exclusion

**Registered:** 2026-09-18
**Status:** ACTIVE
**Category:** implementation

## What This Builds

Exclude Out-of-Stock (OOS) and Draft products from the Missing Meta Titles/Descriptions list (Requirement 6) for ledsone.de. SEO optimisation on unavailable products is wasted effort and misleads the AI brief.

## Two-Layer Fix

### Layer 1 — Shopify GraphQL level
Add `query: "status:active"` filter to the product query to exclude DRAFT products at the API level.
Add `status` and `totalInventory` fields to the node response.

### Layer 2 — Post-processing skip logic
```python
if p.get("status") == "DRAFT":
    continue
if (p.get("totalInventory") or 0) == 0:
    continue
```

## Files

- `dm-dashboard/backend/app/sukirtha.py` — `R6_PRODUCTS_QUERY` and `_req6_payload_compute()`

## Key Constraints

- Store is ledsone.de (Shopify store: `ledsone_de`)
- `get_oos_draft_listing_urls("DE")` in `ai_shared.py` is already used by `sukirtha_ai.py` to filter the AI brief separately — this fix targets the frontend R6 table itself
- Commit: `41576bf` on `websitetecteam-arch/dm-dashboard` piranv-work
