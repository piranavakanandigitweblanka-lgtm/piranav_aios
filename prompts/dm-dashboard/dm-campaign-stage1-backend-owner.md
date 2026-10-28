---
name: dm-campaign-stage1-backend-owner
description: Stage 1 backend implementation prompt for DM Campaign Owner classification column. Adds SONYA_TAGS/SAJEEPAN_TAGS constants, _classify_owner() function, 3 SQL CTEs, product dict fields, and 63-test suite. Backend only — no frontend changes.
metadata:
  type: prompt
  category: dm-dashboard
---

# Prompt: DM Campaign Products — Stage 1 Backend Owner Classification

## Context

DM Dashboard (`dm-dashboard/`) — React 19 + Vite frontend, Python/FastAPI backend, PostgreSQL.

**Two separate DB instances:**
- `get_conn()` → App DB (`DATABASE_URL`) — sales_cache, snapshot tables
- `get_business_conn()` → Business DB (`BUSINESS_DATABASE_URL`) — google_ads, listings, order_management

`PRODUCT_PERF_QUERY` runs via `get_business_conn()`. Tags source must be on **Business DB**.

**Correct tags source:** `listings.shopify_listing_tag` — same DB, 99.96% coverage.
**Do NOT use `sales_cache.collection_tag_mapping_products`** — wrong DB instance.

**Tag join chain:**
```
product_item_id = 'shopify_gb_<PID>_<VID>'
→ split_part(product_item_id, '_', 3) = PID
→ listings.shopify_listings WHERE item_id = PID AND sub_source=104 AND is_parent=1
→ shopify_listings.id
→ listings.shopify_listing_tag WHERE product_id = sl.id AND sub_source=104
    AND (is_deleted=0 OR is_deleted IS NULL)
→ ARRAY_AGG(tag)
```

**Data quality:** Many tags have leading spaces (` SJ`, ` Dracarys`, ` Agu46-2`).
Must use `t.strip().lower()` — not just `t.lower()`.

---

## Task

Implement Stage 1 (backend only) of the Owner classification feature in:
`backend/app/dashboard_pages/dm_campaign.py`

No frontend changes. No commit/push.

---

## Tag Dictionary (Approved)

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

**Pending (NOT in SONYA_TAGS until Piranav explicitly approves):** `sonya`, `sonya_n_c`, `sonya old`

---

## Classification Contract

| Condition | Output |
|---|---|
| `has_listing=False` | `"Unresolved"` — tags ignored |
| `has_listing=True`, no tags | `"No Tag"` |
| Both families match | `"Conflict"` |
| Only Sonya match | `"Sonya"` |
| Only Sajeepan match | `"Sajeepan"` |
| Neither match | `"No Tag"` |

**Unresolved** = no UK parent listing OR invalid `product_item_id` format.
**No Tag** = listing found but zero approved owner tags.
Do NOT conflate empty retrieved tag array with missing tag record.

---

## Implementation Steps

### 1. Constants (after `MODES`)
Add `SONYA_TAGS` and `SAJEEPAN_TAGS` frozensets with comment noting pending tags.

### 2. `_classify_owner(tags, has_listing)` function (before `_flag_for()`)
- Normalise: `{t.strip().lower() for t in tags if t}`
- Exact frozenset intersection — no substring matching
- Follow classification contract above

### 3. SQL CTEs (append after `sales` CTE in `PRODUCT_PERF_QUERY`)

```sql
product_pids AS (
  SELECT DISTINCT product_item_id,
    CASE WHEN product_item_id ~* '^shopify_[a-z]+_[0-9]+_[0-9]+$'
         THEN split_part(product_item_id, '_', 3)
         ELSE NULL END AS shopify_pid
  FROM perf
),
owner_parent AS (
  SELECT DISTINCT ON (pp.product_item_id) pp.product_item_id,
    sl.id AS sl_id,
    (pp.shopify_pid IS NOT NULL AND sl.id IS NOT NULL) AS has_listing
  FROM product_pids pp
  LEFT JOIN listings.shopify_listings sl
    ON sl.item_id = pp.shopify_pid AND sl.sub_source = 104 AND sl.is_parent = 1
  ORDER BY pp.product_item_id, sl.id
),
owner_tags AS (
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

Final SELECT: add `ot.tags, COALESCE(ot.has_listing, false) AS has_listing`
Final JOIN: add `LEFT JOIN owner_tags ot ON ot.product_item_id = r.product_item_id`

### 4. Product dict in `_compute_product_performance()`
```python
tags_raw = r.get("tags")
tags_list = list(tags_raw) if tags_raw else None
has_listing = bool(r.get("has_listing") or False)
# add to products dict:
"owner": _classify_owner(tags_list, has_listing),
"shopifyTags": tags_list,
```

---

## Tests Required

File: `backend/tests/test_dm_campaign.py`

Cover: all 7 approved Sonya tags + leading spaces, all 8 approved Sajeepan tags + leading spaces,
pending tags → No Tag, Conflict, Unresolved, No Tag, false positives (exact matching),
whitespace/case normalization, frozenset sanity (counts, no overlap, pending not in SONYA_TAGS).

Run: `cd backend && python -m pytest tests/test_dm_campaign.py -v`
Report actual result. Do not claim pass without running.

---

## Constraints

- Do NOT include `sonya`, `sonya_n_c`, `sonya old` in SONYA_TAGS
- Do NOT change the approved tag dictionary without explicit Piranav approval
- Do NOT make frontend changes
- Do NOT commit or push
- Do NOT change DB schema or records
- Verify cardinality: no existing metric rows must be inflated by new JOINs
