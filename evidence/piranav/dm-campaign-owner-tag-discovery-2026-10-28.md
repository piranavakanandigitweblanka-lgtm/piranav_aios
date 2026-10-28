---
name: dm-campaign-owner-tag-discovery-2026-10-28
description: Live database discovery of actual Shopify product owner tags across DM campaign products (5,124 products). Produces frequency table, Sonya and Sajeepan candidate tag lists, conflict rate, data quality findings, and questions for Piranav confirmation. Read-only — no implementation.
metadata:
  type: evidence
---

# Evidence: DM Campaign — Owner Tag Discovery

**Date:** 2026-10-28
**Branch / HEAD:** `main` / `8427e22`
**Auditor:** Claude Code (piranav AIOS)
**Scope:** Read-only live DB query — no source files modified, no DB writes
**DB accessed:** Production ledsone DB (DATABASE_URL) via MCP `mcp__ledsone-db__execute_sql_ledsone`

---

## 1. Business Context and Constraints

**Purpose:** Discover the real tag values on DM campaign products to build an authoritative
owner tag dictionary for the Products tab owner classification feature.

**CRITICAL — What this is NOT:**
- Tags listed in this document are CANDIDATES only — not confirmed owner assignments
- Do NOT assign ownership to any product without Piranav explicitly confirming the tag list
- Tag examples given previously (`AGU`, `Agu`, `Sonya`, `SJ`, `Sajeepan`, `Dracarys`) are
  EXAMPLES — this discovery proves whether they exist and how common they are, but cannot
  confirm they are the only valid owner tags

---

## 2. Tag Join Chain Used (verified in prior session)

```
google_ads.product_performance.product_item_id (e.g. shopify_gb_7891234567_42987654321)
  → split_part(product_item_id, '_', 3) = Shopify product ID (PID)
  → listings.shopify_listings WHERE item_id = PID AND sub_source = 104 AND is_parent = 1
  → shopify_listings.id (internal int)
  → listings.shopify_listing_tag WHERE product_id = shopify_listings.id AND sub_source = 104
    AND (is_deleted = 0 OR is_deleted IS NULL)
  → tag (varchar) — TRIM() required: many tags have a leading space
```

---

## 3. Product Coverage

**Query run:** Coverage breakdown across all 5,124 distinct DM product_item_ids

| Metric | Count | % of Total |
|---|---|---|
| Total distinct product_item_ids | 5,124 | 100% |
| Has parent listing (matched to shopify_listings) | 4,774 | 93.2% |
| No parent listing (delisted / not UK-sourced) | 350 | 6.8% |
| Has ≥1 tag (among matched products) | 4,772 | 93.1% of total / 99.96% of matched |
| Parent found but zero tags | 2 | ~0% |

**Finding:** Coverage is excellent. 99.96% of products that have a parent listing also have tags.
The only meaningful unresolvable population is the 350 (6.8%) with no parent listing — these
will always return `No Tag` regardless of the tag dictionary.

---

## 4. Tag Frequency Table — Top Results

**Query:** `GROUP BY tag ORDER BY COUNT(DISTINCT product_id) DESC LIMIT 80`
**Note:** All tag values are shown as stored — many have a leading space.

### 4a. Tags Identified as Likely Sonya (CANDIDATE — requires Piranav confirmation)

| Tag (as stored) | Trimmed | Products | In PMax | In Shopping | Confidence |
|---|---|---|---|---|---|
| ` Sonya` | `Sonya` | 1,147 | 1,139 | 100 | HIGH — exact name |
| ` Dracarys` | `Dracarys` | 420 | 414 | 45 | HIGH — confirmed example |
| ` Sonya_N_C` | `Sonya_N_C` | 192 | 192 | 18 | HIGH — contains name |
| ` Dracarys Vermax` | `Dracarys Vermax` | 180 | 179 | 56 | MEDIUM — Dracarys variant |
| ` Sonya Old` | `Sonya Old` | 172 | 172 | 7 | HIGH — contains name |
| ` SonyaM&A` | `SonyaM&A` | 169 | 169 | 1 | HIGH — contains name |

