---
name: mahima-ai-brief-r2-removal
description: Mahima AI brief no longer pulls or suggests R2 (Stock Management) tasks — brief now scoped to R1, R3, R4 only
metadata:
  type: capability
---

# Capability: Mahima AI Brief — R2 Removed, R3/R4 Labelled

**Date:** 2026-09-22
**Commit:** `2a35f7b` on `websitetecteam-arch/dm-dashboard` piranv-work

## What Changed

Mahima does not work on R2 (Stock Management). Removed from AI brief:
- `low_stock_products` DB query (was fetching all spending variant IDs + cross-referencing listings table for qty 1–10)
- "LOW-STOCK" section in system prompt
- Priority item #3 "Low-stock products with high spend"
- `low_stock` card in `_build_brief_data()`
- `low_stock_spending` candidate registration in `ai_validator.py → build_candidate_registry()`

## Current Brief Scope (post-fix)

| Req | Name | Data Source |
|---|---|---|
| R1 | Product Performance | Google Ads — campaign ROAS, product ROAS (poor/top), OOS spending, wasteful products |
| R3 | Search Terms | Google Ads — waste keywords, top converting terms |
| R4 | Product ID Coverage / Feed Gap | Google Ads merchant_products vs campaign coverage |

## Where

`dm-dashboard/backend/app/mahima_ai.py` and `dm-dashboard/backend/app/ai_validator.py`
