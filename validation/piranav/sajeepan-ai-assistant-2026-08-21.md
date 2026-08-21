# Validation — Sajeepan AI Daily Assistant

**Date:** 2026-08-21
**Validated by:** Piranav (AIOS)

---

## Checklist

| # | Check | Result |
|---|---|---|
| 1 | `node --check api/members-api.js` — syntax clean | PASS |
| 2 | `ai-chat` route correctly routed inside `handleSajeepan()` | PASS |
| 3 | All 6 DB queries run in parallel via `Promise.all` | PASS |
| 4 | `search_terms` query has `.catch(() => ({ rows: [] }))` — safe if table missing | PASS |
| 5 | `campPrevRows` query has `.catch(() => ({ rows: [] }))` — safe fallback | PASS |
| 6 | `GROQ_API_KEY` confirmed in Vercel Production environment | PASS |
| 7 | Groq model fallback chain — 4 models tried in order | PASS |
| 8 | `<think>` blocks stripped from response via regex | PASS |
| 9 | `reasoning_effort: 'none'` set on qwen model | PASS |
| 10 | Chat widget opens and auto-generates daily brief | PASS |
| 11 | Brief shows numbered action items with real £/% figures | PASS |
| 12 | Follow-up questions answered using live data context | PASS |
| 13 | 55-second frontend timeout prevents infinite loading state | PASS |
| 14 | Refresh button (↻) regenerates brief | PASS |
| 15 | `git push` → GitHub Actions → Vercel deploy READY | PASS |

---

## Live Test Result

**Opened AI chat on sajeepan.html:**
- Brief generated in ~8 seconds
- Output: numbered priority actions referencing real campaign names and £ figures
- No `<think>` blocks visible
- No German text in output
- Follow-up question tested: responded correctly using context data

---

## Phase 2 Checklist — Chat History Persistence

| # | Check | Result |
|---|---|---|
| 16 | `sajeepan_ai_chat` table auto-created on first use | PASS |
| 17 | `ai-chat-history` route returns today's messages | PASS |
| 18 | `ai-chat-save` route persists role + content to DB | PASS |
| 19 | Previous days' rows deleted on history fetch | PASS |
| 20 | Panel open → restores today's session without regenerating brief | PASS |
| 21 | History and brief fetch run in parallel (no sequential delay) | PASS |
| 22 | `SJ_CHAT_DB_URL` added to Vercel Production | PASS |
| 23 | AbortController 20s timeout per Groq model — no infinite hangs | PASS |
| 24 | Empty-content models skipped, falls through to next in chain | PASS |
| 25 | Frontend timeout increased to 90s | PASS |

---

## Known Limitations

| Item | Status |
|---|---|
| `google_ads.search_terms` table may not exist in DB — returns empty silently | Acceptable |
| Feed query (Req 4) catches on error — returns empty silently | Acceptable |
| Chat history limited to last 6 messages (3 exchanges) sent to AI | By design — token limit |
| AI cannot make changes in Google Ads — advisory only | By design |
| Groq free tier: 14,400 req/day limit | Sufficient for 1 staff member |
| `openai/gpt-oss-20b` returns empty content — dropped from model chain | Known, removed |
