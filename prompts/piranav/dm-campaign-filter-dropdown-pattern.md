---
name: dm-campaign-filter-dropdown-pattern
description: Add a campaign-wise filter dropdown to a React products/data view — extract unique values from loaded rows, add state, wire to useMemo with correct deps
metadata:
  type: implementation
---

# Prompt: Add Campaign Filter Dropdown to React Data View

## When to Use
A data table/view loads rows that each have a `campaignName` (or similar grouping field), but no filter exists to narrow by that group. User wants to select a specific campaign and see only its rows.

## What to Do

1. **Add state**: `const [campaign, setCampaign] = useState('all')`

2. **Derive unique values** from loaded rows (useMemo, depends on rows):
   ```js
   const campaignNames = useMemo(() => {
     return [...new Set(rows.map((r) => r.campaignName).filter(Boolean))].sort()
   }, [rows])
   ```

3. **Add filter logic** to the existing filtered useMemo:
   ```js
   if (campaign !== 'all') out = out.filter((r) => r.campaignName === campaign)
   ```

4. **CRITICAL — add `campaign` to the useMemo dependency array.** Missing this = filter logic runs but React never re-computes. Common bug.

5. **Add dropdown** to filter bar UI:
   ```jsx
   <label>Campaign{' '}
     <select value={campaign} onChange={(e) => { setCampaign(e.target.value); setPage(1) }}>
       <option value="all">All Campaigns</option>
       {campaignNames.map((name) => <option key={name} value={name}>{name}</option>)}
     </select>
   </label>
   ```

6. **Reset on date range change**: call `setCampaign('all')` inside `onApply()`.

## Applied Example
- File: `dm-dashboard/frontend/src/admin/pages/DmCampaign.jsx` — `ProductsView`
- Field: `r.campaignName` (returned by `/api/admin/dm-campaign/products`)
- Commits: initial add + dep fix on `websitetecteam-arch/dm-dashboard` piranv-work
