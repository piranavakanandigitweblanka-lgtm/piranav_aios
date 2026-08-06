---
name: requirement-05-internal-links-shopify-domain-prompt
description: Prompt record for Requirement 5 — Internal Links Pointing to Shopify Domain. Documents the requirement source, business question, and execution approach for monthly re-runs.
metadata:
  type: project
---

# Requirement 5 — Prompt Record
## Internal Links Pointing to Shopify Domain

**Staff Member:** Hetheesa  
**Prompt Created:** 2026-07-07  
**Requirement Source:** SEO Google Sheet — Requirement 5  
**Frequency:** Monthly Internal Linking Audit  

---

## Business Question
Are any internal links on ledsone.fr still pointing to the Shopify myshopify.com domain (jedsz8-km.myshopify.com) instead of the custom domain ledsone.fr?

## Audit Scope
- Last 3 months
- All Collection and Product Pages
- Main Navigation
- Footer
- Breadcrumb links
- Related product blocks
- Blog body links

## Bad Domain Pattern
`myshopify.com`

## Target Domain
`https://ledsone.fr/`

## Data Sources
1. Shopify Admin GraphQL — `{ menus(first: 10) { edges { node { handle title items { title url } } } } }`
2. Live page fetch — ledsone.fr homepage, collections, products, blog, contact

## Execution Steps (for monthly re-run)
1. Query Shopify Admin GraphQL menus — check all items for myshopify.com URLs
2. Fetch 5–10 live pages — check nav, footer, breadcrumb, product body, blog body
3. Record all myshopify.com links with correct ledsone.fr replacement
4. Update hetheesha.html tab-panel-5 with new data
5. Save updated evidence + validation files

## Result (2026-07-07)
- **2 unique bad links found** in Lumières menu (sitewide nav + footer = 4 instances)
- **0 blog/product/collection body links** with myshopify.com
- **Fix required:** Shopify Admin → Navigation → Lumières menu → update 2 items
