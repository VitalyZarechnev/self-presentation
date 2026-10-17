import { Fragment } from 'react';

import classes from './InlineCode.module.scss';

type TProps = {
  text: string;
};

export default function InlineCode(props: TProps) {
  const { text } = props;
  const parts = text.split('`');

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <code key={index} className={classes.code}>
            {part}
          </code>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}
