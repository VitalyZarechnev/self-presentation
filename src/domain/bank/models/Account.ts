import z from 'zod';

export const AccountSchema = z.object({
  bank: z.string(),
  holder: z.string(),
  cardLast4: z.string(),
  balance: z.number(),
  cardFrozen: z.boolean(),
  insured: z.boolean(),
});

export type TAccount = z.infer<typeof AccountSchema>;
