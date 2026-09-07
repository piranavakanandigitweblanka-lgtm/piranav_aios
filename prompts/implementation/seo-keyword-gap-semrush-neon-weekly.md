# Prompt: Weekly SEO Keyword Gap Refresh — SEMrush → Neon DB

**Pattern name:** `seo-keyword-gap-semrush-neon-weekly`  
**Category:** implementation  
**First used:** 2026-09-07  
**Domain:** ledsone.co.uk  
**Schedule:** Weekly automated (Claude Code scheduled task)

---

## Purpose

Fetch organic keyword rankings from SEMrush for ledsone.co.uk and 3 competitors, compute keyword gap opportunities, and write results to the `semrush_keyword_gap` table in Neon DB (Staff-requirements-02).

---

## Competitors

1. ledhut.co.uk
2. lightingcompany.co.uk
3. industville.co.uk

---

## Step 1 — Fetch ledsone.co.uk keywords

```
SEMrush execute_report:
  report: resource_organic
  params:
    target: ledsone.co.uk
    database: uk
    display_limit: 200
    display_sort: traffic_desc
    export_columns: [keyword, position, volume, traffic, url, keyword_difficulty, intent]
```

Parse semicolon-delimited result (skip header). Build ledsone keyword map:  
`{ keyword -> { position, volume, traffic, url, kd, intent } }`

---

## Step 2 — Per competitor: fetch + build gap list

For each competitor domain:

```
SEMrush execute_report:
  report: resource_organic
  params:
    target: COMPETITOR_DOMAIN
    database: uk
    display_limit: 100
    display_sort: traffic_desc
    export_columns: [keyword, position, volume, traffic, url, keyword_difficulty, intent]
```

**Gap criteria:** competitor ranks position 1–10 AND ledsone either does not appear OR ranks > 20.  
**Exclude branded terms:** ledhut, led hut, lightingcompany, industville, ledsone  
**Opportunity score:** `volume * (10 / competitor_position)`

---

## Step 3 — Write Node.js script and run it

- cd Staff-requirements-02 in repo, run npm install
- Connect to Neon (ssl: rejectUnauthorized: false)
- Ensure `semrush_keyword_gap` table exists (schema below)
- DELETE existing rows per competitor (full refresh)
- INSERT top 50 gap rows per competitor by opportunity_score DESC
- ON CONFLICT DO UPDATE
- Log per-competitor row counts and top 3 keywords

### Table schema

```sql
CREATE TABLE IF NOT EXISTS semrush_keyword_gap (
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

## Output

Print total rows inserted per competitor and any errors.

---

## Reuse notes

- Swap `target` and competitor list to run for other domains (ledsone.fr, electricalsone.co.uk)
- Adjust `display_limit` and top-N cutoff as needed
- Table is shared; use `competitor_domain` to filter per domain group
