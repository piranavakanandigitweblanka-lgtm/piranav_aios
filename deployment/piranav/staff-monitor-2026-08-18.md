# Deployment — Staff Monitor Dashboard

**Date:** 2026-08-18
**Task:** Build staff work monitor page

---

## Deployment Pipeline

```
git add → git commit → git push origin main
       ↓
GitHub Actions: vercel-deploy-hook.yml
       ↓
curl POST → Vercel Deploy Hook
(prj_ziowoLxTbIReqBYx1zVweZZBaBDg)
       ↓
Vercel builds + deploys to production
```

---

## Commits

| Commit | Description |
|---|---|
| `0d4ddc9` | feat: add Staff Monitor page for Piranav (initial build) |
| `d789c27` | feat(monitor): rebuild with staff tabs, view switcher, filters, export CSV |
| `aa1179d` | fix(monitor): fix auth race condition causing login redirect |
| `e9d05c4` | fix(monitor): use AUTH_DATABASE_URL for all tracker tables |
| `42bbb3f` | feat(monitor): add Muguntha as admin — sees all staff tabs |

**Total deploys:** 5

---

## Environment Variables Used

| Variable | Purpose |
|---|---|
| `FEED_TRACKER_DB_URL` | Primary connection for tracker tables (if set) |
| `AUTH_DATABASE_URL` | Fallback connection for tracker tables |
| `DATABASE_URL` | Business DB — NOT used by monitor endpoints |

---

## Live URL

`/pages/monitor.html` on the `digital-marketing-member-pages` Vercel project.
