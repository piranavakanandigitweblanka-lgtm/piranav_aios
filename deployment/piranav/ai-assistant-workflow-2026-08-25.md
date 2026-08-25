# Deployment — AI Assistant System (All Staff)

**Date:** 2026-08-25
**Task:** Build AI assistants for 5 remaining staff + unify all 11 widgets + fix Kamsi

---

## Deployment Pipeline

```
git add → git commit → git push origin main
       ↓
GitHub → Vercel auto-deploy (triggered on push to main)
       ↓
Vercel builds + deploys to production
```

---

## Commits

| Commit | Description |
|--------|-------------|
| Earlier sessions | feat: Theekshy + Thivajini AI handlers added to members-api.js |
| Earlier sessions | feat: Jefri + Thasitha + Mahima AI handlers added to requirement.js |
| Earlier sessions | feat: unified blue UI deployed to all 11 staff pages |
| Earlier sessions | feat: fun error messages deployed to all 11 pages |
| `0e0d0c8` | fix(kamsi,sukirtha): fix literal newline in formatAiText regex that crashed script block |

---

## Environment Variables Used

| Variable | Purpose |
|----------|---------|
| `GROQ_API_KEY` | Groq AI API — model chain in `lib/groq.js` |
| `DATABASE_URL` | Business data — Google Ads, Shopify orders, merchant products |
| `SJ_CHAT_DB_URL` | Chat history — all 11 `*_ai_chat` tables |

---

## Live Routes

All routes live on the `digital-marketing-member-pages` Vercel project:

| Staff | Route |
|-------|-------|
| Kamsi | `/api/members-api?member=kamsi&type=ai-chat` |
| Sukirtha | `/api/members-api?member=sukirtha&type=ai-chat` |
| Hetheesha | `/api/members-api?member=hetheesha&type=ai-chat` |
| Sonya | `/api/members-api?member=sonya&type=ai-chat` |
| Sajeepan | `/api/members-api?member=sajeepan&type=ai-chat` |
| Dilaksi | `/api/requirement?fn=dilaksi-ai-chat` |
| Theekshy | `/api/members-api?member=theekshy&type=ai-chat` |
| Thivajini | `/api/members-api?member=thivajini&type=ai-chat` |
| Jefri | `/api/requirement?fn=jefri-ai-chat` |
| Thasitha | `/api/requirement?fn=thasitha-ai-chat` |
| Mahima | `/api/requirement?fn=mahima-ai-chat` |
