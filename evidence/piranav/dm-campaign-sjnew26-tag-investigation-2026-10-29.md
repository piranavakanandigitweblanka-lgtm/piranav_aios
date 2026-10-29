---
name: dm-campaign-sjnew26-tag-investigation-2026-10-29
description: Investigation of whether SJNEW26 belongs to Sajeepan. Verdict was INCONCLUSIVE. Piranav confirmed 2026-10-29 — SJNEW26 is Sajeepan's 2026 new product batch tag. sjnew26 added to SAJEEPAN_TAGS. 86/86 tests PASS.
metadata:
  type: evidence
---

# Evidence: DM Campaign — SJNEW26 Tag Ownership Investigation

**Date:** 2026-10-29
**Requirement ID:** AIOS-2026-10-29-002 (investigation) → AIOS-2026-10-29-003 (implementation)
**Type:** Investigation (read-only) + Implementation (Piranav-approved)

---

## ⚑ BUSINESS DECISION — 2026-10-29

| Field | Value |
|---|---|
| Decision | **APPROVED** |
| Approver | Piranav |
| Tag | `SJNEW26` (normalised: `sjnew26`) |
| Owner | Sajeepan |
| Reason | SJNEW26 is Sajeepan's tag for the new 2026 product batch |
| Action | `"sjnew26"` added to `SAJEEPAN_TAGS` in `dm_campaign.py` |
| Tests | 86/86 PASS (12 new SJNEW26 regression tests added) |
| Commit | Uncommitted — in working tree for Piranav review |

---
**DB source:** `listings.shopify_listing_tag` via MCP `mcp__ledsone-db-mcp__execute_sql_ledsone`

---

## 1. Investigation Scope

**Question:** Should `sjnew26` be added to `SAJEEPAN_TAGS` in `dm_campaign.py`?

**Starting point:** Product `shopify_gb_15388397830530_56874289561986` (SKU: ENC10233) showed
Owner = `No Tag` because its tag ` SJNEW26` (normalised: `sjnew26`) is absent from both
`SONYA_TAGS` and `SAJEEPAN_TAGS`.

---

## 2. Approved Tag Dictionary (current, as at 2026-10-29)

### SAJEEPAN_TAGS (8 approved tags)
```python
SAJEEPAN_TAGS = frozenset({
    "sj", "sjrat", "sj_c", "sjk", "sj_t_ads", "old sj na",
    "sajeepan", "sajjepan",
})
```
Approved by Piranav 2026-10-28. Source: `dm_campaign.py` lines 66–69 + implementation-plan evidence.

### SONYA_TAGS (7 approved tags)
```python
SONYA_TAGS = frozenset({
    "agu", "agu46-2", "agu 46-2", "agu2026",
    "dracarys", "dracarys vermax", "sonyam&a",
})
```

`SJNEW26` is in **neither set**.

---

## 3. Live DB Queries — Results Summary

### Q1 — SJNEW26 prevalence

| Raw tag | Normalised | Active products | Deleted rows |
|---|---|---|---|
| ` SJNEW26` | `sjnew26` | **49** | 0 |

Single raw form only (leading space, uppercase). All 49 rows active.

---

### Q2 — SJNEW26 products with ANY approved Sajeepan tag

| SJNEW26 total | Also has approved SJ tag | SJNEW26 only (no approved SJ tag) |
|---|---|---|
| 49 | **0** | **49** |

**Critical finding: Not one of the 49 SJNEW26 products carries a confirmed approved Sajeepan tag.**

---

### Q3 — All tags co-occurring on SJNEW26 products (top 30)

| Tag (trimmed) | Products | % | Notes |
|---|---|---|---|
| `2026New` | 49 | 100% | Year batch — new products listed in 2026 |
| `SJNEW26` | 49 | 100% | The tag under investigation |
| `LMS` | 26 | 53% | Unknown — possibly listing/marketing code |
| `SEPCL26` | 14 | 29% | Batch code — see Q7 |
| `hasif` | 11 | 22% | Unknown code |
| `PVC Conduit` | 7 | 14% | Product category |
| `Electrician UK1` | 5 | 10% | Market segment |
| `Pendant Lights` | 5 | 10% | Product category |
| `Bulbs new` | 4 | 8% | Product category |
| `Thiva` | 1 | 2% | Staff name? |

**No approved Sajeepan or Sonya tag appears anywhere in this list.**

---

### Q4 — Conflict check: SJNEW26 products with Sonya tags

| SJNEW26 products also carrying a Sonya tag |
|---|
| **1** (`Agu46-2` — a single product) |

1 product has both `SJNEW26` and `Agu46-2` (SONYA). This would produce a `Conflict` classification if `sjnew26` were added to `SAJEEPAN_TAGS`.

---

### Q5+Q6 — `SJNEW` (without year suffix): naming-pattern corroboration

| Tag | Total products | Products also with approved SJ tag |
|---|---|---|
| `SJNEW` | 30 | **30 (100%)** |
| `SJNEW26` | 49 | **0 (0%)** |
| Product overlap between SJNEW and SJNEW26 | **0** | — distinct product sets |

