import { useState } from 'react';

import { TBankError, validateTransfer } from '@domain/bank/operations';

import { useBankCopy } from './copy';
import { formatMoney } from './format';
import classes from './TransferScreen.module.scss';
import { TScreenProps } from './types';
import PresetChips from './ui/PresetChips';
import PrimaryButton from './ui/PrimaryButton';
import ScreenHead from './ui/ScreenHead';
import SuccessView from './ui/SuccessView';
import TextField from './ui/TextField';

const PRESETS = [500, 1000, 5000];

export default function TransferScreen({ state, actions, navigate }: TScreenProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<TBankError | null>(null);
  const [done, setDone] = useState<{ amount: number; recipient: string } | null>(null);
  const copy = useBankCopy();
  const t = copy.transfer;

  if (done) {
    return (
      <>
        <ScreenHead title={t.title} />
        <SuccessView
          title={t.sent}
          subtitle={`${formatMoney(done.amount, copy.intl)} · ${done.recipient}`}
          onDone={() => navigate('home')}
        />
      </>
    );
  }

  const submit = (): void => {
    const value = Number(amount);
    const err = validateTransfer(state, recipient, value);
    if (err) {
      setError(err);
      return;
    }
    actions.transfer(recipient, value);
    setDone({ amount: value, recipient: recipient.trim() });
  };

  return (
    <>
      <ScreenHead title={t.title} onBack={() => navigate('home')} />
      <div className={classes.form}>
        <TextField
          label={t.recipient}
          value={recipient}
          placeholder={t.recipientPlaceholder}
          onChange={(value) => {
            setRecipient(value);
            setError(null);
          }}
        />
        <TextField
          label={t.amount}
          value={amount}
          inputMode='numeric'
          placeholder='0 ₽'
          onChange={(value) => {
            setAmount(value.replace(/\D/g, ''));
            setError(null);
          }}
        />
        <PresetChips
          options={PRESETS}
          format={(preset) => Number(preset).toLocaleString(copy.intl)}
          onSelect={(preset) => {
            setAmount(String(preset));
            setError(null);
          }}
        />
        <p className={classes.hint}>
          {t.available} {formatMoney(state.account.balance, copy.intl)}
        </p>
        {error && <p className={classes.error}>{copy.errors[error]}</p>}
        <PrimaryButton onClick={submit}>{t.submit}</PrimaryButton>
      </div>
    </>
  );
}
