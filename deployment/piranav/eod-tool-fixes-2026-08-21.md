# Deployment — EOD Tool Fixes & Team Logs Date Range

**Date:** 2026-08-21
**Repo:** digitalmarketing69140951-sys/Staff-requirements
**Live URL:** dm-dashboard.vintageinterior.co.uk

---

## Commits (chronological)

| Commit | Description |
|---|---|
| `c7912f2` | Revert date range filter from admin.html |
| `7c3bccc` | Remove admin redirect from eod/index.html — admin gets member dropdown |
| `16bf241` | Fix eod.html directory fetch cache — add no-store + timestamp |
| `b072557` | eod-ads.html: replace hardcoded KNOWN_DATES with live GitHub API fetch (phase 1) |
| `2bc64d7` | eod-seo.html + eod-tec.html: same fix (phase 1) |
| `c1eb02a` | All three team logs: add Accept/User-Agent headers to API fetch (phase 2) |
| `d5ef1d3` | Final fix: route date fetching through server-side `/api/auth?action=eod-dates` using EOD_GITHUB_TOKEN |

## Deployments

All changes deployed via `npx vercel --prod` from `C:/Users/PC/Documents/piranav_aios/Staff-requirements`.

Final deployment ID: `dpl_AaBbLobnWQbm3FCLSJzP49Sojwbg`
Alias: `https://dm-dashboard.vintageinterior.co.uk`

## Files Changed

- `pages/eod/admin.html` — date range filter reverted
- `pages/eod/index.html` — admin redirect removed, member dropdown added
- `pages/eod.html` — cache-busting added to directory fetch
- `pages/eod-ads.html` — dynamic date fetch via server API
- `pages/eod-seo.html` — dynamic date fetch via server API
- `pages/eod-tec.html` — dynamic date fetch via server API
- `api/auth.js` — new `eod-dates` action added

## No Breaking Changes
- Regular staff EOD submit flow unchanged
- KNOWN_DATES retained as fallback in all team log pages
- Existing EOD admin page (admin.html) unchanged
