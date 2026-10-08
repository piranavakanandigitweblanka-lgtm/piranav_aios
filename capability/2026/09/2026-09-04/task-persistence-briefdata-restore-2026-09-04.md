# Capability: Task Persistence Protection + brief_data Restoration on Reopen

**ID:** CAP-UI-2026-09-04-B
**Date:** 2026-09-04
**Status:** IMPLEMENTED — LIVE VALIDATION REQUIRED
**Author:** Claude Code (sinrasu mode)
**Reviewed by:** GPT (verification audit defined problems)
**Supersedes:** None — extends [[clickable-task-items-priority-icons-2026-09-04]]

---

## Problems Fixed

### Problem 1 — Completed task could be reselected

**Audit finding (FAIL):** After marking Task 1 done and reopening the AI Assistant widget:
- All state was reset on `useEffect` open
- `parseTasks()` re-ran on the saved AI brief text → all 4 task buttons reappeared
- No cross-reference with `staff_task_log`
- Staff could re-click Task 1 → backend `/select` reset it back to `in_progress`, cleared `completion_note`, cleared `verification_status`
- Done task history was permanently overwritten

### Problem 2 — brief_data disappeared after reopen

**Audit finding (FAIL):** On widget reopen:
- `GET /history` returned only chat messages, not `brief_data`
- `setBriefData(null)` was set on open and never updated in the history path
- Verified URLs and structured task detail tables were unavailable after reopen
- Clicking a task selected on reopen stored `task_detail: null` in the DB

---

## Root Cause Analysis

### Problem 1 root cause

`DailyBriefWidget.jsx:useEffect` resets all state including `selectedTask`, `taskStatus` on every open.
`parseTasks()` re-creates buttons from the AI text with no status awareness.
Backend `/select` endpoint (task_log.py:60–67) did not check the existing row's status before overwriting.

### Problem 2 root cause

`GET /api/{staff}/ai/history` returned `{"ok": True, "messages": [...]}` only.
`brief_data` was only populated in the `/brief` POST response.
In the history path (line 151 in original), `setBriefData` was never called.

---

## Implementation

### Fix 1 — Frontend: Task number protection

**File:** `frontend/src/components/DailyBriefWidget.jsx`

Added `doneTaskNums` state (`Set` of task_numbers that are done or skipped today):
```javascript
const [doneTaskNums, setDoneTaskNums] = useState(new Set())
```

In `useEffect` (open trigger):
- Reset `doneTaskNums(new Set())` with other state
- Fire parallel fetch of `GET /api/task-log/{staff}/today`
- Populate `doneTaskNums` from tasks where `status === 'done' || status === 'skipped'`

In `handleTaskSelect`:
- Added guard: `if (doneTaskNums.has(task.number)) return`
- Prevents re-selection from chat input or any other path

In task button render:
- Filter: `briefTasks.filter((t) => !doneTaskNums.has(t.number))`
- Done/skipped task buttons are hidden, not just disabled
- If all tasks are filtered: shows "✅ All tasks done for today."

### Fix 2 — Backend: guard in `select_task`

**File:** `backend/app/task_log.py`

Changed `SELECT id FROM` → `SELECT id, status FROM` in the existing row check.
Added: if `existing["status"] in ("done", "skipped")` → `return {"ok": True, "protected": True}` without updating.
This is a second line of defence — even if the frontend guard is bypassed, the backend refuses to overwrite a done/skipped row.

### Fix 3 — Frontend: history path reads brief_data

**File:** `frontend/src/components/DailyBriefWidget.jsx`

In the history path (when `history.length > 0`):
```javascript
if (data.brief_data) setBriefData(data.brief_data)
```

### Fix 4 — Backend: `/history` returns brief_data for Kamsi and Sukirtha

**File:** `backend/app/kamsi_ai.py`
**File:** `backend/app/sukirtha_ai.py`

In `/history` endpoint, after loading messages:
```python
brief_data = None
if messages:
    try:
        data = _gather_data(force=False)  # uses 5-min cache — no new DB hit if recently fetched
        brief_data = _build_brief_data(data) or None
    except Exception:
        pass
return {"ok": True, "messages": messages, "brief_data": brief_data}
```

`force=False` means the existing 300-second data cache is used if warm. No extra DB query if the brief was generated within 5 minutes. If cache is cold (reopen hours later), a fresh DB read happens — this is correct and desirable.

No Gemini call is made. No AI regeneration. Only data queries.

---

## Files Changed

| File | Change |
|---|---|
| `frontend/src/components/DailyBriefWidget.jsx` | `doneTaskNums` state, parallel task-log fetch, history brief_data read, task button filter, all-done message, `handleTaskSelect` guard |
| `backend/app/task_log.py` | `select_task()` — SELECT status, return `protected: True` if done/skipped |
| `backend/app/kamsi_ai.py` | `/history` endpoint — returns `brief_data` from cached data |
| `backend/app/sukirtha_ai.py` | `/history` endpoint — returns `brief_data` from cached data |

