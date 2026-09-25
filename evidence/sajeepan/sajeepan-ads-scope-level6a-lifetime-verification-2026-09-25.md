# Level 6A — Lifetime Product Scope Verification [2026-09-25]

## Executive Summary

The Level 5 Admin Ads Product Scope page used a **30-day product population** — products
that happened to appear in Sajeepan's campaigns in the last 30 days. The business
requirement is **lifetime product membership**: all products ever associated with
Sajeepan's campaigns, regardless of when they last appeared.

This investigation verified campaign ownership, built the lifetime population, identified
cross-format duplicates, reconciled classification, and corrected the implementation.

**Code changed:** YES — admin_ads_product_scope.py, AdsProductScope.jsx
**Database changed:** NO
**Existing Sajeepan dashboard changed:** NO
**Deployment performed:** NO
**Git commit created:** NO

---

## 1. Campaign Ownership Verification

Source: `google_ads.campaigns` — `group_name` column + `campaign_name` column.

| Campaign ID | Campaign Name | group_name | Status |
|---|---|---|---|
| 21069663519 | Pmax \| Sajeepan \| Klarna CSS \| SJ_PENDANT_KLARNA \| Zero Conv \| MCV \| UK | SAJEEPAN | ENABLED / ELIGIBLE |
| 23110323532 | Pmax \| Sajeepan \| SHOPTIMISED CSS \| SJGB \| HIGH REVENUE PH \| MCV \| UK | SAJEEPAN | ENABLED / ELIGIBLE |
| 23516313256 | Pmax \| Sajeepan \| Klarna CSS \| SJ_TOP_20 \| TOP 20% PH \| MCV \| UK | SAJEEPAN | ENABLED / ELIGIBLE |
| 23590572906 | Pmax \| Sajeepan \| Shoptimised CSS \| SJGB \| zero conv2 \| MCV \| UK | SAJEEPAN | ENABLED / ELIGIBLE |
| 22079334413 | Pmax \| Sajeepan \| G CSS SJALL \| SJALL \| HERO \| MCV \| UK | SAJEEPAN | ENABLED / ELIGIBLE |
| 21242723265 | Pmax \| Sajeepan \| Klarna CSS \| ALLACRSJ2 \| Accessories \| MCV \| UK | SAJEEPAN | ENABLED / ELIGIBLE |
| 24092456136 | Pmax \| Sajeepan \| Klarna CSS \| SJ_Lighting_PH_KLARNA \| xml \| MCV \| UK | SAJEEPAN | ENABLED / ELIGIBLE |

**Result: 7/7 campaigns confirmed SAJEEPAN. No ambiguity.**

All campaigns also confirmed by campaign_name containing "Sajeepan". The SJ_CAMPAIGN_IDS
import in sajeepan.py is the authoritative source and matches the DB.

---

## 2. Lifetime Product ID Population

Source: `google_ads.product_performance`
Filter: `campaign_id = ANY(SJ_CAMPAIGN_IDS) AND product_item_id <> ''`
Date range: 2024-09-01 → 2026-09-24 (684 distinct days)

| Metric | Value |
|---|---|
| Lifetime distinct product_item_ids (raw) | **19,350** |
| First observed date | 2024-09-01 |
| Last observed date | 2026-09-24 |
| Distinct days with data | 684 |

### Format breakdown (raw)

| Format | Count |
|---|---|
| shopify_prefixed (shopify_GB_*) | 14,921 |
| pure_numeric (bare variant IDs) | 4,422 |
| other format | 7 |
| **Total** | **19,350** |

### Deduplication

Some variants appear in BOTH formats (e.g., `shopify_GB_123_456` AND `456`). After
normalizing via the Jefri pattern and deduplicating:

- **Distinct normalized shopify_ids: 17,137**
- Cross-format duplicates removed: 2,213

The 2,213 are NOT separate products — they are the same Shopify variants represented
in two different Google Ads feed formats. Deduplication eliminates double-counting.

**30-day comparison (current page before fix):**
- Raw 30d product_item_ids: 2,126 (as shown on page — NOT deduped)
- Distinct normalized 30d shopify_ids: 2,005 (correct deduped count)
- The page was over-counting by ~121 due to cross-format duplicates

---

## 3. Shopify Matching (Lifetime)

Matched against `listings.shopify_listings` WHERE `site = 'UK'`:

| Metric | Count |
|---|---|
| Distinct normalized product IDs | 17,137 |
| Matched to Shopify UK | **14,047** |
| Unmatched (not in any site) | **3,090** |
| Match rate | **82.0%** |

### Format-level breakdown

| Format | Total | Matched | Unmatched |
|---|---|---|---|
| shopify_prefixed | 14,921 | 12,849 | 2,072 |
| pure_numeric | 4,422 | 3,330 | 1,092 |
| other | 7 | 0 | 7 |

