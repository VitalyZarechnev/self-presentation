import { formatChange, formatPrice, formatTime } from './format';

describe('market format', () => {
  test('formatTime pads hours, minutes and seconds', () => {
    const date = new Date(2026, 0, 1, 7, 5, 9);
    expect(formatTime(date.getTime())).toBe('07:05:09');
  });

  test('formatChange signs positive and negative changes', () => {
    expect(formatChange(0.1234)).toBe('+0.12%');
    expect(formatChange(0)).toBe('+0.00%');
    expect(formatChange(-1.5)).toBe('-1.50%');
  });

  test('formatPrice shows a dash before the first trade', () => {
    expect(formatPrice(0)).toBe('—');
    expect(formatPrice(64123.456)).toBe('64123.5');
  });
});
