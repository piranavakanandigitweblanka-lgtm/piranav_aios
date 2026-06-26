# SHOPIFY WORKFLOW — UI UX Pro Max Skill

---

## Purpose of This File

This document describes the end-to-end workflow for applying the UI UX Pro Max Skill to a live Shopify store during a piranav Mini-AIOS session. It covers how to identify, audit, fix, and evidence tasks using the skill's 8 domains.

---

## Workflow Overview

```
1. Identify store + task type
2. Pull theme locally
3. Query the skill → select domain + task
4. Run the domain checklist
5. Apply the fix (Liquid / CLI / Admin)
6. Validate the fix
7. Write evidence
8. Close the task
```

---

## Step 1 — Identify the Store and Task Type

Before opening any files, confirm:

| Question | Where to Find Answer |
|---|---|
| Which store? | `source-map/README.md` → Shopify Store Map |
| What is the problem? | Closure entry from previous session, or Varmen's instruction |
| Which domain does it fall under? | `ARCHITECTURE.md` → Domain Map |
| What is the importance score? | `ARCHITECTURE.md` → Domain Map or source guide |

Only proceed if the task is inside piranav's boundary. Out-of-scope tasks require Varmen approval logged in `handover/README.md`.

---

## Step 2 — Pull the Theme Locally

Use Shopify CLI to get the latest theme state:

```bash
shopify theme pull --store ledsone.myshopify.com
```

Store-specific commands:

| Store | CLI Command |
|---|---|
| LEDsone (UK) | `shopify theme pull --store ledsone.myshopify.com` |
| Electricalsone | Confirm domain with Varmen — see `source-map/README.md` |
| Blueskytechco | Confirm domain with Varmen — see `source-map/README.md` |

**Always pull before editing.** Never edit the local theme snapshot without verifying it is up to date.

Verify local theme path:
```
C:\Users\PC\Downloads\uk 2026.06.09\
```

---

## Step 3 — Query the Skill

Open the source guide and navigate to the relevant domain:

```
C:\Users\PC\Desktop\shopify_seo_ui_ux_guide.md
```

Or use the quick navigation table in `ARCHITECTURE.md`.

For each task you plan to run:
- Note the importance score
- Read the checklist
- Read the tutorial
- Read Do's and Don'ts

Do not start coding until the checklist is understood.

---

## Step 4 — Run the Domain Checklist

Work through each checklist item in order. For each item:

| Checklist Result | Action |
|---|---|
| PASS — already correct | Log as confirmed, no change needed |
| FAIL — issue found | Proceed to Step 5 (apply fix) |
| UNKNOWN — cannot verify | Log as blocker; do not mark PASS without evidence |

Do not skip checklist items. A partial checklist is a partial audit.

---

## Step 5 — Apply the Fix

### For Liquid / theme file edits:

1. Open the relevant file from the local theme snapshot:
   ```
   C:\Users\PC\Downloads\uk 2026.06.09\<section or snippet file>
   ```
2. Apply the change using Claude Code's Edit tool.
3. Verify the change is the minimum required — do not refactor surrounding code.
4. Preview the theme before pushing:
   ```bash
   shopify theme dev --store ledsone.myshopify.com
   ```

### For Shopify Admin changes (non-code):

Use the Shopify MCP tools or go directly to Admin. Document the admin path used (e.g., Admin > Online Store > Navigation > URL Redirects).

### For schema / structured data:

Test all JSON-LD changes with Google's Rich Results Test before closing the task.

### For performance tasks:

Run PageSpeed Insights on the affected page before and after the fix. Include both scores in the evidence.

---

## Step 6 — Validate the Fix

Every fix must be validated before it is marked PASS. Accepted validation methods:

| Fix Type | Validation Method |
|---|---|
| Liquid code change | `shopify theme dev` preview — visual check on desktop + mobile |
| SEO / meta / schema | Google Rich Results Test or manual source inspection |
| Canonical tag | View source: `<link rel="canonical" href="...">` matches expected URL |
| Accessibility | Keyboard tab-through + screen reader check or Lighthouse accessibility score |
| Performance | PageSpeed Insights before/after score delta |
| Navigation / layout | Manual visual test: desktop + mobile, all affected pages |

Record the validation result in a validation report saved to `validation/` or `evidence/fixes/`.

---

## Step 7 — Write Evidence

Before closing any task, create an evidence entry:

**In `evidence/README.md`** — add a row to the Evidence Index:

```
| 2026-06-26 | UIUX-SKILL-001 — [Task name] | Evidence markdown | evidence/fixes/[filename].md | PASS |
```

**Create a fix report** at `evidence/fixes/[task-slug]-fix-[date].md` containing:
- Task name and domain
- Importance score
- File(s) changed (with absolute path)
- Before state
- After state
- Validation result
- Checklist items resolved

Do not mark a task PASS without a file-based evidence record.

---

## Step 8 — Close the Task

Write the session closure entry in `closure/README.md`:

Required fields:
- Requirement ID (e.g., `UIUX-SKILL-001`)
- Skill domain applied
- Evidence path
- Validation result
- Blockers (if any)
- PASS / FAIL

---

## Common Shopify Patterns Applied by This Skill

### Fix product URL within collection (Domain 4.1 — 25/25)

In `main-collection-product-grid.liquid` or product card snippet:

```liquid
{{- product.url | within: collection -}}   ← WRONG — creates duplicate content
{{- product.url -}}                         ← CORRECT
```

### Fix missing aria-label on icon buttons (Domain 8.3 — 20/25)

In `header.liquid`:

```html
<!-- WRONG -->
<button><svg>...</svg></button>

<!-- CORRECT -->
<button aria-label="Open cart"><svg aria-hidden="true">...</svg></button>
```

### Fix LCP image lazy loading (Domain 3.2 — 23/25)

```liquid
{{- product.featured_image | image_url: width: 800 | image_tag: loading: 'eager' -}}
```

Above-fold images must use `loading="eager"`. All others use `loading="lazy"`.

### Fix focus outline removal (Domain 8.2 — 21/25)

In theme CSS, replace:

```css
:focus { outline: none; }  /* WRONG */
```

With:

```css
:focus-visible { outline: 2px solid var(--color-base-accent-1); outline-offset: 2px; }
```

### Noindex filter URLs (Domain 4.3 — 23/25)

In `theme.liquid` `<head>`:

```liquid
{% if request.path contains '/collections/' and current_tags %}
  <meta name="robots" content="noindex, follow">
{% endif %}
```

---

## Push to Shopify

Only push after validation is complete and evidence is written:

```bash
shopify theme push --store ledsone.myshopify.com
```

Do NOT push directly to the live theme without Varmen approval. Use a development theme for testing:

```bash
shopify theme push --store ledsone.myshopify.com --development
```

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Authored | piranav |
| Reviewer | Varmen |
| Last Updated | 2026-06-26 |
