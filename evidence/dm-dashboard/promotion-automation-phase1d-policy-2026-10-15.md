# Evidence: Promotion Automation Phase 1D — Policy Extraction

**Date:** 2026-10-15
**Phase:** 1D — Policy Extraction and Business Rule Validation
**Assigned by:** Muguntha
**Coordinator:** Piranav
**Policy source:** `C:\Users\PC\Downloads\Nishani_Promotion_Multi_Channel.docx`
**Status:** PASS — policy fully extracted. Discount conflict (D4) confirmed. D2/D3 data gaps re-verified as NOT FOUND. D1 RESOLVED.

---

## 1. Policy File Verification

| Property | Value |
|---|---|
| File path | `C:\Users\PC\Downloads\Nishani_Promotion_Multi_Channel.docx` |
| File exists | YES — confirmed via `test -f` |
| Readable | YES — extracted via Python zipfile + XML parse |
| Total paragraphs extracted | 395 |
| Document title | "Promotion Automation Framework" |
| Note | Document contains TWO passes of the same framework — a detailed Step 1–10 walkthrough (paras 0019–0154) and a condensed summary (paras 0155–0254), followed by the full scorecard detail (paras 0256–0394). The summary introduces discount range differences vs the Step 8 table — this is the source of Blocker D4. |

**BLOCKER D1: RESOLVED** — Policy document found and fully extracted.

---

## 2. Extracted Requirements Matrix

### A. Qualification Score — VERIFIED FROM DOCUMENT

**Structure (para 0030–0041):**

| Section | Name | Max Points | Weight |
|---|---|---|---|
| A | Financial Viability | 30 | 30% |
| B | Strategic Justification | 20 | 20% |
| C | SKU Readiness | 20 | 20% |
| D | Platform Fit | 15 | 15% |
| E | Control & Risk | 15 | 15% |
| **TOTAL** | | **100** | **100%** |

**Global Scoring Rules (para 0274–0280):**
- Each section scored independently
- Binary scoring per metric: pass = full points, fail = 0
- No partial points
- Final score = sum of section subtotals
- Final score rounded DOWN (FLOOR)
- Hard rejects override score regardless of total

**Section A — Financial Viability (30 points) (para 0307–0333):**

| Metric | Points | Rule | Fail Consequence |
|---|---|---|---|
| A1. Post-promo net contribution | 10 | (Post-promo price − landed cost − variable fees) ≥ £2 | Auto-reject |
| A2. Margin headroom | 8 | Pre-promo gross margin ≥ 25% | 0 points |
| A3. Cost stability | 6 | Landed cost variance (90d) ≤ ±5% | 0 points |
| A4. Return rate risk | 6 | SKU return rate (90d) ≤ category average | 0 points |

**Section A pass condition:** Subtotal ≥ 18. If < 18 → auto-reject (para 0308).

**Section B — Strategic Justification (20 points) (para 0334–0354):**

| Metric | Points | Rule | Fail Consequence |
|---|---|---|---|
| B1. Single promotion intent | 8 | Exactly ONE intent selected | Auto-reject |
| B2. Intent–blocker alignment | 6 | Intent matches allowed blocker (see table below) | 0 points |
| B3. Future payback defined | 6 | Day-14 AND Day-30 KPI both present | 0 points |

Intent–Blocker Alignment Table:
| Intent | Allowed Blockers |
|---|---|
| Rank Builder | Rank, impressions |
| Review Accelerator | Review count |
| AOV Anchor | Basket size |
| Hero Defender | Market share |
| Lifecycle / Clearance | Stock age |

**Section C — SKU Readiness (20 points) (para 0355–0376):**

| Metric | Points | Rule |
|---|---|---|
| C1. Price elasticity signal | 6 | ANY ONE TRUE: previous promo increased units ≥15%; CTR ↑ when price ↓; competitor discount correlates with SKU drop |
| C2. Review base | 4 | Amazon/eBay ≥15 reviews; Website ≥5 reviews; Wayfair ≥ category median |
| C3. Listing quality | 4 | Listing quality score ≥ 80% |
| C4. Stock cover | 6 | ≥ 45 days cover |

