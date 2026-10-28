---
name: dm-campaign-owner-tag-implementation-plan-2026-10-28
description: Final implementation plan for Owner column and Owner filter in DM Campaign Products tab. Approved tag dictionary, corrected data source (listings.shopify_listing_tag not sales_cache), SQL design, Python classification function, frontend changes, snapshot compatibility, test matrix, and implementation sequence. Read-only planning — no code changed.
metadata:
  type: evidence
---

# Evidence: DM Campaign — Owner Tag Implementation Plan

**Date:** 2026-10-28
**Branch / HEAD:** `main` / `8427e22` (confirmed clean, no working-tree changes)
**Auditor:** Claude Code (piranav AIOS)
**Scope:** Read-only planning — no application source files modified

---

## 1. Repository Preflight

| Check | Result |
|---|---|
| Branch | `main` |
| HEAD | `8427e22` — unchanged from prior session |
| Working tree | Clean (no application files modified) |
| Files read | `dm_campaign.py`, `DmCampaign.jsx`, `storage.py`, `db.py`, `scheduled_snapshot.py` |

---

## 2. Approved Owner Tag Dictionary

Normalisation rule: `t.strip().lower()` — always strip leading/trailing whitespace, then lowercase.
Never use substring matching. Never add unapproved tags to frozensets.

### 2a. SONYA_TAGS (approved by Piranav, 2026-10-28)

| Raw tag (as stored in DB) | Normalised | Products (confirmed) |
|---|---|---|
| `AGU` | `agu` | Case variant — covered |
| `Agu46-2` / ` Agu46-2` | `agu46-2` | 1,024 + 466 (space variant stripped) |
| `Agu 46-2` | `agu 46-2` | Reported internal-space variant |
| `AGU2026` | `agu2026` | 283 |
| `Dracarys` / ` Dracarys` | `dracarys` | 420 |
| `Dracarys Vermax` / ` Dracarys Vermax` | `dracarys vermax` | 180 |
| `SonyaM&A` / ` SonyaM&A` | `sonyam&a` | 169 |

```python
SONYA_TAGS = frozenset({
    'agu', 'agu46-2', 'agu 46-2', 'agu2026',
    'dracarys', 'dracarys vermax', 'sonyam&a',
})
```

### 2b. SAJEEPAN_TAGS (approved by Piranav, 2026-10-28)

| Raw tag (as stored in DB) | Normalised | Products (confirmed) |
|---|---|---|
| `SJ` / ` SJ` | `sj` | 932 |
| `SJRAT` / ` SJRAT` | `sjrat` | 383 |
| `SJ_C` / ` SJ_C` | `sj_c` | 206 |
| `SJK` / ` SJK` | `sjk` | 202 |
| `SJ_T_ADS` / ` SJ_T_ADS` | `sj_t_ads` | 180 |
| `OLD SJ NA` / ` OLD SJ NA` | `old sj na` | 152 |
| `Sajeepan` | `sajeepan` | Rare — included as specified |
| `Sajjepan` | `sajjepan` | Typo variant — included as specified |

```python
SAJEEPAN_TAGS = frozenset({
    'sj', 'sjrat', 'sj_c', 'sjk', 'sj_t_ads', 'old sj na',
    'sajeepan', 'sajjepan',
})
```

### 2c. PENDING Candidate Tags (NOT approved — do NOT include in implementation)

From the discovery report, these tags also appear on products with Sonya-name evidence:
- `Sonya` / ` Sonya` — 1,147 products
- `Sonya_N_C` / ` Sonya_N_C` — 192 products
- `Sonya Old` / ` Sonya Old` — 172 products

**Status:** Piranav's approved list (Section 2a) did NOT include these three tags.
Per the instruction: "If they are not independently confirmed, list them as pending rather than silently adding."
These MUST NOT be added to SONYA_TAGS until Piranav explicitly approves them.

A comment in the code should reference this pending list so it is not silently forgotten.

