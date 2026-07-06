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