**Section D — Platform Fit (15 points) (para 0377–0384):**
Document provides Amazon as the worked example only. Other platforms' point allocations not explicitly specified.

Amazon example:
| Metric | Points | Rule |
|---|---|---|
| PPC Support | 6 | Active campaign |
| Keyword Indexed | 5 | ≥3 keywords |
| AOV | 4 | ≥ £20 |

**Fail any → score only what passes** (not auto-reject for the section).

**Section E — Control & Risk (15 points) (para 0385–0394):**

| Metric | Points | Rule |
|---|---|---|
| E1. Spend ceiling defined | 5 | Non-empty numeric value |
| E2. KPI targets defined | 4 | Both Day-14 and Day-30 filled |
| E3. Kill conditions defined | 4 | Explicit, measurable |
| E4. Ownership defined | 2 | Named accountable owner |

**Approval Thresholds (para 0049–0053, confirmed para 0302–0306):**

| Score | Outcome |
|---|---|
| ≥ 85 | Priority promotion |
| 70–84 | Approved |
| 60–69 | Conditional (override required) |
| < 60 | Rejected |

**Minimum pass score: 70** (para 0184).

---

### B. Promotion Intents — VERIFIED FROM DOCUMENT

Five permitted intents (para 0055–0062, confirmed para 0192–0198):

1. **Rank Builder** — Buy keyword ranking
2. **Review Accelerator** — Cross review thresholds
3. **AOV Anchor** — Drive bundles / basket size
4. **Hero Defender** — Defend market share
5. **Lifecycle / Clearance** — Exit ageing stock

Invalid intents: "Visibility", "boost sales", mixed intents (para 0061).

**One-intent-per-SKU rule:** Hard rule. Multiple intents selected = auto-reject (B1 = auto-reject, para 0337).

---

### C. Financial Rules — VERIFIED FROM DOCUMENT (BLOCKED on D2)

**Hard Rejection Conditions (para 0043–0048, para 0185–0190):**
- Post-promo net contribution < £2 → auto-reject
- Stock cover < 45 days → auto-reject
- Multiple intents selected → auto-reject
- Spend ceiling missing → automation blocks execution
- Kill condition missing → automation blocks execution

**Financial Contribution Formula (para 0311):**
```
Post-promo net contribution = Post-promo price − landed cost − variable fees
Minimum: ≥ £2
```

**Required per promotion (para 0064–0069, para 0200–0206):**
- Post-promo net contribution ≥ £2
- Spend ceiling (£) — maximum acceptable loss
- Payback metric (rank, CVR, AOV, reviews)
- Recovery window (Day 14 / Day 30)

**BLOCKED:** Formula requires `landed cost` and `variable fees` — neither exists in the dm-dashboard business database (see Section 6).

---

### D. Stock and Listing Readiness — VERIFIED FROM DOCUMENT

**Auto-filter conditions (para 0078–0087):**
- Listing quality ≥ 80% (source: platform diagnostics or internal QA score)
- Correct category & attribute mapping
- Review count ≥ platform minimum
- Return rate ≤ category average (90d)
- Landed cost variance ≤ ±5% (90d)

**Permanent SKU Exclusions (para 0084–0086):**
1. SKU ending in CO / CH / RO / FG / SN / YB / GB **AND** is a Combo SKU → permanent exclusion (electroplated colour LS SKUs)
2. SKU starting with PLAD **AND** is a Combo (Pipe Light products) → permanent exclusion

**Minimum Stock Cover:** ≥ 45 days (hard reject if below).

**MOS Formula (para 0028, para 0182):**
```
Months of Supply (MOS) = Current Stock ÷ Avg Monthly Sales
```

---