### 2d. Unresolved Tag Families (not Sonya or Sajeepan — do not assign)

| Tag Family | Products | Decision Required |
|---|---|---|
| `Sixnyne Collective` family | ~3,200+ | Unknown identity — NOT a 3rd owner unless Piranav confirms |
| `Thisoban` / `Thiso` | ~1,400 | Unknown identity — NOT a 3rd owner unless Piranav confirms |

These tags appearing on a product alongside a confirmed owner tag (e.g., `SJ` + `Sixnyne Collective`)
do NOT override the confirmed owner — the product is still classified as Sajeepan (or Sonya) per its
confirmed tag. These unrecognised tags are simply ignored by the classification function.
If BOTH a confirmed-owner tag AND `Sixnyne Collective` appear, only the confirmed owner matters;
`Sixnyne Collective` is not a trigger for `Conflict` unless it maps to an approved owner family.

---

## 3. Critical Data Source Correction

**Feasibility audit (Task 4) proposed:** `sales_cache.collection_tag_mapping_products` (via SQL LEFT JOIN)
**This is WRONG — cross-database join impossible.**

### Why the proposed source was wrong

From reading `db.py`:
- `get_conn()` → `DATABASE_URL` = **App DB** — hosts `sales_cache` schema, snapshot tables, users/sessions
- `get_business_conn()` → `BUSINESS_DATABASE_URL` = **Business/Ledsone prod DB** — hosts `google_ads`, `listings`, `order_management`

`PRODUCT_PERF_QUERY` in `dm_campaign.py` uses `get_business_conn()` and joins tables in `google_ads`, `listings`, `order_management` schemas.
`sales_cache.collection_tag_mapping_products` (managed by `storage.py`) is accessed via `get_conn()` (App DB).

**These are two different Postgres instances. A SQL JOIN cannot span them.**

Attempting `LEFT JOIN sales_cache.collection_tag_mapping_products ctmp ON ctmp.legacy_id = ...` inside
`PRODUCT_PERF_QUERY` would fail with `relation "sales_cache.collection_tag_mapping_products" does not exist`
(same error confirmed in the discovery session when the MCP tool — which connects to DATABASE_URL — tried to
query `sales_cache` and failed because it was the wrong DB).

### Correct data source: `listings.shopify_listing_tag`

This table is in the `listings` schema inside `BUSINESS_DATABASE_URL` — the same DB as all existing
DM Campaign queries. A regular SQL LEFT JOIN is valid.

**Coverage confirmed (live, 2026-10-28):**
- 4,772 of 4,774 matched products have tags (99.96%)
- 350 products have no UK parent listing and will correctly return `Unresolved`

### Alternative: Python-level cross-DB lookup

If, for any reason, `sales_cache.collection_tag_mapping_products` is preferred:
1. Run `PRODUCT_PERF_QUERY` via `get_business_conn()` as today
2. Extract all distinct shopify_pids from the result in Python
3. Batch-query `sales_cache.collection_tag_mapping_products` via `get_conn()` (App DB)
4. Build a `{legacy_id: tags}` dict in Python
5. Apply `_classify_owner()` per product in the Python loop

This works but adds a second DB connection and a Python-level join for every snapshot compute.
The `listings.shopify_listing_tag` SQL approach is simpler, single-query, and confirmed higher coverage.

**Recommendation: use `listings.shopify_listing_tag` (SQL join approach).**

---

## 4. SQL Design — Modified `PRODUCT_PERF_QUERY`

### New CTEs to add (insert before the final SELECT)

