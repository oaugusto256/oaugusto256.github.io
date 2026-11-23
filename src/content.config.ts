import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  // One file per locale: src/content/work/<slug>/<locale>.mdx → id "<slug>/<locale>"
  loader: glob({ pattern: '*/*.mdx', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      role: z.string(),
      period: z.string(),
      stack: z.array(z.string()),
      links: z.array(z.object({ label: z.string(), url: z.url() })),
      cover: image(),
      coverAlt: z.string(),
      order: z.number().int(),
      locale: z.enum(['en', 'pt']),
    }),
});

export const collections = { work };