### E. Platform Rules — VERIFIED FROM DOCUMENT

**In-scope platforms:** Amazon, eBay, Website (Shopify), Wayfair, B&Q

**Amazon (para 0089–0093):**
- PPC required: Active campaigns
- PPC efficiency collapse = ACOS +25% vs baseline for 3 consecutive days → kill trigger
- Keyword indexed = ≥3 primary keywords indexed
- AOV ≥ £20 (else bundling mandatory)

**eBay (para 0094–0097):**
- Sell-through ≥ category average (30d)
- Promoted listings enabled
- Price ladder = ≤10% gap to next competitor tier

**Website / Shopify (para 0098–0101):**
- No single-SKU discount without bundle or upsell
- AOV uplift potential ≥ 15%
- CRM capture enabled

**Wayfair / B&Q (para 0102–0105):**
- Gross margin ≥ category floor
- Event-based promotions only
- Competitive parity within ±5%

---

### F. Discount Ranges — CONFLICT IDENTIFIED (Blocker D4)

The document presents discount ranges in two separate sections with different values. See Section 3 (Discount Conflict Table) below.

---

### G. Monitoring Rules — VERIFIED FROM DOCUMENT

**Mandatory checkpoints (para 0119–0123, para 0241–0248):** Day 7, Day 14, Day 30.

**Auto-terminate if ANY of (para 0124–0129):**
- Net contribution < threshold
- 2 KPIs miss target
- Stock risk detected
- PPC efficiency collapses (Amazon: ACOS +25% for 3 consecutive days)
- Spend ceiling breached

**Post-kill rules (para 0130–0135):**
- SKU enters 30-day cool-off period
- Cannot re-enter automation unless:
  1. Root cause documented
  2. Metrics reset
  3. Finance re-approval granted

**Exceptions and Overrides (para 0136–0147):**

Allowed exception classes:
1. Board-approved strategic loss leader
2. Seasonal mandate
3. Competitive defense emergency
4. New launch exception

Override requirements:
- Written justification
- Finance + MD approval
- Auto-expiry date (maximum 30 days)
- Mandatory post-mortem
- Overrides logged, not silent

---

### H. Governance — VERIFIED FROM DOCUMENT

**Roles and responsibilities (para 0148–0154, para 0249–0255):**

| Role | Responsibility |
|---|---|
| Product Head | Proposes SKU |
| Promotion Lead | Designs intent & mechanics |
| Finance | Approves spend & margin |
| n8n / Automation | Executes only |
| Independent authority | Can kill promotions |

**Automation never self-approves** (hard rule, para 0017).

**SKU Promotion Brief — required before automation (para 0256–0271):**
Every SKU must complete this brief:
1. SKU + Platform
2. Why this SKU? (metric currently blocking growth)
3. Promotion Intent (select ONE)
4. What are we buying? (rank, reviews, CVR, AOV, algorithm reset)
5. Spend Ceiling (£)
6. Success Metrics (Day 14 target + Day 30 target)
7. Kill Condition (when to stop automatically)

---

## 3. Discount Conflict Table

The document presents discount ranges in two sections. Section references:
- **Step 8** = para 0106–0117 (detailed section)
- **Summary** = para 0231–0240 (condensed version)

| SKU Type | MOS Range | Step 8 Discount | Summary Discount | Contradiction? | Status |
|---|---|---|---|---|---|
| Low movers | Any | 15–30% | 15–30% | NO — consistent | Ready to implement |
| Medium movers | 5–8 MOS | 0–8% | 0–8% | NO — consistent | Ready to implement |
| Medium movers | >8 MOS | 10–18% | 10–18% | NO — consistent | Ready to implement |
| Fast movers | 5–8 MOS | 0–8% | 0% only | **YES — CONFLICT** | **NOT APPROVED FOR EXECUTION** |
| Fast movers | >8 MOS | 5–12% | 5–8% | **YES — CONFLICT** | **NOT APPROVED FOR EXECUTION** |

