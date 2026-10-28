---
name: dm-campaign-owner-tag-feasibility-2026-10-28
description: Feasibility audit evidence for adding a Shopify owner tag column and filter to the DM Campaign Products tab. Verdict: READY WITH LIMITATIONS.
metadata:
  type: evidence
---

# Evidence: DM Campaign — Owner Tag Feasibility Audit

**Date:** 2026-10-28
**Branch / HEAD:** `main` / `8427e22`
**Verdict:** READY WITH LIMITATIONS
**Auditor:** Claude Code (piranav AIOS)
**Scope:** Read-only code inspection — no source files modified

---

## 1. Repository Preflight

| Check | Result |
|---|---|
| Branch | `main` |
| HEAD | `8427e22` — matches `origin/main` |
| Working tree | Clean |

---

## 2. Existing AIOS Documentation Consulted

| File | Relevance |
|---|---|
| `evidence/piranav/dm-campaign-overall-performance-audit-2026-10-28.md` | Full page audit — all data sources and schema confirmed |
| `prompts/discovery/dm-dashboard-page-audit.md` | Reusable audit prompt |

No duplicate found for this feasibility topic — new evidence file created.

---

## 3. Shopify Tags in PostgreSQL — Investigation Result

### Confirmed: Tags ARE stored in PostgreSQL

**Table:** `sales_cache.collection_tag_mapping_products`
**Relevant columns:**
- `legacy_id TEXT` — numeric Shopify product ID (e.g. `"12345678"`)
- `tags JSONB NOT NULL DEFAULT '[]'` — exact tag strings as Shopify returns them (e.g. `["AguHP","Dracarys","Sonya","Agu"]`)

**Code evidence:**
- `backend/app/dev_tasks/collection_tag_mapping/storage.py` lines 56–71 (CREATE TABLE)
- `backend/app/dev_tasks/collection_tag_mapping/storage.py` lines 212–229 (store_products — DELETE+INSERT full refresh, tags stored as `Json(p.get("tags") or [])`)
- `backend/app/dev_tasks/collection_tag_mapping/shopify_products.py` lines 7–9 (docstring: "tags (array of strings, real values confirmed e.g. ["AguHP","Dracarys","Sonya",...])") — live-verified against ledsone_uk store on 2026-10-19

**Sync schedule:** Daily at 2:15 AM Sri Lanka time
- `backend/app/dev_tasks/collection_tag_mapping/router.py` lines 115–125 (`products_snapshot = ScheduledSnapshot(interval_days=1, run_hour=2, run_minute=15)`)
- Started in `backend/app/dev_tasks/__init__.py` lines 108, 178

**Coverage:** All active Shopify products from `ledsone_uk` store — full paginated scan of every product, not a subset.

### Confirmed: `listings.shopify_listings` does NOT store tags

The DM Campaign's existing listing resolution table has these columns only:
`id, item_id, sku, mapped_sku, parent_sku, title, product_description, main_image_url, listing_url, shopify_handle, product_type, is_parent, is_child, status`
(Source: `_CATALOGUE_COLUMNS` at `backend/app/automation_task/sajeepan_lens_sql.py` lines 61–64; confirmed by exhaustive grep of all SELECT queries against this table — no `tags` column ever selected anywhere in the codebase.)

---

## 4. Google Ads → Shopify Product → Tags: Join Chain

### product_item_id format (confirmed)
Format: `shopify_gb_<PRODUCT_ID>_<VARIANT_ID>`
Example: `shopify_gb_7891234567_42987654321`

**Existing code confirms format:**
- DM Campaign backend (`dm_campaign.py` line 233): `regexp_replace(product_item_id, '^shopify_gb_[0-9]+_', '') AS variant_id` — strips prefix to get variant_id
- Mahima AI (`mahima_ai.py` line 340–341): `CASE WHEN product_item_id ~* '^shopify_[a-z]+_[0-9]+_[0-9]+$' THEN split_part(product_item_id, '_', 3)` — extracts product_id at position 3

