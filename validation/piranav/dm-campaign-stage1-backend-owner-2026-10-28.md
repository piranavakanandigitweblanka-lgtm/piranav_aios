---
name: dm-campaign-stage1-backend-owner-2026-10-28
description: Validation record for Stage 1 backend Owner classification. 63 unit tests PASS. Schema verified live. Frontend unchanged. No commit/push.
metadata:
  type: validation
---

# Validation: DM Campaign — Stage 1 Backend Owner Classification

**Date:** 2026-10-28
**Requirement ID:** AIOS-2026-10-28-007

---

## Checklist

| Check | Result |
|---|---|
| `dm_campaign.py` — SONYA_TAGS frozenset has 7 entries | PASS |
| `dm_campaign.py` — SAJEEPAN_TAGS frozenset has 8 entries | PASS |
| No overlap between SONYA_TAGS and SAJEEPAN_TAGS | PASS |
| Pending tags (sonya, sonya_n_c, sonya old) NOT in SONYA_TAGS | PASS |
| `_classify_owner()` function defined | PASS |
| `t.strip().lower()` normalization applied (not just `.lower()`) | PASS |
| `has_listing=False` always → Unresolved (tags ignored) | PASS |
| Null/empty tags with `has_listing=True` → No Tag | PASS |
| Both families match → Conflict | PASS |
| SQL CTE `product_pids` uses regex format guard | PASS |
| SQL CTE `owner_parent` uses `DISTINCT ON` to prevent row multiplication | PASS |
| SQL CTE `owner_tags` uses LEFT JOIN (preserves unresolved products) | PASS |
| `COALESCE(ot.has_listing, false)` in final SELECT | PASS |
| `LEFT JOIN owner_tags ot` in final SELECT | PASS |
| Product dict includes `owner` key | PASS |
| Product dict includes `shopifyTags` key | PASS |
| `has_listing = bool(r.get("has_listing") or False)` — handles missing key from stale snapshot | PASS |
| Frontend `DmCampaign.jsx` unchanged | PASS |
| No commit/push executed | PASS |

---

## Test Results

**File:** `backend/tests/test_dm_campaign.py`
**Command:** `cd backend && python -m pytest tests/test_dm_campaign.py -v`
**Result:** **63 PASSED, 0 FAILED, 0 ERRORS in 5.44s**

Groups covered: A (Sonya tags), B (Sajeepan tags), C (pending not approved), D (conflict),
E (unresolved/no tag), F (false positive protection), G (normalization), H (frozenset sanity)

---

## Schema Verification

`listings.shopify_listing_tag` — verified live 2026-10-28:
- Columns confirmed: `id`, `product_id`, `tag`, `product_type`, `sub_source`, `is_deleted`
- Tag leading-space behaviour confirmed: mixed — some with space, some without
- 4 sample products returned correct tag arrays

---

## Pass/Fail

**PASS** — All tests pass, schema verified, no frontend changes, no unintended side effects observed.
