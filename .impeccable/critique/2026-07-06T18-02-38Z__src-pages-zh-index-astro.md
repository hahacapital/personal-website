---
target: Home page (src/pages/zh/index.astro)
total_score: 32
p0_count: 1
p1_count: 1
timestamp: 2026-07-06T18-02-38Z
slug: src-pages-zh-index-astro
---
Method: dual-agent (A: design-review · B: detector-evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Strong live-availability status dot + all interaction states; no scroll/section indicator on the long single column. |
| 2 | Match System / Real World | 3 | Plain concrete language, but hero fronts "Forward Deployed Engineer"/"FDE" with the gloss only mid/bottom page (addressed: hero gloss added). |
| 3 | User Control and Freedom | 3 | Zero-JS details FAQ, path-preserving language switch, skip link, no traps. |
| 4 | Consistency and Standards | 3 | Ledger/hairline/mono system applied throughout; CJK half/full-width punctuation was mixed (fixed); two CTAs differ in radius (8 vs 10px). |
| 5 | Error Prevention | 3 | Static brand page; mailto/external rel handled; no form to mis-fill. |
| 6 | Recognition Rather Than Recall | 4 | Contact channels shown in full next to the CTA; dt/dd keys pair with values. |
| 7 | Flexibility and Efficiency | 3 | Multiple convert paths, keyboard-reachable; no power-user affordance needed. |
| 8 | Aesthetic and Minimalist Design | 4 | Restrained, high-signal, one coral note under 10% budget; nothing decorative is load-bearing. |
| 9 | Error Recovery | 3 | Few error states; CaseIndex empty-state now reachable after the fixture filter. |
| 10 | Help and Documentation | 3 | Genuine, quotable FAQ doubling as JSON-LD; sits at page bottom. |
| **Total** | | **32/40** | **Good / strong.** |

## Anti-Patterns Verdict

**Not AI slop.** Clears every DON'T in DESIGN.md: no editorial-typographic cliché (grotesque headings, not italic Fraunces + tracked mono kicker), no hero-metric block, no cream/sand body (pure white oklch(1 0 0)), no side-stripes, no gradient text, no glassmorphism, no identical icon-card grid, no per-section tracked eyebrow. The 01/02/03 markers are earned (pillars = a genuine set; cases = a numbered contents list), never reflexive scaffolding. Mono is quarantined to the instrument voice (status line, indices, metric values, timeline periods, contact identifiers).

**Deterministic scan:** detector exit 2, 2 advisory `design-system-radius` findings (IdentityPillars.astro:129 `.pillar__tick`, Faq.astro:101 toggle icon) — both false positives: 2px is a line-cap round on a 2px/1.5px marker bar, matching the shell's own convention (Header nav bars, global focus). Rendered HTML clean: 67× tokenized colors, 0 hardcoded literals, 0 gradient-text, 0 side-stripes; the single box-shadow is a tokenized transparent focus ring on the status dot (flat-elevation compliant). JSON-LD correct (Person + FAQPage + Q×2 + A×2 per page, answers verbatim in visible DOM). One h1, no heading-level skips, all 20 anchors + 3 summaries named, 0 missing alt (imagery-free by design), FAQ answers crawlable (not JS-gated).

**Browser overlays:** unavailable — no browser automation (chromium/playwright/puppeteer absent). Evidence gathered from rendered HTML on disk instead. This was the only skipped step.

## Overall Impression

A disciplined realization of the "Machined Faceplate" system — the two-voice (editorial + instrument) treatment is real, not cosmetic, and the Timeline is the cleanest execution (hairline spine, filled coral tick on the live role, tabular periods). The single biggest risk was content, not design: the flagship's primary evidence surface was showing a self-labeled placeholder.

## What's Working

1. Two-voice discipline: mono appears only where content is a genuine machine value. Keeps the page from reading as a template.
2. Timeline: chronology + "where he is now" conveyed with almost no ink; depth from hairlines, one coral note doing semantic work.
3. Contact recognition-over-recall (heuristic #6 = 4/4): email as real mailto + WeChat as selectable text, each with a dt key, right next to the CTA.

## Priority Issues (and resolution)

- **[P0] "Selected work" shipped the `_fixture` placeholder** as its only entry on both locales ("Fixture", English-only summary on /zh/, metric "0"). RESOLVED: CaseIndex now filters ids beginning `_`, so the section falls through to its honest empty-state until the real case studies land (Tasks 14-18); real ids render automatically.
- **[P1] Hero opened with unglossed "Forward Deployed Engineer"/"AI Agent" jargon** for a mixed technical/business audience. RESOLVED: added a quiet plain-language gloss line in the hero eye-path (bilingual), supporting the statement without competing with the h1.
- **[P2] CJK punctuation mixed half/full-width within the ZH locale** (component copy strings, not the verbatim home-content.ts). RESOLVED: normalized to full-width （，／？）in IdentityPillars, ContactBlock, and the new Hero gloss.
- **[P3] InvestmentSummary had no heading in the document outline** (mono <p id> instead of a heading). RESOLVED: promoted to <h2 class="label-mono"> styled identically (explicit override of the global h2 ramp), completing the outline without reintroducing the tracked-eyebrow cliché.

## Persona Red Flags (pre-fix; now addressed)

- **Jordan (first-timer):** stalled on unglossed "FDE" (P1) and would read "Fixture / Placeholder … Task 14" as an unfinished site (P0). Both fixed.
- **Riley (stress-tester):** the good empty-state was unreachable behind the fixture (now reachable); email long-token handled with word-break; dt-inside-summary nesting is unusual but keyboard-operable.
- **Casey (distracted mobile):** clean — 44px CTAs, whole case row is one tap target, switcher has 44px-adjacent hit area.

## Minor Observations

- Two page-bottom CTAs (contact panel + footer) point to /contact/ with slightly different radii (8 vs 10px) — harmless redundancy; could unify the button geometry token later.
- The contact CTA panel is the one sanctioned "card" (DESIGN.md: "the one place a panel earns its keep"), isolated to the conversion moment — compliant.
- heroStatement, FAQ, and JSON-LD all draw from one home-content.ts source, so structured data cannot drift from visible copy.
