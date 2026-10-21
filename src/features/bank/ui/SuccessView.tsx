import { useBankCopy } from '../copy';
import PrimaryButton from './PrimaryButton';
import classes from './SuccessView.module.scss';

export default function SuccessView({ title, subtitle, onDone }: { title: string; subtitle: string; onDone: () => void }) {
  const copy = useBankCopy();

  return (
    <div className={classes.success}>
      <span className={classes.check}>
        <svg viewBox='0 0 24 24' fill='none' aria-hidden>
          <path d='M5 12.5l4.5 4.5L19 7.5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </span>
      <p className={classes.title}>{title}</p>
      <p className={classes.subtitle}>{subtitle}</p>
      <PrimaryButton onClick={onDone}>{copy.done}</PrimaryButton>
    </div>
  );
}
