---
name: muguntha-ai-team-brief-2026-09-02
description: New capability — Muguntha AI team brief built as team-wide situation report, not personal task card
metadata:
  type: capability
---

# Capability — Muguntha AI Team Brief

**Date:** 2026-09-02
**Engineer:** Piranav

---

## Capability Demonstrated

Built a team leader AI brief for Muguntha that is architecturally different from all staff AI briefs — it gives a team-wide situation report instead of a personal task card.

---

## Key Design Difference

| Staff AI | Muguntha AI |
|---|---|
| Personal task card | Team situation report |
| One person's data | All 11 staff + all markets |
| "Here are your tasks" | "Here is your team today" |
| Single data source | 3 data sources combined |

---

## Data Sources

| Source | What It Provides |
|---|---|
| `dm_dashboard` — all `*_ai_chat` tables | Which staff have logged in and started their AI brief today |
| Business DB — `google_ads.campaign_performance` | ROAS, spend, conversions by market (UK/DE/FR/IT/US) — latest available date |
| `staff_monitor.summary()` | Hetheesha fix tracker progress, Sajeepan feed optimisation tracker |

---

## Key AI Features

- **Staff activity tracking** — queries all 11 AI chat tables, flags who is active today vs not
- **Market ROAS alert** — flags any market below 3x ROAS with spend > £50
- **Team roster awareness** — knows who owns which market
- **Follow-up depth** — Muguntha can drill into any staff member or market by asking

---

## Frontend — Conditional Render

Widget only shows for Muguntha, not Piranav or Kuberan:

```jsx
{user?.username === 'muguntha' && (
  <DailyBriefWidget staffName="Muguntha" apiBase="/api/muguntha/ai" role="Team Leader · DM Team" />
)}
```

---

## Files Created/Modified

| File | Change |
|---|---|
| `backend/app/muguntha_ai.py` | New — team brief AI routes `/api/muguntha/ai/` |
| `backend/app/main.py` | Updated — muguntha_ai router registered |
| `frontend/src/admin/AdminLayout.jsx` | Updated — DailyBriefWidget conditionally for muguntha only |

---

## Reusable Pattern — Manager/Leader AI Brief

For any team leader AI:
1. Query individual staff chat tables to see who is active
2. Query business DB for team-wide KPI summary (ROAS, spend by market)
3. Pull tracker/monitor data for operational progress
4. Build situation report prompt — not task assignment but team awareness
5. Conditional frontend render — show only for that specific username
