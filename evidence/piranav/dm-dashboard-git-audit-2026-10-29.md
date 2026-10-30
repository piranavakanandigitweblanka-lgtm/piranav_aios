---
name: dm-dashboard-git-audit-2026-10-29
description: Read-only audit of DM Dashboard git state, project stage, and DM Campaign Owner + Stock Status feature verification. 2026-10-29. 74 tests PASS, build clean, piranv-work synced, local main 26 commits behind origin/main.
metadata:
  type: evidence
---

# Evidence: DM Dashboard — Full Git Main Sync + Project Stage Audit

**Date:** 2026-10-29
**Requirement ID:** AIOS-2026-10-29-001
**Type:** Read-only audit — no files modified, no commits made

---

## Phase 1 & 2 — Git State

### Before fetch

| Item | Value |
|---|---|
| Current branch | `piranv-work` |
| HEAD | `e9857c0` feat(dm-campaign): stock status column + owner tag UI display |
| Working tree | CLEAN — nothing uncommitted |
| Remote | `origin` → `https://github.com/websitetecteam-arch/dm-dashboard.git` |

### After `git fetch origin`

| Branch | Local | Remote | Status |
|---|---|---|---|
| `piranv-work` | `e9857c0` | `e9857c0` | **IN SYNC** |
| `main` | `8427e22` | `5c5d7ee` | **Local 26 commits BEHIND** |
| `dev-work` | — | `774d3c9` | remote only |

### `origin/main` contains our work

Both `piranv-work` commits are already in `origin/main`:
- `6ed9d52` — owner classification → merged via `f58920f` (Merge branch 'piranv-work' via Dev Tools)
- `e9857c0` — stock status + owner UI → merged via `3c0fd20` (Merge branch 'piranv-work' via Dev Tools)

### Local `main` sync status

Local `main` is at PR #116 (`8427e22`). `origin/main` is at PR #126 (`5c5d7ee`) — 26 commits ahead. This is a clean fast-forward; no divergence. **Not pulled** because current branch is `piranv-work` (switching branches not done automatically per audit rules).

**Safe command to sync local main (Piranav runs manually):**
```
git checkout main && git pull --ff-only origin main
```

---

## Phase 3 — DM Dashboard Project Health

### Test results (verified live)
- Run command: `cd backend && source venv/Scripts/activate && python -m pytest tests/test_dm_campaign.py -q`
- Result: **74 passed, 1 warning** in 5.12s
- Note: must run from `backend/` directory with venv activated — system Python lacks `app` module

### Frontend build (verified live)
- Result: **✓ built in 1.07s** — 502 modules, no errors

### Overall project areas (from AIOS + file inspection)

| Feature area | Status (from AIOS/git) |
|---|---|
| DM Campaign Owner + Stock Status | COMPLETE — merged to origin/main |
| PMPE (PMax Placement Exclusion) | COMPLETE — PRs #117–#126 merged |
| Dev Vault | COMPLETE — PRs #115–#116 merged |
| Conduit Sold + stock alert | COMPLETE — earlier work |
| Promotion Automation | COMPLETE — multi-phase, earlier work |
| RC-02 Repeat Customer | COMPLETE — earlier work |
| SKU Stock Lookup | COMPLETE — 2026-10-27 |
| Entrance jingle (staff login) | COMPLETE — PR #126 |
| CSV export on PMPE | COMPLETE — PR #125 |

---

## Phase 4 — DM Campaign Owner + Stock Status Verification

### Owner classification — VERIFIED FROM SOURCE CODE

**SONYA_TAGS (7):** `agu`, `agu46-2`, `agu 46-2`, `agu2026`, `dracarys`, `dracarys vermax`, `sonyam&a`
**SAJEEPAN_TAGS (8):** `sj`, `sjrat`, `sj_c`, `sjk`, `sj_t_ads`, `old sj na`, `sajeepan`, `sajjepan`
**Match logic:** `t.strip().lower()` then frozenset intersection — exact match, not prefix/substring

**Pending (not in any frozenset):** `sonya`, `sonya_n_c`, `sonya old`, `SJNEW26`

### Stock classification — VERIFIED FROM SOURCE CODE

```python
def _classify_stock(uk_stock, inventory_bool, product_matched):
    if not product_matched:   → "Unknown"
    if not inventory_bool:    → "Unknown"   # False OR None
    if uk_stock is None:      → "Unknown"   # missing UK warehouse row
    if uk_stock <= 0:         → "Out of Stock"
    return                      "In Stock"
```

### Frontend — VERIFIED FROM SOURCE CODE

| Item | Status |
|---|---|
| OwnerBadge component | PRESENT — line 46 |
| StockBadge component | PRESENT — line 58 |
| owner state + filter | PRESENT — line 361 |
| stock state + filter | PRESENT — line 362 |
| colSpan CampaignsView | 9 (9 columns — unchanged) |
| colSpan ProductsView | 10 (9+1 Stock column) |
| Owner ?? 'Unresolved' fallback | PRESENT — line 427 |
| StockStatus ?? 'Unknown' fallback | PRESENT — line 427 |
| CSV: Owner + Stock Status columns | PRESENT — line 453 |
| Modal: Owner + Stock Status + UK Stock rows | PRESENT — lines 310, 314 |

