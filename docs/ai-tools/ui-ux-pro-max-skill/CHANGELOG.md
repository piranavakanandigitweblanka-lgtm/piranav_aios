# CHANGELOG — UI UX Pro Max Skill

---

## Purpose of This File

This file records all version changes to the AIOS documentation for the UI UX Pro Max Skill, and tracks the upstream skill version at each point. When the upstream releases a new version, add an entry here after updating the docs.

---

## Versioning Format

```
AIOS Docs version — tracks documentation changes
Upstream version  — tracks https://github.com/nextlevelbuilder/ui-ux-pro-max-skill

MAJOR — breaking structural change (upstream architecture changes, domain removed)
MINOR — new capabilities added, upstream version bump with new data
PATCH — wording corrections, typo fixes, path updates, evidence log entries
```

---

## Version History

---

### v2.0.0 — 2026-06-26

**Type:** Major update — full rewrite to match upstream v2.8.8  
**Author:** piranav  
**Reviewer:** Varmen (pending — AMBER)  
**Upstream Version:** 2.8.8  
**Status:** ACTIVE

**What changed:**

The v1.0.0 docs described the skill as a Shopify SEO checklist reference only. After fetching the upstream GitHub repository (`https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`), the actual skill is an AI-powered design intelligence system with CSV databases and a Python search engine. All documentation was rewritten to reflect this.

**Specific changes per file:**

| File | Change |
|---|---|
| `README.md` | Full rewrite — purpose updated from "Shopify SEO reference" to "AI design intelligence"; capability table updated to 84 styles / 161 palettes / 73 fonts / 25 charts / 99 UX guidelines; official GitHub, homepage, and MIT license added |
| `INSTALLATION.md` | Full rewrite — added `npx ui-ux-pro-max-cli init --ai claude` install command; Python 3 requirement; data file verification steps; upgrade workflow |
| `ARCHITECTURE.md` | Full rewrite — two-layer model introduced (upstream skill + Shopify SEO reference); data file map (14 CSVs + stacks/); 7 search domains documented; Shopify SEO domains retained as Layer 2 |
| `SHOPIFY_WORKFLOW.md` | Full rewrite — added skill search step before theme edits; LEDsone-specific search queries; design system → theme application patterns; 8-step workflow updated |
| `CLAUDE_RULES.md` | Full rewrite — rule count 12 → 14; added Rule 2 (use skill output not memory), Rule 3 (two layers distinct), Rule 9 (anti-patterns), Rule 13 (version must match), Rule 14 (Layer 2 adjusts Layer 1) |
| `CHANGELOG.md` | This entry |
| `EVIDENCE.md` | Update entry added (see below) |

**Upstream discovery details:**

| Field | v1.0.0 (what we assumed) | v2.8.8 (actual) |
|---|---|---|
| Skill type | Static Shopify SEO checklist | AI design intelligence with CSV + Python search |
| UI Styles | N/A | 84 |
| Colour Palettes | N/A | 161 |
| Font Pairings | N/A | 73 |
| UX Guidelines | N/A | 99 |
| Chart Types | N/A | 25 |
| Tech Stacks | N/A | 17 |
| Install method | N/A | `npx ui-ux-pro-max-cli init --ai claude` |
| Search engine | N/A | `python3 src/ui-ux-pro-max/scripts/search.py` |
| Platforms | Claude Code only | 19 platforms (Claude, Cursor, Windsurf, Copilot, etc.) |

---

### v1.0.0 — 2026-06-25

**Type:** Initial integration  
**Author:** piranav  
**Upstream Version:** Unknown at integration time  
**Status:** SUPERSEDED by v2.0.0

**What existed at v1.0.0:**
- Docs written against `shopify_seo_ui_ux_guide.md` (local Shopify SEO guide) as the primary source
- Architecture described 8 Shopify-specific SEO domains with importance scores
- No upstream skill install process documented
- No Python search engine documented
- 12 Claude Rules

**Reason superseded:** Upstream repository was fetched on 2026-06-26 and revealed the skill is fundamentally different from what v1.0.0 described. Full rewrite was necessary.

---

## Template for Future Entries

```markdown
### v[X.Y.Z] — [YYYY-MM-DD]

**Type:** [patch / minor / major]
**Author:** piranav
**Reviewer:** Varmen
**Upstream Version:** [version from npm info ui-ux-pro-max-cli version]
**Status:** [ACTIVE / DRAFT / DEPRECATED]

**What changed:**
- [File]: [change description]

**Upstream changes in this release:**
- [What the upstream added/changed]
```

---

## Update Triggers

| Trigger | Bump |
|---|---|
| Upstream releases new version | MINOR (check for new capabilities) |
| New data domain added upstream | MINOR |
| Capability count changes (more styles/palettes/etc.) | PATCH |
| New Claude rule added | PATCH |
| Wording fix | PATCH |
| Upstream removes a domain or breaking change | MAJOR |
| AIOS workflow restructured | MAJOR |

Check upstream releases at: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/releases

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Maintained By | piranav |
| Reviewer | Varmen |
| Current AIOS Docs Version | 2.0.0 |
| Current Upstream Version | 2.8.8 |
| Last Updated | 2026-06-26 |
