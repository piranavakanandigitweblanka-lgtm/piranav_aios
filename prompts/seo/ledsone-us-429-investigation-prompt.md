# Prompt: LEDSone US HTTP 429 Investigation
**Category:** SEO / Technical SEO
**Registered:** 2026-10-20
**Status:** Active

---

## Reusable Prompt

You are an execution agent for Piranav's AIOS. Investigate a Screaming Frog HTTP 429 discrepancy for a Shopify store.

**Source files:**
1. Excel workbook containing the original Screaming Frog crawl export (Sheet named "Internal Link Error - 429 Error"). Columns: A=URL, B=Content Type, C=Status Code, D=Status, E=Indexability, F=Indexability Status. Column H contains a Google Sheets `=getstatuscode()` retest formula (not valid in Excel). Column I is a comparison column.
2. PDF investigation report describing tests performed, evidence sections A–K, findings, and limitations.

**Objective:** Build a traceable investigation that distinguishes verified facts, hypotheses, unknowns, and next validation steps. Do not assume the root cause is known. Do not implement website changes.

**Required outputs:**
- Investigation summary with scope, question, source map, verified facts, hypotheses, unknowns, and decision rules
- Full URL register (all affected URLs, original status, retest columns for later population)
- Controlled retest validation plan (GSC Live Test → PowerShell with header capture → optional SF small crawl)
- Handover note with remaining actions and accountable next step

**Technical context:**
- HTTP 429 = Too Many Requests; may indicate rate limiting; cause must be confirmed by evidence, not assumed
- GET requests the full page body; HEAD requests headers only
- GSC indexed status ≠ guaranteed success on every future crawl
- The Google Sheets `getstatuscode()` formula is a custom Apps Script function; it returns `#NAME?` in Excel
- Screaming Frog free/lite licence locks speed and user-agent settings
- Original crawl response headers were not stored

**Safety rules:**
- Do not modify the source Excel or PDF files
- Do not change the live website, Shopify theme, or server settings
- Do not commit or push without explicit permission
- Do not mark the investigation as PASS until Phase 1 (GSC) and Phase 2 (PowerShell) retests are complete for product and collection URL types

---

## Key technical facts for this specific investigation

- Workbook: "Robesan - DigitWeb Lanka.xlsx", Sheet2 "Internal Link Error - 429 Error"
- 117 affected URLs (rows 2–118); all status 429 in original crawl
- Sample URL: `https://ledsone.us/blogs/news/halloween-lighting-ideas-2026` (row 2)
- Original crawl rate displayed in SF: avg 9.76 URLs/s, current 12.90 URLs/s
- Retest evidence file: `evidence/shopify/ledsone-us/ledsone-us-429-investigation-2026-10-19.md`
- URL register: `reports/ledsone-us/ledsone-us-429-url-register-2026-10-19.md`
- Validation plan: `validation/piranav/ledsone-us-429-validation-plan-2026-10-19.md`
