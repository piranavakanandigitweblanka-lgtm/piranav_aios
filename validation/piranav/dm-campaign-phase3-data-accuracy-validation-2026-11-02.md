---
name: dm-campaign-phase3-data-accuracy-validation-2026-11-02
description: Validation checklist for Phase 3 data accuracy audit of DM Campaign Overall Performance. Independent SQL vs API comparison. 2026-11-02.
metadata:
  type: validation
---

# Validation: DM Campaign — Phase 3 Data Accuracy & API Validation

**Date:** 2026-11-02
**Type:** Read-only data accuracy validation

---

## Checklist

| Check | Result | Notes |
|---|---|---|
| Git branch correct (piranv-work) | PASS | Confirmed |
| Working tree clean | PASS | No uncommitted changes |
| READ-ONLY rule enforced | PASS | No code, DB, or server changes made |
| DB connection via ledsone-db-mcp | PASS | All queries executed successfully |
| Backend health check | PASS | `{"status":"ok"}` on port 8499 |
| Campaign inventory queried | PASS | 7 DM campaigns, 2 ENABLED confirmed |
| Date bounds queried | PASS | 2023-11-28 to 2026-10-21, 1,059 dates |
| All Time SQL vs API totals | PASS | Exact match on all 7 KPIs |
| All Time SQL vs API per-campaign | PASS | Both campaigns match exactly |
| Oct 1–7 SQL vs API | PASS | Exact match |
| Oct 1–21 SQL vs API | PASS | Exact match |
| Oct 1–31 clamping behaviour | PASS | API resolved_end=2026-10-21, matches DB |
| Single day (Oct 21) spot-check | PASS | Per-campaign daily figures verified |
| sub_source_id=38 verified in orders | PASS | 43,887 orders, 2020–2026 |
| market_place='23' verified in orders | PASS | Active UK Shopify order stream |
| market_place_id_mapping clarification | PASS | id=23=UAE is different system — not a bug |
| UK listing channel='LEDSone' confirmed | PASS | sub_source=104 for UK LEDSone |
| ROAS formula verified (×100 = % value) | PASS | Data accurate; display format is design choice |
| No source code modifications | PASS | READ-ONLY audit |
| No database writes | PASS | SELECT only |

---

## KPI Accuracy Summary

| Range | Impressions | Clicks | CTR | Cost | Conv | Conv Value | ROAS | Verified |
|---|---|---|---|---|---|---|---|---|
| All Time | 34,800,553 | 458,499 | 1.32% | £193,387.27 | 19,924.25 | £641,168.93 | 331.55% | ✅ |
| Oct 1–7 | 483,511 | 7,384 | 1.53% | £2,993.08 | 264.36 | £8,889.90 | 297.02% | ✅ |
| Oct 1–21 | 1,440,126 | 21,977 | 1.53% | £8,545.52 | 763.13 | £24,796.48 | 290.17% | ✅ |
| Oct 1–31 (clamped) | 1,440,126 | 21,977 | 1.53% | £8,545.52 | 763.13 | £24,796.48 | 290.17% | ✅ |

---

## Overall Status: PASS (Phase 3 data accuracy audit complete — all KPIs verified correct)
