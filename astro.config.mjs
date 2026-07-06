// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://yixiangzhang.com',
  output: 'static',
  // Align the content layer's data-store.json location between CLI commands
  // (`astro sync`/`astro build`, which write to `cacheDir`) and Vite "serve"
  // consumers like Vitest (which always read from the project's `.astro/`
  // dir). Without this, `astro sync` writes to `node_modules/.astro/` while
  // Vitest reads from `./.astro/`, so `getCollection()` sees an empty store
  // even though the sync succeeded. See tests/content-schema.test.ts.
  cacheDir: './.astro/',
  vite: {
    plugins: [tailwindcss()]
  }
});