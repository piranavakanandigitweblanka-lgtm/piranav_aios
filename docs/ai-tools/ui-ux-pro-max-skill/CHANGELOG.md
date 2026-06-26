# CHANGELOG — UI UX Pro Max Skill

---

## Purpose of This File

This file records all version changes to the UI UX Pro Max Skill documentation and source content. When the source guide (`shopify_seo_ui_ux_guide.md`) is updated, or when the skill's markdown documentation is revised, a version entry must be added here.

---

## Versioning Format

```
[MAJOR].[MINOR].[PATCH]

MAJOR — breaking structural change (domain added/removed, scoring model changed)
MINOR — new task entries added or existing entries substantially revised
PATCH — wording corrections, typo fixes, path updates, evidence log entries
```

---

## Version History

---

### v1.0.0 — 2026-06-26

**Type:** Initial integration  
**Author:** piranav  
**Reviewer:** Varmen (pending — AMBER)  
**Status:** ACTIVE

**Changes:**
- Created `docs/ai-tools/ui-ux-pro-max-skill/` folder in `piranav_aios`
- Created `README.md` — purpose, orientation, file index, known limitations
- Created `INSTALLATION.md` — onboarding steps, prerequisite checklist, path verification
- Created `ARCHITECTURE.md` — 8-domain map, all 28 task entries with importance scores, priority grid
- Created `SHOPIFY_WORKFLOW.md` — 8-step application workflow, Shopify CLI commands, common code patterns
- Created `CLAUDE_RULES.md` — 12 operating rules for Claude Code when using this skill
- Created `EVIDENCE.md` — integration evidence, source asset discovery log, duplicate risk entries
- Created `CHANGELOG.md` — this file
- Copied `uiux-skill-shopify-final.pptx` from `C:\Users\PC\Downloads\` into skill folder

**Source Content Version:**
- Source guide: `C:\Users\PC\Desktop\shopify_seo_ui_ux_guide.md`
- Source PowerPoint: `uiux-skill-shopify-final.pptx`
- Source guide last-modified date at integration: 2026-06-26 (date confirmed by file system)

**Known gaps at v1.0.0:**
- Varmen review not yet completed — AMBER status
- Shopify Plus-specific content not covered
- No skill usage evidence yet — first live session pending

---

## Template for Future Entries

```markdown
### v[X.Y.Z] — [YYYY-MM-DD]

**Type:** [patch / minor / major]
**Author:** piranav
**Reviewer:** Varmen
**Status:** [ACTIVE / DRAFT / DEPRECATED]

**Changes:**
- [What changed and why]

**Source Content Version:**
- Source guide modification date: [date]
- PowerPoint version: [filename or "unchanged"]

**Known gaps:**
- [Any outstanding issues at this version]
```

---

## Update Triggers

A new version entry is required when any of the following occur:

| Trigger | Version Bump |
|---|---|
| Source guide (`shopify_seo_ui_ux_guide.md`) content updated | MINOR |
| New domain or task added | MINOR |
| Existing task importance score changed | MINOR |
| Shopify platform change makes a tutorial outdated | PATCH or MINOR |
| Wording or typo fix in any markdown file | PATCH |
| New Claude rule added to `CLAUDE_RULES.md` | PATCH |
| PowerPoint replaced with a newer version | MINOR |
| Domain removed from scope | MAJOR |

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Maintained By | piranav |
| Reviewer | Varmen |
| Current Version | 1.0.0 |
| Last Updated | 2026-06-26 |
