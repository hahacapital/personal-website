// src/pages/llms-full.txt.ts
import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import { siteConfig } from '../data/site';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site!.href.replace(/\/$/, '');
  const workEn = await getCollection('workEn');
  const sorted = [...workEn].sort((a, b) => a.data.order - b.data.order);

  const sections: string[] = [];
  for (const entry of sorted) {
    const { Content } = await render(entry);
    void Content; // Content is a component, not usable in plain text; we render from data + raw body instead.
    sections.push(
      `## ${entry.data.title}\n\n${entry.data.summary}\n\n${entry.data.metrics
        .map((m) => `- ${m.label}: ${m.value}`)
        .join('\n')}\n\nFull page: ${baseUrl}/en/work/${entry.id}/`
    );
  }

  const body = `# ${siteConfig.name.en} — full reference\n\n${sections.join('\n\n---\n\n')}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
