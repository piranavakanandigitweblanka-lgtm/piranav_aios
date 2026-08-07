# EOD Reports Dashboard

**File:** `pages/eod.html`
**Title:** EOD Reports · Digital Marketing Team
**Scope:** All 17 team members — ADS + SEO teams
**Data source:** GitHub Contents API → `digitalmarketing69140951-sys/eod-reports`
**Last updated:** 2026-08-07

---

## Purpose

Provides a read-only web viewer for the daily End of Day (EOD) reports submitted by all 17 digital marketing team members. Reports are stored as markdown files in the eod-reports GitHub repository and fetched live via the GitHub Contents API.

---

## Architecture

**Option A — GitHub API (no database)**

```
eod-reports GitHub repo
  eods/{Member}/YYYY-MM-DD.md
          ↓
  GitHub Contents API
  api/eod/reader.js (Vercel serverless)
          ↓
  JSON → pages/eod.html (markdown → HTML render)
```

---

## API Route

### `/api/eod/reader.js`

| Parameter | Values | Description |
|---|---|---|
| `?action=members` | — | Returns all 17 members with team assignments |
| `?action=dates&member=Name` | Name from member list | Lists all available EOD dates (newest first) |
| `?action=read&member=Name&date=YYYY-MM-DD` | — | Returns raw markdown for that day |

**Environment variable required:** `GITHUB_TOKEN` (optional but recommended — without it GitHub rate-limits to 60 req/hr)

---

## Members

| Member | Team |
|---|---|
| Dilaksi | SEO |
| Hetheesha | SEO |
| Jakshan | SEO |
| Kamsi | SEO |
| Piranav | SEO |
| Sukirtha | SEO |
| Jefri | ADS |
| Kuberan | ADS |
| Mahima | ADS |
| Ripson | ADS |
| Sajeepan | ADS |
| Sonya | ADS |
| Thanishtika | ADS |
| Thasitha | ADS |
| Theekshy | ADS |
| Thishoban | ADS |
| Thivagini | ADS |

---

## Page Features

- Team filter (All / ADS / SEO)
- Member grid with avatar + team colour coding
- Date picker (dropdown of all submitted dates, newest first)
- Previous / Next day navigation arrows
- Markdown → HTML renderer (no external dependencies)
- Loading and error states
- Back to Directory link

---

## Navigation

Added to `index.html` — Intelligence Dashboards section, card count updated from 2 → 3.

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | Recommended | Increases GitHub API rate limit from 60 to 5000 req/hr |

---

## Evidence

`evidence/eod-reports-discovery.md`
