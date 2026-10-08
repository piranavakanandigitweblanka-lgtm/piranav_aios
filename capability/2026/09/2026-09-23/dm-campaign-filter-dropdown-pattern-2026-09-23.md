# Capability — DM Dashboard Campaign Filter Dropdown Pattern

## Date First Identified
2026-09-23

## Last Updated
2026-09-23

## Status
ACTIVE — Deployed (see `validation/piranav/dm-campaign-filter-2026-09-23.md`)

## Purpose
A reusable React campaign filter dropdown pattern for DM Dashboard pages that display data per campaign. Allows users to filter a data table to one specific campaign, or view all campaigns combined.

## Business Problem Solved
DM Dashboard pages showing Google Ads campaign-level data previously displayed all campaigns without filtering. When a staff member manages many campaigns, the combined view is hard to act on. A campaign filter dropdown — with URL persistence — lets users bookmark a view for a specific campaign and return to it later.

## When To Use
- A DM Dashboard page displays campaign-level data (ROAS, spend, conversions, etc.)
- Users need to filter by a specific campaign
- URL persistence would allow bookmarking of a filtered view

## When NOT To Use
- Pages with a single campaign (no filter needed)
- If campaign data is already scoped to one campaign by the backend (no need to filter further)

## Required Inputs
- Backend endpoint that returns campaign list for the staff member
- Campaign objects with at minimum `campaign_id` (or `id`) and `campaign_name` fields
- React component with data table or card list to filter

## Source Task / Requirement
Sajeepan Campaign Filter Dropdown
dm-dashboard, 2026-09-23
Prompt: `prompts/piranav/dm-campaign-filter-dropdown-pattern.md`

## Execution Steps

### Step 1 — Read available campaigns from API response
```jsx
const campaigns = apiData?.campaigns ?? [];
```

### Step 2 — Add filter state with URL persistence
```jsx
const [searchParams, setSearchParams] = useSearchParams();
const [selectedCampaign, setSelectedCampaign] = useState(
  searchParams.get('campaign') ?? 'all'
);

const handleCampaignChange = (value) => {
  setSelectedCampaign(value);
  setSearchParams(value === 'all' ? {} : { campaign: value });
};
```

### Step 3 — Render the dropdown
```jsx
<select value={selectedCampaign} onChange={e => handleCampaignChange(e.target.value)}>
  <option value="all">All Campaigns</option>
  {campaigns.map(c => (
    <option key={c.campaign_id} value={String(c.campaign_id)}>
      {c.campaign_name}
    </option>
  ))}
</select>
```

### Step 4 — Filter the displayed data
```jsx
const filteredData = selectedCampaign === 'all'
  ? allRows
  : allRows.filter(row => String(row.campaign_id) === selectedCampaign);
```

### Step 5 — Restore from URL on page load
The `useState` initialisation with `searchParams.get('campaign')` handles restoration automatically.

## Evidence Required
- Dropdown renders campaign list correctly
- Selecting a campaign filters the data table
- URL updates with `?campaign=[id]` when a campaign is selected
- Refreshing the page restores the same campaign filter

## Evidence Path
`validation/piranav/dm-campaign-filter-2026-09-23.md`
`prompts/piranav/dm-campaign-filter-dropdown-pattern.md`

## Pass / Fail Rule
PASS: Dropdown shows all campaigns. Filter reduces table to selected campaign rows. URL updates. Page refresh restores filter state.
FAIL: Dropdown empty, OR filter does not reduce rows, OR URL does not update.

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator

## Known Limits
- Requires React Router v6 (`useSearchParams`) — not compatible with v5 directly
- Campaign IDs are compared as strings — ensure consistent type handling between backend (integer) and frontend (string)
- If the campaign list changes during a session, the dropdown does not auto-refresh — user must reload the page

## Reuse Path
Copy the `selectedCampaign` state + `handleCampaignChange` + dropdown JSX into any DM Dashboard component with campaign-level data. Adjust the field names (`campaign_id`, `campaign_name`) to match the API response shape.

## Related Capabilities
- `dm-dashboard-date-filter-ui-pattern-2026-09-30.md` — complementary filter pattern for date ranges

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-09-23 | Initial capability captured from Sajeepan campaign filter build | `validation/piranav/dm-campaign-filter-2026-09-23.md` |