**Not all rows follow this format.** The pattern `~* '^shopify_[a-z]+_[0-9]+_[0-9]+$'` is used as a guard before splitting. Non-conforming product_item_ids exist (rare, plain numeric IDs or other formats).

### Complete join chain
```sql
-- Extract product_id from product_item_id
CASE WHEN p.product_item_id ~* '^shopify_[a-z]+_[0-9]+_[0-9]+$'
     THEN split_part(p.product_item_id, '_', 3)
     ELSE p.product_item_id
END AS shopify_product_id

-- Join to tags table
LEFT JOIN sales_cache.collection_tag_mapping_products ctmp
  ON ctmp.legacy_id = <shopify_product_id>
-- ctmp.tags → JSONB array → classify_owner()
```

### Current DM Campaign listing join (for reference, not for tags)
The existing `resolved` CTE uses `regexp_replace(product_item_id, '^shopify_gb_[0-9]+_', '') AS variant_id` to get the variant_id, then joins `listings.shopify_listings.item_id = r.variant_id`. This correctly resolves SKU/title/URL but carries no tags. The proposed tags join is independent and parallel — it uses the product_id, not the variant_id.

---

## 5. Owner Classification Logic

### Proposed Python function (to be added to `dm_campaign.py`)
```python
SONYA_TAGS = frozenset({'agu', 'sonya'})
SAJEEPAN_TAGS = frozenset({'sj', 'sajeepan', 'sajjepan'})

def _classify_owner(tags: list | None) -> str:
    if not tags:
        return 'No Tag'
    lower_tags = {t.strip().lower() for t in tags}  # strip() required — Shopify tags have leading spaces
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

**Case-insensitive, exact complete-tag matching** — `'aguhp'.lower()` = `'aguhp'` → NOT in SONYA_TAGS → correctly excluded. `'Sonya'.lower()` = `'sonya'` → in SONYA_TAGS → Sonya.

**⚠ strip() is mandatory** — Live DB discovery (2026-10-28) confirmed that many Shopify tags are stored with a leading space (e.g. ` Sonya`, ` SJ`, ` Dracarys`). Without `strip()`, ` Sonya'.strip().lower()` = `'sonya'` matches correctly, but `' Sonya'.lower()` = `' sonya'` does NOT match. Evidence: `evidence/piranav/dm-campaign-owner-tag-discovery-2026-10-28.md` Section 6.

### Why `Conflict` rather than silent assignment
Both tag families on one product is not a data entry error to hide — it's a signal that the product's ownership is ambiguous and needs human attention. `Conflict` surfaces it rather than silently picking one owner.

---

## 6. Filter Architecture — Server-Side vs Client-Side

**Recommendation: Client-side** (same as existing campaign/flag filters)

**Evidence:**
- All current Products tab filtering (campaign, flag, search, sort) is done entirely client-side in `filtered` useMemo on the full `rows` array returned from the API
- The `owner` field would be a pre-computed string in each product object — no additional query at filter time
- Product counts are in the thousands (~21,000 distinct products all-time, ~8,200 in 90 days) — client-side filtering is fast at this scale
- Adding server-side filtering would require query parameter changes and either a new endpoint or complicating the existing cache read path

**Required:** Add `owner` to each product dict in `_compute_product_performance()`, include it in the snapshot. Client reads `product.owner` and filters the same way it filters `product.campaignName` and `product.flag`.

---

## 7. Required Changes Summary

### Backend: `backend/app/dashboard_pages/dm_campaign.py`

1. **New constant block** (near top, after existing constants):
   ```python
   SONYA_TAGS = frozenset({'agu', 'sonya'})
   SAJEEPAN_TAGS = frozenset({'sj', 'sajeepan', 'sajjepan'})
   ```

2. **New `_classify_owner(tags)` function**

