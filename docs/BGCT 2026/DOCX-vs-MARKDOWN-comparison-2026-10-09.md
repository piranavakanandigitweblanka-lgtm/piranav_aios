# BGCT Documentation — Word Docs vs Markdown Pack Comparison

**Date:** 2026-10-09
**Purpose:** Compare the 12 existing Word documents (from Google Drive, dated 2026-06-11) against the markdown documentation pack built in this session.
**Status:** DRAFT — for Piranav and Sathees review

---

## Overview

There are two separate BGCT documentation sets:

| Set | Format | Files | Date | Authors |
|---|---|---|---|---|
| **Word Docs (existing)** | .docx (Google Drive) | 12 files | 2026-06-11 | Piranav (SEO owner), Kuberan (UI/UX owner), Muguntha (validator) |
| **Markdown Pack (new)** | .md (piranav_aios) | 17 files | 2026-10-09 | Claude Code (DRAFT) |

These are **not duplicates** — they are **complementary** with different strengths. See Section 3 for detail.

---

## 1. Topic Coverage Comparison

### SEO Topics

| Topic | Word Doc | Markdown Pack |
|---|---|---|
| Fix Crawl Errors | YES — 2 versions (detailed) | YES — covered in `01-site-structure-crawlability/` |
| Broken Links / 404 Redirects | YES — full handbook | YES — covered |
| Redirect Chains Cleanup | YES — full handbook | YES — covered |
| Optimize robots.txt | YES — full handbook | YES — with Liquid code example |
| Shopify Sitemap Optimization | YES — full handbook | YES — covered |
| Canonical Tag Audits & Fixes | YES — full handbook | YES — with `{{ product.url }}` fix |
| Hreflang Setup | YES — full handbook | YES — covered in `01-site-structure-crawlability/` |
| On-Page SEO (meta, H1, schema) | NO — not in Word docs | YES — full sheet in `02-on-page-seo/` |
| Performance / Core Web Vitals | NO — not in Word docs | YES — full sheet in `03-performance-core-web-vitals/` |
| Shopify-Specific SEO (pagination, infinite scroll, faceted nav) | NO — not in Word docs | YES — full sheet in `04-shopify-specific-seo/` |

### UI/UX Topics

| Topic | Word Doc | Markdown Pack |
|---|---|---|
| Conversion Optimization (CRO) | YES — full handbook | YES — 10 tasks covered |
| Design & Layout | YES — full handbook | YES — 8 tasks covered |
| Accessibility | YES — full handbook | YES — 4 tasks covered |
| Theme Customization | YES — full handbook | YES — 6 tasks covered |

**Gap:** The Word docs have NO coverage of On-Page SEO, Core Web Vitals, or Shopify-specific SEO pagination/faceted navigation. The markdown pack fills this gap.

---

## 2. Structure Comparison

### What the Word Docs have that the Markdown Pack does NOT

| Element | Present in Word Docs | Present in Markdown |
|---|---|---|
| **Backup requirements** (per task, specific) | YES — detailed per task | NO |
| **Rollback requirements** (who authorises, how) | YES | NO |
| **Evidence stage table** (Stage → Required Evidence) | YES — mandatory, per task | Partial — in evidence file only |
| **Review schedule** (monthly, named owner) | YES | NO |
| **Security requirements** | YES (robots.txt, DNS) | NO |
| **"⚠ MISSING — OWNER INPUT REQUIRED" gap flags** | YES — e.g. PageSpeed tolerance, CRO target KPI, WCAG level per client | NO |
| **Success criteria** (measurable, binary) | YES — specific per task | Partial — in checklist only |
| **Rollback decision authority** (named person) | YES — Muguntha (TL) | NO |
| **Owner / Validator named** | YES — Piranav/Kuberan + Muguntha | NO — generic |
| **Company branding** | YES — DIGITWEB LANKA LIMITED header | NO |

### What the Markdown Pack has that the Word Docs do NOT

