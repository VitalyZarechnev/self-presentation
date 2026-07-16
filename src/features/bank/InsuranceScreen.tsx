import { INSURANCE_PREMIUM } from '@domain/bank/operations';

import Shield from '@ui/icons/shield.svg';

import { formatMoney } from './format';
import classes from './InsuranceScreen.module.scss';
import { TScreenProps } from './types';
import Badge from './ui/Badge';
import PrimaryButton from './ui/PrimaryButton';
import ScreenHead from './ui/ScreenHead';

export default function InsuranceScreen({ state, actions }: TScreenProps) {
  const insured = state.account.insured;

  const insurancetext =
    'Делаете взнос и Вы уже клиент страховой фирмы Альбатрос.\nДвадцать тысяч в год — полный комплект в пакете: Травмы, болезни и даже смерть';

  return (
    <>
      <ScreenHead title='Страхование' />

      <div className={classes.insHero}>
        <span className={classes.insHeroIcon}>
          <Shield />
        </span>
        <p className={classes.insHeroTitle}>Страхование здоровья</p>
        <p className={classes.insHeroSub}>{insurancetext}</p>
        <Badge className={classes.heroBadge}>{formatMoney(INSURANCE_PREMIUM)} в год</Badge>
        {insured ? (
          <div className={classes.insActive}>
            <svg viewBox='0 0 24 24' fill='none' aria-hidden>
              <path d='M5 12.5l4.5 4.5L19 7.5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            Подключено
          </div>
        ) : (
          <PrimaryButton onClick={actions.insure}>Оформить в один клик</PrimaryButton>
        )}
      </div>

      <p className={classes.subTitle}>Другие продукты</p>
      <div className={classes.product}>
        <span>Страхование путешествий</span>
        <Badge variant='muted'>скоро</Badge>
      </div>
      <div className={classes.product}>
        <span>Страхование карты</span>
        <Badge variant='muted'>скоро</Badge>
      </div>
    </>
  );
}
