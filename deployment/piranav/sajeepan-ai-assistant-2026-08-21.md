# Deployment — Sajeepan AI Daily Assistant

**Date:** 2026-08-21
**Deployed by:** Piranav (AIOS)
**Target:** Vercel Production — digital-marketing-member-pages

---

## Deployment Method

GitHub push → GitHub Actions (`vercel-deploy-hook.yml`) → Vercel Deploy Hook → Production

```bash
git push origin main
```

---

## Environment Variables Added

| Variable | Environment | Added |
|---|---|---|
| `GROQ_API_KEY` | Production | 2026-08-21 |

Added via Vercel Dashboard → Settings → Environment Variables.

---

## Commits Deployed

| Commit | Message |
|---|---|
| `431f679` | feat(sajeepan): add AI daily assistant chatbot powered by Gemini |
| `b439af7` | fix(sajeepan): update Gemini model to gemini-2.0-flash |
| `62da884` | fix(sajeepan): try multiple Gemini models with fallback chain |
| `ea63658` | fix(sajeepan): show full Gemini error detail in chat UI |
| `3a1ef88` | fix(sajeepan): remove system_instruction, embed prompt as first turn |
| `2415620` | feat(sajeepan): switch AI backend from Gemini to Groq |
| `767db60` | fix(sajeepan): update Groq model to llama3-70b-8192 |
| `e1eebb3` | fix(sajeepan): Groq model fallback chain - 4 models |
| `5ae39b0` | fix(sajeepan): auto-discover available Groq models from live API |
| `82dfad2` | fix(sajeepan): use confirmed Groq models from account |
| `051b934` | feat(sajeepan): expand AI context to all 4 requirements |
| `8849f76` | fix(sajeepan): parallel queries + frontend timeout + better errors |
| `d1c67d2` | fix(sajeepan): compress AI prompt to fit token limit |
| `3d8162b` | fix(sajeepan): disable Qwen thinking, action-only output format |

---

## Vercel Function Limits

- `api/members-api.js` already had `maxDuration: 300` — no change needed
- Total function count: 12 (Hobby plan limit) — no new functions added
- `GROQ_API_KEY` scoped to Production only

---

## Rollback

To remove the AI widget:
1. Revert commits back to before `431f679`
2. Push to main — auto-deploys
3. Remove `GROQ_API_KEY` from Vercel env vars
