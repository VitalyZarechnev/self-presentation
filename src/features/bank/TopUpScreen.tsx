import { useState } from 'react';

import { useBankCopy } from './copy';
import { formatMoney } from './format';
import classes from './TopUpScreen.module.scss';
import { describeSource, formatDetail, isDetailValid, TOPUP_SOURCES, TTopUpSource } from './topupSources';
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
  const copy = useBankCopy();
  const t = copy.topUp;
  const sourceCopy = t.sources[source.id];

  if (done) {
    return (
      <>
        <ScreenHead title={t.title} />
        <SuccessView title={t.done} subtitle={`${formatMoney(done.amount, copy.intl)} · ${done.source}`} onDone={() => navigate('home')} />
      </>
    );
  }

  const submit = (): void => {
    const value = Number(amount);
    if (!value || value <= 0) {
      setError(copy.errors.amount);
      return;
    }
    if (!isDetailValid(source, detail)) {
      setError(t.detailErrors[source.id]);
      return;
    }
    const described = describeSource(source, sourceCopy.label, detail);
    actions.topUp(value, described);
    setDone({ amount: value, source: described });
  };

  return (
    <>
      <ScreenHead title={t.title} onBack={() => navigate('home')} />
      <div className={classes.form}>
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
        <PresetChips
          label={t.source}
          options={TOPUP_SOURCES.map((item) => t.sources[item.id].label)}
          value={sourceCopy.label}
          onSelect={(option) => {
            const next = TOPUP_SOURCES.find((item) => t.sources[item.id].label === option);
            if (!next) return;
            setSource(next);
            setDetail('');
            setError(null);
          }}
        />
        <TextField
          label={sourceCopy.field}
          value={detail}
          inputMode={source.inputMode}
          placeholder={source.placeholder}
          onChange={(value) => {
            setDetail(formatDetail(source, value));
            setError(null);
          }}
        />
        {error && <p className={classes.error}>{error}</p>}
        <PrimaryButton onClick={submit}>{t.submit}</PrimaryButton>
      </div>
    </>
  );
}
