---
name: sukirtha-ai-brief-variety-cap
description: Sukirtha AI brief now enforces max 2 tasks per category — R1-R5 are always represented alongside R6 missing meta tasks
metadata:
  type: capability
---

# Capability: Sukirtha AI Brief — Variety Cap

**Date:** 2026-09-18
**Commit:** `9ed29d3` on `websitetecteam-arch/dm-dashboard` piranv-work

## What It Does

The Sukirtha daily AI brief now enforces a variety cap: maximum 2 tasks from the same `business_rule` category per brief. Previously, all 5 task slots were filled with R6 (missing_meta) tasks because R6 is urgency #1 and had the most candidates.

## Result

Brief now includes tasks from:
- Max 2 × R6 missing_meta (top 2 by impressions)
- Remaining 3 slots filled from: low_stock, duplicate_listing, slow_moving_stock, low_ctr_page, ga4_traffic_drop

## Where

`dm-dashboard/backend/app/sukirtha_ai.py` — `_build_system_prompt()` INSTRUCTIONS block

## How to Reuse

Apply same VARIETY RULE pattern to any other staff AI brief that has one dominant category overwhelming the others.