### Why 3,090 are unmatched

The 3,090 unmatched products have NO entry in `shopify_listings` for ANY site (confirmed
via cross-site check). These are products that were in the Google Ads feed in
2024-2026 but have since been **removed from the Shopify catalogue** (discontinued,
archived, deleted). They are valid historical Ads products — kept in scope as
UNMATCHED to preserve data completeness.

---

## 4. Final Lifetime Classification

All 17,137 distinct normalized product IDs classified using the approved business rules.
Math reconciliation: 7,566 + 4,814 + 3,083 + 1,577 + 85 + 7 + 5 = **17,137** ✓

| Group | Count | Description |
|---|---|---|
| **GROUP_A** | **4,814** | Non-sale + active + in-stock (eligible) |
| **GROUP_B** | **1,577** | Non-sale + active + OOS |
| **ON_SALE** | **7,566** | compare_price > 0 |
| **SALE_SIGNAL_CONFLICT** | **5** | compare_price=0 but merchant sale_price>0 |
| **NON_SALE_INACTIVE** | **85** | Non-sale + inactive status |
| **UNMATCHED** | **3,083** | Removed from Shopify catalogue |
| **UNRESOLVED** | **7** | Other format — cannot normalize |
| **TOTAL** | **17,137** | |

Note: Queried counts vs. implemented counts may vary slightly (~7 UNMATCHED vs 3,083/3,090)
due to the dedup order preference (shopify_prefixed preferred over pure_numeric in the
DISTINCT ON ordering). This is correct — dedup removes double-representations.

### Compare to Level 5 (30-day, pre-fix)

| Metric | Level 5 (30d raw) | Level 6A (lifetime deduped) |
|---|---|---|
| Total products | 2,126 | 17,137 |
| Group A | 701 | 4,814 |
| Group B | 16 | 1,577 |
| On Sale | 1,408 | 7,566 |
| Signal Conflict | 1 | 5 |
| Unmatched | 0 | 3,083 |

The large Group B increase (16 → 1,577) is because many products are OOS in the
current catalogue but were actively advertised in the past 2 years. These are valid
historical scope members.

---

## 5. Architecture Change (Level 6A)

### Before (Level 5)

```
SCOPE_QUERY:
  products IN (30-day window) → classify → metrics from same 30-day window
  
Snapshot: stores 30d classified + 30d metrics
Endpoint: reads snapshot for 30d, live query for other windows (both timed out)
```

### After (Level 6A)

```
LIFETIME_SCOPE_QUERY:
  products IN (all history, no date cap) → dedup → classify → NO metrics
  
METRICS_QUERY:
  aggregate spend/clicks/etc for selected window only (fast)

Snapshot: stores lifetime classification only
Endpoint:
  1. Read snapshot (instant) or compute lifetime live (one-time on first request)
  2. Run METRICS_QUERY for selected window (fast, always fresh)
  3. Merge + sort by spend
```

### Performance gains

1. **No LATERAL** (was N+1 sub-query per product) → CTE pre-aggregation (1 scan)
2. **No ::text cast on sl.item_id** → index can be used
3. **Python-computed cutoff date** (no string concat interval)
4. **Metrics query is tiny** (date-filtered aggregation, ~2k rows in 30d window)
5. **Snapshot absorbs the expensive lifetime scan** (runs hourly in background)

---

## 6. Files Changed

| File | Change |
|---|---|
| `dm-dashboard/backend/app/admin_ads_product_scope.py` | Full rewrite — LATERAL removed, lifetime scope, split queries |
| `dm-dashboard/frontend/src/admin/pages/AdsProductScope.jsx` | Label update — "Lifetime Product Scope" + "Performance Window: Last N days" |

### Files NOT changed

- `dm-dashboard/backend/app/sajeepan.py` — UNCHANGED
- `dm-dashboard/backend/app/main.py` — UNCHANGED
- `dm-dashboard/frontend/src/admin/AdminLayout.jsx` — UNCHANGED
- `dm-dashboard/backend/app/db.py` — UNCHANGED
- All other staff modules — UNCHANGED

---

## 7. Superseded Conclusions

The following Level 5 conclusions are superseded:

| Previous (Level 5) | Corrected (Level 6A) |
|---|---|
| Total products ≈ 2,126 | Total products = 17,137 (lifetime) |
| Group A ≈ 701 | Group A = 4,814 |
| Group B ≈ 16 | Group B = 1,577 |
| All products matched | 3,083 UNMATCHED (removed from Shopify) |
| 30d window = product scope | Lifetime = product scope; window = metrics only |

Level 5 implementation evidence is PRESERVED and NOT deleted.
Level 5 AIOS files remain as historical record.
