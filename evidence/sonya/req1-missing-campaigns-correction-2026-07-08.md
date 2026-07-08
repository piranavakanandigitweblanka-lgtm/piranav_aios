# Evidence — Sonya Req 1 Missing Campaigns Correction

## Title
Sonya Req 1 — Missing Campaigns Added (English_EU + Muguntha DM 46 All)

## Date
2026-07-08

## Member
Sonya

## Team
Google Ads

## Requirement
Requirement 1 — Campaign Data (Correction)

## Issue Reported
Sonya reported campaigns missing from her group after source migration to public.ppc_etl_performance_data.

## Missing Campaigns Requested

| # | Campaign Name (as reported) | Found? |
|---|---|---|
| 1 | Pmax UK \| Sonya \| Klarna \| EUR_76 \| All \| MCV \| Ierland | Already in dashboard (ID 23526695953) |
| 2 | Pmax UK \| Sonya \| Shoptimised \| English _EU \| Top Selling \| MC \| Europe English | ✅ FOUND — added |
| 3 | Pmax UK \| Muguntha \| Shoptimised \| GB \| DM 46 All \| MCV \| UK | ✅ FOUND — added |

## Campaign Discovery Results

### Campaign 1 — EUR_76 (23526695953)
- Already present in sonya.html from previous implementation
- No action required

### Campaign 2 — English_EU (23914872425)
- **Name:** Pmax UK | Sonya | Shoptimised | English _EU | Top Selling | MC | Europe English
- **Campaign ID:** 23914872425
- **Name source:** staging_ai.pmax_18m_postmortem_fact_v1 (not yet in truth registry)
- **In ppc_etl_performance_data:** YES (source=3, record_type=campaign)
- **Latest date:** 2026-07-07
- **L30 (2026-06-08–2026-07-07):** Cost £253.88 | CV £327.41 | Conv 9.00 | ROAS 128.96% → Worst
- **BL (2026-05-09–2026-06-07):** Cost £27.64 | CV £75.35 | Conv 2.00 | ROAS 272.61%

### Campaign 3 — Muguntha DM 46 All (20810136438)
- **Name:** Pmax  UK | Muguntha | Shoptimised | GB | DM 46 All | MCV | UK
- **Campaign ID:** 20810136438
- **Name source:** staging_ai.cppc_pmax_campaign_passport_v1 + pmax_18m_postmortem_fact_v1
- **In ppc_etl_performance_data:** YES (source=3, record_type=campaign)
- **Latest date:** 2026-07-07
- **L30 (2026-06-08–2026-07-07):** Cost £7,348.01 | CV £23,814.41 | Conv 765.11 | ROAS 324.09% → OK
- **BL (2026-05-09–2026-06-07):** Cost £7,580.19 | CV £27,168.08 | Conv 796.68 | ROAS 358.41%

## Updated Campaign Count
- Previous: 7 campaigns
- Corrected: 9 campaigns

## Updated Inclusion Logic

### Previous filter (too narrow)
```
campaign_name ILIKE '%Sonya%'
```

### Corrected filter
```
campaign_name ILIKE '%Sonya%'
PLUS campaign_id = '20810136438'  (Muguntha | Shoptimised | GB | DM 46 All | MCV | UK)
```

- Sonya confirmed campaign 20810136438 belongs to her managed group
- English_EU (23914872425) is already captured by ILIKE '%Sonya%' once name is in registry
- No other Muguntha campaigns are included

## Files Changed
- `Staff-requirements/pages/sonya.html` — RAW array updated from 7 to 9 campaigns
