# UI UX Pro Max Skill — AIOS Knowledge Asset

---

## Purpose

The UI UX Pro Max Skill is an AI-powered design intelligence system integrated into piranav's Mini-AIOS workspace. It gives Claude Code a searchable database of UI styles, colour palettes, font pairings, chart types, UX guidelines, and industry-specific reasoning rules — enabling it to generate complete, tailored design systems in seconds.

This is an **active skill**, not a static reference. Claude Code queries it to recommend design patterns and generate design systems matched to the product category and tech stack. Varmen references it when reviewing design decisions.

---

## Quick Orientation

| Field | Value |
|---|---|
| Asset Type | AI-powered design intelligence skill |
| Upstream Author | NextLevelBuilder |
| Official GitHub | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill |
| Homepage | https://uupm.cc |
| License | MIT |
| Upstream Version | 2.8.8 (released 2026-06-26) |
| AIOS Docs Version | 2.0.0 |
| Status | ACTIVE |
| Owner | piranav |
| Reviewer | Varmen |
| Docs Last Updated | 2026-06-26 |

---

## What This Skill Contains

| Asset | Count | Description |
|---|---|---|
| UI Styles | 84 | Glassmorphism, Claymorphism, Brutalism, Bento Grid, AI-Native, Dark Mode, and more |
| Colour Palettes | 161 | Industry-aligned palettes matched to product categories |
| Font Pairings | 73 | Heading + body font combinations by industry and style |
| Chart Types | 25 | Data visualisation patterns by use case |
| UX Guidelines | 99 | Best practices, anti-patterns, and accessibility rules |
| Tech Stacks | 17 | React, Next.js, Vue, Nuxt, Svelte, SwiftUI, React Native, Flutter, HTML+Tailwind, shadcn/ui, and more |
| Product Categories | 161 | Industry-specific reasoning rules for automatic pattern matching |

---

## How the Skill Works

1. You describe the project (e.g. "landing page for a beauty spa").
2. The skill's reasoning engine matches it against 161 product categories.
3. It recommends the optimal UI style, colour palette, font pairing, and effects.
4. It flags anti-patterns to avoid.
5. You apply the generated design system to the Shopify theme or front-end stack.

The search engine uses BM25 ranking + regex matching across 7 queryable domains:

| Domain | What It Returns |
|---|---|
| `product` | Industry-matched design patterns for the product category |
| `style` | Recommended UI styles (Glassmorphism, Minimalism, etc.) |
| `color` | Colour palette recommendations |
| `typography` | Font pairing recommendations |
| `landing` | Landing page layout and section patterns |
| `chart` | Data visualisation patterns |
| `ux` | UX guidelines and anti-patterns |

---

## How to Use This Skill in a Session

1. **Identify the design problem** — product category, target audience, tech stack.
2. **Run the search** — see `SHOPIFY_WORKFLOW.md` for the exact command.
3. **Apply the recommended system** — style + palette + font + UX rules.
4. **Validate against UX guidelines** — run the pre-delivery checklist (99 rules).
5. **Record evidence** — log every application in `evidence/README.md`.
6. **Follow Claude Rules** — see `CLAUDE_RULES.md`.

---

## Files in This Folder

| File | Purpose |
|---|---|
| `README.md` | This file. Overview, orientation, version. |
| `INSTALLATION.md` | How to install the upstream skill and integrate it into AIOS. |
| `ARCHITECTURE.md` | Data files, search domains, capability map. |
| `SHOPIFY_WORKFLOW.md` | Workflow for applying design system output to Shopify themes. |
| `CLAUDE_RULES.md` | Rules Claude Code must follow when using this skill. |
| `EVIDENCE.md` | Evidence log for integration and usage. |
| `CHANGELOG.md` | Version history for AIOS docs and upstream tracking. |
| `uiux-skill-shopify-final.pptx` | Local PowerPoint reference asset. |

---

## Supplementary Shopify SEO Reference

The file `C:\Users\PC\Desktop\shopify_seo_ui_ux_guide.md` is a separate Shopify-specific SEO and UI/UX checklist (28 tasks, importance-scored). It is NOT part of the upstream skill — it is a local reference used alongside it. See `ARCHITECTURE.md` for the distinction.

---

## Known Limitations

- The skill's CSV databases are installed on the local machine — Claude Code cannot query them directly without the Python search script being available.
- The upstream skill version (2.8.8) and numbers (84 styles, 73 fonts, etc.) may advance with new releases — check `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/releases` and bump `CHANGELOG.md` when they do.
- Tech stack coverage is optimised for web frameworks. Native mobile (SwiftUI, Flutter) and React Native support exists but is less detailed.
- The Shopify SEO checklist (`shopify_seo_ui_ux_guide.md`) covers performance and technical SEO tasks that the upstream skill does not.

---

## Next Steps

1. Install the upstream skill locally — see `INSTALLATION.md`.
2. Run the first search query and log output in `EVIDENCE.md`.
3. Varmen to confirm PASS status on first applied session.
4. Track upstream releases at https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/releases.

---

## Pass / Fail Rule

PASSES if: a developer can install, query, and apply the skill using only this folder's documentation.
FAILS if: fixes are applied without referencing the skill's domain output, or no evidence is logged.
