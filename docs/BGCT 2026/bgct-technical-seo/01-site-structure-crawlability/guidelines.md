# Guidelines — Site Structure & Crawlability

**Status:** DRAFT
**Sheet:** Site Structure & Crawlability (BGCT workbook, Sheet 1)
**Tasks covered:** SS-1 through SS-7
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx`
**Last updated:** 2026-10-09

---

## How to Use These Guidelines

These rules determine **what action to take** and **when to escalate**. Read them before starting any audit or fix in this category. The checklist file provides the specific steps; these guidelines set the decision boundaries.

---

## SS-1 — Fix Crawl Errors

| Rule | Detail |
|---|---|
| **Priority: Critical** | 5xx server errors must be investigated within 24 hours of discovery. |
| **Priority: High** | Access errors (403) must be resolved within the same sprint. |
| **Priority: Low** | Isolated 404s on non-linked pages can be logged and batched. |
| **Escalation: Developer** | All 5xx errors require developer investigation. Do not attempt to fix server errors in the theme. |
| **Escalation: Shopify Support** | If 5xx errors are confirmed to be on Shopify's infrastructure (not app-level), contact Shopify Support with GSC screenshots. |
| **Safe boundary** | Do not change server configuration or DNS settings without developer approval. |
| **Source reference** | https://help.shopify.com/en/manual/promoting-marketing/seo |

---

## SS-2 — Broken Links (404s)

| Rule | Detail |
|---|---|
| **Decision rule** | Before deleting any product or page: search for inbound links (GSC → Links, Ahrefs) and set up a 301 redirect if any exist. |
| **Redirect target rule** | Redirect to the most relevant equivalent page. Never redirect to the homepage unless there is no relevant equivalent. |
| **Volume threshold** | If a crawl reveals more than 50 new 404s, treat as a systematic issue requiring a bulk redirect import. |
| **Escalation: Business approval** | If redirecting from a URL that is still receiving paid traffic (Google Ads, emails), confirm with the campaign owner before proceeding. |
| **Safe boundary** | Never delete a product that is referenced in an active ad campaign without confirming with the campaign team first. |

---

## SS-3 — Redirect Chains

| Rule | Detail |
|---|---|
| **Maximum chain length** | 1 hop (A → C directly). Any chain of 2+ hops must be collapsed. |
| **Annual audit** | Review the full Shopify URL Redirects list at least once per year. |
| **Loop detection** | A redirect loop (A → B → A) renders the page inaccessible. Treat as severity: Critical. Fix immediately. |
| **Escalation: Developer** | Redirect loops on canonical URLs may indicate a theme conflict and require developer investigation. |
| **Safe boundary** | Do not batch-delete redirects without confirming they are not still receiving external inbound links. |

---

## SS-4 — Optimize robots.txt

| Rule | Detail |
|---|---|
| **Always disallow** | `/cart`, `/checkout`, `/account`, `/orders` |
| **Always disallow** | `/search` with parameters (e.g., `Disallow: /search`) |
| **Conditionally disallow** | `/collections/all` — only if it does not rank for any target keyword. Check GSC before disallowing. |
| **Never disallow** | `/collections/`, `/products/`, CSS files, JS files. |
| **Mandatory test** | After every change: test using GSC → Settings → robots.txt tester. Do not publish without testing. |
| **Escalation: Developer + Coordinator** | Any change to `Disallow: /` scope requires developer and coordinator approval before deployment. |
| **Escalation: Emergency** | If the entire site drops from Google index, check robots.txt first. A broad `Disallow:` rule is the most common cause. |
| **Safe boundary** | Always edit `robots.txt.liquid` on a **duplicate theme** first. Test on the staging theme before publishing to live. |

---

## SS-5 — Optimize sitemap.xml

| Rule | Detail |
|---|---|
| **Submission rule** | Submit to Google Search Console and Bing Webmaster Tools within 48 hours of a new store going live. |
| **Exclusion rule** | Hide any page from Shopify search engines (seo.hidden metafield = 1) if it should not be indexed. This removes it from both the index and the sitemap. |
| **Contradiction rule** | A URL must not appear in the sitemap AND have a `noindex` meta tag simultaneously. Pick one: either exclude from sitemap, or noindex. |
| **Monitoring schedule** | Review GSC → Indexing → Sitemaps monthly for "submitted but not indexed" counts. |
| **Escalation: Developer** | If a large number of product pages are submitted but not indexed and no technical reason is apparent, escalate to developer to check for crawl anomalies or thin content signals. |

---

## SS-6 — Canonical Tag Audits & Fixes

| Rule | Detail |
|---|---|
| **Every indexed page must have a canonical tag** | No exceptions. Verify via View Page Source → search `canonical`. |
| **Canonical must resolve to a 200 URL** | Never point a canonical to a 301, 302, or 404. Fix the target URL if broken. |
| **Self-referencing canonical required** | Main pages (homepage, collection pages, product pages) must all have a self-referencing canonical. |
| **Collection-scoped product URL rule** | Fix internal links in product card Liquid to use `{{ product.url }}` not `{{ product.url | within: collection }}`. |
| **Escalation: Developer** | If a canonical tag appears to be injected by a third-party app and conflicts with the theme, developer must resolve the conflict. Two canonical tags in `<head>` = priority bug. |
| **Safe boundary** | Do not change the canonical logic in `theme.liquid` directly. Work in a duplicate theme and test with View Source before publishing. |

---

## SS-7 — Hreflang Setup for Multilingual

| Rule | Detail |
|---|---|
| **Use Shopify Markets** | This is the approved implementation method. Do not hardcode hreflang tags manually. |
| **Reciprocal tags required** | If Page A references Page B, Page B must reference Page A. One-way hreflang is treated as invalid by Google. |
| **x-default required** | Every hreflang implementation must include `x-default` pointing to the primary/fallback language URL. |
| **ISO format required** | Use exact ISO codes: `en-GB`, `en-US`, `fr-FR`. Using `en` alone is imprecise and may not target correctly. |
| **Escalation: Developer + Coordinator** | Any manual hreflang implementation (outside Shopify Markets) requires developer + coordinator approval. |
| **Safe boundary** | Do not implement hreflang across a live multi-language store without testing on a staging environment first. Incorrect hreflang can cause ranking drops in target markets. |
| **Verification tool** | Use https://technicalseo.com/tools/hreflang/ to validate tags after implementation. |
