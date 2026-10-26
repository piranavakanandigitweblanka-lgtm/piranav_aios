# Prompt: DM Dashboard — Git Origin Recovery & Local Verification

**Category:** discovery / git-safety
**First used:** 2026-10-26
**Status:** ACTIVE

---

## When to Use

When starting a new DM Dashboard session after a gap, or when the local checkout state is unknown. Use before any code change to confirm the authoritative remote, branch, and working-tree state.

---

## Prompt

> You are a Senior DevOps Engineer and Git Repository Recovery Specialist working on the DM Dashboard project.
>
> **Phase A — AIOS Discovery**
> Read `piranav_aios/docs/dm-dashboard-dev-knowledge.md` and `piranav_aios/docs/dm-dashboard/dm-dashboard-gpt-brief-2026-09-25.md` to confirm the authoritative repository URL, active development branch, and local path.
>
> **Phase B — Git Safety Audit**
> From `C:\Users\PC\Documents\piranav_aios\dm-dashboard\`, run:
> - `git remote -v` — confirm remote is `websitetecteam-arch/dm-dashboard`
> - `git status --short --branch` — confirm branch is `piranv-work`, check ahead/behind count
> - `git branch -a` — list local + remote branches
> - `git log -5 --oneline --decorate` — confirm HEAD matches `origin/main`
> - `git rev-parse --show-toplevel` — confirm correct directory
>
> **Safety rules:**
> - Never run `git reset --hard`, `git clean -fd`, force-push, or destructive checkout
> - Never commit or push as part of this task
> - If `piranv-work` is ahead of `origin/piranv-work`, note the count but do NOT push without Piranav instruction
> - Never expose `.env` values, tokens, or passwords
>
> **Phase C — Checkout Verification**
> Compare the local `piranv-work` HEAD to `origin/main`. If they match, confirm that no code has been lost (all commits are on origin/main via merged PRs). Document the origin/piranv-work divergence count and explain the safe state.
>
> **Phase D — Select One Page for Verification**
> Recommend the Login page (`/`) as the minimal verification target — it requires only the local app DB, no business DB or external APIs.
>
> **Phase E — Local Verification Plan**
> Inspect `frontend/.env` for `VITE_API_URL` (should be `http://localhost:8499`).
> Check backend `.env` exists (gitignored — do not read or display values).
> Propose exact startup commands for: venv activation, uvicorn, npm run dev.
>
> Report: remote URL, branch, HEAD SHA, ahead/behind, working tree status, selected page, startup commands.

---

## Key Facts (as of 2026-10-26)

| Item | Value |
|---|---|
| Authoritative remote | `https://github.com/websitetecteam-arch/dm-dashboard.git` |
| Active dev branch | `piranv-work` |
| Stable branch | `main` |
| Local path | `C:\Users\PC\Documents\piranav_aios\dm-dashboard\` |
| GitHub account | `websitetecteam-arch` |
| Frontend port | 5199 |
| Backend port | 8499 |
| App DB | `dm_dashboard` on localhost:5432 |
| origin/piranv-work state | 111 commits behind local (all on origin/main — no lost code) |

---

## Technical Constraints

- Never run backend with `--reload`
- Business DB pool capped at max_size=4 — login page does NOT need business DB
- VITE_API_URL must point to `http://localhost:8499`
- Backend requires full restart after any .env or code change