3. **Add tags CTE to `PRODUCT_PERF_QUERY`** — new CTE after `resolved`:
   ```sql
   product_tags AS (
     SELECT
       CASE WHEN p.product_item_id ~* '^shopify_[a-z]+_[0-9]+_[0-9]+$'
            THEN split_part(p.product_item_id, '_', 3)
            ELSE p.product_item_id END AS shopify_product_id,
       p.product_item_id,
       ctmp.tags
     FROM (SELECT DISTINCT product_item_id FROM perf) p
     LEFT JOIN sales_cache.collection_tag_mapping_products ctmp
       ON ctmp.legacy_id = CASE WHEN p.product_item_id ~* '^shopify_[a-z]+_[0-9]+_[0-9]+$'
                                 THEN split_part(p.product_item_id, '_', 3)
                                 ELSE p.product_item_id END
   )
   ```
   Then LEFT JOIN `product_tags pt ON pt.product_item_id = r.product_item_id` in the final SELECT.

4. **Add `owner` field** in `_compute_product_performance()` product dict construction:
   ```python
   "owner": _classify_owner(r.get("tags") or []),
   ```

5. **Snapshot** — no structural change needed. `_compute_product_performance()` change is picked up automatically on next scheduled or manual refresh.

### Frontend: `frontend/src/admin/pages/DmCampaign.jsx`

**In `ProductsView`:**
1. Add `const [owner, setOwner] = useState('all')` (line ~308)
2. Add `owner` to `filtered` useMemo dependency array (line ~390)
3. Add owner filter condition in useMemo: `if (owner !== 'all') out = out.filter(r => r.owner === owner)`
4. Add Owner dropdown in filter toolbar (after Campaign dropdown)
5. Add `<th>Owner</th>` column header (after Campaign column)
6. Add `<td>{r.owner ?? 'No Tag'}</td>` in table row (the `?? 'No Tag'` handles stale snapshots without `owner` field)
7. Reset `setOwner('all')` in `onApply()` (same pattern as `setCampaign('all')`)
8. Add `Owner` column to CSV export header and row data

**In `ProductDetailModal`:**
9. Add `Owner` row to the detail table

**Owner filter options:** All Owners | Sonya | Sajeepan | No Tag | Conflict (add Conflict to handle edge case visibly)

---

## 8. Snapshot Compatibility

| Scenario | Behaviour |
|---|---|
| All Time (post-deploy, stale snapshot) | `owner` field absent → frontend `?? 'No Tag'` fallback → all rows show No Tag until snapshot refreshes |
| All Time (after snapshot refresh) | `owner` field present in snapshot JSON → correct |
| Custom date range (always live) | `owner` correct immediately after deploy |
| Manual Refresh button | Triggers `run_sync()` → stale snapshot replaced → owner correct |

**Max stale window after deploy:** up to 6 hours (snapshot refresh interval) for All Time view.

**Note on snapshot JSON schema:** `ScheduledSnapshot` stores the full compute function return value as JSONB. Adding `owner` to the product dict is additive — no migration needed, old snapshot is automatically replaced on next compute. No risk of crashing the read path if `owner` is absent (handled by `?? 'No Tag'` in frontend).

---

## 9. Tags Sync Dependency Risk

The tags join depends on `sales_cache.collection_tag_mapping_products` being current. This table:
- Is controlled by the Collection Tag Mapping dev task sync schedule
- Refreshes daily at 2:15 AM — DM Campaign's product snapshot refreshes every 6 hours
- **Staleness scenario:** A tag added to a Shopify product at 3 AM will appear in the tags table at the next 2:15 AM run (next day) → DM Campaign snapshot will pick it up at the next 6h refresh after the tags sync completes. Maximum lag: ~30 hours.
- **If tags sync fails:** All products will show their last-known owner, which is correct for historical snapshots. No null-pointer risk since `tags` JSONB defaults to `'[]'`.

---

## 10. Edge Cases and Handling

