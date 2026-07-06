# Personal Website — Design Spec

Status: Approved by user on 2026-07-06 (with one correction: `centaur` removed from case list — see §4.5).

## 1. Purpose

Build a bilingual (Chinese/English) personal portfolio site for 张翼翔 / Yixiang Zhang, an independent Forward Deployed Engineer (FDE) who ships enterprise AI Agent systems into production for multiple clients concurrently.

Success criteria, in priority order:

1. Enterprises undergoing AI transformation can find him and quickly understand what he does and how to engage him.
2. The site is discoverable and gets recommended by mainstream AI assistants/search — both international (ChatGPT, Claude, Gemini, Perplexity) and domestic Chinese (Doubao, DeepSeek, Qwen, ERNIE Bot, Yuanbao, Kimi) — i.e. it is optimized for Generative Engine Optimization (GEO), not just traditional SEO.
3. His investment/quant research work is represented as evidence of deep AI + adjacent-industry (crypto, fintech) fluency — not as a pitch to be hired as an investor.
4. The site has editorial, considered visual taste — not a generic template look.

## 2. Audience & Positioning

**Primary audience**: decision-makers at enterprises (often technical, sometimes business-side) evaluating whether to bring in outside help to get an AI Agent project from demo to production.

**Primary call-to-action**: start a conversation about a short-term embedded project engagement (the classic FDE model — embed with a team, ship a specific AI system, move on).

**Identity tags to reinforce simultaneously** (per user selection):
- 企业级 AI Agent / 大模型落地专家 — enterprise AI Agent / LLM productionization expert
- 懂技术的投资/量化研究背景 — technically-grounded investment & quant research background (credibility signal, not a pitch to be hired as an investor)
- Forward Deployed Engineer — explicitly named and positioned against the Palantir-popularized FDE model, for international legibility

Note: "blockchain/crypto infrastructure expert" was explicitly **not** selected as a headline identity tag despite substantial crypto-adjacent work in the portfolio. That work appears as case-study evidence (of enterprise delivery chops and financial-domain fluency), not as the headline pitch.

## 3. Information Architecture

Full bilingual parity: every page exists at both a `/zh/...` and `/en/...` path, cross-linked via `hreflang`.

```
/                     → redirects to /zh/ or /en/ based on Accept-Language, defaults to /zh/
/{lang}/                Home — hero, 3 identity pillars, selected case cards, investment-background
                         summary, condensed career timeline, contact block
/{lang}/work/{slug}     5 flagship case study pages (see §4.2–4.6)
/{lang}/about            Full career narrative + philosophy + education
/{lang}/contact          Contact page (WeChat, email, resume download)
```

No blog/insights section in this version (explicit user decision — may be added later).

## 4. Content Plan

### 4.1 Home (`/{lang}/`)

Sections top to bottom:
1. Hero: name, one-line positioning statement blending all three identity tags, primary CTA ("讨论一个项目" / "Discuss a project")
2. Three identity pillars, each with 1-2 supporting proof points (metrics, not adjectives)
3. Selected case studies — cards linking to the 5 detail pages, sorted by relevance to the AI Agent / enterprise pitch first
4. Investment & research summary block — short, links through to the case 5 detail page
5. Condensed career timeline (employers + dates only, links to `/about` for the full narrative)
6. Contact block (WeChat + email, resume download link)

### 4.2 Case Study 1 — Enterprise AI Agents at 新核云 (XinHeYun)