**AGU cluster (CANDIDATE — linked to Shopping campaign "DM46_2_KL_AGU"):**

| Tag (as stored) | Trimmed | Products | In PMax | In Shopping | Note |
|---|---|---|---|---|---|
| `Agu46-2` | `Agu46-2` | 1,024 | 976 | 792 | No leading space variant |
| ` Agu46-2` | `Agu46-2` | 466 | 443 | 379 | Leading space duplicate |
| `AGU2026` | `AGU2026` | 283 | 277 | 26 | 2026 batch identifier |

**⚠ NOTE on AGU:** The Shopping campaign is literally named `DM46_2_KL_AGU`. This is strong
contextual evidence that AGU = Sonya's campaign group. However, this is INFERENCE — Piranav
must confirm before AGU tags are added to `SONYA_TAGS`.

**Combined unique Sonya-named tags across `Sonya`/`Dracarys`/`SonyaM&A`/`Sonya_N_C`/`Sonya Old`/`Dracarys Vermax`:**
Approximately 1,900–2,200 unique products (overlap not counted here).

---

### 4b. Tags Identified as Likely Sajeepan/SJ (CANDIDATE — requires Piranav confirmation)

| Tag (as stored) | Trimmed | Products | In PMax | In Shopping | Confidence |
|---|---|---|---|---|---|
| ` SJ` | `SJ` | 932 | 918 | 283 | HIGH — confirmed initials |
| ` SJRAT` | `SJRAT` | 383 | 375 | 177 | HIGH — SJ prefix |
| ` SJ_C` | `SJ_C` | 206 | 206 | 48 | HIGH — SJ prefix |
| ` SJK` | `SJK` | 202 | 201 | 52 | HIGH — SJ prefix |
| ` SJ_T_ADS` | `SJ_T_ADS` | 180 | 180 | 52 | HIGH — SJ prefix |
| ` OLD SJ NA` | `OLD SJ NA` | 152 | 151 | 64 | HIGH — contains SJ |

---

### 4c. Other Staff Tag Families Identified (NOT Sonya or Sajeepan — do not assign)

These tag families are clearly staff or team identifiers but CANNOT be assigned without
additional evidence from Piranav.

| Tag Family | Sample Tags | Approx. Products | Identity |
|---|---|---|---|
| Sixnyne Collective | ` Sixnyne Collective 3` (1,298), ` Sixnyne Collective` (1,050), ` Sixnyne Collective 02` (856), ` Sixnyne 3` (232) | ~3,200+ | Unknown — a team or 3rd staff member |
| Thisoban/Thiso | ` Thisoban` (808), ` Thiso` (630) | ~1,400 | Unknown staff |
| Thee | ` Thee.NS` (505), ` Thee.Mystery` (356), ` Theekshy` (308) | ~1,100 | Theekshy? |
| Ani | ` Ani` (399), `Ani` (390) | ~789 | Unknown staff |
| Anu | ` Anu PH` (392), ` Anu LC` (212), ` Anu HC` (199) | ~800 | Unknown staff |
| Bakee | ` Bakee` (395) | ~395 | Unknown staff |
| Thilakshi | ` THILAKSH@%£` (265), ` Thilakshi_C` (142), ` Thilakshi NC` (? - not in top 80) | ~400 | Thilakshi (confirmed name match) |
| Kamsi | ` kamsi_CC` (226), ` Kamsi_C` (156), ` kamsi14nc` (140) | ~520 | Kamsi (confirmed name match) |
| Agastya | `Agastya` (219) | ~219 | Unknown — person's name |

---

### 4d. Promotional / Category / System Tags (not owner-related)

