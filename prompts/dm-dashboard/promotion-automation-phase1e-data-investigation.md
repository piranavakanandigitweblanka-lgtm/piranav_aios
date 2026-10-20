---
name: promotion-automation-phase1e-data-investigation
description: Phase 1E — Investigate authoritative data sources for D2 (landed cost, variable fees) and D3 (product reviews, return rate) using ledsone-db-mcp and ledsone-aios-knowledge-base. Read-only. Do not modify code or schemas.
metadata:
  type: project
  category: dm-dashboard
  phase: 1E
  date: 2026-10-15
  status: PARTIAL — D2 PARTIAL, D3 PARTIAL (Amazon refund rate only), reviews NOT FOUND
---

# Prompt: Promotion Automation Phase 1E — Data Source Investigation

## Objective
Identify authoritative data sources for promotion qualification financial and product-readiness calculations. Resolve blockers D2 (landed cost / variable fees) and D3 (reviews / return rate) using read-only database inspection and AIOS knowledge base search.

## Tools to Use
- `mcp__ledsone-db-mcp__execute_sql_ledsone` — read-only SQL
- `mcp__ledsone-db-mcp__search_objects_ledsone` — schema search
- `mcp__ledsone-aios-knowledge-base__search_files` / `read_file` / `list_folders`
- Local AIOS files (Read, Glob, Grep)

## Investigation Areas

### D2 — Landed Cost and Variable Fees
Search DB columns: cost, landed, purchase, fee, margin, freight, import
Read suppliers schema, accounting schema, listings schema
Verify unit_price in suppliers.invoices and its join path to SKU
Check accounting.amazon_order_expenses for FBA/Commission fees per SKU

### D3 — Reviews and Return Rate
Search DB columns: review, rating, return, refund, category
Check business_reports.amz_sales_and_traffic_by_asin and _by_sku for refund_rate
Check customer_service schema for return records
Verify if review_count exists anywhere in the database

## Safety Rules
- Read-only only — no INSERT, UPDATE, DELETE, DDL
- No PII exposure — LIMIT samples, no customer details
- Do not modify application code or schemas
- Do not commit, push, or deploy

## Output Format
Decision table with: Decision | Evidence found | Source | Status (CONFIRMED/PARTIAL/NOT FOUND) | Gap

## Context Files to Read First
- `handover/piranav/promotion-automation-phase1d-handover-2026-10-15.md`
- `evidence/dm-dashboard/promotion-automation-phase1d-policy-2026-10-15.md`
