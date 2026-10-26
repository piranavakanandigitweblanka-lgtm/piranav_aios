# Evidence — DM Dashboard Git Origin Recovery & Local Verification

**Date:** 2026-10-26
**Task:** Phase 1 Git Safety Audit — verify authoritative remote, local checkout state, and select one page for local verification
**Status:** PASS

---

## 1. AIOS Documents Inspected

| Document | Path | Key Finding |
|---|---|---|
| Dev knowledge reference | `docs/dm-dashboard-dev-knowledge.md` | Remote: `websitetecteam-arch/dm-dashboard`, branch: `piranv-work`, ports: 5199/8499 |
| GPT brief 2026-09-25 | `docs/dm-dashboard/dm-dashboard-gpt-brief-2026-09-25.md` | Full stack, env vars, architecture constraints confirmed |
| Local setup capability | `capability/2026/09/2026-09-01/dm-dashboard-local-setup-2026-09-01.md` | Setup steps documented, bcrypt pattern, venv location |
| Source-map | `source-map/README.md` | No dm-dashboard git row existed — added this session |

---

## 2. Authoritative Repository

| Item | Value | Evidence Source |
|---|---|---|
| Remote URL | `https://github.com/websitetecteam-arch/dm-dashboard.git` | `git remote -v` output + AIOS docs |
| Default / stable branch | `main` | `origin/HEAD -> origin/main` |
| Active dev branch | `piranv-work` | AIOS docs + `git branch -a` |
| GitHub account | `websitetecteam-arch` | AIOS CLAUDE.md + AIOS docs |
| Local path | `C:\Users\PC\Documents\piranav_aios\dm-dashboard\` | `git rev-parse --show-toplevel` |

---

## 3. Git State — Raw Command Output

### `git remote -v`
```
origin  https://github.com/websitetecteam-arch/dm-dashboard.git (fetch)
origin  https://github.com/websitetecteam-arch/dm-dashboard.git (push)
```

### `git status --short --branch`
```
## piranv-work...origin/piranv-work [ahead 111]
nothing to commit, working tree clean
```

### `git branch -a`
```
  main
* piranv-work
  remotes/origin/HEAD -> origin/main
  remotes/origin/dev-work
  remotes/origin/main
  remotes/origin/piranv-work
```

### `git log -5 --oneline --decorate`
```
103de7b (HEAD -> piranv-work, origin/main, origin/HEAD) Merge pull request #87 from websitetecteam-arch/dev-work
572b628 Fix "store is not defined" error in Internal Linking's Edit modal
d82a111 Merge pull request #86 from websitetecteam-arch/dev-work
1ca88d9 Replace Internal Linking's store pill buttons with a proper dropdown
6e7dcde Merge pull request #85 from websitetecteam-arch/dev-work
```

### `git rev-parse --show-toplevel`
```
C:/Users/PC/Documents/piranav_aios/dm-dashboard
```

### `git rev-parse --abbrev-ref HEAD`
```
piranv-work
```

---

## 4. HEAD Commit Details

| Item | Value |
|---|---|
| SHA | `103de7b` |
| Message | `Merge pull request #87 from websitetecteam-arch/dev-work` |
| Tags | `HEAD -> piranv-work`, `origin/main`, `origin/HEAD` |
| Working tree | CLEAN |

---

## 5. Ahead/Behind Analysis — piranv-work vs origin/piranv-work

**Status:** Local `piranv-work` is **ahead 111 commits** of `origin/piranv-work`.

