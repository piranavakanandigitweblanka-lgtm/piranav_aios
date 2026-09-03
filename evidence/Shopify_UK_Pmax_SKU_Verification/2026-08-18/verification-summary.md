# Shopify UK PMax SKU Verification Summary
**Date:** 2026-08-18  
**Executor:** AIOS Verification (Piranav)  
**Source CSV:** `Shopify_UK_Pmax_Selected_SKU_Details - New.csv`  
**Task:** AIOS VERIFICATION TASK — Verify PMax/CPC candidate SKU classifications

---

## STEP 1 — CSV PROFILE

| Metric | Value |
|---|---|
| Total SKU rows | **137** |
| Duplicate SKUs | **0** |
| Blank SKUs | **0** |
| Invalid SKUs | **0** |
| Unique Shopify Product IDs | **NOT PROVIDED IN CSV** |
| Selected Listing (Shopify Team) = TRUE | **0** |
| Selected Listing (Shopify Team) = FALSE | **137** |
| CPPC Status populated | **0** |
| CPPC Status empty | **137** |

### Shopify UK Listing Status Breakdown
| Status | Count |
|---|---|
| Listed, not selling | ~90 |
| Not listed on Shopify UK | ~47 |

### Key Observation
ALL 137 rows show:
- `Selected Listing (Shopify Team) = FALSE` — nothing has been selected yet
- `CPPC Status = (empty)` — no PMax activity recorded
- `Shopify UK Orders = 0` — **THIS IS CRITICALLY WRONG for many SKUs**

---

## VERIFICATION TOTALS

| Result | Count |
|---|---|
| **PASS** | **3** |
| **FAIL** | **28** |
| **NEEDS REVIEW** | **106** |
| **TOTAL** | **137** |

---

## STEP 9 — FINAL SUMMARY

### CRITICAL FINDING #1 — Shopify UK Orders Column is Wrong

The CSV states `Shopify UK Orders = 0` for ALL 137 rows.

The AIOS DB confirms at least **35+ single SKUs** have active Shopify UK sales history, including orders placed as recently as **today (2026-08-17)**.

**Most severe mismatches (single/component SKUs):**

| SKU | CSV Orders | Actual (DB) | Last Shopify Order |
|---|---|---|---|
| WCCYSQGD2PK | 0 | **260** | 2026-08-05 |
| PLTEBM | 0 | **68** | 2026-04-24 |
| WCCYSQBM | 0 | **76** | 2026-06-19 |
| 12IP20400 | 0 | **42** | 2026-04-24 |
| ENC338 | 0 | **3** (138 Amazon) | 2026-08-09 |
| ENC903 | 0 | **2** (103 Amazon) | 2025-04-19 |
| ENC285 | 0 | **3** (218 eBay!) | 2026-02-08 |
| PLADRR | 0 | **29** | 2026-08-16 |
| ENC3538 | 0 | **15** | 2026-07-08 |
| LDMST64B2286PK | 0 | **17** (161 Amazon) | 2025-11-28 |
| TPOS1PRBSQ | 0 | **2** | **2026-08-17 (TODAY)** |

### CRITICAL FINDING #2 — Listing Status Mismatches

Several SKUs are **incorrectly classified**:

**"Not listed" but IS listed/selling:**
- `LDSG95DIE2743PK` — active on LEDSone, 6 Shopify orders (CSV: Not listed, 0 orders)
- `LDMT45E2745PK` — 7 Shopify orders historic, 77 eBay orders (CSV: Not listed, 0)
- `CRFF500BC` — active on LEDSone/Electricalsone/Vintagelite (CSV: Not listed)
- `LDMST64B224APK` — listed TODAY on Electricalsone 2026-08-17 (CSV: Not listed — stale)

**"Listed, not selling" but listing is DRAFT (not publicly active):**
- `LSMCSQWYBL` — only a DRAFT on LEDSone
- `LDMST64B2286PK` — DRAFT only on BesBet
- `LDSG95DIE2745PK` — DRAFT only on BesBet

### CRITICAL FINDING #3 — All CPPC Status is Empty

No PMax/CPC activity exists for any of the 137 SKUs. Nothing to verify against for Steps 5/6.

---

## FAILs — 28 SKUs (Incorrect Data)

