# Sonya R6 — Daily Orders — Deployment Record
**Date:** 2026-07-29 | **Member:** Sonya | **Requirement:** 6

## Status: READY — Not yet deployed

## Files to deploy
- `Staff-requirements-02/api/sonya/daily-orders.js` (NEW)
- `Staff-requirements-02/pages/sonya.html` (MODIFIED — tab 6 added)
- `Staff-requirements-02/index.html` (MODIFIED — badge + status fetch removed)
- `Staff-requirements-02/api/status.js` (DELETED)

## Pre-deploy checklist
- [ ] `DATABASE_URL` is set in Vercel environment variables for staff-requirements-02
- [ ] Function count ≤ 12 — confirmed: 12 exactly after status.js deletion
- [ ] Git commit and push

## Deploy command
```bash
cd "C:\Users\PC\Documents\piranav_aios\Staff-requirements-02"
vercel --prod
```
