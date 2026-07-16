export type TTopUpSource = {
  id: 'card' | 'sbp' | 'account';
  label: string;
  fieldLabel: string;
  placeholder: string;
  inputMode: 'numeric' | 'tel';
};

export const TOPUP_SOURCES: readonly TTopUpSource[] = [
  { id: 'card', label: 'Другая карта', fieldLabel: 'Номер карты', placeholder: '0000 0000 0000 0000', inputMode: 'numeric' },
  { id: 'sbp', label: 'СБП', fieldLabel: 'Телефон', placeholder: '+7 900 000-00-00', inputMode: 'tel' },
  { id: 'account', label: 'Другой счёт', fieldLabel: 'Номер счёта', placeholder: '40817 810 0000 0000000', inputMode: 'numeric' },
];

export function formatDetail(source: TTopUpSource, raw: string): string {
  if (source.id === 'card') {
    return raw
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, '$1 ');
  }
  if (source.id === 'account') {
    return raw.replace(/\D/g, '').slice(0, 20);
  }
  return raw.replace(/[^\d+\-\s()]/g, '');
}

export function validateDetail(source: TTopUpSource, detail: string): string | null {
  const digits = detail.replace(/\D/g, '');
  if (source.id === 'card') return digits.length === 16 ? null : 'Введите 16 цифр карты';
  if (source.id === 'sbp') return digits.length >= 10 ? null : 'Введите номер телефона';
  return digits.length >= 5 ? null : 'Введите номер счёта';
}

export function describeSource(source: TTopUpSource, detail: string): string {
  if (source.id === 'sbp') return `СБП · ${detail.trim()}`;
  const digits = detail.replace(/\D/g, '');
  return `${source.label} ···· ${digits.slice(-4)}`;
}
