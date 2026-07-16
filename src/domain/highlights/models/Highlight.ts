import { z } from 'zod';

export const highlightSchema = z.object({
  id: z.string(),
  value: z.string(),
  label: z.string(),
});

export type THighlight = z.infer<typeof highlightSchema>;
