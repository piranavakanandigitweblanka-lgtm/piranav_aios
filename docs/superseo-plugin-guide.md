# SuperSEO Plugin — Deep Usage Guide

**Plugin:** SuperSEO by Bizwit AI v0.2.0  
**Installed from:** `C:\Users\PC\Downloads\Cluade SEO\Cluade SEO\superseo.plugin.zip`  
**Skills location (after install):** `~/.claude/skills/`  
**Written:** 2026-09-14  
**For:** Piranav — LEDsone UK/FR, electricalsone, dm-dashboard SEO staff

---

## Installation Status

**Blocked by Claude Code auto-classifier** — copying into `~/.claude/skills/` is a self-modification action that requires explicit user approval.

**To complete installation — run this yourself:**
```bash
mkdir -p ~/.claude/skills
cp -r "C:\Users\PC\Downloads\Cluade SEO\Cluade SEO\superseo_extracted\skills"/* ~/.claude/skills/
```
Or type `! cp -r "C:/Users/PC/Downloads/Cluade SEO/Cluade SEO/superseo_extracted/skills"/* ~/.claude/skills/` in this Claude Code chat.

After install: restart Claude Code. All 11 skills become auto-discoverable.

---

## How the Plugin Works — Core Architecture

Each skill lives at `~/.claude/skills/<skill-name>/SKILL.md` with a bundled `references/` subfolder.

When you trigger a skill, Claude:
1. Loads the SKILL.md as its operating instructions
2. Does all research itself (live web fetches — no data paste needed)
3. Loads specific reference files from `references/` only when that step needs them (not preloaded)
4. Delivers structured output

**You give one input. Claude does the rest.**

---

## The 11 Skills — Complete Deep Reference

---

### 1. `page-audit`

**What it does:** Full 7-dimension SEO audit of any URL. Fetches the page, identifies the primary keyword, reads the top 3 competitors, and produces a scored audit.

**You give:** One URL.

**How to trigger:**
```
run page-audit on https://ledsone.co.uk/collections/pendant-lights
```

**What Claude does (step by step):**
1. Fetches the URL — reads title, H1, H2s, meta, word count, schema, author, internal links
2. Identifies primary keyword from the title/H1/first paragraph
3. Googles that keyword — reads top 10, fetches and reads top 3 competitors in full
4. Runs Phase 0: Content identity — what is this actually trying to do, what buyer stage, what intent?
5. Runs Phase 1: Competitive + semantic landscape (competitor analysis, entity/predicate mapping, intent alignment)
6. Runs Phase 2: 7-dimension deep audit

**The 7 Dimensions scored 1-10:**

| Dimension | What It Checks |
|---|---|
| 1. Information Gain & Originality | Does this page contain anything that can't be found in the top 10? Google's Information Gain patent rewards NEW information. |
| 2. Semantic Depth & Topical Completeness | Are all entities, predicates, and EAV relationships covered? Does vocabulary signal expertise to NLP models? |
| 3. E-E-A-T Signals | Experience (did the author DO this?), Expertise (accurate depth), Authoritativeness (topical cluster), Trustworthiness (transparency) |
| 4. Structure, Readability & Time-to-Value | How fast does the reader get value? Clear heading hierarchy? Paragraph length for screen reading? |
| 5. Technical On-Page SEO | Title tag, H1, H2/H3, anchor text (Group A = critical), meta description (CTR only), internal/external links, schema |
| 6. Engagement, Distribution & Discoverability | Google Discover readiness, social shareability, behavioral signals (dwell time, pogo-stick risk) |
| 7. Conversion & Business Impact | Value prop in 5 seconds? Single clear CTA? Social proof near conversion? (Only scored if the page has a conversion goal) |

