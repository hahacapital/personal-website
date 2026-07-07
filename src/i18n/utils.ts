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
