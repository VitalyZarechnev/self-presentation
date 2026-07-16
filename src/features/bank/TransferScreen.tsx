import { useState } from 'react';

import { validateTransfer } from '@domain/bank/operations';

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
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ amount: number; recipient: string } | null>(null);

  if (done) {
    return (
      <>
        <ScreenHead title='Перевод' />
        <SuccessView
          title='Перевод отправлен'
          subtitle={`${formatMoney(done.amount)} · ${done.recipient}`}
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
      <ScreenHead title='Перевод' onBack={() => navigate('home')} />
      <div className={classes.form}>
        <TextField
          label='Получатель'
          value={recipient}
          placeholder='Имя или телефон'
          onChange={(value) => {
            setRecipient(value);
            setError(null);
          }}
        />
        <TextField
          label='Сумма'
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
          format={(preset) => Number(preset).toLocaleString('ru-RU')}
          onSelect={(preset) => {
            setAmount(String(preset));
            setError(null);
          }}
        />
        <p className={classes.hint}>Доступно {formatMoney(state.account.balance)}</p>
        {error && <p className={classes.error}>{error}</p>}
        <PrimaryButton onClick={submit}>Перевести</PrimaryButton>
      </div>
    </>
  );
}
