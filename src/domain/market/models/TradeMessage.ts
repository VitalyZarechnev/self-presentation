import z from 'zod';

export const TradeMessageSchema = z.object({
  e: z.literal('trade'),
  p: z.string(),
  q: z.string(),
  T: z.number(),
  m: z.boolean(),
});

export type TTradeMessage = z.infer<typeof TradeMessageSchema>;
