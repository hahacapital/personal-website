# personal-website

Personal portfolio site for Yixiang Zhang — an Astro static site styled with Tailwind CSS v4.

## Tech Stack

- [Astro](https://astro.build) (static output)
- [Tailwind CSS v4](https://tailwindcss.com), wired via the `@tailwindcss/vite` Vite plugin (no `tailwind.config.js`)
- TypeScript (strict, via `astro/tsconfigs/strict`)

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:4321` by default.

## Testing

```bash
npm test
```

Runs the Vitest suite (`tests/**/*.test.ts`). Content collections (`src/content.config.ts`) are backed by Astro's content layer, which only loads markdown files into its data store when `astro sync`/`astro build`/`astro dev` runs — Vitest does not trigger that on its own. A Vitest `globalSetup` (`vitest.global-setup.ts`) runs `astro sync` automatically before any test file executes, so `npm test`, `npx vitest run`, and `npx vitest run tests/some-file.test.ts` all work with no manual setup step. This requires `cacheDir: './.astro/'` in `astro.config.mjs` so the CLI sync and Vitest agree on where the data store lives.

## Before Going Live

The `site` field in `astro.config.mjs` is provisionally set to `https://yixiangzhang.com` (not yet registered). Replace it with the real registered domain once available.
