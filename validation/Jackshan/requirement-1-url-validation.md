---
name: jackshan-r1-url-validation
description: URL-level validation for Jackshan Requirement 1 URL recovery task — all 50 product URLs verified complete canonical
metadata:
  type: project
---

# Jackshan Requirement 1 — URL Recovery Validation

**Task:** Validate that all 50 allocated product URLs are complete canonical URLs after URL recovery  
**Date:** 2026-07-10  
**Validator:** Piranav (AIOS)  
**Status:** PASS (URL recovery complete)  
**Overall Dashboard Status:** FAIL — DATA COVERAGE (unchanged)

---

## URL Integrity Validation

| Check | Expected | Actual | Result |
|-------|----------|--------|--------|
| Total product rows in RAW_DATA | 50 | 50 | PASS |
| URLs with ellipsis (`…`) | 0 | 0 | PASS |
| URLs starting with `https://ledsone.co.uk/products/` | 50 | 50 | PASS |
| Unique URLs (no duplicates) | 50 | 50 | PASS |
| KPI: Allocated Products | 50 | 50 | PASS |
| KPI: With GSC | 45 | 45 | PASS |
| KPI: No GSC | 5 | 5 | PASS |
| KPI: Rewrite | 11 | 11 | PASS |
| KPI: Intent Mismatch | 5 | 5 | PASS |
| KPI: Do Not Optimize | 29 | 29 | PASS |
| KPI: Data Validation Required | 5 | 5 | PASS |
| KPI action sum | 50 | 11+5+29+5=50 | PASS |
| KPI GSC sum | 50 | 45+5=50 | PASS |
| ip68-case full URL present | Yes | Yes | PASS |
| corded-rose-gold URL present | Yes | Yes | PASS |
| corded-black URL absent from productUrl | Yes | Yes | PASS |
| tiffany-4541 URL present | Yes | Yes | PASS |
| tiffany without -4541 absent from productUrl | Yes | Yes | PASS |
| ledsone-orange full URL present | Yes | Yes | PASS |
| fisherman-with-glass full URL present | Yes | Yes | PASS |
| ceramic-variation-lamp-holder URL present | Yes | Yes | PASS |
| Badge: FAIL — DATA COVERAGE | Yes | Yes | PASS |
| File size change from baseline | Minimal | 45988 bytes | PASS |

---

## Seven-URL Specific Validation

| Product | Fragment Before | Full URL After | GSC Match | Action Correct |
|---------|----------------|----------------|-----------|----------------|
| ip68 junction box | `...connecto…` | `.../ip68-waterproof-junction-box-case-for-electrical-cable-wire-connector-5599` | Yes (1 click) | Rewrite — PASS |
| Orange lamp shade | `...shad…` | `.../ledsone-industrial-vintage-32cm-orange-pendant-retro-metal-lamp-shade-e27-uk-holder` | No | Data validation — PASS |
| Ceramic lamp holder | `...lam…` | `.../ceramic-porcelain-type-6-es-e27-edison-screw-heat-bulb-variation-lamp-holder` | Yes (0 clicks, 16 imp) | Do not optimize — PASS |
| Fisherman lantern | `...with…` | `.../fisherman-caged-conduit-pipe-light-shade-3-4-entry-wall-lantern-with-glass` | No | Data validation — PASS |
| Pendant rose gold | corded-black (wrong) | `.../pendant-light-fitting-ceiling-rose-e27-suspension-set-fabric-corded-rose-gold` | Yes (340 imp) | Intent mismatch — PASS |
| Tiffany pendant | decorative-home (no suffix) | `.../tiffany-style-ceiling-pendant-hanging-mediterranean-style-lamp-light-decorative-home-4541` | Yes (12 imp) | Do not optimize — PASS |
| dc12v, red-wicker, b22-t185 | "No matched GSC data" label | "Product resolved — no matched GSC data" label | No | Data validation — PASS |

---

## PASS / FAIL

**URL Recovery: PASS** — All 50 product rows contain complete canonical `https://ledsone.co.uk/products/` URLs. Zero truncated URLs. Zero ellipsis. KPI cards updated and reconciled.

**Dashboard Overall: FAIL — DATA COVERAGE** — GSC data available for only 9 days (2026-06-29 to 2026-07-07) vs. 91 days required. Re-run required when full 3-month GSC history is loaded into PostgreSQL.
