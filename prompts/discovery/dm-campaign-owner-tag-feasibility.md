---
name: dm-campaign-owner-tag-feasibility
description: Reusable feasibility audit prompt for adding a Shopify-tag-based owner classification column and filter to the DM Campaign Products tab. Covers data availability, join chain, classification logic, edge cases, and required changes.
metadata:
  type: prompt
  category: discovery
---

# DM Campaign — Owner Tag Feasibility Prompt

## Purpose
Determine whether Shopify product owner tags (Sonya / Sajeepan / No Tag) can be reliably added to the DM Campaign — Overall Performance Products tab by auditing the existing data pipeline, without implementing any changes.

## Key Questions to Answer
1. Are Shopify product tags stored in PostgreSQL? In which table and column?
2. Can the DM Campaign `product_item_id` be reliably mapped to a Shopify product that has tags?
3. What is the complete join chain: `product_item_id` → product_id → tags?
4. Which components, SQL queries, and snapshot schema need modification?
5. Should the Owner filter be server-side or client-side?
6. How should edge cases be handled (conflicts, delisted products, missing matches)?

## Join Chain (confirmed via code audit)
```
google_ads.product_performance.product_item_id (format: shopify_gb_<PRODUCT_ID>_<VARIANT_ID>)
  → extract PRODUCT_ID: split_part(product_item_id, '_', 3)
    (validate format first: product_item_id ~* '^shopify_[a-z]+_[0-9]+_[0-9]+$')
  → sales_cache.collection_tag_mapping_products.legacy_id (TEXT, numeric product ID)
  → tags JSONB (array of strings, e.g. ["AguHP","Dracarys","Sonya"])
  → classify_owner(tags)
```

## Classification Logic
```python
SONYA_TAGS = {'agu', 'sonya'}  # lowercase exact match
SAJEEPAN_TAGS = {'sj', 'sajeepan', 'sajjepan'}  # lowercase exact match

def classify_owner(tags: list[str] | None) -> str:
    if not tags:
        return 'No Tag'
    lower_tags = {t.lower() for t in tags}
    has_sonya = bool(lower_tags & SONYA_TAGS)
    has_sajeepan = bool(lower_tags & SAJEEPAN_TAGS)
    if has_sonya and has_sajeepan:
        return 'Conflict'
    if has_sonya:
        return 'Sonya'
    if has_sajeepan:
        return 'Sajeepan'
    return 'No Tag'
```

## Tags Table Source
- Table: `sales_cache.collection_tag_mapping_products`
- Columns used: `legacy_id TEXT`, `tags JSONB`
- Sync: daily at 2:15 AM Sri Lanka time (ScheduledSnapshot, interval_days=1)
- Coverage: ALL active Shopify products from ledsone_uk store
- Code: `backend/app/dev_tasks/collection_tag_mapping/router.py`, `storage.py`

## Files to Modify (when approved)
- `backend/app/dashboard_pages/dm_campaign.py` — add tags CTE to PRODUCT_PERF_QUERY, add `_classify_owner()`, add `owner` field to product dict
- `frontend/src/admin/pages/DmCampaign.jsx` — add owner state, filter, column, CSV export, modal field, snapshot fallback

## Key Limitations
- Tags table is a dev-task artifact, not a dedicated product tags source
- Up to 24-hour lag between Shopify tag changes and dashboard reflection
- ~27% unresolvable product_item_ids (delisted) will show as `No Tag`
- Stale snapshot after deploy will lack `owner` until next 6h refresh
