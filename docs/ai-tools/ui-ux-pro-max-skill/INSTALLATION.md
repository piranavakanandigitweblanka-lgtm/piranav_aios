# INSTALLATION — UI UX Pro Max Skill

---

## Purpose of This File

This document covers how to install the upstream UI UX Pro Max skill (v2.8.8) into this machine and integrate it with the piranav Mini-AIOS workspace so Claude Code can query it.

---

## Prerequisites

| Requirement | Check Command | Expected |
|---|---|---|
| Node.js installed | `node --version` | v18+ |
| npm installed | `npm --version` | v9+ |
| Python 3.x installed | `python3 --version` | v3.8+ (no external deps needed) |
| Mini-AIOS workspace exists | `Test-Path "C:\Users\PC\Documents\piranav_aios\README.md"` | `True` |

---

## Step 1 — Install the Upstream CLI

```bash
npm install -g ui-ux-pro-max-cli
```

Then initialise for Claude Code:

```bash
uipro init --ai claude
```

Or as a one-liner:

```bash
npx ui-ux-pro-max-cli init --ai claude
```

This installs the skill's data files, Python search engine, and Claude integration files into the current project. Run it from the AIOS root:

```
C:\Users\PC\Documents\piranav_aios
```

---

## Step 2 — Verify the Data Files Are Present

After installation, confirm the core data directory exists:

```powershell
Test-Path "src/ui-ux-pro-max/data/styles.csv"
```

Expected: `True`

Key data files that must be present:

| File | Domain | Content |
|---|---|---|
| `data/products.csv` | `product` | 161 product category reasoning rules |
| `data/styles.csv` | `style` | 84 UI styles |
| `data/colors.csv` | `color` | 161 colour palettes |
| `data/typography.csv` | `typography` | Font pairing data |
| `data/google-fonts.csv` | `typography` | Google Fonts pairings |
| `data/charts.csv` | `chart` | 25 chart types |
| `data/ux-guidelines.csv` | `ux` | 99 UX guidelines |
| `data/landing.csv` | `landing` | Landing page patterns |
| `data/app-interface.csv` | `style` | App interface patterns |
| `data/design.csv` | `style` | Design patterns |
| `data/ui-reasoning.csv` | `product` | UI reasoning rules |
| `data/react-performance.csv` | `ux` | React performance patterns |
| `data/icons.csv` | `style` | Icon library references |
| `data/stacks/` | all | 17 tech-stack-specific data files |

---

## Step 3 — Verify the Search Engine

```bash
python3 src/ui-ux-pro-max/scripts/search.py "beauty spa" --domain product
```

Expected output: a ranked list of recommended styles, colour palettes, and font pairings for a beauty spa product category.

If this errors: Python 3 is not installed or the `src/` path is not resolved. Re-run `uipro init --ai claude` from the correct directory.

---

## Step 4 — Verify Claude Code Integration

After `uipro init --ai claude`, a `.claude/` folder is populated with skill configuration. Confirm:

```powershell
Test-Path ".claude/skills/"
```

Expected: `True`

Claude Code will auto-activate the skill when handling UI/UX design requests.

---

## Step 5 — Register in AIOS Source Map

Add the installed skill path to `source-map/README.md`:

```
| UI UX Pro Max skill | src/ui-ux-pro-max/ | Upstream: github.com/nextlevelbuilder/ui-ux-pro-max-skill |
```

---

## Onboarding Checklist for a New Developer

- [ ] Read `README.md` (this folder)
- [ ] Read `START_HERE.md` (AIOS root)
- [ ] Install Node.js (v18+) and Python 3.x
- [ ] Run `npx ui-ux-pro-max-cli init --ai claude` from AIOS root
- [ ] Verify data files with `Test-Path "src/ui-ux-pro-max/data/styles.csv"`
- [ ] Run a test search query (Step 3 above)
- [ ] Read `ARCHITECTURE.md` — understand the 7 search domains
- [ ] Read `CLAUDE_RULES.md` — understand operating rules
- [ ] Read `SHOPIFY_WORKFLOW.md` — understand how to apply output to Shopify

---

## Upgrading the Skill

Check the upstream version:

```bash
npm info ui-ux-pro-max-cli version
```

To upgrade:

```bash
npm install -g ui-ux-pro-max-cli@latest
uipro init --ai claude
```

After upgrading: bump the version in `CHANGELOG.md` with the new upstream version number and what changed.

Track releases at: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/releases

---

## Known Limitations

- The `uipro init` command overwrites the `.claude/skills/` integration files — any local customisations will be lost on upgrade. Document customisations in `CLAUDE_RULES.md` before upgrading.
- The Python search engine requires Python 3 on the same machine. It cannot be run via Claude Code's tool calls — piranav must run it manually and paste results into the session.
- On Windows, use `python` instead of `python3` if the alias is not configured.

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Installed By | piranav |
| Reviewer | Varmen |
| Upstream Version | 2.8.8 |
| Install Date | 2026-06-26 |
