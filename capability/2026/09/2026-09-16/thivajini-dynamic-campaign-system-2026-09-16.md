# Capability — Thivajini Dynamic Campaign System

## Date First Identified
2026-09-16

## Last Updated
2026-09-16

## Status
ACTIVE — Deployed (commits `7951c09`, `f687984` on websitetecteam-arch/dm-dashboard piranv-work)

## Purpose
Replace hardcoded campaign ID lists in staff Google Ads dashboards with a dynamic DB query that automatically includes newly started campaigns and excludes paused/removed ones.

## Business Problem Solved
Staff dashboards (e.g. Thivajini's ConversionTracking) had campaign lists hardcoded as constants (e.g. `TV_CAMPAIGNS = [23405519670, ...]`). When a new campaign is created, it is invisible to the dashboard until someone manually edits the code. When a campaign is paused, it still appears. A dynamic query eliminates all manual maintenance: new ENABLED campaigns appear automatically; PAUSED/REMOVED ones disappear.

## When To Use
- A DM Dashboard module displays data for a specific staff member's Google Ads campaigns
- The campaign list is currently hardcoded in a Python constant
- Campaigns are added or paused periodically

## When NOT To Use
- If ALL campaigns across the account should be shown (no staff-scoping needed) — no filter required
- If the staff member's campaign set is very specifically curated and automatic inclusion of new campaigns would be undesired

## Required Inputs
- Staff member name / Google Ads account identifier
- `google_ads.campaigns` table in the business DB with `status` and `campaign_name` columns
- Naming convention for the staff member's campaigns (used in WHERE clause)

## Source Task / Requirement
Thivajini Req1 — Dynamic Campaign System (replace hardcoded TV_CAMPAIGNS)
dm-dashboard, 2026-09-16

## Execution Steps

### Step 1 — Identify current hardcoded list
Find the Python file (`thivajini.py` or equivalent) and locate the constant:
```python
TV_CAMPAIGNS = [23405519670, ...]
```

### Step 2 — Replace with dynamic query
```python
def get_active_campaign_ids(conn, staff_prefix: str) -> list[int]:
    """Return campaign IDs for a staff member where status = ENABLED."""
    rows = conn.execute("""
        SELECT id FROM google_ads.campaigns
        WHERE status = 'ENABLED'
          AND campaign_name ILIKE %s
    """, (f'%{staff_prefix}%',)).fetchall()
    return [r["id"] for r in rows]
```

Usage in the endpoint:
```python
campaign_ids = get_active_campaign_ids(conn, staff_prefix="Thivajini")
```

### Step 3 — Verify against known campaigns
Before deploying, run the query in PostgreSQL directly. Compare the result against the known active campaigns to confirm the name filter is correct. Document any campaigns that match the filter but should be excluded (and add NOT ILIKE exclusions).

### Step 4 — Handle snapshot invalidation
If the backend caches a campaign snapshot, clear it after switching to dynamic queries so the first fetch uses the new logic.

## Evidence Required
- DB query output confirming correct campaign IDs are returned
- Snapshot cleared and live data confirmed working after deploy

## Evidence Path
`prompts/Thivajini/req1-dynamic-campaign-system-prompt.md`
`closure/README.md — 2026-09-16 Thivajini Req1 Dynamic Campaign System`

## Pass / Fail Rule
PASS: Dynamic query returns the same campaigns as the previous hardcoded list PLUS any new ENABLED ones. New campaign (started 2026-09-02) visible in dashboard without code changes.
FAIL: Query returns wrong campaigns (name filter too broad or too narrow), OR new campaigns are still invisible.

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator

## Known Limits
- Campaign name-based filtering relies on a consistent naming convention — if staff members use inconsistent names, the filter may miss campaigns
- `ENABLED` status only — if a paused campaign should remain visible for historical comparison, adjust the WHERE clause
- The dynamic query runs at request time — for high-frequency endpoints, consider caching the result (e.g. 1-hour TTL)

## Reuse Path
Apply to any DM Dashboard Python file that has a hardcoded campaign ID list. Replace the constant with `get_active_campaign_ids(conn, staff_prefix="[StaffName]")`. Adjust the `staff_prefix` to match the naming convention used in Google Ads campaign names for that staff member.

## Related Capabilities
- `ai-brief-pipeline-pattern-2026-09-15.md` — general AI brief pipeline that staff modules fit into

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-09-16 | Initial capability captured from Thivajini Req1 dynamic campaign build | `closure/README.md — 2026-09-16 Thivajini Req1` |