```sql
product_pids AS (
  -- Extract the Shopify product ID (field 3 of underscore split) from each
  -- distinct product_item_id. Format-invalid IDs get shopify_pid = NULL and
  -- will resolve to Unresolved in Python.
  SELECT DISTINCT product_item_id,
    CASE WHEN product_item_id ~* '^shopify_[a-z]+_[0-9]+_[0-9]+$'
         THEN split_part(product_item_id, '_', 3)
         ELSE NULL END AS shopify_pid
  FROM perf
),
owner_parent AS (
  -- LEFT JOIN so format-valid PIDs with no UK parent listing can be
  -- distinguished from format-invalid PIDs; has_listing tracks this.
  SELECT pp.product_item_id,
    sl.id AS sl_id,
    (pp.shopify_pid IS NOT NULL AND sl.id IS NOT NULL) AS has_listing
  FROM product_pids pp
  LEFT JOIN listings.shopify_listings sl
    ON sl.item_id = pp.shopify_pid AND sl.sub_source = 104 AND sl.is_parent = 1
),
owner_tags AS (
  -- Aggregate all active UK tags per product into a single array, preserving
  -- the has_listing flag so Python can distinguish "no listing" (Unresolved)
  -- from "listing found but zero tags" (No Tag).
  SELECT op.product_item_id,
    op.has_listing,
    ARRAY_AGG(slt.tag) FILTER (WHERE slt.tag IS NOT NULL) AS tags
  FROM owner_parent op
  LEFT JOIN listings.shopify_listing_tag slt
    ON slt.product_id = op.sl_id AND slt.sub_source = 104
    AND (slt.is_deleted = 0 OR slt.is_deleted IS NULL)
  GROUP BY op.product_item_id, op.has_listing
)
```

### Final SELECT modification

Add to the JOIN list:
```sql
LEFT JOIN owner_tags ot ON ot.product_item_id = r.product_item_id
```

Add to the SELECT list:
```sql
ot.tags, ot.has_listing
```

### Cardinality safety

The `product_pids` CTE uses `SELECT DISTINCT product_item_id` — one row per product_item_id.
`owner_parent` and `owner_tags` also group by product_item_id.
The final `LEFT JOIN owner_tags ot ON ot.product_item_id = r.product_item_id` joins ONE tag-array row
to each (product_item_id, campaign_id) row in `resolved`. No row explosion occurs.
All existing Google Ads metrics (imp, clk, sp, cv, cvv, first_date, days_live) are unaffected.

### Why this join preserves all existing metrics

`owner_tags` adds two columns only — it never filters, inflates, or modifies any row from `resolved`.
The final SELECT's WHERE clause (none) and all aggregations in CTEs above `resolved` are unchanged.

---

## 5. Python Classification Function

### Final `_classify_owner()` design

```python
# Tags approved by Piranav (2026-10-28)
# PENDING (not yet approved): 'sonya', 'sonya_n_c', 'sonya old'
# — add only after explicit Piranav confirmation
SONYA_TAGS = frozenset({
    'agu', 'agu46-2', 'agu 46-2', 'agu2026',
    'dracarys', 'dracarys vermax', 'sonyam&a',
})
SAJEEPAN_TAGS = frozenset({
    'sj', 'sjrat', 'sj_c', 'sjk', 'sj_t_ads', 'old sj na',
    'sajeepan', 'sajjepan',
})


def _classify_owner(tags: list | None, has_listing: bool) -> str:
    """Classify product owner from Shopify tags.

    has_listing: True if a UK parent listing (sub_source=104) was found for
    this product_item_id's Shopify product ID.  False means the product is
    delisted / not in the UK catalogue — no tags available.

    tags: ARRAY_AGG from shopify_listing_tag for this product; None if no
    active tags exist even though a parent listing was found.
    """
    if not has_listing:
        return 'Unresolved'
    if not tags:
        # has_listing=True but zero active tags — confirmed 2 products exist
        return 'No Tag'
    lower_tags = {t.strip().lower() for t in tags if t}
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

### False positive protection: `AguHP`

`'aguhp'.strip().lower()` = `'aguhp'` — NOT in SONYA_TAGS → correctly returns `No Tag` or the
owner's other confirmed tag. Exact complete-tag matching, never substring.

### Unapproved tags alongside confirmed owner tag

If a product has `['SJ', 'Sixnyne Collective']`:
- `lower_tags` = `{'sj', 'sixnyne collective'}`
- `has_sonya = False`, `has_sajeepan = True` (via `'sj'`)
- Result: `Sajeepan` — unrecognised `Sixnyne Collective` is simply ignored

If a product has `['Sixnyne Collective']` only:
- Neither frozenset matches → `No Tag`

---

## 6. Product Dict Change in `_compute_product_performance()`

In the Python loop at line ~309, add to the dict:

```python
tags_list = list(r["tags"]) if r.get("tags") else None
has_listing = bool(r.get("has_listing"))  # False for NULL (invalid PID) or no UK parent
owner = _classify_owner(tags_list, has_listing)

