// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';

const AI_CRAWLER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Bytespider',
  'Baiduspider',
  'Sogou web spider',
  'PetalBot',
  'meta-externalagent',
];

function buildRobotsTxt(sitemapURL: URL): string {
  const agentBlocks = AI_CRAWLER_AGENTS.map((agent) => `User-agent: ${agent}\nAllow: /`).join('\n\n');
  return `User-agent: *
Allow: /

${agentBlocks}

Sitemap: ${sitemapURL.href}
`;
}

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(buildRobotsTxt(sitemapURL), {
    headers: { 'Content-Type': 'text/plain' },
  });
};

export { buildRobotsTxt };
