# Prompt: SEMrush Organic Pages Upsert — semrush_pages

## Use Case
Scheduled SEO data agent — fetch the top N organic pages for a domain from SEMrush and upsert them into a Neon PostgreSQL database for tracking over time.

## Trigger Condition
Run on a scheduled basis (weekly or as configured). Fires automatically via Claude Code scheduled task.

## What to Build
1. Fetch top 50 organic pages for a given domain from SEMrush using `execute_report` with report `resource_organic_unique`.
2. Parse the semicolon-delimited CSV response (skip header row).
3. Classify each URL by page_type: homepage, blog, collection, product, or other.
4. Upsert rows into Neon PostgreSQL `semrush_pages` table with snapshot_date + page_url as primary key.

## Files Involved
- `Staff-requirements-02/` — Node.js project with `pg` dependency
- `Staff-requirements-02/scripts/semrush-pages-upsert.js` — script written and run per session
- Neon DB table: `semrush_pages`

## SEMrush Parameters
```json
{
  "report": "resource_organic_unique",
  "params": {
    "target": "ledsone.co.uk",
    "database": "uk",
    "export_columns": ["url", "traffic", "keywords_count", "traffic_share"],
    "display_sort": "traffic_desc",
    "display_limit": 50
  }
}
```

## Database Schema
```sql
CREATE TABLE IF NOT EXISTS semrush_pages (
  snapshot_date DATE NOT NULL,
  page_url TEXT NOT NULL,
  traffic INT,
  keywords_count INT,
  traffic_share NUMERIC,
  page_type TEXT,
  PRIMARY KEY (snapshot_date, page_url)
);
```

## URL Classification Logic
- `url === 'https://ledsone.co.uk/'` → `homepage`
- `url.includes('/blogs/')` → `blog`
- `url.includes('/collections/')` → `collection`
- `url.includes('/products/')` → `product`
- else → `other`

## Technical Constraints
- Use `pg` from `./node_modules/pg` (local require path)
- SSL: `{ rejectUnauthorized: false }` for Neon
- Upsert: `ON CONFLICT (snapshot_date, page_url) DO UPDATE SET ...`
- Parse traffic_share as NUMERIC (remove trailing spaces/percent if present)
- Log count of upserted rows
- Exit with code 1 on any error

## Expected Output
```
[semrush-pages] Upserting 50 rows for snapshot 2026-09-21...
[semrush-pages] Done — 50 rows upserted.
```

## Reuse Notes
- Change `target` and `database` params to run for other domains (ledsone.fr, electricalsone.co.uk)
- Adjust `display_limit` for more/fewer pages
- The table supports multiple domains if page_url is unique across domains per snapshot_date

## Registered
2026-09-21 — first version. Unblocked after SEMrush API units refreshed (previously blocked 2026-09-14).
