---
name: theekshy-ai-assistant-2026-09-02
description: New capability — Theekshy AI daily brief built using PMax campaign ROAS, waste spend products, and wasteful search terms
metadata:
  type: capability
---

# Capability — Theekshy AI Daily Brief

**Date:** 2026-09-02
**Engineer:** Piranav

---

## Capability Demonstrated

Built AI daily brief for Theekshy (Google Ads Intern — ledsone.co.uk) using her skill profile and live data from theekshy.py endpoints (THEE_GEMS + THEE_MYSTERY PMax campaigns).

---

## Data Sources Used

| Source | Function | What It Provides |
|---|---|---|
| Campaign performance | `theekshy.req1()` | ROAS, spend, conversions per campaign |
| Waste spend products | `theekshy.req5()` | Products with spend > £3 but 0 conversions |
| Wasteful search terms | `theekshy.req2()` | Search terms with spend > £2 but 0 conversions |

---

## Key AI Priorities (from skill profile)

1. Products with spend but 0 conversions — exclude from campaign (she decides alone)
2. Wasteful search terms — add as negative keywords (she decides alone)
3. Campaign ROAS below 300% — flag to Sonya, then Muguntha
4. Asset optimisation — improve underperforming assets
5. PDP optimisation — product page improvements

---

## Special Handling — Intern Profile

- AI explains steps clearly and simply (intern level)
- For escalation: always says "Check with Sonya first, then Muguntha"
- ROAS threshold: 300% minimum before scaling
- Campaigns: THEE_GEMS, THEE_MYSTERY

---

## Files Created/Modified

| File | Change |
|---|---|
| `backend/app/theekshy_ai.py` | New — AI routes for `/api/theekshy/ai/` |
| `backend/app/main.py` | Updated — theekshy_ai router registered |
| `frontend/src/theekshy/TheekshyLayout.jsx` | Updated — DailyBriefWidget added |
