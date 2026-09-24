import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Projects are markdown files so Decap CMS can edit them in the repo.
 *
 * A project always renders as a card on the home page. Setting `detailPage`
 * also generates /projects/<slug> from the file's body, which is how some
 * projects get a full case study and others stay a card.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    /** Lower sorts first on the home page. */
    order: z.number().default(50),
    type: z.string(),
    status: z.string(),
    /**
     * Selects a --layer-* colour token, so the card tint names the layer of
     * the AI system the work sits in. Must match a token in global.css.
     */
    layer: z.enum(['agents', 'retrieval', 'safety', 'controls', 'data', 'workflows']),
    outcome: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    /** External link, used when there is no detail page. */
    link: z.string().optional(),
    linkLabel: z.string().optional(),
    /** Generate /projects/<slug> from this file's body. */
    detailPage: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
