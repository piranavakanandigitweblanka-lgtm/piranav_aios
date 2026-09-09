# Capability — Sajeepan Admin: Regenerate Today's Brief
**Date:** 2026-09-09
**Status:** DEPLOYED — commits 60eb8b8, 3472513, 64356b7 on `piranv-work` (websitetecteam-arch/dm-dashboard)
**Phase:** 1 of N — Sajeepan only

---

## What This Capability Does

Allows an authorized Admin to force-generate a fresh Sajeepan brief from live R1–R4 data without waiting for the next day.

This is REGENERATION — not RESET. Existing task state (selected, in-progress, done, skipped) is fully preserved.

---

## New Endpoint

`POST /api/sajeepan/ai/admin/regenerate-brief`

**Authorization:** Admin or dev role only. Staff tokens (role=staff) receive HTTP 403.
- Enforced by `verify_admin_token()` in `auth.py`
- Sajeepan's own token cannot trigger this endpoint
- JWT role check is server-side — cannot be bypassed by client

**Request:** No body. Bearer token in Authorization header.

**Response:**
```json
{
  "ok": true,
  "regenerated_at": 1725000000.0,
  "triggered_by": "piranav",
  "task_count": 4,
  "excluded_count": 2,
  "validation_ok": true,
  "brief_preview": "..."
}
```

**Error responses:**
- 401: Missing/invalid/expired token
- 403: Staff token or insufficient role
- 502: AI unavailable (Gemini + Groq + NVIDIA all failed)

---

## Architecture

```
Admin uses "View As Sajeepan" (existing Admin → View As flow)
    ↓
SajeepanLayout receives user={admin_user} (role="admin")
    ↓
SajeepanDailyTaskPage receives user prop
    ↓
isAdmin = ['admin','dev'].includes(user?.role)  ← UI-only gating
    ↓
🔄 Regenerate Brief button rendered (admin only)
    ↓
handleAdminRegen()
    ↓
POST /api/sajeepan/ai/admin/regenerate-brief
    ↓
verify_admin_token()               ← admin/dev only, server-side, staff blocked (403)
    ↓
_gather_data(force=True)           ← bypass 5-min cache, fresh R1/R2/R3/R4
    ↓
_get_done_candidate_ids()          ← existing 7-day exclusion (UNCHANGED)
    ↓
validated_brief_call()             ← existing AI pipeline (UNCHANGED)
    ↓
DELETE today's sajeepan_ai_chat    ← replace chat/brief in DB
save_message(new brief)            ← same write as existing /brief
    ↓
_last_regeneration_ts = time.time()  ← signal for frontend cache bypass
    ↓
Returns {ok, regenerated_at, task_count, ...}
    ↓
handleAdminRegen(): lastRegenTsRef.current = regenerated_at  ← prevent polling double-fire
    ↓
loadBrief(true)
    ↓
GET /history                       ← reads the freshly saved brief
    ↓
firstAI exists → use it (NOT /brief again)   ← fix: was `if (firstAI && !force)`, now `if (firstAI)`
    ↓
setBriefTasks / setBriefData / setValidatedNums / setCandidateIds / setChatMessages
    ↓
Today's Tasks + AI Chat both update from same /history response
```

**Existing AI pipeline fully reused** — no duplication of:
- R1/R2/R3/R4 business logic (`req1/req2/req3/req4`)
- `build_candidate_registry()`
- `_calc_backend_priority()`
- `validated_brief_call()`
- `validate_ai_task()`
- AI fallback chain (Gemini → Groq → NVIDIA)

---

## Files Changed

| File | Change |
|------|--------|
| `backend/app/auth.py` | Added `verify_admin_token()` — admin/dev role check, raises 403 for staff |
| `backend/app/sajeepan_ai.py` | Added `_last_regeneration_ts` module variable; added `regenerated_at` to `/history` response; added `POST /admin/regenerate-brief` endpoint |
| `frontend/src/sajeepan/SajeepanLayout.jsx` | Passes `user={user}` prop to `<SajeepanDailyTaskPage>` so admin role is visible inside the page |
| `frontend/src/sajeepan/pages/SajeepanDailyTaskPage.jsx` | `isAdmin` check; Regenerate button + confirmation dialog; `handleAdminRegen()`; background polling (30s); `updateBanner` state; `lastRegenTsRef`; `saved_at` in localStorage cache; `regenerated_at` cache-bypass check; `if (firstAI)` fix (was `if (firstAI && !force)`) |

**NOT changed (corrections from earlier incorrect doc):**
- `frontend/src/admin/pages/SajeepanAdmin.jsx` — deleted (was wrong location, never committed)
- `frontend/src/admin/AdminLayout.jsx` — no changes (reverted to clean state)

---

## Root Cause Fix (commit 64356b7)

**Bug:** `if (firstAI && !force)` — when `force=true`, the condition was `false` even when
the admin-regenerated brief already existed in `/history`. The code fell through to the `else`
branch and called `POST /api/sajeepan/ai/brief`, triggering a second complete AI generation.

