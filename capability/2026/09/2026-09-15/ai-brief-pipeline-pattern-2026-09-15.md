# Capability — AI Brief Full Pipeline Pattern

**Date added:** 2026-09-15
**Status:** ACTIVE — deployed on Mahima, Kamsi, Hetheesha, Sajeepan
**Evidence:** evidence/hetheesa/mahima-ai-brief-2026-09-15.md

## What This Capability Is

Standard pattern for building a complete staff AI brief backend with: multi-source data gathering, validated task generation, done-task exclusion, admin regeneration, and structured brief data for frontend display.

## Standard Components

### Backend ([staff]_ai.py)

| Component | Purpose |
|---|---|
| `_gather_data(force)` | Pulls all data sources — fix trackers, snapshots, DB queries |
| `_build_system_prompt(data)` | Formats data into AI context with P1/P2/P3 urgency sections |
| `_build_brief_data(data)` | Builds structured tables for frontend DataTable display |
| `_get_done_candidate_ids(conn)` | Excludes tasks done in last 7 days |
| `_last_regeneration_ts` | Global timestamp for frontend polling |
| `POST /brief` | Generates today's brief, saves to chat table |
| `POST /admin/regenerate-brief` | Admin-only force regeneration |
| `GET /history` | Returns today's messages + brief_data + validated_tasks |
| `POST /chat` | Follow-up chat with full history context |

### Frontend ([Staff]DailyTaskPage.jsx)

| Component | Purpose |
|---|---|
| localStorage cache | Avoids regenerating brief on every tab open |
| 30s background poll | Detects admin regeneration and shows update banner |
| Admin Regenerate button | Confirm dialog, admin/dev role only |
| ChatPanel | Follow-up questions to AI about any task |

## Reuse Pattern

Copy mahima_ai.py or kamsi_ai.py. Replace data queries with staff-specific sources. Update system prompt sections and urgency order. Wire to validated_brief_call().

---

## Confirmed Implementations

| Staff | Date Implemented | Notes |
|---|---|---|
| Kamsi | 2026-09-10 | First full pipeline parity implementation — localStorage cache + 30s poll + admin regenerate. Evidence: `closure/README.md — 2026-09-10 Kamsi Full Pipeline Parity` |
| Mahima | 2026-09-15 | Full extension (all req data sources wired). Evidence: `closure/README.md — 2026-09-15 Mahima AI Brief Full Extension` |
| Hetheesha | 2026-09-15 | Unified task hub rollout. Evidence: `closure/README.md — 2026-09-15` |
| All 11 staff | 2026-09-18 | Done-task exclusion window fix (`_get_done_candidate_ids()` SQL corrected for `days` param). Evidence: `closure/README.md — 2026-09-18 DM-AI-2026-09-18-001` |

---

## Related Capabilities

- `actionable-ai-task-brief-2026-09-04.md` — specific fix for multi-line task block capture in `parseTasks()` (frontend only)
- `staff-skill-aware-ai-task-framing-2026-09-04.md` — skill-aware task framing in system prompt
- `team-task-monitor-2026-09-02.md` — team leader visibility of staff task selections (separate system, reads from `staff_task_log`)
- `thivajini-dynamic-campaign-system-2026-09-16.md` — dynamic campaign ID query pattern for campaign-dependent staff

---

## Last Updated
2026-10-08