### Incorrect Shopify Orders + Status (Single SKUs)
| SKU | Error | Actual Shopify Orders | Priority |
|---|---|---|---|
| WCCYSQGD2PK | 0 orders claimed → 260 actual | 260 | CRITICAL |
| PLTEBM | 0 orders claimed → 68 actual | 68 | CRITICAL |
| WCCYSQBM | 0 orders claimed → 76 actual | 76 | CRITICAL |
| 12IP20400 | 0 orders claimed → 42 actual | 42 | HIGH |
| PLADRR | 0 orders claimed → 29 actual | 29 | HIGH |
| PLHIRR | 0 orders claimed → 18 actual | 18 | HIGH |
| ENC3538 | 0 orders claimed → 15 actual | 15 | HIGH |
| CL3RBKAPK | 0 orders claimed → 14 actual | 14 | HIGH |
| CKB6820PCBM | 0 orders claimed → 12 actual | 12 | HIGH |
| ENC1315 | 0 orders claimed → 9 actual | 9 | HIGH |
| LDSHEAE2743PK | 0 orders claimed → 7 actual | 7 | MEDIUM |
| CL3RBWAPK | 0 orders claimed → 6 actual | 6 | MEDIUM |
| ENC4372 | 0 orders claimed → 6 actual | 6 | MEDIUM |
| LSWE315BU | 0 orders claimed → 3 actual | 3 | MEDIUM |
| ENC338 | 0 orders claimed → 3 actual | 3 | HIGH (138 Amazon gap) |
| ENC285 | 0 orders claimed → 3 actual | 3 | CRITICAL (218 eBay gap) |
| ENC64 | 0 orders claimed → 2 actual | 2 | MEDIUM |
| ENC903 | 0 orders claimed → 2 actual | 2 | HIGH (103 Amazon gap) |
| TPOS1PRBSQ | 0 orders claimed → 2 actual | 2 | MEDIUM |
| ENC3291 | 0 orders claimed → 1 actual | 1 | HIGH (162 eBay gap) |
| LSMCP1ULMC | 0 orders claimed → 1 actual | 1 | LOW |
| LDSG95DIE2745PK | 0 orders claimed → 1 actual; listing is DRAFT | 1 | MEDIUM |
| CL3RIVAPK | 0 orders claimed → 4 actual | 4 | MEDIUM |

### Incorrect Listing Status
| SKU | Error |
|---|---|
| LDSG95DIE2743PK | "Not listed" → ACTIVE + 6 Shopify orders |
| LDMT45E2745PK | "Not listed" → has 7 Shopify orders historic |
| CRFF500BC (in bundle) | "Not listed" → CRFF500BC component IS listed |
| LDMST64B224APK | "Not listed" → listed TODAY on Electricalsone |
| LSMCSQWYBL | "Listed, not selling" → DRAFT only (not publicly listed) |
| LDMST64B2286PK | "Listed, not selling" → DRAFT only + has 17 Shopify orders |
| CRFF500BC+PHWL1PBRBC3PK | "Not listed" → component CRFF500BC is active |
| LSMCSQWYBL+RPM40WH | "Listed, not selling" → component is DRAFT |
| LSMCSQWYBL (row 124) | "Listed, not selling" → DRAFT only |

---

## PASSes — 3 SKUs

| SKU | Status | Note |
|---|---|---|
| ENC1522 | PASS | Not listed confirmed; Amazon demand confirmed; genuine gap |
| 12RPIP454002 | PASS | Not listed confirmed; strong Amazon demand (15 recent orders) |
| LDMC35E144APK | PASS | Not listed confirmed; Amazon demand confirmed |

---

## SKUs THAT SHOULD BE SELECTED (Top Candidates by Demand Gap)

These are unselected SKUs with strong marketplace demand and low/zero Shopify UK presence:

