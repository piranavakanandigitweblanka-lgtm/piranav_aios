---
name: requirement-05-internal-links-coverage-prompt
description: GPT/AIOS prompt used to build Requirement 5 — Internal Links Coverage Audit for hetheesha.html (ledsone.fr)
metadata:
  type: project
---

# Requirement 5 — Internal Links Coverage Audit — Prompt

**Staff Member:** Hetheesha  
**Store:** ledsone.fr  
**Requirement:** Internal Links Coverage Audit  
**Version:** V3 (correct implementation — replaces reverted V1 Shopify Domain Audit)  
**Date:** 2026-07-14

---

## Task Description

Build a complete Internal Links Coverage Audit dashboard for ledsone.fr inside tab-panel-5 of `Staff-requirements/pages/hetheesha.html`.

### What the dashboard must show

For each of the 309 live pages on ledsone.fr, count the number of **unique source pages that link TO that page** (incoming links, not outgoing).

### Page inventory (309 target pages)

| Type | Count | URL pattern |
|---|---|---|
| Homepage | 1 | `https://ledsone.fr/` |
| Collections | 66 | `https://ledsone.fr/collections/{handle}` |
| Products | 186 | `https://ledsone.fr/products/{handle}` |
| Blog articles | 56 | `https://ledsone.fr/blogs/news/{slug}` |
| **Total** | **309** | |

### Status rules

| Incoming links | Status label | Priority | Colour |
|---|---|---|---|
| 0 | No Internal Links | High | Red |
| 1–2 | Weak Internal Linking | High | Orange |
| 3–5 | Needs Improvement | Medium | Yellow |
| 6+ | Good Internal Linking | None | Green |

### Required UI components

1. **5 summary cards:** Total Pages / Good (6+) / Needs Improvement (3–5) / Weak (1–2) / No Internal Links
2. **Search:** filter by page URL or type
3. **Page type filter:** All / Homepage / Collection / Product / Blog Article
4. **Status filter:** All / No Internal Links / Weak Internal Linking / Needs Improvement / Good Internal Linking
5. **Sortable table** (all columns clickable): # / Page URL / Page Type / Incoming Links / Status / Fix Priority / Sources
6. **View Sources modal:** click "View N" to see which source pages link to the target
7. **CSV export:** downloads all 309 rows with columns above

### Data source constraints

- Use WebFetch (Anthropic proxy) for crawling — Python requests library returns HTTP 429 on ledsone.fr
- URL normalisation: `/collections/{col}/products/{handle}` → `/products/{handle}`; strip query strings, fragments, trailing slashes
- Count unique sources per target — repeated links from the same source count once only
- Do NOT use MCP Shopify — it connects to ledsone.co.uk, not ledsone.fr

### Security constraints (must remain in effect)

- Do NOT modify Shopify products, collections, menus, or themes
- Do NOT modify PostgreSQL data, GSC, GA4, or Google Ads
- Do NOT deploy to Vercel
- Do NOT push to Git without written approval
- Do NOT change Requirements 1–4 in hetheesha.html

---

## Implementation Notes

- Crawl source: 101 pages (66 collections + 34 blog articles + 1 homepage) — product pages not crawled as sources
- The blog index `/blogs/news` is a source page only — it is not a target row
- Sitewide nav collections appear on all crawled pages → they correctly show 100+ incoming links
- All crawl data stored in scratchpad as `r5_incoming_counts.json` and `r5_data.js`

---

## History

| Date | Action |
|---|---|
| 2026-07-07 | V1 built as "Shopify Domain Audit" (6-row) — wrong requirement |
| 2026-07-07 | V1 reverted per GPT coordinator instruction — 6 AIOS files moved to backup |
| 2026-07-14 | V2 re-built identically (wrong) during prior session — same 6-row domain audit |
| 2026-07-14 | V3 built correctly — Internal Links Coverage Audit, 309 rows, this prompt |
