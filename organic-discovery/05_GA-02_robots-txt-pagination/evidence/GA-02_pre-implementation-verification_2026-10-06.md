# GA-02 — Pre-Implementation Verification
**Date:** 2026-10-06  
**Status:** VERIFICATION COMPLETE — Corrections issued — Awaiting implementation approval  
**Step:** Final verification before implementation  
**No changes made.**

---

## CRITICAL CORRECTION TO PRIOR PLAN

The implementation plan (Step 2) stated: *"Create `templates/robots.txt.liquid` in theme."*

**This is WRONG. The file already exists.**

`templates/robots.txt.liquid` exists at:
```
C:\Users\PC\Documents\piranav_aios\shopify_projects\ledsone-uk-theme\templates\robots.txt.liquid
```

**The correct action is EDIT the existing file — not create a new one.**

The live robots.txt at `https://ledsone.co.uk/robots.txt` is served FROM this file. All current rules originate here.

---

## A. Verified Implementation Path

| Item | Finding |
|---|---|
| File exists? | **YES** — `templates/robots.txt.liquid` confirmed present in theme |
| Shopify Admin path | **Online Store → Themes → [Active theme] → Edit code → templates/ → robots.txt.liquid** |
| OR: Shopify CLI path | Edit local file + `shopify theme push` (preferred for version control) |
| Action required | **EDIT** existing file — replace 3 lines, one per user-agent block |
| Lines to change | Line 41, Line 59 (Googlebot — dead code but fix anyway), Line 74 |
| Rollback | Revert the 3 edited lines — push theme. Robots.txt reverts to current state. |

---

## B. Verified Liquid Structure

The file uses this structure:

```liquid
# we use Shopify as our ecommerce platform
{% for group in robots.default_groups %}
  {{- group.user_agent -}}
  {% for rule in group.rules %}
    {%- if group.user_agent.value == '*' -%}
      ... hardcoded rules for User-agent: * ...
    {% elsif group.user_agent.value == 'Googlebot' %}
      ... hardcoded rules for Googlebot ...
    {% elsif group.user_agent.value == 'adsbot-google' %}
      ... hardcoded rules for adsbot-google ...
    {% elsif group.user_agent.value == 'AhrefsBot' %}
      ... hardcoded rules for AhrefsBot ...
    {% elsif group.user_agent.value == 'AhrefsSiteAudit' %}
      ... hardcoded rules for AhrefsSiteAudit ...
    {%- endif -%}
  {% endfor %}
  {%- if group.sitemap != blank -%}
    {{ group.sitemap }}
  {%- endif -%}
{% endfor %}
# AI bots section follows (static, no Liquid)
```

Rules are output as Liquid string literals: `{{'Disallow: /*?page=*'}}` → renders as `Disallow: /*?page=*`

**The robots.txt wildcards (`*`) are inside the string literal — they are robots.txt syntax, NOT Liquid wildcards.**

---

## C. Verified Rule Syntax

### Proposed rules in robots.txt syntax format:
```
Disallow: /*?page=*&*filter*
Disallow: /*?page=*&sort_by*
Disallow: /*?page=*&section_id*
```

### In Liquid string literal format (as it appears in robots.txt.liquid):
```liquid
{{'Disallow: /*?page=*&*filter*'}}
{{'Disallow: /*?page=*&sort_by*'}}
{{'Disallow: /*?page=*&section_id*'}}
```

### Wildcard validation
Google robots.txt supports `*` as a wildcard matching zero or more characters at any position in the pattern. The proposed patterns use this standard `*` wildcard. **Syntax is valid.**

Pattern logic for `/*?page=*&*filter*`:
- `/*` — matches any URL path prefix
- `?page=` — literal match (query string begins with page param)
- `*` — matches the page number (e.g. `2`, `10`)
- `&` — literal ampersand (at least one more parameter follows)
- `*` — matches any characters between `&` and `filter` (can be empty)
- `filter` — literal match
- `*` — matches any characters after `filter`

---

## D. Allow/Block Test Results

### URLs that must be ALLOWED (must NOT match any new rule)

| URL | Matches `&*filter*`? | Matches `&sort_by*`? | Matches `&section_id*`? | Result |
|---|---|---|---|---|
| `/collections/all?page=2` | NO — no `&` in URL | NO | NO | ✅ ALLOWED |
| `/collections/all?page=3` | NO | NO | NO | ✅ ALLOWED |
| `/collections/vintage-cables?page=2` | NO | NO | NO | ✅ ALLOWED |
| `/collections/all?page=2&layout=list` | NO — `layout` ≠ `filter` | NO — `layout` ≠ `sort_by` | NO | ✅ ALLOWED |
| `/collections/all?page=2&pagination=load_more` | NO | NO | NO | ✅ ALLOWED |

### URLs that must be BLOCKED (must match at least one new rule)

| URL | Matching rule | Result |
|---|---|---|
| `/collections/all?page=2&filter.v.availability=1` | `/*?page=*&*filter*` — `filter` found after `&` | ✅ BLOCKED |
| `/collections/all?page=2&sort_by=price-ascending` | `/*?page=*&sort_by*` — `sort_by` found after `&` | ✅ BLOCKED |
| `/collections/all?page=2&section_id=main-collection-product-grid` | `/*?page=*&section_id*` — `section_id` found after `&` | ✅ BLOCKED |

