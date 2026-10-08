# Prompt: IP Infringement Investigation & Cease and Desist Generation

**Category:** legal  
**Pattern Name:** `ledsone-ip-cease-and-desist`  
**Created:** 2026-10-08  
**Status:** ACTIVE

---

## When to Use

Use this prompt when a competitor or unknown third party appears to be using LEDSone's brand assets (logo, trade dress, name) without authorisation, and you need to:
1. Investigate and confirm the infringement
2. Produce a formal Cease & Desist letter (PDF-ready)
3. Produce an IP action plan document (PDF-ready)

---

## Prompt Template

```
A third-party website [URL] appears to be using our brand logo/identity without authorisation.

Our brand:
- Primary: ledsone.co.uk
- Secondary: ledsone.de

Task:
1. Fetch [INFRINGING URL] and [OUR URL] — compare branding, logo, product range, legal transparency
2. Confirm whether the site is ours or a third party
3. Identify all legal claims available (copyright, passing off, unfair competition, e-commerce directive breach)
4. Produce a formal Cease & Desist letter as a printable HTML file (→ PDF via Ctrl+P)
5. Produce a full IP Infringement Analysis & Action Plan as a printable HTML file (→ PDF via Ctrl+P)

Output files:
- [project-root]/ledsone-cease-and-desist.html
- [project-root]/ledsone-ip-action-plan.html

Include in C&D letter:
- Our company details header
- Date + reference number
- Specific legal basis (UK copyright, EU Directive 2001/29/EC, Directive 2005/29/EC, Article 5 E-Commerce Directive)
- 4 specific demands with 7-day deadline
- Consequences of non-compliance
- Authorised signatory block

Include in action plan:
- Side-by-side site comparison (ours vs theirs)
- Legal claims table with strength ratings
- 5 ordered action steps
- Trademark registration recommendation
```

---

## Key Technical Constraints

- Output must be HTML (printable to PDF via browser Ctrl+P)
- C&D must reference correct legal instruments for UK + EU jurisdiction
- Always check About/Contact pages of infringing site for VAT, address, registration — absence strengthens our position
- Always recommend Wayback Machine archiving before sending any notice
- Shopify IP report URL: shopify.com/legal/report-ip
- WHOIS lookup: who.is/whois/[domain]

---

## Expected Output

- `ledsone-cease-and-desist.html` — formal legal letter, print-ready
- `ledsone-ip-action-plan.html` — internal action plan document, print-ready
- Evidence logged to `evidence/legal/`
- Closure entry in `closure/README.md`