**Key finding:** `SJNEW` (no year) is confirmed as a Sajeepan batch tag — every one of its 30 products has an approved SJ tag. `SJNEW26` follows the same naming structure (SJ + NEW + year) and is a distinct product set, but has **zero** approved SJ co-occurrence.

---

### Q7 — `SEPCL26` (co-occurs on 14 SJNEW26 products) — ownership check

| Approved SJ tag on SEPCL26 products | Products |
|---|---|
| `SJ` | 13 |
| `SJRAT` | 7 |

`SEPCL26` is confirmed as a Sajeepan batch tag (13/14 of its products carry `SJ` or `SJRAT`).
**BUT:** the 14 SJNEW26 products that also carry SEPCL26 do NOT themselves have any approved SJ tag (Q8 = 0).

This means: SEPCL26 appears on a large set of Sajeepan products (confirmed), a subset of which also have SJNEW26. However, the SJNEW26+SEPCL26 intersection products still lack a direct approved SJ tag — the co-occurrence is one step removed.

---

## 4. Evidence Chain — For and Against

### Evidence SUPPORTING `sjnew26 = Sajeepan`

| Evidence | Strength |
|---|---|
| Tag starts with `SJ` — Sajeepan's confirmed initials prefix | WEAK — naming similarity, not ownership proof |
| `SJNEW` (no year) = confirmed Sajeepan, 100% co-occurrence | MODERATE — same naming pattern, year suffix convention |
| `SEPCL26` co-occurs on 14/49 SJNEW26 products; SEPCL26 = confirmed Sajeepan | MODERATE — indirect corroboration via batch proximity |
| `2026New` on all 49 products = new 2026 listings; consistent with a new-product batch for a staff member | WEAK — circumstantial |
| No other staff's known tags appear on these products | WEAK — absence of evidence |

### Evidence AGAINST or UNDERMINING

| Evidence | Weight |
|---|---|
| **Zero** of 49 SJNEW26 products carry any approved Sajeepan tag | HIGH — strongest counterpoint |
| `SJNEW` (confirmed Sajeepan) has 0 product overlap with SJNEW26 — they are distinct sets | MODERATE — breaks the chain |
| SJNEW26+SEPCL26 intersection: still 0 approved SJ tags even with double-batch context | MODERATE |
| 1 SJNEW26 product has a Sonya tag (`Agu46-2`) — would create a Conflict if added | LOW — likely tagging error; 1 out of 49 |
| No AIOS documentation, no Piranav statement, and no system record confirms `SJNEW26` → Sajeepan | HIGH — process requirement |

---

## 5. Verdict

> **INCONCLUSIVE — Manual confirmation from Piranav required before adding to `SAJEEPAN_TAGS`.**

The naming-pattern evidence (`SJNEW` = confirmed Sajeepan, `SJNEW26` = same pattern + year) is the strongest inference available from the DB. But inference from naming is explicitly prohibited by the owner-classification design rules: the system uses **exact frozenset membership**, not prefix matching, precisely to prevent unconfirmed tags from silently entering classification.

The absence of any approved SJ tag on any of the 49 SJNEW26 products is an unresolved anomaly. Two possible explanations:
- **Scenario A (likely):** Sajeepan created a 2026 new-product batch and applied only `SJNEW26` as the batch code, without adding the base `SJ` tag. The omission is a data-entry gap, not evidence of a different owner.
- **Scenario B (possible):** `SJNEW26` belongs to a different staff member whose initial naming coincidentally overlaps with Sajeepan's prefix. The DB cannot distinguish this from Scenario A.

Only Piranav can confirm which scenario applies.

---

## 6. Recommendation

**Do NOT add `sjnew26` to `SAJEEPAN_TAGS` until Piranav explicitly confirms ownership.**

**Specific question for Piranav:**
> "Is `SJNEW26` your tag for Sajeepan's new 2026 product batch? There are 49 products tagged only with `SJNEW26` (plus category and batch codes). None of them have the base `SJ` tag. If confirmed as Sajeepan, we add `sjnew26` to `SAJEEPAN_TAGS` — those 49 products will then show `Sajeepan` instead of `No Tag`."

**If confirmed:** Add `"sjnew26"` to `SAJEEPAN_TAGS` in `dm_campaign.py` line ~67. Run tests. Commit to `piranv-work`.

**If rejected:** Document as a non-owner batch code. No code change needed.

---

## 7. Files Inspected (Read-Only)

| File | Purpose |
|---|---|
| `backend/app/dashboard_pages/dm_campaign.py` lines 59–69 | Current SONYA_TAGS and SAJEEPAN_TAGS |
| `evidence/piranav/dm-campaign-single-product-notag-unknown-ENC10233-2026-10-28.md` | Prior ENC10233 investigation |
| `evidence/piranav/dm-campaign-owner-tag-discovery-2026-10-28.md` | Original tag frequency table |
| `evidence/piranav/dm-campaign-owner-tag-implementation-plan-2026-10-28.md` | Approved tag dictionary |
| `closure/piranav/sajeepan-ai-assistant-2026-08-21.md` | Sajeepan staff identity confirmed |
| `listings.shopify_listing_tag` (live DB, Q1–Q9) | Tag prevalence, co-occurrence, conflict |

**No application code, configuration, database records, or Shopify data were modified.**
