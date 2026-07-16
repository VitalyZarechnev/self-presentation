import { createBankState } from '@data/bank/mock-factories/bankState';

import { IBankDatasource } from '@domain/bank/datasources/IBankDatasource';
import { BankStateSchema, TBankState } from '@domain/bank/models/BankState';

import { createModel } from '@utils/model';

export class BankDatasourceImpl implements IBankDatasource {
  getState(): TBankState {
    return createModel(BankStateSchema, createBankState());
  }
}
