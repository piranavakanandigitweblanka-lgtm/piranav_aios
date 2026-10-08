# Capability Index — Piranav AIOS
## Date-Wise Organization

**Version:** 3.0 — Physical date-wise migration
**Organized:** 2026-10-08
**Maintained by:** Claude Code (execution) + Piranav (owner)

> **PHYSICAL STRUCTURE:** All 80 capability files have been physically moved to `capability/2026/MM/YYYY-MM-DD/` folders. Old owner-subfolder locations (`piranav/`, `sajeepan/`, `theekshy/`, `sonya/`) are now empty. 211 path references updated across 41 AIOS .md files. Residual references in CLAUDE.md, CAPABILITY_DATEWISE_AUDIT.md, and historical evidence files are intentional snapshots and do not point to moved files.

> **ADMIN FILES (not capabilities):** `CAPABILITY_DATEWISE_AUDIT.md` and `INDEX.md` are management files, not capability records.

---

## Table of Contents

- [2026-07 — Foundation (12 capabilities)](#2026-07)
- [2026-08 — Dashboard + Shopify Ops (16 capabilities)](#2026-08)
- [2026-09 — AI Assistants + SEO + DM Dashboard (41 capabilities)](#2026-09)
- [2026-10 — Conduit + Shopify Fixes + Legal (10 capabilities)](#2026-10)
- [DATE-UNCLEAR / REVIEW REQUIRED](#date-unclear--review-required)
- [Duplicate Decisions Log](#duplicate-decisions-log)
- [October 2026 Capability Coverage](#october-2026-capability-coverage)
- [Queryability Failures](#queryability-failures)
- [Summary Counts](#summary-counts)

---

## 2026-07

Total: 12 capabilities | Staff: sonya, sajeepan, theekshy

| Date | Capability | Canonical Path | Status | Owner | Evidence Path | Last Updated | Reuse Level | Related |
|---|---|---|---|---|---|---|---|---|
| 2026-07-07 | Sonya Req1 — Campaign Notes | `capability/2026/07/2026-07-07/sonya_req1_capability_notes_2026-07-07.md` | ACTIVE | Piranav | `evidence/sonya/sonya_req1_*` | 2026-07-07 | Low — staff-specific | — |
| 2026-07-08 | Sonya Req3 — Product Performance + Priority Segments | `capability/2026/07/2026-07-08/requirement_3_capability.md` | ACTIVE | Piranav | `evidence/sonya/`, `closure/sonya/` | 2026-07-08 | Medium — segment classification pattern | — |
| 2026-07-14 | Sajeepan Req1 | `capability/2026/07/2026-07-14/requirement-1-2026-07-14.md` | ACTIVE | Piranav | `evidence/Jackshan/`, `closure/sajeepan/` | 2026-07-14 | Low — staff-specific | `sajeepan/requirement-2` |
| 2026-07-15 | Theekshy Req01 | `capability/2026/07/2026-07-15/requirement-01-2026-07-15.md` | ACTIVE | Piranav | `evidence/theekshy/` | 2026-07-15 | Low — staff-specific | Theekshy series |
| 2026-07-15 | Theekshy Req02 | `capability/2026/07/2026-07-15/requirement-02-2026-07-15.md` | ACTIVE | Piranav | `evidence/theekshy/` | 2026-07-15 | Low — staff-specific | Theekshy series |
| 2026-07-15 | Theekshy Req03 | `capability/2026/07/2026-07-15/requirement-03-2026-07-15.md` | ACTIVE | Piranav | `evidence/theekshy/` | 2026-07-15 | Low — staff-specific | Theekshy series |
| 2026-07-16 | Theekshy Req04 | `capability/2026/07/2026-07-16/requirement-04-2026-07-16.md` | ACTIVE | Piranav | `evidence/theekshy/` | 2026-07-16 | Low — staff-specific | Theekshy series |
| 2026-07-16 | Theekshy Req01 Fix — Product Name | `capability/2026/07/2026-07-16/requirement-01-fix-product-name-2026-07-16.md` | ACTIVE | Piranav | `evidence/theekshy/` | 2026-07-16 | Low — staff-specific | `theekshy/requirement-01` |
| 2026-07-16 | Theekshy Req3 | `capability/2026/07/2026-07-16/requirement-3-2026-07-16.md` | ACTIVE | Piranav | `evidence/theekshy/` | 2026-07-16 | Low — staff-specific | Theekshy series |
| 2026-07-16 | Theekshy Req2 — Cost Data Fix | `capability/2026/07/2026-07-16/requirement-2-cost-data-fix-2026-07-16.md` | ACTIVE | Piranav | `evidence/theekshy/` | 2026-07-16 | Low — staff-specific | `theekshy/requirement-02` |
| 2026-07-28 | Sajeepan Req2 | `capability/2026/07/2026-07-28/requirement-2-2026-07-28.md` | ACTIVE | Piranav | `closure/sajeepan/` | 2026-07-28 | Low — staff-specific | `sajeepan/requirement-1` |
| 2026-07-29 | Sonya Req6 — Daily Orders | `capability/2026/07/2026-07-29/req6-daily-orders-capability-2026-07-29.md` | ACTIVE | Piranav | `evidence/sonya/`, `closure/sonya/` | 2026-07-29 | Low — staff-specific | — |

---

## 2026-08

Total: 16 capabilities | Projects: SR-01, SR-02, Shopify, SEO

| Date | Capability | Canonical Path | Status | Owner | Evidence Path | Last Updated | Reuse Level | Related |
|---|---|---|---|---|---|---|---|---|
| 2026-08-03 | SEO Intelligence Dashboard | `capability/2026/08/2026-08-03/seo-dashboard-2026-08-03.md` | ACTIVE — extended Aug 7 + Oct 8 | Piranav | `evidence/piranav/seo-dashboard-evidence-2026-08-03.md` | 2026-10-08 | High — reusable dashboard pattern | `seo-intel-raw-api-2026-08-24.md` |
| 2026-08-10 | Auth System — SR-02 (DB-backed) | `capability/2026/08/2026-08-10/auth-system-2026-08-10.md` | ACTIVE | Piranav | `closure/piranav/auth-system-2026-08-10.md` | 2026-08-10 | Medium — Vercel + Neon auth pattern | `api-consolidation-2026-08-10.md` |
| 2026-08-10 | API Consolidation — SR-02 | `capability/2026/08/2026-08-10/api-consolidation-2026-08-10.md` | ACTIVE | Piranav | `closure/piranav/api-consolidation-2026-08-10.md` | 2026-08-10 | Medium — Vercel Hobby pattern | `auth-system-2026-08-10.md` |
| 2026-08-11 | Shopify Shipping Rate Update | `capability/2026/08/2026-08-11/shopify-shipping-rate-update-2026-08-11.md` | PARTIAL — evidence gap | Piranav | `closure/piranav/shopify-shipping-rate-update-2026-08-11.md` | 2026-08-11 | High — reusable | — |
| 2026-08-11 | Sajeepan Req3 — Revenue Protection | `capability/2026/08/2026-08-11/requirement-3-2026-08-11.md` | ACTIVE | Piranav | `closure/sajeepan/requirement-3-2026-08-11.md` | 2026-08-11 | Low — staff-specific | `sajeepan/requirement-2` |
| 2026-08-14 | Shopify XML Feed Debugging | `capability/2026/08/2026-08-14/shopify-xml-feed-debugging-2026-08-14.md` | PARTIAL — fixed file commit unconfirmed | Piranav | `closure/piranav/shopify-xml-feed-debugging-2026-08-14.md` | 2026-08-14 | High — reusable | — |
| 2026-08-14 | Staff ID Performance Dashboard (SR-01) | `capability/2026/08/2026-08-14/staff-id-performance-2026-08-14.md` | ACTIVE | Piranav | `closure/piranav/staff-id-performance-2026-08-14.md` | 2026-08-14 | Medium — SR-01 specific | `staff-monitor-2026-08-18.md` |
| 2026-08-17 | Lampshade SOT Metafield Upload | `capability/2026/08/2026-08-17/lampshade-sot-metafield-upload-2026-08-17.md` | ACTIVE | Piranav | Evidence path UNVERIFIED | 2026-08-17 | Medium — Shopify metafield bulk pattern | — |
| 2026-08-18 | Hetheesha Req2 Fix Tracker DB | `capability/2026/08/2026-08-18/hetheesha-req2-fix-tracker-db-2026-08-18.md` | ACTIVE | Piranav | `closure/piranav/hetheesha-req2-fix-tracker-db-2026-08-18.md` | 2026-08-18 | Medium — fix tracker DB pattern | `hetheesha-dashboard-ux-fix-tracker-2026-09-16.md` |
| 2026-08-18 | Staff Monitor Dashboard (SR-02) | `capability/2026/08/2026-08-18/staff-monitor-2026-08-18.md` | ACTIVE — extended Oct 8 | Piranav | `closure/piranav/staff-monitor-2026-08-18.md` | 2026-10-08 | Medium — manager view pattern | `team-task-monitor-2026-09-02.md` (**DIFFERENT SYSTEM — dm-dashboard**) |
| 2026-08-21 | Sajeepan AI Assistant (SR-02 — vanilla JS) | `capability/2026/08/2026-08-21/sajeepan-ai-assistant-2026-08-21.md` | ACTIVE — cross-refs added Oct 8 | Piranav | `closure/piranav/sajeepan-ai-assistant-2026-08-21.md` | 2026-10-08 | High — AI assistant anchor | `sajeepan/ai-assistant-2026-09-09.md` (**DIFFERENT SYSTEM — dm-dashboard**) |
| 2026-08-21 | EOD Tool Fixes | `capability/2026/08/2026-08-21/eod-tool-fixes-2026-08-21.md` | PARTIAL — 6→10 member expansion unconfirmed | Piranav | `closure/piranav/eod-tool-fixes-2026-08-21.md` | 2026-08-21 | Low — SR-02 specific | — |
| 2026-08-23 | GSC Reference Guides — LEDSone | `capability/2026/08/2026-08-23/gsc-reference-guides-ledsone-2026-08-23.md` | ACTIVE | Piranav | `closure/piranav/` | 2026-08-23 | Medium — client SEO reference | `client-gsc-sop-delivery-pattern-2026-09-24.md` |
| 2026-08-24 | SEO Intel Raw API | `capability/2026/08/2026-08-24/seo-intel-raw-api-2026-08-24.md` | ACTIVE | Piranav | `validation/piranav/seo-intel-raw-api-2026-08-24.md` | 2026-08-24 | High — SEO data pipeline | `semrush-backlinks-pipeline.md`, `gsc-live-sync-2026-09-18.md` |
| 2026-08-25 | Muguntha AI Assistant | `capability/2026/08/2026-08-25/muguntha-ai-assistant-2026-08-25.md` | ACTIVE | Piranav | `closure/piranav/muguntha-ai-assistant-2026-08-25.md` | 2026-08-25 | Medium — staff-specific | `ai-assistant-workflow-2026-08-25.md` |
| 2026-08-25 | AI Assistant Workflow (Master Pattern) | `capability/2026/08/2026-08-25/ai-assistant-workflow-2026-08-25.md` | ACTIVE | Piranav | `closure/piranav/ai-assistant-workflow-2026-08-25.md` | 2026-08-25 | High — cross-staff AI assistant pattern | All AI assistant caps |

---

## 2026-09

Total: 41 capabilities | Projects: dm-dashboard, SR-02, Shopify, SEO, Sajeepan Ads

### 2026-09-01 to 2026-09-04 — Infrastructure + Core dm-dashboard

| Date | Capability | Canonical Path | Status | Owner | Evidence Path | Last Updated | Reuse Level | Related |
|---|---|---|---|---|---|---|---|---|
| 2026-09-01 | DM Dashboard Local Setup | `capability/2026/09/2026-09-01/dm-dashboard-local-setup-2026-09-01.md` | ACTIVE | Piranav | `closure/piranav/dm-dashboard-local-setup-2026-09-01.md` | 2026-09-01 | Medium — dev environment | `contabo-vps-setup-2026-09-01.md` |
| 2026-09-01 | Contabo VPS Setup | `capability/2026/09/2026-09-01/contabo-vps-setup-2026-09-01.md` | ACTIVE | Piranav | `closure/piranav/contabo-vps-closure-2026-09-01.md` | 2026-09-01 | Medium — infra | `pgadmin-remote-access-2026-09-02.md` |
| 2026-09-02 | Kamsi + Dilaksi AI Assistant | `capability/2026/09/2026-09-02/kamsi-dilaksi-ai-assistant-2026-09-02.md` | ACTIVE | Piranav | `closure/piranav/kamsi-dilaksi-ai-assistant-2026-09-02.md` | 2026-09-02 | Low — staff-specific | `ai-assistant-workflow-2026-08-25.md` |
| 2026-09-02 | pgAdmin Remote Access | `capability/2026/09/2026-09-02/pgadmin-remote-access-2026-09-02.md` | ACTIVE | Piranav | `closure/piranav/` | 2026-09-02 | Medium — infra | `contabo-vps-setup-2026-09-01.md` |
| 2026-09-02 | Sonya AI Assistant (dm-dashboard) | `capability/2026/09/2026-09-02/sonya-ai-assistant-2026-09-02.md` | ACTIVE | Piranav | `closure/piranav/sonya-ai-assistant-2026-09-02.md` | 2026-09-02 | Low — staff-specific | `ai-assistant-workflow-2026-08-25.md` |
| 2026-09-02 | Server SSH Access (Paramiko) | `capability/2026/09/2026-09-02/server-ssh-access-paramiko-2026-09-02.md` | ACTIVE | Piranav | `closure/piranav/` | 2026-09-02 | Medium — infra | `contabo-vps-setup-2026-09-01.md` |
| 2026-09-02 | Theekshy AI Assistant (dm-dashboard) | `capability/2026/09/2026-09-02/theekshy-ai-assistant-2026-09-02.md` | ACTIVE | Piranav | `closure/piranav/theekshy-ai-assistant-2026-09-02.md` | 2026-09-02 | Low — staff-specific | `ai-assistant-workflow-2026-08-25.md` |
| 2026-09-02 | Muguntha AI Team Brief | `capability/2026/09/2026-09-02/muguntha-ai-team-brief-2026-09-02.md` | ACTIVE | Piranav | `closure/piranav/muguntha-ai-team-brief-2026-09-02.md` | 2026-09-02 | Low — staff-specific | `muguntha-ai-assistant-2026-08-25.md` |
| 2026-09-02 | Wire Connectors SKU Audit | `capability/2026/09/2026-09-02/wire-connectors-sku-audit-2026-09-02.md` | ACTIVE | Piranav | `closure/piranav/wire-connectors-sku-audit-2026-09-02.md` | 2026-09-02 | Medium — SKU audit pattern | `shopify-listing-health-export-queries-2026-09-21.md` |
| 2026-09-02 | Sajeepan AI Item ID Fix | `capability/2026/09/2026-09-02/sajeepan-ai-item-id-fix-2026-09-02.md` | ACTIVE | Piranav | `closure/piranav/sajeepan-ai-item-id-fix-2026-09-02.md` | 2026-09-02 | Medium — data normalisation | `ads-product-scope-admin-page.md` |
| 2026-09-02 | Team Task Monitor (dm-dashboard) | `capability/2026/09/2026-09-02/team-task-monitor-2026-09-02.md` | ACTIVE | Piranav | `closure/piranav/team-task-monitor-2026-09-02.md` | 2026-09-02 | High — team visibility pattern | `staff-monitor-2026-08-18.md` (**DIFFERENT SYSTEM — SR-02**) |
| 2026-09-03 | Task Verification System | `capability/2026/09/2026-09-03/task-verification-2026-09-03.md` | ACTIVE | Piranav | `closure/piranav/` | 2026-09-03 | Medium — dm-dashboard verification | — |
| 2026-09-03 | Gemini Multi-Key Fallback | `capability/2026/09/2026-09-03/gemini-multi-key-fallback-2026-09-03.md` | ACTIVE | Piranav | `closure/piranav/` | 2026-09-03 | High — AI key rotation | `ai-fallback-chain-nvidia-2026-09-03.md` |
| 2026-09-03 | AI Fallback Chain (NVIDIA) | `capability/2026/09/2026-09-03/ai-fallback-chain-nvidia-2026-09-03.md` | ACTIVE | Piranav | `closure/piranav/` | 2026-09-03 | High — AI fallback pattern | `gemini-multi-key-fallback-2026-09-03.md` |
| 2026-09-04 | Actionable AI Task Brief (parseTasks fix) | `capability/2026/09/2026-09-04/actionable-ai-task-brief-2026-09-04.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-04 | High — parseTasks() multi-line fix | `ai-brief-pipeline-pattern-2026-09-15.md` |
| 2026-09-04 | Staff Skill-Aware AI Task Framing | `capability/2026/09/2026-09-04/staff-skill-aware-ai-task-framing-2026-09-04.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-04 | High — system prompt pattern | `actionable-ai-task-brief-2026-09-04.md` |
| 2026-09-04 | Clickable Task Items + Priority Icons | `capability/2026/09/2026-09-04/clickable-task-items-priority-icons-2026-09-04.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-04 | High — frontend UX pattern | `task-persistence-briefdata-restore-2026-09-04.md` |
| 2026-09-04 | Task Persistence + Brief Data Restore | `capability/2026/09/2026-09-04/task-persistence-briefdata-restore-2026-09-04.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-04 | High — localStorage pattern | `clickable-task-items-priority-icons-2026-09-04.md` |

### 2026-09-09 — Sajeepan dm-dashboard Phase

| Date | Capability | Canonical Path | Status | Owner | Evidence Path | Last Updated | Reuse Level | Related |
|---|---|---|---|---|---|---|---|---|
| 2026-09-09 | Sajeepan AI Assistant (dm-dashboard — React/Python) | `capability/2026/09/2026-09-09/ai-assistant-2026-09-09.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-09 | Low — staff-specific | `sajeepan-ai-assistant-2026-08-21.md` (**DIFFERENT SYSTEM — SR-02**) |
| 2026-09-09 | Sajeepan Bot Phase 1 | `capability/2026/09/2026-09-09/bot-phase1-2026-09-09.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-09 | Low — staff-specific | `sajeepan/ai-assistant-2026-09-09.md` |
| 2026-09-09 | Sajeepan Admin Brief Regeneration | `capability/2026/09/2026-09-09/admin-brief-regeneration-2026-09-09.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-09 | Medium — admin brief pattern | `ai-brief-pipeline-pattern-2026-09-15.md` |

### 2026-09-14 to 2026-09-18 — SEO + AI Brief Unification

| Date | Capability | Canonical Path | Status | Owner | Evidence Path | Last Updated | Reuse Level | Related |
|---|---|---|---|---|---|---|---|---|
| 2026-09-14 | SEO Skills Tab + SuperSEO Plugin | `capability/2026/09/2026-09-14/seo-skills-tab-2026-09-14.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-14 | High — SEO skill runner | `seo-dashboard-2026-08-03.md` |
| 2026-09-15 | Unified Daily Task Hub (all 11 staff) | `capability/2026/09/2026-09-15/unified-daily-task-hub-2026-09-15.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-15 | High — central task hub | `ai-brief-pipeline-pattern-2026-09-15.md` |
| 2026-09-15 | AI Brief Full Pipeline Pattern | `capability/2026/09/2026-09-15/ai-brief-pipeline-pattern-2026-09-15.md` | ACTIVE — extended Oct 8 | Piranav | `closure/README.md` | 2026-10-08 | High — standard pattern all staff | `actionable-ai-task-brief-2026-09-04.md` |
| 2026-09-16 | Hetheesha Dashboard UX Fix Tracker | `capability/2026/09/2026-09-16/hetheesha-dashboard-ux-fix-tracker-2026-09-16.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-16 | High — UX fix tracker pattern | `hetheesha-req2-fix-tracker-db-2026-08-18.md` |
| 2026-09-16 | Thivajini Dynamic Campaign System | `capability/2026/09/2026-09-16/thivajini-dynamic-campaign-system-2026-09-16.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-16 | High — all campaign staff | `dm-campaign-filter-dropdown-pattern-2026-09-23.md` |
| 2026-09-17 | Sales2026 UK Grand Total + Shopify Actuals | `capability/2026/09/2026-09-17/sales2026-uk-grand-total-2026-09-17.md` | ACTIVE — extended Sep 22 + Oct 8 | Piranav | `closure/README.md` | 2026-10-08 | Medium — admin sales view | — |
| 2026-09-18 | GSC Live Sync (100% data, APScheduler) | `capability/2026/09/2026-09-18/gsc-live-sync-2026-09-18.md` | PARTIAL — first sync unconfirmed | Piranav | `evidence/sajeepan/gsc-live-sync-2026-09-18.md` | 2026-09-18 | High — SEO data pipeline | `seo-intel-raw-api-2026-08-24.md` |
| 2026-09-18 | Sukirtha AI Brief Variety Cap | `capability/2026/09/2026-09-18/sukirtha-ai-brief-variety-2026-09-18.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-18 | Medium — AI brief tuning | `ai-brief-pipeline-pattern-2026-09-15.md` |
| 2026-09-18 | Sukirtha R6 OOS/Draft Exclusion | `capability/2026/09/2026-09-18/sukirtha-r6-oos-draft-2026-09-18.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-18 | Medium — Shopify product filter | `unified-daily-task-hub-2026-09-15.md` |

### 2026-09-21 to 2026-09-30 — SEO Pipelines + Admin Tools + Shopify

| Date | Capability | Canonical Path | Status | Owner | Evidence Path | Last Updated | Reuse Level | Related |
|---|---|---|---|---|---|---|---|---|
| 2026-09-21 | SEMrush Backlinks Pipeline | `capability/2026/09/2026-09-21/semrush-backlinks-pipeline.md` | PARTIAL — DB write unconfirmed | Piranav | `evidence/seo/semrush-backlinks-ledsone-2026-09-21.md` | 2026-09-21 | High — SEO data pipeline | `seo-intel-raw-api-2026-08-24.md` |
| 2026-09-21 | SEMrush Organic Pages Pipeline | `capability/2026/09/2026-09-21/semrush-organic-pages-pipeline-2026-09-21.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-21 | High — SEO data pipeline | `semrush-backlinks-pipeline.md` |
| 2026-09-21 | SEO Keyword Gap Tracker | `capability/2026/09/2026-09-21/seo-keyword-gap-tracker-2026-09-21.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-21 | High — weekly SEO signal | `seo-skills-tab-2026-09-14.md` |
| 2026-09-21 | Shopify Listing Health Export Queries | `capability/2026/09/2026-09-21/shopify-listing-health-export-queries-2026-09-21.md` | ACTIVE | Piranav | `exports/ledsone-uk-*-2026-09-21.csv` | 2026-09-21 | High — reusable query patterns | `wire-connectors-sku-audit-2026-09-02.md` |
| 2026-09-22 | Mahima AI Brief R2 Removal | `capability/2026/09/2026-09-22/mahima-ai-brief-r2-removal-2026-09-22.md` | ACTIVE | Piranav | `closure/README.md` | 2026-09-22 | Low — staff-specific | `ai-brief-pipeline-pattern-2026-09-15.md` |
| 2026-09-23 | DM Campaign Filter Dropdown Pattern | `capability/2026/09/2026-09-23/dm-campaign-filter-dropdown-pattern-2026-09-23.md` | ACTIVE | Piranav | `validation/piranav/dm-campaign-filter-2026-09-23.md` | 2026-09-23 | High — React filter component | `thivajini-dynamic-campaign-system-2026-09-16.md` |
| 2026-09-24 | Shopify Customer Google Sign-In | `capability/2026/09/2026-09-24/shopify-customer-google-signin.md` | ACTIVE | Piranav | `validation/piranav/homingmbh-shopify-google-signin-2026-09-24.md` | 2026-09-24 | High — any Shopify store | — |
| 2026-09-24 | Client GSC SOP Delivery Pattern | `capability/2026/09/2026-09-24/client-gsc-sop-delivery-pattern-2026-09-24.md` | ACTIVE | Piranav | `validation/piranav/homingmbh-gsc-sop-2026-09-24.md` | 2026-09-24 | Medium — client handover process | `gsc-reference-guides-ledsone-2026-08-23.md` |
| 2026-09-25 | Ads Product Scope + Non-Sale Method | `capability/2026/09/2026-09-25/ads-product-scope-admin-page.md` | ACTIVE — extended Oct 8 | Piranav | `evidence/sajeepan/sajeepan-ads-scope-level6a-lifetime-verification-2026-09-25.md` | 2026-10-08 | High — product classification | `sajeepan-ai-item-id-fix-2026-09-02.md` |
| 2026-09-28 | Shopify Modal Responsive Fix | `capability/2026/09/2026-09-28/shopify-modal-responsive-fix-pattern-2026-09-28.md` | ACTIVE — deployed ledsone.de | Piranav | `validation/piranav/ledsone-de-energy-label-modal-validation-2026-09-28.md` | 2026-09-28 | High — any Shopify modal | — |
| 2026-09-30 | Shopify Catalogue Template Build (4-phase) | `capability/2026/09/2026-09-30/shopify-catalogue-template-build-pattern-2026-09-30.md` | ACTIVE | Piranav | `validation/piranav/ledsone-us-catalogue-discovery-2026-09-30.md` | 2026-09-30 | High — multi-phase methodology | `shopify-collection-card-stock-price-fix-2026-10-07.md` |
| 2026-09-30 | DM Dashboard Date Filter UI Pattern | `capability/2026/09/2026-09-30/dm-dashboard-date-filter-ui-pattern-2026-09-30.md` | ACTIVE | Piranav | `evidence/germany/wlg-date-filter-2026-09-30.md` | 2026-09-30 | High — React date filter component | `dm-campaign-filter-dropdown-pattern-2026-09-23.md` |

---

## 2026-10

Total: 10 capabilities | Projects: Conduit/Shopify, ElectricalsOne, dm-dashboard, Legal

| Date | Capability | Canonical Path | Status | Owner | Evidence Path | Last Updated | Reuse Level | Related |
|---|---|---|---|---|---|---|---|---|
| 2026-10-01 | DM Dashboard Conduit Sold History | `capability/2026/10/2026-10-01/dm-dashboard-conduit-sold-history-pattern-2026-10-01.md` | ACTIVE — Phase 2 browser validation pending | Piranav | `validation/piranav/conduit-sold-phase1-validation-2026-10-01.md` | 2026-10-02 | Medium — category admin view | `dm-dashboard-pdf-image-embed-pattern-2026-10-02.md` |
| 2026-10-02 | DM Dashboard PDF Image Embed | `capability/2026/10/2026-10-02/dm-dashboard-pdf-image-embed-pattern-2026-10-02.md` | ACTIVE | Piranav | `evidence/dm-dashboard/listing-issues-pdf-enhancement-2026-10-02.md` | 2026-10-02 | High — reusable Python helper | `dm-dashboard-conduit-sold-history-pattern-2026-10-01.md` |
| 2026-10-05 | Shopify Judge.me Fake Rating Fix | `capability/2026/10/2026-10-05/shopify-judgeme-fake-rating-fix-2026-10-05.md` | FIX APPLIED (local) — deploy pending | Piranav | `electricalsone_urgent_fixes/investigation/root_cause.md` | 2026-10-05 | High — any Judge.me store | — |
| 2026-10-06 | Shopify Robots.txt Pagination Fix | `capability/2026/10/2026-10-06/shopify-robots-txt-pagination-pattern-2026-10-06.md` | CODE COMPLETE (local) — deploy pending | Piranav | `validation/piranav/GA-02_implementation-validation_2026-10-06.md` | 2026-10-06 | High — any Shopify store | — |
| 2026-10-07 | Shopify Collection Card Stock + Price Fix | `capability/2026/10/2026-10-07/shopify-collection-card-stock-price-fix-2026-10-07.md` | CODE COMPLETE — browser validation pending | Piranav | `conduit-stock-price-cards/02_implementation/CONDUIT-01-implementation-2026-10-07.md` | 2026-10-07 | High — any Shopify theme | `shopify-catalogue-template-build-pattern-2026-09-30.md` |
| 2026-10-07 | Shopify Collection Tag Audit Method | `capability/2026/10/2026-10-07/shopify-collection-tag-audit-method-2026-10-07.md` | PARTIAL — discovery done, implementation open | Piranav | `organic-discovery/06_GA-08_bulb_collection_tags/evidence/GA-08_step1_discovery_2026-10-07.md` | 2026-10-07 | High — reusable PostgreSQL method | `shopify-listing-health-export-queries-2026-09-21.md` |
| 2026-10-07 | Avasam UK Stock Update Workflow | `capability/2026/10/2026-10-07/avasam-uk-stock-update-workflow-2026-10-07.md` | ACTIVE | Piranav | `evidence/avasam/avasam_stock_update_2026-10-07_evidence.md` | 2026-10-07 | High — repeatable workflow | — |
| 2026-10-08 | Shopify Collection-Specific Swatch Guard | `capability/2026/10/2026-10-08/shopify-collection-specific-swatch-guard-2026-10-08.md` | CODE COMPLETE — browser validation pending | Piranav | `conduit-stock-price-cards/02_implementation/CONDUIT-TASK6-finish-swatches-2026-10-08.md` | 2026-10-08 | High — any Shopify theme | `shopify-collection-card-stock-price-fix-2026-10-07.md` |
| 2026-10-08 | Shopify Theme HTML Deduplication | `capability/2026/10/2026-10-08/shopify-theme-html-deduplication-pattern-2026-10-08.md` | CODE COMPLETE — size measurement pending | Piranav | `conduit-stock-price-cards/02_implementation/CONDUIT-STEP3-html-reduction-2026-10-08.md` | 2026-10-08 | High — any Shopify theme | `shopify-collection-specific-swatch-guard-2026-10-08.md` |
| 2026-10-08 | IP Infringement Investigation + C&D Letter | `capability/2026/10/2026-10-08/ip-infringement-investigation-and-cease-desist.md` | ACTIVE | Piranav | `evidence/legal/lidsone-ip-infringement-2026-10-08.md` | 2026-10-08 | High — any brand protection case | — |

---

## DATE-UNCLEAR / REVIEW REQUIRED

**DATE-UNCLEAR files:** 0 — all 80 capability files have confirmed dates from content or filenames.

**Status REVIEW REQUIRED (no capability file exists):**

| Capability | Reason | Next Step |
|---|---|---|
| PI-01 Stock Hiding | Discovery-only. 3 candidate root causes (A/B/C). Muguntha decision pending. | Create capability only after Muguntha confirms root cause. |

**Status PARTIAL (existing files — human confirmation needed):**

| File | What Is Unconfirmed |
|---|---|
| `capability/2026/09/2026-09-18/gsc-live-sync-2026-09-18.md` | Has APScheduler first sync run on Contabo? DB write confirmed? |
| `capability/2026/09/2026-09-21/semrush-backlinks-pipeline.md` | DB write confirmed? Evidence path verified? |
| `capability/2026/08/2026-08-14/shopify-xml-feed-debugging-2026-08-14.md` | Fixed template committed to git? |
| `capability/2026/08/2026-08-21/eod-tool-fixes-2026-08-21.md` | EOD 6→10 member expansion committed? |
| `capability/2026/10/2026-10-07/shopify-collection-tag-audit-method-2026-10-07.md` | GA-08 tag implementation open — update when complete |
| `capability/2026/10/2026-10-01/dm-dashboard-conduit-sold-history-pattern-2026-10-01.md` | Phase 2 browser validation complete? |

---

## Duplicate Decisions Log

Resolved as of 2026-10-08. Do NOT create new files for these — extend existing ones.

| Decision | Resolution | File to Extend (if new work arrives) |
|---|---|---|
| Non-Sale Discovery Method | EXTENDED `ads-product-scope-admin-page.md` | `capability/2026/09/2026-09-25/ads-product-scope-admin-page.md` |
| Staff Monitor (SR-02) vs Team Task Monitor (dm-dashboard) | **DIFFERENT SYSTEMS** — DO NOT MERGE. Cross-ref added. | Both preserved separately |
| AI Brief Pipeline vs Actionable Task Brief vs Unified Hub | **THREE DIFFERENT CAPABILITIES** — do not merge. | Each preserved separately |
| Sajeepan AI Aug 21 (SR-02) vs Sep 09 (dm-dashboard) | **DIFFERENT SYSTEMS** — Cross-ref in Aug 21 file. | Each preserved separately |
| Sales2026 UK Shopify Actuals | EXTENDED `sales2026-uk-grand-total-2026-09-17.md` | `capability/2026/09/2026-09-17/sales2026-uk-grand-total-2026-09-17.md` |
| SEMrush organic pages | Existing file confirmed | `capability/2026/09/2026-09-21/semrush-organic-pages-pipeline-2026-09-21.md` |
| SEO keyword gap tracker | Existing file confirmed | `capability/2026/09/2026-09-21/seo-keyword-gap-tracker-2026-09-21.md` |

---

## October 2026 Capability Coverage

| Date | Work | Capability File | Status |
|---|---|---|---|
| 2026-10-01 | Conduit Sold History Phase 1 | `dm-dashboard-conduit-sold-history-pattern-2026-10-01.md` | COVERED |
| 2026-10-02 | Listing Issues PDF image embed | `dm-dashboard-pdf-image-embed-pattern-2026-10-02.md` | COVERED |
| 2026-10-05 | ElectricalsOne Judge.me fake rating | `shopify-judgeme-fake-rating-fix-2026-10-05.md` | COVERED |
| 2026-10-05 | PI-01 Stock Hiding discovery | NO FILE — REVIEW REQUIRED | PENDING — Muguntha |
| 2026-10-06 | GA-02 robots.txt pagination fix | `shopify-robots-txt-pagination-pattern-2026-10-06.md` | COVERED |
| 2026-10-07 | Conduit Parts 1–2 stock/price fix | `shopify-collection-card-stock-price-fix-2026-10-07.md` | COVERED |
| 2026-10-07 | GA-08 bulb collection tag audit | `shopify-collection-tag-audit-method-2026-10-07.md` | COVERED (PARTIAL) |
| 2026-10-07 | Avasam UK stock update | `avasam-uk-stock-update-workflow-2026-10-07.md` | COVERED |
| 2026-10-08 | Conduit Task 6 swatch guard | `shopify-collection-specific-swatch-guard-2026-10-08.md` | COVERED |
| 2026-10-08 | Conduit Step 3 HTML deduplication | `shopify-theme-html-deduplication-pattern-2026-10-08.md` | COVERED |
| 2026-10-08 | IP Infringement C&D | `ip-infringement-investigation-and-cease-desist.md` | COVERED |

**10 of 11 items covered. 1 pending (PI-01).**

---

## Queryability Failures

Files that do NOT fully meet the 12-field standard. Core questions are still answerable but one or more formal fields are missing.

| File | Missing / Weak Fields | Priority |
|---|---|---|
| `sonya/sonya_req1_capability_notes_2026-07-07.md` | Notes format — no formal fields at all | Low |
| `sonya/requirement_3_capability.md` | No Pass/Fail Rule, no Reuse Path | Low |
| `sajeepan/requirement-1-2026-07-14.md` | Old format — no pass/fail, no reuse path | Low |
| `theekshy/requirement-01-2026-07-15.md` | Old format | Low |
| `theekshy/requirement-02-2026-07-15.md` | Old format | Low |
| `theekshy/requirement-03-2026-07-15.md` | Old format | Low |
| `theekshy/requirement-04-2026-07-16.md` | Old format | Low |
| `theekshy/requirement-01-fix-product-name-2026-07-16.md` | Old format | Low |
| `theekshy/requirement-3-2026-07-16.md` | Old format | Low |
| `theekshy/requirement-2-cost-data-fix-2026-07-16.md` | Old format | Low |
| `sajeepan/requirement-2-2026-07-28.md` | Old format | Low |
| `sonya/req6-daily-orders-capability-2026-07-29.md` | Old format | Low |
| `piranav/seo-dashboard-2026-08-03.md` | Mixed format — partial upgrade only | Medium |
| `capability/2026/09/2026-09-21/semrush-backlinks-pipeline.md` | No Pass/Fail Rule, Known Limits, Reuse Path | Medium |
| `capability/2026/09/2026-09-18/gsc-live-sync-2026-09-18.md` | Short format — missing execution steps | Medium |
| `piranav/lampshade-sot-metafield-upload-2026-08-17.md` | Evidence path UNVERIFIED | Medium |

**Queryability PASS:** 64 / 80
**Queryability FAIL:** 16 / 80
**Full format upgrade:** Scheduled as a separate session task.

---

## Summary Counts

| Metric | Count |
|---|---|
| Total capability files (excluding INDEX + AUDIT) | 80 |
| Capabilities with confirmed dates | 80 |
| Capabilities with DATE-UNCLEAR | 0 |
| Jul 2026 capabilities | 12 |
| Aug 2026 capabilities | 16 |
| Sep 2026 capabilities | 41 |
| Oct 2026 capabilities | 10 |
| Status: ACTIVE | 61 |
| Status: PARTIAL | 5 |
| Status: CODE COMPLETE — validation pending | 5 |
| Status: REVIEW REQUIRED (no file) | 1 (PI-01) |
| Queryability PASS (core 7 fields present) | 64 |
| Queryability FAIL (missing formal fields) | 16 |
| Duplicate risks resolved | 7 |
| Physical file moves performed | 0 (reference risk — see note above) |
| Human review items outstanding | 6 |
