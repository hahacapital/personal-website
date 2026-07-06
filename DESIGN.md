---
name: Yixiang Zhang — Portfolio
description: Machined-editorial portfolio for an independent Forward Deployed Engineer
colors:
  bg: "oklch(1 0 0)"
  surface: "oklch(0.97 0.004 40)"
  hairline: "oklch(0.9 0.004 45)"
  ink: "oklch(0.235 0.012 45)"
  muted: "oklch(0.52 0.014 45)"
  faint: "oklch(0.62 0.01 45)"
  primary: "oklch(0.56 0.17 36)"
  primary-hover: "oklch(0.5 0.165 35)"
  accent: "oklch(0.4 0.07 250)"
typography:
  display:
    fontFamily: "Schibsted Grotesk Variable, Noto Sans SC Variable, system-ui, sans-serif"
    fontSize: "clamp(2.375rem, 1.85rem + 2.6vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Schibsted Grotesk Variable, Noto Sans SC Variable, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 1.45rem + 1.5vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Schibsted Grotesk Variable, Noto Sans SC Variable, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.9vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Schibsted Grotesk Variable, Noto Sans SC Variable, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Spline Sans Mono Variable, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "tabular-nums"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "999px"
spacing:
  2xs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg}"
    rounded: "{rounded.md}"
    padding: "0.65rem 1.1rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.bg}"
  lang-segment:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    typography: "{typography.label}"
  lang-segment-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
---

# Yixiang Zhang — Portfolio · Design System

<!-- Seeded and implemented in Task 9 (base layout, header, footer, language
     switcher) via the impeccable skill. Scan-mode: tokens below are extracted
     from src/styles/global.css and the shell components, which are the source
     of truth. Later tasks should extend, not re-derive, this system. -->

## Overview

**Creative North Star: "The Machined Faceplate."** A precision instrument on a
white lab bench under even daylight. The object is calm, exacting, and honest
about what it measures; the single note of warmth is one anodized coral dial,
not the room around it. This is the physical form of PRODUCT.md's brand: an
independent Forward Deployed Engineer whose pitch is carried by shipped systems
and numbers, not adjectives — "editorial layout, terminal numbers."

The system runs on two voices in deliberate tension:

- **Editorial voice** — a neo-grotesque (Schibsted Grotesk, a Norwegian
  newsroom face) sets headings and prose. It reads considered and magazine-
  adjacent *without* the italic-display-serif affectation that has become the
  saturated 2026 "editorial-typographic" cliché.
- **Instrument voice** — a humanist monospace (Spline Sans Mono) is confined
  to figures, metadata, labels, contact identifiers, and the language switcher.
  Mono here is the Bloomberg-terminal treatment of data, never a blanket
  "developer" costume; it appears only where the content is genuinely a number
  or a machine-readable value.

**Bilingual parity is structural, not decorative.** Simplified Chinese is set
in a weight-matched Noto Sans SC (self-hosted), with the base weight stepped
down (400 → 350) and line-height and tracking tuned per `:lang(zh)` so the
Chinese and English renderings carry equal optical weight. Neither language is
a stripped-down afterthought of the other.

**Anti-references (what this must never become):** generic SaaS gradient
dashboards; the italic-Fraunces + tiny-mono-kicker "editorial-typographic"
portfolio template; the hero-metric block (big number / small label / gradient)
as SaaS decoration; and a warm cream/sand/parchment body background — the
saturated AI warm-near-white. Warmth lives in the coral and the type; the
surface stays pure white.

**Layout posture:** a single centered content column (max `72rem`) inside a
fluid gutter (`clamp(1.25rem, 0.75rem + 2.5vw, 3rem)`), body measure capped at
`68ch`. Section rhythm is fluid (`--space-2xl`/`--space-3xl` via `clamp`);
grouping is tight, separation is generous. 4pt spacing base. Flexbox for 1D
(nav, wordmark), Grid for 2D (footer). No card-grid scaffolding in the shell.

## Colors

Strategy: **Restrained.** Pure-white surface, warm near-black ink ramp, one
saturated coral that carries brand identity across ≤10% of the surface (CTAs,
links, focus, the wordmark dial, active-nav marker). A cool slate-blue accent
provides quiet secondary hierarchy at a hue *and* lightness clearly distinct
from the coral. All values are OKLCH (canonical); sRGB hex is given for
reference only.

| Token | OKLCH | hex | Role | Contrast |
|---|---|---|---|---|
| `bg` | `oklch(1 0 0)` | `#ffffff` | Page surface (pure white, no hidden warmth) | — |
| `surface` | `oklch(0.97 0.004 40)` | `#f8f4f3` | Footer, panels, inset chips | — |
| `hairline` | `oklch(0.9 0.004 45)` | `#e0dddc` | Borders, rules, dividers | — |
| `ink` | `oklch(0.235 0.012 45)` | `#231c19` | Body + headings | 16.7:1 on bg |
| `muted` | `oklch(0.52 0.014 45)` | `#706762` | Secondary text, nav | 5.5:1 on bg |
| `faint` | `oklch(0.62 0.01 45)` | `#8c8481` | Captions, meta, keys | 3.65:1 on bg |
| `primary` | `oklch(0.56 0.17 36)` | `#c3441f` | CTAs, links, focus, dial | 5.0:1 on bg |
| `primary-hover` | `oklch(0.5 0.165 35)` | `#ad3210` | CTA/link hover | — |
| `accent` | `oklch(0.4 0.07 250)` | `#284a6c` | Secondary marks | 9.2:1 on bg |