**Effect:** Two AI generation pipelines per admin regen; `setChatMessages` never called in
`else` branch; if second call failed → Today's Tasks showed error not new brief.

**Fix:** `if (firstAI)` — one character removed. `force=true` only skips localStorage (already
done at top of function); it must not bypass an already-generated brief in the DB.

| Scenario | Before (bug) | After (fix) |
|---|---|---|
| force=false, brief exists | enters if ✓ | enters if ✓ |
| force=false, no brief | else → generate ✓ | else → generate ✓ |
| force=true, brief exists | else → second generation ✗ | enters if ✓ |
| force=true, no brief | else → generate ✓ | else → generate ✓ |

Only case 3 changed — the bug case. All other cases identical.

---

## Selected/In-Progress Task Preservation

`staff_task_log` is **never touched** by the regeneration endpoint.

- Selected tasks remain selected
- in_progress status unchanged
- done status unchanged
- skipped status unchanged
- candidate_id preserved in task_detail JSON
- verification state preserved
- evidence preserved

The regeneration only writes to `public.sajeepan_ai_chat` (the chat/brief table).

---

## Reopen Behavior

`handleUpdate(taskNumber, 'in_progress')` → `POST /task-log/sajeepan/update` with `status='in_progress'`

- Sets status from `done` → `in_progress` in DB (same row, no new row)
- `_get_done_candidate_ids()` queries `WHERE status='done'` — reopened task is no longer excluded
- After admin regen, reopened task's candidate is eligible again in the new brief
- If admin regenerates and the same candidate appears again: `select_task` finds existing `in_progress` row → UPDATE (not INSERT). No duplicate.
- New candidates from other tasks INSERT normally and coexist with reopened task.

---

## 7-Day Done-Candidate Exclusion

`_get_done_candidate_ids()` reads from `staff_task_log WHERE status='done'`. Since task_log is never modified by regeneration, the exclusion set is identical before and after. Done candidates remain excluded for 7 days.

---

## Background Polling (Automatic Update Without F5)

Polling interval: 30 seconds. Calls `GET /history` only — no AI call, no R1-R4.

```
Every 30s:
  → GET /history
  → compare regenerated_at vs lastRegenTsRef.current
  → if advanced: setUpdateBanner('loading')
                 loadBrief(true)         ← fixed path: reads /history, no /brief
                 setUpdateBanner('done') after 5s
```

First tick establishes baseline (no banner). Admin-side `handleAdminRegen` updates `lastRegenTsRef` immediately to prevent the polling loop from double-firing.

---

## Frontend Cache Invalidation

Sajeepan's dashboard caches the brief in `localStorage` keyed by today's date (`sj_brief_YYYY-MM-DD`).

After Admin regeneration:
1. `_last_regeneration_ts` is set server-side
2. `/history` returns `"regenerated_at": <ts>`
3. On soft load, `loadBrief()` checks `regenerated_at > saved_at` from localStorage
4. If newer → cache bypassed → brief loaded from server
5. On `force=true` → cache is always skipped (top of function)
6. After fresh load, `saveBriefCache` called with new `saved_at = Date.now()/1000`

---

## Admin UI Location

Location: **Sajeepan's My Tasks page** — visible only when `isAdmin === true` (admin/dev role via `user` prop).

NOT in: Admin dashboard, Staff Tools section, separate admin page.

Shows:
- `🔄 Regenerate Brief` button (admin only, idle/done/error states)
- Confirmation dialog with explicit preservation guarantees
- `⟳ Regenerating…` (loading state, disabled)
- `✓ N tasks generated` with dismiss button (done state)
- `⚠ error message` with dismiss button (error state)
- Background update banner (for Sajeepan when admin regen is detected by polling)

---

## DB Safety

Writes only to `public.sajeepan_ai_chat` — same table the existing `/brief` endpoint writes to.
No writes to: `staff_task_log`, `google_ads.*`, `listings.*`, `order_management.*`
No schema changes.

---

## Known Limitations (Phase 1)

1. **Chat context cleared on regeneration**: Today's chat conversation is deleted when the new brief is saved. Sajeepan starts a fresh chat context with the new brief. Task state is unaffected.
2. **`_last_regeneration_ts` resets on server restart**: If server restarts between regeneration and the next polling tick, timestamp is 0. Polling re-establishes baseline; no spurious banner. Admin can regenerate again if needed.
3. **Sajeepan only**: Other staff do not have Admin controls in Phase 1.
4. **Live two-session browser test**: NOT VERIFIED in this session. Code-path analysis and 20/20 tests pass. Requires deployed environment with two open sessions.

---

## Commits

| Commit | Description |
|---|---|
| `60eb8b8` | feat(sajeepan): admin regenerate brief — correct location (My Tasks page) |
| `3472513` | feat(sajeepan): live brief update detection + UX gap fixes |
| `64356b7` | fix(sajeepan): loadBrief(true) no longer triggers duplicate AI generation |

Branch: `piranv-work` — remote: `websitetecteam-arch/dm-dashboard`
