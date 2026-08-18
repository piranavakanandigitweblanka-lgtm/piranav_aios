# Deployment Log — Hetheesha Req 2 Fix Tracker DB Migration

**Date:** 2026-08-18
**Project:** Staff-requirements (digital-marketing-member-pages)
**Production URL:** https://dm-dashboard.vintageinterior.co.uk

---

## Deployments

### Deploy 1 — DB API + Drawer UI + Frontend Migration
- **Vercel URL:** digital-marketing-member-pages-brat8qag7.vercel.app
- **Status:** READY
- **Changes:** `handleHetheeshaR2FixSave` + `handleHetheeshaR2FixLoad`, `trk2_init` async rewrite, drawer HTML + JS + CSS, row HTML updated

---

### Bulk Date Correction (no deploy — API only)
- **Method:** Node.js script → POST to production API
- **Result:** OK:109 FAIL:0
- has_faq → 2026-08-13 · seo_title/seo_desc → 2026-08-17 · pending → null

---

### Deploy 2 — Tab Persistence Fix
- **Vercel URL:** digital-marketing-member-pages-2abujoula.vercel.app
- **Status:** READY
- **Changes:** Hash restoration IIFE moved to after `showTab()` definition

---

### Deploy 3 — Overlay CSS Fix
- **Vercel URL:** digital-marketing-member-pages-52yxss3nw.vercel.app
- **Status:** READY
- **Changes:** `#r2FxOverlay`, `#r2FxDrawer` given `position:fixed` via ID selectors

---

## Final Alias
`https://dm-dashboard.vintageinterior.co.uk` → digital-marketing-member-pages-52yxss3nw.vercel.app
