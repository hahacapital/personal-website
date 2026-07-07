# personal-website

A bilingual (Chinese/English) personal portfolio site for 张翼翔 / Yixiang Zhang, an independent Forward Deployed Engineer (FDE) who ships enterprise AI Agent systems into production. The site has two jobs: let enterprise decision-makers evaluating outside help on an AI Agent project find him and quickly understand what he does and how to engage him, and be discoverable and citable by mainstream AI assistants and search engines — international (ChatGPT, Claude, Gemini, Perplexity) and domestic Chinese (Doubao, DeepSeek, Qwen, ERNIE Bot, Yuanbao, Kimi) alike — i.e. it is built for Generative Engine Optimization (GEO), not just traditional SEO. His investment/quant research work (`hahacapital`) appears throughout as evidence of AI-and-adjacent-industry fluency, not as a pitch to be hired as an investor. It's an Astro static site styled with Tailwind CSS v4 (see "Tech Stack" below); the full design rationale lives in [`docs/superpowers/specs/2026-07-06-personal-website-design.md`](docs/superpowers/specs/2026-07-06-personal-website-design.md) (the design spec) and [`docs/superpowers/plans/2026-07-06-personal-website.md`](docs/superpowers/plans/2026-07-06-personal-website.md) (the implementation plan this repo was built from, task by task).

## Tech Stack

