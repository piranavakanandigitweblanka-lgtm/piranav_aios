# Capability — DM Dashboard Date Filter UI Pattern

## Date First Identified
2026-09-30

## Last Updated
2026-09-30

## Status
ACTIVE — Deployed (commit `083020b` on websitetecteam-arch/dm-dashboard piranv-work)

## Purpose
A reusable React date filter component pattern for DM Dashboard pages that need both quick-select year pills and a custom date range input.

## Business Problem Solved
Multiple DM Dashboard reports need date filtering. Without a standard pattern, each developer builds an ad-hoc date picker with inconsistent UX. This pattern delivers: year pills for instant filtering, a custom month range option, a loading indicator while data re-fetches, and an active date range label — matching the UX standard across the dashboard.

## When To Use
- A DM Dashboard backend report accepts `from_date` / `to_date` parameters
- Users need to filter by year (All Time / 2025 / 2026) or a custom month range
- A loading state should be visible while data re-fetches

## When NOT To Use
- Single-date filters (use a single `<input type="month">` directly)
- Reports where the date is fixed and users cannot change it

## Required Inputs
- Backend endpoint that accepts `from_date` and `to_date` query params (ISO date strings)
- React functional component structure

## Source Task / Requirement
WLG SKU Sales Date Filter — Germany Report 7 (GermanySalesDecline.jsx)
dm-dashboard, 2026-09-30

## Execution Steps

### Backend: Add date params to the endpoint
```python
@router.get("/report-wlg-sales")
async def report_wlg_sales(from_date: str = None, to_date: str = None):
    query_filters = ""
    if from_date:
        query_filters += f" AND date >= '{from_date}'"
    if to_date:
        query_filters += f" AND date <= '{to_date}'"
    # ... rest of query
```

### Frontend: Year pill + custom range state
```jsx
const YEAR_PILLS = [
  { label: 'All Time', from: null, to: null },
  { label: '2025', from: '2025-01-01', to: '2025-12-31' },
  { label: '2026', from: '2026-01-01', to: null },  // null = today
];

const [activePill, setActivePill] = useState('All Time');
const [customFrom, setCustomFrom] = useState('');
const [customTo, setCustomTo] = useState('');
const [loading, setLoading] = useState(false);
```

### Frontend: Year pill buttons
```jsx
{YEAR_PILLS.map(pill => (
  <button
    key={pill.label}
    className={activePill === pill.label ? 'active' : ''}
    onClick={() => { setActivePill(pill.label); fetchData(pill.from, pill.to); }}
  >
    {pill.label}
  </button>
))}
```

### Frontend: Custom month range inputs
```jsx
<input type="month" value={customFrom} onChange={e => setCustomFrom(e.target.value)} />
<input type="month" value={customTo} onChange={e => setCustomTo(e.target.value)} />
<button onClick={() => {
  setActivePill('Custom');
  fetchData(customFrom ? customFrom + '-01' : null, customTo ? customTo + '-31' : null);
}}>Apply</button>
```

### Frontend: Active range label
```jsx
{activePill !== 'All Time' && (
  <span className="active-range-label">
    Showing: {activePill === 'Custom' ? `${customFrom} – ${customTo}` : activePill}
  </span>
)}
```

### Frontend: Loading indicator
```jsx
{loading && <div className="loading-spinner">Loading...</div>}
```

## Evidence Required
- Browser screenshot showing year pills and date range inputs
- Confirmation that data re-fetches correctly on pill click and custom range apply

## Evidence Path
`evidence/germany/wlg-date-filter-2026-09-30.md`
`validation/piranav/wlg-date-filter-validation-2026-09-30.md`
`prompts/implementation/germany-report7-wlg-date-filter.md`

## Pass / Fail Rule
PASS: Year pill click triggers data refresh with correct date bounds. Custom month range apply triggers data refresh. Loading spinner visible during fetch. Active label shows selected range.
FAIL: Date bounds not passed to backend, OR data does not change on filter change.

## Owner / Reviewer
Owner: Piranav
Reviewer: GPT Coordinator

## Known Limits
- Custom month inputs use `type="month"` — Safari has known inconsistent rendering; test across browsers if Safari is a requirement
- `to_date` with `-31` is a rough end-of-month approximation — use a proper end-of-month calculation if precision is required (e.g. day 28/29/30 edge cases)
- Year pills are hardcoded — add new years manually each January

## Reuse Path
Copy the state variables, pill configuration, and fetch logic into any DM Dashboard React component with a date-filterable endpoint. Adjust `YEAR_PILLS` to match the data availability range for that report.

## Related Capabilities
None directly related.

## Change History

| Date | Change | Evidence |
|---|---|---|
| 2026-09-30 | Initial capability captured from WLG date filter build | `evidence/germany/wlg-date-filter-2026-09-30.md` |