Source: résumé (2021.5–2025.1, Technical Director, Shanghai; China's #1 industrial SaaS company by market share).

Key facts to feature:
- Code-generation agent that improved core product refactoring efficiency by **80%**
- "质量合拍" (Quality Harmony) production-line quality-management agent deployed to factory floors
- Delivered AI cost-control, intelligent work-order, and enterprise knowledge-base RAG Q&A systems
- Owned the full lifecycle — scoping, architecture, engineering, production — directly accountable for business ROI
- Led private/on-prem deployment & operations for KA (key account) clients, adapting the standard product to messy client-side data & compliance environments
- Led the infrastructure team supporting a 100-person R&D org; built an observability platform sustaining **SLA > 99.99%**, recognized as an Alibaba Cloud best practice
- Built and ran the internal big-data platform connecting data silos across the org

This is his strongest single quantified proof of enterprise AI delivery, even though it predates his independent-FDE period. Frame it as "before going independent" context feeding directly into the FDE thesis: he already did this full-time inside one company; now he does it as an embedded specialist across several.

### 4.3 Case Study 2 — AI Agent Factory (Blueprint Infrastructure)

Source repos: `agent-factory`, `napkin-compiler` (org: `blueprint-infrastructure`).

Narrative: built the internal platform that lets AI agents create new agents at runtime, plus a compiler pipeline that turns informal product intent (a napkin sketch / flowchart) into a PRD, then engineering issues, then shipped code — orchestrated through Notion and GitHub.

Key facts to feature:
- Recursive agent creation (agents that build agents) — the differentiating idea
- Multi-agent orchestration with a 10-agent registry, SSE streaming, guardrails enforced via MCP hooks
- `napkin-compiler`: intent → PRD → issues → code, with adversarial verification and a multi-gate approval flow (GATE_1 / GATE_2) grounded against the live codebase
- Stack: Python (Claude Agent SDK) + FastAPI backend, React/TypeScript frontend

### 4.4 Case Study 3 — Institutional-Grade Blockchain Staking Infrastructure (Blueprint Infrastructure)

Source repos: `staking-infra`, `staking-ledger-service`, `devops-crm`, `blueprint-devops-monitoring`, `pms-infra` (all org: `blueprint-infrastructure`; `bpte` is the deprecated predecessor of `staking-infra`, mentioned only as lineage, not a separate case).

Narrative: built and operate, from zero, the full infrastructure stack for an institutional-grade crypto asset manager — one cohesive case study, not five fragmented ones.

Key facts to feature, organized as sub-capabilities of one system:
- **Multi-chain node deployment**: standardized AWS-native toolkit spanning 6 blockchain protocols (incl. Solana, Ethereum, Avalanche, Algorand, Audius), shipped as both a scriptable CLI (Typer, JSONL mode for CI) and an interactive TUI (Textual) — "CLI for machines, TUI for humans"
- **Rewards & billing accounting**: Solana staking rewards, Jito MEV rewards, and priority fees tracked per stake account; automated billing reports (handles validator commission logic, epoch mechanics, historical data gaps)
- **Multi-tenant customer provisioning**: Terraform (29 modules) + Helm provisioning fully isolated AWS environments per customer (VPC, ALB, EKS, Aurora PostgreSQL, Redshift, Cloudflare DNS), with a Python TUI + CI/CD for automated end-to-end provision/destroy
- **Observability & ops**: validator infra synced into Notion, AUM metrics pushed to Amazon Managed Prometheus/Grafana for CEO-facing dashboards; alerting-as-code with runbooks, Teams notifications, and automated root-cause-analysis
- Result framed in business terms: this is the operational backbone an institutional crypto asset manager runs on — production-grade reliability for infrastructure holding real client assets

### 4.5 Case Study 4 — ff-service: an AI Investment-Research Product

Source repo: `ff-service` (org: `hahacapital`, personal).

Narrative: a real, shipping, revenue-generating product — not a demo — that sits exactly at the intersection of AI and investing.

Key facts to feature:
- Freemium model: submit a portfolio or question, get AI analysis (Claude agent over a private knowledge vault via TF-IDF retrieval), pay to unlock the full report
- No user accounts — token-based auth
- Real payment integration: Alipay, WeChat Pay, and USDT (TRC20) — multi-rail, including crypto
- Chinese-market-facing product
- Proof point: this is the same person who builds enterprise AI Agents for clients, personally shipping and monetizing an AI product end-to-end, including the unglamorous parts (payments, auth, ops)

### 4.6 Case Study 5 — Investment Research System

Source repos: `vc_research` (a.k.a. `vc-research` on GitHub), `vault`, `jojo_quant`, `feiyangyang`, plus brief mentions of `sharpe_one` and `tradingview` (all org: `hahacapital`, personal).

Narrative: this is the direct evidence for the "technically-grounded investment background" identity pillar — a systematic, automated personal investment-research practice, not a hobby.

Key facts to feature:
- `vc_research`: a Claude Code skill that pulls venture funding data from Crunchbase into a structured feed for deal sourcing — screens for AI infra, AI consumer, payments, and market-infrastructure themes; flags outlier early-stage raises
- `vault`: a private, Obsidian-backed investment research knowledge base with daily automated ingestion (web scraping, YouTube transcripts, macro data, portfolio sync), LLM-driven compilation into daily reports, multi-layer verification gates, and monthly review cycles
- `jojo_quant`: a public (GitHub, 7 stars) daily quant signal screener across NASDAQ, NYSE, and commodity futures; two strategies backtested across 960+ tickers and 9 market regimes; automated Telegram alerts
- `feiyangyang`: a portfolio-optimization tool that ranks "parking" assets using a novel antifragility score (CAGR × (1 − off-correlation))
- Brief mentions: `sharpe_one` (public quant fund research) and `tradingview` (Pine Script strategy research)
- Framing line: this is what "understanding AI and the industries around it" looks like in practice — he trades on, and builds tooling around, the same technology he ships for clients

### 4.7 Other Engagements (light mention only, no dedicated page)

Listed briefly on Home and/or About as evidence of the multi-client FDE model, without full case-study treatment:
- **Lightyear Technologies** (`lightyear-data`) — market-data product computing a quality-adjusted LLM-inference-pricing index, with an MCP server and agent-facing API
- **XYNX-AI** (`AI-CMO`) — early-stage AI decision-support product for pharma-company C-suites
- A generic mention of cross-border e-commerce operational tooling (from the `tiktok-roi` project) **without naming the client** — that engagement runs through a private client-side remote, and no explicit confirmation was given to name that client, unlike Blueprint Infrastructure / Lightyear / XYNX-AI

蚂蚁金服 (Ant Financial) is already covered as formal employment history in the résumé/timeline (BaaS platform, 8 technical patents + 1 business-model patent) and does not need a separate "other engagements" mention.

**Correction applied**: `centaur` (`paradigmxyz/centaur`) is excluded entirely — the user clarified this is not a project he built. No mention of Paradigm anywhere on the site.

### 4.8 About (`/{lang}/about`)

Full narrative arc: Ant Financial (blockchain BaaS, patents) → XinHeYun (Technical Director, AI Agents at scale) → the 2025 transition to independent FDE work across multiple concurrent clients → present. Include working philosophy ("solving problems over stacking technology"), bilingual/cross-cultural collaboration strength, and education (Illinois Institute of Technology MS Computer Engineering; Hohai University BS Communication Engineering).

### 4.9 Contact (`/{lang}/contact`)

WeChat (827924829) and email (zhangyixiangece@gmail.com) as the two contact channels. Downloadable resume PDF, in both Chinese (source résumé, already in hand) and English (new translation to be produced during implementation). Short line restating what kind of engagement he's looking for (short-term embedded project work).

## 5. Visual Design System

Direction: **editorial minimalism with data emphasis** — a Kinfolk-magazine sensibility (generous whitespace, restrained serif display type) crossed with a Bloomberg-terminal treatment of numbers (tabular/monospace figures, high-contrast metric callouts). This direction is consistent with the user's own prior design taste (the `tiktok-roi` project's `PRODUCT.md` independently specifies a "Kinfolk + Bloomberg numbers" aesthetic).

