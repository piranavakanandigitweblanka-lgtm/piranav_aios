# Organic Discovery — Piranav AIOS Project

## Purpose

This project manages Piranav's LEDSone Organic Discovery work: making ledsone.co.uk and dcvoltage.co.uk easier to find on Google and in AI assistants (ChatGPT, Gemini, Claude), so more customers find us without paid adverts.

Piranav is responsible for all ledsone.co.uk implementation tasks assigned to him. Muguntha approves work.

---

## Source Document

**LEDSone Organic Discovery: Rules, Recommendations and Results Log**
Last updated: Sunday 4 October 2026, ~20:15 UK time.

---

## Workflow

```
Task identified in source document
        ↓
Task registered in 00_master/Organic_Discovery_Task_Register.md
        ↓
Before screenshot saved → <task-folder>/before/
        ↓
Implementation (Shopify / theme)
        ↓
After screenshot saved → <task-folder>/after/
        ↓
Live verification (the live page must show the change)
        ↓
Evidence recorded → <task-folder>/evidence/
        ↓
Approval from Muguntha (where required)
        ↓
Word completion report → <task-folder>/completion/<CODE>_Completion_Report.docx
        ↓
Master register updated
        ↓
14-day measurement recorded
```

---

## Task Status Definitions

| Status | Meaning |
|---|---|
| NOT STARTED | Registered but work has not begun |
| IN PROGRESS | Implementation or research is happening |
| VERIFICATION | Implementation finished, live verification pending |
| COMPLETED | Live page verified, evidence recorded, completion report created |
| BLOCKED | A dependency, person, or decision is preventing completion |

A task is **never** marked COMPLETED until:
- The live page shows the change
- Screenshots (before and after) exist
- Evidence is recorded
- Completion report is created

---

## Folder Structure

```
organic-discovery/
│
├── README.md                        ← this file
│
├── 00_master/
│   ├── Organic_Discovery_Task_Register.md   ← central tracker
│   ├── Organic_Discovery_Rules.md           ← rules from source doc
│   ├── Current_Status.md                    ← live summary
│   └── Change_Log.md                        ← all changes logged
│
├── 01_CC-01_conduit_collection_seo/
│   ├── task.md
│   ├── prompts/
│   ├── before/
│   ├── evidence/
│   ├── after/
│   └── completion/
│
├── 02_CC-02_conduit_guide_links/
│   ├── task.md
│   ├── prompts/
│   ├── before/
│   ├── evidence/
│   ├── after/
│   └── completion/
│
└── future-tasks/
    └── (new task folders created here when work starts)
```

---

## Screenshot Rules

- **Before** screenshots → `<task-folder>/before/` — capture before any change
- **After** screenshots → `<task-folder>/after/` — capture after live change
- Always record: page URL, date/time captured, screenshot filename
- Never overwrite old screenshots
- Never create fake screenshots

---

## Word Completion Report Rule

A `.docx` completion report is created **only after**:
1. Implementation complete
2. Live verification done
3. Before and after screenshots exist
4. Approval received (where required)

File location: `<task-folder>/completion/<CODE>_Completion_Report.docx`

---

## Ownership

| Role | Name | Responsibility |
|---|---|---|
| Implementation (ledsone.co.uk) | Piranav | Makes the changes |
| Approver | Muguntha | Approves and ensures completion |
| Measurement bot | Organic Discovery bot | Checks live pages, never changes sites |
