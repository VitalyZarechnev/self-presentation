import { contactList } from '@domain/contacts/contactList';

import ActionButton from '@ui/atoms/action-button/ActionButton';
import Label from '@ui/atoms/typography/Label';

import classes from './Contacts.module.scss';

const TELEGRAM_HREF = 'https://t.me/VitalyZarechnev';

export default function Contacts() {
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
        Написать в Telegram →
      </ActionButton>
    </div>
  );
}
