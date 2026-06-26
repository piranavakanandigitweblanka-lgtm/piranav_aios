# ARCHITECTURE — UI UX Pro Max Skill

---

## Purpose of This File

This document maps the full structure of the UI UX Pro Max Skill — its 8 domains, all task areas, their importance scores, and how the content model is organised. Use this file to quickly locate the relevant domain and task without reading the full source guide.

---

## Content Model

Each task entry in the source guide follows this structure:

| Field | Description |
|---|---|
| **Explanation** | What the task is and why it matters |
| **Importance Score** | Priority weight out of 25 — higher = more critical |
| **Best Practice** | The recommended approach |
| **Guideline** | The rule to apply |
| **Checklist** | Tick-box verification steps |
| **Tutorial (Shopify)** | Step-by-step Shopify Admin / Liquid implementation |
| **Do's and Don'ts** | Common correct and incorrect approaches |

---

## Domain Map

### Domain 1 — Technical SEO

> Foundational crawlability and indexing. Fix these first — they affect all other SEO work.

| Task | Importance | Key Action |
|---|---|---|
| 1.1 Fix crawl errors, broken links (404s), redirect chains | 22/25 | Single-hop 301 redirects, GSC monitoring |
| 1.2 Optimise robots.txt and sitemap.xml | 24/25 | Block cart/checkout/search from crawlers |
| 1.3 Canonical tag audits & fixes | 25/25 | Point all product canonicals to `/products/name` |
| 1.4 Hreflang setup for multilingual stores | 20/25 (25/25 if international) | Use Shopify Markets for automation |

---

### Domain 2 — On-Page SEO

> Content signals for search engines. Affects click-through rate and keyword rankings.

| Task | Importance | Key Action |
|---|---|---|
| 2.1 Meta titles & descriptions optimisation | 23/25 | Unique, keyword-led, under 60/160 chars |
| 2.2 Heading structure (H1–H6) cleanup | 21/25 | Exactly one H1 per page |
| 2.3 Image alt text audits | 18/25 | Descriptive, no keyword stuffing |
| 2.4 Schema/structured data (Product, Breadcrumb, FAQ, Review) | 24/25 | JSON-LD, validate with Rich Results Test |
| 2.5 Duplicate content fixes | 22/25 | Canonical tags, noindex filter URLs |

---

### Domain 3 — Performance (Core Web Vitals)

> Google ranking signals. Affects both SEO and user experience directly.

| Task | Importance | Key Action |
|---|---|---|
| 3.1 Page speed audits (LCP, CLS, FID/INP) | 25/25 | LCP < 2.5s, CLS < 0.1, INP < 200ms |
| 3.2 Image compression & lazy loading | 23/25 | Eager-load LCP image, lazy-load all others |
| 3.3 Unused JS/CSS removal | 22/25 | Audit app remnants in theme.liquid |
| 3.4 Third-party script impact analysis | 21/25 | Delay non-essential scripts post-interaction |

---

### Domain 4 — Shopify-Specific SEO

> Shopify platform peculiarities that cause common SEO errors if not handled.

| Task | Importance | Key Action |
|---|---|---|
| 4.1 Collection & product URL structure | 25/25 | Use `product.url` not `product.url \| within: collection` |
| 4.2 Pagination handling | 19/25 | Self-referencing canonicals on `?page=N` |
| 4.3 Duplicate URLs from faceted navigation / filters | 23/25 | Noindex multi-param filter URLs |
| 4.4 Blog SEO optimisation | 20/25 | Long-tail keywords, Article schema, internal links |

---

### Domain 5 — Design & Layout

> Visual and structural UX. Affects conversions and user trust.

| Task | Importance | Key Action |
|---|---|---|
| 5.1 Homepage, collection, product page layout improvements | 24/25 | Visual hierarchy: product → price → CTA |
| 5.2 Mobile responsiveness fixes | 25/25 | Mobile-first, 44×44px tap targets, 16px min body text |
| 5.3 CTA placement & design | 25/25 | High-contrast, above-fold, one primary CTA per view |
| 5.4 Typography & colour consistency | 20/25 | 2 font families max, WCAG AA contrast |

---

### Domain 6 — Conversion Optimisation (CRO)

> Remove purchase friction. Highest direct revenue impact.

| Task | Importance | Key Action |
|---|---|---|
| 6.1 Cart & checkout flow improvements | 25/25 | Drawer cart, express checkout, visible shipping cost |
| 6.2 Product page trust signals | 24/25 | Reviews near CTA, return guarantees, secure checkout badges |
| 6.3 Sticky headers, floating cart, quick view | 19/25 | Sticky header compact; no floating element over Add to Cart |
| 6.4 Upsell / cross-sell UI | 23/25 | Relevant recommendations, in-cart upsells |

---

### Domain 7 — Theme Customisation

> Technical Liquid / theme development patterns. Used when a fix requires code-level changes.

| Task | Importance | Key Action |
|---|---|---|
| 7.1 Liquid template edits | 18/25 | Backup theme first; conditional Liquid logic |
| 7.2 Custom sections & blocks | 22/25 | JSON schema with settings/presets; no hardcoded content |
| 7.3 Navigation menu restructuring | 24/25 | Mega menu for deep catalogs; 5–7 top-level items max |
| 7.4 Footer & header redesigns | 20/25 | Header: Logo + Menu + Search + Account + Cart |

---

### Domain 8 — Accessibility

> Legal compliance and inclusive design. Also a ranking signal via Core Web Vitals.

| Task | Importance | Key Action |
|---|---|---|
| 8.1 Colour contrast fixes | 22/25 | WCAG 2.1 AA: 4.5:1 normal text, 3:1 large text |
| 8.2 Keyboard navigation | 21/25 | Remove `outline: none` from `:focus`; add "Skip to content" link |
| 8.3 ARIA label improvements | 20/25 | Label all icon-only buttons; toggle `aria-expanded` |

---

## Importance Score Priority Grid

Use this to prioritise which tasks to run first when entering a new store or audit:

| Score | Priority | Action |
|---|---|---|
| 25/25 | Critical | Fix before all other work |
| 23–24/25 | High | Fix in same sprint |
| 20–22/25 | Medium | Schedule in next sprint |
| 18–19/25 | Normal | Fix opportunistically or when flagged |

**Tasks scored 25/25:**
- Canonical tag audits (1.3)
- Page speed / Core Web Vitals (3.1)
- Collection & product URL structure (4.1)
- Mobile responsiveness (5.2)
- CTA placement & design (5.3)
- Cart & checkout flow (6.1)

---

## Source File Reference

| Asset | Path |
|---|---|
| Full source guide | `C:\Users\PC\Desktop\shopify_seo_ui_ux_guide.md` |
| Source PowerPoint | `docs/ai-tools/ui-ux-pro-max-skill/uiux-skill-shopify-final.pptx` |

The source guide is the single source of truth for checklists and tutorials. This architecture document is a navigation aid only — it does not replace the source guide.

---

## Owner / Reviewer

| Role | Name |
|---|---|
| Authored | piranav |
| Reviewer | Varmen |
| Last Updated | 2026-06-26 |
