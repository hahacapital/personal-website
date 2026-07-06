/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    // Populate Astro's content-layer data store before any test file runs.
    // See vitest.global-setup.ts for why this is required (Vitest never
    // triggers Astro's content sync on its own) and why it must be paired
    // with the `cacheDir` setting in astro.config.mjs.
    globalSetup: ['./vitest.global-setup.ts'],
  },
});
