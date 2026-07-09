# Thivajini Req 1 — Discovery Report
## Google Ads vs Shopify Revenue Reconciliation — LEDSone FR
### 2026-07-09

**Title:** Discovery Report — Weekly Reconciliation Dashboard  
**Purpose:** Summary report for stakeholder review  
**Team member:** Thivajini  
**Department:** Digital Marketing / Google Ads / PPC  
**Store:** LEDSone FR  
**Status:** BLOCKED  
**PASS/FAIL:** FAIL — Shopify UTM data source missing

---

## Executive Summary

Discovery has been completed for Thivajini Req 1. The Google Ads conversion value data source (`public.ppc_etl_performance_data`) is confirmed and ready for use. However, the Shopify UTM-attributed revenue side is missing from all production PostgreSQL tables. No existing order-level table captures utm_source, gclid, or traffic channel for individual Shopify orders on ledsone.fr. The GA4 source/medium pipeline exists in schema but has zero rows loaded. The requirement cannot be built as specified until this data gap is resolved.

---

## Findings

| # | Finding | Impact |
|---|---------|--------|
| 1 | Google Ads conversion value — FOUND in `ppc_etl_performance_data` | Positive |
| 2 | LEDSone FR identified as sub_source_id=233, marketplace_id=9 | Positive |
| 3 | Shopify order UTM fields — ABSENT from all production tables | Blocker |
| 4 | GA4 source/medium table — 0 rows, ETL not active | Blocker |
| 5 | Order attribution pilot table — staging only, all fields NULL | Informational |
| 6 | No duplicate reconciliation dashboard found | Positive |

---

## Recommended Next Actions

| Priority | Action | Owner | Unblocks |
|----------|--------|-------|---------|
| P0 | Confirm sub_source_id=233 = LEDSone FR Google Ads | Tech team | Locks Google Ads source |
| P1 | Activate GA4 ETL for ledsone.fr into `ga4_source_medium_daily` | Tech team | Dashboard (approximate) |
| P1 | OR build Shopify order UTM ETL (utm_source, gclid, created_at, total_price) | Tech team | Dashboard (exact) |
| P2 | GPT approves dashboard build after data confirmed | GPT | Implementation |
| P3 | Thivajini approves variance thresholds (2%/5%) | Thivajini | Alert logic |

---

**Owner:** Thivajini  
**Reviewer:** GPT / Piranav  
**Status:** BLOCKED — awaiting data gap resolution and GPT approval  
