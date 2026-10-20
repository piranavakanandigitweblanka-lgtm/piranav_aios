# Evidence: Promotion Automation — Step 1 System Audit

**Date:** 2026-10-15
**Phase:** Step 1 Audit (post Phase 2A)
**Branch:** piranv-work, HEAD 957c79b
**Executed by:** Claude Code (fork agent)
**Assigned by:** Piranav / Muguntha

---

## 1. Git State

| Property | Value |
|---|---|
| Branch | piranv-work |
| HEAD | 957c79b — feat: add Promotion Automation foundation |
| Working tree | CLEAN |
| Promotion tables in ledsone DB | NOT FOUND (live in app DB at DATABASE_URL — not accessible via ledsone-db-mcp) |

---

## 2. Phase 2A Implementation Summary

**Files confirmed present:**
- `backend/app/dashboard_pages/promotion_automation_db.py` — 195 lines
- `backend/app/dashboard_pages/promotion_automation.py` — 528 lines
- `frontend/src/admin/pages/PromotionAutomation.jsx` — 621 lines
- `backend/app/main.py` — modified (router + schema registered)
- `frontend/src/taskRegistry.js` — modified (tools.PromotionAutomation entry)
- `frontend/src/admin/AdminLayout.jsx` — modified (lazy import + nav + panel)

**What Phase 2A built:**
- 5 DB tables (promotion_briefs, promotion_approvals, promotion_monitoring, promotion_sku_exclusions, promotion_policy_flags)
- 13 API endpoints under /api/admin/promotion-automation/
- make_admin_task_auth("tools.PromotionAutomation") — dev-only bypass, admin requires explicit grant
- financial_eligibility_status = BLOCKED_MISSING_DATA hardcoded on every INSERT
- score_is_executable = FALSE hardcoded, cannot be set True by any endpoint
- 4 pre-seeded policy flags (2 discount conflicts, non-Amazon Section D, Section A financial gate)
- Full approval workflow: draft → submitted → approved/rejected → active → killed
- Day 7/14/30 monitoring record structure
- 30-day cool-off (killed_at timestamp stored, enforcement is UI-level in Phase 2A)
- Frontend: financial blocker banner unconditional (renders in loading, error, and data states)

---

## 3. Database Query Results (live, 2026-10-15)

### Promotion tables in ledsone DB
Result: 0 rows — promotion tables live in app DB (DATABASE_URL), not in the ledsone business DB. This is correct.

### listings.shopify_listings columns
Confirmed: id, item_id, parent_sku, sku, mapped_sku, price, compare_price, currency, title, product_description, quantity, product_type, site, status, channel, sub_source, created_at, updated_at (32 cols total)
No cost, margin, or review fields. Confirmed.

### Sales data (sub_source 8 + 38, last 90 days)
- sub_source_id=8 (Amazon UK LEDSone): 186,363 total orders, latest 2026-10-15 — ACTIVE
- sub_source_id=38 (LEDSone Shopify UK): 43,790 total orders, latest 2026-10-14 — ACTIVE
- 4,906 distinct SKUs with sales in last 90 days (Amazon + Shopify combined)
- real_qty and real_price are VARCHAR — cast to int/numeric required in queries

### inventory.physical_product_stock
Columns: inventory (bigint FK), warehouse, quantity, reserved_quantity, shelf_quantity, shelf_capacity, location fields
Join verified: physical_product_stock.inventory = inventory.products.id → products.sku
Available stock (quantity - reserved_quantity) per SKU is computable. ✓

### inventory.products
Columns: id, title, sku, sku_original, description (no stock columns — stock is in physical_product_stock)
Note: inventory.products has NO stock columns itself — stock is in physical_product_stock table.

### business_reports.amz_sales_and_traffic_by_sku — CRITICAL
- Total rows: 1,653 | Distinct SKUs: 992
- Date range: 2026-01-01 to 2026-01-14 ONLY
- 90-day query returned 0 rows
- **BLOCKER Q7 CONFIRMED CRITICAL:** Amazon refund_rate data is from Jan 2026 only. No recent data. 
  A4 (return rate) and category benchmark are NOT calculable from current data.
  Piranav must trigger a fresh SP-API data load before this source can be used.

