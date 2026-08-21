# Prompt — Sajeepan AI Daily Assistant

**Date:** 2026-08-21
**Staff:** Sajeepan
**Feature:** AI Daily Priority Assistant — Chat Widget on Dashboard
**Prepared by:** Piranav (AIOS)

---

## User Request

> "I want to add an AI assistant chatbot to Sajeepan's dashboard. It will understand his dashboard data and daily guide what work he wants to do, priority wise."

---

## Scope

Build a floating AI chat widget on `pages/sajeepan.html` that:
- Auto-generates a daily priority briefing when opened (no typing needed)
- Pulls live data from all 4 of Sajeepan's requirements (campaigns, waste, revenue protection, feed)
- Gives numbered action items — what to do RIGHT NOW in Google Ads with real £ and % figures
- Allows follow-up questions in plain English
- Powered by Groq API (free tier, llama/qwen models)

---

## Constraints

- Vercel Hobby plan: max 12 serverless functions — cannot add new API file
- AI route added inside existing `api/members-api.js` as `?member=sajeepan&type=ai-chat`
- No new npm packages — Groq called via raw `fetch()`
- Prompt must stay compact (under token limit for free models)
- No thinking/reasoning output — action items only

---

## API Key Setup

- Provider: Groq (console.groq.com) — free tier, no credit card
- Env var: `GROQ_API_KEY` in Vercel Production
- Models tried (in fallback order): `qwen/qwen3.6-27b` → `groq/compound` → `openai/gpt-oss-120b` → `openai/gpt-oss-20b`

---

## Data Context Fed to AI

| Req | Data |
|---|---|
| Req 1 | All campaign ROAS vs targets, revenue, spend, conv, trend vs prev period, top 3 products |
| Req 2 | Zero-conv products (spend > £5), negative keyword candidates |
| Req 3 | OOS products still spending, campaigns with sudden revenue/ROAS drops |
| Req 4 | Products with weak feed (missing/short description or category) |
