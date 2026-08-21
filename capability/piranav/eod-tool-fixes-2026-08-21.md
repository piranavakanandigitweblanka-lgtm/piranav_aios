# Capability — EOD Tool Fixes & Team Logs Date Range

**Date:** 2026-08-21
**Extracted from:** EOD tool redirect fix + Team Logs date range session

---

## Patterns & Reusable Knowledge

### 1. GitHub API Rate Limiting from Browser
Unauthenticated calls to `api.github.com` from the browser are limited to **60 requests/hour per IP**.
- Silent failure: `r.ok === false` → caught by try/catch → falls back silently to old data
- Fix: always proxy GitHub API calls through a Vercel serverless function that uses a server-side token
- Pattern: `/api/auth?action=eod-dates&member=X` → `eodGithubHeaders()` with `EOD_GITHUB_TOKEN`

### 2. Hardcoded Date Lists Are a Maintenance Trap
`KNOWN_DATES` pattern in team log pages — hardcoded file lists that require manual updates.
- Every new submission is invisible until a developer updates the code
- Replace with: dynamic fetch from GitHub API via server endpoint on page load
- Fallback to hardcoded list only if API fails (network outage, token expired)

### 3. Admin Role Checks in Staff Submit Forms
When an admin navigates to a staff submit page, they may get redirected or blocked.
- Pattern: detect `data.user.role === 'admin'` after session fetch
- For admins: show full member dropdown (`removeAttribute('disabled')`) so they can submit on behalf of any member
- `SESSION_MEMBER` should be set from dropdown `change` event, not from `data.user.eod_member`

### 4. Cache Busting for GitHub API Directory Listings
Browser caches GitHub API responses aggressively, showing stale file lists.
- Fix: append `?_=${Date.now()}` to the URL AND set `cache: 'no-store'` in fetch options
- Both needed: URL param busts CDN/proxy cache, `cache: 'no-store'` busts browser cache

### 5. Git Revert Pattern
Standard revert + push flow for this repo (remote often ahead due to concurrent edits):
```bash
git revert <commit> --no-edit
git stash
git pull --rebase origin main
git stash pop
git push origin main
```

### 6. EOD System Architecture (Staff-requirements)
- `eod/index.html` — staff submit their own EOD (GitHub write via server token)
- `eod/admin.html` — admin view: all member reports + add on behalf of member
- `eod.html` — read-only viewer per member (GitHub API, dynamic)
- `eod-ads.html`, `eod-seo.html`, `eod-tec.html` — team log views (all members, parsed tasks)
- GitHub repo: `digitalmarketing69140951-sys/eod-reports`, path: `eods/{MemberName}/{YYYY-MM-DD}.md`
- Server token: `EOD_GITHUB_TOKEN` env var in Vercel, used in `api/auth.js`