**Analysis:** The Step 8 section gives Fast movers 5–8 MOS a range of 0–8%, while the summary gives only 0%. For Fast movers >8 MOS, Step 8 allows 5–12% while the summary caps at 5–8%. The summary is a condensed repeat of the framework — likely simplified, possibly in error. The Step 8 section is the detailed authoritative source.

**Decision required from Piranav:**
- D4a: Fast movers 5–8 MOS — use 0–8% (Step 8) or 0% only (Summary)?
- D4b: Fast movers >8 MOS — use 5–12% (Step 8) or 5–8% (Summary)?

**Implementation impact:** Low movers and Medium movers discount logic is fully ready. Fast mover discount logic is blocked pending D4 resolution.

---

## 4. Data Gap Re-verification

### Data gap re-check (post Phase 1B merge)

**Method:** `grep -r` across `dm-dashboard/backend` for each term. Results below are exact.

| Data Required | Search Terms Used | Files Found | Relevant? | Status |
|---|---|---|---|---|
| Landed cost / COGS | `landed_cost`, `cogs`, `cost_price`, `variable_fee`, `cost_of_goods` | `mahima_ai.py`, `sajeepan_ai.py`, `dilaksi_faq_*`, `sajeepan_lens_*`, `thivajini_feed_*` | NO — all AI/FAQ context, not financial data | **NOT FOUND** |
| Reviews / return rate | `review_count`, `return_rate`, `refund_rate`, `review_score`, `rating` | `french_keyword_research/classification.py` (review_count = items needing manual review — unrelated) | NO — unrelated context | **NOT FOUND** |
| Net contribution | `net_contribution`, `net_revenue` | None | N/A | **NOT FOUND** |
| Refund data | `refund` | `shopify_uk_refunds.py`, `shopify_de_refunds.py`, `jefri_nonmoving_workflow.py`, `dilaksi_faq_orders.py`, etc. | Refund data exists for Shopify — line-item grain. NOT financial margin data. | **PARTIAL — refund transactions only, not margin calculation** |

**D2 UNCHANGED:** Landed cost and variable fees do NOT exist in the dm-dashboard business database. Formula A1 (post-promo net contribution) cannot be computed without this data source. Piranav must identify where LEDSone's landed cost is stored (ERP, spreadsheet, Linnworks, or another DB).

**D3 UNCHANGED:** Product reviews and return rate do NOT exist in the dm-dashboard business database. Metrics C2 (review base), A4 (return rate risk) and Section C listing readiness check cannot be computed. Source must be identified (Amazon Seller Central API, eBay API, or manual data).

---

## 5. Rules Ready vs Blocked

### READY FOR SPECIFICATION (can be implemented now from policy alone)

1. **Qualification score structure** — all 5 sections, point allocations, binary scoring, FLOOR rounding
2. **Approval thresholds** — ≥85 Priority, 70–84 Approved, 60–69 Conditional, <60 Rejected
3. **Section B — Strategic Justification** — single intent check (B1), intent–blocker alignment table (B2), Day-14/30 KPI check (B3)
4. **Section C — SKU Readiness** — stock cover ≥45 days (C4), listing quality ≥80% (C3), price elasticity signal (C1)
5. **Section E — Control & Risk** — all four metrics (spend ceiling, KPI targets, kill conditions, ownership)
6. **Section A pass condition** — subtotal ≥18 triggers section-level auto-reject
7. **One-intent-per-SKU enforcement** — DB unique constraint + auto-reject logic
8. **Five promotion intents** — exact names, intent–blocker mapping table
9. **MOS formula** — `Current Stock ÷ Avg Monthly Sales` (stock data available)
10. **Permanent SKU exclusions** — CO/CH/RO/FG/SN/YB/GB combo endings; PLAD combo prefix
11. **Low mover discount range** — 15–30% (consistent across both document sections)
12. **Medium mover discount ranges** — 5–8 MOS: 0–8%; >8 MOS: 10–18% (consistent)
13. **Kill conditions** — 5 auto-terminate triggers, 30-day cool-off, re-entry conditions
14. **Override framework** — 4 exception classes, override requirements, 30-day auto-expiry
15. **Governance roles** — Product Head/Promotion Lead/Finance/Automation/Independent authority
16. **Promotion brief fields** — 7 required fields per SKU
17. **Platform eligibility rules** — Amazon, eBay, Shopify, Wayfair/B&Q (all documented)
18. **Day 7/14/30 monitoring checkpoints** — trigger structure specified
19. **Section D Platform Fit — Amazon** — 3 metrics with point allocations (PPC 6pts, Keywords 5pts, AOV 4pts)

