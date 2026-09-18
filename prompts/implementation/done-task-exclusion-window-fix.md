# Prompt: Done Task Exclusion Window Fix — Staff AI Brief

**Registered:** 2026-09-17
**Status:** ACTIVE
**Category:** implementation

## What This Fixes

`_get_done_candidate_ids()` in staff AI brief files has a `days` parameter that is defined but never applied in the SQL query. This means tasks marked done are permanently excluded from the brief instead of only being excluded for the intended window.

## Files to Change

Any `[staff]_ai.py` file that contains `_get_done_candidate_ids()` with no date filter in the SQL.

## Fix

Replace the SQL inside `_get_done_candidate_ids()`:

**Before:**
```sql
SELECT task_detail FROM public.staff_task_log
WHERE staff = '[staff]'
  AND status IN ('done', 'skipped')
  AND task_detail IS NOT NULL
```

**After (14-day window):**
```sql
SELECT task_detail FROM public.staff_task_log
WHERE staff = '[staff]'
  AND status IN ('done', 'skipped')
  AND task_detail IS NOT NULL
  AND updated_at >= NOW() - INTERVAL '14 days'
```

Also update the function signature:
```python
def _get_done_candidate_ids(conn, days: int = 14) -> set:
```

## Technical Notes

- Column: `updated_at TIMESTAMPTZ` on `public.staff_task_log`
- 14 days chosen so recurring issues (e.g. meta title keeps going missing) reappear after 2 weeks if unresolved
- This pattern applies to all staff AI brief files that use `validated_brief_call`

## Expected Output

Tasks marked done/skipped more than 14 days ago will reappear in the brief if the underlying data issue is still present.
