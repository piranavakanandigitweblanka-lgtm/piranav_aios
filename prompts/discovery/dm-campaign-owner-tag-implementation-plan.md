---
name: dm-campaign-owner-tag-implementation-plan
description: Planning prompt for the Owner column and Owner filter implementation in DM Campaign Products tab. Covers approved tag dictionary, cross-DB source correction, SQL design, classification contract, frontend changes, snapshot compatibility, test matrix, and implementation sequence.
metadata:
  type: prompt
  category: discovery
---

# DM Campaign — Owner Tag Implementation Plan Prompt

## Purpose
Produce the final implementation plan for adding Owner column and Owner filter to the
DM Campaign — Overall Performance → Products tab in the dm-dashboard.
Read code, analyse constraints, write plan. Do not implement. Stop and wait for approval.

## Approved Tag Dictionary (as of 2026-10-28)
SONYA_TAGS (frozenset, strip().lower()):
  `agu`, `agu46-2`, `agu 46-2`, `agu2026`, `dracarys`, `dracarys vermax`, `sonyam&a`

SAJEEPAN_TAGS (frozenset, strip().lower()):
  `sj`, `sjrat`, `sj_c`, `sjk`, `sj_t_ads`, `old sj na`, `sajeepan`, `sajjepan`

PENDING (not yet approved — do NOT include in implementation):
  `sonya`, `sonya_n_c`, `sonya old` — identified as candidates, not confirmed

## Critical: Tags Data Source
The feasibility audit proposed `sales_cache.collection_tag_mapping_products` (App DB, `get_conn()`).
This is WRONG. `PRODUCT_PERF_QUERY` runs in `get_business_conn()` (BUSINESS_DATABASE_URL).
These are different Postgres instances — SQL JOINs cannot cross them.

CORRECT source: `listings.shopify_listing_tag` (BUSINESS_DATABASE_URL, same DB as existing query).
Join chain: `product_item_id` → split_part → `listings.shopify_listings` (is_parent=1, sub_source=104)
           → `shopify_listings.id` → `shopify_listing_tag` (sub_source=104, is_deleted=0/NULL)
Coverage: 99.96% of matched DM products have tags (confirmed live 2026-10-28).

## Classification Contract
Five values: Sonya | Sajeepan | No Tag | Conflict | Unresolved
- Both families present → Conflict
- Only Sonya → Sonya
- Only Sajeepan → Sajeepan
- Tag record available, neither family → No Tag
- No parent listing or invalid product_item_id format → Unresolved
(Do NOT conflate empty retrieved array with missing tag record)

## Files to Modify
- `backend/app/dashboard_pages/dm_campaign.py` (constants, function, query, product dict)
- `frontend/src/admin/pages/DmCampaign.jsx` (state, filter, column, CSV, modal)
- `backend/tests/test_dm_campaign.py` (NEW — unit tests)
