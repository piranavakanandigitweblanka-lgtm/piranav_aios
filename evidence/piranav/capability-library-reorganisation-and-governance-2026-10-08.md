# Evidence: Capability Library Reorganisation + Governance — 2026-10-08

**Session Date:** 2026-10-08
**Prepared by:** Claude Code
**Status:** COMPLETE — not yet committed

---

## Task 1: capability/INDEX.md Created

- File created: `capability/INDEX.md`
- Format: date-wise monthly sections (## 2026-07 through ## 2026-10)
- Covers: 80 capability files across all staff (piranav, sajeepan, theekshy, sonya)
- Fields per row: Date, Capability, Path, Status, Evidence, Last Updated, Reuse Level
- v3.0 (final): organisation note updated to reflect physical move

---

## Task 2: Physical Reorganisation of 80 Capability Files

**Method:** Individual `mv` commands batched by month (July, August, September, October) via Bash tool.

**Destination structure:** `capability/2026/MM/YYYY-MM-DD/filename.md`

**Files moved:** 80 capability files from 4 old owner-subfolders:
- `capability/piranav/` → 47 files moved
- `capability/sajeepan/` → 12 files moved
- `capability/sonya/` → 2 files moved
- `capability/theekshy/` → 19 files moved

**Old folders deleted:** `piranav/`, `sajeepan/`, `sonya/`, `theekshy/` confirmed empty then removed with `rm -rf`.

**Special date cases (no date in filename — date sourced from file content):**
| Old Path | New Path | Date Source |
|---|---|---|
| `sonya/requirement_3_capability.md` | `2026/07/2026-07-08/` | File content: "Date: 2026-07-08" |
| `piranav/shopify-customer-google-signin.md` | `2026/09/2026-09-24/` | Evidence path |
| `piranav/ads-product-scope-admin-page.md` | `2026/09/2026-09-25/` | File content |
| `piranav/ip-infringement-investigation-and-cease-desist.md` | `2026/10/2026-10-08/` | File content: Created 2026-10-08 |
| `semrush-backlinks-pipeline.md` | `2026/09/2026-09-21/` | File content: Created 2026-09-21 |

---

## Task 3: Reference Updates (211 replacements across 41 files)

**Method:** Python script (`scratchpad/fix_refs.py`) — bulk search-replace of old capability paths.
- Scanned: 1,033 .md files in piranav_aios
- Files modified: 41
- Replacements made: 211

**Residual references left intentionally unchanged:**
| File | Reason |
|---|---|
| `CLAUDE.md` | Folder-level conceptual description — not a live file link |
| `capability/CAPABILITY_DATEWISE_AUDIT.md` | Historical snapshot — migration note added instead |
| Historical closure/evidence files | Snapshot data — not live file links |

---

## Task 4: Automatic Capability Update Governance

**Action:** EXTEND two existing prompt files — no new file created.

### Files Modified:
1. **`prompts/closure/capability-log-extraction.md`** — Part 2 added (Capability Document Decision)
   - 5-way classification: NEW / EXTEND / UPDATE / NO CAPABILITY CHANGE / REVIEW REQUIRED
   - 9 automatic trigger conditions
   - REUSE → EXTEND → UPDATE → MERGE → CREATE decision order
   - Date preservation rule (4-level priority, never use filesystem date)
   - INDEX update rule (mandatory after every file action)
   - Evidence rule (evidence path + git commit hash required)
   - 7-question queryability test (all must pass)
   - Capability Update Check closure block format (9 fields)
   - GPT output format table
   - Part 2 Pass/Fail rule

2. **`prompts/closure/daily-session-closure.md`** — Informal "Capability Log" replaced with formal "Capability Update Check"
   - 9-field structured block: Decision, Name, Path, Evidence, Reason, INDEX Updated, Queryability, Reviewer, Next Action
   - NO CHANGE path: one-sentence reason format

3. **`PROMPT_REGISTER.md`** — Row added for `capability-document-update-governance`

---

## Queryability Assessment

| Item | Queryable? | Notes |
|---|---|---|
| capability/INDEX.md | YES | 80 files indexed by month |
| New date-wise folder structure | YES | Verifiable via `ls capability/2026/` |
| Reference updates | YES | Grep for old paths returns no live links |
| Governance rules | YES | Findable via `prompts/closure/capability-log-extraction.md` Part 2 |
| Daily closure format | YES | `prompts/closure/daily-session-closure.md` updated |
| PROMPT_REGISTER row | YES | Row added 2026-10-08 |

---

## Files Created or Modified This Session

| File | Action |
|---|---|
| `capability/INDEX.md` | Created (v1.0 → v3.0) |
| `capability/2026/` (80 files) | Physically moved from owner-subfolders |
| `capability/CAPABILITY_DATEWISE_AUDIT.md` | Migration note added |
| `prompts/closure/capability-log-extraction.md` | Part 2 added |
| `prompts/closure/daily-session-closure.md` | Capability Update Check section added |
| `PROMPT_REGISTER.md` | New row added |
| `evidence/piranav/capability-library-reorganisation-and-governance-2026-10-08.md` | Created (this file) |

---

## Git Status
- Not committed — pending Piranav instruction to commit and push
- Account to select: `piranavakanandigitweblanka-lgtm`
