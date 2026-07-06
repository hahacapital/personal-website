import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const workSchema = z.object({
  title: z.string(),
  summary: z.string(),
  order: z.number(),
  metrics: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .default([]),
  updatedDate: z.coerce.date(),
});

const workZh = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work/zh' }),
  schema: workSchema,
});

const workEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work/en' }),
  schema: workSchema,
});

export const collections = { workZh, workEn };
