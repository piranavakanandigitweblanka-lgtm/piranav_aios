# Capability — Hetheesha Dashboard UX Fix Tracker Pattern

**Date added:** 2026-09-16
**Status:** ACTIVE — deployed on piranv-work
**Scope:** dm-dashboard · hetheesha staff module
**Evidence:** evidence/hetheesa/ux-overhaul-2026-09-16.md

---

## What This Capability Is

A reusable UX pattern for staff dashboards that have SEO fix trackers. Solves 3 specific UX problems that make it hard for staff to know what to fix and track their progress.

Can be applied to any requirement that has: a list of issues, a DB-backed fix tracker, and a need for priority-sorted task guidance.

---

## The 3 Problems It Solves

| Problem | Solution |
|---|---|
| No "start here" — staff sees 50 rows, doesn't know what to fix first | Action List banner at top — priority-sorted, highest-impact first |
| Fix Tracker hidden behind toggle — too many clicks to mark something done | Always-visible two-column layout — one-click Done button per row |
| Badge stays stale after clicking Done — looks like nothing happened | Optimistic state update — badge switches to "Fixed ✓" green immediately |

---

## Components Built

### `actionItems` useMemo
Filters unfixed issues from allRows, assigns priority by issue type, sorts by traffic/revenue desc.

### `markDone(handle, fieldKey)`
One-click save to DB + immediate optimistic state update via `setFixEntries`.

### `isFixed(handle, fieldKey)`
Checks `fixEntries[key]?.fix_date` — works on optimistic state, not server state.

### Two-column Fix Tracker
- Left: Still Pending (scrollable, field filter tabs, Done + Notes buttons)
- Right: Fixed by You (grouped by URL, all fixed fields as green badges per row)
- Progress bar: X/Y fixed (%)

### `trkFixedGrouped` useMemo
Groups `trkFixed` array by handle — one entry per URL with all fixed fields listed.

### `InlineImpact` / `InlineImpactR2`
Inline GSC Before/After panel. Expands below Fixed row. 7d/14d/30d window toggle.
- Req 1: calls `/fix-detail` (reads fix_date from DB)
- Req 2: calls `/r2-fix-detail` (fix_date passed as direct query param)

---

## Where Applied

| Req | Component | Fix Key | API Prefix | Notes |
|---|---|---|---|---|
| Req 1 | ProductSeoReport.jsx | `handle\|field_key` | `/fix-` | Full pattern: Action List + Tracker + InlineImpact |
| Req 2 | CollectionPerformance.jsx | `handle::field_key` | `/r2-fix-` | Full pattern: Action List + Tracker + InlineImpactR2 |
| Req 3 | DuplicatePageAnalysis.jsx | N/A | N/A | Action List only — no fix tracker backend |
| Req 4 | HighTrafficStockAlert.jsx | N/A | N/A | Action List only — no fix tracker backend |
| Req 5 | InternalLinkAudit.jsx | N/A | N/A | Action List only — no fix tracker backend |

---

## AI Brief Integration

`hetheesha_ai.py` now reads all 5 requirement snapshots and includes them in the daily brief. The AI uses this data to assign priority tasks to Hetheesha each morning based on what is most urgent across all 5 requirements.

**Reusable pattern:** any staff AI brief can follow the same pattern — read snapshot tables in `_gather_data()`, add sections to `_build_system_prompt()`, add tables to `_build_brief_data()`.

---

## Next Possible Extension

- Add fix tracker backend for Req 3 (duplicate fixes) — table: `hetheesha_fix_tracker_r3`
- Add fix tracker backend for Req 5 (internal link fixes) — table: `hetheesha_fix_tracker_r5`
- Apply same Action List pattern to other staff dashboards (Mahima, Sonya, etc.)
