# Sajeepan Requirement 3 — Closure (Recovery Entry)
**Date:** 2026-08-11 | **Recovery closure written:** 2026-08-14 | **Status:** PARTIAL — GPT REVIEW EVIDENCE MISSING

---

## Requirement ID
SAJEEPAN-R3-2026-08-11

## Task
Add Requirement 3 "Revenue Protection & PPC Actions" tab to the Sajeepan Google Ads PMax dashboard.

## Asset Path
- `Staff-requirements-02/api/members-api.js` — +185 lines: `handleSajeepanReq3` function with 8 DB queries
- `Staff-requirements-02/pages/sajeepan.html` — +149 lines: R3 tab button + panel HTML (sections A–D) + full JS block

## Evidence Path
- Git commit: `717f3d8`
- No capability file yet — CREATE REQUIRED: `capability/sajeepan/requirement-3-2026-08-11.md`
- No evidence file yet — CREATE REQUIRED: `evidence/sajeepan/requirement-3-2026-08-11.md`
- No validation file yet — CREATE REQUIRED: `validation/sajeepan/requirement-3-2026-08-11.md`
- No GPT review evidence — GPT REVIEW EVIDENCE MISSING

## GitHub Path / Commit
Repo: https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios
Commit: `717f3d8bc8f48d46213b805abee68efa292a3022`
Direct: https://github.com/piranavakanandigitweblanka-lgtm/piranav_aios/commit/717f3d8

## What R3 Delivers
| Section | Feature | DB Source |
|---|---|---|
| A1 | OOS best-sellers (in-ads but out of stock) | `google_ads.product_performance` + `inventory` |
| A2 | Limited campaigns with budget available | `google_ads.campaigns` |
| A3 | Sudden ROAS drops (>30% WoW) | `google_ads.campaign_performance` |
| A4 | Cross-platform winners (Amazon/eBay selling, not in Ads) | `order_management` |
| B1 | ROAS banding — Scale/Keep/Monitor/Reduce/Exclude | `google_ads.campaign_performance` |
| C1 | Duplicate campaigns (same product in 2+ campaigns) | `google_ads.product_performance` |
| C2 | Duplicate titles (same product title in merchant feed) | `google_ads.merchant_products` |
| C3 | Duplicate merchant items (duplicate product_id) | `google_ads.merchant_products` |

## ROAS Bands (Editable in UI)
| Band | Label | Threshold |
|---|---|---|
| Scale | Scale ≥ 400% | target_roas × 1.0+ |
| Keep | Keep ≥ 300% | ≥ 300% |
| Monitor | Monitor ≥ 250% | ≥ 250% |
| Reduce | Reduce ≥ 100% | ≥ 100% |
| Exclude | Exclude < 100% | < 100% |

OOS status always overrides ROAS band — stock protection takes priority.

## Status
PARTIAL

### Why PARTIAL
- Code is committed and live in git (verified by commit 717f3d8)
- No AIOS closure chain exists for R3 (no capability, evidence, validation, or GPT review)
- Dashboard doc (`SR-02/docs/dashboard-sajeepan.md`) still describes 2 tabs; R3 not documented there
- No browser validation captured

## Queryability
FAIL — A clean LLM cannot answer:
- What 8 queries does R3 run?
- What are the ROAS band thresholds?
- What tables are used?
- What business rule governs OOS override?
- Has this been validated by Piranav in browser?

## Unknown Developer Test
FAIL — Cannot continue without Piranav explanation of:
- R3 business intent (Revenue Protection vs pure PPC optimisation)
- Which sections (A/B/C/D) are active vs placeholder
- What the expected ROAS band decisions mean operationally

## GPT Review Evidence
MISSING — No saved GPT review of R3 scope, design, or output exists.

## Blockers
- No capability file
- No evidence file
- No validation file
- No GPT review evidence
- SR-02/docs/dashboard-sajeepan.md not updated for R3

## Next Step
1. GPT to design: `SAJEEPAN-R3-CAPABILITY-PROMPT`
2. Claude to create: `capability/sajeepan/requirement-3-2026-08-11.md`
3. Claude to create: `evidence/sajeepan/requirement-3-2026-08-11.md`
4. Claude to create: `validation/sajeepan/requirement-3-2026-08-11.md`
5. Claude to update: `Staff-requirements-02/docs/dashboard-sajeepan.md` (add R3 tab)
6. Piranav to browser-validate and capture screenshots
7. GPT to review → PASS or FAIL

## Result
PARTIAL
