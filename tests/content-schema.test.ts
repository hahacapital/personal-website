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
