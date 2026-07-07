# personal-website

Personal portfolio site for Yixiang Zhang — an Astro static site styled with Tailwind CSS v4.

## Tech Stack

- [Astro](https://astro.build) (static output)
- [Tailwind CSS v4](https://tailwindcss.com), wired via the `@tailwindcss/vite` Vite plugin (no `tailwind.config.js`)
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) for `sitemap-index.xml` generation, configured with `i18n` locale mapping (`zh` → `zh-CN`, `en` → `en-US`, default `zh`)
- TypeScript (strict, via `astro/tsconfigs/strict`)

## Design Workflow

`PRODUCT.md` at the project root is the strategic brief (register, users, product purpose, brand personality, anti-references, design principles, accessibility) that every [`impeccable`](https://impeccable.style) invocation reads before doing design work. `DESIGN.md` (also at the root) is the resulting visual system — the machine-readable design tokens (colors, typography, the `rounded` radius scale, spacing, component recipes) plus the DESIGN.md-spec body (Overview / Colors / Typography / Elevation / Radius / Components / Do's and Don'ts). New pages should extend `DESIGN.md`'s system, not re-derive it. The `impeccable` Claude Code skill is installed at `.claude/skills/impeccable/` via `npx impeccable install`; it adds `craft`/`shape`/`critique`/`audit`/`polish`/etc. commands plus a UI anti-pattern-detection hook. Re-run `npx impeccable install` (or `npx impeccable update`) to refresh the skill; `.claude/settings.local.json`, which the installer also writes for the detection hook, is intentionally not committed (local-only, matching this machine's global gitignore convention for that file).

## Design System

The shared shell lives in `src/layouts/BaseLayout.astro` (props `{ lang, title, description, path, jsonLd? }`, plus two optional, additive props — `alternateLocales?: ('zh'|'en')[]` and `langAltHref?: string` — used only by the one locale-asymmetric page; see "English résumé" below) which renders `<Seo>` + `<Header>` + `<main>` slot + `<Footer>`. Every page wraps its content in this layout.

- **Components**: `Header.astro` (sticky masthead — wordmark, nav via `useTranslations`, `LanguageSwitcher`; inline nav on desktop, a zero-JS `<details>` disclosure on mobile), `Footer.astro` (contact ledger — email `mailto:`, WeChat plain text, GitHub link, all from `siteConfig`), `LanguageSwitcher.astro` (a 中/EN segmented control linking to `getLocalizedPath(Astro.url.pathname, otherLang)` by default, or an explicit `altHref` override when a page has no real counterpart in the other locale, keyboard-navigable with visible focus).
- **Tokens**: defined in `src/styles/global.css` via Tailwind v4's `@theme` (OKLCH colors, fluid `clamp()` type scale, 4pt spacing, motion easing). Restrained palette — pure-white surface, warm-near-black ink, one coral brand color; warmth is carried by the coral and typography, not a tinted background.
- **Fonts**: self-hosted via `@fontsource-variable/*` (no runtime dependency on Google's CDN, which is blocked in mainland China): **Schibsted Grotesk** (Latin display/body), **Spline Sans Mono** (figures/metadata/labels), **Noto Sans SC** (CJK, weight-matched for bilingual parity). All variable, `font-display: swap`; the CJK subsets load on demand via `unicode-range`.
- **Accessibility**: WCAG AA contrast throughout, a skip link, visible `:focus-visible` rings, `aria-current` on active nav, ≥44px touch targets, and a full `prefers-reduced-motion` branch.

## Pages

- **Home** — `src/pages/zh/index.astro` and `src/pages/en/index.astro` (both `path=""`, wrapped in `BaseLayout`). The flagship landing page, bilingual with structural parity. Section order: Hero → IdentityPillars → CaseIndex → InvestmentSummary → Timeline → ContactBlock. Its FAQ structured data is emitted at the page level via `buildFaqJsonLd(homeContent[lang].faqs)` (a `FAQPage` block), from the same source as the visible Q&A so the two never drift.
  - **Content** lives in `src/data/home-content.ts` — `homeContent: Record<Locale, {...}>` holding the hero statement, three identity pillars (each with proof points), the investment-background summary, a career timeline, and the FAQ pairs. Copy is authored once here for both languages; components read from it and never hardcode strings.
  - **Home components** (`src/components/`): `Hero.astro`, `IdentityPillars.astro`, `CaseIndex.astro`, `InvestmentSummary.astro`, `Timeline.astro`, `ContactBlock.astro`, and `Faq.astro`. Each takes `lang: Locale` (except `Faq.astro`, which takes `items: FaqItem[]` directly). `CaseIndex.astro` queries the per-language content collection (`workZh`/`workEn`), sorts by `entry.data.order`, and links each entry to `/${lang}/work/${entry.id}/`, rendering all five shipped case studies (entries whose id begins with `_` are treated as drafts and excluded). Its optional `variant` prop switches between the Home section (`<h2>`, the default) and the standalone `/work/` index page (`<h1>` + a lead line); the case list itself is identical in both, so the two share one source of truth. `Faq.astro` renders visible, zero-JS `<details open>` Q&A as a plain `<details>` list (not a `<dl>`, so the content model stays valid) — the answer text ships in the served HTML (crawlable, not JS-gated).

- **Work index** — `src/pages/zh/work/index.astro` and `src/pages/en/work/index.astro` (both `path="work"`, wrapped in `BaseLayout`). The standalone "Selected work" listing and the real destination for the header/footer "Work" nav item and the hero's "View work" CTA (all of which resolve to `/${lang}/work/`). Each renders `<CaseIndex lang variant="page" />`, reusing the Home page's case-list component so there is no duplicated listing markup.

- **Case studies** — `src/pages/zh/work/[slug].astro` and `src/pages/en/work/[slug].astro`. Dynamic routes whose `getStaticPaths()` maps over the `workZh` / `workEn` collections (one static page per entry) and passes each `entry.data` field plus the rendered `<Content />` body through the shared `src/layouts/CaseStudyLayout.astro`. All five flagship case studies (bilingual, 10 pages) render through this one template.
  - **`CaseStudyLayout.astro`** props: `{ lang, title, summary, path, metrics: {label,value}[], faqs: {question,answer}[], updatedDate: Date }`. It wraps `BaseLayout` and emits, via `<Seo>`'s `jsonLd`, an `Article` block (`datePublished`/`dateModified` both derive from `updatedDate` — v1 tracks no separate publish date) plus a `FAQPage` block when there are FAQs (`buildArticleJsonLd`/`buildFaqJsonLd`, `.filter(Boolean)` drops the FAQ block when `faqs` is empty). It renders: a header (mono "Updated" `<time>` line, title, lead summary); a **results plate** presenting the `metrics` array as a value·label spec readout (editorial-sans value at title scale over a mono label, hairline rules between items, one coral anchor — deliberately not the banned hero-metric card); the Markdown body through a token-built `.prose` type system (headings/lists/bold/emphasis/inline code/quotes/links, capped at `--measure`); and the reused `Faq.astro` component when `faqs.length > 0`.
  - **Content** for each case study lives as Markdown in `src/content/work/zh/` and `src/content/work/en/` (five per language), validated by the `workSchema` in `src/content.config.ts`. The `CaseIndex` draft convention (ids beginning `_` are excluded) remains as a guard so a work-in-progress entry can sit in a collection without appearing in the listing.

- **About** — `src/pages/zh/about.astro` and `src/pages/en/about.astro` (both `path="about"`, wrapped in `BaseLayout`). All markup and styles live in one component, `src/components/AboutBody.astro` (`{ lang: Locale }`), reused by both locale pages rather than duplicated. Composition top to bottom: an intro section (the page's one `h1`, the `siteConfig.tagline` byline, a plain-language gloss of "Forward Deployed Engineer" for readers who land here directly, then the 3-paragraph career narrative) → the existing `Timeline.astro` (Task 10, reused unmodified with the same 3-entry data as Home — no separate "full timeline" dataset) → a "Working philosophy" section (heading + one lead-scale statement — deliberately not a bordered callout, since a colored side-rule accent is one of impeccable's banned patterns; type scale plus the standard hairline/padding section rhythm does the separating work instead) → an "Education" section (heading + a 2-item ticked list, reusing `IdentityPillars`' coral-tick marker convention).
  - **Content** lives in `src/data/about-content.ts` — `aboutContent: Record<Locale, { narrative: string[]; philosophy: string; education: string[] }>`, used only by the About pages.

- **Contact** — `src/pages/zh/contact.astro` and `src/pages/en/contact.astro` (both `path="contact"`, wrapped in `BaseLayout`). All markup/styles live in one component, `src/components/ContactBody.astro` (`{ lang: Locale }`). Two sections: an intro (`h1`, the one verbatim bilingual line from `src/data/contact-content.ts`, then a surface-tinted panel holding the email/WeChat contact ledger — the same mono "identifier" recipe `Footer.astro`/`ContactBlock.astro` already established) and a Résumé section (heading + a one-line caption + a link, deliberately **not** folded into the mono ledger above — "下载简历"/"View résumé" is an action phrase, not a machine-readable identifier). zh links to the real `public/resume-zh.pdf` (a `download` attribute with a suggested filename + a mono "PDF" format tag); en links to `/en/resume/` (an HTML page, not a download — see below).
  - **Content** lives in `src/data/contact-content.ts` — `contactContent: Record<Locale, { intro: string }>`, used only by the Contact page; other page copy (labels, résumé caption) is structural microcopy that lives in `ContactBody.astro` itself, the same split `home-content.ts`/`about-content.ts` already establish.

- **English résumé** — `src/pages/en/resume.astro` (`path="resume"`), a standalone, semantic HTML résumé rather than a generated PDF (no font-embedding/print-fidelity pipeline for marginal benefit, and better for GEO than a PDF text layer — a crawler/AI assistant parses HTML more reliably, and any visitor who wants a PDF can print the page). Reuses `aboutContent.en`'s `narrative`/`education` verbatim rather than inventing new copy; styled with a `.prose`-equivalent recipe matching `CaseStudyLayout`'s body typography (measure, line-height, heading/paragraph rhythm). **This is the site's one locale-asymmetric page** — zh has no HTML counterpart; `/zh/contact/` links straight to the PDF instead — so it opts into `BaseLayout`'s `alternateLocales={['en']}` (stops `Seo.astro`/`buildHreflangLinks` from advertising a zh hreflang/x-default alternate that wouldn't build) and `langAltHref="/zh/contact/"` (points the header's "中" language-switch link at the real zh equivalent instead of a mechanically-derived dead link to a nonexistent `/zh/resume/`).

## GEO (Generative Engine Optimization) endpoints

Build-time API route endpoints under `src/pages/`, emitted into `dist/` by `astro build`:

- `robots.txt` — allows `*` plus an explicit allow-list of AI crawler user-agents (GPTBot, ClaudeBot, PerplexityBot, Bytespider, Baiduspider, etc.), and links to the sitemap.
- `sitemap-index.xml` (+ `sitemap-0.xml`) — generated by `@astrojs/sitemap`.
- `llms.txt` — a short summary of the site (background, case studies, resources) for LLM consumption, derived from `siteConfig` (`src/data/site.ts`) and the `workEn` content collection.
- `llms-full.txt` — a fuller per-case-study reference (summary + metrics + the raw Markdown body via `entry.body`) derived from the same `workEn` collection, so an AI agent gets the full write-up inline without an extra fetch.

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321` by default.

## Testing

```bash
npm test
```

Runs the Vitest suite (`tests/**/*.test.ts`). Content collections (`src/content.config.ts`) are backed by Astro's content layer, which only loads markdown files into its data store when `astro sync`/`astro build`/`astro dev` runs — Vitest does not trigger that on its own. A Vitest `globalSetup` (`vitest.global-setup.ts`) runs `astro sync` automatically before any test file executes, so `npm test`, `npx vitest run`, and `npx vitest run tests/some-file.test.ts` all work with no manual setup step. This requires `cacheDir: './.astro/'` in `astro.config.mjs` so the CLI sync and Vitest agree on where the data store lives.

`tests/build.test.ts` is a build smoke test: its `beforeAll` shells out to `npm run build` (real `astro build`, up to 120s) and then asserts on the contents of `dist/` (GEO artifacts today — `robots.txt`, `llms.txt`, `llms-full.txt`, `sitemap-index.xml` — with more assertions added as later tasks add pages). It is slower than the rest of the suite because it performs a full production build.

## Before Going Live

The `site` field in `astro.config.mjs` is provisionally set to `https://yixiangzhang.com` (not yet registered). Replace it with the real registered domain once available.
