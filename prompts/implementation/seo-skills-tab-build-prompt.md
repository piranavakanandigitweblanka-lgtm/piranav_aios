# Prompt: SEO Skills Tab — Dashboard Integration Pattern

**Registered:** 2026-09-16 (retrospective)
**Status:** ACTIVE
**Category:** implementation
**Used in:** dm-dashboard · seo_intelligence.py + SeoIntelligence.jsx

---

## What This Builds

A Skills tab inside the SEO Intelligence dashboard page. Staff selects a page + keyword, picks a skill (e.g. page-audit, content-brief), generates a prompt, pastes the Claude output, and saves it for history.

---

## Prompt Pattern

```
Add a [N]th tab "Skills" to [page].jsx and [backend].py.

Backend endpoints needed:
- GET /skills/meta — list available skills with descriptions
- GET /skills/page-context?url=... — fetch GSC data for selected page
- POST /skills/generate-prompt — build the prompt for selected skill + page + keyword
- POST /skills/save-result — save Claude output to DB
- GET /skills/results — list saved results
- GET /skills/results/{id} — get single result
- DELETE /skills/results/{id} — delete result

DB table: seo_skill_results (id, skill_name, page_url, keyword, prompt_used, result_text, created_at)
Schema init: ensure_seo_skills_schema() called crash-proof in main.py startup

Frontend 3-panel layout:
- Panel 1: Page/keyword selector + GSC card (impressions, clicks, CTR, position)
- Panel 2: Skill button groups (Audit / Content / Research / Link)
- Panel 3: Paste output + Save + History list
```

---

## Skills Available (SuperSEO plugin, 2026-09-14)

page-audit, eeat-audit, semantic-gap-analysis, featured-snippet-optimizer, content-brief, write-content, improve-content, keyword-deep-dive, topic-cluster-planning, linkbuilding, expert-interview

Installed at: `~/.claude/skills/`
Guide: `docs/superseo-plugin-guide.md`
Commit: 2965d24
