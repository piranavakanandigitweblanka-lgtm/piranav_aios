# EOD Reports Discovery

**Date:** 2026-08-07
**Performed by:** Claude Code — Discovery Worker
**Status:** PASS — All 10 criteria met

---

## 1. Objective

Perform a pre-build discovery and architecture comparison to determine:
- What the eod-reports repository contains.
- How it maps onto the existing Staff-requirements-02 application.
- What can be reused.
- Where duplicate risk exists.
- Whether the new page can safely live in the same Vercel deployment.

**NO implementation was performed.**

---

## 2. Source Repository

| Property | Value |
|---|---|
| URL | https://github.com/digitalmarketing69140951-sys/eod-reports |
| Clone status | SUCCESS — 1,517 files, inspected at scratchpad |
| Framework | **None** — this is a data/content repository only, not a web application |
| Package manager | None (no package.json) |
| Web app files | None (no HTML, JS, CSS, vercel.json) |
| Database | None — no SQL, no API functions |

---

## 3. Target Application

| Property | Value |
|---|---|
| Local path | `C:\Users\PC\Documents\piranav_aios\Staff-requirements-02` |
| Framework | Vanilla HTML/CSS/JavaScript (no build step) |
| Runtime | Node.js serverless (Vercel Functions) |
| Package manager | npm |
| Deployment URL | `https://digital-marketing-member-pages.vercel.app/` |
| Dependencies | `pg` v8.11.5, `@neondatabase/serverless` v1.1.0 |

---

## 4. Repository Architecture

### 4.1 eod-reports Repository — Complete Structure

```
eod-reports/
├── README.md                        ← Single line: "# eod-reports"
├── eod_format.xlsx                  ← 7KB Excel template (EOD form template)
├── eods/                            ← Daily EOD markdown files, per staff member
│   ├── Dilaksi/     (94 files)
│   ├── Hetheesha/   (93 files)
│   ├── Jakshan/     (73 files)
│   ├── Jefri/       (88 files)
│   ├── Kamsi/       (79 files)
│   ├── Kuberan/     (77 files)
│   ├── Mahima/      (91 files)
│   ├── Piranav/     (72 files)
│   ├── Ripson/      (66 files)
│   ├── Sajeepan/    (91 files)
│   ├── Sonya/       (83 files)
│   ├── Sukirtha/    (93 files)
│   ├── Thanishtika/ (35 files)
│   ├── Thasitha/    (74 files)
│   ├── Theekshy/    (94 files)
│   ├── Thishoban/   (20 files)
│   └── Thivagini/   (94 files)
│   TOTAL: 17 members, 1,316 EOD files
│   DATE RANGE: 2026-03-30 → 2026-08-06
│
├── standup/                         ← Structured JSON standup submission data
│   ├── ADS.json                     ← 5 records (ADS team standup entries)
│   └── SEO.json                     ← 5 records (SEO team standup entries)
│
└── summary/                         ← Weekly performance truth audit reports (per member)
    ├── 2026-04-01/
    ├── 2026-04-03/
    ├── ... (16 weekly folders)
    └── 2026-07-03/
        ├── Dilaksi.md
        ├── Hetheesha.md
        └── ... (per-member weekly summaries)
```

### 4.2 Staff-requirements-02 Structure (confirmed from Phase 1)

```
Staff-requirements-02/
├── index.html                       ← Home/directory page
├── package.json                     ← pg + @neondatabase/serverless
├── vercel.json                      ← api/**/*.js, maxDuration: 60s
├── api/                             ← 10 serverless functions
│   ├── germany/{marketplace-gap,uk-bundle-opportunity}.js
│   ├── hetheesha/{req1,req2}.js
│   ├── jackshan/dashboard.js
│   ├── organic-revenue.js
│   ├── sajeepan/dashboard.js
│   ├── seo.js
│   ├── sonya/{dashboard,daily-orders}.js   ← daily-orders = closest EOD-adjacent asset
│   ├── theekshy/dashboard.js
│   └── thivajini/dashboard.js
├── pages/                           ← 8 staff HTML dashboards + 2 special
├── assets/css/{style.css,main.js}
├── docs/                            ← Internal documentation .md files
└── evidence/                        ← This file
```