# In products.append({...}):
"owner": owner,
"shopifyTags": tags_list,   # raw tags for Product Detail Modal transparency
```

`shopifyTags` is the raw list for display in the modal only. Not used for filtering.

---

## 7. Snapshot Compatibility

### How the snapshot stores data

`ScheduledSnapshot.write(payload)` stores the full `_compute_product_performance()` return value
as a single JSONB blob in `public.admin_dm_campaign_products_snapshot` (App DB, via `get_conn()`).
The table schema has only `id=1`, `payload JSONB`, `updated_at`. No migration is needed to add
`owner` — it's additive to the JSONB.

### Stale snapshot handling (before first refresh post-deploy)

Old snapshots in the table will not have `owner` or `shopifyTags` in product dicts.

**Backend:** When reading a snapshot, `r.get("owner")` returns `None` for missing field.
The product dict returned to the API will have `owner: None` (or the key absent if not serialised).
The `_compute_product_performance` Python loop only adds `owner` to freshly-computed products,
not to snapshot reads — so stale snapshots will serve products without `owner`.

**Frontend fix:** `r.owner ?? 'Unresolved'` as the default for missing/null owner.
Using `'Unresolved'` not `'No Tag'` — we genuinely don't know the owner of stale-snapshot products,
so `Unresolved` is the more honest fallback.

### Maximum stale window

After deploy: up to 6 hours until the next automatic snapshot refresh.
Manual Refresh button triggers `product_snapshot.run_sync()` immediately — stale window = seconds.

### No schema migration

The snapshot table's `payload JSONB` column absorbs the new `owner`/`shopifyTags` fields without
any DDL changes. The `_ensure_table()` check in `ScheduledSnapshot` will find the table already
exists and make no changes.

---

## 8. API Response Shape

`GET /api/admin/dm-campaign/products` already returns the full `products` array.
After the change, each product object will include two new fields:

```json
{
  "productItemId": "shopify_gb_7891234567_42987654321",
  "owner": "Sonya",
  "shopifyTags": ["Dracarys", " AGU2026"],
  ...existing fields unchanged...
}
```

For stale snapshots (pre-deploy), `owner` and `shopifyTags` will be absent.
The frontend handles this with `r.owner ?? 'Unresolved'`.

No new endpoint needed. No API versioning needed — additive change.

---

## 9. Frontend Changes (`DmCampaign.jsx`)

### 9a. State variables to add (in `ProductsView`, after `campaign` state)

```jsx
const [owner, setOwner] = useState('all')
```

### 9b. `filtered` useMemo — add owner filter condition

Insert after the `campaign` filter block (line ~374):
```jsx
if (owner !== 'all') out = out.filter((r) => (r.owner ?? 'Unresolved') === owner)
```
Add `owner` to the dependency array.

### 9c. Owner dropdown — insert after Campaign dropdown in `jreq-tbar`

```jsx
<label>
  Owner{' '}
  <select value={owner} onChange={(e) => { setOwner(e.target.value); setPage(1) }}>
    <option value="all">All Owners</option>
    <option value="Sonya">Sonya</option>
    <option value="Sajeepan">Sajeepan</option>
    <option value="No Tag">No Tag</option>
    <option value="Conflict">Conflict</option>
    <option value="Unresolved">Unresolved</option>
  </select>
