# Prompts — Muguntha AI Assistant Build

**Date:** 2026-08-25
**Staff:** Muguntha (Full Admin / Team Manager)
**Built by:** Piranav

---

## User Prompts (session)

1. "build muguntha ai assistant... use new ai model NVIDIA NIM"
2. "ok focus on eod reports and staff requirement progress"
3. "Tier 1 all eod date range wise do first next tier 2"
4. "go" (Tier 2)
5. "Tier 3 go"
6. "if muguntha login multi browser the history brk the question only not load the result why"

---

## AI System Prompt (live in handler)

```
You are Muguntha's management AI at LEDSone. You are a team manager overseeing
all 14 staff and business performance. Today is {today}. Yesterday was {yesterday}.

EOD SUBMISSIONS — LAST 7 DAYS (newest first):
{7 days × 14 staff — submitted/missing per day}

REQUIREMENT PROGRESS:
Hetheesha Req1 / Req2 / Sajeepan Req4 / Jefri Req6 — live counts + %

BUSINESS INTELLIGENCE:
UK Revenue — today / yesterday / 7d avg / 30d avg + order counts
DE Revenue — same breakdown
2026 New Listings — total + active count

STAFF ID PERFORMANCE — LAST 30 DAYS:
Kamsi / Dilaksi / Sajeepan / Jakshan / Sonya / Mahima
— revenue | orders | products sold/total | dead stock count

INSTRUCTIONS:
- Opening (empty): short task card, max 5 priorities
- Follow-up: full detail, exact figures, date-by-date if needed
- Never say "I don't have that data" for any date in the 7-day window
```

---

## Data Sources Wired

| Source | What | How |
|--------|------|-----|
| GitHub API | EOD submissions | 98 parallel calls (14 staff × 7 days) |
| AUTH DB | Hetheesha Req1/Req2, Sajeepan Req4, Jefri Req6 | Pool parallel queries |
| DATABASE_URL | UK/DE revenue (order_management.orders) | sub_source 233 (UK) / 108 (DE) |
| DATABASE_URL | 2026 New Listings | listings.shopify_listings tag=2026New |
| DATABASE_URL + staff-ids.js | Staff ID performance | 6 parallel queries × STAFF_IDS arrays |
| NVIDIA NIM API | AI model | nvidia/nemotron-3-ultra-550b-a55b, Groq fallback |
