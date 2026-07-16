import z from 'zod';

export const TransactionCategorySchema = z.enum(['income', 'transfer', 'cafe', 'transport', 'shopping', 'utilities', 'insurance']);

export type TTransactionCategory = z.infer<typeof TransactionCategorySchema>;

export const TransactionSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: TransactionCategorySchema,
  amount: z.number(),
  timestamp: z.number(),
});

export type TTransaction = z.infer<typeof TransactionSchema>;
