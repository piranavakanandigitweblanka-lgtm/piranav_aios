---
name: dm-campaign-agu46-2-removal-2026-10-29
description: Validation for Agu46-2 shared campaign tag removal from SONYA_TAGS. SONYA_TAGS 7→5. 93/93 tests PASS including 7 new TestAgu462SharedTag regression tests.
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
| `pytest tests/test_dm_campaign.py -q` | **93 passed, 1 warning** |
| `git diff --check` | PASS — no whitespace errors (only CRLF line-ending warnings, not errors) |
| Files changed | `dm_campaign.py` (+7 lines net), `test_dm_campaign.py` (+100 lines net) |
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

---

## Pass/Fail

**IMPLEMENTATION PASS — 93/93 tests pass. Working tree clean (diff only in 2 intended files).**
