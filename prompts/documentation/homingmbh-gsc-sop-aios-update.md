# Prompt — Client GSC Screenshot Training SOP — AIOS Documentation Update

**Category:** documentation
**Pattern Name:** client-gsc-sop-aios-update
**Created:** 2026-09-24
**First used for:** Homingmbh.de (Homin GmbH)
**Status:** ACTIVE

---

## Prompt

You are adding a Google Search Console Screenshot Training SOP to the Piranav AIOS documentation system.

**Scope:**
Documentation-only update. No production systems, Shopify themes, DNS, or Google Search Console settings are modified.

**Inputs required:**
- Source DOCX: screenshot-based GSC training SOP
- Client name and domain
- Shopify store handle

**Steps to execute:**

1. Run full recursive AIOS audit before creating anything
2. Search for existing GSC/SEO/training docs for this client
3. Confirm duplicate-risk assessment (GREEN / AMBER / RED)
4. Determine correct AIOS destination:
   - If `docs/[client]/` already exists → add `google-search-console/` subfolder
   - If no client folder exists → create minimum structure under `docs/`
5. Copy DOCX to destination (do not delete source)
6. Create `README.md` in destination folder (overview, SOP content list, trainee entry point, related docs)
7. Create or update `docs/[client]/README.md` as client index
8. Update `docs/seo/INDEX.md` with new client GSC section
9. Create evidence record: `evidence/piranav/[client]-gsc-sop-[date].md`
10. Create validation record: `validation/piranav/[client]-gsc-sop-[date].md`
11. Save prompt and update `PROMPT_REGISTER.md`
12. Add closure row to `closure/README.md`

**Security constraints:**
- Never store passwords, API keys, DNS credentials, IONOS credentials, or Google credentials
- If any credential appears in the source document, exclude it and note it was excluded
- Documentation describes procedures only

**Expected output:**
- SOP accessible at `docs/[client]/google-search-console/[filename].docx`
- Client index at `docs/[client]/README.md`
- SEO index updated
- Evidence, validation, closure, prompt all filed
- Source preserved in Downloads (not deleted)

---

## Reuse Notes

Apply this pattern for any client GSC SOP or screenshot-based training document.
Adapt the destination folder to match the existing client folder under `docs/`.
