// src/pages/llms-full.txt.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../data/site';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site!.href.replace(/\/$/, '');
  const workEn = await getCollection('workEn');
  const sorted = [...workEn].sort((a, b) => a.data.order - b.data.order);

  const sections: string[] = [];
  for (const entry of sorted) {
    // entry.body is the raw, unparsed Markdown source from the glob() loader
    // (retainBody defaults to true — see src/content.config.ts). We inline it
    // as-is since this is a plain-text file for AI agents, not rendered HTML.
    const header = `## ${entry.data.title}\n\n${entry.data.summary}\n\n${entry.data.metrics
      .map((m) => `- ${m.label}: ${m.value}`)
      .join('\n')}\n\nFull page: ${baseUrl}/en/work/${entry.id}/`;
    const rawBody = entry.body?.trim();
    sections.push(rawBody ? `${header}\n\n${rawBody}` : header);
  }

  const body = `# ${siteConfig.name.en} — full reference\n\n${sections.join('\n\n---\n\n')}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
