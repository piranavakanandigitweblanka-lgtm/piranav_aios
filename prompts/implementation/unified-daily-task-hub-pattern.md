# Prompt: Unified Daily Task Hub — Staff Dashboard Pattern

**Registered:** 2026-09-16 (retrospective)
**Status:** ACTIVE
**Category:** implementation
**Used in:** dm-dashboard · all 11 staff dashboards

---

## What This Is

Single-table daily task hub replacing the old separate brief cards + select step. Staff opens dashboard → sees tasks immediately → marks done inline. No separate step needed.

---

## Prompt Pattern

```
Build [Staff]DailyTaskPage.jsx using the unified task hub pattern.

Requirements:
- Single table: brief tasks + status controls in one row
- No separate brief cards — tasks load directly on open
- Status controls: in_progress / done / skipped — inline per row
- Metric column: [staff-specific metric — ROAS/Cost for Ads, Items/Progress for SEO]
- matchTable(): maps task title keywords to brief data table keys
  - Ads staff: campaign_summary, waste_products, oos_spending, waste_keywords
  - SEO staff: products, collections (fix tracker data)
- DataTable: shows supporting data per task when row expanded
- extractMetric(): reads metric from task actions text (overdue count, pending count, items)
- buildReason(): extracts why this task is priority

Update [Staff]Layout.jsx:
- Replace DailyBriefWidget with [Staff]DailyTaskPage
- Add "AI Tasks" nav tab
- Pass user prop for admin role detection
```

---

## Staff-Specific Metric Column

| Staff | Metric | Source |
|---|---|---|
| SEO (Hetheesha, Sukirtha) | Items/Progress | fix tracker pending count |
| Google Ads FR (Thivajini, Mahima) | ROAS/Cost (€) | campaign data |
| Google Ads UK (Theekshy, Sajeepan) | ROAS/Cost (£) | campaign data |
| Google Ads DE (Thasitha, Sukirtha DE) | ROAS/Cost (€) | campaign data |

---

## Commits

| Staff | Commit |
|---|---|
| Sukirtha | 8074a25 |
| Thasitha | c54eb8c |
| Theekshy | 6eacd4c |
| Hetheesha | 885e3a7 |
| Thivajini | 1c2eb49 |
