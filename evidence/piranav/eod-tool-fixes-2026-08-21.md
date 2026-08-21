# Evidence — EOD Tool Fixes & Team Logs Date Range

**Date:** 2026-08-21
**Task:** Fix EOD admin redirect + Team Log date range stuck at 12/08/2026

---

## Discovery: Admin Redirect in eod/index.html

File: `Staff-requirements/pages/eod/index.html` line 483–488
```js
if (data.user.role === 'admin') {
  // Admins manage EOD through admin.html, not this staff submission
  // form — no EOD member name is tied to an admin login.
  window.location.replace('admin.html');
  return;
}
```
- Admin users (Piranav, Kuberan, Muguntha) were bounced to admin.html when opening EOD Tool
- Root cause: intentional guard added previously, now unwanted

## Discovery: EOD Tool Sidebar Link per Member

Scanned all member pages. Results:
| Member pages | EOD Tool opens | Method |
|---|---|---|
| Jefri, Hetheesha, Jakshan, Sajeepan, Sonya, Theekshy, Thivagini, Sukirtha, Thasitha, Dilaksi, Kamsi, Mahima | `eod/index.html` | Full page nav (data-fulltool="1") |
| Kuberan, Piranav | `eod/index.html?embed=1` | iframe embed |
| Muguntha | `eod/index.html` (embed) + `eod/admin.html` + `eod.html` | multiple links |

## Discovery: Team Log Pages Use Hardcoded KNOWN_DATES

Files: `pages/eod-ads.html`, `pages/eod-seo.html`, `pages/eod-tec.html`

All three had `const KNOWN_DATES = { ... }` hardcoded at top, last verified on 2026-08-13.
- Sonya's list stopped at `2026-08-12`
- Sajeepan stopped at `2026-08-11`
- All ADS/SEO/TEC members missing all dates after 12/08/2026

`loadAll()` in each file used: `MEMBERS.forEach(m => KNOWN_DATES[m.name].forEach(...))` — never fetched live dates.

## Discovery: eod.html Date Range Showing Stale Data

`selectMember()` in `pages/eod.html` fetched the directory listing without `cache: 'no-store'`:
```js
const res = await fetch(
  `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/eods/${m.name}`,
  { headers: ghHeaders() }   // no cache busting
);
```
Browser cached the response → showed 12 Aug instead of actual 14 Aug for Sonya.

## Discovery: GitHub API Rate Limit for Unauthenticated Calls

First fix attempt added `fetchMemberDates()` calling `api.github.com` directly from browser.
- No auth header → 60 req/hour unauthenticated rate limit
- On rate limit: `r.ok` is false → `throw new Error` → `catch` returns `KNOWN_DATES[memberName] || []`
- Silent fallback to old hardcoded dates — no visible error to user

## Discovery: Server-side GitHub Token Available

`api/auth.js` already has `EOD_GITHUB_TOKEN` env var used for EOD submit/list.
- `eodGithubHeaders()` function returns authenticated headers
- `handleEodList()` already calls GitHub API with this token for member's own files
- Can add a new `eod-dates` action for team log date fetching

## Member Last EOD Dates (verified from GitHub 2026-08-21)

| Member | Last EOD | Days Ago |
|---|---|---|
| Theekshy | 2026-08-28 | future-dated |
| Dilaksi, Hetheesha, Kamsi, Mahima, Sajeepan, Sukirtha, Thasitha, Thivagini | 2026-08-19 | 2 days |
| Jefri, Sonya | 2026-08-14 | 7 days |
| Jakshan | 2026-08-07 | 14 days |
| Kuberan | 2026-07-22 | ~1 month |
| Piranav | 2026-07-14 | ~5 weeks |
| Ripson | 2026-07-02 | ~7 weeks |
| Thanishtika | 2026-07-03 | ~7 weeks |
| Thishoban | 2026-04-24 | ~4 months |