- [Astro](https://astro.build) (static output)
- [Tailwind CSS v4](https://tailwindcss.com), wired via the `@tailwindcss/vite` Vite plugin (no `tailwind.config.js`)
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) for `sitemap-index.xml` generation, configured with `i18n` locale mapping (`zh` → `zh-CN`, `en` → `en-US`, default `zh`) and a `filter` that excludes the root `/` redirect page (a client-side-only page with no unique content; also avoids a duplicate-`hreflang="zh-CN"` quirk in the integration's i18n grouping when `/` and `/zh/` are both present — see the comment in `astro.config.mjs`)
- TypeScript (strict, via `astro/tsconfigs/strict`)
- [Vitest](https://vitest.dev) for the unit/integration test suite and the full-site build-verification suite (see "Testing")

## Design Workflow

`PRODUCT.md` at the project root is the strategic brief (register, users, product purpose, brand personality, anti-references, design principles, accessibility) that every [`impeccable`](https://impeccable.style) invocation reads before doing design work. `DESIGN.md` (also at the root) is the resulting visual system — the machine-readable design tokens (colors, typography, the `rounded` radius scale, spacing, component recipes) plus the DESIGN.md-spec body (Overview / Colors / Typography / Elevation / Radius / Components / Do's and Don'ts). New pages should extend `DESIGN.md`'s system, not re-derive it. The `impeccable` Claude Code skill is installed at `.claude/skills/impeccable/` via `npx impeccable install`; it adds `craft`/`shape`/`critique`/`audit`/`polish`/etc. commands plus a UI anti-pattern-detection hook. Re-run `npx impeccable install` (or `npx impeccable update`) to refresh the skill; `.claude/settings.local.json`, which the installer also writes for the detection hook, is intentionally not committed (local-only, matching this machine's global gitignore convention for that file).

**For any future visual change, `PRODUCT.md`/`DESIGN.md` are the source of truth, and `impeccable` (`craft`/`shape`/`critique`/`audit`/`polish`) is the primary tool for executing it** — the same workflow that produced the current design. `taste-skill` (installed on demand via `npx skills add https://github.com/Leonxlnx/taste-skill`) can be run as a secondary, non-authoritative cross-check during a final polish pass, the way it was used in the visual-polish task on the Home page — but it is not committed to this repo (gitignored, local-only install) and its opinions defer to a settled `DESIGN.md` decision when the two disagree (e.g. it flags em dashes as a generic tell; this project's editorial voice deliberately uses them, so that flag was correctly overridden rather than "fixed").

## Design System

The shared shell lives in `src/layouts/BaseLayout.astro` (props `{ lang, title, description, path, jsonLd? }`, plus two optional, additive props — `alternateLocales?: ('zh'|'en')[]` and `langAltHref?: string` — used only by the one locale-asymmetric page; see "English résumé" below) which renders `<Seo>` + `<Header>` + `<main>` slot + `<Footer>`. Every page wraps its content in this layout.

- **Components**: `Header.astro` (sticky masthead — wordmark, nav via `useTranslations`, `LanguageSwitcher`; inline nav on desktop, a zero-JS `<details>` disclosure on mobile), `Footer.astro` (contact ledger — email `mailto:`, WeChat plain text, GitHub link, all from `siteConfig`), `LanguageSwitcher.astro` (a 中/EN segmented control linking to `getLocalizedPath(Astro.url.pathname, otherLang)` by default, or an explicit `altHref` override when a page has no real counterpart in the other locale, keyboard-navigable with visible focus).
- **Tokens**: defined in `src/styles/global.css` via Tailwind v4's `@theme` (OKLCH colors, fluid `clamp()` type scale, 4pt spacing, motion easing). Restrained palette — pure-white surface, warm-near-black ink, one coral brand color; warmth is carried by the coral and typography, not a tinted background.
- **Fonts**: self-hosted via `@fontsource-variable/*` (no runtime dependency on Google's CDN, which is blocked in mainland China): **Schibsted Grotesk** (Latin display/body), **Spline Sans Mono** (figures/metadata/labels), **Noto Sans SC** (CJK, weight-matched for bilingual parity). All variable, `font-display: swap`; the CJK subsets load on demand via `unicode-range`.
- **Accessibility**: WCAG AA contrast throughout, a skip link, visible `:focus-visible` rings, `aria-current` on active nav, ≥44px touch targets, and a full `prefers-reduced-motion` branch.

## Pages

- **Home** — `src/pages/zh/index.astro` and `src/pages/en/index.astro` (both `path=""`, wrapped in `BaseLayout`). The flagship landing page, bilingual with structural parity. Section order: Hero → IdentityPillars → CaseIndex → InvestmentSummary → Timeline → ContactBlock. Its FAQ structured data is emitted at the page level via `buildFaqJsonLd(homeContent[lang].faqs)` (a `FAQPage` block), from the same source as the visible Q&A so the two never drift.
  - **Content** lives in `src/data/home-content.ts` — `homeContent: Record<Locale, {...}>` holding the hero statement, three identity pillars (each with proof points), the investment-background summary, a career timeline, and the FAQ pairs. Copy is authored once here for both languages; components read from it and never hardcode strings.
  - **Home components** (`src/components/`): `Hero.astro`, `IdentityPillars.astro`, `CaseIndex.astro`, `InvestmentSummary.astro`, `Timeline.astro`, `ContactBlock.astro`, and `Faq.astro`. Each takes `lang: Locale` (except `Faq.astro`, which takes `items: FaqItem[]` directly). `CaseIndex.astro` queries the per-language content collection (`workZh`/`workEn`), sorts by `entry.data.order`, and links each entry to `/${lang}/work/${entry.id}/`, rendering all six shipped case studies (entries whose id begins with `_` are treated as drafts and excluded). Its optional `variant` prop switches between the Home section (`<h2>`, the default) and the standalone `/work/` index page (`<h1>` + a lead line); the case list itself is identical in both, so the two share one source of truth. `Faq.astro` renders visible, zero-JS `<details open>` Q&A as a plain `<details>` list (not a `<dl>`, so the content model stays valid) — the answer text ships in the served HTML (crawlable, not JS-gated).

- **Work index** — `src/pages/zh/work/index.astro` and `src/pages/en/work/index.astro` (both `path="work"`, wrapped in `BaseLayout`). The standalone "Selected work" listing and the real destination for the header/footer "Work" nav item and the hero's "View work" CTA (all of which resolve to `/${lang}/work/`). Each renders `<CaseIndex lang variant="page" />`, reusing the Home page's case-list component so there is no duplicated listing markup, and passes a `BreadcrumbList` (Home > Work) into `jsonLd`.

- **Case studies** — `src/pages/zh/work/[slug].astro` and `src/pages/en/work/[slug].astro`. Dynamic routes whose `getStaticPaths()` maps over the `workZh` / `workEn` collections (one static page per entry) and passes each `entry.data` field plus the rendered `<Content />` body through the shared `src/layouts/CaseStudyLayout.astro`. All six flagship case studies (bilingual, 12 pages) render through this one template.
  - **`CaseStudyLayout.astro`** props: `{ lang, title, summary, path, metrics: {label,value}[], faqs: {question,answer}[], updatedDate: Date }`. It wraps `BaseLayout` and emits, via `<Seo>`'s `jsonLd`, the full "triple stack" the design spec calls for (`Article` + `ItemList` + `FAQPage` — cited research says this earns ~1.8x more AI-answer citations than `Article` alone) plus a `BreadcrumbList`: an `Article` block (`datePublished`/`dateModified` both derive from `updatedDate` — v1 tracks no separate publish date); an `ItemList` block re-expressing the same `metrics` array as one `ListItem` per metric; a `FAQPage` block when there are FAQs; and a `BreadcrumbList` (Home > Work > this case study's title). `buildArticleJsonLd`/`buildItemListJsonLd`/`buildFaqJsonLd`/`buildBreadcrumbListJsonLd` (all in `src/lib/geo.ts`), `.filter(Boolean)` drops the `ItemList`/`FAQPage` blocks when `metrics`/`faqs` are empty. It renders: a header (mono "Updated" `<time>` line, title, lead summary); a **results plate** presenting the `metrics` array as a value·label spec readout (editorial-sans value at title scale over a mono label, hairline rules between items, one coral anchor — deliberately not the banned hero-metric card); the Markdown body through a token-built `.prose` type system (headings/lists/bold/emphasis/inline code/quotes/links, capped at `--measure`); and the reused `Faq.astro` component when `faqs.length > 0`.
  - **Content** for each case study lives as Markdown in `src/content/work/zh/` and `src/content/work/en/` (six per language), validated by the `workSchema` in `src/content.config.ts`. The `CaseIndex` draft convention (ids beginning `_` are excluded) remains as a guard so a work-in-progress entry can sit in a collection without appearing in the listing.

- **About** — `src/pages/zh/about.astro` and `src/pages/en/about.astro` (both `path="about"`, wrapped in `BaseLayout`, each passing a `BreadcrumbList` (Home > About) into `jsonLd`). All markup and styles live in one component, `src/components/AboutBody.astro` (`{ lang: Locale }`), reused by both locale pages rather than duplicated. Composition top to bottom: an intro section (the page's one `h1`, the `siteConfig.tagline` byline, a plain-language gloss of "Forward Deployed Engineer" for readers who land here directly, then the 3-paragraph career narrative) → the existing `Timeline.astro` (Task 10, reused unmodified with the same 3-entry data as Home — no separate "full timeline" dataset) → a "Working philosophy" section (heading + one lead-scale statement — deliberately not a bordered callout, since a colored side-rule accent is one of impeccable's banned patterns; type scale plus the standard hairline/padding section rhythm does the separating work instead) → an "Education" section (heading + a 2-item ticked list, reusing `IdentityPillars`' coral-tick marker convention).
  - **Content** lives in `src/data/about-content.ts` — `aboutContent: Record<Locale, { narrative: string[]; philosophy: string; education: string[] }>`, used only by the About pages.

- **Contact** — `src/pages/zh/contact.astro` and `src/pages/en/contact.astro` (both `path="contact"`, wrapped in `BaseLayout`, each passing a `BreadcrumbList` (Home > Contact) into `jsonLd`). All markup/styles live in one component, `src/components/ContactBody.astro` (`{ lang: Locale }`). Two sections: an intro (`h1`, the one verbatim bilingual line from `src/data/contact-content.ts`, then a surface-tinted panel holding the email/WeChat contact ledger — the same mono "identifier" recipe `Footer.astro`/`ContactBlock.astro` already established) and a Résumé section (heading + a one-line caption + a link, deliberately **not** folded into the mono ledger above — "下载简历"/"View résumé" is an action phrase, not a machine-readable identifier). zh links to the real `public/resume-zh.pdf` (a `download` attribute with a suggested filename + a mono "PDF" format tag); en links to `/en/resume/` (an HTML page, not a download — see below).
  - **Content** lives in `src/data/contact-content.ts` — `contactContent: Record<Locale, { intro: string }>`, used only by the Contact page; other page copy (labels, résumé caption) is structural microcopy that lives in `ContactBody.astro` itself, the same split `home-content.ts`/`about-content.ts` already establish.

- **English résumé** — `src/pages/en/resume.astro` (`path="resume"`), a standalone, semantic HTML résumé rather than a generated PDF (no font-embedding/print-fidelity pipeline for marginal benefit, and better for GEO than a PDF text layer — a crawler/AI assistant parses HTML more reliably, and any visitor who wants a PDF can print the page). Reuses `aboutContent.en`'s `narrative`/`education` verbatim rather than inventing new copy; styled with a `.prose`-equivalent recipe matching `CaseStudyLayout`'s body typography (measure, line-height, heading/paragraph rhythm). **This is the site's one locale-asymmetric page** — zh has no HTML counterpart; `/zh/contact/` links straight to the PDF instead — so it opts into `BaseLayout`'s `alternateLocales={['en']}` (stops `Seo.astro`/`buildHreflangLinks` from advertising a zh hreflang/x-default alternate that wouldn't build) and `langAltHref="/zh/contact/"` (points the header's "中" language-switch link at the real zh equivalent instead of a mechanically-derived dead link to a nonexistent `/zh/resume/`).

## Content Structure

Each case study is one Markdown file per locale — `src/content/work/zh/*.md` and `src/content/work/en/*.md` (six per language today) — validated against a shared `workSchema` (defined once in `src/content.config.ts` and reused by both the `workZh` and `workEn` collections):

| Field | Type | Used for |
| --- | --- | --- |
| `title` | `string` | The page `<h1>` in `CaseStudyLayout` |
| `summary` | `string` | The lead paragraph under the title, and the `Article` JSON-LD description |
| `order` | `number` | Sort order for `CaseIndex.astro` on Home and the `/work/` index (ascending) |
| `metrics` | `{ label: string, value: string }[]` | The results-plate value·label readout; also emits `ItemList` JSON-LD (one `ListItem` per metric) |
| `faqs` | `{ question: string, answer: string }[]` — optional, defaults to `[]` | Rendered via `Faq.astro`; emits `FAQPage` JSON-LD when non-empty |
| `updatedDate` | coercible date, e.g. `2026-07-06` | The "Updated" byline, and both `datePublished`/`dateModified` in the `Article` JSON-LD |

The Markdown body below the frontmatter becomes the case study's prose, rendered through the shared `.prose` type system in `CaseStudyLayout.astro`.

**To add another case study, no code changes are needed:**

1. Pick a slug — the filename without extension, e.g. `new-case-study` — which becomes the URL in both locales: `/zh/work/new-case-study/` and `/en/work/new-case-study/`.
2. Add `src/content/work/zh/new-case-study.md` **and** `src/content/work/en/new-case-study.md` (same filename in both folders), each with frontmatter matching the `workSchema` table above and a Markdown body written in that locale's language.
3. That's it — `getStaticPaths()` in `src/pages/{zh,en}/work/[slug].astro` maps over the `workZh`/`workEn` collections at build time, so the new entry gets its own static page automatically, and `CaseIndex.astro` picks it up on Home and the `/work/` index too, sorted by `order`.

Two safety nets worth knowing about:
- `tests/content-schema.test.ts` asserts the `workZh` and `workEn` collections have exactly matching ids, so adding a case study to only one locale fails `npm test` instead of silently shipping an unbalanced site.
- An entry whose id (filename) begins with `_` is treated as a draft: it still builds a page, but `CaseIndex.astro` excludes it from the listing — useful for staging a work-in-progress case study without publishing it to the index yet.

## GEO (Generative Engine Optimization) endpoints

Build-time API route endpoints under `src/pages/`, emitted into `dist/` by `astro build`:

- `robots.txt` — allows `*` plus an explicit allow-list of AI crawler user-agents (GPTBot, ClaudeBot, PerplexityBot, Bytespider, Baiduspider, etc.), and links to the sitemap.
- `sitemap-index.xml` (+ `sitemap-0.xml`) — generated by `@astrojs/sitemap`.
- `llms.txt` — a short summary of the site (background, case studies, resources) for LLM consumption, derived from `siteConfig` (`src/data/site.ts`) and the `workEn` content collection.
- `llms-full.txt` — a fuller per-case-study reference (summary + metrics + the raw Markdown body via `entry.body`) derived from the same `workEn` collection, so an AI agent gets the full write-up inline without an extra fetch.

These four files are the concrete implementation of the site's GEO strategy. For the reasoning behind them — why these specific files, why allow AI crawlers at all, the structured-data/FAQ choices, and the sources consulted — see [design spec §6, "GEO Technical Implementation"](docs/superpowers/specs/2026-07-06-personal-website-design.md#6-geo-technical-implementation).

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321` by default.

```bash
npm run build
```

Runs `astro build` and produces the static site in `dist/` — 22 pages (the root locale-redirect page, every core page in both locales, both `/work/` index pages, all 6 case studies × 2 locales, plus the English résumé page) and the GEO endpoints described below. Preview that production build locally with `npm run preview`.

## Testing

```bash
npm test
```

(equivalently `npm run test`). Runs the Vitest suite (`tests/**/*.test.ts` — 5 files, 36 tests as of this writing). Content collections (`src/content.config.ts`) are backed by Astro's content layer, which only loads markdown files into its data store when `astro sync`/`astro build`/`astro dev` runs — Vitest does not trigger that on its own. A Vitest `globalSetup` (`vitest.global-setup.ts`) runs `astro sync` automatically before any test file executes, so `npm test`, `npx vitest run`, and `npx vitest run tests/some-file.test.ts` all work with no manual setup step. This requires `cacheDir: './.astro/'` in `astro.config.mjs` so the CLI sync and Vitest agree on where the data store lives.

`tests/build.test.ts` is a full-site build verification suite: its `beforeAll` shells out to `npm run build` (real `astro build`, up to 180s) and then asserts on the contents of `dist/` — GEO artifacts (`robots.txt`, `llms.txt`/`llms-full.txt` including a content-depth check that the latter inlines real case-study body prose rather than just frontmatter, `sitemap-index.xml`), full page coverage (every core page, both `/work/` index pages, and all 6 case studies in each of `zh`/`en`), the full Article/ItemList/FAQPage/Person/BreadcrumbList structured-data stack on every case study page (plus `BreadcrumbList` alone on About/Contact/the Work index, and its deliberate absence on Home), hreflang cross-linking between locale counterparts, and that the sitemap excludes the root redirect page and never double-counts a `zh-CN` hreflang alternate. It is slower than the rest of the suite because it performs a full production build.

## Before Going Live

Three things remain before this becomes the live, public site. None of them can be scripted — each needs either a domain purchase or the user's own third-party account — so they're manual, one-time steps:

1. **Register a domain and replace the provisional URL everywhere it's hardcoded.** The canonical site URL is currently the placeholder `https://yixiangzhang.com` (not yet registered), and it lives in exactly two places that must **both** be updated together once a real domain exists:
   - `src/data/site.ts` → `siteConfig.siteUrl`, consumed by `Seo.astro`, `CaseStudyLayout.astro`, and the About/Contact/Work-index pages for canonical URLs, `hreflang` alternates, and the URL-bearing JSON-LD fields — `Person.url`, `Article.url`, and each `BreadcrumbList` entry's `item` (`FAQPage` and `ItemList` don't carry a URL field, so `siteUrl` doesn't feed those two).
   - `astro.config.mjs` → the top-level `site` option, which `@astrojs/sitemap` requires in order to emit absolute URLs into `sitemap-index.xml`/`sitemap-0.xml` — the integration needs to know the deployed origin to build a sitemap at all.

   These are two independent literals that currently happen to match; updating only one will leave the other silently stale.

2. **Deploy the site.** Three viable options for this static-output Astro build:
   - **Cloudflare Pages or Vercel** — either works with zero extra config, both offer a free tier with auto-deploy on push. **Build command:** `npm run build`, **output directory:** `dist`. Cloudflare Pages: connect the Git repo and enter those two settings in the dashboard — see [Cloudflare's Astro framework guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/). Vercel: import the Git repo — it auto-detects Astro and configures the equivalent settings itself (see [Astro's Vercel deployment guide](https://docs.astro.build/en/guides/deploy/vercel/)); no adapter or `vercel.json` needed. Ship first to the platform's default subdomain, then attach the custom domain once step 1 is done.
   - **AWS S3 + CloudFront (Tokyo region)** — Terraform under [`infra/aws-static-site/`](infra/aws-static-site/README.md) provisions a private S3 bucket (`ap-northeast-1`) behind a CloudFront distribution (Origin Access Control, not the legacy OAI; a CloudFront Function handles the directory-style routing `/about/` → `/about/index.html`, since CloudFront's `default_root_object` only applies at the site root). Works without a domain from the first `apply` (serves over the default `*.cloudfront.net` HTTPS domain); adding a custom domain later is a documented two-step ACM DNS-validation flow. Deploy content with `./scripts/deploy-aws.sh` (build + `aws s3 sync` + CloudFront invalidation). See the linked README for the full setup.

3. **Manually submit the sitemap** (`https://<your-domain>/sitemap-index.xml`) to [Google Search Console](https://search.google.com/search-console), [Bing Webmaster Tools](https://www.bing.com/webmasters), and [Baidu 站长平台](https://ziyuan.baidu.com/). Each requires signing in with the user's own account, so this can't be automated as part of the build — it's a manual, post-launch step. See [design spec §6](docs/superpowers/specs/2026-07-06-personal-website-design.md#6-geo-technical-implementation) for why this matters for GEO/SEO discoverability.
