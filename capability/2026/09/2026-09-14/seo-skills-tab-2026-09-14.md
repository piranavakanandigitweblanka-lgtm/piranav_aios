# Capability — SEO Skills Tab + SuperSEO Plugin Integration

**Date added:** 2026-09-14
**Status:** ACTIVE — deployed on SEO Intelligence page
**Evidence:** evidence/sajeepan/seo-skills-tab-2026-09-14.md

## What This Capability Is

A Skills tab on the SEO Intelligence dashboard that lets SEO staff select a page + keyword, generate a Claude prompt using a specialist skill (page-audit, content-brief, etc.), paste the output, and save it to history.

## Components

### SuperSEO Plugin (11 skills at ~/.claude/skills/)
page-audit, eeat-audit, semantic-gap-analysis, featured-snippet-optimizer, content-brief, write-content, improve-content, keyword-deep-dive, topic-cluster-planning, linkbuilding, expert-interview

### Backend (seo_intelligence.py)
- seo_skill_results DB table
- 7 endpoints for skill metadata, page context, prompt generation, result save/retrieve/delete
- ensure_seo_skills_schema() crash-proof init in main.py

### Frontend (SeoIntelligence.jsx — 7th tab)
- 3-panel layout: page selector + skill picker + paste/save/history

## Reuse Pattern

Any SEO staff page can add a skills tab using the same 7 endpoints. The SuperSEO skills are universal — not staff-specific.
