# Implementation — AI Prompt & Preference Learning Upgrade

**Date:** 2026-08-25
**Scope:** All 12 staff AI assistants (11 staff + Muguntha)
**Files changed:** `api/muguntha.js`, `api/members-api.js`, `api/requirement.js`, 12 HTML pages

---

## What Was Built

### 1. System Prompt Upgrade — All 12 AI Assistants

Applied to every staff system prompt:

#### URGENCY RANKING (role-specific)
Each staff AI now has a numbered priority order tailored to their role:

| Staff | #1 Priority |
|-------|------------|
| Sajeepan, Theekshy, Thivajini, Jefri, Thasitha, Mahima | OOS products still spending budget |
| Sonya | ROAS drop vs prior period |
| Hetheesha | High-revenue product + open tracker fix + low GSC impressions |
| Sukirtha | Products dropped to zero sales this month |
| Kamsi | Top-revenue product appearing in declining pages |
| Dilaksi | High-traffic pages with engagement rate below 20% |
| Muguntha | Staff missing EOD 2+ days in a row |

#### BEHAVIOUR RULES
Added to all prompts:
- Never say "I don't have that data"
- Never hallucinate numbers — only use exact figures from data
- Never use filler phrases ("Great question!", "Certainly!")
- Always name the specific person/campaign/product/metric
- Keep responses short and direct

#### OPENING FORMAT
Task card now uses emoji priority flags:
- 🔴 Critical/High urgency
- 🟡 Medium urgency
- 🟢 Low urgency

#### FOLLOW-UP FORMAT
Every follow-up response now ends with one clear action the staff member can take immediately.

---

### 2. Time-Aware Greeting — All 12 AI Assistants

**HTML widget (client-side):** `var _hr = new Date().getHours()` — uses browser time
**API system prompt (server-side):** `const _hr = new Date().getHours()` — uses server time

```js
const greeting = _hr < 12 ? 'Good morning' : _hr < 17 ? 'Good afternoon' : 'Good evening';
```

Applied to:
- 12 HTML pages (`pages/*.html`) — loading message while AI fetches
- `members-api.js` — 6 system prompts (Sajeepan, Hetheesha, Sonya, Sukirtha, Theekshy, Thivajini)
- `requirement.js` — 4 system prompts (Dilaksi, Jefri, Thasitha, Mahima)
- `muguntha.js` — 1 system prompt

---

### 3. Preference Learning System — All 12 AI Assistants

#### How It Works

```
New day detected (today's chat DB empty):
  1. Read yesterday's role='user' messages from chat table
  2. Send to AI for pattern analysis
  3. Save result as role='preference' in same table (session_date = yesterday)
  4. Fetch most recent preference row
  5. Inject into today's system prompt as LEARNED FROM PREVIOUS SESSIONS block
```

#### Shared Helper Functions

Added to `members-api.js` and `requirement.js`:

```js
async function analyseAndSavePreference(pool, tableName)
async function getLatestPreference(pool, tableName)
```

Added to `muguntha.js` (standalone, uses NVIDIA):
```js
async function analyseMugunthaPreference(client)
async function getMugunthaPreference(client)
```

#### DB Storage

No new tables. Reuses existing `*_ai_chat` tables with a new role value:

```
role = 'user'        → staff question (existing)
role = 'assistant'   → AI response (existing)
role = 'preference'  → daily learned pattern summary (new)
```

#### Analysis Model
- All staff: Groq `qwen3-32b`
- Muguntha: NVIDIA Nemotron-3-Ultra-550B (consistent with her primary model)

#### Silent Fail
If analysis errors for any reason, `learnedPreference = null` and AI works normally with standard prompt. No user-facing impact.

#### Coverage

| File | Staff | Preference |
|------|-------|-----------|
| muguntha.js | Muguntha | ✅ NVIDIA |
| members-api.js | Sajeepan, Hetheesha, Sonya, Sukirtha, Kamsi, Theekshy, Thivajini | ✅ Groq |
| requirement.js | Dilaksi, Jefri, Thasitha, Mahima | ✅ Groq |

---

## Commits

| Commit | Change |
|--------|--------|
| `955a502` | Time-aware greeting — all 12 HTML pages + 10 API system prompts |
| `a64152c` | Muguntha system prompt upgrade (urgency ranking, behaviour rules, emoji flags) |
| `2e2eef9` | All 10 staff system prompt upgrade (same pattern) |
| `8e4422f` | Kamsi system prompt upgrade |
| `b8936f9` | Preference learning — all 11 staff (members-api.js + requirement.js) |
| `43dc3f8` | Preference learning — Muguntha (muguntha.js) |
