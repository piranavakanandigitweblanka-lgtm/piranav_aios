# Level 4C — Ads Product Scope Design Validation [2026-09-25]

## Checklist

| # | Check | Result |
|---|---|---|
| 1 | Level 4A evidence read before starting design | PASS |
| 2 | AdminLayout.jsx ADMIN_ITEMS structure read (lines 1–340+) | PASS |
| 3 | DmCampaign.jsx table + filter + CSV pattern read | PASS |
| 4 | admin_dm_campaign.py backend pattern read | PASS |
| 5 | auth.py verify_admin_token confirmed | PASS |
| 6 | main.py router registration pattern read | PASS |
| 7 | Jefri normalization pattern confirmed in design SQL | PASS |
| 8 | Business DB pool constraint (max 4) documented | PASS |
| 9 | Auth model (admin/dev only) documented | PASS |
| 10 | Group A (693) and Group B (25) counts verified against Phase 3 / Level 4A evidence | PASS |
| 11 | All confirmed business rules from Level 4A carried into design | PASS |
| 12 | Multi-staff extension path documented (Section 13) | PASS |
| 13 | Open decisions requiring approval listed (Section 15) | PASS |
| 14 | File change summary complete — new files + modified files listed (Section 16) | PASS |
| 15 | No code files created | PASS |
| 16 | No routes created | PASS |
| 17 | No DB tables created | PASS |
| 18 | No existing files modified | PASS |
| 19 | Design document saved to AIOS docs folder | PASS |
| 20 | Prompt file saved to prompts/sajeepan/ | PASS |

## Design Document Location

`docs/dm-dashboard/ads-product-scope-level4c-design-2026-09-25.md`

## Sections Produced

16 sections + appendix:
1. Purpose and Scope
2. Product ID Normalization
3. Data Sources
4. Backend Endpoint Design
5. Core SQL Query Design
6. Background Snapshot
7. Frontend Component
8. CSV Export
9. Group Classification Logic
10. Auth Model
11. Snapshot vs Live Query Decision
12. Error Handling
13. Multi-Staff Extension Path
14. Constraints and Non-Goals
15. Open Decisions
16. File Change Summary
+ Appendix: CSS Classes Reference

## Safety Confirmation

**Code changed:** NO
**Database changed:** NO
**Dashboard deployed:** NO
**Business DB pool raised:** NO
**New app DB tables:** NO

## Open Decisions (Blocking Level 5)

5 decisions require Piranav/GPT confirmation before implementation begins:
1. Group B default view (include or exclude OOS)
2. Rolling window default (7d / 30d / 90d)
3. Nav section placement
4. Snapshot refresh interval
5. Export scope (all vs filtered)
