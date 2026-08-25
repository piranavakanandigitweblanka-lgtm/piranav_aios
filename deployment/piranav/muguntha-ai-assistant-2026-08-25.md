# Deployment — Muguntha AI Assistant

**Date:** 2026-08-25
**Platform:** Vercel (Hobby) — `dm-dashboard.vintageinterior.co.uk`
**Repo:** `digitalmarketing69140951-sys/Staff-requirements` — branch `main`

---

## Environment Variables Required

| Variable | Purpose | Set? |
|----------|---------|------|
| `NVIDIA_API_KEY` | NVIDIA NIM API — primary AI model | ✅ Added to Vercel secrets 2026-08-25 |
| `GROQ_API_KEY` | Fallback AI chain | ✅ Pre-existing |
| `EOD_GITHUB_TOKEN` | GitHub API — read EOD files | ✅ Pre-existing |
| `SJ_CHAT_DB_URL` | Chat history DB (muguntha_ai_chat table) | ✅ Pre-existing |
| `DATABASE_URL` | Business data — orders, listings, staff IDs | ✅ Pre-existing |
| `FEED_TRACKER_DB_URL` / `AUTH_DATABASE_URL` | Requirement trackers | ✅ Pre-existing |

---

## Deployment History (2026-08-25)

| Commit | Deployed | Status |
|--------|---------|--------|
| `6d1f4dd` — Initial AI rebuild | ~16:21 IST | ✅ Ready |
| `283ed57` — EOD yesterday fix | ~16:35 IST | ✅ Ready |
| `5da3a58` — 7-day EOD range | ~16:50 IST | ✅ Ready |
| `a9fd290` — Tier 2 business intel | ~17:10 IST | ✅ Ready |
| `ae1b20a` — Tier 3 staff ID perf | ~17:30 IST | ✅ Ready |
| `7b6080b` — Multi-browser race fix | ~17:45 IST | ✅ Ready |

---

## Vercel Function Budget

Vercel Hobby plan: **12 serverless function limit** (already at cap).
Muguntha AI routes are all handled inside `api/muguntha.js` via `?action=` query param routing — no new function files created. Budget unchanged.

---

## Notes

- `NVIDIA_API_KEY` added via Vercel Dashboard → Project Settings → Environment Variables → Secret
- Vercel auto-deploys on every `git push` to `main`
- Redeploy required after adding env var (done: user confirmed redeploy from dashboard)
