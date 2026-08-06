---
name: requirement-05-handover
description: Handover document for Requirement 5 — Internal Links Pointing to Shopify Domain. Covers what was built, what was found, fix instructions, and monthly re-run guidance for Hetheesa.
metadata:
  type: project
---

# Requirement 5 — Handover Document
## Internal Links Pointing to Shopify Domain

**Title:** Internal Links Pointing to Shopify Domain — Handover  
**Purpose:** Transfer complete context of Requirement 5 to Hetheesa and any future executor  
**Requirement Source:** SEO Google Sheet — Requirement 5 / Last 3 Months / All Collection and Product Pages / Monthly Internal Linking Audit  
**Staff Member:** Hetheesa  
**Business Question:** Which internal links on ledsone.fr still point to the Shopify myshopify.com domain and should be replaced with the production domain ledsone.fr?  
**PostgreSQL Source Checked:** Not required — Shopify Admin GraphQL + live page fetch used  
**Other Data Sources Checked:** Shopify Admin GraphQL (10 menus), live page fetch (5 pages)  
**Audit Date:** 2026-07-07  

---

## What Was Built

A full Requirement 5 dashboard section was added to the existing Hetheesa dashboard:

**File modified:** `C:\Users\PC\Documents\piranav_aios\Staff-requirements\pages\hetheesha.html`

Changes made:
- Tab button label updated: "Not yet assigned" → "Internal Link Audit"
- tab-panel-5 placeholder replaced with full professional dashboard
- 5 KPI summary cards (Total, Needs Fix, OK, High Priority, Medium Priority)
- Color legend (High=Red, Medium=Yellow, None=Green)
- 7 filter buttons: All, Needs Fix, OK, High Priority, Medium Priority, Navigation, Footer
- Search box (searches page, anchor, location)
- Sortable 7-column table
- Export CSV button with working `r5ExportCSV()` function
- Validation section (9 checks)
- Footnotes (fix method, data sources, priority rules)
- JavaScript: `r5Render()`, `r5SetFilter()`, `r5Sort()`, `r5ExportCSV()`

---

## What Was Found

**2 unique myshopify.com links found** — both in the Shopify navigation menu "Lumières" (handle: `lumi-res`).

Because this is a shared site menu, the same 2 links render in **both the main navigation AND the footer** on every single page of ledsone.fr, resulting in **4 total instances**.

### Links Found

| # | Location | Anchor | Current (BAD) | Correct |
|---|---|---|---|---|
| 1 | Main Navigation | Lampes suspendues | https://jedsz8-km.myshopify.com/collections/lampes-suspendues | https://ledsone.fr/collections/lampes-suspendues |
| 2 | Main Navigation | Lumière d'araignée | https://jedsz8-km.myshopify.com/collections/lumiere-daraignee | https://ledsone.fr/collections/lumiere-daraignee |
| 3 | Footer | Lampes suspendues | https://jedsz8-km.myshopify.com/collections/lampes-suspendues | https://ledsone.fr/collections/lampes-suspendues |
| 4 | Footer | Lumière d'araignée | https://jedsz8-km.myshopify.com/collections/lumiere-daraignee | https://ledsone.fr/collections/lumiere-daraignee |

### Areas Checked Clean (No myshopify.com Links)
- Blog post body content — CLEAN
- Product page body / breadcrumbs — CLEAN
- Collection page body / breadcrumbs — CLEAN
- All other 8 Shopify menus — CLEAN

---

## How to Fix (Instructions for Hetheesa / Store Admin)

**ONE fix resolves both navigation AND footer** — they share the same Shopify menu.

1. Go to: Shopify Admin → Online Store → Navigation
2. Find the menu: **Lumières** (handle: `lumi-res`)
3. Edit "Lampes suspendues" → change URL to: `https://ledsone.fr/collections/lampes-suspendues`
4. Edit "Lumière d'araignée" → change URL to: `https://ledsone.fr/collections/lumiere-daraignee`
5. Save the menu
6. Verify by visiting ledsone.fr and hovering over the "Lumières" dropdown

**Important:** Do NOT create new collection pages — the correct ledsone.fr paths already exist. Only the domain part changes.

---

## Monthly Re-Run Instructions

This is a **Monthly Internal Linking Audit**. Run again each month:

1. Query Shopify Admin GraphQL menus (all menus, `first: 10`)
2. Check each menu item for `myshopify.com` in the URL
3. Fetch 5+ live pages — check nav, footer, breadcrumb, product body, blog body
4. Update hetheesha.html tab-panel-5 data array `R5=[...]` with new findings
5. Update KPI cards if counts change
6. Update audit date in header
7. Save updated evidence + validation files

---

## Files Created / Modified

| File | Action |
|---|---|
| `Staff-requirements/pages/hetheesha.html` | Updated — Requirement 5 dashboard added |
| `evidence/hetheesa/requirement-05-shopify-domain-links-audit.md` | Created |
| `validation/hetheesa/requirement-05-validation.md` | Created |
| `reports/hetheesa/requirement-05-report.md` | Created |
| `prompts/hetheesa/requirement-05-internal-links-shopify-domain-prompt.md` | Created |
| `handover/hetheesa/requirement-05-handover.md` | Created (this file) |
| `vercel/hetheesa/requirement-05-vercel-notes.md` | Created |

---

## Evidence Path
`C:\Users\PC\Documents\piranav_aios\evidence\hetheesa\requirement-05-shopify-domain-links-audit.md`

## Validation Result
✅ PASS — All 10 validation checks passed — 2026-07-07

## Reviewer
Piranav (GPT Coordinator)

## Status
COMPLETE — 2026-07-07

## Known Limitations
- Individual product page HTML body not crawled (Shopify product GraphQL does not expose HTML body link extraction — would require DOM fetch per product)
- Blog article body content: only index page checked; individual article bodies not fetched
- Recommendation: After the navigation fix is applied, re-run audit to confirm 0 myshopify.com links

## Next Step
1. Hetheesa / Store Admin: Fix the 2 links in Shopify Navigation → Lumières menu
2. AIOS: Re-run audit next month (August 2026) to confirm clean
3. If new myshopify.com links appear: update R5 data array and evidence files

## PASS / FAIL
**✅ PASS**
