---
name: kamsi-dilaksi-ai-assistant-2026-09-02
description: New capability — AI daily brief built for Kamsi (UK SEO) and Dilaksi (UK/USA SEO) using live GSC, GA4, and Shopify data
metadata:
  type: capability
---

# Capability — Kamsi & Dilaksi AI Daily Brief

**Date:** 2026-09-02
**Engineer:** Piranav
**Type:** New AI assistant feature — reusing existing backend pattern

---

## Capability Demonstrated

Built and deployed AI daily brief assistants for two SEO staff members (Kamsi and Dilaksi) by reading their skill profile files and mapping their daily routines to live data sources already available in the backend.

---

## Skills Used

### Reading Skill Profile Files
- Extracted CTR thresholds, decision authority, escalation rules, and working style from `.txt` skill profiles
- Translated these into AI system prompt instructions tailored to each person

### Backend AI Pattern (FastAPI)
- Replicated the `sukirtha_ai.py` pattern for two new staff members
- Data gathering with 5-minute cache (`_data_cache` + TTL)
- Gemini API calls via `ai_shared.call_gemini`
- Chat history stored in PostgreSQL via `ensure_chat_table`, `save_message`, `get_today_history`
- Tables created automatically on first use — no manual DB setup needed

### Kamsi AI Data Sources
- `kamsi._req2_payload` — Low CTR pages from Google Search Console (threshold: 2%)
- `kamsi._req5_payload_compute` — Missing meta titles/descriptions from Shopify UK
- `kamsi._req1_job` — Slow-moving products (90-day, stock > 100, units sold < 10)

### Dilaksi AI Data Sources
- `dilaksi._req1_payload` — GA4 organic sessions, purchases, revenue (30-day)
- `dilaksi._req2_payload_compute` — Product priority summary (High/Medium/Low)

### Frontend Integration
- Added `DailyBriefWidget` import and render to `KamsiLayout.jsx` and `DilaksiLayout.jsx`
- No new component needed — reused existing `DailyBriefWidget`

### main.py Router Registration
- Added `kamsi_ai_router` and `dilaksi_ai_router` imports and `include_router` calls

---

## Reusable Pattern — Add AI Brief to Any Staff Member

1. Read their skill profile — extract CTR thresholds, markets owned, escalation rules
2. Identify which existing backend functions return their key daily data
3. Copy `sukirtha_ai.py` structure — update TABLE name, prefix, data gathering, system prompt
4. Add import + `include_router` to `main.py`
5. Add `DailyBriefWidget` to their Layout.jsx with correct `apiBase`
6. Commit, push, run `deploy.sh` on server

---

## Files Created

| File | Purpose |
|---|---|
| `backend/app/kamsi_ai.py` | Kamsi AI backend — routes, data gather, system prompt |
| `backend/app/dilaksi_ai.py` | Dilaksi AI backend — routes, data gather, system prompt |
| `backend/app/main.py` | Updated — both routers registered |
| `frontend/src/kamsi/KamsiLayout.jsx` | Updated — DailyBriefWidget added |
| `frontend/src/dilaksi/DilaksiLayout.jsx` | Updated — DailyBriefWidget added |
