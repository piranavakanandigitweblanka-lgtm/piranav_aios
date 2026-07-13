---
name: jackshan-r1-prompt
description: Prompt copy for Jackshan Requirement 1 — GSC Priority Keyword Analysis, 30-day rebuild 2026-07-13
metadata:
  type: project
---

# Jackshan Requirement 1 — Prompt Copy

**Requirement:** Jackshan Requirement 1 — GSC Priority Keyword Analysis

**Business Question:** For Jackshan's 50 allocated LEDsone UK products, identify page-level GSC performance and the priority search query for each product page during the latest 30-day period, and show what SEO action should be taken based on page-level clicks and impressions.

**Scope:** ledsone.co.uk product pages only, from authoritative 50-product list.

**Date Range:** Latest 30 days from max available GSC date. Max date: 2026-07-10. Period: 2026-06-11 to 2026-07-10.

**Grain:** One row per product URL (50 rows). Page metrics aggregate all queries. Priority keyword = top query by clicks DESC, impressions DESC, position ASC, query ASC.

**Output:** 14 columns: Product URL, Priority Keyword, Page Impressions, Page Clicks, Page CTR, Page Avg Position, KW Impressions, KW Clicks, KW Avg Position, Meta Title, Meta Description, H1, Recommended Action, Data Status.

**Recommended Action Rules (page-level metrics):**
- Page Clicks >= 2: Rewrite meta tags + re-optimize keywords
- Page Clicks = 1: Rewrite meta tags + re-optimize keywords
- Page Clicks = 0 AND Page Impressions >= 100: Check intent mismatch before optimizing
- Page Clicks = 0 AND Page Impressions < 100: Do not optimize
- No GSC match: Data validation required

**Target File:** Staff-requirements/pages/jakshan.html

**Status:** COMPLETE — FAIL (DATA COVERAGE) — rebuilt 2026-07-13; re-run required when GSC imports extend past 2026-07-10
