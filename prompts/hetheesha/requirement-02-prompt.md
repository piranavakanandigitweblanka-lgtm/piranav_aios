# Prompt Capture — Requirement 02 — Collection Performance Dashboard
**Rule 12 compliance — permanent GPT prompt capture**  
**Date:** 2026-07-06  
**Staff:** Hetheesha  
**Store:** ledsone.fr  

---

## Prompt Summary

Implement Requirement 2: Create a Collection Performance Dashboard for ALL Shopify Collection pages.

Dashboard must be completely data-driven. Inspect Shopify, PostgreSQL, Google Search Console and GA4.

### Required Columns
Collection URL · Word Count · Thin Content Flag · Meta Title Status · Meta Description Status · H1 Status · FAQ Schema Status · Internal Links Pointing In · Organic Sessions · CTR · Conversion Rate · Revenue (30d)

### Status Rules
- Word Count: ≥200 Green · 100–199 Yellow · <100 Red
- Thin Flag: <100 = Thin Red · ≥100 = OK Green
- Meta Title: Missing=Red · <30=Too Short Yellow · 30–70=OK Green · >70=Too Long Yellow
- Meta Desc: Missing=Red · >160=Too Long Yellow · 120–160=OK Green
- H1: Missing=Red · Doesn't match keyword=Yellow · Matches=Green
- FAQ Schema: Use custom.faq_schema metafield · Present=Green · Missing=Red
- Internal Links: 0=Red · 1–2=Yellow · ≥3=Green

### Dashboard Features
Professional UI · Responsive · Sticky header · Search · Filters · Sort · Export CSV · Status cards · Color coding

---

## Execution Notes

- **Existing assets:** None found for Req 02 before execution
- **Shopify:** 66 collections fetched (2 GraphQL pages)
- **PostgreSQL GSC source:** google_search_console.gsc_web_page (660K rows)
- **PostgreSQL GA4 source:** ga4_organic_landing_page_revenue — ledsone.co.uk only, NOT ledsone.fr
- **Word count method:** descriptionHtml stripped of all HTML/CSS tags, Python word split
- **Internal links:** Python regex parse of all descriptionHtml across 66 collections
- **FAQ metafield:** custom.faq_schema — only 2 collections have it (lumiere-daraignee, decor-led)
- **GA4/Revenue result:** Not available for ledsone.fr in DB — documented as N/A

**Status:** PASS
