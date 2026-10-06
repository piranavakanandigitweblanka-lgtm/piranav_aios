# Prompt: DM Dashboard System Discovery

**Category:** discovery
**First used:** 2026-10-06
**Status:** ACTIVE

---

## When to Use

Use this prompt at the start of any DM Dashboard development session where:
- A new developer or Claude Code session needs to understand the system
- Architecture has changed and docs need a refresh
- A new page is being planned and you need to confirm reusable components

---

## Prompt

You are performing a READ-ONLY discovery audit of the DM Dashboard project at `C:\Users\PC\Documents\piranav_aios\dm-dashboard`. DO NOT modify any code, git, database, or config files.

**Existing AIOS documentation to read FIRST (before inspecting code):**
- `docs/dm-dashboard/system-discovery-2026-10-06.md` — most recent full architecture report
- `docs/dm-dashboard/dm-dashboard-gpt-brief-2026-09-25.md` — GPT brief (Sep 2026)
- `docs/dm-dashboard-dev-knowledge.md` — quick reference

**If the above docs are recent (less than 2 weeks old), you may skip deep code inspection and use the docs as primary reference. Only inspect code if:**
1. The docs are outdated (check git log for recent commits)
2. You need to verify a specific implementation detail not in the docs
3. A new page or feature was added since the last discovery

**When doing a fresh discovery, inspect:**
1. `git log --oneline -20` to identify what changed since last doc date
2. `backend/app/main.py` — all routers and startup hooks
3. Any new `backend/app/admin/` files not in the existing docs
4. Any new `frontend/src/admin/pages/` files not in the existing docs
5. Specific feature files if needed (e.g. `admin_conduit_sold.py` for Conduit)

**Key architecture facts (do not re-investigate unless changed):**
- Frontend: React 19 + Vite, port 5199, plain JS (no TypeScript)
- Backend: FastAPI + Python 3.13, port 8499, single uvicorn worker
- App DB: PostgreSQL 18 local, `dm_dashboard` database
- Business DB: remote PostgreSQL, pool max 4, READ-ONLY
- Auth: JWT, global `require_login` middleware (2026-10-01)
- CSS: `jreq-*` classes from `jefri/jefri.css` — used by ALL modules
- New pages must use: ScheduledSnapshot for slow queries, `apiFetch.js` for API calls, `get_business_conn()` for Business DB

**Output:** Update `docs/dm-dashboard/system-discovery-<date>.md` with any changes found. Create evidence + validation + closure entries per AIOS protocol.

---

## Expected Output Files

| File | Purpose |
|---|---|
| `docs/dm-dashboard/system-discovery-<date>.md` | Full architecture report (update or new) |
| `evidence/dm-dashboard/system-discovery-<date>.md` | What was inspected, key findings |
| `validation/piranav/dm-dashboard-discovery-validation-<date>.md` | Section pass/fail checklist |
| `closure/README.md` | New closure row appended |
| `PROMPT_REGISTER.md` | Row updated |