### ENC10233 (`shopify_gb_15388397830530_56874289561986`) — VERIFIED FROM CODE LOGIC

**Reported modal values:** tags=`2026New`, `LMS`, `Pendant Lights`, `SJNEW26` | Owner=`No Tag` | Stock=`Unknown` | UK Stock=`0`

**Owner = No Tag — CORRECT BY DESIGN:**
`t.strip().lower()` of `SJNEW26` = `sjnew26`. Not in SONYA_TAGS, not in SAJEEPAN_TAGS → `No Tag`.
`has_listing=True` (product has a UK listing) → `_classify_owner` reaches the "no matching tag" path → `No Tag`.

**Stock = Unknown — CORRECT BY DESIGN:**
`inventory_bool=False` fires the second guard in `_classify_stock` → `Unknown` immediately.
UK stock `0` shown in modal is from `ukStock` field (raw integer) — displayed directly regardless of classification.
The `Unknown` classification is not a bug; it means "inventory tracking is disabled for this product, so the stock figure is unreliable."

**What the `0` means:** The DB has a UK stock row with `stock=0`. But because `inventory_bool=False`, the system does not trust this as a live tracked value.

---

## Outstanding Decisions (Pending Piranav Approval)

| # | Decision | Impact |
|---|---|---|
| P1 | Add `sonya`, `sonya_n_c`, `sonya old` to SONYA_TAGS? | Changes Owner classification for products with these tags |
| P2 | Add `sjnew26` to SAJEEPAN_TAGS? | ENC10233 and similar products would show `Sajeepan` instead of `No Tag` |
| P3 | Add Sixnyne Collective / Thisoban as a 3rd owner class? | Requires new frozenset + new badge colour + new filter option |
| P4 | Is `inventory_bool=False` on ENC10233 a data error? | If yes, fix at source (inventory system) — not a code fix |

---

## Verification Status Summary

| Item | Status |
|---|---|
| `piranv-work` committed + pushed | VERIFIED (git log) |
| `piranv-work` merged into `origin/main` | VERIFIED (git log graph) |
| Backend 74/74 tests PASS | VERIFIED (live run) |
| Frontend build clean | VERIFIED (live run) |
| SONYA_TAGS/SAJEEPAN_TAGS correct | VERIFIED (source code) |
| `_classify_stock` logic correct | VERIFIED (source code) |
| Frontend filters/columns/CSV/modal | VERIFIED (source code) |
| Old-snapshot fallbacks (`?? 'Unknown'`) | VERIFIED (source code) |
| ENC10233 behaviour correct by design | VERIFIED (code trace) |
| Live browser verification | NOT YET DONE |
| Local `main` synced to `origin/main` | NOT DONE (need `git checkout main && git pull --ff-only`) |

---

## 2026-10-30 — Pre-Sajeepan-Fixes Sync

**Date:** 2026-10-30  
**Requirement ID:** AIOS-2026-10-30-SAJEEPAN-GIT-SYNC  
**Type:** Git synchronization — ff-only, no code changes

### State at start of session

| Item | Value |
|---|---|
| Current branch | `piranv-work` |
| HEAD before sync | `2ec4e79` feat(thivajini): Req 6 — FR Price Issue Correction |
| Working tree | CLEAN |
| `origin/main` | `ca09880` Merge pull request #149 |
| `piranv-work` behind `origin/main` | 11 commits |
| Local `main` behind `origin/main` | 12 commits |
| piranv-work unique commits | 0 — pure fast-forward available |

### Operations performed

| Step | Command | Result |
|---|---|---|
| 1 | `git fetch origin` | All remote refs updated |
| 2 | `git switch main` | Switched cleanly |
| 3 | `git merge --ff-only origin/main` | `33df193..ca09880` — 12 commits, 16 files |
| 4 | Verify `main` HEAD | `ca09880` = `origin/main` ✓ |
| 5 | `git switch piranv-work` | Switched cleanly |
| 6 | `git merge --ff-only origin/main` | `2ec4e79..ca09880` — 11 commits, 12 files |
| 7 | Verify `piranv-work` HEAD | `ca09880` = `origin/main` ✓ |

### State after sync

| Item | Value |
|---|---|
| Current branch | `piranv-work` |
| HEAD | `ca09880` — matches `origin/main` |
| Local `main` | `ca09880` — matches `origin/main` |
| `origin/piranv-work` | `2ec4e79` — **piranv-work is now 11 ahead** (needs push to update remote tracking) |
| Working tree | CLEAN — nothing uncommitted |
| Conflicts | NONE |

> Note: `origin/piranv-work` still points to `2ec4e79`. Local piranv-work now shows "ahead 11" because it was ff-forwarded from main, not from its own remote. This is expected — a `git push origin piranv-work` will update the remote when next instructed.
