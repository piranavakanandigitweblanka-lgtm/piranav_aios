---
name: sukirtha-r6-oos-draft-exclusion
description: Sukirtha R6 Missing Meta list now excludes OOS and Draft products — two-layer filter at Shopify GraphQL and post-processing levels
metadata:
  type: capability
---

# Capability: Sukirtha R6 — OOS/Draft Exclusion

**Date:** 2026-09-18
**Commit:** `41576bf` on `websitetecteam-arch/dm-dashboard` piranv-work

## What It Does

Sukirtha's R6 Missing Meta Titles/Descriptions page now excludes:
- Draft products (filtered at Shopify GraphQL API level via `query: "status:active"`)
- Out-of-stock products (filtered post-processing via `totalInventory == 0` check)

## Why

SEO optimisation on unavailable products is wasted work and was polluting the AI brief with irrelevant tasks.

## Where

`dm-dashboard/backend/app/sukirtha.py` — `R6_PRODUCTS_QUERY` and `_req6_payload_compute()`

## How to Reuse

Same two-layer pattern (GraphQL status filter + post-process OOS skip) applies to any other staff missing meta or product-level requirement for ledsone.de.
