# Prompt: Weekly SEMrush Domain Rank Refresh → Neon semrush_history

**Category:** implementation  
**First saved:** 2026-09-28  
**Status:** ACTIVE  
**Runs:** Weekly scheduled (every Sunday)

---

## Purpose

Fetch the latest SEMrush `domain_rank` report for `ledsone.co.uk` (UK database) and upsert the result into the Neon PostgreSQL `semrush_history` table. Updates the current month's row with the freshest data.

---

## What to Build

1. **Fetch from SEMrush MCP** — `domain_rank` report, `database: uk`, `target: ledsone.co.uk`
   - Default columns: rank, organic_keywords, organic_traffic, organic_traffic_cost, paid_keywords, paid_traffic
   - Extended columns: positions_1_3, positions_4_10, positions_11_20, positions_21_30 through 91_100
   - Derive `kw_top21_100` = sum of positions_21_30 + 31_40 + 41_50 + 51_60 + 61_70 + 71_80 + 81_90 + 91_100

2. **Month key** — current month as `YYYY-MM-01` (ISO format)

3. **Upsert into `semrush_history`** — check actual columns first:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'semrush_history' ORDER BY ordinal_position;
   ```
   Then upsert with ON CONFLICT (month) DO UPDATE SET for all available fields.

4. **Verify** — query latest 3 rows after upsert:
   ```sql
   SELECT month, organic_keywords, traffic_est FROM semrush_history ORDER BY month DESC LIMIT 3;
   ```

---

## Files

| File | Purpose |
|---|---|
| `Staff-requirements-02/scripts/semrush-upsert.js` | Main upsert script — update ROWS[0] with latest data each week |
| `evidence/piranav/semrush-domain-rank-refresh-YYYY-MM-DD.md` | Evidence file per run |
| `validation/piranav/semrush-refresh-validation-YYYY-MM-DD.md` | Validation checklist per run |

---

## Key Technical Constraints

- Use `require('../node_modules/pg')` — pg module is in Staff-requirements-02/node_modules/
- Connection string is `NEON_DATABASE_URL` environment variable
- SSL must be `{ rejectUnauthorized: false }`
- Run from `Staff-requirements-02/` directory: `node scripts/semrush-upsert.js`
- NEON_DATABASE_URL is a Vercel env variable — not available in remote Claude Code container
- Neon host `ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech` is blocked by remote container egress policy

---

## Known Blocker (Persistent)

**Neon DB is unreachable from remote Claude Code sessions** (4th occurrence as of 2026-09-28).

To fix permanently: add `*.neon.tech` to egress allowlist at https://code.claude.com → Environments → [environment name] → Network settings.

Until fixed: Piranav runs the script locally after each scheduled fetch:
```bash
cd piranav_aios/Staff-requirements-02
NEON_DATABASE_URL="postgresql://neondb_owner:<pass>@ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/neondb?sslmode=require" node scripts/semrush-upsert.js
```

---

## Expected Output (sample 2026-09-28)

| month | rank | organic_keywords | traffic_est | traffic_cost_gbp | paid_keywords | paid_traffic |
|---|---|---|---|---|---|---|
| 2026-09-01 | 48334 | 10252 | 10249 | 5111 | 0 | 0 |
| 2026-08-01 | 49162 | 11062 | 9932 | 4181 | 11 | 110 |