### Google Ads data (google_ads schema)
- google_ads.ad_group_products: product_item_id (varchar), NOT sku — join to LEDSone SKU requires mapping via listings
- google_ads.campaign_performance: date, campaign_id, impressions, clicks, conversions, conversion_value, cost, ctr, avg_cpc — campaign level only, NOT SKU level
- amazon_listing_search_engine_keywords: product_id (int), keyword (text) — can check keyword count per product IF product_id maps to SKU

### Amazon keywords
- amazon_listing_search_engine_keywords has product_id → needs join to listings.amazon_listings to get SKU
- Feasible: COUNT(keyword) per SKU, check ≥ 3 keywords indexed (policy C/D requirement)

---

## 4. Requirement Matrix (48 items)

### Data Infrastructure

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 1 | SKU ingestion from listings.shopify_listings | MISSING | Table confirmed, no ingestion job exists |
| 2 | MOS calculation (stock ÷ avg monthly sales) | MISSING | Both inputs available: physical_product_stock.quantity and order_item_info sales. Formula not implemented. |
| 3 | 30/60/90-day sales aggregation per SKU per channel | MISSING | Data available (order_item_info + orders), query not built |
| 4 | Inventory cover calculation (days) | MISSING | physical_product_stock.quantity joinable to SKU. avg daily sales computable. Formula not built. |
| 5 | Landed cost retrieval | BLOCKED BY DATA | suppliers.invoices.unit_price = FOB only. Freight+duty missing. Q1-Q3 unresolved. |
| 6 | Variable fee retrieval per channel | PARTIAL | Amazon: accounting.amazon_order_expenses (FBAPerUnitFulfillmentFee, Commission) confirmed. eBay partial. Shopify partial. B&Q/Wayfair: NOT FOUND. |
| 7 | Post-promo net contribution ≥£2 gate | BLOCKED BY DATA | Requires full landed cost. Q1-Q3 unresolved. |
| 8 | Gross margin ≥25% gate | BLOCKED BY DATA | Requires landed cost. Q1-Q3 unresolved. |
| 9 | 90-day cost variance ≤±5% | BLOCKED BY DATA | Requires landed cost history. Q1-Q3 unresolved. |
| 10 | Return rate per SKU (90d) vs category avg | BLOCKED BY DATA | amz_sales_and_traffic_by_sku.refund_rate exists but only Jan 2026 data. Q7 blocker confirmed. |
| 11 | Review count per SKU per platform | BLOCKED BY DATA | NOT FOUND anywhere in DB. Q4 unresolved. |
| 12 | Listing quality score ≥80% | MISSING | No listing_quality_score column in any listing table. Source undefined — may require platform API or manual scoring. |
| 13 | Amazon PPC status and ACOS | PARTIAL | google_ads.campaign_performance has cost/conversions at campaign level. No per-SKU ACOS. ad_group_products has product_item_id but ACOS not pre-computed. |
| 14 | Amazon keyword indexing (≥3 keywords) | PARTIAL | amazon_listing_search_engine_keywords has keywords per product_id. Join to SKU via listings.amazon_listings needed. Count ≥3 is computable if join works. |
| 15 | AOV per channel | MISSING | Computable from order_item_info (avg basket value per sub_source) but not implemented. |
| 16 | Platform-specific eligibility checks | MISSING | Policy rules for Amazon/eBay/Shopify/Wayfair/B&Q defined in policy. No scoring logic built yet. |

### Scoring Engine

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 17 | Section A — Financial Viability (30pts) + A-gate | PARTIAL | Schema columns exist (score_sections JSONB, overall_score). financial_eligibility_status=BLOCKED_MISSING_DATA enforced. A metrics not computed. |
| 18 | Section B — Strategic Justification (20pts) | MISSING | B1 (single intent) enforced at DB/app level. B2 (intent-blocker alignment), B3 (KPI targets defined) not scored. |
| 19 | Section C — SKU Readiness (20pts) | MISSING | C4 (stock cover) data available. C1/C3 data partially available. C2 (reviews) BLOCKED. Scoring not built. |
| 20 | Section D — Platform Fit, Amazon (15pts) | MISSING | Data partially available (keywords partial, PPC partial). Scoring not built. |
| 21 | Section E — Control & Risk (15pts) | MISSING | All 4 metrics (E1 spend_ceiling, E2 kpi_targets, E3 kill_conditions, E4 owner) stored in promotion_briefs. Scoring not built. |
| 22 | Overall score FLOOR(A+B+C+D+E) | MISSING | overall_score column exists. Calculation not implemented. |
| 23 | Approval band assignment (≥85/70-84/60-69/<60) | MISSING | Not implemented. |
| 24 | Hard auto-reject logic | PARTIAL | B1 (multiple intents) enforced. Stock cover, net contribution hard rejects not enforced. |

