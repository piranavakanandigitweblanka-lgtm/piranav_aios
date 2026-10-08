# Capability: dm-dashboard AI Fallback Chain — Groq Fix + NVIDIA NIM (2026-09-03)

**Date:** 2026-09-03
**Project:** dm-dashboard
**File:** `backend/app/ai_shared.py`

---

## What Was Done

### Problem
dm-dashboard AI assistant was completely broken on the live server. Error:
> `Could not load your daily brief: Groq 400: llama-3.1-70b-versatile decommissioned`

Groq decommissioned `llama-3.1-70b-versatile`. Subsequent attempts with `llama-3.3-70b-versatile` and `llama3-70b-8192` also failed (both decommissioned/absent).

### Fix 1 — Groq Model Updated
Queried Groq `/v1/models` API to find available models. All llama models were gone.
Switched to: `qwen/qwen3.6-27b`

```python
GROQ_MODEL = "qwen/qwen3.6-27b"
```

### Fix 2 — NVIDIA NIM Added as Third Fallback
Added NVIDIA NIM as the final fallback after Gemini (all 3 keys) → Groq both fail.

```python
NVIDIA_MODEL = "meta/llama-3.3-70b-instruct"
_NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

def _call_nvidia(messages):
    key = os.environ.get("NVIDIA_API_KEY", "").strip()
    ...
    r = requests.post(_NVIDIA_URL, headers={"Authorization": f"Bearer {key}", ...},
        json={"model": NVIDIA_MODEL, "messages": messages, "max_tokens": 1024}, timeout=60)
    if r.ok:
        import re
        text = r.json()["choices"][0]["message"]["content"]
        text = re.sub(r"<think>.*?</think>\s*", "", text, flags=re.DOTALL).strip()
        return {"ok": True, "text": text}
```

### Fix 3 — Strip `<think>` Blocks from NVIDIA Responses
`meta/llama-3.3-70b-instruct` returns chain-of-thought `<think>...</think>` blocks before the actual answer. These were stripped with regex before returning to the frontend.

---

## Full Fallback Chain (after fixes)

1. Gemini Key 1 (`GEMINI_API_KEY`) — 3 retries on 500/503
2. Gemini Key 2 (`GEMINI_API_KEY_2`) — 3 retries
3. Gemini Key 3 (`GEMINI_API_KEY_3`) — slot ready, key not yet provided
4. Groq (`GROQ_API_KEY`) — model: `qwen/qwen3.6-27b`
5. NVIDIA NIM (`NVIDIA_API_KEY`) — model: `meta/llama-3.3-70b-instruct`, think blocks stripped

---

## Server Env Required

Add to `/var/www/dashboard-dm/backend/.env`:
```
NVIDIA_API_KEY=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
```

---

## Verification

Server curl test after merge:
```bash
curl -s -X POST http://localhost:8499/api/jefri/ai/brief | python3 -m json.tool
```
Result: `"ok": true` with clean task card (no `<think>` blocks).

---

## Commits

- dm-dashboard repo: `piranv-work` branch → merged to `main`
- Groq fix: committed, merged
- NVIDIA add: committed, merged  
- Think block strip: committed, merged as `7137f01`