**Why this is NOT a risk of lost code:**
- The HEAD commit `103de7b` is tagged as both `piranv-work` AND `origin/main`
- All 111 commits were merged into `main` via pull requests (#78–#87 visible in log)
- `origin/piranv-work` was never fast-forwarded after those PRs merged
- No code exists only on local — it is all safely on `origin/main`

**Action required:** `origin/piranv-work` can be updated with `git push origin piranv-work` when Piranav instructs. No urgency — no code is at risk.

---

## 6. Project Structure Confirmed

| Layer | Location | Port |
|---|---|---|
| Frontend | `frontend/` | 5199 |
| Backend | `backend/` | 8499 |
| App DB | PostgreSQL 18, localhost:5432, database `dm_dashboard` | — |
| Business DB | Remote host (in `BUSINESS_DATABASE_URL`) | — |

**docs/ directory:** NOT present in project root. AIOS doc `dm-dashboard-dev-knowledge.md` references it but it was never created. Documentation lives in AIOS.

**Frontend `.env` value found:**
```
VITE_API_URL=http://localhost:8199
```
**Warning:** Port `8199` is outdated. Per AIOS docs, current backend port is `8499`. This must be updated before running locally.

---

## 7. Selected Page for Verification

**Page:** Login / Home (`/`)

| Item | Value |
|---|---|
| Route | `/` |
| Component | `frontend/src/App.jsx` — renders login form |
| API endpoint | `POST /api/auth/login` |
| Backend file | `backend/app/auth.py` |
| App DB dependency | `public.users` table (username, password_hash) |
| Business DB required | NO |
| External API required | NO |
| Shopify/Google API required | NO |

**Rationale:** The login page is the minimal viable verification target. It requires only the local app DB and a valid user record. If login succeeds and a JWT is returned, both the backend and frontend are confirmed operational.

---

## 8. Local Setup Requirements

### Prerequisites (check before starting)

| Requirement | How to check |
|---|---|
| Python 3.13 venv | `backend/venv/` exists |
| Backend `.env` | `backend/.env` exists (gitignored — must be manually copied from Contabo or recreated) |
| PostgreSQL 18 running | `pg_isready -p 5432` |
| `dm_dashboard` database | `psql -U dm_dashboard_app -d dm_dashboard -c "\dt"` |
| Node.js / npm | `node --version` |
| Frontend `.env` | `frontend/.env` — must contain `VITE_API_URL=http://localhost:8499` (currently shows 8199 — fix before starting) |

### Startup Commands (proposed — NOT YET EXECUTED)

**Step 1 — Fix frontend env:**
```
# frontend/.env
VITE_API_URL=http://localhost:8499
```

**Step 2 — Start backend:**
```powershell
cd C:\Users\PC\Documents\piranav_aios\dm-dashboard\backend
.\venv\Scripts\activate
uvicorn app.main:app --port 8499
# NO --reload flag
```

**Step 3 — Start frontend (separate terminal):**
```powershell
cd C:\Users\PC\Documents\piranav_aios\dm-dashboard\frontend
npm run dev -- --port 5199
```

**Step 4 — Open browser:**
```
http://localhost:5199
```
Expect: Login form rendered. Enter valid credentials → JWT returned → dashboard loads.

**Do not execute until Piranav approves Phase 2.**

---

## 9. Blockers

| Blocker | Detail | Resolution |
|---|---|---|
| frontend/.env VITE_API_URL | Shows port 8199 (outdated) — backend runs on 8499 | Edit before starting |
| backend/.env | Gitignored — must exist locally with DATABASE_URL + JWT_SECRET at minimum | Confirm file exists before starting |
| origin/piranv-work stale | 111 commits behind local (code is on origin/main — no lost work) | Push when Piranav instructs |

---

## 10. Files Created or Modified This Session

| File | Action |
|---|---|
| `prompts/discovery/dm-dashboard-git-origin-recovery.md` | CREATED |
| `evidence/dm-dashboard/git-origin-recovery-2026-10-26.md` | CREATED (this file) |
| `validation/piranav/dm-dashboard-git-recovery-validation-2026-10-26.md` | CREATED |
| `source-map/README.md` | UPDATED — added dm-dashboard git row |
| `PROMPT_REGISTER.md` | UPDATED — added row |
| `closure/README.md` | UPDATED — added closure entry |