| Tag (as stored) | Products | Classification |
|---|---|---|
| ` Pendant Lights` | ~500+ | Product category |
| ` Wall Lighting` | ~400+ | Product category |
| ` Lampshades` | ~300+ | Product category |
| ` GEMOFF` | ~500+ | Promotional |
| ` clearence promo` | ~400+ | Promotional |
| ` bank-holiday-off` | ~300+ | Promotional |
| ` New Arrivals` | ~500+ | Merchandising |
| ` UKIDSNEW` | ~300+ | Campaign/segment |
| ` new2025` | ~400+ | Year batch |
| `2026New` | ~300+ | Year batch |
| ` Zombies` | 729 | Unknown — possibly internal campaign code |
| ` RSN` | 255 | Unknown — initials or code |
| ` RAT` | 203 | Unknown — could be campaign code |

---

## 5. Conflict Rate Analysis

**Query:** Counted products carrying BOTH Sonya-family AND SJ-family tags simultaneously.
**Tag sets used for this count:**
- Sonya set (trimmed): `sonya`, `dracarys`, `sonya old`, `sonya_n_c`, `sonyam&a`, `dracarys vermax`, `agu46-2`, `agu2026`, `agustya`
- SJ set (trimmed): `sj`, `sjrat`, `sj_c`, `sjk`, `sj_t_ads`, `old sj na`, `sajeepan`

| Category | Products | % of 4,774 matched |
|---|---|---|
| Sonya only | 2,332 | 48.8% |
| Sajeepan only | 927 | 19.4% |
| Conflict (BOTH) | 730 | 15.3% |
| Neither owner tag | 783 | 16.4% |

**⚠ IMPORTANT — Conflict rate is tag-set dependent:**
The 730 conflict count (15.3%) uses the BROAD candidate set including AGU tags. The conflict
rate will be lower if the final confirmed tag dictionary is narrower. The feasibility audit's
original SONYA_TAGS = `{'agu', 'sonya'}` is narrower and would produce fewer conflicts.

**The high conflict rate with broad candidate tags is expected** — it shows that products
accumulate tags over time and not all tags are mutually exclusive to one owner. The final
implementation must use only the confirmed canonical tags per owner, not the full candidate list.

---

## 6. CRITICAL Data Quality Finding — Leading Spaces

**Finding:** The majority of owner-relevant tags are stored with a leading space in
`listings.shopify_listing_tag`:

| Stored value | Trimmed value |
|---|---|
| ` Sonya` | `Sonya` |
| ` SJ` | `SJ` |
| ` Dracarys` | `Dracarys` |
| ` Agu46-2` | `Agu46-2` |

But the same tag also appears WITHOUT a leading space on some products:
- `Agu46-2` (1,024 products) — no space
- ` Agu46-2` (466 products) — leading space

**Impact on feasibility audit implementation:**
The proposed `_classify_owner()` function in
`evidence/piranav/dm-campaign-owner-tag-feasibility-2026-10-28.md` uses:

```python
lower_tags = {t.lower() for t in tags}
```

This will **fail to match** ` Sonya` (with leading space) against the frozenset `{'sonya'}`.
` sonya'.lower()` = `' sonya'` ≠ `'sonya'`.

**Required correction:**

```python
lower_tags = {t.strip().lower() for t in tags}  # ← strip() is mandatory
```

This is a must-fix before any implementation proceeds.

---

## 7. Source of Truth for Tags

Tags queried here come from `listings.shopify_listing_tag` (production ledsone DB).
This table is populated from the Shopify API via the listing sync pipeline.
It is the same tag data that Shopify stores on products.

The alternative source (`sales_cache.collection_tag_mapping_products.tags` JSONB, referenced
in the feasibility audit) is in BUSINESS_DATABASE_URL and was confirmed inaccessible via MCP.
However, both sources read from the same underlying Shopify product tags — they should be
equivalent. The `shopify_listing_tag` join path is confirmed working with 99.96% tag coverage.

---

## 8. Correction Required in Feasibility Evidence

The following correction must be applied to
`evidence/piranav/dm-campaign-owner-tag-feasibility-2026-10-28.md` Section 5:

**Current (incorrect):**
```python
lower_tags = {t.lower() for t in tags}
```

**Corrected:**
```python
lower_tags = {t.strip().lower() for t in tags}
```

