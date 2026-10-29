---
name: dm-campaign-agu46-2-removal-2026-10-29
description: Validation for Agu46-2 shared campaign tag removal from SONYA_TAGS. SONYA_TAGS 7→5. 97/97 tests PASS after full spec-outcome audit (4 explicit combo tests added 2026-10-29 re-audit).
metadata:
  type: validation
---

# Validation: DM Campaign — Agu46-2 Removal from SONYA_TAGS

**Date:** 2026-10-29
**Requirement ID:** AIOS-2026-10-29-004

---

## Implementation Checklist

| Item | Result |
|---|---|
| `"agu46-2"` removed from `SONYA_TAGS` in `dm_campaign.py` | DONE |
| `"agu 46-2"` removed from `SONYA_TAGS` in `dm_campaign.py` | DONE |
| Comment added noting removal reason and approval | DONE |
| `test_sonya_tags_count` updated: `== 7` → `== 5` | DONE |
| `test_agu46_2_no_space` updated: expects `"No Tag"` | DONE |
| `test_agu46_2_leading_space` updated: expects `"No Tag"` | DONE |
| `test_agu46_2_internal_space` updated: expects `"No Tag"` | DONE |
| `test_conflict_with_extra_tags` updated: expects `"Sajeepan"` | DONE |
| `test_sjnew26_with_sonya_tag_is_conflict` renamed → `test_sjnew26_with_agu46_2_is_sajeepan`, expects `"Sajeepan"` | DONE |
| `TestAgu462SharedTag` group added (7 regression tests) | DONE |
| **Re-audit 2026-10-29:** 4 explicit combo tests added to `TestAgu462SharedTag` covering spec outcomes 1–3, 5 | DONE |
| `pytest tests/test_dm_campaign.py -q` | **97 passed, 1 warning** |
| `git diff --check` | PASS — no whitespace errors (only CRLF line-ending warnings, not errors) |
| Files changed | `dm_campaign.py` (no change — already correct), `test_dm_campaign.py` (+17 lines, 4 new combo tests) |
| Frontend changes | None required |
| DB / Shopify changes | None — code only |
| Committed | No — working tree only, pending Piranav review |

---

## Regression Coverage (TestAgu462SharedTag — Group J)

| Test | Scenario | Expected | Result |
|---|---|---|---|
| `test_agu46_2_alone_is_no_tag` | `Agu46-2` alone, has_listing=True | `No Tag` | PASS |
| `test_agu46_2_space_variant_is_no_tag` | `Agu 46-2` alone | `No Tag` | PASS |
| `test_sjnew26_plus_agu46_2_is_sajeepan` | `SJNEW26` + `Agu46-2` | `Sajeepan` | PASS |
| `test_genuine_sonya_tag_still_classifies_sonya` | `Dracarys` alone | `Sonya` | PASS |
| `test_sjnew26_plus_genuine_sonya_tag_is_conflict` | `SJNEW26` + `Dracarys` | `Conflict` | PASS |
| `test_agu2026_still_classifies_sonya` | `AGU2026` alone | `Sonya` | PASS |
| `test_agu_still_classifies_sonya` | `AGU` alone | `Sonya` | PASS |
| `test_sj_plus_agu46_2_is_sajeepan` | `SJ` + `Agu46-2` → `Sajeepan` (spec outcome 1) | `Sajeepan` | PASS |
| `test_sj_t_ads_plus_agu46_2_is_sajeepan` | `SJ_T_ADS` + `Agu46-2` → `Sajeepan` (spec outcome 2) | `Sajeepan` | PASS |
| `test_sjk_plus_agu46_2_is_sajeepan` | `SJK` + `Agu46-2` → `Sajeepan` (spec outcome 3) | `Sajeepan` | PASS |
| `test_genuine_sonya_plus_agu46_2_is_sonya` | `Dracarys` + `Agu46-2` → `Sonya` (spec outcome 5) | `Sonya` | PASS |

---

## Re-audit Note (2026-10-29)

GPT coordinator issued a re-audit task requiring explicit coverage of all 12 spec outcomes. Audit confirmed:
- `dm_campaign.py` code was already fully correct after the earlier fix — no code change needed.
- 4 explicit combo tests were missing from `TestAgu462SharedTag`. Added: outcomes 1 (`SJ`+`Agu46-2`), 2 (`SJ_T_ADS`+`Agu46-2`), 3 (`SJK`+`Agu46-2`), 5 (`Dracarys`+`Agu46-2`). Outcome 4 (`SJNEW26`+`Agu46-2`) was already covered.
- All 12 spec outcomes now have explicit test coverage.

## Pass/Fail

**IMPLEMENTATION PASS — 97/97 tests pass. Only test_dm_campaign.py changed (+17 lines). dm_campaign.py unchanged.**
