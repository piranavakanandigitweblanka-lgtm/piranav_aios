# Guidelines — On-Page SEO

**Status:** DRAFT
**Sheet:** On-Page SEO (BGCT workbook, Sheet 2)
**Tasks covered:** OP-1 through OP-8
**Owner:** Piranav | **Reviewer:** Sajeesan
**Source:** `_Technical SEO Tasks BGCT (1).xlsx`
**Last updated:** 2026-10-09

---

## OP-1 — Meta Titles Optimization

| Rule | Detail |
|---|---|
| **Format** | `[Primary Keyword] | [Secondary Keyword / Value Prop] | [Brand]` |
| **Length** | 40–60 characters (safe range; Google truncates based on pixel width not exact character count) |
| **Uniqueness** | Every page must have a unique title. Duplicate titles across similar products must be differentiated. |
| **Keyword placement** | Primary keyword must appear in the first 60 characters. |
| **Prohibited** | Keyword stuffing (same keyword repeated). All-caps titles. Brand-only titles. |
| **Priority: Critical** | Titles that are blank, duplicated, or too short (<30 chars) must be fixed first. |
| **Priority: High** | Titles without target keyword in first 60 characters. |
| **Escalation: Business** | Titles for campaign landing pages must be reviewed by the relevant campaign owner before change. |

---

## OP-2 — Meta Descriptions Optimization

| Rule | Detail |
|---|---|
| **Length** | 120–155 characters |
| **CTA required** | Must include a call-to-action: "Shop now", "Buy online", "Discover", "Free delivery". |
| **USP required** | Include one differentiator: free shipping, UK stock, trade pricing, warranty. |
| **Uniqueness** | No two pages should have the same description. |
| **Prohibited** | Copying the product title. All-promotional text with no descriptive value. |
| **Escalation: Business** | Brand-level taglines and USP claims in descriptions require business validator sign-off. |

---

## OP-3 — Heading Structure (H1–H6) Cleanup

| Rule | Detail |
|---|---|
| **One H1 per page** | Team standard (not a Google requirement, but a defensible accessibility and SEO practice). |
| **No level-skipping** | H1 → H2 → H3 order only. Do not jump from H2 to H4. |
| **Keywords in H2** | Include secondary and LSI keywords in H2 tags naturally. |
| **Prohibited** | Using heading tags purely for visual styling. Multiple H1 tags on the same page. |
| **Escalation: Developer** | If a theme injects unwanted heading tags through app code or section schema, developer must resolve. |

---

## OP-4 — Image Alt Text Audits

| Rule | Detail |
|---|---|
| **All product images** | Must have descriptive alt text. Zero missing alt text on product images is the pass condition. |
| **Lifestyle images** | Must describe the scene: "Warm LED strip installed under kitchen cabinet". |
| **Decorative images** | Must have `alt=""` (empty string), not a descriptive text. |
| **Prohibited** | "Image of", "Photo of", keyword stuffing in alt text. Filename as alt text. |
| **Priority: Critical** | Product images with no alt text. |
| **Priority: Medium** | Banner/lifestyle images with missing or generic alt text. |

---

## OP-5 — Schema / Structured Data (Product)

| Rule | Detail |
|---|---|
| **Required fields** | `name`, `image`, `description`, `sku`, `brand`, `offers` (price, currency, availability) |
| **Price accuracy** | Schema price must match the displayed page price exactly. |
| **Zero Rich Results Test errors** | Required before a schema implementation is considered complete. |
| **Prohibited** | Product schema on collection/category pages. Fake or placeholder GTIN data. |
| **Escalation: Developer** | If schema price does not update when a variant is selected, this is a dynamic rendering issue requiring developer attention. |
| **Safe boundary** | Do not manually edit raw JSON-LD schema in theme files unless you have developer experience. Use an app. |

---

## OP-6 — Schema / Structured Data (Breadcrumb)

| Rule | Detail |
|---|---|
| **Required pages** | All product pages and collection pages. |
| **Matches visible breadcrumbs** | Schema must reflect the breadcrumbs visible in the page UI. |
| **Current page is not a link** | The final item in BreadcrumbList must not have a `url` property. |
| **Escalation: Developer** | If breadcrumb schema conflicts with the breadcrumb rendering in the theme, developer must reconcile. |

---

## OP-7 — Schema / Structured Data (FAQ & Review)

| Rule | Detail |
|---|---|
| **FAQ schema: content must be visible** | FAQ questions and answers must exist as visible HTML on the page. |
| **Review schema: real reviews only** | AggregateRating schema must only be present if real customer reviews exist. Fake reviews = manual penalty risk. |
| **Certified review app required** | Judge.me, Yotpo, Loox, or Okendo. Do not write AggregateRating schema manually. |
| **Prohibited** | Promotional FAQ content ("Is shipping free?" "Yes always!"). Review schema with no review app installed. |
| **Escalation: Business Validator** | Any promotional claim in FAQ schema content requires business validator approval. |

---

## OP-8 — Duplicate Content Fixes

| Rule | Detail |
|---|---|
| **Unique descriptions** | Every product page must have a unique description. Manufacturer defaults must be rewritten. |
| **Canonical for unavoidable duplicates** | When duplication cannot be eliminated, `rel="canonical"` must point to the master page. |
| **Collection filter combinations** | Multi-parameter filter URLs (`?color=red&size=large`) must be noindexed. |
| **Priority: High** | Products with manufacturer-default descriptions shared with competitor stores. |
| **Escalation: Business** | Decisions to merge products (variants vs separate products) require product owner/business approval. |
