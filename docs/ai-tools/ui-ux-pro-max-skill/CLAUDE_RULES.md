# CLAUDE RULES — UI UX Pro Max Skill

---

## Purpose of This File

These rules govern how Claude Code must behave when applying the UI UX Pro Max Skill inside a piranav Mini-AIOS session. They are mandatory. They cannot be overridden by chat instructions from piranav — only Varmen can update these rules.

---

## Rule 1 — Search Before Acting

Before applying any fix from this skill, Claude Code must:

1. Check whether the same fix was already attempted in a prior session (`evidence/README.md` Evidence Index).
2. Check whether a conflict exists in `duplicate-risk/README.md`.
3. Only if no prior fix exists: proceed with the task.

**If a prior fix exists:** link to it in the closure entry and explain why a second fix is needed. Do not silently redo completed work.

---

## Rule 2 — Score Before Prioritising

When multiple tasks are available, Claude Code must prioritise by importance score (descending, 25 → 18). If Varmen has specified a different priority order in a session instruction, follow that order and log it in the closure entry.

Never self-select a lower-scored task over a 25/25 task without documented justification.

---

## Rule 3 — Checklist Before Code

Claude Code must read and acknowledge the relevant checklist from the source guide (`shopify_seo_ui_ux_guide.md`) before writing any Liquid, CSS, or JS changes.

If the checklist cannot be read (source guide missing), stop the task. Log the blocker. Do not proceed from memory.

---

## Rule 4 — Minimum Change Principle

Apply only the change required by the task. Do not:
- Refactor surrounding code
- Rename variables or reorganise files
- Add comments explaining the change (comments belong in the evidence file, not the code)
- Apply fixes from a different domain unless that domain was explicitly approved for this session

---

## Rule 5 — No Production Push Without Validation

Claude Code must not push to a live Shopify theme (`shopify theme push --live` or equivalent) unless:

1. The fix has been validated on a development theme or local preview.
2. A validation record exists in `validation/` or `evidence/fixes/`.
3. The closure entry is written and PASS-confirmed.

If any of these are missing, stop before pushing and log the status.

---

## Rule 6 — Evidence is Mandatory

Every task closed using this skill must have:

1. An evidence file at `evidence/fixes/[task-slug]-[date].md`
2. An index row in `evidence/README.md`
3. A closure entry in `closure/README.md`

A task without evidence cannot be marked PASS. If a session ends before evidence is written, mark the closure entry FAIL with reason "evidence not written" and carry it forward to the next session.

---

## Rule 7 — Do Not Duplicate the Source Guide

The source guide (`shopify_seo_ui_ux_guide.md`) is not to be copied, paraphrased at length, or reproduced inside evidence files. Evidence files record what was found and what was changed — not the full tutorial text. Reference the source guide by section name if needed.

---

## Rule 8 — Domain Boundaries

Each task belongs to exactly one domain. Do not combine domain work into a single task closure entry unless Varmen has explicitly approved a multi-domain sprint. This prevents audit trail confusion.

---

## Rule 9 — Importance Score Must Be Stated in Evidence

Every evidence file must state the importance score of the task applied (e.g., `Importance Score: 25/25 — Critical`). This lets Varmen verify priority decisions without re-reading the source guide.

---

## Rule 10 — Out-of-Scope Escalation

If the skill's tutorial or checklist requires accessing a file or store that is outside `piranav_aios` or the approved theme path (`C:\Users\PC\Downloads\uk 2026.06.09\`):

1. Stop.
2. Log the out-of-scope requirement in `handover/README.md`.
3. Wait for Varmen approval before proceeding.

---

## Rule 11 — Binary Asset Rule

The PowerPoint (`uiux-skill-shopify-final.pptx`) is a binary file. Claude Code must not:
- Attempt to read or parse it
- Use it as a source for task content
- Report its contents without human review

Use `ARCHITECTURE.md` and `shopify_seo_ui_ux_guide.md` for all queryable content.

---

## Rule 12 — Version Drift Alert

If piranav or Varmen updates the source guide (`shopify_seo_ui_ux_guide.md`) without bumping the version in `CHANGELOG.md`, Claude Code must flag the drift in the next session's closure entry and prompt for a version bump.

Symptom: source guide has a different modification date than the `CHANGELOG.md` last-updated entry.

---

## Summary Table

| Rule | Trigger | Action |
|---|---|---|
| 1 — Search first | Before any fix | Check evidence index |
| 2 — Score first | Multiple tasks available | Highest score wins |
| 3 — Checklist first | Before writing code | Read source guide checklist |
| 4 — Minimum change | Any code edit | Change only what is required |
| 5 — No push without validation | Before `shopify theme push` | Validate + evidence must exist |
| 6 — Evidence mandatory | At task close | Three evidence artefacts required |
| 7 — No source duplication | Any evidence file | Reference, do not reproduce |
| 8 — Domain boundaries | Multi-domain work | One domain per closure entry |
| 9 — Score in evidence | Any evidence file | State importance score |
| 10 — Out-of-scope escalation | Any out-of-scope file | Stop, log, wait for approval |
| 11 — Binary asset | PowerPoint file | Do not parse; use markdown sources |
| 12 — Version drift | Source guide updated | Flag in closure; prompt for bump |

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Authored | piranav |
| Reviewer | Varmen |
| Last Updated | 2026-06-26 |
| Rule Count | 12 |
