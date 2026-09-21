# Prompt: Daily SEMrush Organic Keyword Snapshot → Neon DB

**Pattern name:** `semrush-organic-snapshot-neon-daily`  
**Category:** implementation  
**First used:** 2026-09-21  
**Domain:** ledsone.co.uk  
**Schedule:** Daily automated (Claude Code scheduled task)

---

## Purpose

Fetch top 100 organic keyword rankings from SEMrush for ledsone.co.uk (UK database, sorted by traffic descending) and upsert each row into the `semrush_keywords` table in Neon DB (Staff-requirements-02) using today's date as the snapshot key.

---

## Step 1 — Fetch from SEMrush

```
SEMrush execute_report:
  report: resource_organic
  params:
    target: ledsone.co.uk
    database: uk
    export_columns: [keyword, position, previous_position, volume, cpc, url, traffic, keyword_difficulty, intent]
    display_sort: traffic_desc
    display_limit: 100
```

Result is semicolon-delimited. Header row: `Keyword;Position;Previous Position;Search Volume;CPC;Url;Traffic;Keyword Difficulty;Intents`. Skip it.

---

## Step 2 — Upsert into Neon DB

Use `@neondatabase/serverless` ESM module (`neon()` HTTP function) from `Staff-requirements-02/node_modules`.

- Connection string: stored in Neon DB config (never hardcode in evidence)
- snapshot_date: `new Date().toISOString().slice(0,10)`
- Table: `semrush_keywords`
- Primary key: `(snapshot_date, keyword)`
- `ON CONFLICT DO UPDATE SET` all columns

### Table schema

```sql
CREATE TABLE IF NOT EXISTS semrush_keywords (
  snapshot_date DATE NOT NULL,
  keyword TEXT NOT NULL,
  position INT,
  prev_position INT,
  volume INT,
  cpc NUMERIC,
  url TEXT,
  traffic INT,
  keyword_difficulty NUMERIC,
  intent TEXT,
  PRIMARY KEY (snapshot_date, keyword)
)
```

---

## Step 3 — Run and log

```bash
cd Staff-requirements-02
npm install
node scripts/semrush-upsert.mjs
```

Expected output: `Upserted N rows for snapshot_date=YYYY-MM-DD`

---

## Network requirement

The `neon()` HTTP function routes through `api.c-2.eu-west-2.aws.neon.tech`. This host must be in the Claude Code environment's **egress allowlist** for the scheduled task to succeed. Add it at: https://code.claude.com → Environments → [environment name] → Network settings.

---

## Reuse notes

- Change `target` to run for ledsone.fr, ledsone.de, electricalsone.co.uk
- Change `database` to `fr`, `de` etc. for other regional databases
- The table accumulates one snapshot per day; query by `snapshot_date` for trend analysis
