# Evidence: SEMrush Backlinks Neon Upsert — 2026-11-02

**Date:** 2026-11-02
**Session type:** Scheduled automated run
**Domain:** ledsone.co.uk
**Target tables:** semrush_backlinks, semrush_refdomains (Neon DB)
**Status:** FAILED — SEMrush API no_api_units

---

## What Ran

Scheduled pipeline triggered at session start. Steps attempted:

1. **Session protocol** — `closure/README.md` read, `git status` checked (clean). PASS.
2. **PROMPT_REGISTER check** — existing prompt found at `prompts/seo/semrush-backlinks-neon-upsert-prompt.md`. No duplicate created. PASS.
3. **Step 1 — SEMrush backlinks_research (discovery call)** — FAILED.

---

## Failure Detail

**Tool called:** `mcp__Semrush__backlinks_research`
**Error code:** `no_api_units`
**Error message:** "The user has an active Semrush subscription, but does not have enough API units to complete this request."
**Retryable:** false
**Trace ID:** `7e1198f776c05812091234533a22b276`
**SEMrush resolution URL:** https://www.semrush.com/mcp-access

---

## Steps NOT Reached

- Step 2 — backlinks_refdomains fetch (not attempted — no API units)
- Step 3 — Node.js upsert script (not attempted — no data)

---

## Action Required

Piranav must top up SEMrush API units at: https://www.semrush.com/mcp-access

Once units are available, the scheduled pipeline will retry automatically on the next run.

---

## Prior successful run

See `evidence/seo/semrush-backlinks-neon-upsert-2026-10-26.md` for last known successful run details.
