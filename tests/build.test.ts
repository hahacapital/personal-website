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
