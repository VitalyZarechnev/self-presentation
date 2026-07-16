import { z } from 'zod';

export const experiencePointSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31).optional(),
});

export type TExperiencePoint = z.infer<typeof experiencePointSchema>;

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  location: z.string().optional(),
  start: experiencePointSchema,
  end: experiencePointSchema.nullable(),
  officialFrom: experiencePointSchema.optional(),
  stack: z.array(z.string()),
  achievements: z.array(z.string()).optional(),
});

export type TExperience = z.infer<typeof experienceSchema>;
