# Prompt: Avasam UK Stock CSV Tool — Phase 1 Discovery, Git Safety, AIOS Organisation & Architecture Review

## Registered
2026-10-27

## Category
dm-dashboard / discovery

## Owner
Piranav

## Coordinator
Varmen

## Purpose
Discovery-only phase before building an Avasam UK Stock page in the DM Dashboard.
Covers: AIOS asset discovery, dashboard architecture audit, git safety check,
database/MCP integration audit, UAM review, and scoping the CSV upload/download page.

## What This Prompt Covers
1. AIOS asset discovery — find existing Avasam workflow, SQL, validation, evidence
2. DM Dashboard architecture audit — framework, routing, auth, file upload, DB patterns
3. Git safety — report branch, remote, working tree status, pull readiness
4. Database/MCP integration — confirm runtime DB connection vs Claude Code MCP
5. Page scope — CSV upload → SKU match → UK stock retrieval → CSV download
6. Documentation and closure per AIOS protocol

## What This Prompt Does NOT Do
- Does not implement the page
- Does not pull git changes
- Does not modify application code
- Does not create new roles or permissions

## Key Constraints
- Reuse existing Avasam SQL + SKU matching logic (sku + sku_original dual match)
- UK warehouse only: `warehouse_location = 'UK'`
- Never overwrite uploaded file
- Never silently convert missing stock to zero
- Backend DB access read-only
- UAM: reuse existing dashboard roles

## Related Prompt
`prompts/reusable/avasam-uk-stock-update-workflow.md` — original CLI stock update workflow
`prompts/reusable/avasam-uk-stock-retrieve-extended-output-2026-10-27.md` — extended output run 2026-10-27

## Expected Output
Discovery report covering sections A–J as per the task prompt.
