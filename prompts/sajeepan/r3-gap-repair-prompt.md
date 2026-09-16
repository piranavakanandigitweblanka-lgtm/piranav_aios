# Prompt: Sajeepan R3 — Gap Repair Pattern

**Registered:** 2026-09-16 (retrospective)
**Status:** ACTIVE
**Category:** implementation
**Used in:** dm-dashboard · sajeepan.py backend

---

## What This Solves

R3 backend had classification gaps: products with conv=0 and spend £5–£9.99 where cost >= price were falling into wrong band. OOS products still spending had no urgent flag.

---

## Prompt Pattern

```
Fix classification gaps in [staff].py R3 band logic:

Fix 1 — Zero-conv dead zone:
  conv=0, spend £5–£9.99 where cost >= product_price
  Was: falling to `exclude` band
  Should be: `zero-low` band
  Location: band assignment logic lines 558–561

Fix 2 — Urgent OOS flag:
  Add urgent: True when OOS product has cost > 0 OR impressions > 0 OR clicks > 0
  Signals: ads still burning budget after going out of stock
  Frontend must show red "URGENT" badge when urgent=True

Fix 3A — Limited campaigns extra fields:
  Add budget_status + bidding_strategy_type to limited_campaigns response
  Add limitation_reason: null placeholder (DB has no primary_status_reasons column)

Fix 4 — Low stock warning band:
  Products with ROAS >= 400% but stock <= 10 units → band = low-stock (not scale)
  Add qty + low_stock bool to all roas_products rows
  Threshold: 10 units (hardcoded, config = future task)
```

---

## Key Facts

- `google_ads.merchant_products` — 717,066 rows (confirmed live)
- LOWER() join pattern needed for handle matching
- primary_status_reasons column does NOT exist in DB — Option B (ingestion pipeline) is separate task
- Commits: 50a38c7, 5a86719, b10b14b on piranv-work
