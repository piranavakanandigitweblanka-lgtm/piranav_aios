# START HERE — piranav Mini-AIOS Session Protocol

**Read this at the start of every session. Do not skip.**

---

## What This Is

This document defines the mandatory workflow for every Claude Code session inside piranav's Mini-AIOS workspace. It covers roles, session order, evidence requirements, duplicate prevention, and closure rules.

---

## Role Split

### GPT is the brain
- GPT designs tasks, reviews outputs, approves scope changes, and confirms evidence quality
- GPT does NOT execute file writes, run git commands, or make production changes

### Claude Code is the worker
- Claude Code reads, writes, and queries files inside `C:\Users\PC\Documents\piranav_aios`
- Claude Code runs git commands when Piranav instructs — commit, push, status, log
- Claude Code does NOT make decisions — it executes approved instructions
- Claude Code does NOT change files outside `piranav_aios` without Piranav approval

### Piranav is the owner
- Piranav instructs Claude to commit, push, or deploy
- Piranav confirms scope changes and approves work before closure is marked PASS
- Piranav's instruction replaces the old "wait for Varmen" rule

---

## Repository Map

| Folder | GitHub | Notes |
|---|---|---|
| `piranav_aios` (main) | https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios | Branch: main |
| `Staff-requirements-02` | Same repo as above (subfolder) | Same remote |
| `Staff-requirements` (SR-01) | https://github.com/digitalmarketing69140951-sys/Staff-requirements | Separate repo, separate account |

---

## Standing Rules — Always Active

### 1. GPT Prompt Capture Rule (permanent — effective 2026-07-01)
Every reusable GPT prompt must be saved to `prompts/` **before** the task is executed.
- Search `PROMPT_REGISTER.md` first — update existing if equivalent exists
- Save new prompt → then execute → then update `PROMPT_REGISTER.md`
- Full rule: `prompts/GPT_CAPTURE_RULE.md`
- Skip this = **session FAIL**

### 2. Commit Before Deploy (permanent — added 2026-08-14)
**Never deploy to Vercel without first committing all changes to git.**
A manual `vercel --prod` from a stale local copy silently overwrites live production with no error.
This caused the Staff ID Performance recovery incident (Aug 2026) — code was lost from live and had to be recovered from a Vercel deployment snapshot.

### 3. All AIOS Files Must Be Git-Tracked
After creating any capability, closure, evidence, or validation file — run `git status` and confirm the file is tracked before the session ends. An untracked AIOS file will be lost if the workspace is cleared.

### 4. No Duplicate Truth
Before saving any file, check whether it already exists. If an existing file covers the same content, extend it — do not create a parallel copy. Log confirmed duplicate risks in `duplicate-risk/README.md`.

---

## Session Order — Follow Every Time

### Step 1 — Session start checks
- Read `closure/README.md` — check OPEN items from previous session
- Run `git status` — identify any untracked or unstaged files left over
- Report any uncommitted work or blockers before starting new work

### Step 2 — Search existing assets first
Before creating any file:
- Search inside `piranav_aios/` for an existing equivalent
- Check `PROMPT_REGISTER.md` for existing prompt
- If an existing file can be extended, extend it — do not create a new one

### Step 3 — Confirm scope
- Confirm the task is inside the approved boundary
- If the task requires touching files outside `piranav_aios`, get Piranav approval first

### Step 4 — Do the work
- Execute the approved task
- **Commit code to git before deploying** (Rule 2 above)
- Save all Claude-generated output as `.md` files before the session ends

### Step 5 — Evidence
- Create an evidence file for the work done
- Create validation notes (browser test results, DB query results, screenshots)
- Save any GPT review using the template at `evidence/templates/gpt-review-of-claude-output-template.md`

### Step 6 — Closure
Every session must end with a closure entry in `closure/README.md`.

Required fields:
- Requirement ID
- Task
- Asset path
- Evidence path
- GitHub path / commit
- Queryability result YES / NO
- Blockers
- Next step
- PASS / FAIL / OPEN

**A session with no closure entry is a FAIL.**

### Step 7 — Git status check
Before ending:
- Run `git status` — confirm nothing untracked or unstaged
- Commit all new AIOS documentation files
- Push when Piranav instructs

---

## Unknown Developer Readiness

If a new developer, agent, or Claude session starts without this context:

1. Read `README.md` — identity, repo map, boundary
2. Read this file (`START_HERE.md`) — session protocol
3. Read `closure/README.md` — what has been completed and what is OPEN
4. Read `duplicate-risk/README.md` — known duplicate risks
5. Do NOT start writing files until steps 1–4 are complete

---

## Pass / Fail Rule

Session **PASSES** if all 7 steps followed, closure written, no untracked AIOS files at end.

Session **FAILS** if:
- Evidence missing at closure
- Duplicate truth created
- Closure not written
- Code deployed before committing to git
- AIOS files left untracked at session end

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Staff / Owner | Piranav |
| Coordinator / Reviewer | GPT (coordinator-facing LLM) |
| Last Updated | 2026-08-14 |

---

## Extended Workflow Reference

For the full recommended session workflow including deploy safety rules and GPT review procedure:
`docs/aios-session-workflow-recommendation-2026-08-14.md`
