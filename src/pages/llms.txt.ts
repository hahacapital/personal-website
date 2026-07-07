// src/pages/llms.txt.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { siteConfig } from '../data/site';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site!.href.replace(/\/$/, '');
  const workEn = await getCollection('workEn');
  const sorted = [...workEn].sort((a, b) => a.data.order - b.data.order);

  const caseLines = sorted
    .map((entry) => `- [${entry.data.title}](${baseUrl}/en/work/${entry.id}/): ${entry.data.summary}`)
    .join('\n');

  const body = `# ${siteConfig.name.en}

> ${siteConfig.tagline.en}. Independent Forward Deployed Engineer shipping enterprise AI Agent systems to production, with a systematic investment/quant research background.

## Background

- Full profile: ${baseUrl}/en/about/
- Contact: ${baseUrl}/en/contact/ (email: ${siteConfig.email})

## Case studies

${caseLines}

## Resources

- Sitemap: ${baseUrl}/sitemap-index.xml
- GitHub: ${siteConfig.github}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
