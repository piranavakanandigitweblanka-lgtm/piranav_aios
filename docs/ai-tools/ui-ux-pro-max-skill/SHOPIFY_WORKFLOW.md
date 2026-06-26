# SHOPIFY WORKFLOW — UI UX Pro Max Skill

---

## Purpose of This File

This document describes the end-to-end workflow for using the UI UX Pro Max Skill inside a Shopify session. It covers: generating a design system with the upstream skill, then applying and validating it against the Shopify theme using the local SEO reference.

---

## Workflow Overview

```
1. Identify store + design problem
2. Run skill search → get design system recommendation
3. Pull theme
4. Apply design system to theme files
5. Validate with Shopify SEO reference checklist
6. Test on development theme
7. Write evidence
8. Close task
```

---

## Step 1 — Identify the Store and Design Problem

| Question | Where to Find Answer |
|---|---|
| Which store? | `source-map/README.md` → Shopify Store Map |
| What type of product / category? | Product admin or store description |
| What is the design problem? | Varmen instruction or closure carry-forward |
| Which tech stack does the theme use? | Shopify OS 2.0 Liquid — use `HTML+Tailwind` or `React` stack if headless |

---

## Step 2 — Run the Skill Search

Run the Python search engine against the relevant domain. This is run by piranav in the terminal — the output is pasted into the session for Claude Code to reference.

### For LEDsone (LED lighting e-commerce, UK):

```bash
# Get product-matched design system
python3 src/ui-ux-pro-max/scripts/search.py "LED lighting electrical UK e-commerce" --domain product

# Get colour palette recommendations
python3 src/ui-ux-pro-max/scripts/search.py "industrial tech electrical" --domain color

# Get UI style recommendations
python3 src/ui-ux-pro-max/scripts/search.py "dark mode industrial grid" --domain style

# Get font pairing recommendations
python3 src/ui-ux-pro-max/scripts/search.py "technical industrial" --domain typography

# Validate UX guidelines for the checkout area
python3 src/ui-ux-pro-max/scripts/search.py "checkout flow e-commerce" --domain ux
```

### For any new store — general pattern:

```bash
python3 src/ui-ux-pro-max/scripts/search.py "<product category + store type>" --domain product
python3 src/ui-ux-pro-max/scripts/search.py "<aesthetic keywords>" --domain style
python3 src/ui-ux-pro-max/scripts/search.py "<aesthetic keywords>" --domain color
python3 src/ui-ux-pro-max/scripts/search.py "<tone keywords>" --domain typography
```

Record the skill's output in the session evidence file before proceeding to code.

---

## Step 3 — Pull the Theme

```bash
shopify theme pull --store ledsone.myshopify.com
```

Verify the local theme path:
```
C:\Users\PC\Downloads\uk 2026.06.09\
```

Always pull before editing. Never edit a stale local snapshot.

---

## Step 4 — Apply the Design System

Using the skill's recommendations, apply changes to the theme. Common application areas:

### Colour Palette → CSS Variables

In `assets/base.css` or `assets/theme.css`:

```css
:root {
  --color-primary: #<hex from skill output>;
  --color-accent:  #<hex from skill output>;
  --color-surface: #<hex from skill output>;
  --color-text:    #<hex from skill output>;
}
```

### Font Pairing → Theme Typography

In Shopify Theme Editor > Typography, or directly in CSS:

```css
/* Heading font from skill output */
h1, h2, h3 { font-family: '<Heading Font>', sans-serif; }

/* Body font from skill output */
body { font-family: '<Body Font>', sans-serif; }
```

Add Google Fonts `<link>` to `theme.liquid` `<head>` if not already present.

### UI Style → Section Layout

Apply the recommended style to section templates. For example, if the skill recommends **Bento Grid** for a tech e-commerce store:

In `sections/main-collection-product-grid.liquid`:
- Set grid to CSS Grid with asymmetric cell sizes
- Apply `border-radius: 12px` and subtle shadow to cards
- Use the skill's recommended accent colour for badges

### UX Guidelines → Anti-Pattern Fixes

Review the `--domain ux` output for anti-patterns flagged for this product category. Common ones for e-commerce:
- Do not use fake countdown timers
- Checkout must not hide shipping cost until final step
- Mobile Add to Cart button must span full width

---

## Step 5 — Validate with the Shopify SEO Reference

After applying the design system, run the relevant domain checklist from `shopify_seo_ui_ux_guide.md`.

For design changes, always run at minimum:
- **Domain 5 — Design & Layout** (importance scores 20–25/25)
- **Domain 8 — Accessibility** (WCAG colour contrast, ARIA, keyboard nav)
- **Domain 3 — Performance** if any new images, fonts, or scripts were added

Open the source guide and tick each checklist item:
```
C:\Users\PC\Desktop\shopify_seo_ui_ux_guide.md
```

Items failing the checklist must be fixed before the task is marked PASS.

---

## Step 6 — Test on Development Theme

```bash
shopify theme push --store ledsone.myshopify.com --development
shopify theme dev --store ledsone.myshopify.com
```

Test on:
- Desktop (1280px+)
- Mobile (375px — iPhone SE)
- Keyboard-only navigation (Tab through the page)

Do NOT push to the live theme without Varmen approval.

---

## Step 7 — Write Evidence

Create a fix/design report at `evidence/fixes/design-system-[store]-[date].md` containing:

```markdown
## Design System Applied — [Store] — [Date]

**Skill Version:** 2.8.8
**Search Query:** [query used]
**Domain:** [domain used]

### Skill Output Summary
- UI Style recommended: [style name]
- Colour palette: [palette name + hex values]
- Font pairing: [heading font] + [body font]
- UX anti-patterns flagged: [list]

### Changes Applied
- File: [path]
- Change: [description]

### Shopify SEO Reference Checklist
- Domain 5 — Design & Layout: PASS/FAIL
- Domain 8 — Accessibility: PASS/FAIL
- Domain 3 — Performance: PASS/FAIL

### Validation
- Desktop: PASS/FAIL
- Mobile: PASS/FAIL
- Keyboard nav: PASS/FAIL
```

Add an index row to `evidence/README.md`.

---

## Step 8 — Close the Task

Write the session closure entry in `closure/README.md`:

- Requirement ID (e.g., `UIUX-SKILL-002`)
- Skill domain(s) queried
- Design system applied (style + palette + fonts)
- Evidence path
- Validation result
- Blockers (if any)
- PASS / FAIL

---

## Common Design System Combinations for LEDsone

Based on LEDsone's product category (LED / electrical / industrial UK):

| Element | Recommended |
|---|---|
| UI Style | Dark Mode + Bento Grid or Minimalism |
| Primary Colour | Deep navy or charcoal (`#1a1f2e`, `#2d2d2d`) |
| Accent Colour | Electric yellow or LED amber (`#f5c518`, `#ff9900`) |
| Heading Font | Inter Bold or Roboto Condensed |
| Body Font | Inter Regular or Source Sans Pro |
| UX Focus | Product trust signals, fast checkout, clear stock status |

These are starting recommendations — always run the skill search to get the BM25-ranked output for the specific session query.

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Authored | piranav |
| Reviewer | Varmen |
| Upstream Skill Version | 2.8.8 |
| Last Updated | 2026-06-26 |
