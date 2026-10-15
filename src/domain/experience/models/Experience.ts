import { z } from 'zod';

export const experiencePointSchema = z.object({
  year: z.number().int(),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31).optional(),
});

export type TExperiencePoint = z.infer<typeof experiencePointSchema>;

export const experienceProjectSchema = z.object({
  name: z.string(),
  period: z.string().optional(),
  role: z.string().optional(),
  description: z.string(),
  stack: z.array(z.string()),
});

export type TExperienceProject = z.infer<typeof experienceProjectSchema>;

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
  projects: z.array(experienceProjectSchema).optional(),
});

export type TExperience = z.infer<typeof experienceSchema>;
