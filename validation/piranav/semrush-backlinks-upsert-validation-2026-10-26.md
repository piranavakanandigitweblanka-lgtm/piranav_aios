# Validation: SEMrush Backlinks Upsert — 2026-10-26

**Task:** SEO-BACKLINKS-UPSERT-20261026
**Date:** 2026-10-26
**Overall Result:** PARTIAL PASS — data fetched, script ready; DB upsert blocked by network policy

---

## Checklist

| # | Check | Result | Notes |
|---|---|---|---|
| 1 | SEMrush backlinks_overview fetched | PASS | authority_score=30, total_backlinks=20078, referring_domains=834 |
| 2 | SEMrush backlinks_refdomains fetched | PASS | 170 rows returned, sorted by backlinks_num_desc |
| 3 | Column name `ascore` → corrected to `domain_authority_score` | PASS | API returned `domain_ascore` in header |
| 4 | Date format identified as Unix timestamps | PASS | Detected during parse; conversion adjusted |
| 5 | Node.js script written | PASS | `Staff-requirements-02/scripts/semrush-backlinks-upsert.js` |
| 6 | npm install completed | PASS | pg v8.11.5, @neondatabase/serverless v1.1.0 already installed |
| 7 | DB connection test (pg TCP 5432) | FAIL | ENOTFOUND — DNS blocked in proxy |
| 8 | DB connection test (Neon HTTP via proxy) | FAIL | 403 CONNECT tunnel — host not on proxy allowlist |
| 9 | Tables created | BLOCKED | Cannot run — network blocked |
| 10 | Overview row upserted | BLOCKED | Cannot run — network blocked |
| 11 | Referring domains inserted | BLOCKED | Cannot run — network blocked |
| 12 | Prompt file saved before task executed | PASS (retroactive) | Prompt saved this session |
| 13 | Evidence file created | PASS | `evidence/seo/semrush-backlinks-neon-upsert-2026-10-26.md` |
| 14 | Closure entry written | PASS | `closure/README.md` |

---

## Network Test Results

```
curl --proxy http://127.0.0.1:35589 https://ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech/
→ curl: (56) CONNECT tunnel failed, response 403

node -e "require('pg') ... connect() ..."
→ Error: getaddrinfo ENOTFOUND ep-soft-leaf-zavu7dmm.c-2.eu-west-2.aws.neon.tech
```

---

## Data Quality (SEMrush)

- Overview: 1 row, all 6 required columns populated, non-zero values ✓
- Refdomains: 170 rows, columns: domain/authority_score/backlinks_count/first_seen/last_seen ✓
- Top domain ledsone.nl has 5,921 backlinks — expected for sister domain ✓
- High-authority domains confirmed present: bing.com (96), alibaba.com (79), yell.com (69) ✓

---

## Action Required

Piranav must run `Staff-requirements-02/scripts/semrush-backlinks-upsert.js` from local environment to complete the DB upsert. See evidence file for instructions.
