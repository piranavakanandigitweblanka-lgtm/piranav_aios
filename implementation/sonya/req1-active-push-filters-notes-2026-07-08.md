# Implementation Notes — Sonya Req 1 Active & Push Campaign Filters

## Title
Sonya Req 1 — Active Campaign and Push Campaign filters

## Date
2026-07-08

## Decision
Add two client-side filters: Active Campaigns and Push Campaigns.
Both filters are derived from existing RAW data — no additional PostgreSQL queries needed.

## Rules Chosen

### Active Campaign
- **Field inspected:** status, campaign_status, serving_status, campaign_state, enabled, is_active
- **Found:** NONE — ppc_etl_performance_data is a performance metrics table only
- **Rule applied:** `l30.cost > 0` — campaign has spend in last 30-day window
- **Campaigns matched:** 8/9 (D Gen / 23793722836 excluded — £0 L30 cost)

### Push Campaign
- **Field inspected:** push, push_campaign, campaign_type, campaign_label, label, tag, objective, campaign_group
- **Found:** NONE
- **Rule applied:** `campaign_name.toLowerCase().includes('push')` — name-based fallback
- **Campaigns matched:** 0/9 — no current Sonya campaign contains 'push' in name
- **Note:** Returns empty set by design. Will auto-populate when push campaigns are added to the group.

## Code Changes

### New state variable
```javascript
let campaignType = 'all';
```

### New functions
```javascript
function setCampaignType(t) {
  campaignType = t;
  ['ctAll','ctActive','ctPush'].forEach(id => document.getElementById(id).classList.remove('on'));
  document.getElementById({ all: 'ctAll', active: 'ctActive', push: 'ctPush' }[t]).classList.add('on');
  applyFilters();
}
function matchesCampaignType(c) {
  if (campaignType === 'active') return c.l30.cost > 0;
  if (campaignType === 'push')   return c.name.toLowerCase().includes('push');
  return true;
}
```

### applyFilters() change
Added one line to the filter chain:
```javascript
if (!matchesCampaignType(c)) return false;
```
All three filters (search, segment, campaignType) are ANDed — they combine correctly.

### Export CSV
No change required — `exportCSV()` already iterates over `activeData` which is set by `applyFilters()`. Exporting respects all active filters automatically.

### UI — Controls bar
Added button group after Sort buttons:
```html
<div style="display:flex;gap:4px;align-items:center;">
  <span class="sl">Campaign:</span>
  <button class="fbtn on" id="ctAll"    onclick="setCampaignType('all')">All</button>
  <button class="fbtn"    id="ctActive" onclick="setCampaignType('active')">▶ Active</button>
  <button class="fbtn"    id="ctPush"   onclick="setCampaignType('push')">↑ Push</button>
</div>
```

## Files Changed
- `Staff-requirements/pages/sonya.html`
