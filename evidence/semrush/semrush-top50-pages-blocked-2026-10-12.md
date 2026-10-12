# Evidence — SEMrush Top 50 Organic Pages Fetch BLOCKED
## Date: 2026-10-12
## Session: Scheduled daily SEO pages agent

---

## Task
Fetch top 50 organic pages for ledsone.co.uk from SEMrush and upsert into Neon PostgreSQL.

- **Report:** resource_organic_unique
- **Target:** ledsone.co.uk
- **Database:** uk
- **Columns:** url, traffic, keywords_count, traffic_share
- **Sort:** traffic_desc, limit 50
- **Neon table:** semrush_pages
- **Neon DB:** ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb

---

## Result: BLOCKED — SEMrush API Units Exhausted

### Error Details
- **Tool called:** `mcp__Semrush__execute_report` (report: `resource_organic_unique`, target: `ledsone.co.uk`)
- **Error code:** `no_api_units`
- **Message:** "The user has an active Semrush subscription, but does not have enough API units to complete this request."
- **Retryable:** false — do not retry until more API units are added
- **Resolution URL:** https://www.semrush.com/mcp-access
- **Trace ID:** b93a1439c51728151272eeb1496f9037

### Note
This is the second consecutive blocked run. Previous block: 2026-10-05 (SEO keyword gap agent).
API units appear to be depleted and have not been replenished since at least 2026-10-05.

### Steps Completed
- [x] Git status checked — clean
- [x] SEMrush execute_report tool loaded
- [ ] STEP 1 — resource_organic_unique fetch — BLOCKED (API units exhausted)
- [ ] STEP 2 — Node.js upsert script — NOT RUN
- [ ] Neon DB — no rows inserted or updated this session

### No changes made to Neon DB
semrush_pages table: no rows inserted or updated. Previous data remains intact.

---

## Required Action (Piranav)
1. Visit https://www.semrush.com/mcp-access to add API units to the Semrush account.
2. Once units are replenished, the scheduled task will run automatically — no code changes needed.
3. This is the **second consecutive block** — units have not been topped up since at least 2026-10-05.
