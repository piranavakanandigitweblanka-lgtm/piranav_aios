# Evidence — Sajeepan AI Assistant Gap Repair
**Date:** 2026-09-09
**Session:** Gap audit → full repair implementation

---

## Gaps Addressed

| Gap | Description | Status |
|-----|-------------|--------|
| G01 | R4 feed data was aggregate-only — no item-level candidates exposed to AI | FIXED |
| G02 | candidate_id always null in task_detail — parseBriefTasks() never extracted it | FIXED |
| G03 | AI assigned priority freely — no backend-controlled priority | FIXED |
| G04-G06 | R2 budget_waste, cross_platform; R3 limited_campaigns, drops missing from AI | FIXED |
| G07 | feed_optimization_tracker not checked for R4 task verification | FIXED |
| G08 | matchTable() had no feed_level1 / budget_waste branches | FIXED |

---

## Files Changed

### `dm-dashboard/backend/app/sajeepan_ai.py`
- `_gather_data()`: Added feed_level1 (top 10 R4 L1), feed_level2 (top 5 R4 L2), budget_waste (R2), cross_platform (R2), limited_campaigns (R3), drops (R3) to result dict
- `_build_system_prompt()`: Added FEED LEVEL 1, BUDGET WASTE CAMPAIGNS, LIMITED CAMPAIGNS, SUDDEN DROPS sections; updated urgency order; added CANDIDATE REGISTRY priority instruction
- `_build_brief_data()`: Added feed_level1 and budget_waste tables for modal display

### `dm-dashboard/backend/app/ai_validator.py`
- Added `_calc_backend_priority(business_rule, metrics)` — deterministic priority from business rules
- Updated `_reg_product()` — now stores conv, cv, imp, clk, ctr, roas, campaign_id, campaign_name, backend_priority
- `build_candidate_registry()` — added R4 feed_level1/feed_level2, R2 budget_waste, R3 drops/limited_campaigns as typed candidates
- Original campaigns loop — now includes backend_priority
- `build_candidate_block()` — shows priority field per candidate; caps metrics to 4 per line
- `STRUCTURED_BRIEF_REQUEST` — added rule: priority MUST match CANDIDATE REGISTRY value
- `validate_ai_task()` — added check 2b: priority must match backend_priority when present

### `dm-dashboard/backend/app/ai_shared.py`
- `auto_verify_task()` — sajeepan path now falls through to feed_optimization_tracker check when no change_events found; R4 tasks that update the feed tracker are now auto_verified

### `dm-dashboard/frontend/src/sajeepan/pages/SajeepanDailyTaskPage.jsx`
- `parseBriefTasks()` — JSON mode now extracts `candidate_id: t.candidate_id || null`
- Added `candidateIds` state (`{}`)
- `saveBriefCache` / `loadBriefCache` — now include `candIds` in localStorage payload
- `loadBrief()` — both history and fresh paths build `candIds` map from `validated_tasks`; both call `setCandidateIds(candIds)`
- `handleSelect()` — uses `candidateIds[task.number]` as primary candidate_id source
- `matchTable()` — added feed_level1 and budget_waste branches

---

## DT-001 Resolution
- Closure entry DM-BRIEF-EXCL-2026-09-08 claimed PASS but candidate_id was always null
- Root cause: parseBriefTasks() only extracted {number, priority, title, actions}
- Fix: parseBriefTasks() now extracts candidate_id from JSON response; candidateIds state maps task_number → candidate_id from validated_tasks
- candidate_id flow is now end-to-end: AI JSON → validated_tasks → candidateIds map → handleSelect → task_detail → done-task exclusion

---

## Governance Constraints Respected
- No INSERT/UPDATE/DELETE against production DB
- No new business rules invented — priority rules derived from existing urgency order in system prompt
- feed_optimization_tracker is read-only (SELECT COUNT only)
- Fallback behavior preserved — emoji parser still handles legacy text
- No secrets or credentials hardcoded

---

## Priority Rule Correction — 2026-09-09 (GPT Governance Review)

**Finding:** Two priority thresholds in `_calc_backend_priority()` were not traceable to any authoritative source:
1. `0_conversions_spending` cost ≥ £20 → high (undocumented; profile specifies £5 as the waste trigger, with no priority tier above it)
2. `roas_comparison` roas_chg_pct ≤ -20% → high (undocumented; profile specifies absolute ROAS < 300% threshold and "investigate ≥1 day" before acting)

**Correction applied:** Both undocumented threshold blocks removed. All affected rules now return `"medium"` unconditionally.

**Rules that remain `high` (all verified against sajeepan.json and urgency order):**
- `oos_still_spending` → high
- `feed_level1` → high
- `sudden_drop` → high (hardcoded in drops registration block, not via `_calc_backend_priority`)

**Validation tests run (2026-09-09):**

| Test | Scenario | Expected | Got | Result |
|------|----------|----------|-----|--------|
| A | 0_conv_spending cost=£6 | medium | medium | PASS |
| B | 0_conv_spending cost=£19 | medium | medium | PASS |
| C | 0_conv_spending cost=£25 | medium | medium | PASS |
| D | roas_comparison roas_chg=-30% | medium | medium | PASS |
| E | budget_waste_low_roas | medium | medium | PASS |
| F1 | oos_still_spending | high | high | PASS |
| F2 | feed_level1 | high | high | PASS |
| F3 | sudden_drop | high | high | PASS |
| X1 | 0_conv_high_clicks cost=£50 | medium | medium | PASS |
| X2 | limited_campaign | medium | medium | PASS |
| X3 | feed_level2 | medium | medium | PASS |

All 11 tests PASS. Check 2b in validator confirmed intact.

**Deferred:** ROAS absolute threshold (ROAS < 300% → high) is documented in sajeepan.json but not yet implemented. Requires separate scope approval from GPT.
