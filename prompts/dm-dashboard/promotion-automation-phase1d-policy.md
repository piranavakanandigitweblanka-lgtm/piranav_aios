---
name: promotion-automation-phase1d-policy
description: Phase 1D — extract promotion policy requirements from Nishani_Promotion_Multi_Channel.docx, resolve discount conflicts, validate data gaps, produce rules-ready-vs-blocked matrix
metadata:
  type: reusable
  category: discovery
  project: dm-dashboard
  phase: 1D
  date: 2026-10-15
---

# Prompt: Promotion Automation Phase 1D — Policy Extraction and Business Rule Validation

## Context
- Policy document: `C:\Users\PC\Downloads\Nishani_Promotion_Multi_Channel.docx`
- AIOS ROOT: `C:\Users\PC\Documents\piranav_aios`
- Previous phases: 1A (discovery), 1B (git sync + UAM), 1C (dashboard_pages location + file list)
- Architecture fully mapped — implementation blocked on policy and data gaps

## What to Do
1. Verify and read the policy document in full
2. Extract all 8 requirement categories (scoring, intents, financial, readiness, platforms, discounts, monitoring, governance)
3. Identify and document all discount range conflicts between document sections
4. Re-verify data gaps in dm-dashboard backend (landed cost, reviews/return rate, net contribution)
5. Produce rules-ready vs rules-blocked matrix
6. Save all AIOS files (prompt, evidence, validation, handover, PROMPT_REGISTER, closure)

## Key Rules
- READ-ONLY — do not modify application files, schemas, permissions, or production data
- Do not fabricate policy content if document cannot be read
- Mark discount conflicts as NOT APPROVED FOR EXECUTION until Piranav resolves them
- Do not claim a data source exists without file/line evidence

## Expected Output Files
- `prompts/dm-dashboard/promotion-automation-phase1d-policy.md`
- `evidence/dm-dashboard/promotion-automation-phase1d-policy-2026-10-15.md`
- `validation/piranav/promotion-automation-phase1d-validation-2026-10-15.md`
- `handover/piranav/promotion-automation-phase1d-handover-2026-10-15.md`
- `PROMPT_REGISTER.md` row added
- `closure/README.md` entry appended
