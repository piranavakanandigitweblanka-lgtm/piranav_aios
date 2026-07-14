---
name: requirement-05-discovery-notes
description: Discovery audit for Requirement 5 — documents what the current implementation is, why it is wrong, existing AIOS asset state, page inventory, crawl data status, and proposed crawl strategy.
metadata:
  type: project
---

# Requirement 5 — Discovery Notes

**Staff Member:** Hetheesha  
**Store:** ledsone.fr  
**Discovery Date:** 2026-07-14  
**Author:** Claude Code / AIOS Worker  
**Purpose:** Pre-build discovery before re-implementing Requirement 5 correctly.  
**Status:** DISCOVERY ONLY — no HTML modified, no production changes made.

---

## 1. Current Implementation Review

**File:** `Staff-requirements/pages/hetheesha.html`  
**Tab button label (line 125):** "Internal Link Audit"  
**Tab panel:** `tab-panel-5` (lines 542–663)  
**JavaScript block:** lines 3044–3127

### What the current implementation contains

| Area | Current Value |
|---|---|
| H1 title | "Internal Link Audit — Shopify Domain & Broken Links" |
| Req tag | "Requirement 5 · ledsone.fr · Internal Links · V2" |
| KPI cards | Total Issues (6), Wrong Domain (4), Malformed Path (1), Inverted Action (1), High Priority (4), Medium Priority (2), Pages Audited (6) |
| Table columns | Scope / Link Location / Anchor Text / Current URL (Bad) / Correct URL / Issue Type / Status / Fix Priority |
| Data rows | 6 hardcoded rows |
| JS data structure | `const R5 = [["Sitewide", "Main Navigation...", ...], ...]` — 6-element arrays |
| Filter fields | All Issue Types / All Priorities / All Scopes |

### Current 6 data rows

| # | Scope | Location | Anchor | Bad URL | Correct URL | Issue | Priority |
|---|---|---|---|---|---|---|---|
| 1 | Sitewide | Main Nav (Lumières) | Lampes suspendues | jedsz8-km.myshopify.com/... | ledsone.fr/... | Wrong Domain | High |
| 2 | Sitewide | Main Nav (Lumières) | Lumière d'araignée | jedsz8-km.myshopify.com/... | ledsone.fr/... | Wrong Domain | High |
| 3 | Sitewide | Footer | Lampes suspendues | jedsz8-km.myshopify.com/... | ledsone.fr/... | Wrong Domain | Medium |
| 4 | Sitewide | Footer | Lumière d'araignée | jedsz8-km.myshopify.com/... | ledsone.fr/... | Wrong Domain | Medium |
| 5 | Collection Page | Main Navigation | Applique murale | /ledsone.fr/collections/applique-murale | /collections/applique-murale | Malformed Path | High |
| 6 | Collection Page | Top Navigation | Se connecter | /account/logout | /account/login | Inverted Action | High |

---

## 2. Why the Current Implementation Is Incorrect

### Wrong requirement entirely

The current implementation answers: **"Which internal links point to the wrong domain?"**

The correct requirement answers: **"How many unique source pages link TO each target page?"**

These are fundamentally different questions:

| Dimension | Current (Wrong) | Correct |
|---|---|---|
| Unit of analysis | A broken/wrong link | A target page |
| Rows | 6 link defects | 309 live pages |
| Question | What is wrong with this link? | How many pages point here? |
| Metric | Issue type, bad/good URL | Incoming link count |
| Status field | "Needs Fix" | No Internal Links / Weak / Needs Improvement / Good |
| Colour coding | Red=Wrong Domain, Yellow=Malformed, Purple=Inverted | Red=0, Orange=1-2, Yellow=3-5, Green=6+ |
| Table columns | Scope / Location / Anchor Text / Bad URL / Correct URL / Issue Type / Status / Priority | Page URL / Page Type / Incoming Links / Status / Fix Priority / View Sources |

### History

- **2026-07-07:** First R5 implementation built as "Shopify Domain Audit" (matching the OLD requirement interpretation). 6 AIOS files created.
- **2026-07-07:** GPT coordinator ordered a full REVERT. All content removed. 6 AIOS files moved to `backup/hetheesa_requirement_5_revert/`. tab-panel-5 reverted to placeholder.
- **2026-07-14 (this session, previous context):** R5 was re-implemented INCORRECTLY — the 6-row Shopify domain audit was re-built instead of the correct Internal Links Coverage Audit. This is what currently sits in hetheesha.html.

