# Capability: Staff Skill-Aware AI Task Framing

**ID:** CAP-SKILL-2026-09-04
**Date:** 2026-09-04
**Status:** IMPLEMENTED — LIVE VALIDATION REQUIRED
**Author:** Claude Code (sinrasu mode)
**Reviewed by:** GPT (source-of-truth architecture confirmed)

---

## Purpose

Enable the AI assistant to use a staff member's actual skills, tools expertise, knowledge gaps, and decision authority when framing actionable tasks — so the task instructions are appropriate to the person's real capability level.

**Business rule enforced throughout:**
- Problem severity and priority continue to come from existing business/data rules (ROAS, CTR, OOS, impressions drop, etc.)
- Staff skill does NOT determine which problems are flagged or how urgent they are
- Staff skill ONLY determines how the task is framed, explained, and whether escalation guidance is included

---

## Architecture

### Conceptual Flow

```
REAL BUSINESS DATA
      ↓
EXISTING REQUIREMENT LOGIC
      ↓
PROBLEM FOUND
      ↓
EXISTING SEVERITY / PRIORITY RULE
      ↓
STAFF SKILL CONTEXT (section3 + section7)
      ↓
AI TASK FRAMING (what to say, how to say it, when to say escalate)
      ↓
TASK BRIEF DELIVERED TO STAFF
      ↓
STAFF ACTION
      ↓
EXISTING VERIFICATION SYSTEM
```

### Source of Truth

**JSON profiles in:** `backend/app/staff_profiles/{staff}.json`

