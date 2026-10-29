---
name: dm-campaign-sjnew26-tag-investigation-2026-10-29
description: Validation for SJNEW26 tag investigation + implementation. Investigation INCONCLUSIVE → Piranav confirmed 2026-10-29. sjnew26 added to SAJEEPAN_TAGS. 86/86 tests PASS including 12 new SJNEW26 regression tests.
metadata:
  type: validation
---

# Validation: DM Campaign — SJNEW26 Tag Investigation

**Date:** 2026-10-29
**Requirement ID:** AIOS-2026-10-29-002

---

## DB Query Checklist

| Query | Purpose | Result |
|---|---|---|
| Q1 | SJNEW26 prevalence and raw form | PASS — 49 products, 1 raw form (` SJNEW26`), all active |
| Q2 | SJNEW26 × approved SAJEEPAN_TAGS co-occurrence | PASS — **0 products** have both |
| Q3 | All tags on SJNEW26 products | PASS — top 30 returned; no approved owner tag in list |
| Q4 | SJNEW26 × approved SONYA_TAGS conflict check | PASS — 1 product has `Agu46-2` |
| Q5 | SJ-pattern batch tags (SJNEW, SJNEW26, SJXXX26) | PASS — only SJNEW and SJNEW26 found |
| Q6 | SJNEW vs SJNEW26 overlap + SJNEW × approved SJ | PASS — 0 overlap; SJNEW 100% corroborated with approved SJ |
| Q7 | SEPCL26 × approved SJ tags | PASS — SJ: 13, SJRAT: 7; SEPCL26 confirmed Sajeepan |
| Q8 | SJNEW26+SEPCL26 intersection × approved SJ | PASS — 0 products have approved SJ even with double-batch context |
| Q9 | Full approved owner tag check on SJNEW26 products | PASS — only `Agu46-2` (1 product, Sonya) |

---

## Process Checklist

| Check | Result |
|---|---|
| Code read — `dm_campaign.py` SONYA_TAGS / SAJEEPAN_TAGS | PASS |
| AIOS docs searched before creating new files | PASS — 11 existing files found; no duplicate created |
| No code modified | CONFIRMED |
| No DB writes | CONFIRMED |
| No Shopify data changed | CONFIRMED |
| No commit or push | CONFIRMED |

---

## Implementation Checklist (AIOS-2026-10-29-003)

| Item | Result |
|---|---|
| `"sjnew26"` added to `SAJEEPAN_TAGS` in `dm_campaign.py` | DONE |
| `SAJEEPAN_TAGS` count updated to 9 in `test_sajeepan_tags_count` | DONE |
| 2 frozenset guard tests added to `TestFrozensets` | DONE |
| `TestSJNEW26` group added (10 regression tests) | DONE |
| `pytest tests/test_dm_campaign.py` | **86 passed, 1 warning** |
| `git diff --check` | PASS — no whitespace errors |
| Files changed | `dm_campaign.py` (+1 line), `test_dm_campaign.py` (+55 lines) |
| Frontend changes | None required |
| DB / Shopify changes | None — code only |
| Committed | No — working tree only, pending Piranav review |

## Regression Coverage (TestSJNEW26)

| Test | Scenario | Result |
|---|---|---|
| `test_sjnew26_uppercase` | `SJNEW26` → Sajeepan | PASS |
| `test_sjnew26_lowercase` | `sjnew26` → Sajeepan | PASS |
| `test_sjnew26_leading_space` | ` SJNEW26` (DB form) → Sajeepan | PASS |
| `test_sjnew26_only_tag` | SJNEW26 + category tags, no other owner tag → Sajeepan | PASS |
| `test_sjnew26_with_sonya_tag_is_conflict` | SJNEW26 + Agu46-2 → Conflict | PASS |
| `test_sjnew26_does_not_match_sjnew260` | `SJNEW260` → No Tag (no substring match) | PASS |
| `test_sjnew26_does_not_match_sjnew2` | `SJNEW2` → No Tag | PASS |
| `test_existing_sj_tag_still_classifies_sajeepan` | ` SJ` → Sajeepan (regression) | PASS |
| `test_no_tag_unchanged` | No owner tag → No Tag | PASS |
| `test_unresolved_unchanged` | No listing → Unresolved | PASS |

## Pass/Fail

**IMPLEMENTATION PASS — 86/86 tests pass. Working tree clean (diff only in 2 intended files).**
