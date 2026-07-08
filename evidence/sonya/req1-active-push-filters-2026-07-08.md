# Evidence — Sonya Req 1 Active & Push Campaign Filters

## Title
Sonya Req 1 — Active Campaign and Push Campaign filters added

## Date
2026-07-08

## Member
Sonya

## Team
Google Ads

## Requirement
Requirement 1 — Campaign Data

---

## STEP 1 — Column Inspection: public.ppc_etl_performance_data

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'ppc_etl_performance_data'
ORDER BY ordinal_position;
```

### Columns Found (18 total)

| Column | Data Type |
|---|---|
| performance_data_id | bigint |
| source | bigint |
| sub_source_id | bigint |
| marketplace_id | bigint |
| date | date |
| record_type | text |
| ref_id | text |
| sku | text |
| record_id | text |
| child_id | text |
| parent_id | text |
| impressions | bigint |
| clicks | bigint |
| spend | double precision |
| sales | double precision |
| orders | double precision |
| created_at | timestamp |
| updated_at | timestamp |

### Status Field Check

| Field Searched | Found? |
|---|---|
| status | NO |
| campaign_status | NO |
| serving_status | NO |
| campaign_state | NO |
| enabled | NO |
| is_active | NO |

**Result: NO status column in ppc_etl_performance_data.**

### Push Field Check

| Field Searched | Found? |
|---|---|
| push | NO |
| push_campaign | NO |
| campaign_type | NO |
| campaign_label | NO |
| label | NO |
| tag | NO |
| objective | NO |
| campaign_group | NO |

**Result: NO push-related column in ppc_etl_performance_data.**

---

## STEP 2 — Filter Rules Applied

### Active Campaign Rule
**Rule used: Activity-based (no status column available)**

```
Active Campaign = l30.cost > 0
```

Campaign has spend greater than zero in the last 30-day window (2026-06-08 to 2026-07-07).

| Campaign | L30 Cost | Active? |
|---|---|---|
| 20810136438 Muguntha | £7,348.01 | YES |
| 21435967873 PH_ALL | £1,902.53 | YES |
| 22943583032 SUMMER_TRENDS | £542.70 | YES |
| 23526695953 EUR_76 | £457.51 | YES |
| 23914872425 English_EU | £253.88 | YES |
| 23515806682 SONYA2026 | £153.29 | YES |
| 23729304135 GB C1 | £125.94 | YES |
| 22847654610 NICC_07 | £2.48 | YES |
| 23793722836 D Gen | £0.00 | NO |

**Active campaigns: 8/9**

### Push Campaign Rule
**Rule used: Name-based fallback (no push field available)**

```
Push Campaign = campaign_name.toLowerCase().includes('push')
```

| Campaign | Name contains 'push'? |
|---|---|
| All 9 campaigns | NO |

**Push campaigns: 0/9 — filter returns empty set by design until push campaigns are added to Sonya's group.**

---

## Files Changed

- `Staff-requirements/pages/sonya.html`
  - Controls: added Campaign Type button group (All / Active / Push)
  - JS: added `campaignType` state, `setCampaignType()`, `matchesCampaignType()`
  - `applyFilters()`: added campaignType check — works with existing search + segment filters
  - Validation section: added Active/Push filter confirmation items
  - Footnotes: documented field inspection results and rules applied
