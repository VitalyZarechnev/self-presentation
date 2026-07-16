import { z } from 'zod';

export const contactSchema = z.object({
  id: z.string(),
  channel: z.string(),
  value: z.string(),
  href: z.string(),
  external: z.boolean().optional(),
});

export type TContact = z.infer<typeof contactSchema>;