**What you get in the output:**
- Content Identity summary (2-3 sentences on what the page actually is)
- Competitive Position (where it stands vs top 3)
- Scorecard (7 dimensions, /10 each, /70 total)
- Detailed findings per dimension (what works, what doesn't, with exact locations in the page)
- Semantic Gap Analysis (exact entities/subtopics missing vs competitors)
- Top 5 Quick Wins (specific, not abstract — "change title from X to Y because Z")
- Top 5 Strategic Improvements
- Rewritten elements: title tag (with char count), meta description, H1, opening hook

**Bundled references it loads:**
- `pop-test-hierarchy.md` — POP test element hierarchy from 400+ controlled Google tests
- `eeat-scoring-rubric-compact.md` — one-page E-E-A-T scoring rubric
- `semantic-entity-checklist.md` — entity/predicate/EAV checklist
- `content-types-audit-summary.md` — type-specific audit criteria for all 23 content types

**When to use for LEDsone:**
- Before editing any collection page (pendants, vintage bulbs, etc.)
- After a page drops in rankings — identify what competitors now have that you don't
- Before briefing the copywriter on a page refresh

---

### 2. `content-brief`

**What it does:** Writer-ready content brief from a target keyword. Googles the keyword, reads the top 10 results, classifies intent, maps the content gap, and produces a structured brief.

**You give:** Target keyword (required). Optionally: business context.

**How to trigger:**
```
run content-brief for "LED pendant lights UK"
run a content brief for "vintage filament bulbs for restaurants"
```

**What Claude does (step by step):**
1. Googles the keyword — reads top 10 results (format, word count, heading structure, unique angle)
2. Classifies dominant intent: Informational / Commercial Investigation / Transactional / Navigational
3. Applies intent-specific word count: Informational = 1,500-3,000+ / Commercial = 2,000-4,000 / Transactional = 800-1,500
4. Maps People Also Ask questions (verbatim — these become H2/H3 headings)
5. Identifies content type from SERP pattern (buying guide, category page, how-to, etc.)
6. Produces the full brief

**What you get in the output:**
- **Target Keyword Analysis** — difficulty assessment, dominant intent, related terms to target
- **SERP Competitive Intelligence** — top 3 competitors: URL, word count, format, key sections, what they miss
- **Content Gap Analysis** — specific subtopics covered by 2+ competitors but missing from existing content
- **Recommended Outline** — H1 + H2/H3 structure with featured snippet target marked, PAA integrated
- **Hub & Spoke Architecture** — is this a hub, spoke, or standalone? Internal linking pattern recommended
- **Technical Optimization** — title tag (50-60 chars), meta description (150-160 chars), schema type, snippet format
- **E-E-A-T Signals Required** — what expertise markers, original data, or authoritative sources are needed
- **Resource Assessment** — effort estimate (Low / Medium / High) + realistic 3-month position target

**Important:** Content type is picked from SERP, not from preference. Word count = average of top 5 + 10%. Never padded.

**Next step:** Feed the brief directly into `write-content`.

**When to use for LEDsone:**
- Planning new blog content for UK lighting market
- Briefing a writer on a category page you want to create
- Planning content for LEDsone FR (works in French if you say the keyword in French)

---

### 3. `write-content`

**What it does:** Writes a complete SEO article from a topic or keyword. Includes the full anti-AI-slop ruleset. Research phase included if no brief is provided.

**You give:** Topic or keyword. Optionally: an existing content brief from `content-brief`, or expert interview output from `expert-interview`.

**How to trigger:**
```
run write-content for "how to choose LED bulbs for restaurant lighting"
run write-content using this brief: [paste brief output]
```

**What Claude does (step by step):**
1. **Business context** — on first use, asks 5 questions about your brand (tone, audience, competitors, off-limits topics). Saves to memory so it never asks again.
2. **Phase 1: Research** — if no brief provided, Googles the topic and reads top 5 results
3. **Phase 2: Content type decision** — tells you what it's going to write and why, waits for your confirmation
4. **Phase 3: Knowledge extraction** — asks 2-3 questions to get unique expertise only you have. One question at a time.
5. **Phase 4: Write the full article** in clean markdown

**The Anti-Slop Rules (built into every article):**

Words that are completely banned (highest AI tells):
> delve, landscape (metaphorical), testament, leverage, utilize, robust, seamless, furthermore, moreover, additionally, pivotal, multifaceted, harness, embark, navigate (metaphorical), showcase, streamline, paramount, culminate, spearhead, commence, endeavor, vibrant, innovative, comprehensive (as adjective)

Phrases that are completely banned:
> "It's worth noting", "In today's [anything]", "Let's dive in", "In conclusion", "plays a crucial/vital role", "It goes without saying"

Structural patterns that are banned:
- Rule-of-three groupings (use 2 or 4 items instead)
- Synonym cycling (repeat the right word, don't hunt for alternatives)
- Em-dash chains (max 1-2 per 1,000 words)
- Binary contrasts ("it's not X, it's Y" — just make the argument)
- Participial tack-ons ("...highlighting the importance of X" — delete or rewrite)

**Voice rules:**
- Write like a practitioner talking to a peer, not a textbook
- Take positions — "X works better than Y" not "both have merits"
- Specific numbers, names, dates — never "many companies"
- Show thinking changing: "At first I thought X — turns out it was Y"
- Vary sentence length dramatically (5-word punches mixed with 30-word complex sentences)
- Parenthetical asides and brief tangents — humans do this, AI doesn't

**SEO structure built in:**
- Primary keyword in H1, first 100 words, 2-3 H2s (~2% body density, natural)
- 40-60 word direct answer after the most important H2 (featured snippet target)
- PAA questions woven in as H2/H3 headings
- 3-5 internal links per 1,000 words with descriptive anchor text
- Value front-loaded — no preamble paragraphs

**When to use for LEDsone:**
- Writing new blog posts or buying guides
- Creating collection page descriptions
- Writing location pages for LEDsone FR

---

### 4. `improve-content`

**What it does:** Rewrites an existing underperforming page — better structure, deeper expertise, voice that sounds human. Uses the same anti-slop ruleset as `write-content`.

**You give:** URL of the page to improve.

**How to trigger:**
```
run improve-content on https://ledsone.co.uk/collections/pendant-lights
improve this page: https://ledsone.co.uk/pages/about
```

**What Claude does:**
1. Fetches and reads the current page (title, meta, H1/H2s, word count, internal links, schema)
2. Identifies the primary keyword from the content
3. Googles the keyword — reads top 5 results (format gaps, missing angles, snippet opportunities)
4. Asks 2-3 update questions: "What's changed since you published this?", "What results did it get?", "What would you add or cut now?"
5. Rewrites the full article in clean markdown

**Same anti-slop rules and voice rules as `write-content` apply.**

**Content type detection:** Claude detects the existing page's type from the content + SERP, loads the correct template (buying-guide, category-page, product-page, etc.) and rewrites to that structure.

**Key difference from `write-content`:** This preserves what's working in the original, fixes what's broken, and updates stale sections. Use it when you have an existing page that ranks but underperforms, not when creating from scratch.

**When to use for LEDsone:**
- Any existing collection or product page that's ranking position 5-20 but not converting
- Pages that were written before E-E-A-T was a major factor
- Pages where the content is outdated (new products, pricing changes)

---

### 5. `keyword-deep-dive`

**What it does:** Complete analysis of a single keyword's opportunity — intent, SERP features, competition, zero-click risk, and a 90-day ranking plan.

**You give:** Target keyword (required). Optionally: your existing URL for that keyword.

**How to trigger:**
```
run keyword-deep-dive on "LED strip lights UK"
run keyword-deep-dive on "vintage filament bulbs" — I already have this page: https://ledsone.co.uk/collections/vintage-bulb-collection
```

**What Claude does:**
1. Googles the keyword — reads top 10, reads top 3 in full (domain authority proxy, format, word count, angle, E-E-A-T signals)
2. Classifies dominant intent
3. **Zero-click risk assessment** (critical for Dilaksi's work):
   - ~60% of informational searches end without a click (2026 data)
   - Featured snippet held: 42.9% CTR vs 39.8% without
   - AI Overview present: organic CTR drops 58-61% for the top-ranking page; brands cited in AIO earn 35% more clicks
4. Identifies SERP features: featured snippet (who holds it?), PAA, AI Overview, image pack, video carousel, local pack, knowledge panel
5. Reads SERP volatility signals (stable vs turbulent)
6. Fetches and reads top 3 pages in full

**What you get:**
- **Keyword Profile** — intent, estimated difficulty (Easy/Moderate/Hard from reading the SERP, not a KD score), SERP features, zero-click risk rating
- **Competitive Read** — top 3 competitors: URL, authority proxy, format, word count, unique angle, what they do best
- **Content Gaps** — specific subtopics missing from top results (your entry point)
- **Ranking Strategy** — if no existing page: content requirements, unique angle, E-E-A-T signals needed, realistic timeline. If existing page: position diagnosis, quick wins, 30-day content plan, supporting cluster pages
- **Title Tag & Meta Rewrites** — 2 title options + 1 meta description with reasoning
- **Ranking Timeline** — current position (or unranked), realistic 90-day target, effort level

**The KD score note:** Claude doesn't use Ahrefs/Semrush KD scores. It reads the actual SERP and assesses competition from the real pages. More accurate for low-volume niches (which lighting often is).

**When to use for LEDsone:**
- Before deciding whether to create a new page for a keyword
- When Dilaksi is prioritising which keywords to target in dm-dashboard
- Quarterly check on keywords LEDsone already ranks for but is losing position

---

### 6. `semantic-gap-analysis`

**What it does:** Finds the exact entities, subtopics, predicates, and relationships missing from your page but present in top-ranking competitors. The content brief for what to add.

**You give:** Your page URL + the target keyword.

**How to trigger:**
```
run semantic-gap-analysis on https://ledsone.co.uk/collections/pendant-lights for keyword "pendant lights UK"
```

**The theory behind it (Koray Tuğberk's methodology):**

Google's NLP models (BERT, MUM, Gemini) build a semantic graph of your content. If you're missing nodes or edges that competitors have, your content reads as shallow to the algorithm — even if you rank position 4.

This skill finds the exact missing nodes.

**What Claude does:**
1. Fetches your page — extracts entities (people, places, products, concepts), predicates (verbs that signal contextual depth), and H2/H3 structure
2. Googles the keyword — fetches top 3 competitors in full, extracts the same inventory
3. Builds a semantic inventory table: what your page covers / what competitors cover that you don't / what only you have
4. Classifies each gap: Core (all 3 competitors cover this, you don't — critical) / Differentiator (1-2 competitors, worth adding) / Commodity (everyone covers superficially) / Opportunity (no one covers this — your angle to own)
5. Maps Entity-Attribute-Value (EAV) relationships for each core gap

**EAV example for LEDsone pendant lights:**
- Entity: E27 pendant lamp
- Attribute: lumen output, IP rating, pendant drop length, compatible dimmer types
- Relation: works with Edison bulbs, ceiling rose required, incompatible with enclosed fittings

This is what top-ranking competitor pages implicitly encode when they write detailed sections.

**What you get:**
- **Semantic Fingerprint** — what your page "talks about" to an NLP model vs what it should
- **Your Page inventory** — entities and predicates currently present
- **Competitor Coverage** — what each top 3 competitor covers that yours doesn't, and why
- **Gap List** — each gap with: importance level, which section to add it to, depth required (paragraph / subsection / full section)
- **Entity Relationships to Encode** — the EAV triples your page needs, even just in passing
- **Unique Angle to Preserve** — what your page does that competitors don't (don't lose this)
- **Content Addition Plan** — ordered list of sections to add/expand, with heading, 2-3 sentence description, estimated word count

**Next step:** Feed this gap list into `improve-content`.

**When to use for LEDsone:**
- When a page ranks 4-15 for a keyword but can't break into top 3
- Before a major page revision — understand exactly what to add before writing
- For Dilaksi: diagnose why specific category pages aren't performing

---

### 7. `eeat-audit`

**What it does:** Scores a page on Google's E-E-A-T framework — Experience, Expertise, Authoritativeness, Trustworthiness — with specific, actionable fixes for each gap.

**You give:** URL of the page.

**How to trigger:**
```
run eeat-audit on https://ledsone.co.uk/pages/about
run eeat-audit on https://ledsone.co.uk/blogs/news/how-to-choose-led-bulbs
```

**The 4 dimensions scored 1-10:**

**Experience (most underrated)**
- Strong signals (8-10): First-person observations with specific details, "When I tried this, X happened", original photos/screenshots from author's own work, failure stories with specific lessons, workflow details only hands-on experience would know
- Weak signals (4-6): Generic advice anyone could write, third-person narration of other people's cases
- Absent (1-3): No first-person, no specific stories, no details beyond what's in the top 10

**Expertise**
- Strong: Every factual claim accurate, numbers from primary sources, technical details correctly used, willingness to disagree with common advice when there's a reason, depth beyond what a generalist could produce in 30 minutes
- Absent: Factual errors, outdated info presented as current, surface-level summary

**Authoritativeness**
- Strong: Page is part of a broader topical cluster, author expertise verifiable beyond a bio paragraph (LinkedIn, talks, external citations), external sites cite this page
- Absent: Isolated page on a broad topic, no author attribution, no topical cluster

**Trustworthiness**
- Strong: Transparent about limitations, discloses conflicts of interest (affiliate links), methodology explained, willing to recommend alternatives
- Absent: Factual errors, affiliate content without disclosure, misleading claims, outdated info on time-sensitive topic

**What you get:**
- E-E-A-T Scorecard (4 dimensions /10 each, /40 total)
- What's Working (specific observations with exact locations in the page)
- What's Missing (specific gaps with specific fixes — not "add author bio" but "add a one-sentence bio with a credential anchor linking to LinkedIn")
- Fastest Wins — 3 changes you could make in under 30 minutes that lift the score materially, ordered by impact
- Structural Recommendations — longer-term work: methodology section, author schema markup, About page for the author, topical cluster links

**Bundled references it loads:**
- `ymyl-scoring-rubric.md` — stricter scoring for YMYL pages (finance, medical, legal — not LEDsone's primary concern but applies to any pages about electrical safety)
- `experience-detection-playbook.md` — how to tell in 30 seconds whether an author has done the thing
- `fastest-eeat-wins.md` — ranked by implementation effort
- `author-schema-templates.md` — copy-paste Person / Author / Organization JSON-LD

**When to use for LEDsone:**
- Audit the About page before updating it
- Any blog post written by a non-attributed author
- Pages competing in "best LED X" type queries where E-E-A-T is a ranking factor

---

### 8. `topic-cluster-planning`

**What it does:** Builds a hub-and-spoke content architecture from a seed topic. Hub = broad pillar page. Spokes = specific articles targeting long-tail keywords. Includes internal linking strategy and publishing sequence.

**You give:** Seed topic or broad keyword. Optionally: your domain so Claude can check what you've already published.

**How to trigger:**
```
run topic-cluster-planning for "LED lighting for restaurants UK" — my domain is ledsone.co.uk
run topic-cluster-planning for pendant lights — ledsone.co.uk
```

**What Claude does:**
1. Googles the seed topic — reads top 10, PAA questions, "Searches related to", 2-3 major publications in the space
2. Identifies who dominates the broad keyword (tells you the difficulty level)
3. Maps sub-topics from PAA and related searches
4. Identifies the Hub format (Ultimate guide / Pillar + chapters / Category with featured content)
5. Maps 8-15 specific spokes from the research
6. Maps the internal link graph
7. Sets the publishing sequence (critical — publish spokes BEFORE the hub)

**Publishing Sequence Rule:**
Don't publish the hub first. Publish 3-4 high-quality spokes first, then the hub with links to them. The hub should NOT launch as an orphan with nothing to link out to.

**Internal Linking Rule:**
The FIRST link from any spoke TO the hub is what Google's algorithm weights most heavily. Make it contextual (in the body, not footer), with descriptive anchor text.

**What you get:**
- **Cluster Overview** — seed topic, estimated difficulty, realistic build timeline
- **Hub specification** — format (Ultimate guide / Pillar / Category), target keyword, main H2 sections (~5-10), word count, what the hub should NOT cover in depth (save for spokes)
- **Spoke List** table — 8-15 rows with: topic, target keyword, content type, words, hub anchor text — sorted by priority (highest-impact, easiest-to-rank first)
- **Publishing Sequence** — Month 1 spokes, Month 2 hub, Month 3-4 remaining spokes
- **Internal Link Map** — which spokes link to which other spokes (only naturally related ones)
- **External Linking Strategy** — 3-5 authoritative sources the hub should cite
- **Success Metrics** — Month 3 / 6 / 9 / 12 targets

**When to use for LEDsone:**
- Planning a content marketing push for a new product category
- Building authority in "lighting for [venue type]" queries
- Planning LEDsone FR content structure before creating anything

---

### 9. `featured-snippet-optimizer`

**What it does:** Rewrites a specific section of your page to win the featured snippet for a keyword you already rank for (positions 1-5 only).

**You give:** Target keyword + your page URL (must already rank for this keyword).

**How to trigger:**
```
run featured-snippet-optimizer for keyword "how to install LED strip lights" — my page: https://ledsone.co.uk/blogs/news/led-strip-lights-installation
```

**Important pre-condition:** This only works if your page already ranks positions 1-5. From position 6+, fix the ranking first, then use this skill.

**The CTR case:**
- Featured snippet = 42.9% CTR
- Organic #1 without snippet = 39.8% CTR
- Difference seems small but compounds enormously at scale
- AI Overview present: organic CTR drops 58-61%. Being CITED in the AIO earns 35% more clicks. This skill increases your chance of being cited.

**Query format matching (which format Google wants):**

| Query type | Snippet format |
|---|---|
| "What is X" | Paragraph (40-60 words) |
| "How to X" | Ordered list (3-8 steps) |
| "X list" or "types of X" | Unordered list |
| "X vs Y" | Table or paragraph |
| "Best X" / "top X" | Unordered list with brief |
| "When did X" / "who is X" | Short paragraph (< 50 words) |

**What Claude does:**
1. Googles the keyword — checks if there's a featured snippet, who holds it, what format it's in
2. Classifies the query format (which format Google wants)
3. Fetches and reads your page — finds where you answer the query, checks the format, checks length and placement
4. Identifies the gap (wrong format, answer too long/short, buried in the article, not self-contained, no heading-answer structure)
5. Rewrites the section

**The Rewrite Structure:**
1. H2 or H3 that restates the query literally ("What is LED efficiency?")
2. 40-60 word direct answer immediately under the heading — no preamble
3. Correct format (paragraph / ordered list / table)
4. Self-contained — makes sense without reading anything else on the page
5. Target keyword in first 20 words

**What you get:**
- Current State (who holds the snippet, format, exact text)
- Your Page Analysis (where your answer appears, format gap)
- **Rewrite** — new H2, new answer block (snippet-ready), supporting follow-up paragraph
- Implementation Notes (exactly where to place it in the existing content)
- Realistic Timeline (Google typically picks up snippet changes within 1-4 weeks)

**Common failure it fixes:** Your answer is buried in paragraph 8 of the article, requires context from the surrounding text to make sense, and is 200 words when Google wants 50.

**When to use for LEDsone:**
- Any product or buying guide page ranking positions 2-5 for a "how to X" or "what is X" query
- Before a seasonal traffic push — winning snippets is high-leverage before peak periods

---

### 10. `linkbuilding`

**What it does:** Phase-appropriate link acquisition strategy with specific, executable tactics. Classifies your site's authority phase, then picks tactics from 9 detailed playbooks.

**You give:** Your domain or URL. Optionally: your niche, what you sell, any specific constraints ("no budget for outreach", "already tried guest posting").

**How to trigger:**
```
run linkbuilding for ledsone.co.uk
run linkbuilding for ledsone.co.uk — we sell LED lighting in the UK, no budget for paid outreach
```

**Phase Classification (Claude assesses from reading your site):**

| Phase | Signals | DR Range |
|---|---|---|
| Foundation | New (< 1 year), thin content, no brand signals | DR 0-15 |
| Growth | 1-3 years, 20-100 pages, some brand mentions | DR 16-40 |
| Authority | 3+ years, established brand, knowledge panel, media mentions | DR 41+ |

**The 9 Tactic Playbooks (Claude loads full step-by-step for whichever match your phase):**

**Foundation phase:**
- `entity-stacking` — consistent brand presence on 20+ platforms (Google Business, LinkedIn, Crunchbase, Medium, GitHub, Wikidata). Expected: 20-30 referring domains in month 1. Wikidata entry = highest leverage for entity recognition.
- `citations-directories` — industry and local directories. Chamber of Commerce links = DR 50-70, dofollow.

**Growth phase:**
- `competitor-backlink-gap` — domains linking to 2+ competitors but not to you are 3x more likely to convert than cold targets. (Requires Ahrefs/Moz.)
- `guest-posting` — target DR 30+ sites with real traffic. In-article contextual links = 5-10x more value than bio links.
- `resource-pages` — `intitle:resources [niche]`. University pages (DR 70-90+) are gold. Pitch as gap-filler.
- `skyscraper-technique` — find the most-linked content in your niche, create something 10x better, reach out to everyone who linked to the original.

**Authority phase:**
- `strategic-partnerships` — joint research, co-authored guides, integration pages. Integration page links are permanent and high-authority.
- `podcast-guesting` — target shows with 1,000-10,000 listeners (sweet spot — not saturated, not tiny). Host links in show notes are dofollow and high-authority.

**New site:**
- `new-site-launch-strategy` — full 0-to-100 playbook combining entity stacking, citations, first content, realistic velocity.

**Anchor Text Safety (Claude checks if you share your distribution):**

| Anchor type | Safe range |
|---|---|
| Branded (business name, domain) | 40-50% |
| Naked URL | 15-20% |
| Generic ("click here", "read more") | 15-20% |
| Partial match | 10-15% |
| Exact match | 3-5% MAX — over 5% = penalty risk |

**Link Velocity Guidelines:**
- Month 1: 15-25 foundation links
- Months 2-3: 5-10 quality links
- Months 4-6: 8-15
- Month 7+: 10-30

**What you get:**
- Authority Phase Assessment with reasoning
- Top 3 Recommended Tactics — matched to your phase, with expected referring domains, time investment, and specific first action for each
- Link Velocity Guidelines for your current stage

**When to use for LEDsone:**
- When you're planning a content push and want links to follow
- When rankings are flat despite good content — link gap may be the issue
- For electricalsone (likely Foundation/Growth phase) — needs a different strategy than LEDsone UK

---

### 11. `expert-interview`

**What it does:** Extracts unique first-party expertise from you through targeted interview questions. Produces a knowledge document that feeds directly into `write-content` or `improve-content`.

**Why this exists:** AI can research the web. It cannot reproduce what you know from actually running a lighting business, what failed with a specific product installation, or what your customers consistently get wrong. This skill extracts that.

**You give:** Topic to discuss. Optionally: what the knowledge will be used for.

**How to trigger:**
```
run expert-interview on LED lighting for hospitality
run expert-interview on pendant light installation common mistakes — for a blog post
```

**How the interview works:**
- Claude asks 2-4 questions, one at a time
- Waits for your answer before asking the next
- Follows up on interesting answers ("you mentioned X — what happened exactly?" / "can you put a number on that?")
- Quality from depth, not breadth — 2-3 excellent answers beat 8 surface-level ones

**Core questions Claude will pick from:**
1. "What do most people get wrong about [topic]?" — forces a contrarian or non-obvious take
2. "Can you give me a specific example — a client, a project, a number?" — extracts first-party data that can't be fabricated
3. "What surprised you when you actually did this?" — gets unexpected results and failure stories
4. "Who should NOT follow this advice, and why?" — forces nuance through scope limitation

**For technical topics Claude may ask:**
- "What error do people hit first?"
- "What step do beginners always skip?"

**Output — a structured knowledge document:**
- Key insight / contrarian take
- Specific examples and data points (the real numbers, actual clients, exact projects)
- Experience details (what worked, what failed, what was surprising)
- Scope and limitations (who this applies to, who it doesn't, when the advice breaks down)

**Next step:** Pass this document directly to `write-content` — Claude weaves the first-person material into the article and it satisfies the 30% Information Gain rule.

**When to use for LEDsone:**
- Before writing any "buying guide" or "how to choose" content — your product knowledge is the differentiator
- Before writing thought leadership content for trade audiences (hospitality, commercial fit-out)
- Before improving an existing page that's generic — inject real product experience

---

## Skill Chaining — The Workflows

The skills are designed to chain. Here are the main chains for your context:

### Chain 1: New content from scratch
```
keyword-deep-dive → content-brief → expert-interview → write-content
```
1. `keyword-deep-dive` — is this keyword worth targeting? What's the strategy?
2. `content-brief` — build the full writer-ready brief
3. `expert-interview` — extract your unique product/business knowledge
4. `write-content` — write the article using the brief + interview output

### Chain 2: Fix an underperforming page
```
page-audit → semantic-gap-analysis → improve-content
```
1. `page-audit` — full 7-dimension audit, identify the biggest problems
2. `semantic-gap-analysis` — find the exact entities/subtopics missing vs competitors
3. `improve-content` — rewrite with the gap list as context

### Chain 3: Win a featured snippet
```
keyword-deep-dive → featured-snippet-optimizer
```
1. `keyword-deep-dive` — confirm the keyword has a snippet opportunity (not zero-click dominated by AIO)
2. `featured-snippet-optimizer` — rewrite the answer block

### Chain 4: Build topical authority for a new area
```
topic-cluster-planning → content-brief (× spokes) → write-content (× spokes) → write-content (hub)
```
1. `topic-cluster-planning` — map the full hub + spoke architecture
2. `content-brief` for each spoke — individual writer-ready briefs
3. `write-content` for each spoke — publish spokes first
4. `write-content` for the hub — publish after 3-4 spokes are live

### Chain 5: E-E-A-T boost on existing pages
```
eeat-audit → improve-content
```
1. `eeat-audit` — score the page, identify specific gaps
2. `improve-content` — rewrite with the gap list as context

---

## LEDsone-Specific Playbook

| Situation | Skill to use | Example input |
|---|---|---|
| Collection page not ranking | `page-audit` → `semantic-gap-analysis` | `run page-audit on ledsone.co.uk/collections/pendant-lights` |
| New product category content | `keyword-deep-dive` → `content-brief` → `write-content` | `run keyword-deep-dive on "smart LED bulbs UK"` |
| Blog post for hospitality market | `expert-interview` → `write-content` | `run expert-interview on LED lighting for restaurants` |
| About page E-E-A-T improvement | `eeat-audit` → `improve-content` | `run eeat-audit on ledsone.co.uk/pages/about` |
| Planning LEDsone FR content | `topic-cluster-planning` | `run topic-cluster-planning for éclairage LED cuisine` |
| LEDsone link building | `linkbuilding` | `run linkbuilding for ledsone.co.uk` |
| Featured snippet opportunity | `featured-snippet-optimizer` | `run featured-snippet-optimizer for keyword "how to wire pendant lights" — my page: URL` |
| Dilaksi keyword prioritisation | `keyword-deep-dive` (batch) | Run for each keyword in the candidate list |

---

## What SuperSEO Cannot Do

Be clear on the limits:

| What it cannot do | What to use instead |
|---|---|
| Read your Google Search Console data | Export from GSC manually and paste key metrics as context |
| Monitor rankings over time | Ahrefs, Semrush, or GSC (ongoing) |
| Crawl your entire site for technical issues | Screaming Frog, Sitebulb |
| Access your Shopify analytics | dm-dashboard or Shopify Analytics directly |
| Run Semrush/Ahrefs competitor backlink gap | Requires a backlink tool subscription (for `linkbuilding` skill's `competitor-backlink-gap` tactic) |
| Make changes to Shopify pages directly | Use Claude's Shopify MCP or Shopify CLI separately |

---

## Key Terms Glossary

| Term | Plain explanation |
|---|---|
| **Information Gain** | Google's ranking patent (US11769017B1) that rewards content providing NEW information vs the existing index. The #1 ranking factor nobody talks about openly. |
| **EAV Triple** | Entity-Attribute-Value. A structured way to describe what a topic page should cover: Entity (the thing), Attribute (its properties), Value (how it relates to other things). Used to build semantic depth. |
| **POP Test** | PageOptimizer Pro's element hierarchy from 400+ controlled Google algorithm tests. Group A (critical): title, body, URL, H1. Group B (important): H2, H3, H4, anchor text. Group C (supporting): bold, italic, alt text. Group D (minimal): schema, meta description. |
| **E-E-A-T** | Experience, Expertise, Authoritativeness, Trustworthiness. Google's quality rater framework. Real E-E-A-T is demonstrated, not declared. |
| **Zero-click risk** | Percentage of searches for a keyword that end without any click. Informational queries: ~60% zero-click on desktop, 77% on mobile. High zero-click = less traffic even if you rank #1. |
| **AI Overview (AIO)** | Google's AI-generated summary at the top of search results. Reduces organic CTR 58-61% for top-ranking pages. Being cited IN the AIO earns 35% more clicks. Featured snippet optimization increases citation chance. |
| **Semantic predicate** | Verbs that signal contextual depth to NLP models. For LED lighting: "dim", "drive", "wire", "flicker", "rectify", "retrofit" signal a different expertise level than "use", "install", "choose". |
| **Hub and spoke** | Content architecture where a broad pillar page (hub) links to specific deep-dive articles (spokes), and all spokes link back to the hub. Signals topical authority to Google. |
| **Anti-slop** | SuperSEO's ruleset of banned words, banned phrases, and banned structural patterns that identify AI-generated content. Built into `write-content` and `improve-content`. |

---

*Guide written by Claude Code — sinrasu mode, 2026-09-14*  
*Source: superseo.plugin.zip v0.2.0 by Bizwit AI*
