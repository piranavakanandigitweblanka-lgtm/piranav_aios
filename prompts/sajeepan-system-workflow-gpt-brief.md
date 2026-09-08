# Prompt: Sajeepan System Workflow — GPT Brief

**ID:** sajeepan-system-workflow-gpt-brief  
**Created:** 2026-09-08  
**Purpose:** Explain Sajeepan's dm-dashboard system to GPT so it can review, advise, or extend it  
**Status:** ACTIVE

---

## Prompt

```
I'm going to explain how Sajeepan's work system works inside our internal staff dashboard (dm-dashboard). Understand this fully before I ask you anything.

---

WHO IS SAJEEPAN?
Sajeepan is a Google Ads Specialist managing ledsone.co.uk (UK market).
His job: drive profitable UK e-commerce growth through Google Shopping campaigns.
He reports to Muguntha.
His core benchmarks: ROAS 300% minimum, 400% target. Waste threshold: £5+ spend with 0 conversions = exclude product.

---

THE DASHBOARD — 4 REQUIREMENT PAGES

Sajeepan has 4 live data pages in his dashboard, each pulling from Google Ads + Shopify:

REQ 1 — Product Intelligence
- Shows all campaigns + product-level performance
- Data: spend, ROAS, conversions, impressions, CTR
- Period: last 30 days vs prior 30 days
- Used for: spotting ROAS drops, scaling winners, reviewing product-level waste

REQ 2 — Revenue Protection & Search Term Analysis  
- Wasteful search terms: £2+ spend, 0 conversions → add as negatives
- Wasteful products: £5+ spend over 7 days, 0 conversions → exclude
- Used for: daily waste recovery

REQ 3 — PPC Action Dashboard
- OOS bestsellers still spending budget (Conv value > £1, stock = 0)
- High-spend zero-conversion products
- Used for: stopping wasted budget on out-of-stock items

REQ 4 — Feed Optimization Tracker
- Level 1: products with zero conversions still spending (154 today)
- Level 2: very low ROAS products (22 today)
- Level 3: high impressions, zero clicks (28 today)
- Used for: systematic feed improvement tracking

---

THE AI BRIEF — HOW IT WORKS

Every morning when Sajeepan opens "My Tasks", the system:

1. Calls all 4 req pages to get live data
2. Sends the real numbers to Gemini AI with a system prompt
3. Gemini generates a JSON brief — max 5 tasks, priority ordered
4. A validation gate checks every task: the AI can only assign tasks based on real items from the live data (no hallucinated products or made-up spend figures)
5. The validated tasks are shown as task cards on Sajeepan's page

TASK PRIORITY ORDER:
🔴 High — OOS products still burning budget (stop spend now)
🔴 High — Products with £5+ waste, 0 conversions (exclude/pause)
🟡 Medium — ROAS drop in campaigns vs prior period
🟡 Medium — Wasteful search terms to add as negatives
🟢 Low — Feed optimization (Level 1/2/3 tracker review)

---

TASK SELECTION & TRACKING

When Sajeepan selects a task:
- It is saved to the database with status: in_progress
- It appears in his "Today's Progress" table
- When he marks it done, he writes a completion note
- The system auto-verifies: checks Google Ads change event history for real account activity
- Muguntha (his manager) sees all tasks in TeamTaskMonitor and can approve or reject

---

DAILY RESET

- Each calendar day = fresh brief (chat history filtered by today's date)
- New day → brief auto-generates on first open
- Task log also resets daily — yesterday's tasks don't carry over

---

VALIDATION GATE (important)

The AI cannot invent tasks. Before any task reaches Sajeepan:
- Every task must reference a real candidate_id (real product, campaign, or search term from today's live data)
- If the AI makes up a product or wrong item ID → task is rejected automatically
- Only grounded, verified tasks reach the task cards

---

CURRENT STATE (as of 2026-09-08)
- 34 feed optimization items tracked (Level 1: 23, Level 2: 3, Level 3: 8)
- 45 OOS bestsellers detected still spending
- 126 wasteful search terms (£2+ spend, 0 conv)
- 30 wasteful products (£5+ spend, 0 conv)
- All 4 req pages live and returning data
- AI brief working and validated

---

Now ask me your question or tell me what you want to review/build.
```
