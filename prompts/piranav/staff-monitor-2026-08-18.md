# Prompt — Staff Monitor Dashboard

**Date:** 2026-08-18
**Staff:** Piranav (admin)
**Session type:** New feature build

---

## Original Prompts (verbatim)

1. "understand the dashboard and tell me which user dashboard have fix tracker or any other optimize tracking system"

2. "ok now build new page i want to monitor there work there so plan it how to do then do and not need now jef and jacksan tell me what did you understand"

3. Confirmation of plan — "admin person can manage, not show other staff tap, 3 ignore"

4. "yes" (deploy)

5. "why it ask when i click staff monitor open login page" (bug report)

6. "muguntha..!" (add Muguntha as admin)

7. "prompts evidence validation implementation deployment closure capability is this update in aios..!"

---

## Requirements Extracted

- New `pages/monitor.html` — manager-only page to monitor all staff work
- Tab per staff member — admin sees all, regular staff sees own tab only
- Admins: Piranav, Kuberan, Muguntha
- Exclude Jefri and Jakshan
- Tracker staff (Hetheesha, Sajeepan): Monitor view + All Data view with filters + Export CSV
- Non-tracker staff: info card + Open Dashboard link
- No trend view required
- Staff Monitor link added to Piranav and Muguntha sidebars