### Conclusion

The current tab-panel-5 must be replaced entirely. It is the same wrong implementation that was reverted on 2026-07-07, re-written a second time.

---

## 3. Existing AIOS Assets — Full Inventory

### Live AIOS folders (current state)

| Folder | R5 files present |
|---|---|
| `prompts/hetheesa/` | None — only req-01 and req-04 prompt files |
| `evidence/hetheesa/` | None for R5 — req-01 through req-04 only |
| `validation/hetheesa/` | `requirement_5_revert_validation.md` (the revert record only — not an implementation file) |
| `reports/hetheesa/` | None for R5 |
| `handover/hetheesa/` | Not checked — none expected |
| `vercel/hetheesa/` | Not checked — none expected |

### Backup folder (reference only — do not restore)

`backup/hetheesa_requirement_5_revert/` contains 6 files from the old wrong implementation:
- `requirement-05-internal-links-shopify-domain-prompt.md`
- `requirement-05-shopify-domain-links-audit.md`
- `requirement-05-validation.md`
- `requirement-05-report.md`
- `requirement-05-handover.md`
- `requirement-05-vercel-notes.md`

These files document the WRONG requirement. They must NOT be restored. They stay in backup for audit trail only.

### AIOS files that must be created (none exist yet)

The following files are required for the correct implementation and do not currently exist anywhere:

| File | Folder |
|---|---|
| `requirement-05-internal-links-coverage-prompt.md` | `prompts/hetheesa/` |
| `requirement-05-discovery-notes.md` | `evidence/hetheesa/` ← this file |
| `requirement-05-url-inventory.csv` | `evidence/hetheesa/` |
| `requirement-05-crawl-evidence.md` | `evidence/hetheesa/` |
| `requirement-05-incoming-link-sources.csv` | `evidence/hetheesa/` |
| `requirement-05-validation.md` | `validation/hetheesa/` |
| `requirement-05-internal-links-coverage-report.md` | `reports/hetheesa/` |
| `requirement-05-handover.md` | `handover/hetheesa/` |
| `requirement-05-deployment-readiness.md` | `vercel/hetheesa/` |

---

## 4. Correct Page Inventory

### Target pages to audit (309 total)

The correct requirement audits ALL live pages on ledsone.fr as TARGET pages.

| Type | Count | URL pattern |
|---|---|---|
| Homepage | 1 | `https://ledsone.fr/` |
| Collections | 66 | `https://ledsone.fr/collections/{handle}` |
| Products | 186 | `https://ledsone.fr/products/{handle}` |
| Blog articles | 56 | `https://ledsone.fr/blogs/news/{slug}` |
| **Total** | **309** | |

Note: `/blogs/news` (the blog index) is a SOURCE page only, not a target row.  
Note: The Shopify MCP connects to ledsone.co.uk (UK store), NOT ledsone.fr — it cannot be used to derive the FR page inventory. Inventory was confirmed from the `r5_generate_js.py` explicit handle lists derived from sitemap crawl in the previous session.

### Source pages (used to build incoming link counts)

Each of the 309 target pages is also a potential source. The crawl must visit every source page, extract all internal `<a href>` links pointing to ledsone.fr, normalize them to canonical paths, and count unique sources per target.

---

## 5. Crawl Data Status (Scratchpad Files)

### Files present in session scratchpad

| File | Size / Content | Usable? |
|---|---|---|
| `r5_incoming_counts.json` | 665 target keys, each with a list of source slugs | **Partial — see analysis below** |
| `r5_data.json` | 309 rows, ALL showing 0 incoming (429 failures from Python crawler) | **NOT usable** |
| `r5_data.js` | Generated from r5_incoming_counts.json — 309 rows, stats: 49 good / 24 needs-improvement / 96 weak / 140 no-links | **Derived from partial data** |
| `r5_generate_js.py` | Script that converts incoming_counts → JS array | Ready to re-run |
| `r5_build_dataset.py` | Earlier dataset builder | Superseded by r5_generate_js.py |
| `r5_crawl.py` | Python bulk crawler | Produced all 429s — not usable |

