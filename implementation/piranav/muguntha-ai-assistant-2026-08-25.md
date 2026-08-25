# Implementation — Muguntha AI Assistant

**Date:** 2026-08-25
**Files changed:** `api/muguntha.js`, `pages/muguntha.html`, `lib/nvidia.js`

---

## Architecture

Two-stage AI flow (same pattern as all other staff assistants):
- Empty message → short task card (max 5 priorities)
- Follow-up → full detail on chosen task

AI model: NVIDIA Nemotron-3-Ultra-550B-A55B (primary), Groq chain (fallback)
Chat DB: `muguntha_ai_chat` table on `SJ_CHAT_DB_URL`, session_date = CURRENT_DATE

---

## Data Fetching — Single Promise.all

All data fetches run in **one parallel batch** per request:

```
Promise.all([
  98 GitHub API calls (14 staff × 7 days EOD),      ← Tier 1
  AUTH DB queries (Req1/Req2/Req4/Req6),              ← Tier 1
  DATABASE_URL queries (UK rev / DE rev / listings / ← Tier 2
                        6 staff ID perf queries),     ← Tier 3
])
```

Total: ~104 concurrent I/O calls, all resolved before AI call.

---

## Key Implementation Decisions

### EOD: 7-day window, not just today/yesterday
- `dates = Array.from({ length: 7 }, (_, i) => today - i days)`
- `checkEod(name, date)` returns `{ name, date, submitted: bool|null }`
- Results grouped into `byDate[date] = { submitted: [], missing: [] }`
- System prompt: one line per date, newest first

### Revenue queries
- UK: `sub_source_id = 233`, `status = 'Completed'`
- DE: `sub_source_id = 108`, `status = 'Completed'`
- Both: today rev/orders, yesterday rev/orders, 7d avg, 30d avg

### Staff ID Performance
- Source: `data/staff-ids.js` — STAFF_IDS object (kamsi, dilaksi, sajeepan, jackson, sonya, mahima)
- Query per staff: `SELECT products_sold, revenue_30d, orders_30d FROM order_item_info + orders WHERE product_id = ANY($1) AND order_date >= $2`
- Dead stock = `total IDs - products_sold`

### Jefri Req6 tracker
- Table: `public.jefri_req6_tracker` on AUTH DB
- Columns: `image_update_date` (NULL = not done)
- Added with `.catch(() => ({ rows: [{ total: 0, updated: 0 }] }))` — silent fail if table missing

---

## Multi-Browser Race Fix (2026-08-25)

**Problem:** `prefetchHistory()` and AI brief call ran in parallel. Browser B started a 10-second NVIDIA call even when history existed. The brief's `.finally` reset `isLoading=false` mid-send.

**Fix:** `aiLoadBrief` rewritten as `async function`. Awaits history check first. Returns immediately if DB has messages (no AI call). Only fires AI when DB is empty.

```js
// Before (broken — parallel)
prefetchHistory();           // async, not awaited
fetch('/api/muguntha?action=ai-chat', ...)  // fires simultaneously

// After (fixed — sequential)
const histData = await fetch('/api/muguntha?action=ai-chat-history')
if (histData.messages.length > 0) { restore(); return; }  // bail out
// only reaches here if DB is empty
await fetch('/api/muguntha?action=ai-chat', ...)
```

---

## Commits

| Hash | Description |
|------|-------------|
| `0e0d0c8` | fix(kamsi): literal newline in regex (unrelated, same session) |
| `6d1f4dd` | feat(muguntha): rebuild AI handler — EOD + requirements focus |
| `283ed57` | fix(muguntha): fetch yesterday + today EOD, fix AI context |
| `5da3a58` | feat(muguntha): EOD 7-day range — 98 parallel GitHub calls |
| `a9fd290` | feat(muguntha): Tier 2 — UK/DE revenue + 2026 listings |
| `ae1b20a` | feat(muguntha): Tier 3 — staff ID performance + Jefri Req6 |
| `7b6080b` | fix(muguntha): multi-browser race condition fix |
