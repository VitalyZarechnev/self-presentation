import ArrowBack from '@ui/icons/arrow-back.svg';

import { useBankCopy } from '../copy';
import classes from './ScreenHead.module.scss';

export default function ScreenHead({ title, onBack }: { title: string; onBack?: () => void }) {
  const copy = useBankCopy();

  return (
    <div className={classes.head}>
      {onBack && (
        <button className={classes.back} onClick={onBack} aria-label={copy.back}>
          <ArrowBack />
        </button>
      )}
      <span className={classes.title}>{title}</span>
    </div>
  );
}
