# CLAUDE RULES — UI UX Pro Max Skill

---

## Purpose of This File

These rules govern how Claude Code must behave when using the UI UX Pro Max Skill inside a piranav Mini-AIOS session. They are mandatory. Only Varmen can update them.

---

## Rule 1 — Search Before Acting

Before applying any design recommendation, Claude Code must:

1. Check whether the same design system was already applied in a prior session (`evidence/README.md` Evidence Index).
2. Check `duplicate-risk/README.md` for conflicts.
3. Only if no prior application exists: proceed.

If a prior application exists, link to it and explain why a new application is needed.

---

## Rule 2 — Use the Skill Output, Not Memory

Claude Code must not invent UI styles, colour palettes, or font pairings from training memory. All design recommendations must come from the skill's search output (from `search.py`) or the Shopify SEO reference checklist. If neither has been queried yet this session, stop and ask piranav to run the search command.

---

## Rule 3 — Two Layers Are Distinct

The upstream skill (Layer 1) and the Shopify SEO reference (Layer 2) are separate. Claude Code must not:
- Claim a design recommendation came from the Shopify SEO guide when it came from the skill search
- Apply SEO checklist tasks and call them "design system" output

Each evidence entry must state which layer was used.

---

## Rule 4 — Minimum Change Principle

Apply only the design system elements the skill recommends. Do not:
- Refactor theme files unrelated to the recommended changes
- Change fonts, colours, or layout not in the skill output
- Add effects or animations not recommended by the style domain

---

## Rule 5 — No Live Push Without Validation

Claude Code must not push to a live Shopify theme unless:

1. Changes were tested on a development theme (`shopify theme dev`).
2. A validation record exists (desktop + mobile + keyboard nav).
3. The Shopify SEO reference checklist (minimum: Domains 5 and 8) is PASS.
4. The closure entry is written.

---

## Rule 6 — Evidence is Mandatory

Every task closed using this skill must have:

1. A design report at `evidence/fixes/design-system-[store]-[date].md`
2. The skill's search query and output recorded in that report
3. An index row in `evidence/README.md`
4. A closure entry in `closure/README.md`

A task without these three artefacts cannot be marked PASS.

---

## Rule 7 — Do Not Reproduce CSV Data

The skill's CSV files (styles.csv, colors.csv, etc.) are not to be copied, quoted at length, or reproduced inside evidence files. Record only the specific recommendation applied (style name, palette name, hex values). Reference the domain and version.

---

## Rule 8 — Domain Must Be Stated

Every search query must specify a domain (`--domain product`, `--domain style`, etc.). Claude Code must not accept undifferentiated search output. If a query was run without a domain flag, ask piranav to re-run it with the correct domain.

---

## Rule 9 — Anti-Patterns Must Be Checked

Every design system application must include a review of the `--domain ux` output for the product category. Anti-patterns flagged by the skill are blockers — they must be resolved before marking the task PASS.

---

## Rule 10 — Shopify SEO Domains 5 and 8 Are Mandatory After Design Changes

Any change to colours, typography, layout, or UI style must be followed by:
- **Domain 5 checklist** (Design & Layout) from `shopify_seo_ui_ux_guide.md`
- **Domain 8 checklist** (Accessibility — colour contrast, ARIA, keyboard nav)

These are mandatory. They cannot be skipped even if the design task seems small.

---

## Rule 11 — Out-of-Scope Escalation

If the skill's output requires accessing a store, theme file, or path outside the approved boundary:

1. Stop.
2. Log in `handover/README.md`.
3. Wait for Varmen approval.

---

## Rule 12 — Binary Assets

The PowerPoint (`uiux-skill-shopify-final.pptx`) and the CSV data files in `data/` are not queryable by Claude Code directly. Use `ARCHITECTURE.md` and the Python `search.py` output (run by piranav) for all queryable content.

---

## Rule 13 — Version Must Match

Before using the skill, Claude Code must confirm the installed version matches the version tracked in `CHANGELOG.md`. If the installed version is newer, flag it in the session closure entry and prompt for a version bump.

Check installed version:

```bash
npm info ui-ux-pro-max-cli version
```

---

## Rule 14 — Layer 2 Does Not Override Layer 1

The Shopify SEO reference (Layer 2) provides validation checklists. It does not override design system recommendations from the upstream skill (Layer 1). If a conflict arises (e.g., the skill recommends a colour that fails WCAG contrast), the skill recommendation is adjusted — not ignored — to meet the Layer 2 standard.

---

## Summary Table

| Rule | Trigger | Action |
|---|---|---|
| 1 — Search first | Before any design work | Check evidence index |
| 2 — Use skill output | Any design recommendation | Run search.py first |
| 3 — Two layers distinct | Evidence writing | State which layer was used |
| 4 — Minimum change | Any theme edit | Change only what skill recommends |
| 5 — No live push without validation | Before push | Dev theme + checklist + closure |
| 6 — Evidence mandatory | At task close | 3 artefacts required |
| 7 — No CSV reproduction | Evidence files | Name only, no copy |
| 8 — Domain must be stated | Any search | `--domain` flag required |
| 9 — Anti-patterns checked | Every design session | `--domain ux` output reviewed |
| 10 — Domains 5 + 8 mandatory | After design changes | SEO reference checklist PASS |
| 11 — Out-of-scope escalation | Out-of-boundary file | Stop, log, wait |
| 12 — Binary assets | PowerPoint / CSV | Do not parse; use markdown + search output |
| 13 — Version must match | Session start | Check npm version vs CHANGELOG |
| 14 — Layer 2 adjusts Layer 1 | Contrast / accessibility conflict | Adjust recommendation, don't discard |

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Authored | piranav |
| Reviewer | Varmen |
| Last Updated | 2026-06-26 |
| Rule Count | 14 |
