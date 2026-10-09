# Guidelines — Shopify-Specific SEO

**Status:** DRAFT
**Sheet:** Shopify-Specific SEO (BGCT workbook, Sheet 4)
**Tasks covered:** SH-1 through SH-6
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx`
**Last updated:** 2026-10-09

---

## SH-1 — Collection URL Structure

| Rule | Detail |
|---|---|
| **Format** | `/collections/[target-keyword]` — lowercase, hyphen-separated, no stop words. |
| **Do not change ranked URLs** | If a collection URL currently appears in Google positions 1–20 for any target keyword, do not change the handle without a coordinator/business validator sign-off. |
| **Redirect required on handle change** | Accept Shopify's automatic redirect prompt every time a handle is changed. |
| **No auto-generated handles** | Review handles when creating new collections — do not accept the default if it is not keyword-optimised. |
| **Escalation: Coordinator** | Changing a handle on a top-ranking collection page requires coordinator approval before action. |

---

## SH-2 — Product URL Structure

| Rule | Detail |
|---|---|
| **Root URL only in theme** | All `<a>` tags linking to products must use `{{ product.url }}`, not `{{ product.url | within: collection }}`. |
| **Canonical in theme.liquid** | Must be `<link rel="canonical" href="{{ canonical_url }}">`. |
| **Breadcrumb navigation** | If breadcrumbs relied on the collection-scoped URL path, update breadcrumb rendering after fixing product links. |
| **Escalation: Developer** | This fix requires editing Liquid files. Confirm with developer before changing product card templates in live themes. |
| **Safe boundary** | Always make this change on a duplicate theme first. Test extensively on collection and product pages before publishing. |

---

## SH-3 — Pagination Handling

| Rule | Detail |
|---|---|
| **Standard `<a href>` links required** | All paginated pages must have crawlable anchor links. |
| **Self-referencing canonical per page** | `?page=2` must have `canonical = current URL including ?page=2`. Not page 1. |
| **Meta title uniqueness** | Add "— Page [N]" to meta titles on pages 2+. |
| **Prohibited** | Noindexing paginated pages. Canonical from all pages to page 1. JS-only pagination with no HTML fallback. |
| **Escalation: Developer** | Pagination canonical logic in theme.liquid requires developer review to ensure conditional `?page=` parameter is appended correctly. |

---

## SH-4 — Infinite Scroll Fixes

| Rule | Detail |
|---|---|
| **Hidden pagination fallback required** | Standard pagination HTML `<div>` must exist in the DOM, even if visually hidden. |
| **History API URL update required** | `history.pushState()` must update the browser URL as user scrolls. |
| **JS disabled test required** | Test with JavaScript disabled to confirm standard pagination is still functional. |
| **Preferred alternative** | A "Load More" button is preferred over true auto-infinite scroll for SEO and accessibility. |
| **Escalation: Developer** | Infinite scroll implementation requires developer involvement. Do not attempt without developer. |

---

## SH-5 — Duplicate URLs from Faceted Navigation

| Rule | Detail |
|---|---|
| **Default: noindex all filter combinations** | Unless a specific filter combination has confirmed search demand, apply `noindex, follow`. |
| **Exception: single high-value filter** | A single Brand or Type filter with search demand may be indexed. Confirm with team before allowing. |
| **Never noindex AND remove links** | Noindex removes from index but Google must still be able to reach the page. Keep links; add noindex. |
| **Block multi-filter combinations** | URLs with 2+ filter parameters applied simultaneously must always be noindexed. |
| **Escalation: Business Validator** | Creating a dedicated collection page for a high-value filter combination requires business/product approval. |

---

## SH-6 — Blog SEO Optimization

| Rule | Detail |
|---|---|
| **Target keyword per article** | Every article must have a defined target keyword before writing begins. |
| **Minimum internal links** | At least 2–3 internal links per article to relevant collection or product pages. |
| **Author bio required** | Every published article must have a named author with a brief bio (E-E-A-T). |
| **Annual review** | All articles older than 12 months must be reviewed and updated annually. |
| **Format requirements** | H2 and H3 headings, at least one image, no walls of unformatted text. |
| **Article schema** | JSON-LD Article schema must be present on all blog posts. |
| **Escalation: Business Validator** | Publishing claims about products (e.g., "best", safety certifications) requires business validator sign-off. |