---

## 5. Existing Staff-Requirements Architecture

### 5.1 Framework / Runtime
- Frontend: Vanilla HTML + inline CSS/JS, no build step.
- Backend: Node.js serverless (Vercel Functions) at `api/**/*.js`.
- DB client: `pg` v8.11.5 + `@neondatabase/serverless` v1.1.0.

### 5.2 Navigation Pattern
- `index.html` home → card links → `pages/{member}.html`
- Each page: multi-tab single HTML file, tab switching via `showTab()` JS
- Back link on all staff pages to index

### 5.3 API Pattern
```js
module.exports = async function handler(req, res) {
  const connStr = process.env.DATABASE_URL;
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();
  // queries → JSON response
  await client.end();
}
```

### 5.4 Environment Variables (names only)
| Variable | Used In |
|---|---|
| `DATABASE_URL` | All API functions (primary PostgreSQL) |
| `POSTGRES_URL` | `api/organic-revenue.js` (alias) |
| `NEON_DATABASE_URL` | `api/seo.js` |
| `SHOPIFY_FR_TOKEN` | `api/hetheesha/req1.js`, `req2.js` |
| `PSI_KEY` | `api/seo.js` |

### 5.5 Database Schemas In Use
| Schema | Tables |
|---|---|
| `google_ads` | campaign_performance, product_performance, merchant_products, pmax_campaign_search_term_data, asset_performance |
| `google_analytics` | organic_landing_page_revenue |
| `google_search_console` | overview, page, query, query_page |
| `inventory` | products, physical_product_stock |
| `listings` | amazon_listings, ebay_listings, shopify_listings |
| `order_management` | orders, order_item_info, sub_source, source |

---

## 6. Data Sources

### eod-reports: What the data IS

The eod-reports repository is a **Git-based markdown document store** — not a web application, not a database-connected system. It has three data layers:

| Layer | Location | Format | Content |
|---|---|---|---|
| Daily EOD reports | `eods/{Member}/YYYY-MM-DD.md` | Markdown | Per-member daily work log |
| Standup submissions | `standup/ADS.json`, `standup/SEO.json` | JSON | Structured task records (5 records each — likely a sample/seed) |
| Weekly summaries | `summary/YYYY-MM-DD/{Member}.md` | Markdown | Weekly performance truth audit per member |

### EOD Markdown Field Structure (evidenced from `eods/Hetheesha/2026-08-06.md`)

SEO team EOD sections:
1. Date
2. On-Page SEO Tasks (per task: Time, Status, URLs, Evidence, What changed, Definition of Done Met)
3. Blog Writing Tasks
4. AI SEO Tasks
5. Backlink Building Tasks
6. Other SEO Tasks
7. Diagnostic Reflection (What was tried / worked / failed / time wasted / change tomorrow / lessons / questions)
8. Team Discussions & Decisions
9. Support, Dependencies & Gates

ADS team EOD sections (evidenced from `eods/Theekshy/2026-08-06.md`):
- Date / Time vs. Priority Audit
- ROAS Health Check
- Critical Actions Taken (Daily Performance Monitoring, Campaign Analysis, PDP Optimisation, Listing Creation)
- The "Why" Analysis
- Pending / Next Steps
- Operational EOD Structure (Campaign Setup, Feed Optimisation, Optimisation Tasks, Creative Assets, Diagnostic Reflection)
- Team Discussions & Decisions
- Support, Dependencies & Gates

### Standup JSON Schema (from `standup/ADS.json` + `standup/SEO.json`)

```json
{
  "id": "timestamp_random",
  "member": "Sonya",
  "team": "ADS",
  "date": "2026-04-27",
  "review_due": "2026-05-11",
  "submitted_at": "ISO timestamp",
  "task_type": "",
  "daily_task": "",
  "business_impact": "",
  "completed": "yes|no|empty",
  "reason_if_missed": "",
  "result_achieved": null,
  "reviews_date": "",
  "measurable_impact": "",
  "primary_failure_reason": "",
  "blocker": null,
  "leader_pivot": ""
}
```

