import { ReactNode } from 'react';

import classes from './QuickAction.module.scss';

type TProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
};

export default function QuickAction({ icon, label, onClick }: TProps) {
  return (
    <button className={classes.action} onClick={onClick}>
      <span className={classes.icon}>{icon}</span>
      {label}
    </button>
  );
}
