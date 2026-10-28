---
name: dm-campaign-stock-status-discovery-2026-10-28
description: Validation for stock status discovery. All 15 live queries ran successfully. Schema confirmed. Mapping chain verified. Coverage measured. DB connection confirmed same instance. No implementation yet.
metadata:
  type: validation
---

# Validation: DM Campaign — Stock Status Discovery

**Date:** 2026-10-28
**Requirement ID:** AIOS-2026-10-28-010

---

## Live Query Checklist

| Query | Purpose | Result |
|---|---|---|
| Q1 — inventory schema columns | Verify 3 tables and columns | PASS — 22 columns returned across 3 tables |
| Q2 — sample product_item_ids | Get real DM campaign IDs to trace | PASS — 10 real IDs returned |
| Q3 — variant listing lookup | item_id='55391394005378' → sku='PCMT20BM' | PASS — confirmed |
| Q4 — parent listing lookup | item_id='14798554268034', sub_source=104, is_parent=1 → sku=NULL | PASS — confirmed parent has no SKU |
| Q5 — stock lookup for PCMT20BM | UK stock = 138 | PASS |
| Q6 — coverage across all DM products | 8,791 total, 8,785 with SKU, 8,585 with stock row | PASS |
| Q7 — inventory_bool distribution | Both true/false have stock rows; avg stock 393 vs 117 | PASS |
| Q8b — two stock tables comparison | Both return UK=138 for PCMT20BM; local_inventory has warehouse label | PASS |
| Q9 — variant-level aggregation | Each product_item_id = distinct SKU — no aggregation needed | PASS |
| Q10 — freshness (updated_at) | Column does not exist on local_inventory table | CONFIRMED LIMITATION |
| Q11 — table columns | 3 columns only: inventory_id, warehouse_location, stock | PASS |
| Q12 — products.updated_at | MAX = 2026-10-28 10:52:11 UTC (today, intra-day) | PASS |
| Q13 — inventory_bool for PCMT20BM | inventory_bool=true, stock=138 | PASS |
| Q14 — 200 no-stock-row cases | Almost all inventory_bool=false | PASS |
| Q15 — schemas on same DB | inventory + listings + google_ads + order_management all present | PASS — no cross-DB issue |

---

## Key Facts Confirmed

| Fact | Confirmed |
|---|---|
| Authoritative stock table: `inventory.local_inventory_current_stock_location_wise` | YES |
| Same Business DB as PRODUCT_PERF_QUERY | YES |
| Variant SKU is available from existing `listing` CTE | YES |
| Parent listing SKU = NULL (cannot use for stock) | YES |
| Coverage: 99.9% SKU match, 97.7% stock row | YES |
| Each product_item_id = unique variant = no aggregation needed | YES |
| `local_inventory_current_stock_location_wise` used by sku_stock_lookup.py (established precedent) | YES |
| `inventory_bool = false` → Unknown (conservative) | YES |

---

## Pass/Fail

**DISCOVERY PASS** — All live queries succeeded, schema verified, mapping chain traced end-to-end, coverage measured, implementation plan ready for approval.
