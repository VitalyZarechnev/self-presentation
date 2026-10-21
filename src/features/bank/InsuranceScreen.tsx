import { INSURANCE_PREMIUM } from '@domain/bank/operations';

import Shield from '@ui/icons/shield.svg';

import { useBankCopy } from './copy';
import { formatMoney } from './format';
import classes from './InsuranceScreen.module.scss';
import { TScreenProps } from './types';
import Badge from './ui/Badge';
import PrimaryButton from './ui/PrimaryButton';
import ScreenHead from './ui/ScreenHead';

export default function InsuranceScreen({ state, actions }: TScreenProps) {
  const insured = state.account.insured;
  const copy = useBankCopy();
  const t = copy.insurance;

  return (
    <>
      <ScreenHead title={t.title} />

      <div className={classes.insHero}>
        <span className={classes.insHeroIcon}>
          <Shield />
        </span>
        <p className={classes.insHeroTitle}>{t.heroTitle}</p>
        <p className={classes.insHeroSub}>{t.text}</p>
        <Badge className={classes.heroBadge}>
          {formatMoney(INSURANCE_PREMIUM, copy.intl)} {t.perYear}
        </Badge>
        {insured ? (
          <div className={classes.insActive}>
            <svg viewBox='0 0 24 24' fill='none' aria-hidden>
              <path d='M5 12.5l4.5 4.5L19 7.5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            {t.active}
          </div>
        ) : (
          <PrimaryButton onClick={actions.insure}>{t.buy}</PrimaryButton>
        )}
      </div>

      <p className={classes.subTitle}>{t.others}</p>
      <div className={classes.product}>
        <span>{t.travel}</span>
        <Badge variant='muted'>{t.soon}</Badge>
      </div>
      <div className={classes.product}>
        <span>{t.cardCover}</span>
        <Badge variant='muted'>{t.soon}</Badge>
      </div>
    </>
  );
}