| Edge Case | Recommended Behaviour | Rationale |
|---|---|---|
| Product has neither Sonya nor Sajeepan tags | `No Tag` | Clean three-option design; no ambiguity |
| Product has both tag families | `Conflict` | Surfaces data quality issue rather than hiding it |
| Product not in `collection_tag_mapping_products` (LEFT JOIN null) | `No Tag` (tags = null → `_classify_owner(None)` → `'No Tag'`) | Indistinguishable from confirmed no-tag without an extra "Unresolved" state — acceptable given ~27% already shown as "Unknown Product" |
| `owner` absent in stale snapshot | `No Tag` (frontend `?? 'No Tag'`) | Safe default; resolves within max 6h |
| Case variations (AGU / Agu / agu) | All resolve to `'agu'` after `.lower()` → same owner | Correct |
| `AguHP` (partial match but NOT in tag list) | `'aguhp'` ∉ SONYA_TAGS → `No Tag` | Correct — exact complete-tag matching, not substring |
| `Sajjepan` typo variant | Included in SAJEEPAN_TAGS as `'sajjepan'` | As specified in requirements |
| Product has other unrelated tags (e.g. `Dracarys`) | Only SONYA_TAGS / SAJEEPAN_TAGS checked → `No Tag` | Correct |

---

## 11. Files Inspected

| File | Inspected For |
|---|---|
| `frontend/src/admin/pages/DmCampaign.jsx` | Products tab structure, filter/sort/pagination, CSV export, modal |
| `backend/app/dashboard_pages/dm_campaign.py` | PRODUCT_PERF_QUERY, snapshot config, data flow |
| `backend/app/dev_tasks/collection_tag_mapping/storage.py` | Table schema, store_products(), tags column |
| `backend/app/dev_tasks/collection_tag_mapping/router.py` | Sync schedule, products_snapshot config |
| `backend/app/dev_tasks/collection_tag_mapping/shopify_products.py` | Shopify API query, tag values confirmed live |
| `backend/app/automation_task/sajeepan_lens_sql.py` | _CATALOGUE_COLUMNS (listings.shopify_listings schema) |
| `backend/app/dashboard_pages/listings.py` | Shopify GraphQL for tags — live API only, no DB storage |
| `backend/app/dashboard_pages/sku_audit.py` | Shopify GraphQL for tags — live API only, no DB storage |
| `backend/app/ai_chat/mahima_ai.py` | split_part(product_item_id, '_', 3) product ID extraction pattern |

---

## 12. Unresolved Questions for Human Approval

| # | Question | Impact |
|---|---|---|
| 1 | Should `Conflict` be a selectable Owner filter option, or should it be collapsed into `No Tag` for the initial release? | Filter option count and UX |
| 2 | Should the Owner column be visible by default or hidden behind a toggle? | Table column count (currently 8 columns) |
| 3 | Tag freshness: is a max ~30-hour lag between a Shopify tag change and the dashboard reflecting it acceptable? | SLA for owner classification accuracy |
| 4 | Is `sales_cache.collection_tag_mapping_products` an approved shared data source for DM Campaign? Or should a dedicated product-tags sync be set up? | Architecture / ownership of the tags pipeline |
| 5 | Should the Product Detail Modal show Owner, and should it show the raw Shopify tags for transparency? | Modal content scope |
| 6 | For the ~27% "Unknown Product" rows: should they show `No Tag` (current recommendation) or a separate `Unresolved` owner state? | Classification completeness vs simplicity |

---

## 13. Testing and Validation Plan (for implementation phase)

1. Unit test `_classify_owner()` against all 9 defined tag strings + `AguHP` false-positive + empty/None + conflict case
2. SQL: verify `split_part('shopify_gb_7891234567_42987654321', '_', 3) = '7891234567'`
3. DB join: manually query `SELECT legacy_id, tags FROM sales_cache.collection_tag_mapping_products WHERE legacy_id IN (SELECT split_part(product_item_id, '_', 3) FROM google_ads.product_performance WHERE campaign_id IN (...DM...) LIMIT 10)` to confirm match rate
4. End-to-end: load Products tab → verify Owner column appears → filter by Sonya → confirm only Sonya rows shown
5. CSV export: open exported file → confirm Owner column present
6. Snapshot stale handling: temporarily return a product object without `owner` from the API → confirm frontend renders `No Tag` without error
7. Regression: confirm existing campaign/flag/search filters still work alongside owner filter
