# Capability — Muguntha AI Assistant

**Date:** 2026-08-25
**Capability unlocked:** Full management AI for team admin role

---

## What Muguntha's AI Can Do

### Tier 1 — People & Operations
- Report EOD submission status for any of the last 7 days by name
- Cross-reference who has missed EOD multiple days in a row
- Show requirement tracker progress: Hetheesha Req1/Req2, Sajeepan Req4, Jefri Req6

### Tier 2 — Business Health
- Compare UK revenue (today, yesterday, 7d avg, 30d avg) — ledsone.co.uk
- Compare DE revenue (same breakdown) — ledsone.de
- Report 2026 New Listings count (total + active on UK store)

### Tier 3 — Staff Accountability
- Show dead stock count per staff member (products with 0 sales in 30 days)
- Compare staff revenue + order count across: Kamsi, Dilaksi, Sajeepan, Jakshan, Sonya, Mahima

### Conversation
- Multi-turn conversation with session history (resets each day)
- Multi-browser safe — second browser restores from DB, no duplicate AI calls
- NVIDIA Nemotron-3-Ultra-550B-A55B primary, Groq chain fallback

---

## Data Fetched Per Request

~104 parallel I/O calls resolved before each AI call:
- 98 GitHub API calls (14 staff × 7 days)
- 4 AUTH DB queries (4 tracker tables)
- 9 DATABASE_URL queries (UK rev, DE rev, listings, 6 staff ID perf)

---

## Pattern Reuse Potential

The multi-browser `aiLoadBrief` async/await pattern (history-first, bail-out if exists) should be backported to all other staff AI assistants that currently use the parallel `prefetchHistory()` approach. This fixes the same race condition latent in all 11 widgets.