### BLOCKED (cannot specify without resolution)

| Rule | Blocked By | What Is Needed |
|---|---|---|
| A1. Post-promo net contribution formula | D2 — landed cost + variable fees not in DB | Piranav to identify data source |
| A2. Margin headroom ≥25% | D2 — pre-promo gross margin requires cost data | Same |
| A3. Cost stability ±5% | D2 — landed cost variance requires cost data | Same |
| A4. Return rate risk | D3 — return rate not in DB | Piranav to identify source |
| C2. Review base | D3 — review count not in DB | Piranav to identify source |
| Fast mover discount (5–8 MOS) | D4a — conflict: 0–8% vs 0% | Piranav to approve one version |
| Fast mover discount (>8 MOS) | D4b — conflict: 5–12% vs 5–8% | Piranav to approve one version |
| Section D — Platform Fit (non-Amazon) | AMBIGUOUS — eBay/Shopify/Wayfair point allocations not specified in document | Piranav or Nishani to define |

---

## 6. Architecture Reference (unchanged from Phase 1C)

All verified in Phase 1C — not re-documented here. See:
- `evidence/dm-dashboard/promotion-automation-phase1c-discovery-2026-10-15.md`
- `handover/piranav/promotion-automation-phase1c-handover-2026-10-15.md`

Proposed file list unchanged:
- `backend/app/dashboard_pages/promotion_automation.py`
- `backend/app/dashboard_pages/promotion_automation_db.py`
- `frontend/src/admin/pages/PromotionAutomation.jsx`
- `backend/app/main.py` (modify)
- `frontend/src/taskRegistry.js` (modify)
- `frontend/src/admin/AdminLayout.jsx` (modify)

---

## 7. Summary: What Changed in Phase 1D

| Blocker | Before | After |
|---|---|---|
| D1 — Policy doc | NOT FOUND | **RESOLVED** — fully extracted, 395 paragraphs |
| D2 — Landed cost | NOT FOUND | **UNCHANGED** — re-verified NOT FOUND post-merge |
| D3 — Reviews/return rate | NOT FOUND | **UNCHANGED** — re-verified NOT FOUND post-merge |
| D4 — Discount conflict | SUSPECTED | **CONFIRMED** — Fast mover rows conflict in Step 8 vs Summary |

19 rules are now ready for specification. 8 rules remain blocked on D2, D3, D4.

---

## 8. Evidence Paths

| Asset | Path |
|---|---|
| This evidence file | `evidence/dm-dashboard/promotion-automation-phase1d-policy-2026-10-15.md` |
| Prompt | `prompts/dm-dashboard/promotion-automation-phase1d-policy.md` |
| Validation | `validation/piranav/promotion-automation-phase1d-validation-2026-10-15.md` |
| Handover | `handover/piranav/promotion-automation-phase1d-handover-2026-10-15.md` |
| Policy source | `C:\Users\PC\Downloads\Nishani_Promotion_Multi_Channel.docx` |
| Phase 1C handover | `handover/piranav/promotion-automation-phase1c-handover-2026-10-15.md` |
| Phase 1C evidence | `evidence/dm-dashboard/promotion-automation-phase1c-discovery-2026-10-15.md` |
