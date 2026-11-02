# Validation: SEMrush Backlinks Neon Upsert — 2026-11-02

**Date:** 2026-11-02
**Run type:** Scheduled automated
**Domain:** ledsone.co.uk

---

## Checklist

| Check | Result |
|---|---|
| Session protocol followed (closure read, git status checked) | PASS |
| PROMPT_REGISTER checked — no duplicate created | PASS |
| SEMrush backlinks_overview fetch | FAIL — no_api_units |
| SEMrush backlinks_refdomains fetch | NOT ATTEMPTED |
| Node.js upsert script run | NOT ATTEMPTED |
| Neon DB rows inserted | NOT ATTEMPTED |
| Evidence file written | PASS |
| Closure entry written | PASS |

---

## Overall Result: FAIL

**Root cause:** SEMrush account has insufficient API units.
**Action required:** Top up API units at https://www.semrush.com/mcp-access
**Retryable:** Yes — once units are added, next scheduled run will succeed without changes.
