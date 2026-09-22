---
name: mahima-r2-removal-ai-brief-scope-fix
description: Remove a requirement staff doesn't use from AI brief — data fetch, system prompt section, priority list, brief_data block, and candidate registry
metadata:
  type: implementation
---

# Prompt: Remove Unused Requirement from Staff AI Brief

## When to Use
A staff member's AI brief includes data from a requirement they don't actually work on. The brief gives them irrelevant tasks from that data source.

## What to Do

For staff `{staff_name}`, requirement `{req_id}` is not part of their workflow. Remove it fully from the AI brief:

1. **`{staff}_ai.py` — `_gather_data()`**: Delete the entire DB query block that fetches data for that requirement. Remove the key from the returned `result` dict.

2. **`{staff}_ai.py` — `_build_system_prompt()`**: Delete the variable building the display lines for that data, and remove the section from the f-string prompt body.

3. **`{staff}_ai.py` — priority order list**: Remove the priority item that references that requirement.

4. **`{staff}_ai.py` — `_build_brief_data()`**: Remove the `if data.get(...)` block that builds the brief_data card for that requirement.

5. **`ai_validator.py` — `build_candidate_registry()`**: Remove the loop that registers candidates from that data source. Also remove the `_calc_backend_priority()` branch for that business_rule if one exists.

6. **File header docstring**: Update data source list to remove the requirement and renumber proxies if needed.

## Applied Example
- Staff: Mahima (ledsone.de Google Ads)
- Removed: R2 (Stock Management) — `low_stock_products` data
- Kept: R1 (Product Performance), R3 (Search Terms), R4 (Feed Gap / Product ID Coverage)
- Commit: `2a35f7b` on `websitetecteam-arch/dm-dashboard` piranv-work
