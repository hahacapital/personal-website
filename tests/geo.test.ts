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

  it('omits the zh alternate/x-default for an English-only page (e.g. /en/resume/)', () => {
    const links = buildHreflangLinks('resume', 'https://yixiangzhang.com', ['en']);
    expect(links).toEqual([
      { hreflang: 'en', href: 'https://yixiangzhang.com/en/resume/' },
      { hreflang: 'x-default', href: 'https://yixiangzhang.com/en/resume/' },
    ]);
  });
});
