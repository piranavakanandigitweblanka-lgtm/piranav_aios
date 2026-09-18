---
name: sukirtha-ai-brief-variety-cap
description: Add variety cap to Sukirtha AI brief — max 2 tasks per category so R1-R5 are always represented alongside R6 missing meta tasks
metadata:
  type: feedback
---

# Prompt: Sukirtha AI Brief — Variety Cap Rule

**Registered:** 2026-09-18
**Status:** ACTIVE
**Category:** implementation

## Problem

Sukirtha's daily AI brief was filling all 5 task slots with R6 (Missing Meta Titles/Descriptions) tasks only. R1–R5 data (Low CTR, Duplicates, Slow Moving Stock, GA4 drops, Low Stock) was never surfaced even though live data existed for all of them.

Root cause: R6 is urgency #1 in the system prompt, and there are always 6+ R6 candidates in the registry. Gemini fills all 5 slots with the highest-priority category.

## Fix Applied

In `sukirtha_ai.py` → `_build_system_prompt()` → INSTRUCTIONS section, add:

```
VARIETY RULE: Maximum 2 tasks from the same category (business_rule). If missing_meta has many candidates, pick the top 2 by impressions only — fill remaining slots from low_stock, duplicate_listing, slow_moving_stock, low_ctr_page, or ga4_traffic_drop.
```

## Files

- `dm-dashboard/backend/app/sukirtha_ai.py` — system prompt INSTRUCTIONS block only

## Key Constraints

- No backend logic change needed — this is a prompt-level constraint
- The AI still respects urgency order WITHIN each category slot
- If only R6 data exists and no other categories have candidates, AI picks up to 2 R6 tasks (not 5)
- Commit: `9ed29d3` on `websitetecteam-arch/dm-dashboard` piranv-work
