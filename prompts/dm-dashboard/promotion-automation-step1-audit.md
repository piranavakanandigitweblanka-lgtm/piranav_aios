---
name: promotion-automation-step1-audit
description: Full system audit of Phase 2A Promotion Automation against policy requirements — maps 48 requirements to IMPLEMENTED/PARTIAL/MISSING/BLOCKED, verifies all DB data sources, identifies buildable gaps and recommended Phase 2B scope
metadata:
  type: project
  phase: STEP-1-AUDIT
  date: 2026-10-15
---

# Prompt: Promotion Automation — Step 1 System Audit

**Purpose:** Comprehensive audit of existing Phase 2A implementation against the full policy from Nishani_Promotion_Multi_Channel.docx. Maps every requirement to implementation status, re-verifies all database data sources via live SQL queries, and produces a prioritised implementation plan.

**AIOS ROOT:** `C:\Users\PC\Documents\piranav_aios`
**Repository:** dm-dashboard, branch piranv-work
**Policy source:** `C:\Users\PC\Downloads\Nishani_Promotion_Multi_Channel.docx`

## What to do

1. Read ALL Phase 2A implementation files in full (promotion_automation.py, promotion_automation_db.py, PromotionAutomation.jsx)
2. Read Phase 1D policy evidence and Phase 1E data investigation evidence
3. Run live read-only SQL via ledsone-db-mcp to re-verify all data sources
4. Produce 48-item requirement matrix: IMPLEMENTED / PARTIAL / MISSING / BLOCKED BY DATA / NEEDS BUSINESS DECISION
5. Produce data source map: required field → actual table/column → verified? → gap
6. Split gaps into BUILDABLE NOW vs BLOCKED
7. Recommend Phase 2B scope (exact files and data sources)
8. Save evidence, validation, handover, update PROMPT_REGISTER and closure

## Key findings from this audit (2026-10-15)

- Phase 2A: 15/48 requirements IMPLEMENTED, 8 PARTIAL, 14 MISSING (buildable), 11 BLOCKED BY DATA
- Promotion tables NOT yet in ledsone DB (live in app DB at DATABASE_URL, not inspectable via ledsone-db-mcp)
- Sales data: 4,906 SKUs with 90-day sales history confirmed (sub_source 8 + 38)
- Inventory: physical_product_stock.quantity joinable to SKU via inventory.products.id — MOS calculable
- real_qty and real_price are VARCHAR in order_item_info — cast required in queries
- Amazon refund_rate: only 1,653 rows, Jan 2026 only — NO recent 90-day data. Q7 blocker confirmed critical.
- Google Ads: google_ads.ad_group_products has product_item_id (not SKU) — join to SKU needs mapping
- Amazon keywords: amazon_listing_search_engine_keywords exists (product_id, keyword) — indexing check feasible

## Do not run

- No INSERT, UPDATE, DELETE
- No schema changes
- No commits or deployments
