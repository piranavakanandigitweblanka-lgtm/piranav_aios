---
name: dm-campaign-agu46-2-removal-2026-10-29
description: Bug fix removing agu46-2 and agu 46-2 from SONYA_TAGS. Confirmed shared campaign tags, not exclusive Sonya signals. SONYA_TAGS reduced from 7 to 5. 93/93 tests PASS.
metadata:
  type: evidence
---

# Evidence: DM Campaign — Agu46-2 Shared Campaign Tag Removal

**Date:** 2026-10-29
**Requirement ID:** AIOS-2026-10-29-004
**Approved by:** Piranav (confirmed shared campaign tag, not exclusive Sonya ownership signal)

---

## Root Cause

`Agu46-2` and `Agu 46-2` were in `SONYA_TAGS`, but the tag is a shared Google Ads campaign tag used across multiple owner categories. This caused products tagged with both `SJNEW26` (Sajeepan) and `Agu46-2` to incorrectly show as `Conflict` instead of `Sajeepan`.

## Code Changes

### `backend/app/dashboard_pages/dm_campaign.py`

`SONYA_TAGS` before (7 entries):
```python
SONYA_TAGS = frozenset({
    "agu", "agu2026",
    "agu46-2", "agu 46-2",
    "dracarys", "dracarys vermax", "sonyam&a",
})
```

`SONYA_TAGS` after (5 entries):
```python
SONYA_TAGS = frozenset({
    "agu", "agu2026",
    "dracarys", "dracarys vermax", "sonyam&a",
})
```

Comment added above frozenset:
> `# NOTE: 'agu46-2' and 'agu 46-2' removed 2026-10-29 — confirmed shared campaign tags, not exclusive Sonya ownership signals (Piranav approved).`

### `backend/tests/test_dm_campaign.py`

| Test | Change |
|---|---|
| `test_sonya_tags_count` | `== 7` → `== 5` |
| `test_agu46_2_no_space` | Expected `"Sonya"` → `"No Tag"` |
| `test_agu46_2_leading_space` | Expected `"Sonya"` → `"No Tag"` |
| `test_agu46_2_internal_space` | Expected `"Sonya"` → `"No Tag"` |
| `test_conflict_with_extra_tags` | Expected `"Conflict"` → `"Sajeepan"` (Agu46-2 no longer fires Sonya) |
| `test_sjnew26_with_sonya_tag_is_conflict` | Renamed → `test_sjnew26_with_agu46_2_is_sajeepan`, expected `"Sajeepan"` |
| `TestAgu462SharedTag` class added | 7 new regression tests (Group J) |

## Git Diff Summary

```
backend/app/dashboard_pages/dm_campaign.py |   7 +-
backend/tests/test_dm_campaign.py          | 103 +++++++++++++++++++++++++---
2 files changed, 100 insertions(+), 10 deletions(-)
```

## Test Run

```
93 passed, 1 warning in 4.26s
```

All 93 tests pass. Net additions: 87 → 93 (7 new regression tests in TestAgu462SharedTag, plus earlier SJNEW26 additions cumulative in count).

## Status

PASS — Committed: No (working tree only, pending Piranav review and commit instruction).