### Multi-parameter edge cases

| URL | Expected | Matching? |
|---|---|---|
| `/collections/all?page=2&layout=list&filter.v.availability=1` | BLOCKED | ✅ YES — `/*?page=*&*filter*` matches: `*` absorbs `2&layout=list`, `&` matches final `&`, `*filter*` matches `filter.v.availability=1` |
| `/collections/all?filter.v.availability=1&page=2` | BLOCKED | ✅ YES — existing `/*?filter` rule blocks this (filter is the first param) |
| `/collections/all?page=2&layout=grid&pagination=default` | ALLOWED | ✅ YES — none of the three rules match |

---

## E. Risks and Corrections

### Correction 1 — File creation vs edit (CRITICAL)
**Prior plan said:** "Create `templates/robots.txt.liquid`"  
**Correct action:** Edit existing `templates/robots.txt.liquid` — replace 3 specific lines

### Correction 2 — Googlebot block is dead code (NOTABLE)
The template has a `{% elsif group.user_agent.value == 'Googlebot' %}` block at line 50. The live robots.txt does NOT contain a `User-agent: Googlebot` section — because Shopify's `robots.default_groups` does not include a standalone Googlebot group. This block is currently dead code.

**Recommendation:** Fix line 59 anyway. If Shopify adds Googlebot to `default_groups` in a future platform update, the blocked pagination rule would reappear. Fix it now as a precaution.

### Risk 3 — Loop structure (LOW RISK)
Rules are output inside `{% for rule in group.rules %}`. If Shopify's `default_groups` returns multiple items per user-agent in `group.rules`, rules could duplicate in the output. However, the current live robots.txt exactly matches the template with no duplication — so whatever the loop iteration count is, it works correctly. **Do NOT change the loop structure. Only change the 3 string literal lines.**

### Risk 4 — AhrefsBot block (NO ACTION)
`AhrefsBot` block (lines 79–120) does not contain `/*?page=*` — no change needed. Confirmed.

### Risk 5 — `?page=` with no other params, `page` in path (NO RISK)
- `/collections/all?page=2` has no `&` — passes all 3 new rules ✓
- `/pages/about` (page template, no query string) — no `?page=` — not affected ✓
- `/products/ceiling-rose-pendant` — no `?page=` — not affected ✓

---

## F. Exact Implementation Steps

### Step 1 — Sync local theme (confirm file is current)
In Shopify Admin or confirm the local file is current with the live theme.

### Step 2 — Edit `templates/robots.txt.liquid`

Make exactly 3 changes. Each change replaces ONE line with THREE lines.

**Change 1 — Line 41 (`User-agent: *` block):**

REMOVE:
```liquid
        {{'Disallow: /*?page=*'}}
```

REPLACE WITH:
```liquid
        {{'Disallow: /*?page=*&*filter*'}}
        {{'Disallow: /*?page=*&sort_by*'}}
        {{'Disallow: /*?page=*&section_id*'}}
```

**Change 2 — Line 59 (`Googlebot` block — dead code, fix as precaution):**

REMOVE:
```liquid
        {{'Disallow: /*?page=*'}}       
```

REPLACE WITH:
```liquid
        {{'Disallow: /*?page=*&*filter*'}}
        {{'Disallow: /*?page=*&sort_by*'}}
        {{'Disallow: /*?page=*&section_id*'}}
```

**Change 3 — Line 74 (`adsbot-google` block):**

REMOVE:
```liquid
        {{'Disallow: /*?page=*'}}     
```

REPLACE WITH:
```liquid
        {{'Disallow: /*?page=*&*filter*'}}
        {{'Disallow: /*?page=*&sort_by*'}}
        {{'Disallow: /*?page=*&section_id*'}}
```

### Step 3 — Push to Shopify
```
shopify theme push
```
Or deploy via Shopify Admin theme editor.

### Step 4 — Verify live robots.txt
Fetch `https://ledsone.co.uk/robots.txt` and confirm:
- `Disallow: /*?page=*` is gone (in all 3 user-agent blocks)
- `Disallow: /*?page=*&*filter*` is present (in User-agent: * and adsbot-google)
- `Disallow: /*?page=*&sort_by*` is present
- `Disallow: /*?page=*&section_id*` is present
- All other existing rules are unchanged

### Step 5 — GSC URL Inspection
Test `/collections/all?page=2` in Google Search Console URL Inspection tool — should return "URL is on Google" or "Crawlable" status (no longer "Blocked by robots.txt").

---

## Verification Conclusion

| Item | Status |
|---|---|
| File path verified | ✅ Correct — `templates/robots.txt.liquid` exists |
| Liquid structure confirmed | ✅ String literals — simple edit |
| Rule syntax valid | ✅ Standard robots.txt wildcards |
| Allow test — 5 pagination URLs | ✅ All pass |
| Block test — 3 problem URLs | ✅ All blocked |
| Accidental blocking check | ✅ No unintended blocks |
| Correction to prior plan | ✅ EDIT not CREATE |
| Dead code risk (Googlebot) | ✅ Flagged — fix as precaution |
| Loop structure risk | ✅ Low — do not change loop |

**Ready for implementation. Awaiting approval.**