All 11 staff have JSON profiles. The TXT source files in `C:\Users\PC\Downloads\skill\` are archived reference documents and are NOT read at runtime.

---

## Staff Profile Structure

All profiles use the 8-section JSON schema:

| Section | Key | Used by AI |
|---|---|---|
| 1 | `section1_identity` | role, market, reporting_to |
| 2 | `section2_daily_routine` | context only |
| 3 | `section3_core_skills` | **YES — newly integrated** |
| 4 | `section4_decision_authority` | decides_alone, escalates_to_muguntha |
| 5 | `section5_working_style` | operating_principle, speed_of_action |
| 6 | `section6_thresholds` | ROAS benchmark, CTR flag, impressions drop |
| 7 | `section7_knowledge_gaps` | **YES — newly integrated** |
| 8 | `section8_patterns` | auto-populated, not injected |

---

## Implementation

### Shared Utilities (`ai_shared.py`)

Two new functions added:

**`load_staff_profile(staff_name: str) -> dict`**
- Loads `staff_profiles/{staff_name}.json`
- Returns `{}` on any failure (safe fallback)
- Used by all 4 newly profiled staff AI files

**`build_skill_block(profile: dict) -> str`**
- Reads `section3_core_skills` and `section7_knowledge_gaps`
- Returns formatted text block for injection into system prompt
- Returns empty string if sections are missing (graceful degradation)
- Reads: `confident_without_guidance`, `tools_expert_in`, `strongest_area`, `less_confident_in`, `markets_tools_not_owned`
- Does NOT read: `section6_thresholds` (thresholds remain controlled per-staff in existing `_build_profile_block()`)

### Profile Coverage

| Staff | Profile before | Profile after | Notes |
|---|---|---|---|
| Jefri | jefri.json (s1,s4,s6) | jefri.json (s1,s3,s4,s6,s7) | Extended |
| Kamsi | Hardcoded inline | kamsi.json (all sections) | Full migration |
| Sajeepan | sajeepan.json (s4,s5,s6,s7) | sajeepan.json (+s3) | Extended |
| Mahima | mahima.json (s1,s4,s6) | mahima.json (+s3,s7) | Extended |
| Sonya | Hardcoded inline | sonya.json (all sections) | New profile |
| Thasitha | thasitha.json (s1,s4,s6) | thasitha.json (+s3,s7) | Extended |
| Theekshy | Hardcoded inline | theekshy.json (all sections) | New profile; Sonya escalation removed |
| Hetheesha | hetheesha.json (s1,s2,s4,s6) | hetheesha.json (+s3,s7) | Extended |
| Thivajini | thivajini.json (s1,s4,s6) | thivajini.json (+s3,s7) | Extended |
| Sukirtha | sukirtha.json (s1,s4,s6) | sukirtha.json (+s3,s7) | Extended |
| Dilaksi | Hardcoded inline | dilaksi.json (all sections) | New profile |

### Files Changed

| File | Change |
|---|---|
| `ai_shared.py` | Added `load_staff_profile()` and `build_skill_block()` |
| `kamsi_ai.py` | Removed hardcoded profile; added JSON loading + `_build_profile_block()` |
| `sonya_ai.py` | Added JSON loading + `_build_profile_block()` |
| `theekshy_ai.py` | Added JSON loading + `_build_profile_block()`; fixed escalation (removed Sonya trainer path) |
| `dilaksi_ai.py` | Added JSON loading + `_build_profile_block()` |
| `jefri_ai.py` | Extended `_build_profile_block()` with `build_skill_block()` |
| `sajeepan_ai.py` | Extended `_build_profile_block()` with `build_skill_block()` |
| `mahima_ai.py` | Extended `_build_profile_block()` with `build_skill_block()` |
| `thasitha_ai.py` | Extended `_build_profile_block()` with `build_skill_block()` |
| `hetheesha_ai.py` | Extended `_build_profile_block()` with `build_skill_block()` |
| `thivajini_ai.py` | Extended `_build_profile_block()` with `build_skill_block()` |
| `sukirtha_ai.py` | Extended `_build_profile_block()` with `build_skill_block()` |
| `staff_profiles/kamsi.json` | Created |
| `staff_profiles/sonya.json` | Created |
| `staff_profiles/theekshy.json` | Created |
| `staff_profiles/dilaksi.json` | Created |

---

## Skill Usage in Task Framing

The AI uses the skill block to:

1. **Calibrate task instructions** — tasks involving skills in `confident_without_guidance` are written as direct actions. Tasks involving items in `less_confident_in` include escalation guidance.

2. **Reference the right tool** — tasks explicitly name the tool the staff knows (e.g. "open GSC" not "check search data" for staff who are GSC-expert).

3. **Enforce market restrictions** — `markets_tools_not_owned` prevents the AI from framing tasks involving markets the staff does not own.

4. **Calibrate explanation depth** — intern-level staff (Theekshy) receive simpler, more explicit action steps. Senior staff receive direct, concise instructions.

---

## Theekshy Escalation Correction

**Before:** `Reporting to: Muguntha (via Sonya as trainer)` — AI instructed to say "Check with Sonya first, then Muguntha before acting."

**After (confirmed business decision):** `Reporting to: Muguntha` — AI says "Check with Muguntha before acting."

All three Sonya trainer references removed from `theekshy_ai.py`.

---

## Sonya Threshold Handling

Three thresholds in Sonya's profile are marked as unconfirmed:
- `budget_move_limit`: `"unconfirmed — requires Muguntha confirmation"`
- `oos_pause_rule`: `"unconfirmed — requires Muguntha confirmation"`
- ROAS scaling trigger: marked as project target, not personal confirmed rule

These are stored in `section6_thresholds` which is NOT read by `build_skill_block()`. The unconfirmed values are preserved for human reference but are not injected into the AI system prompt.

---

## Priority Logic Preservation

URGENCY ORDER blocks verified present in all 11 AI files post-implementation. Priority rules (🔴🟡🟢) are driven by:
- Business data severity (ROAS %, CTR %, cost, OOS status, impressions drop)
- Existing urgency rules in each `_build_system_prompt()` function

Skill data does not touch any priority/urgency rule.

---

## Validation

### Static Checks (Completed — PASS)
- Python syntax: all 12 modified .py files pass `ast.parse()` — PASS
- JSON validity: all 11 profile files parse cleanly — PASS
- Section 3 populated: all 11 profiles have `confident_without_guidance` and `tools_expert_in` — PASS
- `build_skill_block()` output: non-empty for all 11 profiles (552–1131 chars) — PASS
- Hardcoded STAFF PROFILE removed from: kamsi, sonya, theekshy, dilaksi — PASS
- Sonya references removed from theekshy_ai.py — PASS (grep returns empty)
- URGENCY ORDER preserved in all 11 files — PASS
- `_build_profile_block()` present in all 11 files — PASS
- `build_skill_block` imported in all 11 files — PASS

### Live Validation (NOT COMPLETED)
Live validation requires server deployment and manual testing in the browser.

**Required before CLOSED:**
1. Deploy to Contabo server and restart `dm-dashboard` service
2. Open each staff dashboard → verify brief loads without error
3. Verify skill block appears in the AI task brief content
4. Verify task priority/urgency remains data-driven (not skill-driven)
5. Verify Kamsi receives correct data (CTR pages, missing meta) — not hallucinated content
6. Verify Theekshy brief says "Check with Muguntha" not "Check with Sonya"
7. Verify Sonya's unconfirmed thresholds do not appear in her brief

---

## Limitations

1. **No live server test** — all validation is static. Runtime errors can only be confirmed in the live environment.
2. **Sonya section 8 cadence flattened** — 17 AI questions stored as flat array; cadence grouping (daily/14-day/30-day/90-day) is preserved in comments only.
3. **Skill used for framing only** — the AI cannot enforce skill restrictions programmatically. If the AI ignores the skill block in its response, there is no code-level catch.
4. **Theekshy intern profile is thin** — only 3 `confident_without_guidance` items, which correctly reflects her actual capability level.
5. **Dilaksi UK focus only** — `ledsone.usa` and `dcvoltage.co.uk` are noted in the JSON but the dashboard only has UK data sources. The AI is scoped to UK output.

---

## Handover

- Next action: Push dm-dashboard to server and run live validation
- Server: Contabo VPS 158.220.99.127, port 8499
- Push command: from `piranav_aios/dm-dashboard/`, push to `websitetecteam-arch/dm-dashboard`
- Account to select: **websitetecteam-arch**
- Restart: `cd /var/www/dashboard-dm && git pull origin main && systemctl restart dm-dashboard`
- Validation: open each staff dashboard, confirm brief loads, check Theekshy escalation, check Kamsi data
