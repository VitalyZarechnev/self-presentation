import { TContact } from './models/Contact';

export const contactList: readonly TContact[] = [
  {
    id: 'telegram',
    channel: 'Telegram',
    value: '@VitalyZarechnev',
    href: 'https://t.me/VitalyZarechnev',
    external: true,
  },
  {
    id: 'email',
    channel: 'Email',
    value: 'vitalyzarechnev@gmail.com',
    href: 'mailto:vitalyzarechnev@gmail.com',
  },
];
