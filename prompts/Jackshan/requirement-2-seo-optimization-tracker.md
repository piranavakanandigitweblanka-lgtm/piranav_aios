---
name: jackshan-r2-prompt
description: Prompt copy for Jackshan Requirement 2 — SEO Optimization Tracker, built 2026-07-13
metadata:
  type: project
---

# Jackshan Requirement 2 — SEO Optimization Tracker

**Requirement:** Jackshan Requirement 2 — Product SEO Optimization Tracker

**Business Question:** For each of Jackshan's 50 allocated LEDsone UK products, determine whether the product page requires SEO optimization based on monthly sales volume and GSC CTR.

**Scope:** Jackshan's 50 allocated ledsone.co.uk products only.

**Date Range:** 2026-06-11 to 2026-07-10 (30-day GSC window). Sales from Shopify Analytics same period.

**Data Sources:** Google Search Console API (page-level) + Shopify Analytics (ShopifyQL)

**Optimize Rule:** Monthly Sales ≤ 1 AND Monthly CTR < 5%

**Do Not Optimize Rule:** Monthly Sales > 1 OR Monthly CTR ≥ 5%

**Revert Rule:** If previously Optimize but now Sales > 1 OR CTR ≥ 5% → revert to Do Not Optimize

**Recommended Action (Optimize):**
- Review title
- Improve meta description
- Improve H1
- Add internal links
- Improve product content

**Recommended Action (Do Not Optimize):** Continue monitoring

**Output:** 10-column table embedded as Requirement 2 tab in jakshan.html

**Status:** COMPLETE — PASS — built 2026-07-13