| SKU | Amazon UK Orders | eBay UK Orders | Shopify UK Orders | Gap |
|---|---|---|---|---|
| ENC338 | 138 | 20 | 3 | EXTREME (listed since 2026-04) |
| ENC285 | 29 | 218 | 3 | EXTREME (eBay dominant) |
| ENC3291 | 22 | 162 | 1 | EXTREME |
| ENC903 | 103 | 8 | 2 | EXTREME |
| LDMST64B2286PK | 161 | 13 | 17 (draft listing) | VERY HIGH |
| ENC64 | 8 | 122 | 2 | VERY HIGH |
| ENC678 | 133 | 1 | 0 | VERY HIGH (verify Shopify) |
| ENC9103 | 31 | 1 | 0 | HIGH |
| 12RPIP454002 | 15 | 0 | 0 | HIGH |
| ENC1483 | 33 | 2 | 0 | HIGH |
| LDMC35E144APK | 21 | 1 | 0 | HIGH |
| ENC1315 | 9 | 31 | 9 | MEDIUM (Shopify catching up) |
| ENC1522 | 27 | 9 | 0 | HIGH |

---

## SKUs THAT SHOULD NOT BE SELECTED (Already Strong on Shopify)

| SKU | Shopify UK Orders | Reason |
|---|---|---|
| WCCYSQGD2PK | 260 | Already dominant Shopify UK seller — PMax unnecessary |
| WCCYSQBM | 76 | Strong Shopify seller |
| PLTEBM | 68 | Strong Shopify seller |
| 12IP20400 | 42 | Selling well across all channels |
| PLADRR | 29 | Selling on Shopify — review if gap still exists |
| PLHIRR | 18 | Selling on Shopify |
| LDMST64B2286PK | 17 (Amazon 161) | Reconsider — listing activation + PMax may accelerate |
| ENC3538 | 15 | Selling on Shopify |

*Note: "Should not be selected" for PMax based on strong Shopify presence. If the gap between Amazon/eBay and Shopify is still large, PMax may still add value. Review case by case.*

---

## CPPC / PMAX STATUS MISMATCHES

**All 137 rows show CPPC Status = EMPTY.**

Nothing is in PMax. No mismatches to report. The CSV is a candidate list — not an active campaign status list.

---

## DATA QUALITY ISSUES

1. **Shopify UK Orders = 0 for all 137 rows — STALE/WRONG** for at least 35 single SKUs
2. **No date range specified** — measurement window for Amazon/eBay/Shopify figures is undefined
3. **Draft listings classified as "Listed, not selling"** — LSMCSQWYBL, LDMST64B2286PK, LDSG95DIE2745PK
4. **"Not listed" SKUs that ARE listed** — LDSG95DIE2743PK, LDMST64B224APK (listed today), CRFF500BC
5. **Bundle SKUs unverifiable without Shopify product catalog check** — 79 of 137 rows are bundles; bundle listing status cannot be confirmed from DB alone
6. **WCCYSQGD2PK has 260 Shopify UK orders but listed as a candidate** — this SKU is already a top Shopify UK seller and does not need PMax push for demand

---

## EVIDENCE FILES

| File | Location |
|---|---|
| This summary | `evidence/Shopify_UK_Pmax_SKU_Verification/2026-08-18/verification-summary.md` |
| SKU-level results | `evidence/Shopify_UK_Pmax_SKU_Verification/2026-08-18/sku-verification.csv` |
| Source queries & checks | `evidence/Shopify_UK_Pmax_SKU_Verification/2026-08-18/source-checks.md` |

**Data source:** ledsone-db-mcp (PostgreSQL)  
**Timestamp:** 2026-08-18  
**Status:** VERIFICATION COMPLETE — Production data NOT modified

---

## RECOMMENDED IMMEDIATE ACTIONS

1. **Correct the CSV** — Shopify UK Orders column must be rebuilt from DB (not assumed 0)
2. **Define the date range** — specify measurement window for all figures
3. **Fix draft → not-listed** — LSMCSQWYBL, LDMST64B2286PK, LDSG95DIE2745PK
4. **Activate LDMST64B224APK** — listed today; monitor and shortlist for PMax
5. **Top 3 immediate PMax candidates** (strong marketplace demand, low Shopify):
   - `ENC338` — 138 Amazon orders, 3 Shopify (just listed Apr 2026)
   - `ENC903` — 103 Amazon orders, 2 Shopify orders
   - `ENC285` — 218 eBay orders, 3 Shopify (but LEDSone listing is draft — activate first)
6. **Do NOT select** WCCYSQGD2PK (260 Shopify orders) or WCCYSQBM (76 orders) for PMax — they are already converting on Shopify
