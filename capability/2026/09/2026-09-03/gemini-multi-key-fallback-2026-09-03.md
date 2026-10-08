---
name: gemini-multi-key-fallback-2026-09-03
description: Gemini API multi-key fallback — auto-switches to next API key on 429 quota exhaustion
metadata:
  type: capability
  date: 2026-09-03
  status: PASS
---

# Gemini Multi-Key Fallback System

**Date:** 2026-09-03
**Status:** PASS — Live on production

---

## Problem

All 13 AI assistants share one `GEMINI_API_KEY`. When daily free quota is exhausted, every staff AI brief returns a 429 error. Staff cannot work until quota resets at midnight.

---

## Solution Built

`call_gemini()` in `ai_shared.py` now cycles through multiple API keys on 429. Each key belongs to a different Google account = separate quota pool.

**Fallback order:**
```
GEMINI_API_KEY   → Key 1 (existing, original)
GEMINI_API_KEY_2 → Key 2 (added 2026-09-03)
GEMINI_API_KEY_3 → Key 3 (slot ready, add when available)
```

On 429 from Key 1 → instantly tries Key 2. On 429 from Key 2 → tries Key 3. Staff never see an error.

---

## Key Config on Server

```
/var/www/dashboard-dm/backend/.env

GEMINI_API_KEY=<key-1-redacted>    ← Key 1 (original)
GEMINI_API_KEY_2=<key-2-redacted>  ← Key 2 (added 2026-09-03)
```

To add Key 3: `echo 'GEMINI_API_KEY_3=...' >> /var/www/dashboard-dm/backend/.env` then restart service.

---

## Model Fix (same session)

Discovered `gemini-2.0-flash` is retired. Reverted to `gemini-3.6-flash`.

```python
GEMINI_MODEL = "gemini-3.6-flash"  # correct, current
```

---

## Files Changed

| File | Change |
|---|---|
| `backend/app/ai_shared.py` | Replaced `_gemini_url()` with `_get_keys()`, rewrote `call_gemini()` to cycle keys on 429, fixed model name |

---

## How to Add More Keys

1. Create a new Google account → go to aistudio.google.com → Get API Key
2. SSH to server: `echo 'GEMINI_API_KEY_3=YOUR_KEY' >> /var/www/dashboard-dm/backend/.env`
3. `systemctl restart dm-dashboard`
4. No code change needed — `_KEY_ENV_NAMES` already includes slot for key 3

---

## Server Verification

```
Service restarted at 06:46:07
No 502 / 404 / Gemini errors after restart
/api/task-log/today hitting 200 OK every 30s
Model: gemini-3.6-flash confirmed active
```

**Commits:** `eb60cc6` (fallback build), `528f6ab` (model fix)
