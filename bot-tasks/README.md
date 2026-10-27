# Bot Tasks — Main Folder
**Location:** `piranav_aios/bot-tasks/`
**Last updated:** 2026-10-27

This is the single folder for all bot-assigned tasks. Two types of tasks live here:

---

## Folder Types

| Type | Naming | Example | Source |
|---|---|---|---|
| BOT investigation tasks | `BOT-[YYYYMMDD]-[topic]/` | `BOT-20261019-locale-hreflang/` | Assigned via AIOS coordinator |
| PH sheet tasks | `C[N]-[topic]/` or `G[N]-[topic]/` | `C5-ga4-tracking/` | Assigned via PH daily work sheet |

---

## All Tasks

### BOT Investigation Tasks
| Folder | Date | Topic | Status |
|---|---|---|---|
| `BOT-20261019-locale-hreflang/` | 2026-10-19 | Locale/hreflang fix — PL pages in UK GSC | CLOSED ✓ |

### PH Sheet Tasks (Piranav — 2026-10-27)
| Folder | Task | Due | Status |
|---|---|---|---|
| `C1-eod-not-delivered/` | EOD not submitted by 15:00 — write reason + proof | TODAY | PENDING |
| `C4-uk-impressions-ctr/` | Turn UK impressions into clicks on worst pages | Fri 30 Oct | BLOCKED |
| `C5-ga4-tracking/` | Fix GA4 purchase tracking on ledsone.co.uk | Fri 30 Oct | 50% |
| `C6-de-ctr-decline/` | Stop DE CTR decline (1.24% → 1.10%) | 02 Nov | OPEN |

---

## Daily Sheet Check
**Sheet URL:** https://qobwxdaazzcmpwcjycyy.supabase.co/functions/v1/ph-sheet-feed?k=f4a2e86d113874ea1c72c542c2fc17cd&v=page

Every session:
1. Pull latest tasks from the sheet
2. Check for new / changed / closed tasks
3. Create new subfolder for any new task
4. Update task status in this README
5. Build report + embed screenshots for investigated tasks
6. Generate .docx evidence file per task

---

## Folder Structure

```
bot-tasks/
├── README.md                          ← this file — updated every session
├── BOT-20261019-locale-hreflang/      ← CLOSED — hreflang fix Oct 2026
│   ├── 00_project-overview/
│   ├── 01_investigation/
│   ├── 02_validation/
│   ├── 03_evidence/
│   └── 99_closure/
├── C1-eod-not-delivered/              ← PENDING
│   └── report.md
├── C4-uk-impressions-ctr/             ← BLOCKED
│   └── report.md
├── C5-ga4-tracking/                   ← 50% IN PROGRESS
│   ├── report.md
│   ├── C5-GA4-Tracking-Investigation-2026-10-27.docx
│   └── screenshots/ (9 files)
└── C6-de-ctr-decline/                 ← OPEN (due 02 Nov)
    └── report.md
```
