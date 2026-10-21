export type TTopUpSource = {
  id: 'card' | 'sbp' | 'account';
  placeholder: string;
  inputMode: 'numeric' | 'tel';
};

export const TOPUP_SOURCES: readonly TTopUpSource[] = [
  { id: 'card', placeholder: '0000 0000 0000 0000', inputMode: 'numeric' },
  { id: 'sbp', placeholder: '+7 900 000-00-00', inputMode: 'tel' },
  { id: 'account', placeholder: '40817 810 0000 0000000', inputMode: 'numeric' },
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

export function isDetailValid(source: TTopUpSource, detail: string): boolean {
  const digits = detail.replace(/\D/g, '');
  if (source.id === 'card') return digits.length === 16;
  if (source.id === 'sbp') return digits.length >= 10;
  return digits.length >= 5;
}

export function describeSource(source: TTopUpSource, label: string, detail: string): string {
  if (source.id === 'sbp') return `${label} · ${detail.trim()}`;
  const digits = detail.replace(/\D/g, '');
  return `${label} ···· ${digits.slice(-4)}`;
}
