# Capability: SEO Keyword Gap Tracker (ledsone.co.uk)

**Created:** 2026-09-21
**Status:** ACTIVE
**Category:** SEO Intelligence

---

## What It Does

Automatically identifies keywords where ledsone.co.uk's competitors rank in positions 1–10 but ledsone.co.uk either does not rank or ranks worse than position 20. Calculates an opportunity score per keyword and stores results in Neon DB for weekly trend tracking.

---

## Where It Lives

| Component | Path |
|---|---|
| DB-write script | `Staff-requirements-02/scripts/seo-keyword-gap-refresh.js` |
| Offline export script | `Staff-requirements-02/scripts/seo-gap-export-only.js` |
| Output data | `Staff-requirements-02/data/seo-keyword-gap-YYYY-MM-DD.json` |
| Neon table | `semrush_keyword_gap` |

---

## Neon Table Schema

```sql
CREATE TABLE semrush_keyword_gap (
  id SERIAL PRIMARY KEY,
  keyword TEXT NOT NULL,
  competitor_domain TEXT NOT NULL,
  competitor_position INT,
  volume INT,
  competitor_traffic INT,
  competitor_url TEXT,
  keyword_difficulty NUMERIC,
  intent TEXT,
  ledsone_position INT,
  opportunity_score NUMERIC,
  snapshot_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(keyword, competitor_domain)
)
```

---

## Competitors Tracked

1. ledhut.co.uk
2. lightingcompany.co.uk
3. industville.co.uk

---

## How to Run (locally)

```bash
cd piranav_aios/Staff-requirements-02
npm install
node scripts/seo-keyword-gap-refresh.js
```

The script contains the latest SEMrush data inline and handles the DB upsert.

---

## How to Reuse

- Add a new competitor: add a new CSV block and entry in the `competitorData` array in the script
- Change date: update snapshot handled by `CURRENT_DATE` in the query
- Export only (no DB): run `seo-gap-export-only.js` — outputs JSON to `data/`

---

## Data Freshness

- Scheduled weekly via Claude Code remote session
- SEMrush data collected on run date; inline in script for the current week
- DB write requires local run (remote sessions blocked by egress policy on Neon port 5432/443)

---

## Opportunity Score Formula

`opportunity_score = search_volume × (10 / competitor_position)`

Higher score = higher volume keyword where competitor ranks near the top.