This affects both the Python function and the SONYA_TAGS/SAJEEPAN_TAGS frozensets — the
frozenset values themselves do NOT need stripping (they are defined without spaces), but the
input tags from Shopify must be stripped before comparison.

---

## 9. Questions for Piranav (Confirmation Required Before Implementation)

These questions MUST be answered before the owner tag dictionary is finalised and the
`SONYA_TAGS` / `SAJEEPAN_TAGS` frozensets are written into the backend.

| # | Question | Options | Why It Matters |
|---|---|---|---|
| Q1 | Is `AGU` / `Agu` / `AGU2026` / `Agu46-2` Sonya's tag? | Yes / No / Some variants only | 1,024–1,490 products across variants. Shopping campaign named "DM46_2_KL_AGU" — strong contextual evidence for yes. |
| Q2 | Is `Dracarys` Sonya's tag? | Yes / No | 420 products. Previously given as an example but must be confirmed. |
| Q3 | Is `SonyaM&A` Sonya's tag? | Yes / No | 169 products. Mergers & Acquisitions category? Or Sonya's batch? |
| Q4 | Are ALL `SJ*` prefixed tags Sajeepan's? | Yes / No / Only specific ones | 932 (`SJ`) + 383 (`SJRAT`) + 206 (`SJ_C`) + 202 (`SJK`) + 180 (`SJ_T_ADS`) + 152 (`OLD SJ NA`) |
| Q5 | Who is "Sixnyne Collective"? | Staff name or team | ~3,200+ products. Is this a 3rd owner that should appear in the filter? |
| Q6 | Who is "Thisoban" / "Thiso"? | Staff name or team | ~1,400 products. Same question. |
| Q7 | Products with BOTH Sonya and SJ tags (730 products) — are these data entry errors, or legitimate shared products? | Errors / Shared / Mixed | Determines whether `Conflict` is the right UI state or whether these should be investigated and re-tagged |
| Q8 | Should `Sajeepan` / `Sajjepan` (the full name tags, if they appear) be included in SAJEEPAN_TAGS? | Yes / No | The examples given previously included these but they may not appear frequently in the real data |

---

## 10. Summary: What Can Be Confirmed Now vs. What Requires Piranav

### Confirmed from live data (no Piranav input needed):
- Tags exist on 99.96% of matched DM products
- ` Sonya` tag: 1,147 products — clearly a Sonya tag
- ` SJ` tag: 932 products — clearly a Sajeepan tag  
- Leading space issue: `_classify_owner()` MUST use `t.strip().lower()`
- Tag join chain works: `shopify_listing_tag` via `shopify_listings.id` (not legacy_id path)

### Requires Piranav confirmation before implementation:
- Whether AGU cluster = Sonya
- Whether Dracarys/Dracarys Vermax = Sonya
- Whether all SJ* prefixed tags = Sajeepan
- Whether Sixnyne Collective, Thisoban, etc. should appear in the owner filter
- Final canonical SONYA_TAGS and SAJEEPAN_TAGS frozensets

### Do NOT proceed with implementation until:
Piranav provides a confirmed list of SONYA_TAGS and SAJEEPAN_TAGS tag strings.

---

## 11. Files Consulted (read-only)

No source code files read during this task — queries only against production DB.
Prior session evidence files cross-referenced:
- `evidence/piranav/dm-campaign-owner-tag-feasibility-2026-10-28.md` (feasibility audit)
- `evidence/piranav/dm-campaign-overall-performance-audit-2026-10-28.md` (page audit)

---

## 12. Next Action Required

**Piranav to confirm:** Answer Q1–Q8 in Section 9 above, specifically:
1. Provide the confirmed list of Sonya's owner tags (trimmed, case-insensitive)
2. Provide the confirmed list of Sajeepan's owner tags (trimmed, case-insensitive)
3. Confirm whether Sixnyne Collective / Thisoban should appear as a 3rd owner category

Once confirmed, the implementation can proceed using the corrected `t.strip().lower()` function.
