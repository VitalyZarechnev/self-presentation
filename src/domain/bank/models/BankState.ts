import z from 'zod';

import { AccountSchema } from './Account';
import { TransactionSchema } from './Transaction';

export const BankStateSchema = z.object({
  account: AccountSchema,
  transactions: z.array(TransactionSchema),
});

export type TBankState = z.infer<typeof BankStateSchema>;