### Brief and Intent

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 25 | Promotion brief schema (7 required fields) | IMPLEMENTED | sku, channel, promotion_intent, business_justification, owner, kpi_targets, spend_ceiling, kill_conditions all in schema. |
| 26 | One-intent-per-SKU enforcement | IMPLEMENTED | DB partial unique index + Python 409 pre-check. promotion_automation.py lines 261-279. |
| 27 | Five intent types registered | IMPLEMENTED | VALID_INTENTS set in promotion_automation_db.py line 19-25. Pydantic validator enforces. |
| 28 | Intent–blocker alignment validation (B2) | MISSING | Intent-blocker table defined in policy. Not implemented in scoring. |
| 29 | Permanent SKU exclusion enforcement (CO/CH/RO endings, PLAD prefix) | PARTIAL | promotion_sku_exclusions table and exclusion check on brief creation IMPLEMENTED. Auto-detection of CO/CH/RO/FG/SN/YB/GB+combo and PLAD+combo patterns NOT implemented — must be manually added. |

### Discount Rules

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 30 | Low mover discount range (15–30%) | MISSING | discount_pct column exists. MOS calculation not built. Velocity classification not built. |
| 31 | Medium mover discount 5–8 MOS (0–8%) | MISSING | Same — MOS and velocity classification not built. |
| 32 | Medium mover discount >8 MOS (10–18%) | MISSING | Same. |
| 33 | Fast mover discount | NEEDS BUSINESS DECISION | policy_flags pre-seeded with CONFLICT_UNRESOLVED for both fast mover ranges. D4a/D4b unresolved. |

### Approval Workflow

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 34 | Draft → Submitted → Approved/Rejected workflow | IMPLEMENTED | Full state machine in promotion_automation.py. promotion_approvals audit log. |
| 35 | Separate approval authority (Finance + independent) | PARTIAL | _require_admin_role enforces admin/dev only for approve/reject/kill. No Finance-specific role or dual-approval enforcement. |
| 36 | Override framework (4 exception classes, 30-day expiry) | MISSING | override_expires_at column in promotion_approvals. No override validation, class enforcement, or expiry check. |
| 37 | Approval audit log | IMPLEMENTED | promotion_approvals table with action, performed_by, performed_at, notes. |

### Monitoring and Kill

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 38 | Day 7/14/30 monitoring record structure | IMPLEMENTED | promotion_monitoring table with check_day validated to (7,14,30). |
| 39 | Auto-terminate triggers (5 conditions) | MISSING | monitoring records stored. No automated evaluation logic. kill_triggered column exists but not set automatically. |
| 40 | 30-day cool-off after kill | PARTIAL | killed_at timestamp stored. 30-day cool-off noted in kill endpoint response. Not enforced in brief creation — cool_off window not checked. |
| 41 | Re-entry conditions after cool-off | MISSING | Not implemented. |
| 42 | Spend ceiling breach detection | MISSING | spend_ceiling stored. No monitoring check built. |
| 43 | PPC efficiency collapse detection (ACOS +25% for 3 days) | MISSING | Requires google_ads data pipeline. Not implemented. |

### Governance

| # | Requirement | Status | Evidence |
|---|---|---|---|
| 44 | Role-based access (dev/admin/staff) | IMPLEMENTED | make_admin_task_auth, _require_admin_role checks in all sensitive endpoints. |
| 45 | make_admin_task_auth on all endpoints | IMPLEMENTED | Set on APIRouter constructor (line 34-38, promotion_automation.py). |
| 46 | Financial gate BLOCKED_MISSING_DATA | IMPLEMENTED | Hardcoded in INSERT literal, confirmed in POST /briefs. |
| 47 | No live promotion execution | IMPLEMENTED | No price change, ad write, or external platform call in any endpoint. |
| 48 | Policy conflict flags displayed | IMPLEMENTED | 4 flags pre-seeded. GET /policy-flags and GET /status expose them. Frontend policy flags panel renders them. |

**Summary:** 15 IMPLEMENTED | 5 PARTIAL | 19 MISSING (buildable) | 9 BLOCKED BY DATA | 1 NEEDS BUSINESS DECISION (D4 fast mover discounts, D5 non-Amazon Section D)

