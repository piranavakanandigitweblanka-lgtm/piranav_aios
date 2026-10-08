---
name: task-verification-2026-09-03
description: Staff task verification system — note required + Google Ads auto-verify + Muguntha approval
metadata:
  type: capability
  date: 2026-09-03
  status: PASS
---

# Staff Task Verification System

**Date:** 2026-09-03
**Status:** PASS — Live on production

---

## Problem

Staff AI briefs assign daily tasks. Staff select and mark tasks done. System was honour-based — staff could click Mark Done and write any note without actually doing the work. No verification.

---

## Solution Built

### Layer 1 — Required Completion Note
- Mark Done now opens a note textarea (required)
- Backend enforces: returns `400` if `completion_note` is empty when `status=done`
- Skip stays one-click — no note required

### Layer 2 — Google Ads Auto-Verification
When a Google Ads staff member submits done, backend queries:
```sql
SELECT COUNT(*) FROM google_ads.google_ads_change_events
WHERE user_email = '{staff_email}'
AND change_date_time::date = CURRENT_DATE
```
- Changes found → `auto_verified` + change count shown
- No changes → `unverified` → Muguntha reviews
- SEO / Feed staff (no Google Ads email) → `pending_review` → Muguntha reviews

### Layer 3 — Muguntha Approval (TeamTaskMonitor)
- Done tasks show: completion note + verification badge
- `unverified` / `pending_review` → Approve / Reject buttons appear
- Reject includes optional note from Muguntha
- On approve/reject → badge updates, buttons disappear

---

## Staff → Google Ads Email Map

| Staff | Email | Auto-verify |
|---|---|---|
| sajeepan | sajeepandigitweblanka@gmail.com | Yes |
| jefri | jefri.digitweblanka@gmail.com | Yes |
| thivajini | thivajinidigitweblanka@gmail.com | Yes |
| thasitha | thasithadigit@gmail.com | Yes |
| mahima | mahimadigitweb@gmail.com | Yes |
| sonya | sonyadigitweblanka@gmail.com | Yes |
| theekshy | theekshydigit@gmail.com | Yes |
| hetheesha | — | Muguntha review |
| kamsi | — | Muguntha review |
| sukirtha | — | Muguntha review |
| dilaksi | — | Muguntha review |

---

## New DB Columns (public.staff_task_log)

| Column | Type | Purpose |
|---|---|---|
| `completion_note` | TEXT | What staff said they did |
| `verification_status` | TEXT | pending / auto_verified / unverified / pending_review / approved / rejected |
| `change_count` | INT | Google Ads changes detected today |
| `muguntha_note` | TEXT | Muguntha's feedback on review |

Added via `ADD COLUMN IF NOT EXISTS` — safe on existing table.

---

## New Backend Routes

| Route | Purpose |
|---|---|
| `POST /api/task-log/{staff}/update` | Updated — requires note for done, auto-verifies |
| `POST /api/task-log/review` | NEW — Muguntha approves or rejects |

---

## Files Changed

| File | Change |
|---|---|
| `backend/app/ai_shared.py` | `STAFF_ADS_EMAILS` dict, `auto_verify_task()`, 4 new columns in `ensure_task_log_table()` |
| `backend/app/task_log.py` | Update route enforces note + auto-verify, new review route, new columns in all GETs |
| `frontend/src/components/DailyBriefWidget.jsx` | Mark Done → note input → Submit → verification result shown |
| `frontend/src/components/MyTaskLog.jsx` | Mark Done → note input → Submit → badge on card |
| `frontend/src/admin/pages/TeamTaskMonitor.jsx` | Note + verification badge + Approve/Reject for Muguntha |

---

## Also Fixed

**`jefri_nonmoving_db.py` startup crash** — `CREATE SCHEMA IF NOT EXISTS jefri_nonmoving` failed because `dm_user` lacked CREATE privilege on the database.
Fix: `GRANT CREATE ON DATABASE dm_dashboard TO dm_user;`

---

## Server Verification

```
POST /api/task-log/sajeepan/update (done, no note)  → 400 completion_note is required
POST /api/task-log/sajeepan/update (done + note)    → {"ok":true,"verification_status":"unverified","change_count":0}
POST /api/task-log/kamsi/update (skipped)           → {"ok":true}
POST /api/task-log/review (approved)                → {"ok":true}
Build: 368ms clean. Service: active.
```