### Analysis of r5_incoming_counts.json

- **665 total target keys** in the map (41 collections + 588 products + 36 blogs)
- **100 unique source pages** appear across all value lists
- **Source breakdown:** 66 collection pages + 34 blog pages crawled as sources
- **Homepage** does NOT appear as a source (was not crawled or links not extracted)
- **309 canonical targets** mapped against it by r5_generate_js.py: 169 have ≥1 source, **140 show 0 (no incoming links)**

### Critical gap identified

The 140 pages showing "No Internal Links" may be genuinely unlinked OR may simply not appear in the crawled sources. The crawl was partial — the fork agent hit a session limit before completing. Specifically:

- Product pages as sources were NOT crawled (only collections + blogs were sources)
- Homepage as a source was NOT crawled
- Some blog articles may be missing from the source set (only 34 of 56 blog articles appear as sources)

**This means the current r5_incoming_counts.json is INCOMPLETE.** Any page that is only linked from a product page or from the homepage would incorrectly show 0 incoming links.

### What is reliable in the current data

- Nav collections (those in the site navigation): the nav appears on ALL pages, so any target linked from the nav correctly shows 100 sources (all 100 crawled pages link to it via nav). These "Good" results are accurate.
- Blog article targets linked from blog index or other blog articles: these counts are partially accurate (34 blog sources crawled, 56 missing from source pool from homepage and products).
- Product targets linked from collection pages: counts are accurate for the 66 collections crawled as sources. But products may also be linked from other products, blog articles, or homepage — those are missing.

---

## 6. Proposed Crawl Strategy

### Objective

Complete the source crawl to obtain reliable incoming link counts for all 309 targets.

### What still needs to be crawled as SOURCE pages

| Category | Total needed | Already crawled | Missing |
|---|---|---|---|
| Homepage | 1 | 0 | **1** |
| Collections | 66 | 66 | **0** ✅ |
| Products | 186 | 0 | **186** |
| Blog articles | 56 | 34 | **22** |
| Blog index (/blogs/news) | 1 | 1 | **0** ✅ |
| **Total missing** | | | **209** |

### Rate limiting constraint

- Python `requests` library returns HTTP 429 for all ledsone.fr pages
- WebFetch (Anthropic proxy) bypasses the rate limit and returns 200
- Strategy: use WebFetch for all remaining source page crawls

### Recommended approach

**Phase 1 — Homepage (1 request)**
Crawl `https://ledsone.fr/` and extract all internal product/collection links. Add to incoming_counts.

**Phase 2 — Missing blog articles (22 requests)**
Crawl the 22 blog articles not yet in the source set. Extract all internal links.

**Phase 3 — Product pages (186 requests)**
Crawl all 186 product pages. Extract internal links (cross-links to other products, collections, etc.).

For Phase 3, to avoid hitting session limits again, use batched parallel WebFetch calls in groups of 10–15 pages per message. Save incremental results to the scratchpad after each batch.

### URL normalization rules (must be applied consistently)

- Strip query strings and fragments
- Strip trailing slashes
- Normalize `/collections/{col}/products/{handle}` → `/products/{handle}`
- Only count ledsone.fr internal links (exclude external domains)
- Count unique SOURCES per target (not total link instances)

### Decision for coordinator

Given the 209 missing source pages — do you want to:
1. **Complete the crawl** (recommended) — run remaining 209 pages via WebFetch batches, then regenerate r5_data.js and build the dashboard with fully accurate data
2. **Use partial data now** — proceed with current r5_incoming_counts.json (noting the 140 pages with 0 may be undercount), add a methodology notice in the dashboard explaining the limitation
3. **Use nav-derived counts only** — simplify: nav collections get count=309 (all pages), non-nav pages get count from available data, document the methodology

**Recommendation: Option 1.** The 140 pages flagged "No Internal Links" with "High" fix priority will drive real work. If those counts are wrong (pages are actually linked but we missed it), it creates false alarms. A complete crawl is the right call.

---

## Status

DISCOVERY COMPLETE — 2026-07-14  
No HTML modified. No AIOS implementation files created yet. No production changes made.  
Next step: coordinator approves crawl strategy, then crawl Phase 1–3, regenerate data, build dashboard.
