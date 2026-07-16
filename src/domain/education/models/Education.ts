import { z } from 'zod';

export const educationSchema = z.object({
  id: z.string(),
  year: z.number().int(),
  qualification: z.string(),
  institution: z.string(),
  field: z.string().optional(),
});

export type TEducation = z.infer<typeof educationSchema>;
