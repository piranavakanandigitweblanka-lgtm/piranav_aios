# Capability — Sajeepan AI Daily Assistant

**Date:** 2026-08-21
**Capability type:** AI-powered staff assistant integrated into existing dashboard
**Prepared by:** Piranav (AIOS)

---

## Capability Demonstrated

### 1. AI Chat Widget (vanilla JS, no framework)
- Floating button + slide-up panel built in plain HTML/CSS/JS
- Auto-brief on open, follow-up Q&A, chat history (last 6 messages)
- 55-second timeout with user-friendly fallback message
- Markdown-to-HTML rendering for AI output

### 2. Multi-source DB Context for AI
- 7 parallel SQL queries across `google_ads.*` schema
- Covers campaign performance, product performance, merchant feed, search terms
- Period comparison (current vs previous) for trend detection
- Graceful `.catch(() => ({ rows: [] }))` on optional/uncertain tables

### 3. Groq API Integration (no SDK)
- Raw `fetch()` to Groq OpenAI-compatible endpoint
- 4-model fallback chain with per-model config overrides
- `reasoning_effort: 'none'` to disable Qwen3 thinking mode
- `<think>` block stripping from response

### 4. Token-efficient Prompt Engineering
- Compact pipe-delimited data format to stay under free-tier limits
- Action-only output format (numbered, specific, no preamble)
- Priority hierarchy enforced in prompt: OOS > drops > waste > feed

### 5. Chat History Persistence (Neon DB)
- `sajeepan_ai_chat` table auto-created on first use via `CREATE TABLE IF NOT EXISTS`
- Today-only retention — previous days purged automatically on each history fetch
- Two new API routes inside existing `members-api.js`: `ai-chat-history` (GET) and `ai-chat-save` (POST)
- Parallel fetch on open — history and brief race; history wins if session exists, saving full brief generation time
- Each message (user + assistant) saved to DB as it is sent/received

### 6. Groq Resilience
- `AbortController` per model attempt — hard timeout of 20s per model, prevents indefinite hangs
- Empty-content check — skips models that respond 200 OK but return blank content
- Model order: `qwen/qwen3.6-27b` (confirmed working) → `groq/compound` → `openai/gpt-oss-120b`

### 7. Zero Infrastructure Addition
- No new Vercel function (stays within 12-function Hobby limit)
- No new npm packages
- Two new env vars: `GROQ_API_KEY`, `SJ_CHAT_DB_URL`

---

## Reusability

This pattern can be applied to any other staff dashboard:

| Step | What to do |
|---|---|
| 1 | Add `handleXxxAiChat()` function in `members-api.js` |
| 2 | Write DB queries specific to that staff member's data |
| 3 | Build compact context summary |
| 4 | Call Groq with same model fallback chain |
| 5 | Copy chat widget HTML/CSS/JS to their `.html` page |

Estimated time to replicate for another staff member: **1–2 hours**

---

## Cost

| Item | Cost |
|---|---|
| Groq API | Free (14,400 req/day limit) |
| Vercel compute | Within existing plan |
| DB queries | Read-only + small chat writes, no extra cost |
| Neon chat storage | Same DB instance, no extra cost |
| **Total** | **£0/month** |

---

## Later Extensions (cross-references)

This capability represents the initial Sajeepan AI assistant build (Aug 21, 2026). Sajeepan's system was substantially extended in later sessions:

| Date | Extension | Evidence |
|---|---|---|
| 2026-09-09 | Bot Phase 1 + admin brief regeneration | `capability/2026/09/2026-09-09/bot-phase1-2026-09-09.md`, `capability/2026/09/2026-09-09/admin-brief-regeneration-2026-09-09.md` |
| 2026-09-09 | AI assistant rebuilt for dm-dashboard (separate system) | `capability/2026/09/2026-09-09/ai-assistant-2026-09-09.md` |
| 2026-09-09 | R3 gap repair (zero-conv dead zone, urgent OOS, low-stock band) | `closure/README.md — 2026-09-09 Sajeepan R3 Gap Repair` |
| 2026-09-10 | R3 full field parity pass | `closure/README.md — 2026-09-10 Sajeepan R3 Full Field Parity` |
| 2026-09-18 | R3 OOS filter/pagination fix + R4 advanced filters | `closure/README.md — 2026-09-18` |
| 2026-09-25 | Non-sale product scope + Ads product scope admin page | `capability/2026/09/2026-09-25/ads-product-scope-admin-page.md` |

**Note:** The Aug 21 capability covers the Sajeepan AI assistant in `Staff-requirements-02` (vanilla JS, Vercel). The Sep 09+ capabilities cover a different implementation in `dm-dashboard` (React + Python backend). These are separate but related systems.

---

## Last Updated
2026-10-08
