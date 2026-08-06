# SEO Dashboard — Simple Blueprint

## How It Works

```
DATA SOURCES
     │
     ├── SEMrush (via MCP)
     │       ↓
     │   Weekly Agent (every Monday)
     │       ↓
     │   Neon Database (stores SEMrush data)
     │
     └── Ledsone Database (GSC + Google Ads — always live)
              │
              └──────────────────┐
                                 ↓
                          Vercel API
                       (api/seo.js)
                                 ↓
                          Dashboard
               (staff-requirements-02.vercel.app)
```

---

## 3 Simple Layers

### Layer 1 — Data Storage
| What | Where | Updated |
|---|---|---|
| Google Search Console | Ledsone DB (live) | Every day automatically |
| Google Ads | Ledsone DB (live) | Every day automatically |
| SEMrush rankings, pages, backlinks | Neon DB | Every Monday by agent |

### Layer 2 — API (Middle Man)
- File: `api/seo.js`
- Browser asks → API fetches from DB → sends back to browser
- One file handles everything

### Layer 3 — Dashboard (What User Sees)
- File: `pages/seo.html`
- 6 tabs, loads data on demand
- Charts + tables built from API responses

---

## What Refreshes When

```
Every Day   →  GSC weekly KPI cards, clicks, impressions, CTR, position charts
Every Day   →  SEMrush history (rank, traffic, keywords)
Every Week  →  SEMrush keywords, pages, backlinks, competitors
Always Live →  GSC clicks, Google Ads spend & ROAS
```

---

## The 7 Tabs

```
Tab 1 — Executive Overview    → Weekly KPIs + WoW comparison + 18m trends + alerts + all charts
Tab 2 — Product Intelligence  → Which products get GSC traffic
Tab 3 — Keyword Intelligence  → GSC keywords + SEMrush rankings
Tab 4 — Landing Pages         → Which pages drive traffic (GSC + SEMrush)
Tab 5 — Action Centre         → SEO tasks and recommendations
Tab 6 — Technical SEO         → Site health metrics
Tab 7 — AI Readiness          → Geographic and AI readiness signals
```

---

## Executive Overview — What's Inside (Phase 1 — updated 2026-08-06)

```
1. SEO Weekly KPI Summary       → 7 KPI cards with this week / last week / WoW % / status
2. SEO KPI Weekly Comparison    → All KPIs in one comparison table (current vs previous week)
3. Executive Insights           → Auto summary: biggest gain, biggest decline, recommended action
4. SEO Alerts                   → WoW-triggered + long-term alerts (backlinks, rank, traffic)
5. Monthly KPI Cards            → Existing snapshot cards (SEMrush + GSC + Ads)
6. 18-Month KPI Trend Charts    → 7 charts: Clicks, Impressions, CTR, Position, Top3, Top10, Traffic
7. 37-Month Organic Trend Chart → Long-term SEMrush traffic + GSC clicks overlay
8. Google Ads Overlay           → Monthly spend + ROAS (Feb 2020 – present)
9. Competitor Traffic Chart     → ledsone vs 5 competitors (SEMrush monthly)
10. Backlinks Health Charts     → 24-month trend + net-change bar + lost/gained domains
11. MoM Comparison Table        → Last 6 months: GSC + SEMrush + Ads side by side
12. Data Quality Panel          → Source status, coverage dates, known limitations
```

---

## When Something Goes Wrong

| Problem | Likely Cause |
|---|---|
| Data not updating | Weekly agent failed — check claude.ai/code/routines |
| Dashboard shows error | Vercel API can't reach DB — check env vars |
| New code not live | Need to run `vercel --prod` manually |
| GSC clicks look low | Normal — DB stores ~50% of true total |
