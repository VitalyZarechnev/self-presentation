'use client';

import { useLocalized } from '@application/locale/LocaleProvider';

import { contactList } from '@domain/contacts/contactList';

import ActionButton from '@ui/atoms/action-button/ActionButton';
import Label from '@ui/atoms/typography/Label';
import ArrowRightIcon from '@ui/icons/arrow-right.svg';

import classes from './Contacts.module.scss';

const TELEGRAM_HREF = 'https://t.me/VitalyZarechnev';
const CTA = { ru: 'Написать в Telegram', en: 'Message me on Telegram' } as const;

export default function Contacts() {
  const cta = useLocalized(CTA);

  return (
    <div className={classes.contacts}>
      <ul className={classes.contacts__list}>
        {contactList.map((contact) => (
          <li key={contact.id}>
            <a
              className={classes.contacts__item}
              href={contact.href}
              {...(contact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <Label variant='channel' className={classes.contacts__channel}>
                {contact.channel}
              </Label>
              <Label variant='value' className={classes.contacts__value}>
                {contact.value}
              </Label>
            </a>
          </li>
        ))}
      </ul>

      <ActionButton className={classes.contacts__cta} href={TELEGRAM_HREF} variant='primary' target='_blank' rel='noopener noreferrer'>
        {cta}
        <ArrowRightIcon className={classes.contacts__cta_icon} aria-hidden />
      </ActionButton>
    </div>
  );
}
