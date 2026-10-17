import { z } from 'zod';

export const siteAspectSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  points: z.array(z.string()),
  code: z.object({
    file: z.string(),
    source: z.string(),
  }),
});

export type TSiteAspect = z.infer<typeof siteAspectSchema>;
