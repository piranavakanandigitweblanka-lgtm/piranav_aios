# Capability — Staff Monitor Dashboard

**Date:** 2026-08-18
**Applies to:** DM Dashboard (`digital-marketing-member-pages` Vercel project)

---

## New Capability: Staff Work Monitor Page

### What It Does

A manager-only page at `/pages/monitor.html` that shows all staff work in one place, with tab-per-staff navigation.

### Access Control

| Role | Access | Tabs Visible |
|---|---|---|
| Piranav | Admin | All 12 staff tabs |
| Kuberan | Admin | All 12 staff tabs |
| Muguntha | Admin | All 12 staff tabs |
| Any other staff | Own tab only | Their own tab |

### Tracker Staff Capabilities (Hetheesha, Sajeepan)

**Monitor View:**
- Progress bars showing fixed/started % of total
- Stat chips: fixed count, pending count, started count, sale count

**All Data View:**
- Full DB table displayed with sortable columns
- Hetheesha filters: Req1/Req2 switcher · Status (Fixed/Started/Pending) · Handle search
- Sajeepan filters: Level (1/2/3) · Status (Started/Not Started/Sale/No Sale) · Item ID search
- Export CSV button — downloads currently filtered rows

### Non-Tracker Staff Capabilities

- Info card showing name, role, Open Dashboard link
- No data table (no tracker DB tables exist for these staff)

### API Endpoints (inside members-api.js)

| Endpoint | Purpose |
|---|---|
| `?member=monitor&type=summary` | Fast count summaries for all tracker tables |
| `?member=monitor&type=hetheesha-all-r1` | Full Req1 fix tracker rows |
| `?member=monitor&type=hetheesha-all-r2` | Full Req2 collection fix tracker rows |
| `?member=monitor&type=sajeepan-all` | Full Req4 feed optimisation tracker rows |

### Navigation Entry Points

- Piranav dashboard sidebar → "Staff Monitor" link
- Muguntha dashboard sidebar → "Staff Monitor" link
- Direct URL: `/pages/monitor.html`

### Adding Future Tracker Staff

To add a new staff member with a tracker to the monitor page:
1. Add their DB table query to `handleMonitorSummary()` in `members-api.js`
2. Add a new `handleMonitor<Name>All()` function for the full data endpoint
3. Add the route in the `member === 'monitor'` block
4. Add the staff entry to `TRACKER_STAFF` array in `monitor.html`
5. Add render functions `renderMonitor<Name>View()` and `render<Name>AllData()` in the page JS