### Weekly Summary Format (from `summary/2026-07-03/Hetheesha.md`)
- Section A: Value Created
- Section B: Opportunity Wasted (Company)
- Section C: Opportunity Wasted (Career)
- Section D: Value Per Hour Judgement
- Section E: Weekly Score (numeric, out of 100, Red/Amber/Green)
- Section F: One-Sentence Verdict
- Section G: Next-Week Correction (Stop / Start / Measurable Test)
- Section H: Next-Week Task Pipe (Mon–Fri plan)

---

## 7. API / Query Flow

### eod-reports: NO API exists

The repository has no API functions, no database connection, no serverless functions, no web server. It is a pure content/document store committed to Git.

**Current "flow" is entirely manual:**
```
Staff member writes EOD → commits .md file to eods/{Name}/YYYY-MM-DD.md
                        → Manager reviews markdown in GitHub
                        → Weekly summary written to summary/{week}/{Name}.md
```

### What the new EOD page must BUILD (not reuse from eod-reports)

A new web dashboard would need to:
1. Read the markdown files from GitHub (via GitHub API) OR
2. Parse markdown into a database at ingest time OR
3. Use the `standup/` JSON structure as the database schema going forward

**Source of truth options ranked:**
| Option | Complexity | Evidence |
|---|---|---|
| Read `.md` files via GitHub Contents API | Low — no DB needed | All 1,316 files accessible if repo stays public/accessible |
| Parse + store in PostgreSQL | High — ETL required | `DATABASE_URL` env var already present |
| Standup JSON as future input format | Medium — needs form/submission system | `standup/ADS.json` schema maps cleanly to a DB table |

---

## 8. EOD Business Logic

**Business question this EOD report answers:**

> "What did each digital marketing team member accomplish today, how much time did they spend, did they meet their Definition of Done, what failed, and what is their weekly performance score?"

**Evidenced from the repository:**

| Business Logic | Evidence | Location |
|---|---|---|
| Per-member daily task log | 1,316 `.md` files dated by working day | `eods/` |
| Two teams tracked: ADS and SEO | `standup/ADS.json`, `standup/SEO.json` | `standup/` |
| 17 staff members | `eods/` subdirectory listing | `eods/` |
| Task completion: Yes/No/Missed | `completed` field, Diagnostic Reflection section | Both standup JSON and EOD markdown |
| Time allocation per task | "Time: X Hours" inline in each task | `eods/Hetheesha/2026-08-06.md` |
| Definition of Done Met: Yes/No | Explicit field in each task | `eods/Hetheesha/2026-08-06.md` |
| Weekly score 0–100, RAG status | Section E of weekly summary | `summary/2026-07-03/Hetheesha.md` |
| Blocker tracking | `blocker` field in standup JSON | `standup/ADS.json` |
| Date range | 2026-03-30 → 2026-08-06 (active) | `find eods -name "*.md" | sort` |

---

## 9. UI Components

**eod-reports has no UI.** All components must be built from scratch, reusing Staff-requirements-02 patterns.

### Required UI components for the new EOD page:

| Component | Purpose | Pattern Source |
|---|---|---|
| Member selector / filter | Show all 17 members or filter by name/team | `index.html` member cards + search |
| Date picker | Select date to view EOD (`?date=YYYY-MM-DD`) | `api/sonya/daily-orders.js` convention |
| Team filter (ADS / SEO / All) | Filter by team | New — no existing pattern |
| EOD content panel | Render the markdown EOD body | New — markdown → HTML render |
| Weekly summary card | Show weekly score + RAG badge | `--good`/`--warn`/`--fail` CSS tokens |
| Completion status badge | Yes / No / Missed | Existing CSS `.tag.r`, `.status.live` etc. |
| Navigation card in index | Link to new EOD page | Copy existing `.row` card pattern |

---

## 10. Vercel Architecture

