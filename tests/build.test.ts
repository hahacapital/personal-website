// tests/build.test.ts
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
  'tiktok-roi',
];

beforeAll(() => {
  execSync('npm run build', { stdio: 'inherit' });
}, 180_000);

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

  // Task 6's review flagged that an existence-only check for llms-full.txt
  // would happily pass even if the generator regressed to emitting only
  // frontmatter (title/summary/metrics/faqs) and dropped the raw Markdown
  // body. This string is body-only prose from ff-service.md's "Why this case
  // matters" section — it appears nowhere in that entry's frontmatter — so
  // this assertion only passes if src/pages/llms-full.txt.ts is still
  // inlining real case-study body content, not just metadata.
  it('llms-full.txt contains real case-study body prose, not just frontmatter', () => {
    const txt = readFileSync(path.join(DIST, 'llms-full.txt'), 'utf-8');
    expect(txt).toContain('unglamorous parts (payments, auth, operations)');
  });
});

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

  // Task 20's visual-polish pass discovered the primary nav's "Work" link
  // (and the Home hero's "View work" CTA) 404'd because no /work/ index page
  // existed — only the dynamic /work/[slug]/ case-study routes did. The fix
  // added src/pages/{en,zh}/work/index.astro; this asserts both still build,
  // guarding against that exact gap recurring.
  it('builds the zh and en /work/ index pages (Task 20 fix for the previously-404ing "Work" nav link)', () => {
    expect(existsSync(path.join(DIST, 'en', 'work', 'index.html'))).toBe(true);
    expect(existsSync(path.join(DIST, 'zh', 'work', 'index.html'))).toBe(true);
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
  // Final-review Finding 1: the design spec called for the "triple stack"
  // (Article + ItemList + FAQPage — cited research says ~1.8x more AI-answer
  // citations than Article alone) plus a sitewide BreadcrumbList, but both
  // ItemList and BreadcrumbList were dropped when the spec was narrowed into
  // concrete implementation tasks. This asserts the full stack so that gap
  // can't silently reopen.
  it('every case study page has the full Article+ItemList+FAQPage+BreadcrumbList stack', () => {
    for (const lang of ['zh', 'en']) {
      for (const slug of CASE_SLUGS) {
        const html = readFileSync(path.join(DIST, lang, 'work', slug, 'index.html'), 'utf-8');
        expect(html, `${lang}/${slug}`).toContain('"@type":"Article"');
        expect(html, `${lang}/${slug}`).toContain('"@type":"ItemList"');
        expect(html, `${lang}/${slug}`).toContain('"@type":"FAQPage"');
        expect(html, `${lang}/${slug}`).toContain('"@type":"Person"');
        expect(html, `${lang}/${slug}`).toContain('"@type":"BreadcrumbList"');
      }
    }
  });
});

describe('BreadcrumbList on non-case-study pages', () => {
  it('About, Contact, and the Work index each carry a BreadcrumbList (Home skips it — it is the root)', () => {
    for (const lang of ['zh', 'en']) {
      for (const page of ['about', 'contact', 'work']) {
        const html = readFileSync(path.join(DIST, lang, page, 'index.html'), 'utf-8');
        expect(html, `${lang}/${page}`).toContain('"@type":"BreadcrumbList"');
      }
      const homeHtml = readFileSync(path.join(DIST, lang, 'index.html'), 'utf-8');
      expect(homeHtml, `${lang}/index`).not.toContain('"@type":"BreadcrumbList"');
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

describe('sitemap i18n hreflang (root redirect exclusion)', () => {
  // Final-review Finding 5: @astrojs/sitemap's i18n grouping treats the root
  // `/` redirect page (src/pages/index.astro) as an implicit zh-CN alternate
  // on top of the real `/zh/`, because both resolve to the same
  // { locale: 'zh', path: '/' } grouping key internally — emitting
  // hreflang="zh-CN" twice. astro.config.mjs's sitemap `filter` excludes `/`
  // from the sitemap entirely to remove the collision (see the comment
  // there). This guards against that regressing.
  it('excludes the root "/" redirect page from the sitemap', () => {
    const xml = readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf-8');
    expect(xml).not.toContain('<loc>https://yixiangzhang.com/</loc>');
  });

  it('emits a balanced number of zh-CN and en-US hreflang alternates', () => {
    const xml = readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf-8');
    const zhCount = (xml.match(/hreflang="zh-CN"/g) ?? []).length;
    const enCount = (xml.match(/hreflang="en-US"/g) ?? []).length;
    expect(zhCount).toBeGreaterThan(0);
    expect(zhCount).toBe(enCount);
  });
});
