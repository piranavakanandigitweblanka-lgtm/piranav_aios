# Implementation — EOD Tool Fixes & Team Logs Date Range

**Date:** 2026-08-21
**Task:** Fix EOD admin redirect + Team Log date range stuck at 12/08/2026

---

## 1. Revert Date Range Filter (admin.html)

**Commit:** `c7912f2`
```bash
git revert 1c3d4a2 --no-edit
```
Reverted `feat(eod-admin): add date range filter to EOD viewer overlay`.
Net effect: `pages/eod/admin.html` restored to pre-filter state — viewer loads all reports with no date restriction.

---

## 2. Remove Admin Redirect from eod/index.html

**File:** `pages/eod/index.html`
**Commit:** `7c3bccc`

Removed the block:
```js
if (data.user.role === 'admin') {
  window.location.replace('admin.html');
  return;
}
```

Added admin-specific member dropdown instead:
```js
if (!data.user.eod_member) {
  if (data.user.role === 'admin') {
    const ALL_MEMBERS = ["Kuberan","Piranav","Mahima","Sonya","Kamsi","Hetheesha",
      "Dilaksi","Sukirtha","Thasitha","Theekshy","Thivagini","Jefri","Sajeepan","Jakshan"];
    [$("memberSelect"), $("leaveMember")].forEach(sel => {
      sel.innerHTML = `<option value="">— Select member —</option>` +
        ALL_MEMBERS.map(n => `<option value="${n}">${n}</option>`).join('');
      sel.removeAttribute('disabled');
    });
    $("sidebarMember").textContent = 'Admin';
    [$("memberSelect"), $("leaveMember")].forEach(sel => {
      sel.addEventListener('change', () => { SESSION_MEMBER = sel.value || null; });
    });
  } else {
    showAlert('error', 'Your account is not linked to an EOD member name. Contact an admin.');
  }
  return;
}
```

---

## 3. Fix eod.html Stale Date Cache

**File:** `pages/eod.html`
**Commit:** `16bf241`

Added cache-busting to the directory listing fetch:
```js
const res = await fetch(
  `${GH_API}/repos/${GH_OWNER}/${GH_REPO}/contents/eods/${encodeURIComponent(m.name)}?_=${Date.now()}`,
  { headers: ghHeaders(), cache: 'no-store' }
);
```

---

## 4. Team Logs: Replace Hardcoded KNOWN_DATES with Live API

**Files:** `pages/eod-ads.html`, `pages/eod-seo.html`, `pages/eod-tec.html`

**Phase 1 (failed):** Added `fetchMemberDates()` calling `api.github.com` directly — silently failed due to rate limits, fell back to KNOWN_DATES.

**Phase 2 (failed):** Added GitHub API headers (`Accept`, `User-Agent`) — still failed, rate limit still hit without auth token.

**Phase 3 (final fix):** Added server-side proxy endpoint in `api/auth.js`:

```js
// api/auth.js — new action: eod-dates
async function handleEodDates(req, res) {
  const member = (req.query && req.query.member) || '';
  if (!member) return res.status(400).json({ success: false, error: 'member param required' });
  const dirUrl = `https://api.github.com/repos/${EOD_GITHUB_OWNER}/${EOD_GITHUB_REPO}/contents/eods/${encodeURIComponent(member)}`;
  const r = await fetch(dirUrl, { headers: eodGithubHeaders() });
  if (r.status === 404) return res.status(200).json({ success: true, member, dates: [] });
  if (!r.ok) { ... return 502 }
  const list = await r.json();
  const dates = (Array.isArray(list) ? list : [])
    .filter(f => f.type === 'file' && f.name.endsWith('.md'))
    .map(f => f.name.replace(/\.md$/, ''))
    .sort();
  return res.status(200).json({ success: true, member, dates });
}
```

All three team log pages updated to call this endpoint:
```js
async function fetchMemberDates(memberName) {
  try {
    const r = await fetch(`/api/auth?action=eod-dates&member=${encodeURIComponent(memberName)}`,
      { cache: 'no-store', credentials: 'same-origin' });
    if (!r.ok) throw new Error('API error');
    const j = await r.json();
    if (j.success && Array.isArray(j.dates)) return j.dates;
    throw new Error('bad response');
  } catch(e) {
    return KNOWN_DATES[memberName] || [];  // fallback to hardcoded if server fails
  }
}
```

`loadAll()` in each file updated to call `fetchMemberDates()` for all members in parallel before building the fetch list:
```js
setProgress(2); setStatus('Fetching latest EOD dates from GitHub…');
const liveDates = {};
await Promise.all(MEMBERS.map(async m => {
  liveDates[m.name] = await fetchMemberDates(m.name);
}));
const toFetch = [];
MEMBERS.forEach(m => (liveDates[m.name]||[]).forEach(date => toFetch.push({member:m,date})));
```