---

## 5. Data Source Map

| Required Field | Source Table | Verified | Gap |
|---|---|---|---|
| SKU + title | listings.shopify_listings (sku, title, product_type) | YES | No cost/review fields |
| Channel listing | shopify_listings.channel + sub_source | YES | Multi-channel mapping needs care |
| Sales 30/60/90d | order_management.order_item_info + orders (real_sku, real_qty VARCHAR, real_price VARCHAR, order_date, sub_source_id) | YES | real_qty/price are VARCHAR — cast needed |
| Avg monthly sales | Derivable from above | YES | Formula not built |
| Current stock | inventory.physical_product_stock.quantity JOIN inventory.products.id → sku | YES | Verified with sample data |
| MOS | stock / avg_monthly_sales | YES (inputs confirmed) | Formula not built |
| Days cover | (stock / avg_daily_sales) * 1 | YES (inputs confirmed) | Formula not built |
| Landed cost (FOB) | suppliers.invoices.unit_price via order_items.final_container_id | PARTIAL | FOB only, no freight/duty. Q1-Q3 unresolved. |
| Variable fees (Amazon) | accounting.amazon_order_expenses (FBAPerUnitFulfillmentFee, Commission) per seller_sku | YES | Historical per-order — needs avg per unit |
| Variable fees (eBay) | accounting.ebay_order_expenses | PARTIAL | Per order, not per SKU |
| Variable fees (Shopify) | accounting.shopify_transactions.fee | PARTIAL | Per transaction |
| Variable fees (B&Q/Wayfair) | NOT FOUND | NO | Source unknown |
| Selling price | order_item_info.real_price OR shopify_listings.price | YES | |
| Gross margin | Requires landed cost | BLOCKED | Q1-Q3 |
| 90-day cost variance | Requires landed cost history | BLOCKED | Q1-Q3 |
| Return rate (Amazon) | business_reports.amz_sales_and_traffic_by_sku.refund_rate | BLOCKED | Only Jan 2026 data (1,653 rows). Q7 confirmed critical. |
| Return rate (non-Amazon) | NOT FOUND | NO | Q5 decision needed |
| Category return benchmark | Derivable from above IF data available | BLOCKED | Same Q7 blocker |
| Review count | NOT FOUND anywhere in DB | NO | Q4 — SP-API or manual |
| Listing quality score | NOT FOUND | NO | Source undefined — policy requires ≥80% |
| Amazon PPC active | google_ads.campaigns / ad_group_products | PARTIAL | product_item_id not SKU — join mapping needed |
| Amazon ACOS | NOT pre-computed | PARTIAL | Derivable: cost/conversion_value per campaign, but not per SKU |
| Amazon keywords ≥3 | amazon_listing_search_engine_keywords (product_id, keyword) | PARTIAL | Join to SKU via amazon_listings needed |
| AOV per channel | Derivable from order_item_info | YES (inputs) | Formula not built |
| CTR/CVR | google_ads.campaign_performance.ctr | PARTIAL | Campaign-level only, not SKU-level |
| Competitor pricing | NOT FOUND | NO | No competitor data in DB |

---

## 6. Buildable Now vs Blocked

### BUILDABLE NOW (19 items — no business decisions needed)

| Gap | Effort | Files |
|---|---|---|
| Sales aggregation endpoint (30/60/90d per SKU) | Medium | promotion_automation.py + new GET /sku/{sku}/sales |
| MOS calculation per SKU | Medium | promotion_automation.py |
| Inventory days cover per SKU | Small | promotion_automation.py |
| Section B scoring (B1 already enforced, add B2+B3) | Small | promotion_automation.py (score calculation function) |
| Section C partial: C3 listing quality (if source defined), C4 stock cover ≥45d | Medium | promotion_automation.py |
| Section E scoring (all 4 metrics from brief fields) | Small | promotion_automation.py |
| Overall score calculation FLOOR(sum) | Small | promotion_automation.py |
| Approval band assignment | Small | promotion_automation.py |
| Amazon keyword count check (≥3) | Small | promotion_automation.py + join to amazon_listing_search_engine_keywords |
| Amazon FBA variable fee avg per SKU | Medium | promotion_automation.py |
| AOV per channel per SKU | Medium | promotion_automation.py |
| MOS velocity classification (low/medium/fast) | Small | promotion_automation.py (after MOS built) |
| Low + medium mover discount recommendation | Small | promotion_automation.py (after velocity built) |
| Permanent SKU auto-exclusion detection (CO/CH/RO combo, PLAD combo) | Small | promotion_automation.py or startup seeder |
| 30-day cool-off enforcement in brief creation | Small | POST /briefs — check killed_at + 30d |
| Override framework (4 classes, 30-day expiry check) | Medium | promotion_automation.py + DB |
| Dual-approval separation flag (Finance role) | Small | promotion_automation.py — add finance_approved flag |
| Section D Amazon scoring (PPC active check + keyword count + AOV) | Medium | promotion_automation.py |
| Kill condition auto-evaluation on monitoring POST | Medium | promotion_automation.py |

