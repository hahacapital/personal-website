---
target: Case study page template (src/layouts/CaseStudyLayout.astro)
total_score: 36
p0_count: 0
p1_count: 1
timestamp: 2026-07-06T18-22-06Z
slug: src-layouts-casestudylayout-astro
---
Method: dual-agent (A: design-review · B: detector-evidence). Browser overlay unavailable (no chromium/playwright/puppeteer); Assessment B gathered evidence from rendered HTML on disk.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Static article; nav aria-current on Work, FAQ +/− discloses state. Nothing to poll. |
| 2 | Match System / Real World | 4 | Locale-correct dates via Intl.DateTimeFormat, plain labels, no jargon. |
| 3 | User Control and Freedom | 3 | Skip link; FAQ details-open collapsible; no traps. |
| 4 | Consistency and Standards | 3 | Strong internal consistency; docked for the shared --text-title token gap (fixed in prose). |
| 5 | Error Prevention | 4 | No user input; .filter(Boolean) + hasMetrics/hasFaqs guards. |
| 6 | Recognition Rather Than Recall | 4 | Labels sit with values (dt/dd); FAQ open by default in served HTML. |
| 7 | Flexibility and Efficiency | 3 | Fine for a short single-column article; no TOC needed. |
| 8 | Aesthetic and Minimalist Design | 4 | Disciplined, one accent, generous air; exemplary. |
| 9 | Error Recovery | 4 | No error states on a static article; empty handled upstream. |
| 10 | Help and Documentation | 3 | The FAQ block is the contextual help, well-built. |
| **Total** | | **36/40** | **Good / strong.** |

## Anti-Patterns Verdict

**Not AI slop.** Clears every DESIGN.md DON'T and PRODUCT.md anti-reference. The critical call — the metrics "results plate" vs the banned hero-metric block — is avoided structurally, not cosmetically: value in the editorial SANS at title scale (--text-h3, not display), label in MONO, hairline rules BETWEEN items (never boxes around), one 2px coral hairline anchoring the plate (same grammar as IdentityPillars .pillar__tick and the blockquote). It reads as an instrument spec readout, not a SaaS stat-card. The "Updated" line is legit instrument voice (real <time datetime> feeding Article JSON-LD, sentence-case not tracked-uppercase, appears once) — not the banned per-section eyebrow. Mono is quarantined to date/metric-labels/inline-code; prose body+headings are all sans.

**Deterministic scan:** NEW CaseStudyLayout.astro scans CLEAN (detect.mjs exit 0). Both built pages emit exit 2 solely from 1 advisory `design-system-radius` (border-radius: 2px) — a confirmed FALSE POSITIVE originating in reused Faq.astro icon marker-bars / the global :focus-visible convention, NOT new code. All new CaseStudyLayout radii (4px/8px) are on the DESIGN.md rounded scale (sm/md).

**Rendered-HTML evidence (all pass):** rich page emits 3 valid JSON-LD types (Person/Article/FAQPage) with Article.url == canonical href; FAQPage correctly ABSENT on the empty-faqs fixture (and the whole cs-faq section omitted); exactly one h1 with no skipped heading levels; metrics are a valid <dl> with dt-before-dd in every pair; landmarks (article/header/section aria-label/aria-labelledby) + <time datetime> present; 100% tokenized colors, zero hardcoded hex/rgb/oklch literals in scoped rules, no gradients/side-stripes/text-fill; FAQ answer verbatim in both visible DOM and JSON-LD (not JS-gated); complete prose element set (h2/h3/ul/ol/li/strong/em/code/blockquote/a).

**Browser overlays:** unavailable — no browser automation binary present. Evidence gathered from rendered HTML on disk instead. Only skipped step.

## Overall Impression

A credible, on-brand, human-feeling realization of the Machined-Faceplate system extended to the article surface. The results plate is the best-executed part and the hardest thing the brief asked for. Bilingual parity is real and structural (per-:lang(zh) tracking/line-height/measure, provably shipped in compiled CSS; localized dates). Ships once the two real defects are fixed.

## What's Working

1. Results plate de-clichés the hero-metric block structurally (editorial-sans value at title scale + mono label + hairline dividers + coral anchor).
2. Bilingual parity is real, not a checkbox — every Latin-tracking reset, CJK line-height step-up, and measure relaxation branches per :lang(zh) and ships.
3. Semantic honesty (real <dl>, <time datetime>, crawlable FAQ, token-built scoped prose) — serves both humans and the AI-crawler audience.

## Priority Issues (and resolution)

- **[P1] `--text-title` referenced but never defined** (global.css @theme), so prose h3 fell back to a fixed 1.25rem off the fluid scale — flattening h2/h3/h4 hierarchy in long bodies and letting h3 render smaller than a metric value. Shared-system origin (Timeline/Faq also reference it). RESOLVED in scope: gave prose its own self-contained descending ramp — h2 var(--text-h3) (~22-28px) / h3 clamp(1.1875rem,1.1rem+0.4vw,1.375rem) (~19-22px) / h4 var(--text-body) held apart by --color-muted. Did NOT edit the global token (would silently restyle the approved Task-10 Timeline/Faq); flagged as a system-wide follow-up for the design-system owner.
- **[P2] No inline overflow-wrap for long tokens/URLs in prose** — only <pre> scrolled; a long inline code string or bare URL could force horizontal column overflow on mobile. RESOLVED: added `overflow-wrap: anywhere` to `.prose` (cascades to p/li/code/a).
- **[P3] Metrics section's only accessible name is an invisible aria-label ("Results"/"成果")** — semantically sound (<dl> dt/dd) but a sighted user has no visible anchor. Left as-is: stylistic-adjacent and defensible; the section is a data readout, and adding a visible mono label is an optional enhancement, not a defect.

## Persona Red Flags (pre-fix; now addressed)

- **Casey (mobile):** the P2 inline-overflow gap was Casey's specifically (long config key / URL → horizontal page scroll). Fixed. Plate stacks gracefully on narrow screens.
- **Riley (stress-tester):** would feed a 6-level heading body and hit the P1 flattening (fixed); metric value longer than its label wraps via text-wrap:balance and stacks below 34rem.
- **Sam (accessibility):** largely satisfied — <time datetime>, <dl> semantics, aria-label/aria-labelledby, real <summary> focus ring, no color-only cues. Only note was the P3 invisible-only Results naming.

## Minor Observations

- border-radius 4px/8px in .prose code/pre are hardcoded, but the system defines no --radius-* tokens, so this is the house convention (Faq.astro hardcodes 4px too). Not drift.
- Sub-space-xs micro-gaps (0.35rem/0.5rem) are raw values, consistent with Timeline/CaseIndex/Pillars which already free-hand optical nudges below the 4pt scale.
- datePublished === dateModified in the Article JSON-LD is intentional (v1 tracks no separate publish date), documented in the layout comment.
- The plate's grid-auto-flow: column / max-content implies a realistic 1-4 metric ceiling (rich fixture uses 4); 6+ metrics could overflow before wrapping — theoretical, could harden with auto-fit later.
