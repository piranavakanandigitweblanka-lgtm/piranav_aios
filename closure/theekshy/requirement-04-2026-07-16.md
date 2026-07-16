# Theekshy Req4 — Closure Record
**Date:** 2026-07-16 | **Status:** COMPLETE — Pending Owner Sign-off

---

## Requirement 4: Stock Status Snapshot and Action Queue

**Priority:** High (per Theekshy's CSV specification)

### Delivery Summary

Panel 4 of Theekshy's Staff dashboard has been fully built and integrated. The dashboard
provides a manually refreshed snapshot of stock levels for all top-30 products (by 30-day
spend) across both Google Ads campaigns, with advisory recommended actions aligned exactly
to Theekshy's CSV specification.

---

### Pass Criteria

- [x] Snapshot banner visible on Panel 4 ("Snapshot – Not Live")
- [x] Data freshness panel with all 5 required fields
- [x] 60 products loaded (30 per campaign, top by 30d spend)
- [x] Stock status classification using priority rules (5 outcomes)
- [x] Out of Stock product flagged — pid 55116252905858 (THEE_GEMS, £12.04 30d spend)
- [x] Going to Finish products flagged — pids 55112543961474 (inv=5), 55262186242434 (inv=10)
- [x] GMC comparison logic (5 outcomes)
- [x] 4 filters + search + reset + CSV export (14 columns)
- [x] localStorage action decision tracking (8 options)
- [x] Validation box (19 items: 17 PASS, 2 WARN)
- [x] Action texts match CSV spec verbatim (post-verification fix applied)
- [x] No forbidden actions taken

---

### Immediate Actions Required (for Theekshy)

**PRIORITY 1 — pid 55116252905858**
Product: Vintage Flush Ceiling Light White/No (THEE_GEMS)
- inv = 0 (Out of Stock), 30d spend = £12.04
- Action: Pause ads in Google Ads manually → Update GMC availability to "Out of Stock"
  → Exclude from PMax listing group until restocked

**PRIORITY 2 — pid 55112543961474**
Product: Rustic Red 3-Way Industrial Ceiling Light (THEE_MYSTERY)
- inv = 5 (Going to Finish)
- Action: Send restock alert to Sonya/Dilaksi; consider trimming budget; do not pause yet

**PRIORITY 3 — pid 55262186242434**
Product: Three Head Spider Pendant (THEE_MYSTERY)
- inv = 10 (Going to Finish — boundary case)
- Action: Monitor daily; send restock alert to Sonya/Dilaksi

---

### Known Limitations

| Limitation | Root Cause | Impact |
|---|---|---|
| 20/60 products show Unknown | Parent-level Shopify IDs — no variant SKU for inventory join | Cannot determine stock — review manually |
| 57/60 products show GMC Data Unavailable | merchant_products table has only 3 GB records | GMC comparison limited; not a mismatch |
| Dashboard is snapshot only | R4_DATA array must be refreshed manually from SQL | Data freshness shown in panel — user aware |

---

### Sign-off Required

Theekshy to:
1. Open Panel 4 (Stock Status tab) in the dashboard
2. Confirm OOS product action taken for pid 55116252905858
3. Confirm restock alerts sent for Going to Finish products
4. Mark Requirement 4 as APPROVED
