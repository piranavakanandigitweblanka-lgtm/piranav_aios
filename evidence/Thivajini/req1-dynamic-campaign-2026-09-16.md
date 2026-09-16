# Evidence — Thivajini Req1 Dynamic Campaign System — 2026-09-16

**Session date:** 2026-09-16
**Repo:** websitetecteam-arch/dm-dashboard · branch: piranv-work
**Status:** PASS

## What Was Built

Replaced hardcoded `TV_CAMPAIGNS` list in `thivajini.py` with a live DB query:
```sql
SELECT campaign_id, campaign_name FROM google_ads.campaigns
WHERE status = 'ENABLED' AND sub_source = 'France'
```

- Best Sellers (23405519670) — last seen 2026-05-18, status PAUSED → correctly absent
- New Arrivals (24209622904) — ENABLED since 2026-09-02 → correctly appears
- Future campaigns auto-appear/disappear based on ENABLED status — no code change needed
- Snapshot cleared — live data confirmed working on reload

## Files Changed

- `dm-dashboard/backend/app/thivajini.py`
- `dm-dashboard/frontend/src/thivajini/pages/ConversionTracking.jsx`

## Commits

- 7951c09 — backend dynamic query
- f687984 — frontend verification

Both on: `websitetecteam-arch/dm-dashboard` · `piranv-work`
