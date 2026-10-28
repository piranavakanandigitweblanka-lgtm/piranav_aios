---
name: dm-campaign-stage1-backend-owner-2026-10-28
description: Stage 1 backend implementation evidence for DM Campaign Owner classification. Constants, _classify_owner(), SQL CTEs, product dict fields, and 63-test suite. All tests PASS. Frontend unchanged.
metadata:
  type: evidence
---

# Evidence: DM Campaign — Stage 1 Backend Owner Classification

**Date:** 2026-10-28
**Branch / HEAD:** `main` / `8427e22` (pre-change baseline confirmed)
**Implementor:** Claude Code (piranav AIOS)
**Scope:** Backend only — `dm_campaign.py` and new test file. No frontend changes.

---

## 1. Preflight Confirmed

| Check | Result |
|---|---|
| Branch | `main` |
| HEAD before changes | `8427e22` — matched expected baseline |
| Working tree before changes | Clean |
| `db.py` cross-DB constraint re-verified | PASS — `get_business_conn()` = BUSINESS_DATABASE_URL (has `listings.*`); `get_conn()` = App DB (has `sales_cache`) |
| `listings.shopify_listing_tag` schema verified live | PASS — 6 columns confirmed |
| Join chain verified with live sample data | PASS — 4 products, tags array returned correctly |

---

## 2. Schema and Join Chain Verified (live DB, 2026-10-28)

**`listings.shopify_listing_tag` columns:**
`id` (integer), `product_id` (integer), `tag` (varchar), `product_type` (varchar),
`sub_source` (integer), `is_deleted` (smallint)

**Join chain (confirmed):**
```
product_item_id = 'shopify_gb_<PID>_<VID>'
  → split_part(product_item_id, '_', 3) = PID
  → listings.shopify_listings WHERE item_id = PID AND sub_source=104 AND is_parent=1
  → shopify_listings.id (int)
  → listings.shopify_listing_tag WHERE product_id = shopify_listings.id
      AND sub_source=104 AND (is_deleted=0 OR is_deleted IS NULL)
  → ARRAY_AGG(tag) → Python list
```

**Confirmed tag observations from live sample:**
- Tags stored WITH leading space: ` SJ`, ` Dracarys`, ` Agu46-2`, ` GEMOFF`
- Tags stored WITHOUT leading space: `AGU2026`, `Aji_C`, `12V`
- Mixed within same product (both variants exist for same logical tag)
- `strip().lower()` normalization handles both cases correctly

---

## 3. Files Changed

| File | Change |
|---|---|
| `backend/app/dashboard_pages/dm_campaign.py` | 4 edits: constants, function, SQL CTEs, product dict |
| `backend/tests/test_dm_campaign.py` | NEW — 63 unit tests |

Frontend files: **unchanged**.

---

## 4. Implementation Detail

### 4a. Constants added (after `MODES`, line 59)

```python
SONYA_TAGS = frozenset({
    "agu", "agu46-2", "agu 46-2", "agu2026",
    "dracarys", "dracarys vermax", "sonyam&a",
})
SAJEEPAN_TAGS = frozenset({
    "sj", "sjrat", "sj_c", "sjk", "sj_t_ads", "old sj na",
    "sajeepan", "sajjepan",
})
```

Comment in code identifies pending tags (`sonya`, `sonya_n_c`, `sonya old`) not yet approved.

### 4b. `_classify_owner(tags, has_listing)` added (after constants, before `_flag_for`)

Classification contract:
- `has_listing=False` → `"Unresolved"` (no UK parent listing or invalid product_item_id format)
- `tags` empty/None with `has_listing=True` → `"No Tag"` (listing found, zero active tags)
- Both frozenset families match → `"Conflict"`
- Only Sonya match → `"Sonya"`
- Only Sajeepan match → `"Sajeepan"`
- Neither match → `"No Tag"`

Normalisation: `{t.strip().lower() for t in tags if t}` — strips leading/trailing whitespace,
lowercases, skips None/empty strings. Exact complete-tag matching against frozensets.

### 4c. Three new CTEs in `PRODUCT_PERF_QUERY` (appended after `sales` CTE)

