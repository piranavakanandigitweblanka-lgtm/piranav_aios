# Capability: PMax Search Term Cost — Correct DB Source
**Date:** 2026-07-16  
**Extracted from:** Theekshy Req 2 cost fix

## Capability Name
Identify and use the correct PostgreSQL table for PMax search-term-level cost data

## What Was Learned

`google_ads.campaign_search_term_data` does NOT populate the cost field for Performance Max campaigns. Cost is NULL for 100% of PMax rows. This is a known Google Ads data architecture limitation — PMax search terms are stored separately.

The correct table is `google_ads.pmax_campaign_search_term_data` which:
- Has cost (numeric, GBP) for 100% of rows
- Covers date + campaign_id + search_term + match_type grain
- Provides cost in GBP directly (not micros)
- Available from 2026-06-01 onwards (for LEDSone campaigns)

## Applicable When

- Any AIOS task that needs search-term-level cost for PMax campaigns
- Any waste term analysis requiring Rule 1 (Cost > threshold AND Conv = 0)
- Any CPA or ROAS calculation at search-term level for PMax

## Key SQL Pattern

```sql
SELECT campaign_id, LOWER(TRIM(search_term)) as search_term, match_type,
  SUM(impressions) as imp, SUM(clicks) as clk,
  ROUND(SUM(cost)::numeric,2) as cost,
  ROUND(SUM(conversions)::numeric,4) as conv,
  ROUND(SUM(conversions_value)::numeric,2) as cv
FROM google_ads.pmax_campaign_search_term_data
WHERE campaign_id IN (<campaign_ids>)
  AND date >= '<start>' AND date <= '<end>'
GROUP BY campaign_id, LOWER(TRIM(search_term)), match_type
ORDER BY SUM(cost) DESC;
```

## What NOT to Do

- Do NOT use `campaign_search_term_data` for PMax cost — it will always return NULL
- Do NOT estimate cost from clicks or CTR
- Do NOT divide by 1,000,000 — cost field is already in GBP

## Related

- `google_ads.campaign_search_term_data` — use for standard (non-PMax) campaigns
- Campaign IDs for Theekshy: THEE_GEMS=23714290257, THEE_MYSTERY=23684837882
