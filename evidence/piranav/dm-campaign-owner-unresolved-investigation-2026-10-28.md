---
name: dm-campaign-owner-unresolved-investigation-2026-10-28
description: Read-only investigation of all-Unresolved owner values after Stage 1+2 deployment. Root cause confirmed: stale snapshot. No code defect found. Fix is Refresh button or custom date range.
metadata:
  type: evidence
---

# Evidence: DM Campaign Owner — All Unresolved Investigation

**Date:** 2026-10-28
**Type:** Read-only investigation — no files modified
**Symptom:** DM Campaign Products tab shows `Unresolved` for every visible product row across two campaigns after Stage 1+2 deployment.

---

## Root Cause

**Stale snapshot in `public.admin_dm_campaign_products_snapshot` (App DB).**

The `/api/admin/dm-campaign/products?mode=all` endpoint path:

```python
# dm_campaign.py line 468–470
payload, updated_at = product_snapshot.read()   # reads from App DB JSONB
if payload is not None:
    return {**payload, ...}                      # returns blob directly — no recompute
```

`ScheduledSnapshot.read()` (`scheduled_snapshot.py:155`) executes:
```sql
SELECT payload, updated_at FROM public.admin_dm_campaign_products_snapshot WHERE id = 1
```

That JSONB blob was written by the **pre-Stage-1 version** of `_compute_product_performance`. At that time, the product dict had no `"owner"` key. The snapshot has not been recomputed since the new code was deployed.

Every product object returned to the frontend is missing the `owner` key. JavaScript evaluates:
```js
r.owner ?? 'Unresolved'   // undefined ?? 'Unresolved' = 'Unresolved'
```
→ **100% of products show Unresolved.**

This is the designed stale-snapshot fallback working correctly — it is not a bug in the classification code.

---

## Evidence Trail

| Step | Finding |
|---|---|
| `dm_campaign.py:468` — `payload, updated_at = product_snapshot.read()` | Snapshot is served without recompute when `mode=all` and snapshot exists |
| `scheduled_snapshot.py:155–160` — `read()` | Returns raw JSONB blob, no transformation |
| `dm_campaign.py:382–384` — `tags_raw = r.get("tags")` etc. | Only reached when `_compute_product_performance` runs live (not from snapshot) |
| `dm_campaign.py:410` — `"owner": _classify_owner(tags_list, has_listing)` | Only reached when `_compute_product_performance` runs live |
| Frontend `OwnerBadge`: `owner ?? 'Unresolved'` | Correct safety fallback for stale snapshot — no frontend bug |

---

## Ruled Out

| Candidate | Verdict | Reason |
|---|---|---|
| SQL regex `'^shopify_[a-z]+_[0-9]+_[0-9]+$'` | Not the cause | Standard `shopify_gb_<pid>_<vid>` format confirmed in live discovery; 4 segments, regex matches |
| `sub_source = 104` join mismatch | Not the cause | Confirmed in Stage 5 live discovery — 4 sample products returned correct tag arrays |
| `t.strip().lower()` normalisation | Not the cause | 63/63 unit tests PASS |
| `has_listing` boolean | Not the cause | `COALESCE(ot.has_listing, false)` + `bool(r.get("has_listing") or False)` both correct |
| Frontend `??` fallback | Working as designed | `undefined ?? 'Unresolved'` is the intended stale-snapshot guard |
| Code regression from commit | Not the cause | All 3 classification constants, CTEs, and product dict fields confirmed present in committed code |

---

## Fix (No Code Change Required)

**Option A (instant workaround):** Set any custom date range on the Products tab. This forces `source: "live-filtered"` which bypasses the snapshot entirely and runs the new SQL with owner CTEs live. Owners will resolve correctly.

**Option B (permanent fix):** Click **Refresh** button on the Products tab. Calls `POST /api/admin/dm-campaign/products/sync/run-now`, which recomputes the snapshot with the new code. Normal page loads will show correct owners once complete (~35s).

**Option C (automatic):** Wait up to 6 hours for the scheduled background refresh to run.

---

## Tests to Confirm Fix

1. After Refresh completes, reload Products tab — some products must show `Sonya`, `Sajeepan`, `No Tag`, or `Conflict` (not all Unresolved).
2. Set custom date range before refreshing — if owners resolve correctly, confirms no SQL/code defect; only snapshot freshness was the issue.
3. Check `syncedAt` timestamp in the response — must be after the deployment time to confirm the snapshot is fresh.

---

## Snapshot Interval

`ScheduledSnapshot` interval: **6 hours** (hardcoded at `dm_campaign.py:452`).
The snapshot will auto-refresh within 6 hours of server restart with new code. Clicking Refresh forces it immediately.