**Rules.** Every text pairing meets WCAG AA (body ≥ 4.5:1, large ≥ 3:1); ink
clears AAA. White text is used on the coral fill (Helmholtz-Kohlrausch:
saturated mid-luminance fills take light text). Never rely on color alone —
active states pair the coral with a rule/underline/fill or `aria-current`.
Never introduce a cream/sand/beige body background; never tint the surface
past ~0.005 chroma.

## Typography

Two Latin families + one CJK family. Fluid `clamp()` scale (~1.25 ratio) for
headings; body fixed at `1.0625rem` (17px). All self-hosted variable fonts,
`font-display: swap`.

- **Schibsted Grotesk Variable** (400–900) — display / headline / title / body
  (Latin). Negative tracking on large Latin headings (`-0.02em`), reset to `0`
  for CJK.
- **Spline Sans Mono Variable** (300–700) — labels, figures, metadata, contact
  identifiers, the switcher, footer coordinates. `tabular-nums` on.
- **Noto Sans SC Variable** — CJK glyphs (loaded on demand via unicode-range
  subsets). Base weight 350 under `:lang(zh)`, line-height 1.7, tracking
  `0.005em` for matched optical color.

Scale: caption `0.8125rem` · sm `0.9375rem` · body `1.0625rem` · lead
`clamp(1.1875rem…1.4375rem)` · h3 `clamp(1.375rem…1.75rem)` · h2
`clamp(1.75rem…2.5rem)` · h1 `clamp(2.375rem…3.75rem)`. Headings use
`text-wrap: balance`, prose `text-wrap: pretty`. Never below 16px body; never
`px` for type; hero clamp max is 3.75rem (well under the 6rem ceiling).

## Elevation

**Predominantly flat; depth comes from hairlines and tonal layering, not
shadow.** The near-white surface (`surface`) and 1px `hairline` rules do the
structural separation (header underline, footer top border, ledger dividers).

Shadow is reserved for genuinely floating layers only:
- Mobile nav disclosure popover: `0 12px 30px -12px` at 30% ink — a soft,
  low, single-source drop that reads as "temporarily above the page."
- The wordmark coral dial carries a 3px `16%`-alpha ring — a focus halo, not
  elevation.

No shadow scale beyond this; the shell is intentionally paper-flat. Z-index is
a semantic scale: `--z-sticky: 100` (masthead) < `--z-overlay: 400` (nav
popover, skip link).

## Components

- **Masthead** (`Header.astro`) — sticky, `min-height: 4rem`, translucent
  white with `backdrop-filter` blur, hairline bottom border. Wordmark (coral
  dial + name + mono `FDE` tag) left; primary nav + language switcher right.
  Desktop (≥48rem) shows nav inline with a coral underline on the active item;
  below that, nav collapses into a zero-JS `<details>` disclosure popover.
- **Language switcher** (`LanguageSwitcher.astro`) — a pill segmented control
  (`中` / `EN`) in mono. Current language is a filled ink segment with
  `aria-current`; the other is an `<a>` to `getLocalizedPath(pathname, other)`
  with `hreflang`/`lang`/`rel="alternate"`. State survives grayscale (fill, not
  just hue). Visible coral focus ring, 44px-adjacent hit area.
- **Primary button / CTA** (`.cta` in `Footer.astro`) — coral fill, white
  text, `8px` radius, mono-label type, arrow that nudges on hover, presses on
  active. Hover → `primary-hover`.
- **Contact ledger** (`Footer.astro`) — a `<dl>` with faint keys and mono
  values: email as `mailto:`, WeChat as plain text, GitHub as an external link
  rendered `@handle`. Labels pair with values so meaning never depends on
  position.
- **Footer** — `surface` background, two-column grid (lead + directory) over a
  mono baseline row (copyright + Shanghai coordinates as an instrument-panel
  flourish).
- **Skip link** (`.skip-link`) — inked pill, off-screen until focused, first
  in tab order, targets `#main`.

Focus: every interactive element gets a `2px` coral `:focus-visible` outline at
`2px` offset. Motion: `--ease-out-quart` easing, 140–220ms; a full
`prefers-reduced-motion: reduce` branch neutralizes transitions and smooth
scroll.

## Do's and Don'ts

**Do**
- Carry warmth through the coral + type; keep surfaces pure white / faint warm.
- Use mono (Spline Sans Mono) only for figures, identifiers, and metadata.
- Give Chinese and English equal typographic care; tune per `:lang(zh)`.
- Pair every non-decorative color cue with a shape/text cue (rules, `aria-current`).
- Verify contrast in OKLCH before shipping a new color; keep body ≥ 4.5:1.
- Reach for hairlines + spacing before shadows or cards.

**Don't**
- Don't introduce a cream/sand/parchment body background, or tint the surface
  past ~0.005 chroma "for warmth."
- Don't set an italic display serif with a tiny tracked mono kicker — that is
  the exact editorial-typographic cliché this brand rejects.
- Don't build the hero-metric block (big number / small label / gradient) as a
  standalone SaaS module.
- Don't use mono as a blanket "technical" costume on prose.
- Don't add side-stripe borders, gradient text, or decorative glassmorphism.
- Don't repeat a tiny uppercase tracked eyebrow above every section.
