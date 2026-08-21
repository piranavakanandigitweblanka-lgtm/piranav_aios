# Evidence — Sajeepan AI Daily Assistant

**Date:** 2026-08-21
**Task:** Add AI daily priority assistant chatbot to Sajeepan's dashboard
**Prepared by:** Piranav (AIOS)

---

## Files Modified

| File | Change |
|---|---|
| `Staff-requirements/api/members-api.js` | Added `handleSajeepanAiChat()` function + `ai-chat` route |
| `Staff-requirements/pages/sajeepan.html` | Added floating chat button + panel UI + JS widget |

---

## API Route

```
POST /api/members-api?member=sajeepan&type=ai-chat
Body: { message?: string, history?: [{role, content}] }
```

**Daily brief (no message):** Auto-generates priority list from all 4 reqs
**Follow-up (with message):** Answers using same live data context + chat history

---

## DB Queries Run (in parallel via Promise.all)

| Query | Purpose |
|---|---|
| `campaign_performance JOIN campaigns` | Campaign ROAS, spend, revenue, conv, status |
| `product_performance JOIN merchant_products` | Top 5 revenue products |
| `product_performance` HAVING conv=0 AND cost>5 | Req 2 — wasteful products |
| `google_ads.search_terms` HAVING conv=0 AND cost>2 | Req 2 — negative kw candidates |
| `campaign_performance` (current + prev period) | Req 3 — performance drops |
| `product_performance` WHERE availability=out of stock | Req 3 — OOS still spending |
| `merchant_products` WHERE description short/null | Req 4 — feed issues |

---

## Groq API Integration

- **Provider:** Groq (free tier)
- **Env var:** `GROQ_API_KEY` (Vercel Production)
- **Model fallback chain:** `qwen/qwen3.6-27b` → `groq/compound` → `openai/gpt-oss-120b` → `openai/gpt-oss-20b`
- **Thinking mode disabled:** `reasoning_effort: 'none'` on qwen model
- **Think tag stripping:** `rawText.replace(/<think>[\s\S]*?<\/think>/gi, '')`

---

## Git Commits

| Commit | Description |
|---|---|
| `431f679` | feat(sajeepan): initial AI daily assistant — Gemini |
| `b439af7` | fix: update to gemini-2.0-flash |
| `62da884` | fix: Gemini model fallback chain |
| `ea63658` | fix: show full error detail in UI |
| `3a1ef88` | fix: remove system_instruction field |
| `2415620` | feat: switch from Gemini to Groq |
| `767db60` | fix: update Groq model |
| `e1eebb3` | fix: Groq model fallback chain |
| `5ae39b0` | fix: auto-discover Groq models |
| `82dfad2` | fix: use confirmed Groq models from account |
| `051b934` | feat: expand AI to all 4 requirements |
| `8849f76` | fix: parallel queries + frontend timeout |
| `d1c67d2` | fix: compress prompt to fit token limit |
| `3d8162b` | fix: disable Qwen thinking, action-only output |

---

## Issues Encountered & Resolved

| Issue | Root Cause | Fix |
|---|---|---|
| Gemini 404 | API key started with `AQ.` (wrong format — OAuth token, not API key) | Switched to Groq |
| Groq model 404/decommissioned | Model names changed | Auto-discover from live model list, then hardcoded confirmed models |
| 413 token limit | Full prompt too large for free models | Compressed to pipe-delimited compact format |
| Thinking output visible | Qwen3 model emits `<think>` blocks | `reasoning_effort:'none'` + regex strip |
| Stuck loading spinner | Sequential DB queries timing out | Parallel `Promise.all` + 55s frontend timeout |
