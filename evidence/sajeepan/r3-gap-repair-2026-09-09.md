# Evidence — Sajeepan R3 Gap Repair — 2026-09-09

**Session date:** 2026-09-09
**Repo:** websitetecteam-arch/dm-dashboard · branch: piranv-work
**Status:** PASS

## What Was Fixed

### Fix 1 — Zero-conv dead zone (commit 50a38c7)
conv=0, spend £5–£9.99 where cost >= product_price was wrongly falling to `exclude` band.
Fixed: now correctly assigned to `zero-low` band.
Location: sajeepan.py lines 558–561

### Fix 2 — Urgent OOS flag (commit 50a38c7)
Added urgent: True when OOS product still has cost/impressions/clicks > 0.
Signals ads still burning budget after going out of stock.
Frontend must show red URGENT badge.

### Fix 3A — Limited campaigns extra fields (commit 5a86719)
Added budget_status + bidding_strategy_type to limited_campaigns response.
limitation_reason: null placeholder added (DB has no primary_status_reasons column — confirmed).
Option B (ingestion pipeline change) tracked as separate task.

### Fix 4 — Low stock warning band (commit b10b14b)
Products with ROAS >= 400% but stock <= 10 units → band = low-stock (not scale).
qty + low_stock bool added to all roas_products rows.
Threshold: 10 units hardcoded.

## Key Facts

- google_ads.merchant_products confirmed 717,066 rows
- LOWER() join pattern confirmed for handle matching
- primary_status_reasons column does NOT exist in campaigns table
