# Prompt — Conduit Sold Page Investigation

**Category:** investigation / discovery
**Date:** 2026-10-26
**Status:** ACTIVE

---

## When to Use

When you need to understand the Conduit Sold page before making changes, or when resuming work on the date range extension (Phase 2).

---

## Prompt

> You are a Senior React and FastAPI engineer. Investigate the existing Conduit Sold admin page in the DM Dashboard before making any changes.
>
> **Files to read first:**
> - `backend/app/dashboard_pages/conduit_sold.py` — all 478 lines
> - `backend/app/dashboard_pages/conduit_stock.py` — all 364 lines
> - `frontend/src/admin/pages/ConduitSold.jsx` — all 777 lines
>
> **Questions to answer before changing anything:**
> 1. What is the current hardcoded date range? (PHASE1_START, PHASE1_END, MONTHS)
> 2. What financial statuses are excluded?
> 3. What revenue field is used? Is it pre- or post-discount?
> 4. How is the ScheduledSnapshot triggered — schedule and manual?
> 5. Does the month bucketing use UTC or UK local time?
> 6. Are there duplicate imports in main.py?
>
> Do not change any code until you have answered all 6 questions and Piranav has approved the change.

---

## Verified Answers (2026-10-26 investigation)

| Question | Answer |
|---|---|
| Date range | `PHASE1_START = date(2026,4,1)`, `PHASE1_END = date(2026,9,30)`, `MONTHS` hardcoded list — fixed to Apr–Sep 2026 |
| Financial status exclusions | `VOIDED` financial status + `cancelledAt IS NOT NULL` |
| Revenue field | `originalTotalSet.shopMoney.amount` — qty × original unit price, pre-discount, GBP |
| Snapshot schedule | 12-hour background (`interval_hours=12`). Manual: `POST /api/admin/conduit-sold/sync/run-now` |
| Month bucketing timezone | UTC only — no BST conversion |
| Duplicate imports in main.py | YES — lines 139-141 and 151-153 import same conduit symbols twice. Harmless. |

---

## Phase 2 — Extend Date Range

**Smallest safe fix (Option A — extend to current month):**

In `conduit_sold.py`:
1. Replace `PHASE1_END = date(2026, 9, 30)` with dynamic last-completed-month end
2. Replace hardcoded `MONTHS` list with a generator from Apr 2026 to last completed month
3. Update Shopify query end boundary to match new PHASE1_END
4. Force a ScheduledSnapshot re-run after deploy

In `ConduitSold.jsx`:
5. Update CSV filename (remove hardcoded `-apr-sep-2026`)

**Do NOT implement until Piranav approves.**