| Area | Existing Setup | EOD Requirement | Compatible? | Evidence |
|---|---|---|---|---|
| Function routing | `api/**/*.js` → auto-routed | New `api/eod/dashboard.js` | YES | `vercel.json` glob |
| Max duration | 60s | Sufficient for GitHub API or file reads | YES | `vercel.json` |
| Static pages | `/pages/*.html` | `pages/eod.html` | YES | All existing pages |
| Env vars | `DATABASE_URL` set | Same var if DB approach chosen | YES | All API files |
| Route conflicts | No `/api/eod/` exists | Clean namespace | YES | Full API listing |
| Build step | None | None needed | YES | `package.json` |
| Germany sub-dashboard | Own `vercel.json` in subdirectory | Not relevant | N/A | germany-sales-decline-dashboard/ |

**Assessment: Fully compatible. No Vercel configuration changes needed.**

---

## 11. Existing Assets Found

### EOD/Daily Report search in Staff-requirements-02:

| Search Term | Match | Notes |
|---|---|---|
| `eod` | None (purposeful) | seo_desc abbreviation only |
| `end of day` | None | — |
| `daily report` | None | — |
| `daily summary` | None | — |
| `daily orders` | `api/sonya/daily-orders.js`, `pages/sonya.html` | **AMBER — closest existing asset** |
| `staff report` | None | — |
| Completion status | Multiple pages | CSS tokens `--good`, `--warn`, `--fail` |

**Conclusion:** No dedicated EOD Reports page exists. Zero conflict on the target side.

---

## 12. Reusable Assets

| Asset | Classification | Reason |
|---|---|---|
| DB connection pattern (`new Client({ connectionString: process.env.DATABASE_URL })`) | **REUSE** | Consistent across all 10 API files; copy verbatim |
| `api/sonya/daily-orders.js` date logic | **ADAPT** | Same `?date=YYYY-MM-DD` default-to-yesterday pattern; EOD page should follow same convention |
| Tab/panel HTML structure | **REUSE** | Standard pattern across all staff pages |
| CSS design tokens (`--good`, `--warn`, `--fail`, `--navy`, `--gold`) | **REUSE** | Same `:root` set across all pages |
| Masthead/header HTML | **REUSE** | Copy from any existing staff page |
| CSV export pattern | **REUSE** | `pages/sonya.html` ~line 13012 |
| `vercel.json` function config | **REUSE** | `api/**/*.js` glob already covers new API — no change |
| `.row` card in `index.html` | **REUSE** | Add new EOD card matching existing pattern |
| Standup JSON schema | **ADAPT** | Fields (`member`, `team`, `date`, `completed`, `blocker`, `task_type`) map well to a PostgreSQL table if DB approach chosen |
| EOD markdown section structure | **ADAPT** | 9 consistent sections across SEO/ADS can be parsed into a display template |
| Weekly summary score/RAG | **ADAPT** | Section E score + Red/Amber/Green maps to existing CSS status badges |
| `eod_format.xlsx` | **DO NOT REUSE** | Binary Excel template — not web-consumable |
| `standup/ADS.json` + `SEO.json` | **DO NOT REUSE directly** | Only 5 sample records each; mostly empty fields; treat as schema reference only |

---

## 13. Duplicate-Risk Assessment

| New Asset | Existing Asset | Overlap | Risk | Recommendation |
|---|---|---|---|---|
| `pages/eod.html` | None | None | GREEN | Safe to create |
| `api/eod/dashboard.js` | `api/sonya/daily-orders.js` | Both deal with daily data; different purpose entirely | GREEN | Daily-orders = order DB query; EOD = staff markdown/standup data. No conflict. |
| GitHub API calls for markdown | No existing GitHub API calls in Staff-requirements-02 | None | GREEN | New capability; no conflict |
| EOD member cards in `index.html` | Existing 8 member cards | Style conflict possible | AMBER | Match existing card HTML pattern exactly; consider new section heading |
| Weekly score badge | `api/sonya/dashboard.js` ROAS status badges | CSS token reuse, not logic | GREEN | Different domain; same CSS tokens reused safely |
| Team filter (ADS/SEO) | No existing team filter | None | GREEN | New component |

---

## 14. Proposed Page Location

*GPT must confirm before implementation.*

