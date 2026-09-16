# Capability — Unified Daily Task Hub Pattern

**Date added:** 2026-09-15
**Status:** ACTIVE — deployed on all 11 staff dashboards
**Evidence:** evidence/hetheesa/unified-task-hub-2026-09-15.md

## What This Capability Is

A reusable single-table daily task hub that replaces the old two-step flow (brief cards → select → task detail). Staff opens dashboard and sees their tasks immediately in one table with inline status controls.

## Components

- Single table: task title, metric, priority badge, status dropdown, expand button
- Inline status: in_progress / done / skipped — updates DB via /task-log/[staff]/update
- DataTable: supporting data expands per row (products, campaigns, collections)
- extractMetric() / buildReason() helpers — parse task action text for display
- matchTable() — maps task title keywords to brief_data table keys
- localStorage brief cache with server-side freshness check
- 30s background poll for regenerated_at update banner
- Admin Regenerate Brief button (admin/dev role only)

## Applied To

All 11 staff: Sukirtha, Thasitha, Theekshy, Hetheesha, Thivajini, Mahima, Kamsi, Dilaksi, Sajeepan, Jackshan, Sonya

## Reuse Pattern

Copy KamsiDailyTaskPage.jsx or MahimaDailyTaskPage.jsx as base.
Customise: matchTable() keyword list, metric column label, buildReason() logic, staff-specific data keys.
