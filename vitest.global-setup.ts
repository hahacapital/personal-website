import { execFileSync } from 'node:child_process';

/**
 * Why this exists:
 *
 * Astro's content layer (the `glob()` loader behind `src/content.config.ts`)
 * only loads markdown files into its data store when something runs the
 * "sync" step — `astro dev`, `astro build`, or `astro sync`. Vitest never
 * triggers that step on its own: `getViteConfig()` boots a Vite instance in
 * "serve" mode purely to transform/resolve modules for the test run, so
 * `astro:content` just reads whatever is already on disk. If nothing has
 * synced yet, `getCollection()` legitimately returns `[]` even though the
 * schema and fixtures are correct.
 *
 * There is a second, easy-to-miss wrinkle: Astro decides *where* the data
 * store lives based on which "mode" triggered the sync.
 *   - `astro sync` / `astro build` treat themselves as non-dev, so they
 *     write to `cacheDir` (default `./node_modules/.astro/data-store.json`).
 *   - Vite "serve" consumers (which is what Vitest is, even for
 *     `vitest run`) always read from the project's `./.astro/data-store.json`.
 * Those are different paths by default, so running `astro sync` by hand
 * would *appear* to do nothing for Vitest. astro.config.mjs sets
 * `cacheDir: './.astro/'` specifically so both sides agree on one file.
 *
 * This globalSetup runs once before any test file/worker starts, regardless
 * of how Vitest was invoked (`npm test`, `vitest run`, or
 * `npx vitest run tests/some-file.test.ts`), so every test file gets a
 * populated content collection without needing a `pretest` npm script (which
 * would not fire for direct `npx vitest run <file>` invocations).
 *
 * Implementation note: this shells out to the `astro` CLI rather than
 * calling the programmatic `sync()` export from the `astro` package
 * directly. This file is itself loaded through Vite's SSR module runner
 * (that's how Vitest executes `globalSetup`), and under that transform the
 * `astro` package's named exports did not resolve correctly (`sync` came
 * back `undefined`) even though a plain Node `import('astro')` exposes it
 * fine. Spawning the real CLI in its own process sidesteps that transform
 * entirely and is exactly the command a human would run by hand.
 */
export async function setup() {
  execFileSync('npx', ['astro', 'sync'], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
}
