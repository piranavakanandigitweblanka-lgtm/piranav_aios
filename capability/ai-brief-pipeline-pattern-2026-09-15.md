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