</label>
```

### 9d. Table header — add Owner column after Campaign

```jsx
<th>Owner</th>
```

### 9e. Table row — add Owner cell after campaign cell

```jsx
<td>{r.owner ?? 'Unresolved'}</td>
```

### 9f. `onApply()` reset — add `setOwner('all')`

In the `onApply(start, end)` function (line ~340), add:
```jsx
setOwner('all')
```
Same pattern as `setCampaign('all')`.

### 9g. CSV export — add Owner column

Header: insert `'Owner'` after `'Campaign'` in `hdr`.
Row values: insert `r.owner ?? 'Unresolved'` in the corresponding position in `vals`.

### 9h. `ProductDetailModal` — add Owner and raw tags rows

```jsx
<tr><td>Owner</td><td className="num">{product.owner ?? 'Unresolved'}</td></tr>
<tr><td>Shopify Tags</td><td className="num">
  {product.shopifyTags?.length
    ? product.shopifyTags.map(t => t.trim()).join(', ')
    : '—'}
</td></tr>
```
Insert after the Campaign row.

### 9i. `colSpan` update

Two `colSpan` values in `ProductsView` currently read `8` (loading row and empty row).
After adding the Owner column, both must become `9`.

---

## 10. KPI Cards and flagCounts — No Change Required

The five existing KPI cards (`totalProducts`, `zeroimp`, `zeroclick`, `zeroconv`, `healthy`)
read from `data.totalProducts` and `data.flagCounts`. These are computed from the `products`
list length and the `flag` field — neither is affected by the owner feature. No changes needed.

---

## 11. Performance and Dependency Risks

| Risk | Severity | Mitigation |
|---|---|---|
| New CTEs add 3 joins to an already expensive query (~10s all-time) | MEDIUM | `owner_parent` joins `shopify_listings` on indexed `item_id`; `owner_tags` joins `shopify_listing_tag` on indexed `product_id`. Both use sub_source=104 filter. Expected overhead: ~1-3s on all-time run. The snapshot means this overhead is paid once per 6h, not on every page load. |
| `BUSINESS_DATABASE_URL` connection cap is 10 (hard server limit); max_size=4 in pool | LOW | The new join runs within the existing connection checkout; it does not open additional connections. |
| `shopify_listing_tag` freshness vs `collection_tag_mapping_products` freshness | LOW | Both sync from Shopify. `shopify_listing_tag` is updated by the listing sync schedule; `collection_tag_mapping_products` is updated daily at 2:15 AM. Both have similar lag. |
| `Sonya`, `Sonya_N_C`, `Sonya Old` are pending and not included | LOW | Confirmed in code via comment; products with only these tags will show `No Tag` until approved. Document count: ~1,511 products affected. |
| Stale snapshot after deploy shows `Unresolved` for all products | LOW | Resolves within 6h automatically; manual Refresh resolves immediately. |
| `has_listing` field absent from stale snapshots | LOW | Python `bool(r.get("has_listing"))` returns `False` for absent key — same as `Unresolved`. Correct behavior. |

---

## 12. Test Matrix

### New test file: `backend/tests/test_dm_campaign.py`

**Pattern:** Use existing test files (`test_conduit_sold.py`, etc.) as reference for pytest setup.
No DB connection needed for pure unit tests of `_classify_owner()`.

#### Group A: Approved Sonya tags

| Test | Input tags | has_listing | Expected |
|---|---|---|---|
| A1 | `['AGU']` | True | `Sonya` |
| A2 | `['Agu46-2']` | True | `Sonya` |
| A3 | `[' Agu46-2']` (leading space) | True | `Sonya` |
| A4 | `['Agu 46-2']` (internal space) | True | `Sonya` |
| A5 | `['AGU2026']` | True | `Sonya` |
| A6 | `['Dracarys']` | True | `Sonya` |
| A7 | `[' Dracarys']` (leading space) | True | `Sonya` |
| A8 | `['Dracarys Vermax']` | True | `Sonya` |
| A9 | `['SonyaM&A']` | True | `Sonya` |
| A10 | `['agu']` (already lowercase) | True | `Sonya` |

#### Group B: Approved Sajeepan tags

| Test | Input tags | has_listing | Expected |
|---|---|---|---|
| B1 | `['SJ']` | True | `Sajeepan` |
| B2 | `[' SJ']` (leading space) | True | `Sajeepan` |
| B3 | `['SJRAT']` | True | `Sajeepan` |
| B4 | `['SJ_C']` | True | `Sajeepan` |
| B5 | `['SJK']` | True | `Sajeepan` |
| B6 | `['SJ_T_ADS']` | True | `Sajeepan` |
| B7 | `['OLD SJ NA']` | True | `Sajeepan` |
| B8 | `['Sajeepan']` | True | `Sajeepan` |
| B9 | `['Sajjepan']` | True | `Sajeepan` |

#### Group C: Pending tags (must NOT classify as Sonya)

| Test | Input tags | has_listing | Expected |
|---|---|---|---|
| C1 | `['Sonya']` | True | `No Tag` |
| C2 | `['Sonya_N_C']` | True | `No Tag` |
| C3 | `['Sonya Old']` | True | `No Tag` |

#### Group D: Conflict cases

| Test | Input tags | has_listing | Expected |
|---|---|---|---|
| D1 | `['AGU', 'SJ']` | True | `Conflict` |
| D2 | `['Dracarys', 'SJRAT']` | True | `Conflict` |
| D3 | `['AGU2026', 'Sajeepan']` | True | `Conflict` |

#### Group E: Unresolved and No Tag cases

| Test | Input tags | has_listing | Expected |
|---|---|---|---|
| E1 | `None` | False | `Unresolved` |
| E2 | `[]` | False | `Unresolved` |
| E3 | `['anything']` | False | `Unresolved` |
| E4 | `None` | True | `No Tag` (has listing but zero tags) |
| E5 | `[]` | True | `No Tag` |
| E6 | `['Sixnyne Collective']` | True | `No Tag` |
| E7 | `['Thisoban', 'Thiso']` | True | `No Tag` |
| E8 | `['Sonya', 'Sixnyne Collective']` | True | `No Tag` (Sonya is pending — not in SONYA_TAGS) |

#### Group F: False positive protection

| Test | Input tags | has_listing | Expected |
|---|---|---|---|
| F1 | `['AguHP']` | True | `No Tag` (not exact match for 'agu') |
| F2 | `['SJRAT2']` | True | `No Tag` (not in SAJEEPAN_TAGS) |
| F3 | `['Dracarys2']` | True | `No Tag` |
| F4 | `['old sj naXtra']` | True | `No Tag` |

#### Group G: Case and whitespace variations

| Test | Input tags | has_listing | Expected |
|---|---|---|---|
| G1 | `['  AGU  ']` (both ends) | True | `Sonya` |
| G2 | `['agu2026']` (all lower) | True | `Sonya` |
| G3 | `['DRACARYS']` (all caps) | True | `Sonya` |
| G4 | `['  sj  ']` | True | `Sajeepan` |

#### Group H: Regression — unchanged columns

Verify these fields appear unchanged in API response after adding owner:
impressions, clicks, cost, conversions, conversionValue, roas, unitsSold, realRevenue, salesGap, flag, campaignName

#### Group I: CSV and filter regression

| Check |
|---|
| CSV header includes `Owner` column after `Campaign` |
| Owner filter `Sonya` returns only Sonya-classified rows |
| Owner filter `all` returns all rows (same count as before) |
| Campaign + Owner filters combine correctly |
| Flag + Owner filters combine correctly |
| Search + Owner filter combines correctly |
| Page resets to 1 when owner filter changes |
| `colSpan=9` on loading/empty rows (not 8) |

### Safe test command

```bash
cd backend && python -m pytest tests/test_dm_campaign.py -v
```

No DB required for Groups A–G. Groups H–I require a running backend or mock data.

---

## 13. Proposed Implementation Sequence

### Stage 1 — Backend (no frontend touch)
1. Add `SONYA_TAGS`, `SAJEEPAN_TAGS` constants and pending-tags comment
2. Add `_classify_owner(tags, has_listing)` function
3. Add `product_pids`, `owner_parent`, `owner_tags` CTEs to `PRODUCT_PERF_QUERY`
4. Add `LEFT JOIN owner_tags ot` and `ot.tags, ot.has_listing` to the final SELECT
5. Add `owner`, `shopifyTags` fields to product dict in `_compute_product_performance()`
6. Backend-only test: hit `/api/admin/dm-campaign/products` directly, confirm `owner` field appears

### Stage 2 — Backend unit tests
7. Create `backend/tests/test_dm_campaign.py` with all Groups A–G
8. Run: `python -m pytest tests/test_dm_campaign.py -v` — all must PASS before proceeding

### Stage 3 — Frontend
9. Add `owner` state, filter condition, dropdown, `setOwner('all')` in `onApply`
10. Add Owner column `<th>` and `<td>` to table
11. Update both `colSpan` values from `8` to `9`
12. Add Owner to CSV export
13. Add Owner and Shopify Tags rows to `ProductDetailModal`

### Stage 4 — End-to-end validation
14. Start dev server. Load Products tab. Verify Owner column appears.
15. Filter by Sonya — confirm only Sonya rows shown. Filter by Sajeepan. Filter by Conflict.
16. Verify CSV export has Owner column.
17. Click Details on a product — verify Owner and Shopify Tags rows in modal.
18. Verify stale snapshot fallback: if snapshot lacks `owner`, shows `Unresolved`.
19. Click Refresh — verify owner populates correctly after snapshot refresh.
20. Run full pytest suite. Zero new failures.

---

## 14. Remaining Decisions Requiring Piranav Input

| # | Decision | Current Plan |
|---|---|---|
| P1 | Should `Sonya`, `Sonya_N_C`, `Sonya Old` be added to SONYA_TAGS? These affect ~1,511 products currently classified as `No Tag`. | NOT included until confirmed |
| P2 | Should `Sixnyne Collective` / `Thisoban` / `Thiso` become a third owner class? | NOT included; classified as `No Tag` currently |
| P3 | For the 730 products with BOTH Sonya and SJ tags (`Conflict`): are these data entry errors to be investigated, or acceptable shared products? | Classified as `Conflict` — surfaced for visibility |
| P4 | Should `shopifyTags` (raw tags) be visible in the Product Detail Modal, or should only the classified `owner` be shown? | Plan includes both; can remove raw tags if not wanted |

---

## 15. Files to Modify at Implementation

| File | Change Type | Location |
|---|---|---|
| `backend/app/dashboard_pages/dm_campaign.py` | Add constants, function, 3 SQL CTEs, 2 final-SELECT additions, 2 product-dict entries | Lines 52–56 (constants), after line 276 (function), within `PRODUCT_PERF_QUERY` string, within `_compute_product_performance()` product dict |
| `frontend/src/admin/pages/DmCampaign.jsx` | Add state, filter, dropdown, column header, column cell, colSpan updates, CSV changes, modal rows | `ProductsView` function and `ProductDetailModal` function |
| `backend/tests/test_dm_campaign.py` | NEW file — unit tests for `_classify_owner()` | New file in `backend/tests/` |

No other files need to change. In particular:
- `taskRegistry.jsx` — unchanged (DmCampaign entry already registered)
- `AdminLayout.jsx` — unchanged (nav entry unchanged)
- `backend/app/dev_tasks/collection_tag_mapping/storage.py` — unchanged
- `backend/app/core/scheduled_snapshot.py` — unchanged
- No database migrations — snapshot is JSONB, additive

---

## 16. Confirmation: Application Source Code Unchanged

No application source files were modified during this planning session.
All findings are from read-only inspection of the five files listed in Section 1.
Awaiting Piranav's explicit approval before implementation begins.
