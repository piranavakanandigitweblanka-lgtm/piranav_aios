# Prompt: AI Brief — Multi-Requirement Data Feed Pattern

**Registered:** 2026-09-16
**Status:** ACTIVE
**Category:** implementation
**Used in:** dm-dashboard · hetheesha_ai.py

---

## When to Use

Use this pattern when a staff AI brief needs to pull data from multiple dashboard requirements (not just the fix tracker) and include all of them in the daily task prioritisation.

---

## Prompt Pattern (give to Claude)

```
Extend [staff]_ai.py _gather_data() to also read Req 3/4/5 snapshot tables.

For each new requirement:
1. Read from sales_cache.[staff]_req[N]_snapshot WHERE id = 1 — payload column is JSON
2. Parse the rows array and compute summary counts
3. Add to the result dict as req3: {...}, req4: {...}, req5: {...}

Then extend _build_system_prompt() to include a section per requirement:
- Label clearly: "REQUIREMENT N (schedule: weekly/daily/etc)"
- Include key counts: missing, duplicate, urgent, etc.
- Include Action guidance: what Hetheesha should do if count > 0

Then extend _build_brief_data() to add summary tables for each requirement:
- Only add if count > 0 (don't show empty tables)
- Columns: Issue, Count, Action
- These appear in the task log DataTable component

Update the URGENCY ORDER in the system prompt to include the new requirements in priority order.
```

---

## Urgency Order for Hetheesha (2026-09-16 version)

1. Overdue product/collection fixes (Req 1 + 2) — past due date
2. Out of Stock pages with active GSC traffic (Req 4) — redirect needed
3. Due today fixes (Req 1 + 2)
4. Missing meta titles/descs (Req 3)
5. Pages with no internal links (Req 5)
6. Overall progress %

---

## Key Notes

- Snapshot tables: `sales_cache.hetheesha_req3_snapshot`, `req4_snapshot`, `req5_snapshot`
- All snapshots store JSON in `payload` column, single row `id = 1`
- Req 3 rows: `r[3]` = title status, `r[5]` = desc status (strings: "Missing", "Duplicate", "Unique")
- Req 4 rows: `r[6]` = stock status, `r[4]` = GSC clicks
- Req 5 rows: dict with `r["status"]` = "No Internal Links" / "Weak Internal Linking"
- Always wrap snapshot reads in try/except — snapshot may not exist yet on fresh deploy
