---
name: muguntha-budget-alerts-phase3-discovery
description: Phase 3 discovery prompt for Muguntha Budget Alerts — early budget change monitoring via google_ads_change_events. Read-only inspection of schema, sync frequency, dedup strategy, ROAS data source, and implementation plan.
metadata:
  type: prompt
---

# Prompt: Budget Alerts Phase 3 — Early Budget Change Monitoring Discovery

## Context

DM Dashboard — Muguntha Budget Alerts system. Phase 1 (rule correction) and Phase 2 (Run Now + Telegram removal) are complete and uncommitted.

Phase 3 objective: Detect campaign budget modifications that occur before the campaign's next 30-day review date and immediately notify Muguntha via Discord.

## What to Inspect

DISCOVERY ONLY — no code changes, no DB changes, no commits, no Discord messages.

1. Git branch, remotes, working-tree safety
2. `google_ads.google_ads_change_events` actual schema and records
3. Sync frequency (lag between change_date_time and created_at)
4. Deduplication keys
5. Which customer_ids are in Muguntha scope
6. How ROAS and conversions are retrieved for a campaign
7. How to determine the "last budget modification date" for a campaign
8. Existing Discord notification mechanism
9. How to distinguish early changes from post-review changes
10. Existing AIOS documentation — update with findings

## Expected Output

1. Git safety report
2. Existing architecture
3. Actual change-event schema
4. Event sync frequency
5. Deduplication strategy
6. ROAS and conversion data source
7. Proposed alert logic
8. Potential duplicate or missed alert risks
9. Exact files requiring modification
10. Implementation plan and test plan

## Important Constraints

- Never modify Google Ads budgets
- Never pause or enable campaigns
- Never block manual budget changes
- Never automatically approve or reject changes
- Alert is informational only — explain whether change follows or differs from recommendation
- Do not label every change as a violation
