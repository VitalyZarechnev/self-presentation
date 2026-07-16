import ArrowBack from '@ui/icons/arrow-back.svg';

import classes from './ScreenHead.module.scss';

export default function ScreenHead({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className={classes.head}>
      {onBack && (
        <button className={classes.back} onClick={onBack} aria-label='Назад'>
          <ArrowBack />
        </button>
      )}
      <span className={classes.title}>{title}</span>
    </div>
  );
}
