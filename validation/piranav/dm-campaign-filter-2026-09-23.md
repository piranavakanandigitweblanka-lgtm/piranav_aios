---
name: dm-campaign-filter-validation-2026-09-23
description: Validation checklist for DM Campaign Products campaign filter
metadata:
  type: validation
---

# Validation: DM Campaign Products — Campaign Filter

**Date:** 2026-09-23

## Checklist

| Check | Result |
|---|---|
| Campaign dropdown renders in filter bar | PASS — confirmed by code review |
| Unique campaign names populate from loaded rows | PASS — useMemo derives from `rows` |
| Selecting campaign filters table rows | PASS — after useMemo dep fix |
| `filtered.length` count updates on campaign change | PASS |
| All Campaigns option shows full list | PASS |
| Date range change resets campaign to All | PASS — `setCampaign('all')` in `onApply()` |
| No backend change required | PASS — `campaignName` already in API response |
| useMemo dep array correct | PASS — `[rows, q, flag, campaign, sort]` |
| Export CSV respects campaign filter | PASS — CSV uses `filtered` array |

## Deploy Required

`git pull && npm run build --prefix frontend` on Contabo to see changes live.