`product_pids` — extracts Shopify product ID via `split_part(product_item_id, '_', 3)`,
  format-guarded by `~* '^shopify_[a-z]+_[0-9]+_[0-9]+$'`, NULL for invalid formats.

`owner_parent` — LEFT JOIN to `listings.shopify_listings` (sub_source=104, is_parent=1),
  with `DISTINCT ON (pp.product_item_id)` to guard against rare duplicate parent rows.
  `has_listing` boolean: True only when shopify_pid IS NOT NULL AND sl.id IS NOT NULL.

`owner_tags` — LEFT JOIN to `listings.shopify_listing_tag` (sub_source=104, is_deleted=0/NULL),
  `ARRAY_AGG(slt.tag) FILTER (WHERE slt.tag IS NOT NULL)` per product_item_id.

Final SELECT additions:
```sql
ot.tags, COALESCE(ot.has_listing, false) AS has_listing
```
New join:
```sql
LEFT JOIN owner_tags ot ON ot.product_item_id = r.product_item_id
```

### 4d. Product dict additions in `_compute_product_performance()`

```python
tags_raw = r.get("tags")
tags_list = list(tags_raw) if tags_raw else None
has_listing = bool(r.get("has_listing") or False)
# ...
"owner": _classify_owner(tags_list, has_listing),
"shopifyTags": tags_list,
```

`r.get("has_listing") or False` handles three cases:
- DB row with `True`/`False` → correct
- Stale snapshot (key absent) → `None or False = False` → `Unresolved` (correct)
- Stale snapshot with `null` JSON → `None or False = False` → `Unresolved` (correct)

---

## 5. Test Results

**Command:** `cd backend && python -m pytest tests/test_dm_campaign.py -v`
**Result:** 63 passed in 5.44s

| Group | Tests | Result |
|---|---|---|
| A — Approved Sonya tags (14 tests) | All tags + leading spaces + with unrelated tags | 14 PASS |
| B — Approved Sajeepan tags (13 tests) | All tags + leading spaces + with unrelated tags | 13 PASS |
| C — Pending tags not approved (5 tests) | Sonya/Sonya_N_C/Sonya Old → No Tag | 5 PASS |
| D — Conflict cases (4 tests) | Both families → Conflict | 4 PASS |
| E — Unresolved and No Tag (9 tests) | None/empty/no listing/Sixnyne/Thisoban | 9 PASS |
| F — False positive protection (6 tests) | AguHP/SJRAT2/Dracarys2/substring variations | 6 PASS |
| G — Case and whitespace normalization (8 tests) | Both-ends spaces, all-caps, mixed-case | 8 PASS |
| H — Frozenset sanity (4 tests) | Counts, no overlap, pending not in SONYA_TAGS | 4 PASS |

---

## 6. Cardinality Safety Verified

- `product_pids`: `SELECT DISTINCT product_item_id` — one row per product_item_id
- `owner_parent`: `DISTINCT ON (pp.product_item_id)` — one row per product_item_id
- `owner_tags`: `GROUP BY op.product_item_id, op.has_listing` — one row per product_item_id
- Final `LEFT JOIN owner_tags ot ON ot.product_item_id = r.product_item_id` — 1:1 join
- **No existing metric rows are inflated or multiplied**

---

## 7. Snapshot Compatibility

Old snapshots (without `owner`/`shopifyTags` keys) will have:
- `r.get("owner")` = `None` → frontend uses `r.owner ?? 'Unresolved'` (Stage 2)
- `r.get("has_listing") or False` = `False` → would compute `Unresolved` if recomputed

Max stale window: 6 hours automatic / seconds via manual Refresh.
No DB migration needed — snapshot is JSONB, additive.

---

## 8. What Remains (Stage 2+)

- Frontend (`DmCampaign.jsx`): owner state, filter dropdown, table column, CSV, modal
- End-to-end dev server test with live snapshot
- AIOS commit when Piranav approves

---

## 9. Confirmation

**Application source files modified:** `backend/app/dashboard_pages/dm_campaign.py` only.
**Frontend files modified:** None.
**Database records modified:** None.
**Credentials/env-vars exposed:** None.