| Element | Present in Markdown | Present in Word Docs |
|---|---|---|
| **Liquid code examples** (robots.txt.liquid, canonical, noindex, section schema, blocks) | YES | NO |
| **CSS code examples** (focus states, mobile media queries, button hover) | YES | NO |
| **JavaScript examples** (sticky header scroll, aria-expanded toggle) | YES | NO |
| **Step-by-step numbered tutorials** | YES | NO |
| **DO's and DON'Ts table** | YES — in every tutorial | NO |
| **Severity ratings** (Critical/High/Medium/Low per check) | YES | NO |
| **Decision rules table** (Guidelines) | YES | NO |
| **Tool-specific procedure** (exact clicks per check) | YES | NO |

---

## 3. Verdict — Are They Duplicates?

**No. They are complementary.**

| Dimension | Word Docs | Markdown Pack |
|---|---|---|
| Governance | Strong — backup, rollback, evidence stages, named owners | Weak — not covered |
| Code guidance | None | Strong — Liquid, CSS, JS examples |
| Step-by-step execution | Weak — principles only | Strong — numbered steps |
| Coverage breadth | Partial — SEO topics incomplete | Complete — all 4 SEO sheets, all 4 UI/UX sheets |
| Format | Word — hard to version-control | Markdown — git-tracked, queryable |
| Status | Published (v1.0) | DRAFT |

**Recommended action:** Merge strengths from both. The markdown pack should be extended to include the governance elements from the Word docs (backup requirements, rollback, evidence stages, named owners, review schedule). The Word docs do not need to be replaced — they remain the published v1.0 reference.

---

## 4. Specific Gaps Found in Word Docs — "OWNER INPUT REQUIRED"

The Word docs themselves flag these as incomplete. Piranav and Sathees must resolve:

| Gap | Location | What is needed |
|---|---|---|
| PageSpeed performance regression tolerance | CRO + Theme Customization handbooks | Define: e.g. "maximum 5-point Lighthouse mobile score drop allowed" |
| Conversion rate uplift KPI target | CRO handbook | Define: e.g. "target 0.5% CR increase over 30 days" |
| WCAG conformance level per client | Accessibility handbook | Confirm: WCAG AA (working default) or stricter per client |
| Monthly review owner for crawl errors | Fix Crawl Errors handbook | Name the person responsible for monthly GSC review |

---

## 5. Two Versions of "Fix Crawl Errors" — Anomaly

There are two Word docs covering the same topic:

| File | Style | Notes |
|---|---|---|
| `Fix Shopify Crawl Errors.docx` | Process-oriented, longer | Broader scope — DNS, SSL, app permissions |
| `Fix_Crawl_Errors_BGCT_Handbook.docx` | Structured handbook with gap callouts | Contains ⚠️ CRITICAL GAP annotations — clearly a revised/improved version |

**Recommendation:** `Fix_Crawl_Errors_BGCT_Handbook.docx` is the more complete version. Treat it as authoritative. The other file is a first draft.

---

## 6. Recommended Next Actions

| Priority | Action | Owner |
|---|---|---|
| High | Add backup + rollback requirements to markdown Tutorial files | Sajeesan (after review) |
| High | Add evidence stage tables to markdown Guidelines files | Piranav |
| High | Resolve the 4 "OWNER INPUT REQUIRED" gaps in Word docs | Piranav + Sathees |
| Medium | Copy the Word docs into `docs/BGCT 2026/word-docs-original/` for version control | Piranav |
| Medium | Name the monthly review owner for each topic | Sathees |
| Low | Retire `Fix Shopify Crawl Errors.docx` (first draft) in favour of `Fix_Crawl_Errors_BGCT_Handbook.docx` | Sathees |

---

## 7. Owner Summary

| Topic | Word Doc Owner | Word Doc Validator | Markdown Pack Owner |
|---|---|---|---|
| SEO (all) | Piranav | Muguntha | Piranav (DRAFT) |
| CRO | Kuberan — Technical Team | Muguntha — TL | Piranav (DRAFT) |
| Design & Layout | Kuberan — Technical Team | Muguntha — TL | Piranav (DRAFT) |
| Accessibility | Kuberan — Technical Team | Muguntha — TL | Piranav (DRAFT) |
| Theme Customization | Kuberan — Technical Team | Muguntha — TL | Piranav (DRAFT) |
