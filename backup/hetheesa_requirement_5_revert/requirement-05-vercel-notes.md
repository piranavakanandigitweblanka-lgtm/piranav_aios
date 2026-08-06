---
name: requirement-05-vercel-notes
description: Vercel deployment notes for Requirement 5 — Internal Links Pointing to Shopify Domain. Confirms no Vercel deployment was required; dashboard is served from the local AIOS static HTML file.
metadata:
  type: project
---

# Requirement 5 — Vercel Notes
## Internal Links Pointing to Shopify Domain

**Title:** Vercel Deployment Notes — Requirement 5  
**Purpose:** Record deployment status and any Vercel-specific considerations for Requirement 5  
**Requirement Source:** SEO Google Sheet — Requirement 5 / Last 3 Months / All Collection and Product Pages / Monthly Internal Linking Audit  
**Staff Member:** Hetheesa  
**Business Question:** Which internal links on ledsone.fr still point to the Shopify myshopify.com domain?  
**PostgreSQL Source Checked:** Not required  
**Other Data Sources Checked:** Shopify Admin GraphQL + live page fetch  
**Audit Date:** 2026-07-07  

---

## Deployment Status

| Item | Status |
|---|---|
| Vercel deployment required | No — not required for this requirement |
| Dashboard file | Static HTML — `Staff-requirements/pages/hetheesha.html` |
| Data loading | Inline JavaScript data array (`R5=[...]`) — no API calls at runtime |
| External dependencies | None — all data is embedded in the HTML |
| Auto-refresh | Not required — data is static per audit run |

---

## Why No Vercel Deployment

Requirement 5 is a **read-only audit dashboard** embedded inside the existing `hetheesha.html` static file. All data is embedded as a JavaScript array at audit time. No server, API, or deployment pipeline is needed to view the dashboard.

The dashboard is accessed locally at:
`C:\Users\PC\Documents\piranav_aios\Staff-requirements\pages\hetheesha.html`

If this file is ever deployed to Vercel as part of the AIOS staff portal, no additional Vercel configuration is required beyond the existing static file hosting setup.

---

## If Deployed to Vercel

If the AIOS staff portal is deployed to Vercel:
- No environment variables required
- No API routes required
- File is pure HTML/CSS/JS — deploys as-is
- Build command: none (static file)
- Output directory: `Staff-requirements/pages/`

---

## Files Created / Modified

| File | Action |
|---|---|
| `Staff-requirements/pages/hetheesha.html` | Updated — Requirement 5 section added |
| `vercel/hetheesa/requirement-05-vercel-notes.md` | Created (this file) |

---

## Evidence Path
`C:\Users\PC\Documents\piranav_aios\evidence\hetheesa\requirement-05-shopify-domain-links-audit.md`

## Validation Result
✅ PASS — No deployment needed; dashboard functional as static file

## Reviewer
Piranav (GPT Coordinator)

## Status
COMPLETE — 2026-07-07

## Known Limitations
- If Vercel AIOS portal is set up in future, this file will need to be included in the portal's static file directory

## Next Step
No Vercel action required for this requirement.

## PASS / FAIL
**✅ PASS**
