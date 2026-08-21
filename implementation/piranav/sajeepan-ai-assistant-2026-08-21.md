# Implementation — Sajeepan AI Daily Assistant

**Date:** 2026-08-21
**Staff:** Sajeepan
**Dashboard:** dm-dashboard.vintageinterior.co.uk → pages/sajeepan.html
**Prepared by:** Piranav (AIOS)

---

## What Was Built

### Problem
Sajeepan had 4 requirements of live Google Ads data but no way to quickly understand what to prioritise each morning. He had to manually read through campaigns, wasteful products, OOS items and feed issues to decide what to action.

### Solution
A floating AI chat widget on his dashboard that:
1. Opens → auto-generates a numbered action list from all 4 reqs
2. Feeds real live DB data (campaigns, waste, OOS, feed) into the AI prompt
3. Lets him ask follow-up questions in plain English
4. Powered by Groq free API (no cost)

---

## Backend — `api/members-api.js`

### New function: `handleSajeepanAiChat(req, res, client, fromDate, toDate, prevFrom, prevTo)`

Added before `handleSajeepan()`. Routed via:
```js
if (type === 'ai-chat') {
  return await handleSajeepanAiChat(req, res, client, fromDate, toDate, prevFrom, prevTo);
}
```

### DB queries (run in parallel via Promise.all):
```js
const [campRows, topProdRows, wasteRows, negKwRows, campPrevRows, oosRows] = await Promise.all([
  // Req 1: campaign performance + status
  // Req 1: top 5 products by revenue
  // Req 2: zero-conv products with spend > £5
  // Req 2: search terms with spend > £2 and 0 conv (.catch → [] if table missing)
  // Req 2/3: campaign performance vs prev period (.catch → [])
  // Req 3: OOS products still spending
]);
```

Plus `feedRows` (Req 4) run after Promise.all.

### Groq API call:
```js
// Model fallback chain
const GROQ_MODELS = [
  { id: 'qwen/qwen3.6-27b', extra: { reasoning_effort: 'none' } },
  { id: 'groq/compound', extra: {} },
  { id: 'openai/gpt-oss-120b', extra: {} },
  { id: 'openai/gpt-oss-20b', extra: {} },
];
// Strip think blocks
const aiText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
```

### System prompt format:
- Compact pipe-delimited data (keeps under token limit)
- Instructs: numbered actions only, specific names + £ figures, priority order OOS > drops > waste > feed
- No intro sentence, starts directly with "1."

---

## Frontend — `pages/sajeepan.html`

### Added (before `</body>`):

**CSS:** Floating button, slide-up chat panel, message bubbles, thinking animation, input bar

**HTML:**
- `#aiBtn` — fixed bottom-right blue circle button with "AI" badge
- `#aiPanel` — slide-up chat panel with header, messages area, input bar
- Refresh button (↻) in panel header

**JS (IIFE):**
- `aiToggle()` — open/close panel, triggers brief on first open
- `aiLoadBrief()` — POST to `ai-chat` with empty history, 55s timeout fallback
- `aiSend()` — POST with user message + last 6 messages history
- `formatAiText()` — converts `**bold**`, `## headings`, `- bullets` to HTML
- Think tag stripping happens server-side before response

---

## Chat History Persistence — Phase 2

### New DB table (auto-created on first use)

```sql
CREATE TABLE IF NOT EXISTS sajeepan_ai_chat (
  id          SERIAL PRIMARY KEY,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  role        TEXT NOT NULL,   -- 'user' or 'assistant'
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Previous-day rows are deleted on each `ai-chat-history` fetch.

### New functions in `members-api.js`

- `getSjChatClient()` — creates a Client from `SJ_CHAT_DB_URL`, connects, auto-creates table
- `handleSajeepanChatHistory(req, res)` — GET today's messages, clean old rows
- `handleSajeepanChatSave(req, res)` — POST one message (role + content)

### New routes (early-exit before `DATABASE_URL` connect)

```js
if (type === 'ai-chat-history') return await handleSajeepanChatHistory(req, res);
if (type === 'ai-chat-save')    return await handleSajeepanChatSave(req, res);
```

### Groq resilience

- `AbortController` with 20s timeout per model — prevents indefinite hangs
- Empty-content check — skips models returning blank response, falls through to next
- Model order changed: `qwen/qwen3.6-27b` first, `openai/gpt-oss-20b` dropped (returns empty)

### Frontend changes

- `prefetchHistory()` — runs in parallel with brief fetch on open
- If history arrives first and session exists → shows it, sets `briefLoaded = true`, brief result ignored
- If brief arrives first (no history today) → shows new brief as before
- `saveMsg(role, content)` — fire-and-forget POST after each message sent/received
- Frontend timeout increased 55s → 90s

---

## Environment Variables Required

| Variable | Where | Value |
|---|---|---|
| `GROQ_API_KEY` | Vercel → Production | `gsk_...` from console.groq.com |
| `SJ_CHAT_DB_URL` | Vercel → Production | Neon connection string for chat table |