- Type: serif display face for headlines (e.g. Fraunces or Newsreader), neutral sans for body copy (Inter, paired with a matching CJK face — e.g. Source Han Sans / 思源黑体 — properly weighted and spaced for Chinese, not just the Latin font stretched over CJK), monospace for all metrics/figures (e.g. "SLA 99.99%", "+80% efficiency")
- Palette: near-black/near-white base, a single restrained accent color (deep green or deep blue), no gradients or decorative shadows
- Layout: generous whitespace, card-grid for case studies, quantified results visually emphasized (larger/mono treatment) to reinforce the "data emphasis" half of the direction
- Chinese typography gets its own pass (weight, line-height, mixed CJK/Latin spacing) rather than reusing English type rules verbatim
- Use the `taste-skill` and `impeccable` tools (per user's original request) during the visual-polish pass of implementation

## 6. GEO Technical Implementation

Research current as of 2026-07-06 (see sources below); this space moves quickly and should be revisited periodically post-launch, not treated as a one-time setup.

1. **`llms.txt` + `llms-full.txt`** at site root — the emerging LLM-facing convention already adopted by Anthropic, Stripe, Vercel, Cloudflare, etc. `llms.txt` is a concise markdown nav/summary (site name, one plain-spoken description, sections for background, case studies, contact, sitemap link); `llms-full.txt` inlines the full markdown body of the priority pages (home, all 5 case studies, about, contact) so an agent can answer questions about him without an extra fetch. Regenerated on every build.
2. **`robots.txt` explicitly allows AI crawlers** — both training crawlers (GPTBot, ClaudeBot) and retrieval/citation crawlers (OAI-SearchBot, Claude-SearchBot, PerplexityBot, ChatGPT-User, Claude-User), plus the crawlers that matter for domestic engines (Baiduspider, Bytespider, Sogou, PetalBot). Unlike a publisher protecting content value, a personal portfolio site's goal is maximum exposure, so there is no reason to block training crawlers the way news publishers often do.
3. **Structured data (JSON-LD)**: `Person` schema on Home/About with a `sameAs` array linking GitHub and other authoritative profiles; each case-study page gets `Article` + `FAQPage` schema together (per current data, the "triple stack" of Article + ItemList + FAQPage earns ~1.8x more AI-answer citations than Article alone); `BreadcrumbList` sitewide.
4. **On-page FAQ blocks** on Home/About/case studies with direct, self-contained, quotable answers to likely queries (e.g. "who is a Forward Deployed Engineer with enterprise AI Agent + investment background") — answer-first, no throat-clearing, first ~200 words of any long-form section should resolve the primary question.
5. **Static, semantic HTML for all core content** — Astro's default output; no core content gated behind client-side JS rendering, so any crawler (JS-executing or not) can read it.
6. **`sitemap.xml` + `hreflang`** across the zh/en page pairs; after launch, manually submit to Google Search Console, Bing Webmaster Tools, and Baidu 站长平台 (requires the user's own accounts — cannot be automated by this build).

Sources consulted: [SeekLab — llms.txt 2026 guide](https://seeklab.io/blog/what-is-llmstxt-the-honest-2026-guide/), [SEO Melbourne — llms.txt implementation guide](https://seomelbourne.com/learning-hub/llms-txt-seo-2026-guide/), [No Hacks — AI User-Agent Landscape 2026](https://nohacks.co/blog/ai-user-agents-landscape-2026), [Anagram — AI crawlers explained 2026](https://www.anagram.ai/blog/ai-crawlers-explained-gptbot-claudebot-perplexitybot-and-how-to-let-them-in-2026), [Search Engine Land — mastering GEO 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142).

## 7. Tech Stack & Deployment

- **Framework**: Astro, static output. Chosen for near-zero shipped JS, first-class static HTML (GEO/crawler-friendly), and built-in i18n routing.
- **Styling**: Tailwind CSS.
- **Content**: Astro content collections, Markdown/MDX — one collection per language, or a shared collection keyed by slug+locale (exact shape decided during implementation planning). Keeping case studies as content files (not hardcoded in components) makes it straightforward for the user to add more later.
- **Deployment**: Cloudflare Pages or Vercel free tier, auto-deploy on push. Build step regenerates `sitemap.xml`, `llms.txt`, and `llms-full.txt`.
- **Domain**: not yet registered. Recommendation: prioritize a real-name domain (e.g. `yixiangzhang.com` / `zhangyixiang.dev`) for the primary site — better for GEO entity resolution and reads as more credible to international enterprise audiences — with `hahacapital.com` (if available) registered separately and 301-redirected in, preserving the existing personal brand equity from the GitHub org. Ship first to the platform's default subdomain; swap in the custom domain once registered.

## 8. Bilingual / i18n Strategy

Full parity, not machine-translated afterthought: every page authored in both languages with equal care, cross-linked via `hreflang`. Language-switcher present sitewide. Default locale for `/` root redirect: `zh` (based on `Accept-Language`, falling back to `zh`).

Content-language note: per the user's standing instruction, all code, configuration, comments, commit messages, and project documentation (this spec, the implementation plan, the README) are in English. This does **not** apply to the actual bilingual page content itself — the `/zh/` routes' visible copy is Chinese by explicit design requirement (§8 above); that content is product output, not project documentation.

## 9. Out of Scope (v1)

- Blog / ongoing insights section (explicit user decision — revisit later)
- Any mention of, or content from, `paradigmxyz/centaur`
- Naming the specific client behind `tiktok-roi`
- Domain registration itself (recommendation only; registering costs money and requires the user's own accounts)
- Submitting sitemaps to Search Console / Bing Webmaster / Baidu 站长平台 (requires user's own accounts)

## 10. Open Follow-Ups (non-blocking)

- English translation of the résumé PDF for `/contact` download — to be produced during implementation.
- LinkedIn URL (if any) for the `Person` schema `sameAs` array — not yet provided; omit if none exists.
- Headshot / photo for About page — not yet provided; implementation should proceed with a graceful placeholder/omission rather than blocking on this.
- Final domain choice and registration — user's action, post-launch.
