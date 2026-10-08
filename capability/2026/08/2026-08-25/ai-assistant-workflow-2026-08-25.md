# Capability — AI Assistant System (All Staff)

**Date:** 2026-08-25
**Applies to:** DM Dashboard (`digital-marketing-member-pages` Vercel project)

---

## New Capability: AI Assistant on Every Staff Dashboard

### What It Does

Every staff member's dashboard has a **floating AI button** (bottom-right corner). On click it:
1. Fetches today's live data from the business DB (campaigns, products, orders)
2. Returns a **short task card** — max 5 priority actions for today
3. On follow-up, gives a **full deep-dive** on whichever task the staff picks

This is a daily work prioritiser, not a generic chatbot.

### Staff Coverage

| Staff | Market | AI Data |
|-------|--------|---------|
| Kamsi | ledsone.co.uk | GSC impressions/clicks, missing meta titles/descs, product priority |
| Sukirtha | ledsone.co.uk | GSC top pages, keyword overlap, organic opportunity |
| Hetheesha | ledsone.co.uk | Fix tracker progress, conversion tracking status |
| Sonya | ledsone.co.uk | PMax ROAS, wasteful search terms, top converters |
| Sajeepan | ledsone.co.uk | Campaign performance, keyword automation |
| Dilaksi | ledsone.co.uk | SEO: low-engagement pages, high-priority products |
| Theekshy | ledsone.de | DE campaigns ROAS + prev period, top/wasteful products, OOS spending, negative KW candidates |
| Thivajini | ledsone.fr | FR campaigns ROAS + prev period, hero products, wasteful spend, OOS, Shopify FR orders |
| Jefri | ledsone.de + IT | DE+IT campaigns ROAS + prev period, top/wasteful products, OOS, Shopify DE orders |
| Thasitha | ledsone.de | DE campaigns (dynamic group_name='Thasi'), ROAS, wasteful, OOS |
| Mahima | ledsone.de | DE campaigns ROAS + prev period, top/wasteful products, OOS, Shopify DE orders |

### AI Model Chain

Provided by **Groq API** via `lib/groq.js`. Tries in order until one responds:

```
1. qwen/qwen3-32b        (primary)
2. llama3-70b-8192       (fallback)
3. llama-3.1-8b-instant  (fallback)
4. gemma2-9b-it          (last resort)
```

### Daily Reset Behaviour

Chat history filtered by `session_date = CURRENT_DATE`. Every new day = new task card automatically. No cron job, no manual reset.

### Session Restore

If staff reopens the panel on the same day, `prefetchHistory()` runs in parallel with the brief fetch. If today's history exists in DB, conversation is restored with "Session restored" message — no repeated brief.

### Preference Learning (added 2026-08-25)

All 12 AI assistants (11 staff + Muguntha) now learn from daily chat history:

1. New day detected (today's DB empty, yesterday has rows)
2. Yesterday's `role='user'` messages read from chat table
3. Sent to AI for pattern analysis — what did they always drill into?
4. Result saved as `role='preference'` in same table (no new table needed)
5. Next day's system prompt includes `LEARNED FROM PREVIOUS SESSIONS` block
6. AI personalises task card based on learned patterns

**Analysis model:** Groq (qwen3-32b) for all staff. NVIDIA Nemotron for Muguntha.
**Silent fail:** if analysis errors, AI works normally with standard prompt.
**Accumulates over time:** preference row from most recent day always wins.

### Prompt Intelligence (added 2026-08-25)

All 12 system prompts upgraded with:
- **URGENCY RANKING** — role-specific priority order (e.g. OOS > ROAS drop for Ads staff; revenue product + declining page for SEO staff)
- **BEHAVIOUR RULES** — no hallucination, no filler phrases, always name specific person/metric
- **Emoji priority flags** — 🔴 critical/high, 🟡 medium, 🟢 low on opening task card
- **Follow-up rule** — every response ends with one clear action to take right now

### Time-Aware Greeting (added 2026-08-25)

All 12 AI assistants (HTML widget + API system prompt) now use time-aware greeting:
- Before noon → "Good morning [Name]!"
- 12pm–5pm → "Good afternoon [Name]!"
- After 5pm → "Good evening [Name]!"

### Widget UI (Unified — All 11 Staff)

| Element | Spec |
|---------|------|
| Button | Fixed bottom-right, 56×56px, round, blue gradient |
| Gradient | `#1a73e8` → `#0d47a1` |
| Header | Same blue gradient, 🤖 emoji, "AI" red badge |
| Controls | Refresh (↻) button — no Clear button |
| Thinking | 3-dot pulse animation |
| Input | Auto-grow textarea, Shift+Enter for newline |
| Timeout | 90 seconds |
| Error messages | 3 fun variants: timeout 🐇, quota 🧠🌙, network 📡🔌 |

### Chat Storage

All 11 chat tables in `SJ_CHAT_DB_URL` (separate from business DB):
`kamsi_ai_chat`, `sukirtha_ai_chat`, `hetheesha_ai_chat`, `sonya_ai_chat`,
`sajeepan_ai_chat`, `dilaksi_ai_chat`, `theekshy_ai_chat`, `thivajini_ai_chat`,
`jefri_ai_chat`, `thasitha_ai_chat`, `mahima_ai_chat`

Tables are auto-created on first use — no manual DB setup needed.

### Adding a New Staff AI Assistant

1. Add chat functions (`getChatClient`, `handleChatHistory`, `handleChatSave`, `handleChatClear`) in `members-api.js` or `requirement.js`
2. Add AI handler using `pg.Pool` (not `pg.Client`) with `Promise.all` for parallel queries
3. Add routing inside existing member/fn block
4. Copy widget HTML from any current staff page — change only: member name, API URLs, hint text
5. Never create a new file in `api/` — Vercel 12-function limit already reached

### Staff Skill Profile System (added 2026-08-27)

Each staff member now has a permanent JSON skill profile in `Staff-requirements/staff_profiles/`. The AI loads this on every request and uses it to:

- Guide each person based on their actual working style and decision authority
- Tell the AI what they can decide alone vs escalate to Muguntha
- Give more explanation on topics they are less confident in
- Never suggest actions on markets they don't own
- Guide a backup or intern to work exactly the way the staff member would

**Profile structure:** 8 sections — identity, daily routine, core skills, decision authority, working style, thresholds, knowledge gaps, patterns (auto-learned).

**Current status (2026-08-28):** 4 profiles live — Sajeepan, Hetheesha, Thivajini (`members-api.js`), Thasitha (`requirement.js`). Sonya awaiting Muguntha threshold confirmation. Remaining 7 profiles not yet collected.

**Backup/intern mode:** When a staff member is away, the AI already has their full working knowledge loaded — the backup follows the AI's guidance and works exactly the same way.

### Full Documentation

`workflows/AI-ASSISTANT-WORKFLOW.md` — 23 sections covering model chain, two-stage flow, daily reset, session restore, DB connections, system prompt structure, all API routes, widget UI spec, how to add new staff, bugs fixed, prompt intelligence upgrade, preference learning, and staff skill profiles.
