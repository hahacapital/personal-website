# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship the bilingual (zh/en) Astro personal portfolio site described in `docs/superpowers/specs/2026-07-06-personal-website-design.md`.

**Architecture:** Astro static-output site, Tailwind v4 (Vite plugin), content collections for the 5 case studies, a small pure-function GEO library (JSON-LD, hreflang, llms.txt) driven by build-time endpoints, manual folder-based i18n routing (`src/pages/zh/`, `src/pages/en/`), and the `impeccable` design skill driving all visual execution decisions.

**Tech Stack:** Astro (static output), Tailwind CSS v4 (`@tailwindcss/vite`), TypeScript, Vitest, `@astrojs/sitemap`.

## Global Constraints

- All code, comments, config, commit messages, and this plan/spec are English. The `/zh/` routes' visible page copy is Chinese by explicit design requirement (spec §8) — that is content, not documentation, and is exempt from the English-only rule.
- Astro APIs verified 2026-07 (do not use older patterns found in training data):
  - Content collections config file is `src/content.config.ts` at the `src/` root, **not** `src/content/config.ts`.
  - Collections use a `loader` (e.g. `glob({ pattern, base })` from `astro/loaders`), not the legacy `type: 'content'` shape.
  - Entries expose `id`, not `slug`.
  - Render a Markdown body via `import { render } from 'astro:content'; const { Content } = await render(entry);` — **not** `entry.render()` (removed in Astro 5).
  - Tailwind v4 integrates via the `@tailwindcss/vite` Vite plugin (`npx astro add tailwind` wires this automatically). Do **not** use `@astrojs/tailwind` — Astro's own docs label it legacy Tailwind-3-only. No `tailwind.config.js` file; theme customization (if any) lives in CSS via `@theme`.
  - `output: 'hybrid'` no longer exists (merged into `'static'` in Astro 5); omit or set `output: 'static'`.
  - Vitest config wraps `getViteConfig` from `astro/config` (`vitest.config.ts`).
