# Capability — Sajeepan AI Assistant (Repaired)
**Date:** 2026-09-09
**Status:** LIVE
**Replaces:** `capability/piranav/sajeepan-ai-assistant-2026-08-21.md` (stale, old architecture)

---

## What This Capability Does

Generates a daily prioritised action brief for Sajeepan (Google Ads PMax, LEDSone UK only).
Validates AI output against a pre-computed candidate registry before tasks reach the UI.
Tracks task selection, completion, and verification end-to-end.

---

## Data Sources

| Source | Function | Data Used |
|--------|----------|-----------|
| R1 `req1()` | Campaign ROAS | campaigns list with cost, roas, roas_prev |
| R2 `req2()` | Waste + cross-platform | waste_products, waste_keywords, budget_waste, cross_platform |
| R3 `req3()` | Morning risk | oos_spending, limited_campaigns, drops |
| R4 `req4()` | Feed optimization | feed_level1 (top 10), feed_level2 (top 5) — item-level with title, item_id, cost, campaign |

---

## Candidate Registry

Every AI task must reference a candidate_id from the pre-computed registry:

| Type | Prefix | Business Rule | Backend Priority |
|------|--------|--------------|-----------------|
| Product (waste) | `item_id:` or `product:` | 0_conversions_spending | high if cost≥20, else medium |
| Product (OOS) | `item_id:` | oos_still_spending | high |
| Product (feed L1) | `item_id:` | feed_level1 | high |
| Product (feed L2) | `item_id:` | feed_level2 | medium |
| Campaign (ROAS drop) | `campaign:` | roas_comparison | medium |
| Campaign (budget waste) | `campaign:` | budget_waste_low_roas | medium |
| Campaign (sudden drop) | `campaign:` | sudden_drop | high |
| Campaign (limited) | `campaign:` | limited_campaign | medium |
| Search term | `term:` | 0_conversions_spending | medium |

Backend priority is injected into the registry and shown in CANDIDATE REGISTRY prompt block.
AI must use priority exactly as shown — validator rejects mismatches (check 2b).

**Priority rule sources (authoritative):**
- `high`: oos_still_spending, feed_level1, sudden_drop — from sajeepan.json "act immediately on OOS" and system prompt urgency order items 2–3
- `medium`: all other rules — from sajeepan.json "investigate ≥1 day before acting on ROAS drops"
- No cost threshold (£20) or ROAS change threshold (-20%) is used — both were removed after GPT governance review 2026-09-09 as undocumented
- ROAS absolute threshold (ROAS < 300% → high) is documented in sajeepan.json but NOT yet implemented — deferred to separate scope decision

---

## Validation Gate (7 checks)

1. Required fields present
2. Priority in {high, medium, low}
2b. Priority matches backend_priority in registry
3. candidate_id exists in registry
4. candidate_type matches registry
5. Market is UK (Sajeepan owns UK only)
6. Metric value within tolerance of source
7. URL from source data only

---

## Task Verification

When Sajeepan marks a task done:
1. Check `google_ads.google_ads_change_events` for today's changes by Sajeepan's email
2. If no change_events → check `public.feed_optimization_tracker WHERE updated_at::date = CURRENT_DATE`
3. Either source → `auto_verified`; both empty → `unverified`

---

## Done-Task Exclusion

`_get_done_candidate_ids()` reads `candidate_id` from `task_detail` JSON in `staff_task_log`.
Excludes candidates actioned in last 7 days from today's brief.
This works correctly after the G02 fix — candidate_id flows end-to-end from AI JSON → validated_tasks → candidateIds map → handleSelect → task_detail.

---

## Frontend State

| State | Purpose |
|-------|---------|
| `briefTasks` | Parsed task objects (number, priority, title, actions, candidate_id) |
| `candidateIds` | Map task_number → candidate_id from validated_tasks |
| `validatedNums` | Set of validated task numbers |
| `sourceTags` | Map task_number → source_tag (e.g. "oos", "feed_l1") |
| `briefData` | Metrics tables for modal display |

All state except candidateIds existed before this repair. candidateIds was added to fix G02.