### BLOCKED (needs Piranav decisions first)

| Gap | Blocker |
|---|---|
| Section A scoring (A1/A2/A3) | Q1-Q3: FOB accepted? Freight method? Currency? |
| Section A gate (subtotal ≥18 auto-reject) | Same — A1/A2/A3 not computable |
| Return rate A4 | Q5+Q7: Amazon refund_rate acceptable? Coverage confirmed? (CONFIRMED: only Jan 2026 data — must reload) |
| Review count C2 | Q4: Review source (SP-API? Manual?) |
| Fast mover discount D4a/D4b | Business decision — D4a/D4b |
| Non-Amazon Section D points | D5 — not in policy document |
| Listing quality score | Source not defined — platform API? Internal QA? |
| B&Q/Wayfair variable fees | Source unknown |
| Amazon SKU-level ACOS | Needs product_item_id → SKU mapping |

---

## 7. Recommended Implementation Plan

### Phase 2B — Build scoring engine with available data (no decisions needed)
**Files:** promotion_automation.py (main work), promotion_automation_db.py (minor additions)
**Builds:**
1. `GET /sku/{sku}/snapshot` — fetch sales (90d), inventory, MOS, days cover, Amazon fees, AOV from business DB
2. Score calculation function: Section B (B1 already done, add B2+B3), Section C (C1/C3/C4), Section D (Amazon: keywords + AOV), Section E (all 4)
3. MOS velocity classification → discount recommendation (low/medium only; fast mover CONFLICT_UNRESOLVED shown)
4. Auto-exclusion seeder: scan shopify_listings for CO/CH/RO/FG/SN/YB/GB combo ending and PLAD combo prefix → insert into promotion_sku_exclusions on startup
5. 30-day cool-off enforcement in POST /briefs
6. Kill condition auto-evaluation in POST /monitoring/{brief_id}
7. Override class enforcement (4 classes, 30-day expiry)
**Outcome:** System can score Sections B/C/D/E fully. Section A stays BLOCKED_MISSING_DATA. Score shown as "PARTIAL — Section A pending"

### Phase 2C — Section A (after Q1-Q7 answered + Amazon refund data reloaded)
**Builds:** Section A financial metrics (A1-A4), financial hard reject gate

### Phase 2D — Fast mover discounts + non-Amazon Section D (after D4/D5 resolved)
**Builds:** Fast mover discount logic, eBay/Shopify/Wayfair Section D scoring

### Phase 2E — Promotion execution (after all gates confirmed safe)
**Builds:** Integration with Shopify Discount API, Amazon pricing — only after explicit Piranav approval

---

## 8. Outstanding Decisions

| # | Decision | Blocks |
|---|---|---|
| Q1 | Is suppliers.invoices.unit_price (FOB) accepted cost basis? | A1/A2/A3 |
| Q2 | Freight allocation method? | A1/A2/A3 |
| Q3 | Currency of unit_price? | A1/A2/A3 |
| Q4 | Product review source? | C2 |
| Q5 | Amazon refund_rate for A4? | A4 |
| Q6 | Amazon-only scope for Section A? | Phase 2C scope |
| Q7 | Amazon UK refund data coverage (CONFIRMED: only Jan 2026 — reload needed) | A4 |
| D4a | Fast mover 5-8 MOS: 0-8% or 0%? | Discount generation |
| D4b | Fast mover >8 MOS: 5-12% or 5-8%? | Discount generation |
| D5 | Non-Amazon Section D point allocations | Multi-channel scoring |
| NEW | Listing quality score source (platform API? internal QA?) | C3 |
| NEW | Amazon product_item_id → SKU mapping for ACOS | Section D ACOS |
