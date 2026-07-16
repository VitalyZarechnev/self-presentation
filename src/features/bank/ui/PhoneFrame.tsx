import { PropsWithChildren } from 'react';

import classes from './PhoneFrame.module.scss';

export default function PhoneFrame({ children }: PropsWithChildren) {
  return (
    <div className={classes.frame}>
      <div className={classes.island} aria-hidden />
      <div className={classes.screen}>
        <div className={classes.status}>
          <span>9:41</span>
          <span className={classes.statusRight} aria-hidden>
            <span className={classes.bars}>
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className={classes.net}>5G</span>
            <span className={classes.battery} />
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
