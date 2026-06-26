# INSTALLATION — UI UX Pro Max Skill

---

## Purpose of This File

This document explains how to integrate the UI UX Pro Max Skill into a Mini-AIOS workspace so that it is queryable, evidence-backed, and usable from the first session.

---

## Prerequisites

Before using this skill, the following must be in place:

| Requirement | Location | Check |
|---|---|---|
| Mini-AIOS workspace initialised | `C:\Users\PC\Documents\piranav_aios\` | `README.md` exists |
| Session protocol understood | `START_HERE.md` | Read and followed |
| Evidence rules understood | `evidence/README.md` | Read |
| Duplicate-risk register understood | `duplicate-risk/README.md` | Read |
| Shopify CLI authenticated | Terminal | `shopify auth whoami` returns a store |
| Shopify MCP connected (optional, for GraphQL) | Claude Code settings | MCP server listed |

---

## Step 1 — Verify the Source Guide Exists

The queryable content source for this skill is:

```
C:\Users\PC\Desktop\shopify_seo_ui_ux_guide.md
```

Verify it is present before any session that uses this skill:

```powershell
Test-Path "C:\Users\PC\Desktop\shopify_seo_ui_ux_guide.md"
```

Expected output: `True`

If `False`: the source guide is missing. Do not proceed. Log the blocker in the session's closure entry and notify Varmen.

---

## Step 2 — Verify the Skill Folder Exists

```powershell
Test-Path "C:\Users\PC\Documents\piranav_aios\docs\ai-tools\ui-ux-pro-max-skill\README.md"
```

Expected output: `True`

If `False`: run the setup from the AIOS workspace root:

```powershell
New-Item -ItemType Directory -Force "C:\Users\PC\Documents\piranav_aios\docs\ai-tools\ui-ux-pro-max-skill"
```

Then re-clone or re-pull the `master` branch of `aios-piranav` to restore the folder.

---

## Step 3 — Verify the PowerPoint Is Present

```powershell
Test-Path "C:\Users\PC\Documents\piranav_aios\docs\ai-tools\ui-ux-pro-max-skill\uiux-skill-shopify-final.pptx"
```

Expected output: `True`

If `False`: copy from the original location:

```powershell
Copy-Item "C:\Users\PC\Downloads\uiux-skill-shopify-final.pptx" `
  "C:\Users\PC\Documents\piranav_aios\docs\ai-tools\ui-ux-pro-max-skill\uiux-skill-shopify-final.pptx"
```

**Note:** The PowerPoint is a binary asset. It cannot be queried by Claude Code. All queryable content is in `shopify_seo_ui_ux_guide.md` and `ARCHITECTURE.md`.

---

## Step 4 — Read the Architecture Map

Before applying the skill, read `ARCHITECTURE.md` to understand the 8 domains and their task scoring. This replaces reading the full source guide every session — use the source guide only when you need the full checklist or tutorial for a specific task.

---

## Step 5 — Read the Claude Rules

Before Claude Code applies any fix using this skill, `CLAUDE_RULES.md` must be read in full. These rules govern how the skill is applied in AIOS sessions.

---

## Step 6 — Register Usage in Evidence

Every session that applies this skill must:

1. Log the applied task in `evidence/README.md` under the Evidence Index.
2. Record the importance score of the task applied.
3. Link to the fix report or validation file created.

---

## Onboarding Checklist for a New Developer

- [ ] Read `README.md` (this folder)
- [ ] Read `START_HERE.md` (AIOS root)
- [ ] Verify `shopify_seo_ui_ux_guide.md` is present on this machine
- [ ] Read `ARCHITECTURE.md` — understand the 8 domains
- [ ] Read `CLAUDE_RULES.md` — understand operating rules
- [ ] Read `SHOPIFY_WORKFLOW.md` — understand the execution workflow
- [ ] Run `shopify auth whoami` — confirm Shopify CLI is authenticated
- [ ] Complete at least one practice task and log evidence before working on production

---

## Known Limitations

- This skill is tied to the machine at `C:\Users\PC`. If deployed on a new machine, the source guide path must be updated.
- The Shopify CLI authentication is per-machine and per-store. Re-authentication may be required after OAuth expiry (see `handover/shopify-mcp-reconnect.md`).
- If Shopify releases breaking theme API changes, the tutorials in the source guide may become outdated. Version bump required in `CHANGELOG.md`.

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Installed By | piranav |
| Reviewer | Varmen |
| Install Date | 2026-06-26 |
