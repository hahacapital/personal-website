---
target: About page (src/components/AboutBody.astro + src/pages/{zh,en}/about.astro)
total_score: 28
p0_count: 0
p1_count: 1
timestamp: 2026-07-06T19-17-20Z
slug: src-components-aboutbody-astro
---
Method: dual-agent (A: design-review · B: detector-evidence), run as isolated parallel sub-agents per critique.md's Hard Invariants. Browser overlay unavailable (no chromium/playwright/puppeteer, confirmed independently this run and in prior Task 10/11 critiques); Assessment B gathered evidence from the bundled `detect.mjs` CLI scan and rendered HTML on disk instead of screenshots.

## Design Health Score

Assessment A scored the page **28/40** on Nielsen's 10 heuristics ("Good" band). The per-heuristic breakdown wasn't preserved in the synthesis handed back to this session (only the total plus named findings survived the relay), so a fabricated 10-row table isn't reproduced here — the Priority Issues below are the substantive record of what the score is based on.

## Anti-Patterns Verdict

**Not AI slop** (Assessment A). Checked against DESIGN.md's Do's/Don'ts and the parent SKILL.md's absolute bans: no side-stripe border used as a callout accent (the "Working philosophy" section is a plain h2 + lead statement, not a bordered card — deliberately, since a colored `border-left` there would be exactly the banned side-stripe pattern); no card/box treatment anywhere; mono confined to Timeline's period column (the only genuinely tabular/metadata content on the page — Education's dates stay inline prose, see Minor Observations); no tracked-eyebrow kickers; no gradient text, no hero-metric block.

**Deterministic scan** (Assessment B, re-run independently after fixes): `node .claude/skills/impeccable/scripts/detect.mjs --json src/components/AboutBody.astro src/pages/zh/about.astro src/pages/en/about.astro` → exit 2, exactly one advisory finding: `design-system-radius` on `.about-education__tick { border-radius: 2px }` (AboutBody.astro line 216). **Confirmed false positive** — byte-identical to the already-approved `IdentityPillars.pillar__tick` marker (same width/height/radius/color recipe), the same false-positive pattern already adjudicated twice in this repo's own critique history (Task 10's Home critique, Task 11's CaseStudyLayout critique via the reused Faq.astro icon bars).

**Rendered-HTML evidence** (Assessment B, re-verified independently after fixes): exactly one `<h1>` per locale page with a sane h1→h2 outline (Timeline / Working philosophy / Education), no skipped levels; all 3 narrative paragraphs + the plain-language gloss + the philosophy statement + both education entries + all 3 Timeline entries render verbatim on both `/zh/about/` and `/en/about/`; canonical + hreflang links correct; language switcher round-trips `/zh/about/` ↔ `/en/about/`; Person JSON-LD present (emitted globally by `Seo.astro`); the `--text-title` token (a cross-cutting bug fixed just before this task started) resolves correctly and every `var(--...)` AboutBody.astro references is defined in `global.css`'s `@theme` block — no dangling custom properties.

**Browser overlays:** unavailable — no browser automation binary in this sandbox. Evidence gathered from rendered HTML on disk and direct source inspection instead. Only skipped step.

## Overall Impression

A content-heavy biographical page that extends the established Machined-Faceplate vocabulary (hairline-ruled sections, coral ticks, prose measure/line-height recipe from CaseStudyLayout) rather than inventing a new one, and correctly declines to reach for a bordered "callout" card for the philosophy statement where a naive build likely would have. The main real gap — no plain-language anchor for "Forward Deployed Engineer" on a page that could be a visitor's first touch — has been fixed. Two other findings (thin investment evidence, no page-specific structured data) are genuine but were judged out of scope: the former is blocked by a verbatim-content contract from the task brief, the latter would require touching a shared, "fixed"-contract file (BaseLayout/Seo) for a benefit that doesn't clearly outweigh the risk at this scope.

## What's Working

1. **Section order reads as a coherent CV**: narrative (story) and Timeline (the same facts as a visual ledger) are paired adjacently instead of split across the page, Philosophy reads as the reflective synthesis after the facts, Education closes as a credentials footnote — a deliberate, defensible order, not an arbitrary one.
2. **The philosophy statement avoids the side-stripe-border reflex.** A first-draft "callout" instinct would reach for a colored `border-left` card; instead distinction comes from type scale (`--text-lead`) + a real `<h2>` + the same hairline/padding rhythm every other section boundary on the site already uses (IdentityPillars, Timeline, ContactBlock) — extends the system rather than forking it.
3. **Bilingual parity is structural, not a checkbox** — every `:lang(zh)` branch (letter-spacing resets, line-height step-ups on the h1/tagline/gloss/narrative/philosophy/education) is present and verified in the rendered output for both locales, not just implemented for one and assumed for the other.

