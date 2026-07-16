import { z } from 'zod';

export const skillGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(z.string()),
});

export type TSkillGroup = z.infer<typeof skillGroupSchema>;
