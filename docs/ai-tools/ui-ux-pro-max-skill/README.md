# UI UX Pro Max Skill — AIOS Knowledge Asset

---

## Purpose

The UI UX Pro Max Skill is a structured, queryable knowledge base of Shopify SEO and UI/UX best practices integrated into piranav's Mini-AIOS workspace. It gives Claude Code and human reviewers a single, scored reference for every Shopify front-end task — from crawl error fixes to accessibility improvements — eliminating the need to re-derive standards from scratch each session.

This is a **read-and-apply** asset. Claude Code queries it when auditing or fixing a Shopify theme. Varmen references it when reviewing piranav's output quality.

---

## Quick Orientation

| Field | Value |
|---|---|
| Asset Type | Queryable knowledge base |
| Domain | Shopify SEO + UI/UX |
| Source Guide | `C:\Users\PC\Desktop\shopify_seo_ui_ux_guide.md` |
| Source PowerPoint | `docs/ai-tools/ui-ux-pro-max-skill/uiux-skill-shopify-final.pptx` |
| Version | 1.0.0 |
| Status | ACTIVE |
| Owner | piranav |
| Reviewer | Varmen |
| Integrated | 2026-06-26 |

---

## What This Skill Covers

The skill organises all Shopify work into **8 domains**, each with scored tasks (out of 25):

| Domain | Task Areas | Top-Scored Task |
|---|---|---|
| 1. Technical SEO | Crawl errors, robots.txt, canonicals, hreflang | Canonical tags (25/25) |
| 2. On-Page SEO | Meta titles, headings, alt text, schema, duplicate content | Schema / structured data (24/25) |
| 3. Performance — Core Web Vitals | Page speed, image loading, unused JS/CSS, third-party scripts | LCP / CLS / INP (25/25) |
| 4. Shopify-Specific SEO | URL structure, pagination, faceted nav, blog SEO | Collection URL structure (25/25) |
| 5. Design & Layout | Homepage/collection/product layouts, mobile, CTA, typography | Mobile responsiveness (25/25), CTA (25/25) |
| 6. Conversion Optimisation (CRO) | Cart/checkout flow, trust signals, sticky header, upsell UI | Cart & checkout flow (25/25) |
| 7. Theme Customisation | Liquid edits, custom sections/blocks, navigation, header/footer | Navigation restructuring (24/25) |
| 8. Accessibility | Colour contrast, keyboard navigation, ARIA labels | Colour contrast (22/25) |

Each task entry contains:
- Explanation
- Importance Score (out of 25)
- Best Practice
- Guideline
- Checklist
- Shopify Tutorial (step-by-step)
- Do's and Don'ts

---

## How to Use This Skill

1. **Identify the task type** — match the current Shopify problem to one of the 8 domains above.
2. **Query the source guide** — open `shopify_seo_ui_ux_guide.md` or reference the relevant section in `ARCHITECTURE.md`.
3. **Apply the checklist** — verify each checklist item before closing the task.
4. **Record evidence** — every applied fix must be logged in `evidence/README.md` per AIOS rules.
5. **Follow Claude Rules** — see `CLAUDE_RULES.md` for how Claude Code must handle this skill.

For Shopify-specific execution steps, see `SHOPIFY_WORKFLOW.md`.

---

## Files in This Folder

| File | Purpose |
|---|---|
| `README.md` | This file. Overview, purpose, orientation. |
| `INSTALLATION.md` | How to onboard this skill into AIOS. |
| `ARCHITECTURE.md` | Domain structure, task scoring map, content model. |
| `SHOPIFY_WORKFLOW.md` | Step-by-step workflow for applying this skill to a Shopify store. |
| `CLAUDE_RULES.md` | Rules Claude Code must follow when using this skill. |
| `EVIDENCE.md` | Evidence log for this skill's integration and usage. |
| `CHANGELOG.md` | Version history. |
| `uiux-skill-shopify-final.pptx` | Source PowerPoint presentation for this skill. |

---

## Official GitHub

| Field | Value |
|---|---|
| Repository | `https://github.com/piranavakanandigitweblanka-lgtm/aios-piranav` |
| Branch | `master` |
| Path in repo | `Documents/piranav_aios/docs/ai-tools/ui-ux-pro-max-skill/` |

---

## Known Limitations

- The source guide (`shopify_seo_ui_ux_guide.md`) is not versioned — any updates to it will not be reflected here automatically. See `CHANGELOG.md` for version tracking.
- Importance scores (out of 25) are static — they were set at the time the source guide was authored and may not reflect future Shopify platform or Google algorithm changes.
- The PowerPoint (`uiux-skill-shopify-final.pptx`) is a binary file and cannot be searched or queried by Claude Code. Use `ARCHITECTURE.md` and the source guide for queryable content.
- This skill does not cover Shopify Plus-specific features (Scripts, Checkout UI Extensions, B2B).

---

## Next Steps

1. Add evidence entries to `EVIDENCE.md` after first application in a live Shopify session.
2. Link this skill to the relevant closure entry each time it is applied.
3. Varmen to review and confirm PASS status on first use.
4. If the source guide is updated, bump the version in `CHANGELOG.md`.

---

## Pass / Fail Rule

This skill PASSES review if:
- A developer can understand its purpose and apply it using only this folder's documentation.
- Every application of the skill produces an evidence entry in `evidence/README.md`.

This skill FAILS review if:
- Fixes are applied without referencing the checklist from this skill.
- No evidence entry exists after a skill-guided task is completed.