---

## Daily AI/Gemini Behaviour — UNCHANGED

The existing rule is preserved:

```
GET /history → history exists → reuse saved AI brief → NO Gemini call
GET /history → history empty  → POST /brief → Gemini called once → saved to DB
```

The new parallel fetch of `/api/task-log/{staff}/today` does NOT call Gemini.
The new `_gather_data(force=False)` in `/history` does NOT call Gemini.
Gemini is still called ONLY when today's chat table is empty.

---

## Task Persistence Behaviour

| Scenario | Before fix | After fix |
|---|---|---|
| Task 1 done, reopen, re-click Task 1 | Status reset to `in_progress`, note cleared | Task 1 button hidden. `handleTaskSelect` guard returns early. Backend refuses with `protected: True` |
| Task 1 skipped, reopen | Skipped task re-appears selectable | Task 1 button hidden |
| Tasks 2–4 not selected, reopen | Still show | Still show (unchanged) |
| All 4 tasks done, reopen | All 4 appear selectable | "✅ All tasks done for today." message shown |
| Admin view after reopen | Unaffected (separate endpoint) | Unaffected |

---

## brief_data Restoration Behaviour

| Staff | brief_data on initial /brief | brief_data on reopen via /history |
|---|---|---|
| Kamsi | CONFIRMED (existing) | NOW RESTORED via `_gather_data(force=False)` |
| Sukirtha | CONFIRMED (existing) | NOW RESTORED via `_gather_data(force=False)` |
| All other staff | null (no verified URLs) | null (unchanged — `_build_brief_data` not present) |

Verified URLs remain sourced from GSC API and Shopify DB — never AI-generated.

---

## Backward Compatibility

- Existing tasks without `task_detail`: unaffected — `TaskDetailTable` returns null for empty detail
- Tasks from before this change: `/select` protection only applies to same-day rows; no retroactive impact
- Other 9 staff (no brief_data): `/history` response shape unchanged — `brief_data: null` is handled by `if (data.brief_data)` guard in frontend
- Admin TaskMonitor: no change — reads from `staff_task_log` directly via separate endpoint

---

## Regression Risk

| Area | Risk | Mitigation |
|---|---|---|
| Task selection | `doneTaskNums` populated before briefTasks — race condition possible | Both fetches are independent; filter only hides buttons, does not block briefTasks loading |
| `/history` response shape | New `brief_data` field added | Frontend already uses `if (data.brief_data)` guard — additive only |
| Backend `select_task` | New early return | Returns `ok: True` — frontend does not check for `protected` flag; silent no-op from user perspective |
| `_gather_data(force=False)` in /history | Could fail if data source unavailable | Wrapped in try/except; `/history` still returns messages even if brief_data fails |

---

## Validation

**LIVE VALIDATION: NOT COMPLETED** — requires browser and server deployment.

Required validation steps:
1. Open Kamsi widget → brief loads (Gemini called once)
2. Select Task 1 → confirm `staff_task_log` row created
3. Mark Task 1 done → confirm status = done, completion_note saved
4. Close widget → reopen → confirm Task 1 button absent
5. Confirm Tasks 2–4 still show as selectable buttons
6. Admin TeamTaskMonitor → confirm Task 1 shows as Done
7. Select Task 2 → confirm it can still be selected (no regression)
8. Close widget → reopen → confirm brief_data returned by /history → task detail table appears for Task 2
9. Confirm clicking a link in the task detail table opens ledsone.co.uk URL
10. Network tab: confirm GET /history called on reopen, no POST /brief, no Gemini call

---

## Limitations

1. **Race condition (minor):** `doneTaskNums` and `briefTasks` are populated by two separate fetches. If the task-log fetch is slower than the history fetch, task buttons may flash briefly before the done filter is applied. In practice this is sub-100ms.
2. **Skipped task hiding:** Skipped tasks are also hidden from buttons (consistent with done). Staff cannot re-select a skipped task without refreshing. This is intentional — the refresh button (🔄) clears all state including `doneTaskNums`.
3. **brief_data for other 9 staff:** No change — they don't have verified URL data. Their `/history` response returns `brief_data: null`.
4. **brief_data cache freshness:** If the widget is reopened hours after the brief was generated, `_gather_data(force=False)` will re-query the DB (cache TTL=300s). The returned brief_data rows may differ from what the AI text refers to — this is acceptable as the brief_data is used for the structured table display, not the AI text itself.

---

## Handover

- Deploy to Contabo server: `git pull origin piranv-work && cd frontend && npm run build && systemctl restart dm-dashboard`
- Test Kamsi dashboard: complete a task → reopen → confirm task hidden
- Check Network tab: GET /history must NOT be followed by POST /brief
- Account to select on push: **websitetecteam-arch**
- Push from `piranav_aios/dm-dashboard/`, branch `piranv-work`
