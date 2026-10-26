# Validation — Conduit Sold Page Investigation

**Date:** 2026-10-26
**Task:** Read-only code inspection of existing Conduit Sold page
**Method:** Static code analysis only. No runtime. No production access.

---

## Checklist

| # | Check | Result | Detail |
|---|---|---|---|
| 1 | Backend file located | PASS | `backend/app/dashboard_pages/conduit_sold.py` (478 lines) |
| 2 | Frontend file located | PASS | `frontend/src/admin/pages/ConduitSold.jsx` (777 lines) |
| 3 | Navigation wiring confirmed | PASS | `AdminLayout.jsx` line 151, section "Sales & Performance" |
| 4 | taskRegistry entry confirmed | PASS | `taskRegistry.jsx` line 355, `tools.AdminConduitSold` |
| 5 | Router registration confirmed | PASS | `main.py` line 347 (`admin_conduit_sold_router`) |
| 6 | Startup snapshot call confirmed | PASS | `main.py` line 490 (`start_conduit_sold_snapshots()`) |
| 7 | Date range is hardcoded | CONFIRMED | `PHASE1_START = date(2026,4,1)`, `PHASE1_END = date(2026,9,30)`, `MONTHS` list hardcoded |
| 8 | Month labels from API (not hardcoded in React) | CONFIRMED | Frontend uses `data.months` array |
| 9 | Shopify store: ledsone UK | CONFIRMED | `STORE = "ledsone_uk"`, `shopify_client.graphql("ledsone_uk", ...)` |
| 10 | Revenue field: originalTotalSet.shopMoney.amount | CONFIRMED | `conduit_sold.py` line 204 |
| 11 | VOIDED exclusion | CONFIRMED | `EXCLUDED_FINANCIAL_STATUSES = {"VOIDED"}` line 78 |
| 12 | cancelledAt exclusion | CONFIRMED | `if o.get("cancelledAt"): continue` line 190 (added 2026-10-02) |
| 13 | REFUNDED orders included | CONFIRMED | Not in exclusion set — gross sold by design |
| 14 | UTC timezone (no BST conversion) | CONFIRMED | `_month_key(dt)` uses UTC year/month directly |
| 15 | Cache: ScheduledSnapshot 12h | CONFIRMED | `ScheduledSnapshot(..., interval_hours=12)` line 432-440 |
| 16 | Stock cache: in-process 5 min | CONFIRMED | `_CACHE_TTL = 5 * 60` in `conduit_stock.py` line 64 |
| 17 | Duplicate imports in main.py | CONFIRMED — BUG | Lines 139-141 and 151-153 identical — harmless but messy |
| 18 | No code changes made | PASS | Read-only investigation |
| 19 | No production access | PASS | Only local file reads |
| 20 | Evidence file created | PASS | `evidence/dm-dashboard/conduit-sold-investigation-2026-10-26.md` |
| 21 | Capability file updated | PASS | `capability/2026/10/2026-10-01/dm-dashboard-conduit-sold-history-pattern-2026-10-01.md` |

---

## Known Unverified Items (require runtime)

| Item | Status |
|---|---|
| Page actually loads in browser | NOT TESTED — requires backend + frontend running |
| Update button triggers re-sync | NOT TESTED |
| Component Stock tab loads from DB | NOT TESTED |
| CSV download works | NOT TESTED |
| Live Contabo vs local comparison | NOT DONE |

---

## Overall Result: PASS (investigation phase)

All code paths traced. All questions answered statically. Runtime verification is Phase 2.
