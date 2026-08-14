# Recommended Claude Session Workflow — AIOS Improvement
**Date:** 2026-08-14
**Prepared by:** Claude Code (recovery audit)
**Status:** RECOMMENDATION ONLY — do not implement automatically

---

## Problem This Addresses

The Aug 6–14 audit identified 19 tasks completed in sessions that did not produce AIOS closure entries. Key failure modes:

1. Claude completes work in a session but session ends without writing closure entry
2. Work is deployed live without being committed to git first (leading to the Staff ID Performance recovery incident)
3. GPT review is done verbally in chat but not saved as an evidence file
4. Capability files are created but left untracked in git

---

## Recommended Permanent Session Workflow

### SESSION START
```
1. READ closure/README.md — check OPEN items from previous session
2. READ handover/README.md — check for coordinator notes
3. RUN: git status (main AIOS repo)
4. RUN: git status (SR-01 repo if session touches it)
5. IDENTIFY any untracked or unstaged files from previous session
6. REPORT to GPT: any uncommitted work, merge conflicts, open blockers
```

### SCOPE CHECK
```
7. CONFIRM approved task from GPT — what is in scope, what is out
8. SEARCH for existing AIOS asset that covers the task
9. SEARCH PROMPT_REGISTER.md for existing prompt
10. SEARCH closure/README.md for existing closure entry
11. CONFIRM no duplicate truth risk before starting
```

### EXECUTION
```
12. EXECUTE approved task (implement, document, or investigate)
13. COMMIT code changes before deploying (NEVER deploy uncommitted code)
14. GIT COMMIT each logical change — do not batch unrelated changes
```

### EVIDENCE
```
15. CREATE: evidence file for the work done
16. CREATE: validation notes (browser test results, DB query results)
17. SAVE: any GPT review to evidence/[person]/[req-id]-gpt-review-[date].md
18. CONFIRM: evidence path is accessible from piranav_aios/ root
```

### CLOSURE CANDIDATE
```
19. CREATE: closure file in closure/[person]/[req-id]-[date].md
20. UPDATE: closure/README.md — add row for this session
21. UPDATE: PROMPT_REGISTER.md if a new reusable prompt was used
22. CHECK: capability file created or updated if applicable
23. CHECK: all new files are tracked (git status — no untracked AIOS files)
```

### GPT REVIEW
```
24. PRESENT: closure candidate to GPT for review
25. GPT SAVES: review to evidence/[person]/[req-id]-gpt-review-[date].md
26. GPT DECIDES: PASS / FAIL / PARTIAL
27. If FAIL: create follow-up task before ending session
```

### SESSION END
```
28. GIT STATUS: confirm nothing untracked or unstaged
29. COMMIT: any new AIOS documentation files
30. PUSH: if approved by Piranav
31. FINAL CHECK: closure/README.md has a row for every task in this session
```

---

## Critical Rules

### Rule 1: Commit Before Deploy
**NEVER deploy a Vercel project without first committing all changes to git.**
Rationale: manual `vercel --prod` from a stale local copy silently overwrites the live deployment. This caused the Staff ID Performance recovery incident (Aug 14).

### Rule 2: AIOS Files Must Be Tracked
After creating any AIOS file (capability, closure, evidence, validation), run `git status` and ensure the file appears in the staging area. An untracked AIOS file can be lost if the workspace is cleared.
Example of failure: `capability/piranav/shopify-shipping-rate-update-2026-08-11.md` was left untracked.

### Rule 3: One Closure Row Per Task Per Session
Every task completed in a session (code, documentation, investigation, fix) must have one closure row in `closure/README.md` before the session is considered done. If it cannot be closed, mark it OPEN with a blocker.

### Rule 4: GPT Review Evidence Must Be Saved
A GPT review that exists only in a chat session is NOT evidence. Use the template at `evidence/templates/gpt-review-of-claude-output-template.md` and save the review to the evidence folder.

### Rule 5: No PASS Without Evidence
A closure row is PASS only when:
- An evidence path exists and is accessible
- A git commit hash is recorded (where applicable)
- Queryability is YES
A row without these is automatically PARTIAL or FAIL.

---

## What NOT to Automate

Do NOT automatically configure Claude Code hooks to enforce this workflow. Claude session behaviour changes should be made via GPT prompt design, not harness configuration, unless Piranav explicitly approves a hook change.

---

## Recommended Next Implementation Step

GPT to design a reusable "session-end closure prompt" that Claude runs at the end of every session. This prompt should:
1. Enumerate all files changed in the session
2. Check git status for untracked files
3. Generate closure entries in the correct format
4. Identify GPT review gaps

Save the prompt at: `prompts/closure/session-end-closure-prompt.md`
Register in: `PROMPT_REGISTER.md`
