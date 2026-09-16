# Prompt: Thivajini Req1 — Dynamic Campaign System

**Registered:** 2026-09-16 (retrospective)
**Status:** ACTIVE
**Category:** implementation
**Used in:** dm-dashboard · thivajini backend + frontend

---

## What This Solves

Hardcoded campaign IDs in TV_CAMPAIGNS list meant new campaigns required a code change to appear. Old campaigns stayed visible even after pausing.

---

## Prompt Pattern

```
Replace hardcoded TV_CAMPAIGNS list in thivajini.py with a dynamic DB query.

Query: SELECT campaign_id, campaign_name FROM google_ads.campaigns
WHERE status = 'ENABLED' AND sub_source = 'France'

- Remove TV_CAMPAIGNS constant
- Replace all references with live DB query result
- Clear existing snapshot so fresh data loads on next request
- Frontend ConversionTracking.jsx: verify campaign tabs render from live data

Verify: campaign_id 23405519670 (Best Sellers) should be PAUSED and absent
        campaign_id 24209622904 (New Arrivals, started 2026-09-02) should appear
```

---

## Key Notes

- Sub-source filter: `France` for ledsone.fr Thivajini campaigns
- Snapshot must be cleared after backend change or stale data shows
- Future campaigns auto-appear when status = ENABLED — no code change needed
- Commits: 7951c09, f687984 on websitetecteam-arch/dm-dashboard piranv-work
