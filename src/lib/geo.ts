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

// `availableLocales` defaults to both — every page this project has shipped
// through Task 12 has a symmetric zh+en counterpart, so this default
// reproduces the exact previous output byte-for-byte. A page that exists in
// only one locale (e.g. the English-only /en/resume/ — the zh side links
// straight to a PDF instead, per that page's own scope note) passes a
// narrower list so it never advertises an alternate/x-default URL that
// doesn't actually build; falling back to a dead link is worse than omitting
// the annotation entirely.
export function buildHreflangLinks(
  slug: string,
  baseUrl: string,
  availableLocales: readonly ('zh' | 'en')[] = ['zh', 'en']
): HreflangLink[] {
  const suffix = slug ? `${slug}/` : '';
  const zhHref = `${baseUrl}/zh/${suffix}`;
  const enHref = `${baseUrl}/en/${suffix}`;
  const hasZh = availableLocales.includes('zh');
  const hasEn = availableLocales.includes('en');

  const links: HreflangLink[] = [];
  if (hasZh) links.push({ hreflang: 'zh', href: zhHref });
  if (hasEn) links.push({ hreflang: 'en', href: enHref });
  // x-default prefers zh (the site's default locale, see i18n/utils.ts) when
  // it exists — a no-op for every symmetric page — and falls back to en only
  // when a page has opted out of zh entirely.
  links.push({ hreflang: 'x-default', href: hasZh ? zhHref : enHref });
  return links;
}
