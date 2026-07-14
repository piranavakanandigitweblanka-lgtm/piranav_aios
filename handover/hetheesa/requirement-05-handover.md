---
name: requirement-05-handover
description: Handover document for Requirement 5 — Internal Links Coverage Audit. Summarises what was built, how to maintain it, and what the next steps are.
metadata:
  type: project
---

# Requirement 5 — Internal Links Coverage Audit — Handover

**Staff Member:** Hetheesha  
**Store:** ledsone.fr  
**Handover Date:** 2026-07-14  
**Implementation Status:** COMPLETE ✅

---

## What Was Built

A live Internal Links Coverage Audit dashboard in `Staff-requirements/pages/hetheesha.html` (tab-panel-5) that shows, for each of the 309 live ledsone.fr pages, how many unique source pages link to it (incoming links).

### Components delivered

| Component | Status |
|---|---|
| 5 KPI summary cards | ✅ Done |
| Search bar | ✅ Done |
| Page type filter | ✅ Done |
| Status filter | ✅ Done |
| 309-row sortable table | ✅ Done |
| View Sources modal (per row) | ✅ Done |
| CSV export | ✅ Done |
| Methodology notice | ✅ Done |
| Colour legend | ✅ Done |
| Validation section | ✅ Done |

### Data

- 101 source pages crawled: 66 collections + 34 blog articles + 1 homepage
- 309 target pages audited: 1 homepage + 66 collections + 186 products + 56 blog articles
- Distribution: 57 Good / 30 Needs Improvement / 97 Weak / 125 No Internal Links

---

## How to Update (Monthly Refresh)

### Step 1 — Re-crawl source pages

Run WebFetch on each of the 101 source pages (or all 309 if resources allow) to extract updated `<a href>` links. Update `r5_incoming_counts.json` in the scratchpad.

Do NOT use Python `requests` — ledsone.fr returns HTTP 429. Use WebFetch (Anthropic proxy).

### Step 2 — Regenerate data

Run `r5_update_counts.py` (or similar script) to rebuild `r5_data.js` from the updated `r5_incoming_counts.json`.

### Step 3 — Patch hetheesha.html

Replace the `R5_STATS` and `R5` variable block in the `<script>` at the bottom of `hetheesha.html` (currently lines 3033–3348) with the new content from `r5_data.js`.

Update the refresh date in:
- tab-panel-5 header `<div class="sub">`
- The CSV export filename in `r5ExportCSV()`
- The footer line at the bottom of the file

### Step 4 — Update AIOS files

Update the dates in this handover, the crawl evidence, and the validation files. Update the distribution table in the report.

---

## Files Modified

| File | Change |
|---|---|
| `Staff-requirements/pages/hetheesha.html` | tab-panel-5 and R5 JS block replaced |

## AIOS Files Created

| File | Path |
|---|---|
| Prompt | `prompts/hetheesa/requirement-05-internal-links-coverage-prompt.md` |
| Discovery notes | `evidence/hetheesa/requirement-05-discovery-notes.md` |
| Crawl evidence | `evidence/hetheesa/requirement-05-crawl-evidence.md` |
| Validation | `validation/hetheesa/requirement-05-validation.md` |
| Report | `reports/hetheesa/requirement-05-internal-links-coverage-report.md` |
| Handover | `handover/hetheesa/requirement-05-handover.md` (this file) |
| Deployment readiness | `vercel/hetheesa/requirement-05-deployment-readiness.md` |

---

## Known Limitations

1. **Product pages not crawled as sources** — 186 product pages were not crawled. Product-to-product cross-links are not counted. Some pages showing 0 may actually receive links from products.
2. **Homepage always shows 0 incoming** — no internal page links back to `/`. This is expected and correct.
3. **Count ceiling at 10 in modal** — the View Sources modal shows up to 10 sources (the sources array in the JS only stores up to 10 to keep file size manageable). The count badge shows the true total.

---

## Security Notes

No production systems were modified during this implementation:
- No Shopify changes (products, collections, menus, themes)
- No PostgreSQL / GSC / GA4 / Google Ads changes
- No Vercel deployment
- No Git push

---

## Revert Instructions

If tab-panel-5 must be reverted:
1. Replace `  <!-- REQUIREMENT 5 -->` through `  </div><!-- /tab-panel-5 -->` with the placeholder:
   ```html
   <!-- REQUIREMENT 5 -->
   <div class="tab-panel" id="tab-panel-5" role="tabpanel" aria-labelledby="tab-btn-5">
     <div class="placeholder">Requirement 5 — Not yet implemented.</div>
   </div><!-- /tab-panel-5 -->
   ```
2. Remove the `<script>` block containing `/* ===== REQUIREMENT 5 — INTERNAL LINKS COVERAGE AUDIT ===== */`
3. Move the 7 new AIOS files to `backup/hetheesa_requirement_5_v3_revert/`
