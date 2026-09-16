# Prompt: Fix Tracker UX — Action List + Always-Visible Tracker Pattern

**Registered:** 2026-09-16
**Status:** ACTIVE
**Category:** implementation
**Used in:** dm-dashboard · hetheesha dashboard · Req 1–5

---

## When to Use

Use this pattern when a dashboard requirement has:
- A list of issues the staff member needs to fix
- A fix tracker (DB-backed) OR just an audit list
- The need for priority-sorted "start here" guidance at the top

---

## The 3 UX Problems This Solves

1. **No clear start-here list** — staff opens dashboard, sees 50+ rows, doesn't know what to fix first
2. **Fix Tracker hidden** — tracker behind a toggle button, too many steps to mark something done
3. **Stale badges** — clicking Done doesn't visually confirm the fix until next page reload

---

## Prompt Pattern (give to Claude)

```
Apply these 3 UX fixes to [ComponentName].jsx:

1. ACTION LIST at top — amber/yellow banner showing all unfixed issues sorted by:
   - Priority 1: Missing fields (red) — most urgent
   - Priority 2: Duplicate/Too Long/Too Short (amber)
   - Within each priority: sorted by [GSC clicks / revenue / index] desc
   - Each row: URL, field, issue type, "Fix on Shopify →" link to admin, one-click "Done" button
   - When all fixed: show green "✅ All issues fixed!"

2. FIX TRACKER always visible — remove toggle button, show two columns side by side:
   - LEFT: Still Pending (scrollable, filter by field type, one-click Done per row)
   - RIGHT: Fixed by You (group by URL — all fixed fields for one URL in one row, one View Impact per URL)
   - Progress bar at top showing X/Y fixed (%)

3. OPTIMISTIC BADGE OVERRIDE — when Done clicked:
   - Immediately update state via setFixEntries
   - Main table badges switch to "Fixed ✓" green without waiting for page reload
   - markDone(handle, fieldKey) pattern: POST to fix-save API → on success update local state

Fix key separator: [:: for Req2, | for Req1]
API endpoints: [/fix-save, /fix-load] or [/r2-fix-save, /r2-fix-load]
Fields tracked: [list fields]
Admin URL base: [Shopify admin URL]
```

---

## Key Implementation Notes

- `actionItems` = useMemo — filters out already-fixed items via `isFixed()` check
- `isFixed(handle, fieldKey)` checks `fixEntries[key]?.fix_date` (optimistic state)
- `trkFixedGrouped` = useMemo — groups Fixed by You by handle, one entry per URL
- `markingDone` state = per-key loading indicator during API call
- `expandedImpact` state = tracks which URL's impact panel is open

---

## Inline Impact Pattern (InlineImpact / InlineImpactR2)

- Expands inline below Fixed row (no drawer)
- If no fix_date: shows date picker + "Load Results" button
- If fix_date exists: auto-loads GSC Before/After
- Metrics: Impressions, Clicks, CTR, Avg Position (+ Sales for Req1)
- 7d / 14d / 30d window toggle
- Color arrows: ↑ green (improvement) / ↓ red (regression)
