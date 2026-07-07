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