| Asset | Proposed Location | Rationale |
|---|---|---|
| Page | `pages/eod.html` | Consistent with `pages/{name}.html` pattern |
| API — GitHub approach | `api/eod/reader.js` | Reads markdown via GitHub Contents API |
| API — DB approach | `api/eod/dashboard.js` | Queries PostgreSQL standup table |
| Navigation card | `index.html` — new section or top of existing grid | Prominent placement; this is a management/overview tool |
| Docs | `docs/dashboard-eod.md` | Consistent with existing docs |
| Evidence | `evidence/eod-reports-discovery.md` | This file |

---

## 15. Proposed Data Flow

### Option A — GitHub API approach (recommended for fastest build; no DB schema changes)
```
eod-reports GitHub repo
  eods/{Member}/YYYY-MM-DD.md
          ↓
  GitHub Contents API
  (api/eod/reader.js → fetch via GITHUB_TOKEN env var)
          ↓
  Parse markdown → extract sections
          ↓
  JSON response to pages/eod.html
          ↓
  Render: member selector, date picker, EOD sections panel
```

### Option B — PostgreSQL approach (better long-term; requires DB table + ETL)
```
standup JSON schema
  → New table: eod.standup_submissions
          ↓
  api/eod/dashboard.js
  → SELECT * FROM eod.standup_submissions WHERE member=$1 AND date=$2
          ↓
  JSON → pages/eod.html
```

### Option C — Hybrid (recommended for full feature set)
- GitHub API for raw EOD markdown display
- PostgreSQL for standup structured data, scores, completion tracking
- Both queried by `api/eod/dashboard.js` handler

**GPT to decide which option to build.**

---

## 16. Security / Environment Variable Notes

| Variable | Status | Action Required |
|---|---|---|
| `DATABASE_URL` | Already in Vercel project | None if DB approach used |
| `GITHUB_TOKEN` | Not currently in Staff-requirements-02 | **NEW** — required if GitHub API approach chosen |
| eod-reports env vars | None — repo has no web app | N/A |

No secrets were exposed during this discovery. The credential manager token seen during git authentication was not captured or stored.

---

## 17. Unknowns / Evidence Gaps

| Unknown | Impact | Resolution |
|---|---|---|
| `eod_format.xlsx` content | Low — it's the EOD submission form template; not needed for web display | Open in Excel if needed |
| Standup JSON: only 5 records each | Medium — real standup data may be in a database not yet identified | Check if a standup submission system exists separately |
| GitHub API rate limits | Low — 60 req/hr unauthenticated, 5000/hr with token | Use `GITHUB_TOKEN` env var |
| Whether `summary/` weekly reports continue past 2026-07-03 | Low | The folder stops at 2026-07-03 but EODs go to 2026-08-06; summaries may be generated elsewhere |
| Whether Thishoban (20 files) and Thanishtika (35 files) are still active | Low | File count suggests recent joiners or departures |

---

## 18. Recommended Next Step

**Return to GPT for implementation decision on three questions:**

1. **Data source choice:** GitHub API (Option A) vs PostgreSQL (Option B) vs Hybrid (Option C)?
2. **Scope:** All 17 members, or a subset? All dates or just recent?
3. **Key features:** Date picker + member selector confirmed; weekly score display confirmed; does GPT want a submission form (replacing the .md commit workflow)?

Once GPT confirms, implementation can begin immediately. No blockers remain.

---

## 19. Pass/Fail

| Criterion | Status | Evidence |
|---|---|---|
| Both repositories inspected | PASS | Staff-requirements-02 full scan + eod-reports clone successful |
| Existing Staff-requirements assets searched | PASS | Full grep search performed; no EOD duplicates found |
| EOD data flow evidenced | PASS | Markdown structure, standup JSON schema, weekly summary format all documented |
| Existing APIs/data sources identified | PASS | 10 API files, 6 DB schemas, 5 env var names documented |
| Duplicate risk classified | PASS | All new assets assessed; no RED risks found |
| Reusable assets identified | PASS | 10 reusable assets classified |
| Vercel compatibility assessed | PASS | Fully compatible; no config changes needed |
| Proposed page location documented | PASS | `pages/eod.html`, `api/eod/`, index card |
| Discovery report saved | PASS | This file |
| No implementation performed | PASS | Confirmed |

**Overall: PASS**
