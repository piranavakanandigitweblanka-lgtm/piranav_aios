---
name: dm-campaign-owner-tag-correction
description: Reusable prompt for correcting owner tag dictionary entries in DM Campaign. Use when a tag is confirmed to be a shared campaign tag rather than an exclusive owner signal, and must be removed from SONYA_TAGS or SAJEEPAN_TAGS.
metadata:
  type: prompt
  category: dm-dashboard
---

# DM Campaign — Owner Tag Dictionary Correction

## Purpose

Remove a tag from `SONYA_TAGS` or `SAJEEPAN_TAGS` after Piranav confirms it is not an exclusive owner signal. Update affected tests and add regression tests confirming the corrected behaviour.

## Files to Change

- `backend/app/dashboard_pages/dm_campaign.py` — frozenset change + comment
- `backend/tests/test_dm_campaign.py` — update broken tests, add regression group

## Steps

### Phase 1 — Code Change

1. Remove the tag from the relevant frozenset (`SONYA_TAGS` or `SAJEEPAN_TAGS`)
2. Add a comment noting the removal date, reason, and Piranav approval
3. Update the count assertion in `test_sonya_tags_count` or `test_sajeepan_tags_count`

### Phase 2 — Fix Broken Tests

For each test that previously expected a classification driven by the removed tag:
- If the tag was the only owner signal → change expected value to `"No Tag"`
- If the tag was one of two owner signals (causing Conflict) → change expected value to the remaining owner's classification

Rename any test whose description no longer matches the new expected behaviour.

### Phase 3 — Regression Tests

Add a new test group (e.g. `TestTagNameSharedTag`) with:
1. Removed tag alone, has_listing=True → `"No Tag"`
2. Space variant of removed tag alone → `"No Tag"`
3. Previously-failing Conflict case → correct single-owner result
4. Remaining approved tags from same frozenset still classify correctly (at least 2 examples)
5. Genuine tags from both families together → `"Conflict"` (still works)

### Phase 4 — Verify

```bash
cd backend && source venv/Scripts/activate
python -m pytest tests/test_dm_campaign.py -q
git diff --check
git diff --stat HEAD
```

Expected: all tests PASS, only `dm_campaign.py` and `test_dm_campaign.py` in diff.

## Key Constraints

- Do NOT commit or push — working tree only until Piranav instructs
- Do NOT change any other classification rules without explicit approval
- Do NOT change frontend — tag dictionary corrections are backend-only
- Always add comment with removal date, reason, and approval on the frozenset

## AIOS Auto-Update Required

After passing tests: evidence + validation + closure + PROMPT_REGISTER.
