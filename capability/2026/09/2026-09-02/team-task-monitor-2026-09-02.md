---
name: team-task-monitor-2026-09-02
description: Capability — Team Task Monitor built so Muguntha can see in real time what each staff is working on from their AI brief
metadata:
  type: capability
---

# Capability — Team Task Monitor

**Date:** 2026-09-02
**Engineer:** Piranav

---

## Problem

Muguntha's AI brief told her which staff were active but not what task each person selected. Staff AI briefs assigned tasks but there was no way to track which task was picked or whether it was completed — invisible to the team leader.

---

## What Was Built

A full task tracking system across backend and frontend:

### Backend — staff_task_log table + task_log router

New DB table `public.staff_task_log`:
- `staff` — staff name (lowercase)
- `session_date` — daily reset key
- `task_number` — which task (1–5)
- `task_text` — the task description from the AI brief
- `priority` — high / medium / low
- `status` — in_progress / done / skipped

New router `task_log.py` at `/api/task-log/`:
- `POST /{staff}/select` — staff picks a task (called from widget)
- `POST /{staff}/update` — staff marks done or skipped
- `GET /today` — Muguntha's view: all staff tasks today

### Frontend — DailyBriefWidget task buttons

After the AI brief loads, brief text is parsed with regex to extract task lines (`🔴🟡🟢 N. task text`). Tasks shown as clickable buttons below the brief.

When staff clicks a task button:
1. Task sent to `/chat` (existing AI flow)
2. Task logged to `staff_task_log` via `POST /{staff}/select`

After AI responds, **Mark Done** and **Skip** buttons appear:
- Click Done → `POST /{staff}/update` with `status=done`
- Click Skip → `POST /{staff}/update` with `status=skipped`
- Confirmation shown: "✅ Task marked done — Muguntha can see this."

### Muguntha AI brief — task log block

`muguntha_ai.py` now queries `staff_task_log` in `_gather_data()` and includes a task status block in the system prompt:

```
WHAT EACH STAFF IS WORKING ON TODAY:
  Sajeepan (Google Ads UK) — 🔄 Task 1: Exclude 5 OOS bestseller products...
  Kamsi (SEO UK) — ✅ Task 2: Fix missing meta descriptions
  Thivajini (Google Ads FR) — ⏳ Active but no task selected yet
```

### Admin page — TeamTaskMonitor.jsx

New page in Admin dashboard sidebar (Access & Intelligence section) → **Team Task Monitor**:
- 4 summary cards: Done / In Progress / Skipped / Not Started
- One row per staff with avatar, name, role
- Each task shown with priority pill + status pill
- Blue left border for staff who have selected a task
- Grey "No task selected yet" for inactive staff
- Auto-refreshes every 60 seconds + manual Refresh button

---

## Files Created / Modified

| File | Change |
|---|---|
| `backend/app/ai_shared.py` | Added `ensure_task_log_table()` helper |
| `backend/app/task_log.py` | New — task log router, 3 routes |
| `backend/app/main.py` | Registered task_log_router |
| `backend/app/muguntha_ai.py` | Queries task log, adds task block to system prompt |
| `frontend/src/components/DailyBriefWidget.jsx` | Parses brief into task buttons, Done/Skip buttons, logs to task_log |
| `frontend/src/admin/pages/TeamTaskMonitor.jsx` | New — live team task monitor page |
| `frontend/src/admin/AdminLayout.jsx` | Added nav item + panel for TeamTaskMonitor |

---

## Reusable Pattern — Team Leader Task Visibility

For any team leader AI system:
1. Staff AI widget writes task selections to a shared log table
2. Team leader AI reads the log in `_gather_data()` and includes it in the system prompt
3. Dedicated admin page polls `GET /task-log/today` for visual monitoring
4. Status flows: `in_progress` → `done` or `skipped` (staff-driven, no manual entry needed)
