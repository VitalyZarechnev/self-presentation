import { TBankState } from '@domain/bank/models/BankState';

export interface IBankDatasource {
  getState(): TBankState;
}
