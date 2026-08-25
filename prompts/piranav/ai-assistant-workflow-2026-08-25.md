# Prompt — AI Assistant System (All Staff)

**Date:** 2026-08-25
**Staff:** Piranav (AIOS Architect)
**Session type:** Multi-session feature build + bug fix + UI unification

---

## Original Prompts (verbatim)

1. "Build AI assistants for all remaining staff (Theekshy, Thivajini, Jefri, Thasitha, Mahima) — two-stage flow: short task card on open → full deep-dive on follow-up"

2. "is that deployed"

3. "yes" (confirm commit and push)

4. "ok now i want to tell full ai assit work flow my md and other how can i expllain"

5. "i need seprete new file only ai assit's work flow save in download there inlcude all set up detatile like the ai model use and how them function like etc,..."

6. "ok now all ai assit when they are hit them limit show like and mssage but like and fun way before do this tell me what do you understand"

7. "yes diffenernt msgs" (3 different messages for 3 error types)

8. "if when ai model hit today limit then which msg show..?"

9. "ok done" (confirm implementation)

10. "ok firn now confirm all staff's ai work because only kamsi's ai when i click widdge is not open"

11. "no still not work" (Kamsi widget still broken after first fix attempt)

12. "ok now the ai assit widge ui for every user's differnt right i need all of them same ui and not there want to clear option before any chanege tell me what do you understand"

13. "1 - sajeepan's ui, 2 - no need clear option refresh is keep on"

14. "ok now tell me every daye each of staff get new task list ..?"

15. "ok now 'C:\Users\PC\Downloads\AI-ASSISTANT-WORKFLOW.md' here update missing and technical wise and user wise md file"

16. "where is the file path..?"

17. "why jefri's ai assit Error: HTTP 500: {"ok":false,"error":"Pool is not defined"}"

18. "ok now verify 'C:\Users\PC\Downloads\AI-ASSISTANT-WORKFLOW.md' this is miss anything ..!"

19. "ok" (confirm update the 5 gaps)

20. "ok now the work flow doc update my aios prompts evidence validation implementation deployment closure capability"

---

## Requirements Extracted

- Build AI assistants for 5 new staff: Theekshy (DE), Thivajini (FR), Jefri (DE+IT), Thasitha (DE), Mahima (DE)
- Two-stage conversation: empty message → short task card (max 5); follow-up → full deep-dive on chosen task
- All 11 staff widgets unified to Sajeepan's blue UI (no per-staff colours)
- Remove Clear button from all widgets; keep Refresh button
- Three different fun error messages: timeout 🐇, quota/rate-limit 🧠🌙, network error 📡🔌
- Fix Kamsi's widget (not opening)
- Document full AI assistant workflow in `C:\Users\PC\Downloads\AI-ASSISTANT-WORKFLOW.md`
- Save AIOS documentation across all 6 folders
