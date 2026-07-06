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
