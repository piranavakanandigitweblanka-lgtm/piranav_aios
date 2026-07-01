# Prompt: Shopify SEO 13-Strategy Discovery Audit

---

## Title
Shopify SEO 13-Strategy Discovery Audit

## Purpose
Full SEO discovery audit across 13 standard strategies for a Shopify store — covering technical SEO, on-page, schema, content, and E-E-A-T. Produces a status/evidence/gap/priority table per strategy. Discovery only — no changes made.

## Business Question
> "Across all 13 SEO strategies, what is the current status of this store, what evidence exists for each verdict, and which gaps are highest priority to fix?"

## When to Use
- First-time audit of any store in the piranav portfolio
- Before starting an SEO sprint on a store
- When a store's organic traffic has dropped or stalled
- When onboarding a new store for the Website Tec team

## Pre-conditions
- Store URL must be live and crawlable
- At minimum 15 representative URLs must be sampled: homepage, 3+ collections, 3+ products, 1+ blog posts, sitemap, about, FAQ
- Check `evidence/README.md` — confirm no prior full SEO audit exists for this store

---

## Prompt Text

```
You are performing a full 13-strategy SEO discovery audit for a Shopify store.

Store: [STORE URL]
Theme: [THEME NAME]
Date: [DATE]
Scope: Discovery only — do not modify any files.

Sample these URL types:
- Homepage
- 3 collection pages (high-traffic)
- 3 product pages (high-traffic)
- 1 blog post
- /sitemap.xml
- /pages/about (or equivalent)
- /pages/faq (or equivalent)

Audit each of the following 13 strategies and return a table row per strategy:

Strategies:
1. Technical SEO (crawl errors, robots.txt, canonicals, hreflang)
2. On-Page SEO (meta titles, H1, alt text, heading structure)
3. Schema / Structured Data (Product, BreadcrumbList, FAQPage, SearchAction, Article)
4. Core Web Vitals (LCP, CLS, INP — use PageSpeed Insights or Lighthouse data available)
5. Shopify URL Structure (collection URLs, pagination, faceted nav, handle quality)
6. Content Strategy (Hub & Spoke, content depth, thin content)
7. Keyword Gap (missing search demand, category pages not yet built)
8. E-E-A-T (author attribution, bios, credentials, trust signals)
9. Internal Linking (orphan pages, breadcrumbs, related products)
10. Image SEO (alt text, file names, WebP usage, lazy loading)
11. Blog & Content SEO (blog handle structure, post frequency, crawl budget)
12. Entity SEO (brand entity, product entity completeness in schema)
13. Revenue Attribution (conversion tracking, goal tracking, search console setup)

Output format per strategy:

| Strategy | Status | Evidence | Gap | Priority |
|---|---|---|---|---|
| 1. Technical SEO | PASS / FAIL / PARTIAL | [what was found] | [what is missing] | HIGH/MED/LOW |

After the table, add:
## Critical Findings (FAIL items only)
## Top 5 Priority Fixes
## Duplicate Truth Risk (any conflicting signals found, e.g. dual blog handles)
## Next Session Action
```

---

## Expected Claude Output
- 13-row status table with evidence + gap + priority
- Critical findings section
- Top 5 priority fix list
- Duplicate truth risk note
- Next session action

## Evidence Required
- Evidence file: `evidence/audits/[store]-seo-strategy-audit-[date].md`
- Index row in `evidence/README.md`
- Closure entry in `closure/README.md`

## Pass/Fail Rule
PASS: All 13 strategies assessed with evidence. No strategy left blank.
FAIL: Any strategy row missing a status verdict, or audit covers fewer than 10 strategies.

## Related Tasks
- `prompts/implementation/shopify-lighthouse-accessibility-fix.md`
- Pattern: `shopify-seo-13-strategy-audit` (from 2026-06-15 session)

## Status
ACTIVE

## Last Updated
2026-07-01

## Source Evidence
- `closure/sessions/2026-06-15.md` — ledsone.co.uk 13-strategy audit; 15+ URLs crawled; E-E-A-T CRITICAL gap found
- `evidence/audits/ledsone-seo-strategy-audit-2026-06-15.md`
