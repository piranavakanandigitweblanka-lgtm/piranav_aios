# CLAUDE.md — piranav Mini-AIOS

This file is read automatically by Claude Code at every session start. Follow all rules below without being asked.

---

## Who You Are Working With

| Role | Name | Responsibility |
|---|---|---|
| Owner | Piranav | Instructs Claude to commit, push, deploy. Approves scope changes. |
| Coordinator | GPT | Designs tasks, reviews outputs, approves evidence quality. Does NOT write files or run git. |
| Worker | Claude Code | Reads, writes, queries files inside `piranav_aios`. Executes approved instructions only. |

Claude Code does NOT make decisions — it executes what Piranav instructs.
Claude Code does NOT change files outside `piranav_aios` without Piranav approval.

---

## Repository Map

| Folder | GitHub | Notes |
|---|---|---|
| `piranav_aios` (main) | https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios | Branch: main |
| `Staff-requirements-02` | Same repo as above (subfolder) | Same remote, deployed to Vercel |
| `Staff-requirements` (SR-01) | https://github.com/digitalmarketing69140951-sys/Staff-requirements | Separate repo, separate account, deployed to Vercel |
| `dm-dashboard` | Local only | React 19 + Vite frontend, Python backend. Runs via VS Code Dev Tunnel. NOT on Vercel. |
| `shopify_projects/` | Via Shopify CLI | 3 active themes: ledsone-uk, ledsone-fr, electricalsone |

---

## Standing Rules — Always Active

### Rule 1 — GPT Prompt Capture (permanent, 2026-07-01)
Every reusable GPT prompt must be saved to `prompts/` BEFORE the task is executed.
- Check `PROMPT_REGISTER.md` first — update existing if equivalent exists
- Save prompt → execute task → update `PROMPT_REGISTER.md`
- Skipping this = **session FAIL**

### Rule 2 — Commit Before Deploy (permanent, 2026-08-14)
Never deploy to Vercel without first committing all changes to git.
- A `vercel --prod` from a stale local copy silently overwrites production
- This caused the Staff ID Performance incident (Aug 2026) — code had to be recovered from Vercel snapshot

### Rule 3 — All AIOS Files Must Be Git-Tracked
After creating any capability, closure, evidence, or validation file — run `git status` and confirm it is tracked before the session ends.

### Rule 4 — No Duplicate Truth
Before saving any file, search `piranav_aios/` for an existing equivalent. If one exists, extend it. Do not create a parallel copy. Log confirmed risks in `duplicate-risk/README.md`.

### Rule 5 — Push to the Correct Repo Per Project
Each project has its own separate git remote. Never run `git push` from the wrong directory.

| Project | Directory to run git from | Remote |
|---|---|---|
| AIOS docs (evidence, closure, capability, prompts) | `piranav_aios/` | `piranavakanandigitweblanka-lgtm/piranav_aios` |
| dm-dashboard | `piranav_aios/dm-dashboard/` | `websitetecteam-arch/dm-dashboard` |
| Staff-requirements (SR-01) | `piranav_aios/Staff-requirements/` | `digitalmarketing69140951-sys/Staff-requirements` |
| Staff-requirements-02 | `piranav_aios/` (subfolder of main repo) | `piranavakanandigitweblanka-lgtm/piranav_aios` |

**Before any `git push` — confirm which directory you are in and which remote it points to.**
Run `git remote -v` if unsure. Never push dm-dashboard or Staff-requirements changes from the `piranav_aios` root.

---

## Session Order — Follow Every Time

**Step 1 — Session start checks**
- Read `closure/README.md` — check OPEN items from previous session
- Run `git status` — report any untracked or uncommitted files before starting new work

**Step 2 — Search existing assets first**
- Search `piranav_aios/` for an existing file before creating anything new
- Check `PROMPT_REGISTER.md` for existing prompt equivalents

**Step 3 — Confirm scope**
- Confirm the task is inside the approved boundary
- Get Piranav approval before touching files outside `piranav_aios`

**Step 4 — Do the work**
- Execute the approved task
- Commit to git BEFORE deploying (Rule 2)
- Save all Claude-generated output as `.md` files before session ends

**Step 5 — Evidence**
- Create an evidence file for work done
- Save validation notes (browser results, DB queries, screenshots)
- Use template at `evidence/templates/gpt-review-of-claude-output-template.md` for GPT reviews

**Step 6 — Closure**
Write a closure entry in `closure/README.md` with:
- Requirement ID, Task, Asset path, Evidence path, GitHub commit
- Queryability: YES / NO
- Blockers, Next step, Status: PASS / FAIL / OPEN

**A session with no closure entry is a FAIL.**

**Step 7 — Final git check**
- Run `git status` — confirm nothing untracked
- Commit all new AIOS documentation files
- Push only when Piranav instructs

---

## Pass / Fail Rule

Session **PASSES** if all 7 steps followed, closure written, no untracked AIOS files at end.

Session **FAILS** if:
- Evidence missing at closure
- Duplicate truth created
- Closure entry not written
- Code deployed before committing to git
- AIOS files left untracked at session end

---

## Key File Locations

| File | Purpose |
|---|---|
| `START_HERE.md` | Full session protocol — read if context is unclear |
| `closure/README.md` | All session closure entries — check at start of every session |
| `PROMPT_REGISTER.md` | All registered GPT prompts |
| `duplicate-risk/README.md` | Known duplicate file risks |
| `evidence/templates/` | Evidence and GPT review templates |
| `docs/aios-session-workflow-recommendation-2026-08-14.md` | Extended workflow reference |

---

## Tech Stack Reference

| Project | Stack | Hosting |
|---|---|---|
| Staff-requirements | Node.js, Neon Postgres, HTML pages | Vercel (`digital-marketing-member-pages`) |
| Staff-requirements-02 | Node.js, Neon Postgres | Vercel (`staff-requirements-02`) |
| dm-dashboard | React 19 + Vite (frontend), Python (backend) | Local via VS Code Dev Tunnel |
| Shopify themes | Liquid, CSS, JSON | Shopify (ledsone-uk, ledsone-fr, electricalsone) |