## Priority Issues (and resolution)

- **[P1] "Forward Deployed Engineer" never glossed in plain language.** The narrative uses the term (plus BaaS/AKDF/SLA) repeatedly with no anchor for a reader who lands on About directly rather than through Home's Hero (which already established this exact gloss pattern via `.hero__gloss`). Matters because PRODUCT.md's primary persona includes business-side, not-always-technical decision-makers who spend "a few minutes deciding whether to reach out." **RESOLVED**: added a plain-language gloss paragraph (`.about-intro__gloss`, in AboutBody's own frontmatter, not in the verbatim `aboutContent` data) right after the tagline byline and before the narrative begins, written in this page's third-person voice (distinct wording from Hero's first/direct-address gloss, same purpose).
- **[P2] About's investment/quant-research evidence is much thinner than Home's** — one trailing clause ("...while continuing to run the quant and investment research practice under hahacapital") vs. Home's named artifacts + metrics (ff-service, VC tooling, quant backtesting). Undercuts PRODUCT.md's "evidence over adjectives" principle. **NOT fixed, disclosed as an accepted scope limit**: `aboutContent.ts`'s narrative is mandated verbatim content from the task brief (required word-for-word, and checked in this task's own self-review criteria) — expanding it would break that contract. A cross-link to Home's InvestmentSummary section was considered and rejected: it would require adding a new anchor id to the already-approved, out-of-scope `InvestmentSummary.astro`, which is a bigger change than this finding's severity (P2) justifies.
- **[P2] No page-specific JSON-LD.** About gets only the sitewide base `Person` block from `Seo.astro` (name/jobTitle/url/sameAs/email); no `alumniOf`/`worksFor`-style enrichment despite this being literally the career/education page, which PRODUCT.md's crawler/LLM-legibility goal would reward. **NOT fixed, disclosed as an accepted scope limit**: doing this correctly means either extending the shared `buildPersonJsonLd`/`Seo.astro` contract (BaseLayout's own header comment calls its prop contract "fixed," and `buildPersonJsonLd` is called unconditionally for every page) or emitting a second, unlinked `@type: Person` block via the existing `jsonLd` prop (schema.org-ambiguous: two `Person` nodes with no shared `@id` can read as two different people to a strict parser). Judged a bigger lift than this task's scope; flagged as a well-scoped follow-up (extend `buildPersonJsonLd` with optional `alumniOf`/`worksFor`, wire from `aboutContent`/`siteConfig`, verify with a rich-results test before shipping).
- **[P3] `overflow-wrap: anywhere` was only on the narrative prose**, not the philosophy statement or education list items. **RESOLVED**: added to `.about-philosophy__text` and `.about-education__item`.
- **[P3] No `max-width` cap on the About h1**, unlike Hero's/CaseStudyLayout's h1 treatment. **RESOLVED** for systematic consistency (`20ch` / `24ch` zh) — no visible change today since "About Yixiang Zhang" / "关于张翼翔" are already well under the cap, but it protects a future longer title from spanning the full container width unbalanced.
- **[P3, left as-is]** Timeline uses mono tabular dates but Education doesn't. Not a defect: each education string is one unstructured field (institution + degree + GPA + dates all inline, per the brief's `education: string[]` shape) rather than separate columns — making the dates tabular would require parsing content that must stay verbatim.

## Persona Red Flags

- **Jordan (first-timer / business-side reader)**: the P1 fix directly serves Jordan — previously, landing on About cold meant hitting "Forward Deployed Engineer" three times in the narrative with zero plain-language anchor; now resolved before the narrative begins.
- **Sam (accessibility)**: heading outline is clean (1 h1 → 3 h2s in a sensible order, no skipped levels); all tick/marker spans are `aria-hidden` decorative with the real text carrying the meaning; no custom widgets, fully linear tab order. No red flags found.

## Minor Observations

- The detector's one advisory finding is a repeat, confirmed false positive (see Deterministic scan above); no action needed.
- Section order (Narrative → Timeline → Philosophy → Education) was a judgment call, not specified by the brief, made explicit in `AboutBody.astro`'s header comment for future maintainers.
- The new `AboutBody.astro` component (bundling all four sections in one file rather than one component per section) deviates from the brief's literal file list, which named only `about-content.ts` + the two page files. Chosen because `aboutContent` — and everything built from it — is explicitly single-use ("used only by the About pages" per the brief's own Interfaces note), matching CaseStudyLayout's own precedent for bundling multiple sections in one file; it also keeps the two locale pages byte-thin and avoids duplicating the CSS between them.
