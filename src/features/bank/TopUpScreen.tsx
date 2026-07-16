import { useState } from 'react';

import { formatMoney } from './format';
import classes from './TopUpScreen.module.scss';
import { describeSource, formatDetail, TOPUP_SOURCES, TTopUpSource, validateDetail } from './topupSources';
import { TScreenProps } from './types';
import PresetChips from './ui/PresetChips';
import PrimaryButton from './ui/PrimaryButton';
import ScreenHead from './ui/ScreenHead';
import SuccessView from './ui/SuccessView';
import TextField from './ui/TextField';

const PRESETS = [1000, 5000, 20000];

export default function TopUpScreen({ actions, navigate }: TScreenProps) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<TTopUpSource>(TOPUP_SOURCES[0]);
  const [detail, setDetail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ amount: number; source: string } | null>(null);

  if (done) {
    return (
      <>
        <ScreenHead title='Пополнение' />
        <SuccessView title='Счёт пополнен' subtitle={`${formatMoney(done.amount)} · ${done.source}`} onDone={() => navigate('home')} />
      </>
    );
  }

  const submit = (): void => {
    const value = Number(amount);
    if (!value || value <= 0) {
      setError('Введите сумму больше нуля');
      return;
    }
    const detailError = validateDetail(source, detail);
    if (detailError) {
      setError(detailError);
      return;
    }
    const described = describeSource(source, detail);
    actions.topUp(value, described);
    setDone({ amount: value, source: described });
  };

  return (
    <>
      <ScreenHead title='Пополнение' onBack={() => navigate('home')} />
      <div className={classes.form}>
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
        <PresetChips
          label='Источник'
          options={TOPUP_SOURCES.map((item) => item.label)}
          value={source.label}
          onSelect={(option) => {
            const next = TOPUP_SOURCES.find((item) => item.label === option);
            if (!next) return;
            setSource(next);
            setDetail('');
            setError(null);
          }}
        />
        <TextField
          label={source.fieldLabel}
          value={detail}
          inputMode={source.inputMode}
          placeholder={source.placeholder}
          onChange={(value) => {
            setDetail(formatDetail(source, value));
            setError(null);
          }}
        />
        {error && <p className={classes.error}>{error}</p>}
        <PrimaryButton onClick={submit}>Пополнить</PrimaryButton>
      </div>
    </>
  );
}