- i18n routing is plain manual folder-based routing (`src/pages/zh/...`, `src/pages/en/...`), **not** Astro's built-in `i18n` routing config feature — simpler and version-proof for this project's needs.
- Package manager: npm.
- Canonical site URL is provisionally `https://yixiangzhang.com` (the spec's recommended domain candidate, not yet registered). It is centralized in exactly one place (`src/data/site.ts`) so it is a one-line search-and-replace once the real domain is registered — documented in the README.
- Visual execution (typefaces, color tokens, exact layout/component treatment) is **not** hardcoded in this plan. Tasks that build visible UI explicitly invoke the `impeccable` skill (already used in the user's other project, `tiktok-roi`) rather than freehand Tailwind markup, because the spec's own design-system section (§5) defers concrete execution to that skill after it flagged the first-draft treatment as a generic cliché. Where a task's "test" is therefore a design-quality gate (`impeccable audit`/`critique`) plus a manual dev-server look rather than an automated assertion, this is stated explicitly — that is the right verification method for generative visual work, not a shortcut.
- Each case study's `metrics` and `faqs` content is sourced verbatim from spec §4.2–§4.6; do not invent new facts/numbers not present in the spec or résumé.

---

## File Structure

```
astro.config.mjs
package.json
tsconfig.json
vitest.config.ts
public/
  resume-zh.pdf                      # copy of the user's existing Chinese résumé
src/
  content.config.ts                  # workZh / workEn collection defs
  content/work/zh/*.md                # 5 case study bodies, Chinese
  content/work/en/*.md                # 5 case study bodies, English
  data/
    site.ts                          # siteConfig: name, contact, sameAs, canonical URL
  i18n/
    ui.ts                            # UI string dictionary per locale
    utils.ts                         # getLangFromUrl, useTranslations, getLocalizedPath
  lib/
    geo.ts                           # buildPersonJsonLd, buildArticleJsonLd, buildFaqJsonLd, buildHreflangLinks
  components/
    Seo.astro
    Header.astro
    Footer.astro
    LanguageSwitcher.astro
    Hero.astro
    IdentityPillars.astro
    CaseIndex.astro                  # case-study index/cards on Home
    InvestmentSummary.astro
    Timeline.astro
    ContactBlock.astro
    Faq.astro
  layouts/
    BaseLayout.astro
    CaseStudyLayout.astro
  pages/
    index.astro                       # root: renders zh Home + client-side locale redirect
    robots.txt.ts
    llms.txt.ts
    llms-full.txt.ts
    zh/
      index.astro
      about.astro
      contact.astro
      work/[slug].astro
    en/
      index.astro
      about.astro
      contact.astro
      work/[slug].astro
tests/
  geo.test.ts                          # includes buildHreflangLinks coverage
  i18n-utils.test.ts
  site-data.test.ts
  content-schema.test.ts
  build.test.ts                       # post-build smoke test over dist/
README.md
```

---

### Task 1: Scaffold Astro project with Tailwind v4

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/styles/global.css`, `src/pages/index.astro` (placeholder)
- Create: `.gitignore`

**Interfaces:**
- Produces: a running `npm run dev` server on the current repo root; `astro.config.mjs` exports a `site` field every later task can rely on existing.

- [ ] **Step 1: Scaffold the project**

```bash
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

Answer prompts if any appear non-interactively-unavailable (template: minimal/empty, TypeScript: strict, install deps: yes). This repo is already a git repo, so do not let the scaffolder re-init git.

- [ ] **Step 2: Add Tailwind v4**

```bash
npx astro add tailwind --yes
```

Verify `astro.config.mjs` now imports `@tailwindcss/vite` and includes it under `vite.plugins`. If the automated `astro add` did not wire it (some versions only install the package), edit `astro.config.mjs` manually to:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://yixiangzhang.com',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Create the global stylesheet**

```css
/* src/styles/global.css */
@import "tailwindcss";
```

- [ ] **Step 4: Wire the stylesheet into a placeholder root page**

```astro
---
// src/pages/index.astro
import '../styles/global.css';
---
<html lang="zh">
  <head>
    <meta charset="utf-8" />
    <title>Yixiang Zhang</title>
  </head>
  <body>
    <p>Scaffold OK.</p>
  </body>
</html>
```

- [ ] **Step 5: Verify the dev server runs**

Run: `npm run dev -- --port 4321 &` then `curl -s localhost:4321 | grep -q "Scaffold OK" && echo PASS`
Expected: `PASS`. Stop the dev server afterward (`kill %1` or equivalent).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project with Tailwind v4"
```

---

### Task 2: i18n utilities and UI string dictionary

**Files:**
- Create: `src/i18n/utils.ts`
- Create: `src/i18n/ui.ts`
- Test: `tests/i18n-utils.test.ts`
- Create: `vitest.config.ts`

**Interfaces:**
- Consumes: nothing (foundational).
- Produces:
  - `type Locale = 'zh' | 'en'`
  - `locales: Locale[]`, `defaultLocale: Locale = 'zh'` (from `src/i18n/utils.ts`)
  - `getLangFromUrl(url: URL): Locale`
  - `useTranslations(lang: Locale): (key: string) => string`
  - `getLocalizedPath(path: string, lang: Locale): string`
  - `ui: Record<Locale, Record<string, string>>` (from `src/i18n/ui.ts`)

- [ ] **Step 1: Add Vitest and the Astro vitest config**

```bash
npm install -D vitest
```

```ts
// vitest.config.ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
```

Add to `package.json` `"scripts"`: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing test for `getLangFromUrl` and `getLocalizedPath`**

```ts
// tests/i18n-utils.test.ts
import { describe, it, expect } from 'vitest';
import { getLangFromUrl, getLocalizedPath, useTranslations, locales, defaultLocale } from '../src/i18n/utils';

describe('getLangFromUrl', () => {
  it('reads the locale from the first path segment', () => {
    expect(getLangFromUrl(new URL('https://example.com/en/about'))).toBe('en');
    expect(getLangFromUrl(new URL('https://example.com/zh/about'))).toBe('zh');
  });

  it('falls back to the default locale for unprefixed paths', () => {
    expect(getLangFromUrl(new URL('https://example.com/'))).toBe(defaultLocale);
  });
});

describe('getLocalizedPath', () => {
  it('swaps the locale segment of a path', () => {
    expect(getLocalizedPath('/zh/work/agent-factory/', 'en')).toBe('/en/work/agent-factory/');
    expect(getLocalizedPath('/en/about/', 'zh')).toBe('/zh/about/');
  });

  it('prefixes a locale-less path', () => {
    expect(getLocalizedPath('/', 'en')).toBe('/en/');
  });
});

describe('useTranslations', () => {
  it('returns the string for a known key in the requested locale', () => {
    const t = useTranslations('en');
    expect(t('nav.home')).toBe('Home');
  });

  it('falls back to the key itself when missing', () => {
    const t = useTranslations('en');
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });
});

describe('locales', () => {
  it('contains exactly zh and en, defaulting to zh', () => {
    expect(locales).toEqual(['zh', 'en']);
    expect(defaultLocale).toBe('zh');
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run tests/i18n-utils.test.ts`
Expected: FAIL — `src/i18n/utils.ts` does not exist yet.

- [ ] **Step 4: Write the UI dictionary**

```ts
// src/i18n/ui.ts
export const ui = {
  zh: {
    'nav.home': '首页',
    'nav.work': '案例',
    'nav.about': '关于',
    'nav.contact': '联系',
    'cta.discuss': '讨论一个项目',
    'cta.download_resume': '下载简历',
    'lang.switch': 'English',
  },
  en: {
    'nav.home': 'Home',
    'nav.work': 'Work',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'cta.discuss': 'Discuss a project',
    'cta.download_resume': 'Download résumé',
    'lang.switch': '中文',
  },
} as const;

export type UiKey = keyof typeof ui['en'];
```

- [ ] **Step 5: Implement `src/i18n/utils.ts`**

```ts
// src/i18n/utils.ts
import { ui } from './ui';

export type Locale = 'zh' | 'en';
export const locales: Locale[] = ['zh', 'en'];
export const defaultLocale: Locale = 'zh';

export function getLangFromUrl(url: URL): Locale {
  const [, maybeLocale] = url.pathname.split('/');
  if (locales.includes(maybeLocale as Locale)) {
    return maybeLocale as Locale;
  }
  return defaultLocale;
}

export function useTranslations(lang: Locale) {
  return function t(key: string): string {
    return (ui[lang] as Record<string, string>)[key] ?? key;
  };
}

export function getLocalizedPath(path: string, lang: Locale): string {
  const segments = path.split('/').filter(Boolean);
  if (locales.includes(segments[0] as Locale)) {
    segments[0] = lang;
  } else {
    segments.unshift(lang);
  }
  return `/${segments.join('/')}/`;
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx vitest run tests/i18n-utils.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add i18n utilities and UI string dictionary"
```

---

### Task 3: Site data and GEO constants

**Files:**
- Create: `src/data/site.ts`
- Test: `tests/site-data.test.ts`

**Interfaces:**
- Consumes: `Locale` from `src/i18n/utils.ts`
- Produces: `siteConfig` object with fields: `siteUrl: string`, `name: Record<Locale, string>`, `tagline: Record<Locale, string>`, `email: string`, `wechat: string`, `github: string`, `sameAs: string[]`

- [ ] **Step 1: Write the failing test**

```ts
// tests/site-data.test.ts
import { describe, it, expect } from 'vitest';
import { siteConfig } from '../src/data/site';

describe('siteConfig', () => {
  it('has a canonical https URL with no trailing slash', () => {
    expect(siteConfig.siteUrl.startsWith('https://')).toBe(true);
    expect(siteConfig.siteUrl.endsWith('/')).toBe(false);
  });

  it('has a name and tagline for both locales', () => {
    expect(siteConfig.name.zh).toBeTruthy();
    expect(siteConfig.name.en).toBeTruthy();
    expect(siteConfig.tagline.zh).toBeTruthy();
    expect(siteConfig.tagline.en).toBeTruthy();
  });

  it('includes the GitHub profile in sameAs', () => {
    expect(siteConfig.sameAs).toContain('https://github.com/hahacapital');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/site-data.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `src/data/site.ts`**

```ts
// src/data/site.ts
export const siteConfig = {
  // Provisional — replace with the registered domain (see README "Before going live").
  siteUrl: 'https://yixiangzhang.com',
  name: {
    zh: '张翼翔',
    en: 'Yixiang Zhang',
  },
  tagline: {
    zh: 'Forward Deployed Engineer · Builder',
    en: 'Forward Deployed Engineer · Builder',
  },
  email: 'zhangyixiangece@gmail.com',
  wechat: '827924829',
  github: 'https://github.com/hahacapital',
  sameAs: ['https://github.com/hahacapital'],
};
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run tests/site-data.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add site config and GEO sameAs data"
```

---

### Task 4: Content collections schema

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/work/zh/_fixture.md`, `src/content/work/en/_fixture.md` (temporary fixtures, deleted in Task 14 once real content lands)
- Test: `tests/content-schema.test.ts`

**Interfaces:**
- Produces: collections `workZh`, `workEn`, both validated against a shared schema with fields `title: string`, `summary: string`, `order: number`, `metrics: {label: string, value: string}[]`, `faqs: {question: string, answer: string}[]` (default `[]`), `updatedDate: Date`. Entries expose `.id` (derived from filename) and `.data` (frontmatter).

- [ ] **Step 1: Write the failing test**

```ts
// tests/content-schema.test.ts
import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('work content collections', () => {
  it('loads the zh and en collections with matching ids', async () => {
    const zh = await getCollection('workZh');
    const en = await getCollection('workEn');
    expect(zh.length).toBeGreaterThan(0);
    expect(en.length).toBeGreaterThan(0);
    const zhIds = zh.map((e) => e.id).sort();
    const enIds = en.map((e) => e.id).sort();
    expect(zhIds).toEqual(enIds);
  });

  it('validates required fields on every entry', async () => {
    const zh = await getCollection('workZh');
    for (const entry of zh) {
      expect(entry.data.title).toBeTruthy();
      expect(entry.data.summary).toBeTruthy();
      expect(typeof entry.data.order).toBe('number');
      expect(Array.isArray(entry.data.metrics)).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/content-schema.test.ts`
Expected: FAIL — `src/content.config.ts` does not exist.

- [ ] **Step 3: Write the fixture content files**

```markdown
<!-- src/content/work/zh/_fixture.md -->
---
title: "Fixture"
summary: "Placeholder entry so the collection validates before real content lands in Task 14."
order: 0
metrics:
  - label: "占位指标"
    value: "0"
faqs: []
updatedDate: 2026-07-06
---

Placeholder body.
```

```markdown
<!-- src/content/work/en/_fixture.md -->
---
title: "Fixture"
summary: "Placeholder entry so the collection validates before real content lands in Task 14."
order: 0
metrics:
  - label: "Placeholder metric"
    value: "0"
faqs: []
updatedDate: 2026-07-06
---

Placeholder body.
```

- [ ] **Step 4: Implement `src/content.config.ts`**

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const workSchema = z.object({
  title: z.string(),
  summary: z.string(),
  order: z.number(),
  metrics: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .default([]),
  updatedDate: z.coerce.date(),
});

const workZh = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work/zh' }),
  schema: workSchema,
});

const workEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work/en' }),
  schema: workSchema,
});

export const collections = { workZh, workEn };
```

- [ ] **Step 5: Run to verify it passes**

Run: `npx vitest run tests/content-schema.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add work content collections with shared schema"
```

---

### Task 5: GEO pure-function library

**Files:**
- Create: `src/lib/geo.ts`
- Test: `tests/geo.test.ts`

**Interfaces:**
- Consumes: `siteConfig` from `src/data/site.ts` (for `buildPersonJsonLd` defaults only — the function itself takes explicit params, does not import siteConfig directly, to stay a pure/testable unit).
- Produces:
  - `buildPersonJsonLd(person: { name: string; jobTitle: string; url: string; sameAs: string[]; email: string }): Record<string, unknown>`
  - `buildArticleJsonLd(article: { headline: string; description: string; url: string; datePublished: string; dateModified: string; inLanguage: 'zh' | 'en' }): Record<string, unknown>`
  - `buildFaqJsonLd(items: { question: string; answer: string }[]): Record<string, unknown> | null`
  - `buildHreflangLinks(slug: string, baseUrl: string): { hreflang: string; href: string }[]` — for the site root (Home/About/Contact) pass `slug: ''` to get `/zh/`, `/en/` pairs; for case studies pass e.g. `'work/agent-factory'`.

- [ ] **Step 1: Write the failing tests**

```ts
// tests/geo.test.ts
import { describe, it, expect } from 'vitest';
import { buildPersonJsonLd, buildArticleJsonLd, buildFaqJsonLd, buildHreflangLinks } from '../src/lib/geo';

describe('buildPersonJsonLd', () => {
  it('produces a schema.org Person with sameAs', () => {
    const result = buildPersonJsonLd({
      name: 'Yixiang Zhang',
      jobTitle: 'Forward Deployed Engineer',
      url: 'https://yixiangzhang.com/en/',
      sameAs: ['https://github.com/hahacapital'],
      email: 'zhangyixiangece@gmail.com',
    });
    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('Person');
    expect(result.name).toBe('Yixiang Zhang');
    expect(result.sameAs).toEqual(['https://github.com/hahacapital']);
  });
});

describe('buildArticleJsonLd', () => {
  it('produces a schema.org Article with the given language', () => {
    const result = buildArticleJsonLd({
      headline: 'AI Agent Factory',
      description: 'Building agents that build agents.',
      url: 'https://yixiangzhang.com/en/work/agent-factory/',
      datePublished: '2026-07-01',
      dateModified: '2026-07-06',
      inLanguage: 'en',
    });
    expect(result['@type']).toBe('Article');
    expect(result.inLanguage).toBe('en');
    expect(result.headline).toBe('AI Agent Factory');
  });
});

describe('buildFaqJsonLd', () => {
  it('produces a schema.org FAQPage for non-empty items', () => {
    const result = buildFaqJsonLd([{ question: 'Q1?', answer: 'A1.' }]) as any;
    expect(result['@type']).toBe('FAQPage');
    expect(result.mainEntity).toHaveLength(1);
    expect(result.mainEntity[0]['@type']).toBe('Question');
    expect(result.mainEntity[0].acceptedAnswer.text).toBe('A1.');
  });

  it('returns null for an empty list', () => {
    expect(buildFaqJsonLd([])).toBeNull();
  });
});

describe('buildHreflangLinks', () => {
  it('builds zh/en/x-default links for a case study slug', () => {
    const links = buildHreflangLinks('work/agent-factory', 'https://yixiangzhang.com');
    expect(links).toEqual([
      { hreflang: 'zh', href: 'https://yixiangzhang.com/zh/work/agent-factory/' },
      { hreflang: 'en', href: 'https://yixiangzhang.com/en/work/agent-factory/' },
      { hreflang: 'x-default', href: 'https://yixiangzhang.com/zh/work/agent-factory/' },
    ]);
  });

  it('builds root links when slug is empty', () => {
    const links = buildHreflangLinks('', 'https://yixiangzhang.com');
    expect(links).toEqual([
      { hreflang: 'zh', href: 'https://yixiangzhang.com/zh/' },
      { hreflang: 'en', href: 'https://yixiangzhang.com/en/' },
      { hreflang: 'x-default', href: 'https://yixiangzhang.com/zh/' },
    ]);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx vitest run tests/geo.test.ts`
Expected: FAIL — `src/lib/geo.ts` does not exist.

- [ ] **Step 3: Implement `src/lib/geo.ts`**

```ts
// src/lib/geo.ts
export interface PersonInfo {
  name: string;
  jobTitle: string;
  url: string;
  sameAs: string[];
  email: string;
}

export function buildPersonJsonLd(person: PersonInfo): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    url: person.url,
    sameAs: person.sameAs,
    email: person.email,
  };
}

export interface ArticleInfo {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  inLanguage: 'zh' | 'en';
}

export function buildArticleJsonLd(article: ArticleInfo): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    inLanguage: article.inLanguage,
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqJsonLd(items: FaqItem[]): Record<string, unknown> | null {
  if (items.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export interface HreflangLink {
  hreflang: string;
  href: string;
}

export function buildHreflangLinks(slug: string, baseUrl: string): HreflangLink[] {
  const suffix = slug ? `${slug}/` : '';
  const zhHref = `${baseUrl}/zh/${suffix}`;
  const enHref = `${baseUrl}/en/${suffix}`;
  return [
    { hreflang: 'zh', href: zhHref },
    { hreflang: 'en', href: enHref },
    { hreflang: 'x-default', href: zhHref },
  ];
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npx vitest run tests/geo.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add GEO pure-function library (JSON-LD, hreflang)"
```

---

### Task 6: GEO build endpoints — robots.txt, sitemap, llms.txt

**Files:**
- Create: `src/pages/robots.txt.ts`
- Create: `src/pages/llms.txt.ts`
- Create: `src/pages/llms-full.txt.ts`
- Modify: `astro.config.mjs` (add `@astrojs/sitemap`)
- Test: `tests/build.test.ts` (first slice of the build smoke-test suite; extended again in Task 21)

**Interfaces:**
- Consumes: `siteConfig` (`src/data/site.ts`), `getCollection` from `astro:content` (for `llms-full.txt` to inline case study summaries).
- Produces: `dist/robots.txt`, `dist/sitemap-index.xml`, `dist/llms.txt`, `dist/llms-full.txt` after `astro build`.

- [ ] **Step 1: Install the sitemap integration**

```bash
npx astro add sitemap --yes
```

Verify `astro.config.mjs` now includes:

```js
import sitemap from '@astrojs/sitemap';
// ...
integrations: [
  sitemap({
    i18n: {
      defaultLocale: 'zh',
      locales: { zh: 'zh-CN', en: 'en-US' },
    },
  }),
],
```

- [ ] **Step 2: Write `robots.txt.ts`, explicitly allowing AI crawlers**

```ts
// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

const AI_CRAWLER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Bytespider',
  'Baiduspider',
  'Sogou web spider',
  'PetalBot',
  'meta-externalagent',
];

function buildRobotsTxt(sitemapURL: URL): string {
  const agentBlocks = AI_CRAWLER_AGENTS.map((agent) => `User-agent: ${agent}\nAllow: /`).join('\n\n');
  return `User-agent: *
Allow: /

${agentBlocks}

Sitemap: ${sitemapURL.href}
`;
}

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(buildRobotsTxt(sitemapURL), {
    headers: { 'Content-Type': 'text/plain' },
  });
};

export { buildRobotsTxt };
```

- [ ] **Step 3: Write `llms.txt.ts`**

```ts
// src/pages/llms.txt.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../data/site';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site!.href.replace(/\/$/, '');
  const workEn = await getCollection('workEn');
  const sorted = [...workEn].sort((a, b) => a.data.order - b.data.order);

  const caseLines = sorted
    .map((entry) => `- [${entry.data.title}](${baseUrl}/en/work/${entry.id}/): ${entry.data.summary}`)
    .join('\n');

  const body = `# ${siteConfig.name.en}

> ${siteConfig.tagline.en}. Independent Forward Deployed Engineer shipping enterprise AI Agent systems to production, with a systematic investment/quant research background.

## Background

- Full profile: ${baseUrl}/en/about/
- Contact: ${baseUrl}/en/contact/ (email: ${siteConfig.email})

## Case studies

${caseLines}

## Resources

- Sitemap: ${baseUrl}/sitemap-index.xml
- GitHub: ${siteConfig.github}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
```

- [ ] **Step 4: Write `llms-full.txt.ts`**

```ts
// src/pages/llms-full.txt.ts
import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import { siteConfig } from '../data/site';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site!.href.replace(/\/$/, '');
  const workEn = await getCollection('workEn');
  const sorted = [...workEn].sort((a, b) => a.data.order - b.data.order);

  const sections: string[] = [];
  for (const entry of sorted) {
    const { Content } = await render(entry);
    void Content; // Content is a component, not usable in plain text; we render from data + raw body instead.
    sections.push(
      `## ${entry.data.title}\n\n${entry.data.summary}\n\n${entry.data.metrics
        .map((m) => `- ${m.label}: ${m.value}`)
        .join('\n')}\n\nFull page: ${baseUrl}/en/work/${entry.id}/`
    );
  }

  const body = `# ${siteConfig.name.en} — full reference\n\n${sections.join('\n\n---\n\n')}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
```

- [ ] **Step 5: Write the first slice of the build smoke test**

```ts
// tests/build.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(__dirname, '../dist');

beforeAll(() => {
  execSync('npm run build', { stdio: 'inherit' });
}, 120_000);

describe('GEO build artifacts', () => {
  it('generates robots.txt allowing GPTBot and PerplexityBot', () => {
    const txt = readFileSync(path.join(DIST, 'robots.txt'), 'utf-8');
    expect(txt).toContain('User-agent: GPTBot');
    expect(txt).toContain('User-agent: PerplexityBot');
    expect(txt).toContain('Sitemap:');
  });

  it('generates llms.txt and llms-full.txt', () => {
    expect(existsSync(path.join(DIST, 'llms.txt'))).toBe(true);
    expect(existsSync(path.join(DIST, 'llms-full.txt'))).toBe(true);
  });

  it('generates a sitemap index', () => {
    expect(existsSync(path.join(DIST, 'sitemap-index.xml'))).toBe(true);
  });
});
```

- [ ] **Step 6: Run the build test**

Run: `npx vitest run tests/build.test.ts`
Expected: PASS (3 tests). Note: this build will still only contain the placeholder root page from Task 1 plus these endpoints — that's expected; more pages land in later tasks and this same test file gains more assertions in Task 21.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add robots.txt, llms.txt, llms-full.txt, and sitemap generation"
```

---

### Task 7: Seo component (JSON-LD + hreflang + meta)

**Files:**
- Create: `src/components/Seo.astro`

**Interfaces:**
- Consumes: `buildPersonJsonLd`, `buildHreflangLinks` from `src/lib/geo.ts`; `siteConfig` from `src/data/site.ts`.
- Produces: `Seo.astro` with props `{ lang: 'zh' | 'en'; title: string; description: string; path: string; jsonLd?: Record<string, unknown>[] }`. `path` is the locale-less route (e.g. `''` for home, `'about'`, `'work/agent-factory'`). Every page task from here on renders this once in its `<head>`.

- [ ] **Step 1: Implement the component**

```astro
---
// src/components/Seo.astro
import { buildPersonJsonLd, buildHreflangLinks } from '../lib/geo';
import { siteConfig } from '../data/site';

interface Props {
  lang: 'zh' | 'en';
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown>[];
}

const { lang, title, description, path, jsonLd = [] } = Astro.props;

const hreflangLinks = buildHreflangLinks(path, siteConfig.siteUrl);
const canonical = hreflangLinks.find((l) => l.hreflang === lang)!.href;

const personJsonLd = buildPersonJsonLd({
  name: siteConfig.name[lang],
  jobTitle: siteConfig.tagline[lang],
  url: `${siteConfig.siteUrl}/${lang}/`,
  sameAs: siteConfig.sameAs,
  email: siteConfig.email,
});

const allJsonLd = [personJsonLd, ...jsonLd];
---
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
{hreflangLinks.map((l) => <link rel="alternate" hreflang={l.hreflang} href={l.href} />)}
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content="website" />
{allJsonLd.map((block) => (
  <script type="application/ld+json" set:html={JSON.stringify(block)} />
))}
```

- [ ] **Step 2: Verify it type-checks and builds**

Run: `npx astro check && npm run build`
Expected: no TypeScript errors; build succeeds (the component isn't used by any page yet, but `astro check` will still catch prop/type mistakes if you temporarily import it into `src/pages/index.astro`, which Task 9 does properly).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Seo component for JSON-LD, hreflang, and meta tags"
```

---

### Task 8: Install impeccable and write PRODUCT.md

**Files:**
- Create: `.claude/skills/impeccable/` (via the installer — do not hand-author)
- Create: `PRODUCT.md`

**Interfaces:**
- Produces: `PRODUCT.md` at the project root, read by every subsequent `impeccable` invocation (Tasks 9, 10, 12, 13, 20).

- [ ] **Step 1: Install the impeccable skill**

```bash
npx impeccable install
```

Verify `.claude/skills/impeccable/SKILL.md` now exists.

- [ ] **Step 2: Write `PRODUCT.md` directly from the approved design spec**

The strategic interview impeccable's own `init` flow would normally run has already happened — see `docs/superpowers/specs/2026-07-06-personal-website-design.md` §2 (Audience & Positioning) and §5 (Visual Design System). Write `PRODUCT.md` from that spec rather than re-interviewing the user:

```markdown
# Product

## Register

brand

## Users

Enterprise decision-makers (often technical, sometimes business-side) evaluating whether to bring in outside help to ship an AI Agent project from demo to production. They arrive from a search engine or an AI assistant's answer, already primed with a specific need, and spend a few minutes deciding whether to reach out. A smaller secondary audience: AI assistants and search-engine crawlers themselves, which must be able to parse the site's content directly as text.

## Product Purpose

A personal portfolio site for Yixiang Zhang, an independent Forward Deployed Engineer. It exists to (1) let enterprises undergoing AI transformation find him and quickly understand what he does, (2) get recommended by mainstream AI assistants (international and domestic Chinese) when someone asks a relevant question, and (3) represent his investment/quant research background as evidence of AI-and-adjacent-industry fluency, not as a pitch to be hired as an investor. Success = a visitor can, within a minute of arriving, understand the pitch and know how to start a conversation about a short-term embedded project.

## Brand Personality

Editorial-adjacent, quantitative, calm, credible to both engineers and business decision-makers. Numbers and specific delivered systems carry the pitch, not adjectives. Confident without being flashy — the tone of someone who has actually shipped the things being described, not someone selling a service.

## Anti-references

- Generic SaaS gradient dashboards / generic "AI startup" landing pages.
- The generic italic-serif-plus-tiny-mono-kicker "editorial-typographic" portfolio cliché (Fraunces/Newsreader headline + tracked uppercase labels + ruled columns + zero imagery) — recognizable as the same territory (editorial + data) without being the most obvious, most-seen 2026 execution of it.
- The "hero-metric template" (big number, small label, supporting stats, gradient accent) as a standalone SaaS-style block.
- Anything that reads as a general software agency / consultancy template rather than one specific person's work.

## Design Principles

1. Evidence over adjectives — every claim backed by a specific system, number, or shipped artifact.
2. Bilingual parity — Chinese and English content get equal typographic and structural care; neither is a stripped-down afterthought of the other.
3. Legible to machines and humans alike — a page that reads well to a hurried enterprise visitor should also read as clean, quotable, structured text to an AI crawler.
4. Restraint with a point of view — calm and credible, but distinctive enough that it doesn't read as a template.

## Accessibility & Inclusion

WCAG AA contrast targets sitewide. Respect `prefers-reduced-motion`. Keyboard-reachable navigation and language switcher with visible focus states. No reliance on color alone to convey meaning (e.g. metric emphasis pairs a visual and textual cue).
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: install impeccable design skill and write PRODUCT.md"
```

---

### Task 9: Base layout, header, footer, language switcher (impeccable-driven)

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/LanguageSwitcher.astro`
- Modify: `src/pages/index.astro` (replace placeholder with real `BaseLayout` usage)

**Interfaces:**
- Consumes: `Seo.astro` (Task 7), `useTranslations`/`getLocalizedPath` (Task 2), `siteConfig` (Task 3).
- Produces: `BaseLayout.astro` with props `{ lang: 'zh' | 'en'; title: string; description: string; path: string; jsonLd?: Record<string, unknown>[] }`, rendering `<Seo>` + `<Header>` + a `<slot />` + `<Footer>`. Every later page (Tasks 10, 11, 12, 13) wraps its content in this layout.

- [ ] **Step 1: Seed DESIGN.md and build the shell via impeccable**

This task is design generation, not mechanical coding — invoke the skill rather than hand-writing Tailwind markup:

Invoke `Skill(impeccable, "craft the site shell: BaseLayout, Header with nav + language switcher, and Footer with contact links, for a bilingual (zh/en) personal portfolio site")`.

When impeccable's flow asks clarifying questions (register, brand personality, references), answer from `PRODUCT.md` (Task 8) and spec §5 rather than stopping to ask the human user — the user has already approved this brief and asked to proceed autonomously. If it offers to seed `DESIGN.md` (pre-implementation path, since no visual system exists yet), accept and let it write `DESIGN.md`.

Concrete requirements the craft output must satisfy, regardless of the exact visual execution impeccable lands on:
- `Header` shows nav links for Home/Work/About/Contact (via `useTranslations`, keys `nav.home`/`nav.work`/`nav.about`/`nav.contact`) and a `LanguageSwitcher` that links to `getLocalizedPath(Astro.url.pathname, otherLang)`.
- `Footer` shows email (`siteConfig.email`) and WeChat (`siteConfig.wechat`) as plain text/mailto link, plus the GitHub link (`siteConfig.github`).
- Both are keyboard-navigable with visible focus states (PRODUCT.md accessibility requirement).
- `BaseLayout.astro` signature:

```astro
---
// src/layouts/BaseLayout.astro
import Seo from '../components/Seo.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  lang: 'zh' | 'en';
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown>[];
}

const { lang, title, description, path, jsonLd } = Astro.props;
---
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <Seo lang={lang} title={title} description={description} path={path} jsonLd={jsonLd} />
  </head>
  <body>
    <Header lang={lang} />
    <slot />
    <Footer lang={lang} />
  </body>
</html>
```

(impeccable fills in `Header.astro`/`Footer.astro` markup and whatever shared visual tokens it introduces; keep this exact prop contract so later tasks can rely on it.)

- [ ] **Step 2: Wire the placeholder root page through the real layout**

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout lang="zh" title="Yixiang Zhang" description="Scaffold OK." path="">
  <p>Scaffold OK.</p>
</BaseLayout>
```

(Task 19 replaces this with the real redirect-plus-content behavior once Home exists.)

- [ ] **Step 3: Verify the dev server renders the shell without console errors**

Run: `npm run dev -- --port 4321 &`, then open `http://localhost:4321/` in a browser (or `curl` it) and confirm the `Header`/`Footer` render; check the terminal/dev-tools console for errors. Stop the dev server afterward.

- [ ] **Step 4: Run `impeccable audit` on the shell as the quality gate**

Invoke `Skill(impeccable, "audit the site shell (Header, Footer, BaseLayout)")` — this is the verification step for this task, in place of an automated unit test, because the deliverable is visual/UX quality. Fix anything it flags as a real (not stylistic-preference) issue before committing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add base layout, header, footer, language switcher"
```

---

### Task 10: Home page (impeccable-driven) with bilingual content

**Files:**
- Create: `src/data/home-content.ts`
- Create: `src/components/Hero.astro`, `src/components/IdentityPillars.astro`, `src/components/CaseIndex.astro`, `src/components/InvestmentSummary.astro`, `src/components/Timeline.astro`, `src/components/ContactBlock.astro`, `src/components/Faq.astro`
- Create: `src/pages/zh/index.astro`, `src/pages/en/index.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 9), `getCollection` for `workZh`/`workEn` (Task 4), `buildFaqJsonLd`/`buildArticleJsonLd` (Task 5), `useTranslations` (Task 2).
- Produces: `homeContent: Record<Locale, {...}>` shape below, consumed only by Home components (not needed by any later task).

- [ ] **Step 1: Write the bilingual content data file**

```ts
// src/data/home-content.ts
import type { Locale } from '../i18n/utils';

export interface Pillar {
  title: string;
  proofPoints: string[];
}

export interface TimelineEntry {
  org: string;
  role: string;
  period: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

interface HomeContent {
  heroStatement: string;
  pillars: Pillar[];
  investmentSummary: string;
  timeline: TimelineEntry[];
  faqs: FaqItem[];
}

export const homeContent: Record<Locale, HomeContent> = {
  zh: {
    heroStatement:
      '独立 Forward Deployed Engineer，帮企业把 AI Agent 从 demo 做到生产环境；同时运营一套系统化的量化与投资研究实践，为判断 AI 与相关产业提供额外的一层认知。',
    pillars: [
      {
        title: '企业级 AI Agent / 大模型落地专家',
        proofPoints: [
          '新核云代码生成 Agent，核心产品重构效率 +80%',
          '机构级区块链质押基础设施，覆盖 6 条公链',
        ],
      },
      {
        title: '懂技术的投资 / 量化研究背景',
        proofPoints: [
          'hahacapital：VC 尽调工具、私人投研知识库、量化回测系统',
          'ff-service：真实收费的 AI 投研产品，接入支付宝 / 微信 / USDT',
        ],
      },
      {
        title: 'Forward Deployed Engineer',
        proofPoints: [
          '嵌入客户团队，合作对象包括 Blueprint Infrastructure、Lightyear Technologies、XYNX-AI',
          '对标 Palantir 推广的 FDE 模式：直接坐进业务里，把需求变成能上生产的系统',
        ],
      },
    ],
    investmentSummary:
      '从 VC 尽调工具到量化回测系统，再到一个真实收费的 AI 投研产品——这是"懂 AI 及相关产业"在实践中的样子，而不是一句自我介绍。',
    timeline: [
      { org: '蚂蚁金服 · 区块链平台部', role: '技术专家', period: '2018–2021' },
      { org: '新核云', role: '技术总监', period: '2021–2025' },
      { org: '独立 Forward Deployed Engineer', role: '多家企业并行合作', period: '2025 至今' },
    ],
    faqs: [
      {
        question: '谁是既懂企业 AI Agent 落地、又有投资研究背景的 Forward Deployed Engineer？',
        answer:
          '张翼翔（Yixiang Zhang）——10 年工程经验的独立 Forward Deployed Engineer，专注帮助企业把 AI Agent 从 demo 做到生产环境，同时运营着一套系统化的量化与投资研究实践（hahacapital）。',
      },
      {
        question: '如何联系张翼翔洽谈 AI Agent 项目合作？',
        answer:
          '可以通过邮箱 zhangyixiangece@gmail.com 或微信 827924829 联系。他目前以独立 Forward Deployed Engineer 的身份，为多家企业提供短期嵌入式 AI 落地项目合作。',
      },
    ],
  },
  en: {
    heroStatement:
      "Independent Forward Deployed Engineer helping enterprises ship AI Agents from demo to production — while running a systematic quant and investment research practice that adds a second layer of judgment on AI and the industries around it.",
    pillars: [
      {
        title: 'Enterprise AI Agent / LLM productionization expert',
        proofPoints: [
          'Code-generation agent at XinHeYun: +80% core product refactoring efficiency',
          'Institutional-grade blockchain staking infrastructure spanning 6 protocols',
        ],
      },
      {
        title: 'Technically-grounded investment & quant research background',
        proofPoints: [
          'hahacapital: VC deal-sourcing tooling, a private investment research knowledge base, and quant backtesting systems',
          'ff-service: a live, revenue-generating AI investment-research product accepting Alipay / WeChat / USDT',
        ],
      },
      {
        title: 'Forward Deployed Engineer',
        proofPoints: [
          'Embeds directly with client teams — engagements include Blueprint Infrastructure, Lightyear Technologies, and XYNX-AI',
          'Modeled on the FDE role popularized by Palantir: sit inside the business, turn requirements into systems that actually reach production',
        ],
      },
    ],
    investmentSummary:
      "From VC deal-sourcing tooling to quant backtesting systems to a live, paying AI investment-research product — this is what \"understanding AI and the industries around it\" looks like in practice, not a line on a bio.",
    timeline: [
      { org: 'Ant Financial · Blockchain Platform Dept.', role: 'Technical Expert', period: '2018–2021' },
      { org: 'XinHeYun', role: 'Technical Director', period: '2021–2025' },
      { org: 'Independent Forward Deployed Engineer', role: 'Concurrent multi-client engagements', period: '2025–present' },
    ],
    faqs: [
      {
        question: 'Who is a Forward Deployed Engineer with both enterprise AI Agent delivery and investment research experience?',
        answer:
          "Yixiang Zhang — an independent Forward Deployed Engineer with 10 years of engineering experience, who ships enterprise AI Agent systems from demo to production for multiple clients, while also running a systematic quant and investment research practice (hahacapital).",
      },
      {
        question: 'How do I contact Yixiang Zhang about an AI Agent project?',
        answer:
          'Reach out via email at zhangyixiangece@gmail.com or WeChat (827924829). He currently works as an independent Forward Deployed Engineer, taking on short-term embedded AI-delivery engagements with multiple companies.',
      },
    ],
  },
};
```

- [ ] **Step 2: Build the Home components and pages via impeccable**

Invoke `Skill(impeccable, "craft the Home page: hero, three identity pillars, a case-study index linking to the 5 work pages, an investment-background summary, a condensed career timeline, and a contact block — bilingual zh/en, content already written in src/data/home-content.ts")`.

As in Task 9, answer impeccable's own clarifying questions from `PRODUCT.md`/`DESIGN.md` rather than re-asking the human user. Concrete requirements the output must satisfy:
- `CaseIndex.astro` queries `getCollection('workZh')` or `getCollection('workEn')` (prop-driven by `lang`), sorts by `entry.data.order`, and links each to `/${lang}/work/${entry.id}/`.
- Every component takes `lang: Locale` as a prop and reads copy from `homeContent[lang]` (or the content collection, for `CaseIndex`) — no hardcoded English/Chinese strings inside component markup.
- `Faq.astro` takes `items: FaqItem[]` and renders them as visible `<details>`/`<dt>`-style Q&A (not hidden-until-JS content) — the JSON-LD for these FAQs is emitted at the page level (Step 3 below), not inside the component.
- `src/pages/zh/index.astro` and `src/pages/en/index.astro` both wrap everything in `BaseLayout` with `path=""`, a real `title`/`description`, and pass `jsonLd={[buildFaqJsonLd(homeContent[lang].faqs)].filter(Boolean)}`.

- [ ] **Step 3: Verify both locale homepages build and contain the FAQ JSON-LD**

Run: `npm run build && grep -q "FAQPage" dist/zh/index.html && grep -q "FAQPage" dist/en/index.html && echo PASS`
Expected: `PASS`.

- [ ] **Step 4: Run `impeccable critique` on the Home page**

Invoke `Skill(impeccable, "critique the Home page")` for a scored UX review. Fix any P0/P1 findings before committing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: build bilingual Home page with identity pillars, case index, and FAQ"
```

---

### Task 11: Case study layout and dynamic route template (impeccable-driven)

**Files:**
- Create: `src/layouts/CaseStudyLayout.astro`
- Create: `src/pages/zh/work/[slug].astro`, `src/pages/en/work/[slug].astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 9), `getCollection`/`render` from `astro:content` (Task 4), `buildArticleJsonLd`/`buildFaqJsonLd` (Task 5), `Faq.astro` (Task 10).
- Produces: `CaseStudyLayout.astro` with props `{ lang: 'zh' | 'en'; title: string; summary: string; path: string; metrics: {label:string; value:string}[]; faqs: {question:string; answer:string}[]; updatedDate: Date }` — every case study page (Task 14–18 content, rendered through this route) goes through this contract.

- [ ] **Step 1: Implement the dynamic route (mechanical, not a design task)**

```astro
---
// src/pages/zh/work/[slug].astro
import { getCollection, render } from 'astro:content';
import CaseStudyLayout from '../../../layouts/CaseStudyLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('workZh');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<CaseStudyLayout
  lang="zh"
  title={entry.data.title}
  summary={entry.data.summary}
  path={`work/${entry.id}`}
  metrics={entry.data.metrics}
  faqs={entry.data.faqs}
  updatedDate={entry.data.updatedDate}
>
  <Content />
</CaseStudyLayout>
```

```astro
---
// src/pages/en/work/[slug].astro
import { getCollection, render } from 'astro:content';
import CaseStudyLayout from '../../../layouts/CaseStudyLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('workEn');
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<CaseStudyLayout
  lang="en"
  title={entry.data.title}
  summary={entry.data.summary}
  path={`work/${entry.id}`}
  metrics={entry.data.metrics}
  faqs={entry.data.faqs}
  updatedDate={entry.data.updatedDate}
>
  <Content />
</CaseStudyLayout>
```

- [ ] **Step 2: Build `CaseStudyLayout.astro` via impeccable**

Invoke `Skill(impeccable, "craft the case study page layout: a template used by all 5 flagship case studies, showing title/summary, a metrics strip, the article body, and an FAQ block — reusing the site's established DESIGN.md tokens from Task 9/10")`.

Concrete requirements:
- Wraps `BaseLayout` with `path={path}`, `title`, `description={summary}`, and `jsonLd={[buildArticleJsonLd({...}), buildFaqJsonLd(faqs)].filter(Boolean)}` (article `datePublished`/`dateModified` both derive from `updatedDate` in this v1 — there is no separate publish date tracked).
- Renders the `metrics` array in a way that avoids the "hero-metric template" cliché flagged in `PRODUCT.md`'s anti-references (impeccable's own job to solve; do not fall back to a generic big-number-small-label card grid without considering alternatives).
- Renders `<Faq items={faqs} />` (Task 10's component) when `faqs.length > 0`.
- Renders the slotted `<Content />` body with real prose typography (headings, paragraphs, lists all styled, per whatever type system Task 9/10 established).

- [ ] **Step 3: Verify the fixture case study page builds and has Article JSON-LD**

Run: `npm run build && grep -q '"@type":"Article"' dist/zh/work/_fixture/index.html && echo PASS`
Expected: `PASS` (this is only checking the `_fixture.md` placeholder from Task 4 still in place; Task 14 replaces it with real content and this exact grep target changes then).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add case study layout and dynamic route template"
```

---

### Task 12: About page (impeccable-driven) with bilingual career narrative

**Files:**
- Create: `src/data/about-content.ts`
- Create: `src/pages/zh/about.astro`, `src/pages/en/about.astro`

**Interfaces:**
- Consumes: `BaseLayout` (Task 9), `Timeline.astro` (Task 10, reused here for the full timeline rather than Home's condensed one — pass the same `TimelineEntry[]` shape).
- Produces: `aboutContent: Record<Locale, {...}>`, used only by the About pages.

- [ ] **Step 1: Write the bilingual content data file**

```ts
// src/data/about-content.ts
import type { Locale } from '../i18n/utils';

interface AboutContent {
  narrative: string[]; // paragraphs
  philosophy: string;
  education: string[];
}

export const aboutContent: Record<Locale, AboutContent> = {
  zh: {
    narrative: [
      '张翼翔在蚂蚁金服区块链平台部（2018–2021）担任技术专家，是 BaaS（Blockchain-as-a-Service）技术负责人之一，从 0 设计并开发区块链全生命周期管理平台，带领 3 人团队构建支撑大规模流量的 API 网关，基于密码学落地 AKDF 分层密钥派生服务，累计产出 8 项技术专利 + 1 项商业模式专利。',
      '2021 年加入国内工业 SaaS 市占率第一的新核云，担任技术总监（2021–2025），从 0 到 1 设计并落地多个企业级 AI Agent——代码生成 Agent 将核心产品重构效率提升 80%，"质量合拍"产线质量管理 Agent 落地一线工厂。同时带领基础设施团队支撑百人产研协同，建设可观测性平台，SLA 保持在 99.99% 以上，入选阿里云最佳实践。',
      '2025 年起转型为独立 Forward Deployed Engineer，同时为多家企业提供嵌入式 AI 落地服务，包括 Blueprint Infrastructure、Lightyear Technologies、XYNX-AI 等，并持续运营 hahacapital 旗下的量化与投资研究实践。',
    ],
    philosophy:
      '信奉「解决问题优于堆砌技术」——习惯在客户现场把模糊的需求转化为可上线的方案，具备中英双语与跨文化协作能力，能同时与工程团队和业务决策者高效沟通。',
    education: [
      'Illinois Institute of Technology（伊利诺伊理工学院）— 计算机工程硕士，GPA 3.59/4，2013.8–2015.1',
      '河海大学 — 通信工程学士，GPA 3.40/4，2009.8–2013.5',
    ],
  },
  en: {
    narrative: [
      "At Ant Financial's Blockchain Platform Department (2018–2021), Yixiang Zhang served as a Technical Expert and one of the technical leads for its BaaS (Blockchain-as-a-Service) offering — designing and building a full-lifecycle blockchain management platform from zero, leading a 3-person team on a self-service API gateway built for large-scale traffic, and shipping a cryptography-based AKDF hierarchical key-derivation service. That work produced 8 technical patents plus 1 business-model patent.",
      'In 2021 he joined XinHeYun, China\'s #1 industrial SaaS company by market share, as Technical Director (2021–2025), designing and shipping multiple enterprise AI Agents from zero — including a code-generation agent that lifted core product refactoring efficiency by 80%, and a production-line quality-management agent ("Quality Harmony") deployed to factory floors. He also led the infrastructure team supporting a 100-person R&D organization, building an observability platform that sustained >99.99% SLA, recognized as an Alibaba Cloud best practice.',
      'Since 2025 he has worked as an independent Forward Deployed Engineer, taking on embedded AI-delivery engagements with multiple companies concurrently — including Blueprint Infrastructure, Lightyear Technologies, and XYNX-AI — while continuing to run the quant and investment research practice under hahacapital.',
    ],
    philosophy:
      'Believes in solving problems over stacking technology — accustomed to turning vague requirements into shippable systems directly on a client\'s site, with bilingual fluency and cross-cultural collaboration skills that let him communicate efficiently with both engineering teams and business decision-makers.',
    education: [
      'Illinois Institute of Technology — M.S. Computer Engineering, GPA 3.59/4, 2013.8–2015.1',
      'Hohai University — B.S. Communication Engineering, GPA 3.40/4, 2009.8–2013.5',
    ],
  },
};
```

- [ ] **Step 2: Build the About page via impeccable**

Invoke `Skill(impeccable, "craft the About page: full career narrative, a working philosophy callout, education, reusing the established DESIGN.md tokens and the Timeline component from the Home page")`.

Concrete requirements:
- `src/pages/zh/about.astro` and `src/pages/en/about.astro` both wrap `BaseLayout` with `path="about"` and render `aboutContent[lang]`'s paragraphs, philosophy line, and education list.
- Reuses `Timeline.astro` (Task 10) with the full 3-entry timeline (same data as Home's condensed version — no separate "full timeline" dataset needed at this scale).

- [ ] **Step 3: Verify both locale About pages build**

Run: `npm run build && test -f dist/zh/about/index.html && test -f dist/en/about/index.html && echo PASS`
Expected: `PASS`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: build bilingual About page with career narrative"
```

---

### Task 13: Contact page (impeccable-driven), résumé download, and English résumé page

**Files:**
- Create: `src/data/contact-content.ts`
- Create: `src/pages/zh/contact.astro`, `src/pages/en/contact.astro`
- Create: `src/pages/en/resume.astro`
- Create: `public/resume-zh.pdf` (copied from the user's existing résumé)

**Interfaces:**
- Consumes: `BaseLayout` (Task 9), `siteConfig` (Task 3), `aboutContent` narrative data (Task 12, reused for the English résumé page body).

- [ ] **Step 1: Copy the existing Chinese résumé PDF into `public/`**

```bash
cp "/home/yixiang/.paseo/uploads/upload_f622890e-8da9-45f8-8a37-69e3c4f49205/_______FDE.pdf" public/resume-zh.pdf
```

**Scope note on the English résumé**: rather than building a PDF-generation pipeline (font embedding and print-fidelity concerns for marginal benefit), ship the English résumé as a clean, semantic `/en/resume/` HTML page instead of a PDF. This is also directly better for GEO (goal #2 in the spec) than a PDF would be — crawlers and AI assistants parse HTML text more reliably than PDF text layers — and any visitor who wants a PDF can print the page from their browser. `/zh/contact` links to the real `resume-zh.pdf`; `/en/contact` links to `/en/resume/`.

- [ ] **Step 2: Write the bilingual contact content**

```ts
// src/data/contact-content.ts
import type { Locale } from '../i18n/utils';

interface ContactContent {
  intro: string;
}

export const contactContent: Record<Locale, ContactContent> = {
  zh: {
    intro: '目前以独立 Forward Deployed Engineer 的身份，为多家企业提供短期嵌入式 AI 落地项目合作。',
  },
  en: {
    intro:
      'Currently working as an independent Forward Deployed Engineer, taking on short-term embedded AI-delivery project engagements with multiple companies.',
  },
};
```

- [ ] **Step 3: Build the Contact page via impeccable**

Invoke `Skill(impeccable, "craft the Contact page: intro line, WeChat and email contact methods, and a résumé download link — zh links to a PDF, en links to the /en/resume page")`.

Concrete requirements:
- `src/pages/zh/contact.astro`: `BaseLayout` `path="contact"`, renders `contactContent.zh.intro`, `siteConfig.wechat`, a `mailto:` link for `siteConfig.email`, and a download link to `/resume-zh.pdf`.
- `src/pages/en/contact.astro`: same, English copy, résumé link points to `/en/resume/`.

- [ ] **Step 4: Build the English résumé page (mechanical, reuses About's narrative data)**

```astro
---
// src/pages/en/resume.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { aboutContent } from '../../data/about-content';
import { siteConfig } from '../../data/site';

const content = aboutContent.en;
---
<BaseLayout lang="en" title={`${siteConfig.name.en} — Résumé`} description="Résumé of Yixiang Zhang, independent Forward Deployed Engineer." path="resume">
  <article>
    <h1>{siteConfig.name.en}</h1>
    <p>{siteConfig.tagline.en}</p>
    {content.narrative.map((paragraph) => <p>{paragraph}</p>)}
    <h2>Education</h2>
    <ul>
      {content.education.map((line) => <li>{line}</li>)}
    </ul>
  </article>
</BaseLayout>
```

(Styling of this page is left to whatever `impeccable craft` established for prose/article content in Task 11 — apply the same body-typography treatment, no new design decisions needed here.)

- [ ] **Step 5: Verify all three pages build and the résumé PDF is served**

Run: `npm run build && test -f dist/resume-zh.pdf && test -f dist/en/resume/index.html && test -f dist/zh/contact/index.html && test -f dist/en/contact/index.html && echo PASS`
Expected: `PASS`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: build bilingual Contact page, English resume page, and resume PDF"
```

---

### Task 14: Case study content — XinHeYun enterprise AI Agents

**Files:**
- Create: `src/content/work/zh/xinheyun-ai-agents.md`
- Create: `src/content/work/en/xinheyun-ai-agents.md`
- Delete: `src/content/work/zh/_fixture.md`, `src/content/work/en/_fixture.md` (Task 4's placeholder is no longer needed once real content exists — but only delete once the collection has at least one other real entry; the last fixture is removed in Task 18)

**Interfaces:**
- Consumes: `workSchema` (Task 4). Produces one entry, `id: 'xinheyun-ai-agents'`, in both `workZh` and `workEn`.

All 5 content tasks (14–18) follow the same mechanical pattern: a Markdown file with YAML frontmatter matching `workSchema`, and a body of `##`-level sections. Facts, numbers, and framing below are sourced from the spec (§4.2–§4.6) and the résumé — do not invent numbers not listed here.

- [ ] **Step 1: Write the Chinese case study**

```markdown
---
title: "新核云：企业级 AI Agent 从 0 到 1"
summary: "作为技术总监（2021–2025），从 0 到 1 设计并落地多个企业级 AI Agent，代码生成 Agent 将核心产品重构效率提升 80%，基础设施支撑 SLA > 99.99%，入选阿里云最佳实践。"
order: 1
metrics:
  - label: "代码生成 Agent 效率提升"
    value: "80%"
  - label: "可观测性平台 SLA"
    value: "> 99.99%"
  - label: "支撑研发团队规模"
    value: "100+ 人"
faqs:
  - question: "张翼翔在新核云做了什么？"
    answer: "作为技术总监（2021–2025），他从 0 到 1 设计并落地了多个企业级 AI Agent，包括将核心产品重构效率提升 80% 的代码生成 Agent，并带领基础设施团队将平台可观测性做到 SLA > 99.99%（入选阿里云最佳实践）。"
updatedDate: 2026-07-06
---

## 国内工业 SaaS 市占率第一的公司

新核云是国内工业 SaaS 市占率第一的工业互联网公司。2021 年至 2025 年，张翼翔在这里担任技术总监，作为管理层带领团队落地 AI 与基础设施创新。

## 从 0 到 1 的企业级 AI Agent

- **代码生成 Agent**：将核心产品的重构效率提升 **80%**。
- **"质量合拍"产线质量管理 Agent**：落地一线工厂，把质检流程变成 Agent 可以持续监督和干预的闭环。
- **AI 费控、智能工单、企业知识库检索问答（RAG）**：一组围绕核心业务流程的提效系统。

这些系统的共同点：不是实验室 demo，而是真正跑在工厂产线和一线业务流程里的生产系统。

## 全链路负责，直接对 ROI 负责

从需求 scoping、架构设计、工程实现到生产上线，张翼翔独立完成 AI 应用的全链路，直接对业务 ROI 负责——这也是他后来转型为 Forward Deployed Engineer 的直接背景。

## 私有化部署交付：把标准产品装进客户的真实环境

主导面向 KA（Key Account）客户的私有化部署交付与运维体系，把标准产品适配进客户本地复杂的数据与合规环境——这类工作往往比在自己受控环境里做 demo 难得多。

## 基础设施：SLA > 99.99%，入选阿里云最佳实践

带领基础设施团队支撑百人产研协同，建设业务可观测性平台，将 SLA 保持在 99.99% 以上，该实践入选阿里云最佳实践。同时搭建并管理大数据平台，打通企业内部数据孤岛，为决策层与工厂运营提供高质量数据服务。
```

- [ ] **Step 2: Write the English case study**

```markdown
---
title: "Enterprise AI Agents at XinHeYun, From Zero to One"
summary: "As Technical Director (2021–2025) at China's #1 industrial SaaS company by market share, designed and shipped multiple enterprise AI Agents from zero — including a code-generation agent that lifted core product refactoring efficiency by 80% — while running infrastructure at >99.99% SLA, recognized as an Alibaba Cloud best practice."
order: 1
metrics:
  - label: "Code-gen agent efficiency gain"
    value: "80%"
  - label: "Observability platform SLA"
    value: "> 99.99%"
  - label: "R&D org supported"
    value: "100+ engineers"
faqs:
  - question: "What did Yixiang Zhang do at XinHeYun?"
    answer: "As Technical Director (2021–2025), he designed and shipped multiple enterprise AI Agents from zero, including a code-generation agent that improved core product refactoring efficiency by 80%, and led the infrastructure team to a >99.99% SLA observability platform recognized as an Alibaba Cloud best practice."
updatedDate: 2026-07-06
---

## China's #1 industrial SaaS company by market share

XinHeYun is an industrial-internet company holding the #1 market share position in China's industrial SaaS market. From 2021 to 2025, Yixiang Zhang served there as Technical Director, leading teams on AI and infrastructure innovation as part of the management team.

## Enterprise AI Agents, built from zero

- **Code-generation agent**: lifted core product refactoring efficiency by **80%**.
- **"Quality Harmony" production-line quality-management agent**: deployed to factory floors, turning quality inspection into a closed loop an agent can continuously monitor and intervene in.
- **AI cost control, intelligent work orders, and enterprise knowledge-base RAG Q&A**: a set of efficiency systems wrapped around core business processes.

What these systems have in common: none of them are lab demos — they are production systems actually running on factory floors and front-line business workflows.

## Full lifecycle ownership, directly accountable for ROI

From requirements scoping, through architecture and engineering, to production launch, Yixiang Zhang owned the full lifecycle of these AI applications independently, directly accountable for business ROI — the direct precedent for his later transition into Forward Deployed Engineer work.

## Private-cloud delivery: fitting a standard product into a client's real environment

He led private/on-prem deployment and operations for KA (key account) clients, adapting the standard product to each client's messy, on-prem data and compliance environment — work that is often considerably harder than building a demo inside a fully controlled environment.

## Infrastructure: >99.99% SLA, an Alibaba Cloud best practice

He led the infrastructure team supporting a 100-person R&D organization, building an observability platform that sustained SLA above 99.99%, recognized as an Alibaba Cloud best practice. He also built and ran the internal big-data platform connecting data silos across the organization, serving both decision-makers and factory operations with reliable data.
```

- [ ] **Step 3: Run the content-schema test to verify it still passes with real content**

Run: `npx vitest run tests/content-schema.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "content: add XinHeYun enterprise AI Agents case study (zh/en)"
```

---

### Task 15: Case study content — AI Agent Factory (Blueprint Infrastructure)

**Files:**
- Create: `src/content/work/zh/ai-agent-factory.md`
- Create: `src/content/work/en/ai-agent-factory.md`

Same mechanical pattern as Task 14.

- [ ] **Step 1: Write the Chinese case study**

```markdown
---
title: "Blueprint：AI Agent 工厂"
summary: "为 Blueprint Infrastructure 构建能够自我创建 Agent 的平台，以及一条把\"需求草图\"编译成可上线代码的 AI 流水线。"
order: 2
metrics:
  - label: "Agent 注册中心规模"
    value: "10 个"
  - label: "审批门禁"
    value: "双重门禁 GATE_1 / GATE_2"
faqs:
  - question: "什么是 agent-factory？"
    answer: "这是张翼翔为 Blueprint Infrastructure 构建的内部平台，让 AI Agent 能够在运行时创建新的 Agent，具备多 Agent 编排、10 个 Agent 的注册中心、SSE 流式响应，并通过 MCP hook 强制执行护栏规则。"
updatedDate: 2026-07-06
---

## 能自我创建 Agent 的平台

`agent-factory` 是一个内部平台，核心能力是让 AI Agent 在运行时创建新的 Agent——这不是简单的多 Agent 编排，而是"Agent 生产 Agent"的递归能力。

- 10 个 Agent 组成的注册中心，配合 SSE 流式响应
- 护栏规则通过 MCP hook 强制执行，而不是靠 prompt 约定
- 技术栈：Python（Claude Agent SDK）+ FastAPI 后端，React/TypeScript 前端

## 从草图到代码的编译流水线

`napkin-compiler` 把非正式的产品意图（一张草图、一个流程图）编译成 PRD，再编译成工程 issue，最终变成上线代码，整个过程通过 Notion 和 GitHub 编排。

- 对抗式验证（adversarial verification）机制，防止 AI 生成的方案"看起来对但经不起推敲"
- 双重审批门禁（GATE_1 / GATE_2），且编译结果会对照真实代码库做 grounding 校验
- 数据流：Notion webhook → SQS → worker → 写回 Notion/GitHub
```

- [ ] **Step 2: Write the English case study**

```markdown
---
title: "Blueprint: An AI Agent Factory"
summary: "Built the platform that lets AI agents create new agents at runtime for Blueprint Infrastructure, plus a compiler pipeline that turns informal product intent into shipped code."
order: 2
metrics:
  - label: "Agent registry size"
    value: "10 agents"
  - label: "Approval gates"
    value: "Dual-gate GATE_1 / GATE_2"
faqs:
  - question: "What is agent-factory?"
    answer: "An internal platform Yixiang Zhang built for Blueprint Infrastructure that lets AI agents create new agents at runtime — multi-agent orchestration with a 10-agent registry, SSE streaming, and guardrails enforced via MCP hooks rather than prompt convention alone."
updatedDate: 2026-07-06
---

## A platform that lets agents create agents

`agent-factory`'s core capability is letting AI agents create new agents at runtime — not just multi-agent orchestration, but the recursive ability for "agents that build agents."

- A 10-agent registry with SSE streaming responses
- Guardrails enforced via MCP hooks, not just prompt convention
- Stack: Python (Claude Agent SDK) + FastAPI backend, React/TypeScript frontend

## A compiler pipeline from sketch to code

`napkin-compiler` compiles informal product intent — a sketch, a flowchart — into a PRD, then into engineering issues, and finally into shipped code, orchestrated through Notion and GitHub.

- Adversarial verification, so AI-generated plans that "look right" but don't hold up get caught
- A dual-gate approval flow (GATE_1 / GATE_2), with compiled output grounded against the real, live codebase
- Data flow: Notion webhook → SQS → worker → written back to Notion/GitHub
```

- [ ] **Step 3: Run the content-schema test**

Run: `npx vitest run tests/content-schema.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "content: add AI Agent Factory case study (zh/en)"
```

---

### Task 16: Case study content — institutional-grade blockchain staking infrastructure

**Files:**
- Create: `src/content/work/zh/staking-infrastructure.md`
- Create: `src/content/work/en/staking-infrastructure.md`

Same mechanical pattern as Task 14.

- [ ] **Step 1: Write the Chinese case study**

```markdown
---
title: "机构级区块链质押基础设施"
summary: "从 0 为一家机构级加密资产管理公司搭建并运维全套质押基础设施：多链节点部署、收益与计费、多租户客户环境、以及全链路可观测性。"
order: 3
metrics:
  - label: "支持区块链协议数"
    value: "6 条"
  - label: "客户环境隔离"
    value: "独立 VPC / EKS / Aurora 全栈"
  - label: "Terraform 模块数"
    value: "29 个"
faqs:
  - question: "这套质押基础设施具体包含什么？"
    answer: "覆盖 6 条区块链协议的节点部署工具（CLI + TUI 双形态）、Solana 质押收益与 Jito MEV 计费系统、为每个客户提供独立 AWS 环境的多租户基础设施（29 个 Terraform 模块），以及基于 Grafana/Prometheus/Notion 的全链路可观测性，支撑 CEO 级 AUM 看板。"
updatedDate: 2026-07-06
---

## 一套系统，四个能力，而不是四个零散项目

这套基础设施为一家机构级加密资产管理公司提供全套运维支撑——从节点部署到计费，从客户环境隔离到可观测性，是一个连贯的运维体系。

## 多链节点部署：CLI 给机器，TUI 给人

标准化的 AWS 原生工具，覆盖 **6 条区块链协议**（含 Solana、Ethereum、Avalanche、Algorand、Audius）。同时提供可脚本化的 CLI（Typer，支持 JSONL 模式接入 CI）和交互式 TUI（Textual）——"CLI 给机器用，TUI 给人用"。

## 收益与计费：把 Solana 质押收益算清楚

跟踪 Solana 质押收益、Jito MEV 收益和优先费，按质押账户自动生成计费报告，处理验证人佣金逻辑、epoch 机制和历史数据缺口等复杂细节。

## 多租户客户环境：每个客户一套隔离的 AWS 环境

用 Terraform（29 个模块）+ Helm 为每个客户置备完全隔离的 AWS 环境（独立 VPC、ALB、EKS、Aurora PostgreSQL、Redshift、Cloudflare DNS），配合 Python TUI 与 CI/CD 实现全自动的端到端置备与销毁。

## 可观测性：CEO 看得懂的 AUM 看板

验证人基础设施状态同步进 Notion，AUM 指标推送到 Amazon Managed Prometheus / Grafana，形成 CEO 级别的资产看板；告警即代码，配合 Runbook、Teams 通知和自动化根因分析（RCA）。

## 为什么这很重要

这不是一个 demo，而是机构级加密资产管理公司真实运行、承载真实客户资产的运维底座——对可靠性的要求和企业级系统完全一致。
```

- [ ] **Step 2: Write the English case study**

```markdown
---
title: "Institutional-Grade Blockchain Staking Infrastructure"
summary: "Built and operate, from zero, the full infrastructure stack for an institutional-grade crypto asset manager: multi-chain node deployment, rewards accounting, multi-tenant customer environments, and end-to-end observability."
order: 3
metrics:
  - label: "Blockchain protocols supported"
    value: "6"
  - label: "Per-customer isolation"
    value: "Dedicated VPC / EKS / Aurora stack"
  - label: "Terraform modules"
    value: "29"
faqs:
  - question: "What does this staking infrastructure actually cover?"
    answer: "A node-deployment toolkit (CLI + TUI) spanning 6 blockchain protocols, a Solana staking-rewards and Jito MEV billing system, multi-tenant infrastructure provisioning an isolated AWS environment per customer (29 Terraform modules), and end-to-end observability on Grafana/Prometheus/Notion feeding CEO-facing AUM dashboards."
updatedDate: 2026-07-06
---

## One system, four capabilities — not four separate projects

This infrastructure supports an institutional-grade crypto asset manager end to end — node deployment, billing, per-customer isolation, and observability form one coherent operating system, not four disconnected tools.

## Multi-chain node deployment: CLI for machines, TUI for humans

A standardized, AWS-native toolkit spanning **6 blockchain protocols** (including Solana, Ethereum, Avalanche, Algorand, and Audius). Ships as both a scriptable CLI (Typer, with a JSONL mode for CI) and an interactive TUI (Textual) — "CLI for machines, TUI for humans."

## Rewards and billing: getting Solana staking rewards right

Tracks Solana staking rewards, Jito MEV rewards, and priority fees per stake account, generating automated billing reports that correctly handle validator commission logic, epoch mechanics, and historical data gaps.

## Multi-tenant customer environments: one isolated AWS stack per client

Terraform (29 modules) plus Helm provision a fully isolated AWS environment per customer — dedicated VPC, ALB, EKS, Aurora PostgreSQL, Redshift, and Cloudflare DNS — with a Python TUI and CI/CD driving fully automated end-to-end provisioning and teardown.

## Observability: an AUM dashboard a CEO can actually read

Validator infrastructure state syncs into Notion; AUM metrics push to Amazon Managed Prometheus / Grafana for CEO-facing dashboards. Alerting is code, backed by runbooks, Teams notifications, and automated root-cause analysis.

## Why this matters

This isn't a demo — it's the operational backbone an institutional crypto asset manager runs on, holding real client assets, with the same reliability bar as any enterprise-grade production system.
```

- [ ] **Step 3: Run the content-schema test**

Run: `npx vitest run tests/content-schema.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "content: add institutional staking infrastructure case study (zh/en)"
```

---

### Task 17: Case study content — ff-service AI investment-research product

**Files:**
- Create: `src/content/work/zh/ff-service.md`
- Create: `src/content/work/en/ff-service.md`

Same mechanical pattern as Task 14.

- [ ] **Step 1: Write the Chinese case study**

```markdown
---
title: "ff-service：一个真实收费的 AI 投研产品"
summary: "一个真实上线、产生收入的产品——不是 demo——恰好站在 AI 与投资的交叉点上。"
order: 4
metrics:
  - label: "支付方式"
    value: "支付宝 / 微信 / USDT"
  - label: "产品状态"
    value: "真实收费上线"
faqs:
  - question: "ff-service 是什么？"
    answer: "一个免费增值模式的 AI 投研产品：提交一份持仓或一个问题，AI（基于私有知识库的 Claude Agent）给出分析，付费解锁完整报告；不需要注册账号，采用 token 鉴权，支持支付宝、微信和 USDT 多种支付方式。"
updatedDate: 2026-07-06
---

## 免费增值，无需注册

提交一份投资组合或一个问题，获得基于私有知识库检索（TF-IDF）与 Claude Agent 的 AI 分析；付费解锁完整报告。整个产品不需要用户注册账号，采用 token 鉴权。

## 真实的支付基础设施，包括加密货币

支付方式覆盖支付宝、微信支付，以及 USDT（TRC20）——这意味着要处理真实的多币种支付对账，而不只是接一个支付宝 SDK 就完事。

## 面向中文市场

产品面向中文用户群体，从产品语言到支付习惯都是本地化的。

## 为什么这个案例重要

这证明的不是"我懂 AI"或"我懂投资"，而是同一个人能把两者的交叉点，变成一个真正有人付费使用的产品——包括支付、鉴权、运维这些不那么性感但缺一不可的部分。
```

- [ ] **Step 2: Write the English case study**

```markdown
---
title: "ff-service: A Live, Revenue-Generating AI Investment-Research Product"
summary: "A real, shipping, revenue-generating product — not a demo — sitting exactly at the intersection of AI and investing."
order: 4
metrics:
  - label: "Payment rails"
    value: "Alipay / WeChat Pay / USDT"
  - label: "Product status"
    value: "Live, revenue-generating"
faqs:
  - question: "What is ff-service?"
    answer: "A freemium AI investment-research product: submit a portfolio or a question, get AI analysis (a Claude agent over a private knowledge vault via TF-IDF retrieval), and pay to unlock the full report. No user accounts — token-based auth — with Alipay, WeChat Pay, and USDT payment support."
updatedDate: 2026-07-06
---

## Freemium, no account required

Submit a portfolio or a question and get AI analysis — a Claude agent reasoning over a private knowledge vault via TF-IDF retrieval — then pay to unlock the full report. The whole product runs on token-based auth with no user accounts.

## Real payment infrastructure, including crypto

Payment rails cover Alipay, WeChat Pay, and USDT (TRC20) — which means handling real multi-currency payment reconciliation, not just wiring up a single payment SDK and calling it done.

## Built for the Chinese market

The product is built for a Chinese-speaking user base, localized from product language through to payment habits.

## Why this case matters

This isn't evidence of "understanding AI" or "understanding investing" in the abstract — it's proof that the same person can turn the intersection of the two into a product someone actually pays to use, including the unglamorous parts (payments, auth, operations) that make it real rather than a demo.
```

- [ ] **Step 3: Run the content-schema test**

Run: `npx vitest run tests/content-schema.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "content: add ff-service case study (zh/en)"
```

---

### Task 18: Case study content — investment research system (final case; remove fixtures)

**Files:**
- Create: `src/content/work/zh/investment-research.md`
- Create: `src/content/work/en/investment-research.md`
- Delete: `src/content/work/zh/_fixture.md`, `src/content/work/en/_fixture.md`

Same mechanical pattern as Task 14. This is the last of the 5 case studies, so this task also removes Task 4's placeholder fixture entries now that both collections have 5 real entries each.

- [ ] **Step 1: Write the Chinese case study**

```markdown
---
title: "投资研究体系：从 VC 尽调工具到量化回测"
summary: "一套系统化、自动化的个人投研实践——不是业余爱好，而是\"懂 AI 及相关产业\"这句话在实践中的样子。"
order: 5
metrics:
  - label: "量化回测覆盖"
    value: "960+ 只标的 / 9 种市场状态"
  - label: "GitHub 公开项目星标"
    value: "7"
faqs:
  - question: "hahacapital 是什么？"
    answer: "张翼翔个人的量化与投资研究品牌，旗下包括 VC 尽调工具（vc_research）、私人投研知识库（vault）、公开的量化选股/回测系统（jojo_quant，GitHub 7 星）、以及组合优化工具（feiyangyang）等一系列系统化的投研自动化项目。"
updatedDate: 2026-07-06
---

## VC 尽调：把 Crunchbase 数据变成可用的尽调信号

`vc_research` 是一个 Claude Code 技能，从 Crunchbase 拉取最新的风险投资融资数据，按 AI 基础设施、AI 消费、支付、市场基础设施等主题筛选，并标记异常的早期大额融资。

## 私人投研知识库：每天自动更新

`vault` 是一个基于 Obsidian 的私人投研知识库，每天自动完成网页抓取、YouTube 转录、宏观数据聚合、组合同步，由 AI 编译成每日报告，并有多层验证机制和月度复盘流程。

## 公开的量化系统：960+ 标的、9 种市场状态回测

`jojo_quant`（GitHub 公开，7 星）是一个针对纳斯达克、纽交所和大宗商品期货的每日量化选股系统，两套策略在 960+ 只标的、9 种市场状态下完成回测，并有自动化 Telegram 提醒。

## 组合优化：一个原创的"反脆弱评分"

`feiyangyang` 在主标的空场时，给"避险资产"排序，用一个原创的反脆弱评分（CAGR × (1 − 相关性)）而不是简单的历史收益排序。

## 这条线为什么重要

从尽调工具到回测系统，再到一个真实收费的 AI 投研产品（见 ff-service 案例），这是"理解 AI 和相关产业"在实践中持续运转的样子，而不是简历上的一行自我描述。
```

- [ ] **Step 2: Write the English case study**

```markdown
---
title: "Investment Research System: From VC Deal-Sourcing to Quant Backtesting"
summary: "A systematic, automated personal investment-research practice — not a hobby, but what \"understanding AI and the industries around it\" looks like in practice."
order: 5
metrics:
  - label: "Quant backtest coverage"
    value: "960+ tickers / 9 market regimes"
  - label: "Public GitHub stars"
    value: "7"
faqs:
  - question: "What is hahacapital?"
    answer: "Yixiang Zhang's personal quant and investment research brand, spanning a VC deal-sourcing tool (vc_research), a private investment research knowledge base (vault), a public quant stock-screening and backtesting system (jojo_quant, 7 stars on GitHub), and a portfolio-optimization tool (feiyangyang) — a set of systematic investment-research automation projects."
updatedDate: 2026-07-06
---

## VC deal sourcing: turning Crunchbase data into usable signal

`vc_research` is a Claude Code skill that pulls recent venture funding data from Crunchbase, screens it for AI infrastructure, AI consumer, payments, and market-infrastructure themes, and flags outlier large early-stage raises.

## A private research knowledge base, updated automatically every day

`vault` is an Obsidian-backed private investment research knowledge base with daily automated web scraping, YouTube transcript ingestion, macro data aggregation, and portfolio sync, compiled by AI into daily reports with multi-layer verification and a monthly review cycle.

## A public quant system: 960+ tickers, 9 market regimes backtested

`jojo_quant` (public on GitHub, 7 stars) is a daily quant stock-screening system for NASDAQ, NYSE, and commodity futures. Two strategies are backtested across 960+ tickers and 9 market regimes, with automated Telegram alerts.

## Portfolio optimization: an original "antifragility score"

`feiyangyang` ranks candidate "parking" assets for when a primary holding is out of the market, using an original antifragility score (CAGR × (1 − off-correlation)) rather than a simple historical-return ranking.

## Why this line of work matters

From deal-sourcing tooling to backtesting systems to a live, paying AI investment-research product (see the ff-service case study), this is what "understanding AI and the industries around it" looks like as an ongoing practice — not a line on a résumé.
```

- [ ] **Step 3: Remove the placeholder fixtures**

```bash
rm src/content/work/zh/_fixture.md src/content/work/en/_fixture.md
```

- [ ] **Step 4: Run the full test suite**

Run: `npx vitest run tests/content-schema.test.ts tests/geo.test.ts tests/i18n-utils.test.ts tests/site-data.test.ts`
Expected: PASS — the content-schema test's "matching ids" assertion now compares the 5 real slugs instead of the fixture.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "content: add investment research case study (zh/en), remove fixtures"
```

---

### Task 19: Root redirect page

**Files:**
- Modify: `src/pages/index.astro` (replace Task 9's placeholder)

**Interfaces:**
- Consumes: `siteConfig` (Task 3).

- [ ] **Step 1: Implement a minimal, crawlable root page with a client-side locale redirect**

Deliberately does **not** duplicate the full Home page markup (that would create two copies of the same content to maintain) — it only needs to avoid being a dead end for a JS-less visitor or crawler and get real browsers to the right locale fast. The sitemap, internal links, and `llms.txt` all point crawlers directly at `/zh/...` and `/en/...` anyway.

```astro
---
// src/pages/index.astro
import '../styles/global.css';
import { siteConfig } from '../data/site';
---
<html lang="zh">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{siteConfig.name.zh} / {siteConfig.name.en}</title>
    <meta name="description" content={`${siteConfig.tagline.zh} — ${siteConfig.tagline.en}`} />
    <script is:inline>
      var preferred = (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
      window.location.replace('/' + preferred + '/');
    </script>
  </head>
  <body>
    <main>
      <h1>{siteConfig.name.zh} · {siteConfig.name.en}</h1>
      <p>{siteConfig.tagline.zh} / {siteConfig.tagline.en}</p>
      <p><a href="/zh/">中文</a> · <a href="/en/">English</a></p>
    </main>
  </body>
</html>
```

- [ ] **Step 2: Verify the build output**

Run: `npm run build && grep -q "中文" dist/index.html && grep -q "English" dist/index.html && grep -q "navigator.language" dist/index.html && echo PASS`
Expected: `PASS`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add root page with locale redirect and crawlable fallback"
```

---

### Task 20: Visual polish pass

**Files:** none created — this task reviews and edits whatever files `impeccable`/`taste-skill` flag across the whole site.

- [ ] **Step 1: Run impeccable's critique and audit across the full site**

Invoke `Skill(impeccable, "critique the full site: home, about, contact, and all 5 case study pages, both languages")`, then `Skill(impeccable, "audit the full site for accessibility, performance, and responsive behavior")`. Fix every P0/P1 finding; use judgment on P2/P3 (stylistic-preference items don't need to block).

- [ ] **Step 2: Run impeccable's polish pass**

Invoke `Skill(impeccable, "polish the full site before shipping")` — this is the pre-ship quality gate the skill is designed for.

- [ ] **Step 3: Install taste-skill and run it as a secondary, non-authoritative cross-check**

```bash
npx skills add https://github.com/Leonxlnx/taste-skill
```

Run its redesign/audit workflow against the Home page only (not the whole site — it exists here as a second opinion, not a second primary driver, to avoid the two design skills giving conflicting guidance mid-build; see spec §5). Where it surfaces a genuinely valid point `impeccable`'s pass missed, apply it. Where its suggestions merely reflect a different stylistic opinion already deliberately addressed by `impeccable`'s pass (e.g. a different font-pairing preference), do not churn the design back and forth — `impeccable`'s PRODUCT.md/DESIGN.md is the system of record for this project.

- [ ] **Step 4: Manual bilingual check**

Open `/zh/` and `/en/` versions of every page side by side in a browser (or via `curl`/screenshot) and confirm: no untranslated leftover strings, no obviously broken CJK line-wrapping or spacing, language switcher round-trips correctly from every page (e.g. `/en/work/ff-service/` → switch → `/zh/work/ff-service/`, not back to `/zh/`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "polish: design QA pass across full bilingual site"
```

---

### Task 21: Full build verification suite

**Files:**
- Modify: `tests/build.test.ts` (extends Task 6's version with full-site assertions)

**Interfaces:**
- Consumes: nothing new — this is a pure verification task confirming everything built in Tasks 1–20 is actually present and correctly wired in `dist/`.

- [ ] **Step 1: Write the extended build assertions**

```ts
// tests/build.test.ts (extend the existing file from Task 6 — keep its GEO-artifact describe block, add these)
import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(__dirname, '../dist');

const CASE_SLUGS = [
  'xinheyun-ai-agents',
  'ai-agent-factory',
  'staking-infrastructure',
  'ff-service',
  'investment-research',
];

beforeAll(() => {
  execSync('npm run build', { stdio: 'inherit' });
}, 180_000);

describe('full site page coverage', () => {
  const corePages = ['index', 'about', 'contact'];

  it('builds every zh and en core page', () => {
    for (const lang of ['zh', 'en']) {
      for (const page of corePages) {
        const file = page === 'index' ? `${lang}/index.html` : `${lang}/${page}/index.html`;
        expect(existsSync(path.join(DIST, file)), file).toBe(true);
      }
    }
  });

  it('builds every case study page in both languages', () => {
    for (const lang of ['zh', 'en']) {
      for (const slug of CASE_SLUGS) {
        const file = path.join(DIST, lang, 'work', slug, 'index.html');
        expect(existsSync(file), file).toBe(true);
      }
    }
  });

  it('builds the English resume page and the Chinese resume PDF', () => {
    expect(existsSync(path.join(DIST, 'en', 'resume', 'index.html'))).toBe(true);
    expect(existsSync(path.join(DIST, 'resume-zh.pdf'))).toBe(true);
  });

  it('builds the root redirect page', () => {
    expect(existsSync(path.join(DIST, 'index.html'))).toBe(true);
  });
});

describe('structured data on case study pages', () => {
  it('every case study page has Article and FAQPage JSON-LD', () => {
    for (const lang of ['zh', 'en']) {
      for (const slug of CASE_SLUGS) {
        const html = readFileSync(path.join(DIST, lang, 'work', slug, 'index.html'), 'utf-8');
        expect(html, `${lang}/${slug}`).toContain('"@type":"Article"');
        expect(html, `${lang}/${slug}`).toContain('"@type":"FAQPage"');
        expect(html, `${lang}/${slug}`).toContain('"@type":"Person"');
      }
    }
  });
});

describe('hreflang cross-linking', () => {
  it('a zh case study page links to its en counterpart and vice versa', () => {
    const zhHtml = readFileSync(path.join(DIST, 'zh', 'work', 'ff-service', 'index.html'), 'utf-8');
    const enHtml = readFileSync(path.join(DIST, 'en', 'work', 'ff-service', 'index.html'), 'utf-8');
    expect(zhHtml).toContain('hreflang="en"');
    expect(zhHtml).toContain('/en/work/ff-service/');
    expect(enHtml).toContain('hreflang="zh"');
    expect(enHtml).toContain('/zh/work/ff-service/');
  });
});
```

- [ ] **Step 2: Run the full suite**

Run: `npx vitest run`
Expected: PASS across every test file (`geo.test.ts` including its `buildHreflangLinks` coverage, `i18n-utils.test.ts`, `site-data.test.ts`, `content-schema.test.ts`, `build.test.ts`).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "test: add full-site build verification suite"
```

---

### Task 22: README and deployment documentation

**Files:**
- Modify: `README.md`

**Interfaces:** none — documentation only.

- [ ] **Step 1: Write the README**

Cover, concretely (not as placeholders — fill in the real values from this plan):
- What the site is (one paragraph, matching spec §1).
- Tech stack: Astro (static), Tailwind v4, TypeScript, Vitest, `@astrojs/sitemap`.
- Local development: `npm install`, `npm run dev`, `npm run build`, `npm run test`.
- Content structure: where the 5 case studies live (`src/content/work/{zh,en}/*.md`), the `workSchema` fields, and how to add a 6th case study (add a matching-named `.md` file to both locale folders with the required frontmatter — no code changes needed, `getStaticPaths` in `src/pages/{zh,en}/work/[slug].astro` picks it up automatically).
- GEO files: what `robots.txt`, `llms.txt`, `llms-full.txt`, and `sitemap-index.xml` are for and how they're generated (link to spec §6 for the reasoning).
- **Before going live**: (1) register a domain and replace the provisional `siteUrl` in `src/data/site.ts` (currently `https://yixiangzhang.com`); (2) deploy to Cloudflare Pages or Vercel (build command `npm run build`, output directory `dist`); (3) manually submit the sitemap to Google Search Console, Bing Webmaster Tools, and Baidu 站长平台 (spec §6 — these require the user's own accounts and cannot be automated).
- Design system: point to `PRODUCT.md`/`DESIGN.md` (written by `impeccable`) as the source of truth for visual decisions, and note that `impeccable`/`taste-skill` are the tools used for any future visual changes (spec §5, plan Tasks 8–9, 20).

- [ ] **Step 2: Verify README accuracy against the actual repo**

Run through each command listed in the README (`npm install`, `npm run dev`, `npm run build`, `npm run test`) and confirm they work exactly as documented.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "docs: write README covering setup, content model, GEO, and deployment"
```

---

## Self-Review Notes

- **Spec coverage**: §3 (sitemap) → Tasks 1, 9–13, 19. §4.1–4.9 (content plan) → Tasks 10, 12, 13, 14–18. §5 (visual system) → Tasks 8–10, 20. §6 (GEO) → Tasks 5, 6, 7, 21. §7 (tech stack) → Task 1. §8 (i18n) → Task 2. §9/§10 (scope/follow-ups) → respected throughout (no blog task exists; `centaur`/Paradigm never appears in any task; English résumé is HTML not PDF, with reasoning stated in Task 13).
- **Placeholder scan**: no "TBD"/"add appropriate X" phrasing in any task step; the one provisional value (`siteUrl`) is a concrete, real-looking placeholder with an explicit, documented replacement step (Task 22), not an open-ended gap.
- **Type consistency checked**: `Locale` (Task 2) is reused verbatim by `site.ts` (Task 3), `geo.ts` (Task 5, via plain string literals `'zh'|'en'` matching `Locale`), `home-content.ts`/`about-content.ts`/`contact-content.ts` (Tasks 10, 12, 13), and every component prop. `workSchema`'s `metrics`/`faqs` shapes (Task 4) match exactly what `CaseStudyLayout` (Task 11) and the 5 content files (Tasks 14–18) produce/consume. `buildHreflangLinks(slug, baseUrl)` (Task 5) signature matches every call site (`Seo.astro` Task 7, `build.test.ts` Task 21 assertions on rendered output).
