---
name: promotion-automation-phase2b-shopify-eligibility
description: Phase 2B — Shopify-only SKU eligibility engine for Promotion Automation system. Adds snapshot, evaluate, eligible-skus, and seed-exclusions endpoints using verified Shopify UK data sources.
metadata:
  type: prompt
  category: dm-dashboard
  created: 2026-10-15
  phase: PROMO-02-B
---

# Prompt: Promotion Automation Phase 2B — Shopify Eligibility Engine

## Task

Implement the Shopify-only SKU eligibility scoring engine for the DM Dashboard Promotion Automation system.

## Context

- Phase 2A foundation is committed (commit 957c79b) — DB tables, brief lifecycle, financial gate enforcement
- Section A (Financial, 30pts) is permanently BLOCKED_MISSING_DATA — Q1–Q7 unresolved
- Shopify UK sub_source_id = **104** (name="ledsone") — confirmed by querying order counts
- `order_item_info.real_qty` and `real_price` are VARCHAR — must use regex guard `~ '^[0-9]+$'` before CAST
- Orders date column: `order_date` (NOT `created_at`)
- Stock join: `inventory.products p JOIN inventory.physical_product_stock pps ON pps.inventory = p.id`
- Listings table: `listings.shopify_listings` columns: `sku, title, price, product_type, status, sub_source, channel`
- Suppliers invoices: no SKU column — cost is UNAVAILABLE, mark `cost_source='UNAVAILABLE'` and warn
- Business DB: `get_business_conn()` from `..core.db`
- App DB: `get_conn()` from `..core.db`

## Files to Modify

- `backend/app/dashboard_pages/promotion_automation.py` — add new endpoints
- `frontend/src/admin/pages/PromotionAutomation.jsx` — add Eligible SKUs tab

## Endpoints to Add

### GET /sku/{sku}/snapshot
- Query `listings.shopify_listings` where `sku=%s AND sub_source=104`
- Query `order_item_info JOIN orders` for 30/60/90-day sales with safe CAST
- Query `inventory.physical_product_stock` for current stock
- Return: sales_30/60/90d, avg_monthly_sales, mos, days_cover, velocity_class, discount_recommendation
- Section A always BLOCKED_MISSING_DATA — never compute

### POST /sku/{sku}/evaluate
- Requires `brief_id` query param
- Section B (20pts): B1 valid intent (8), B2 intent-blocker alignment (6), B3 Day14+Day30 KPIs (6)
- Section C partial (20pts): C1 UNAVAILABLE (0), C2/C3 BLOCKED (0), C4 days_cover≥45 (6, hard reject if fail)
- Section D Shopify proposed (15pts, PROPOSED_NOT_POLICY_APPROVED): D1 bundle/upsell (6), D2 AOV (5), D3 CRM (4)
- Section E (15pts): E1 spend_ceiling (5), E2 KPIs (4), E3 kill_conditions (4), E4 owner (2)
- score_is_executable always False; score_a_status always BLOCKED_MISSING_DATA

### GET /eligible-skus
- Batch query all active Shopify UK SKUs with sales + stock
- Return sorted: non-rejected first, then by sales_90d desc
- Include velocity_class and discount_recommendation per SKU

### POST /seed-exclusions
- Admin only (`_require_admin_role`)
- Exclude SKUs ending in: CO, CH, RO, FG, SN, YB, GB (colour variants)
- Exclude SKUs starting with: PLAD (Pipe Light products)
- Use `INSERT ... ON CONFLICT DO NOTHING` — never overwrites manual exclusions

## Frontend Tab

Add "Eligible SKUs" tab to `PromotionAutomation.jsx`:
- Table: SKU, Title, Price, Sales 90d, Stock, MOS, Days Cover, Velocity, Discount Rec., Status
- Load button (lazy — not auto-load on mount)
- Seed Exclusions button
- Section A blocked warning banner always visible
- Hard-rejected rows highlighted red

## Scoring Reference

| Intent | Allowed Blockers (B2) |
|---|---|
| Rank Builder | rank, impressions |
| Review Accelerator | review count |
| AOV Anchor | basket size |
| Hero Defender | market share |
| Lifecycle / Clearance | stock age |

| Velocity | MOS Range | Discount |
|---|---|---|
| fast | ≤3 MOS | CONFLICT_UNRESOLVED (D4a/D4b unresolved) |
| medium | 3<MOS≤8 | 0-8% (APPROVED) |
| medium | MOS>8 | 10-18% (APPROVED) |
| low | MOS>8 | 15-30% (APPROVED) |

## Tests (12 required)

Pure unit tests in `backend/tests/test_promotion_automation.py`:
- T01: sub_source_id == 104
- T02-T05: velocity classification (fast/medium/low/UNKNOWN)
- T06-T09: discount recommendation per velocity
- T10: suffix exclusion set matches policy
- T11: PLAD prefix in exclusion set
- T12: intent-blocker map covers all valid intents

## Security Constraints

- Section A score must NEVER be computed — always BLOCKED_MISSING_DATA
- score_is_executable must never be set to True
- No hardcoded cost figures or assumed fee rates
- Missing data = explicit warning, never treated as zero
- No live promotion execution or external writes
- No secrets in source code or logs
