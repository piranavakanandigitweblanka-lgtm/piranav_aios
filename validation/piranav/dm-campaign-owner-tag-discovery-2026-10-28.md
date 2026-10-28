---
name: dm-campaign-owner-tag-discovery-validation-2026-10-28
description: Validation checklist for the DM Campaign owner tag discovery. Live DB queries, read-only. Produces frequency table and candidate owner tag lists.
metadata:
  type: validation
---

# Validation: DM Campaign — Owner Tag Discovery

**Date:** 2026-10-28
**Type:** Live DB query session (read-only)

| Check | Result | Evidence |
|---|---|---|
| Campaign IDs verified before querying | PASS | `20810136438` (PMax), `24199938236` (Shopping) — confirmed in prior audit |
| Tag join chain verified before this session | PASS | Confirmed live in prior session: `shopify_listings.id` → `shopify_listing_tag.product_id` |
| Coverage query executed and returned | PASS | 5,124 total → 4,774 matched → 4,772 with tags |
| Tag frequency table returned (top 80) | PASS | Query returned 80 rows ordered by product count |
| Coverage check query returned | PASS | `has_tags=4772`, `parent_found_but_no_tags=2` |
| Conflict rate query returned | PASS | `sonya_only=2332`, `sj_only=927`, `conflict_both=730`, `neither=783` |
| Leading space data quality issue identified | PASS | Tags include ` Sonya`, ` SJ` — strip() required |
| `_classify_owner()` bug identified | PASS | Feasibility audit uses `t.lower()` — must be `t.strip().lower()` |
| Candidate tag list compiled — Sonya | PASS | 6 direct-name tags + 3 AGU-cluster tags documented |
| Candidate tag list compiled — Sajeepan | PASS | 6 SJ-prefixed tags documented |
| Other staff tag families identified | PASS | Sixnyne Collective, Thisoban/Thiso, Thilakshi, Kamsi, Ani, Anu, Bakee documented |
| Candidate lists correctly labelled CANDIDATE not CONFIRMED | PASS | All tags marked CANDIDATE in evidence |
| 8 questions for Piranav compiled | PASS | Q1–Q8 in evidence Section 9 |
| No ownership assigned without Piranav confirmation | PASS | Evidence states "CANDIDATE only" throughout |
| No source code modified | PASS | Read-only query session |
| No DB writes performed | PASS | SELECT queries only |
| No credentials or env-var values printed | PASS | Connection strings not exposed |
| Evidence file created | PASS | `evidence/piranav/dm-campaign-owner-tag-discovery-2026-10-28.md` |
| Prompt file saved | PASS | `prompts/discovery/dm-campaign-owner-tag-discovery.md` |

## Status: PASS — Discovery complete. Candidate tag lists ready for Piranav confirmation. Implementation BLOCKED until Q1–Q8 answered.
