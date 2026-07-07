// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

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
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: { zh: 'zh-CN', en: 'en-US' },
      },
      // Exclude the root `/` redirect page (src/pages/index.astro — a
      // client-side Accept-Language redirect with no unique content of its
      // own, see i18n strategy in the design spec §8). Without this,
      // @astrojs/sitemap's i18n grouping (see its parseI18nUrl helper) treats
      // `/` as an implicit zh-CN alternate on top of the real `/zh/`, since
      // both resolve to the same { locale: 'zh', path: '/' } grouping key —
      // emitting hreflang="zh-CN" twice on every URL in that group. Dropping
      // `/` from the sitemap entirely removes the collision and also matches
      // Google's own sitemap guidance to avoid listing redirecting URLs.
      filter: (page) => new URL(page).pathname !== '/',
    }),
  ]
});
