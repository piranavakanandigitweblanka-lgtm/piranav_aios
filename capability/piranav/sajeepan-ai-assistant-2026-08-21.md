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

### 5. Zero Infrastructure Addition
- No new Vercel function (stays within 12-function Hobby limit)
- No new npm packages
- No new DB tables
- One new env var (`GROQ_API_KEY`)

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
| DB queries | Read-only, no extra cost |
| **Total** | **£0/month** |
