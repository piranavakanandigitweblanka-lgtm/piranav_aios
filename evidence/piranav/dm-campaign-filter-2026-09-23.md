---
name: dm-campaign-filter-2026-09-23
description: Evidence for campaign filter dropdown added to DM Campaign Products view
metadata:
  type: evidence
---

# Evidence: DM Campaign Products — Campaign Filter Added

**Date:** 2026-09-23
**Staff:** piranav (admin page)

## What Was Built

Added a campaign-wise filter dropdown to the Products view in `DmCampaign.jsx`.

## Commits

| Commit | Description |
|---|---|
| Initial add | Added campaign state, campaignNames useMemo, dropdown UI, filter logic |
| Bug fix | Added `campaign` to filtered useMemo dependency array (was missing — filter not re-computing) |

Both on `websitetecteam-arch/dm-dashboard` branch `piranv-work`.

## Files Changed

- `dm-dashboard/frontend/src/admin/pages/DmCampaign.jsx`
  - Added `campaign` state
  - Added `campaignNames` useMemo (unique sorted campaign names from rows)
  - Added campaign filter in `filtered` useMemo
  - Added `campaign` to useMemo deps array
  - Added Campaign dropdown in filter bar (before Flag dropdown)
  - Added `setCampaign('all')` reset in `onApply()`

## Validation

- Filter dropdown appears in Products view toolbar
- Selecting a campaign filters table rows and updates `{filtered.length} products` count
- "All Campaigns" option restores full list
- Date range change resets campaign to All
- No backend change needed — `campaignName` was already in API response

## Bug Found and Fixed

`campaign` was missing from `useMemo([rows, q, flag, sort])` deps — filter logic ran but React never re-ran the computation on campaign change. Fixed in second commit.
