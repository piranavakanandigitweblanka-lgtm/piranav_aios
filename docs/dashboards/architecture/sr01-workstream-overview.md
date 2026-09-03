# SR-01 Workstream Overview — Staff-requirements
**Created:** 2026-09-03 | **Status:** ACTIVE

---

## What SR-01 Is
Staff-requirements (SR-01) is the first staff dashboard repository. It is a **separate git repository** from SR-02 with its own origin remote and 607-commit history. It covers the admin/manager layer and the full staff member dashboard suite.

**Git repo:** https://github.com/digitalmarketing69140951-sys/Staff-requirements  
**Push account:** `digitalmarketing69140951-sys`  
**Local path:** `C:\Users\PC\Documents\piranav_aios\Staff-requirements\`  
**Deployed to:** Vercel — project `digital-marketing-member-pages` (URL: confirm with Piranav)

---

## SR-01 vs SR-02 — Relationship

| Aspect | SR-01 | SR-02 |
|---|---|---|
| Repo | `digitalmarketing69140951-sys/Staff-requirements` | `piranavakanandigitweblanka-lgtm/piranav_aios` (subfolder) |
| Primary purpose | Admin + manager layer, full staff suite | Piranav's own tooling: SEO, organic revenue, member dashboards |
| Auth | Neon DB-backed (`api/auth.js`) | Neon DB-backed (`api/auth.js`) — separate instance |
| Vercel project | `digital-marketing-member-pages` | `staff-requirements-02` |

On 2026-08-10, a massive sync commit (`a4033b8`) brought 32 files from the aios-2 working environment into SR-01 — code that was live in production but had never been committed to the SR-01 git repo.

---

## Dashboard Suite (as of 2026-08-14)

| Page | Purpose | Auth |
|---|---|---|
| `login.html` | Neon DB-backed login gateway | N/A |
| `pages/kuberan.html` | Kuberan admin dashboard | Admin only |
| `pages/piranav.html` | Piranav admin dashboard | Admin only |
| `pages/muguntha.html` | Muguntha admin dashboard | Admin only |
| `pages/dilaksi.html` | Dilaksi staff dashboard | Staff login |
| `pages/kamsi.html` | Kamsi staff dashboard | Staff login |
| `pages/jefri.html` | Jefri staff dashboard (5 reqs) | Staff login |
| `pages/mahima.html` | Mahima staff dashboard | Staff login |
| `pages/sukirtha.html` | Sukirtha staff dashboard | Staff login |
| `pages/thasitha.html` | Thasitha staff dashboard | Staff login |
| `pages/hetheesha.html` | Hetheesha — SEO requirements | Staff login |
| `pages/jakshan.html` | Jakshan — GSC + sales | Staff login |
| `pages/sajeepan.html` | Sajeepan — Google Ads PMax | Staff login |
| `pages/sonya.html` | Sonya — Google Ads | Staff login |
| `pages/theekshy.html` | Theekshy — Google Ads | Staff login |
| `pages/thivajini.html` | Thivajini — Google Ads + FR | Staff login |
| `pages/sales2.html` | Sales dashboard (navy sidebar) | Staff login |
| `pages/salesuk.html` | UK Sales dashboard | Staff/Admin |
| `pages/sales25.html` | 2025 Sales dashboard | Admin |
| `pages/2025DE.html` | 2025 DE Sales dashboard | Admin |
| `pages/cost.html` | Cost management | Admin |
| `pages/staff-id-performance.html` | Staff ID Performance (5 tabs) | Admin |
| `pages/blog-tool/index.html` | Blog CMS tool | Admin |
| `pages/eod/index.html` | EOD management tool | Admin |
| `pages/eod/admin.html` | EOD admin | Kuberan only |
| `pages/jackson-sales.html` | Jackson dedicated sales | Staff |

---

## API Files

| File | Purpose |
|---|---|
| `api/auth.js` | DB-backed auth (Neon) |
| `api/members-api.js` | All 6 Piranav-era member dashboards |
| `api/intel-api.js` | SEO + Germany + Organic Revenue |
| `api/muguntha.js` | Muguntha admin queries |
| `api/requirement.js` | Requirement management |
| `api/staff-id-performance.js` | Staff ID Performance 5-tab dashboard |
| `api/assign-order.js` | Order assignment |
| `api/sales.js` | Sales dashboard |
| `api/sales25.js` | 2025 Sales dashboard |
| `api/salesde25.js` | 2025 DE Sales dashboard |
| `api/salesuk.js` | UK Sales dashboard |

---

## Key Historical Commits

| Commit | Date | What |
|---|---|---|
| `a4033b8` | 2026-08-10 | Massive sync — 32 files from aios-2 working env |
| `61e2beb` | 2026-08-14 | Recovery — staff-id-performance.html restored from Vercel snapshot |
| `fb3a5fe` | 2026-08-14 | check-live-deploy.js safety canary |
| `1258fd9` | 2026-08-14 | Merge conflict resolved — staff-id-performance.html |

---

## Git Push Instructions
- **Push from:** `C:\Users\PC\Documents\piranav_aios\Staff-requirements\`
- **Account to select:** `digitalmarketing69140951-sys`
- Confirm remote with `git remote -v` before pushing — must point to `digitalmarketing69140951-sys/Staff-requirements`

---

## Related Capability Docs
- `capability/piranav/staff-id-performance-2026-08-14.md`
- `capability/piranav/auth-system-2026-08-10.md`
- `capability/piranav/api-consolidation-2026-08-10.md`
