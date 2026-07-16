import { PropsWithChildren } from 'react';

import classes from './PrimaryButton.module.scss';

export default function PrimaryButton({ onClick, children }: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button className={classes.primary} onClick={onClick}>
      {children}
    </button>
  );
}
