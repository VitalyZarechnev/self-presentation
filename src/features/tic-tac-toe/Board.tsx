import { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';

import Label from '@ui/atoms/typography/Label';

import classes from './Board.module.scss';
import { ERASER_CRUMBS, GRID_DRAW_STEP, GRID_LINES, winLinePath } from './boardGeometry';
import Mark, { TBoardCell } from './Mark';

type TProps = {
  cells: readonly TBoardCell[];
  winningLine?: readonly number[] | null;
  disabled?: boolean;
  erasing?: boolean;
  notice?: ReactNode;
  onNoticeClick?: () => void;
  onCellClick?: (index: number) => void;
  labels: { cell: string; x: string; o: string };
};

export default function Board(props: TProps) {
  const { cells, winningLine, disabled, erasing, notice, onNoticeClick, onCellClick, labels } = props;

  return (
    <div className={classes.board}>
      <svg className={clsx(classes.board__draw, erasing && classes.board__draw_erasing)} viewBox='0 0 300 300' aria-hidden>
        {GRID_LINES.map((d, index) => (
          <path
            key={d}
            className={classes.board__grid}
            d={d}
            pathLength={1}
            style={{ '--draw-delay': `${index * GRID_DRAW_STEP}s` } as CSSProperties}
          />
        ))}

        {cells.map((mark, index) => (mark ? <Mark key={index} mark={mark} index={index} erasing={erasing} /> : null))}

        {winningLine && winningLine.length >= 2 && <path className={classes.board__win} d={winLinePath(winningLine)} pathLength={1} />}
      </svg>

      {notice != null &&
        !erasing &&
        (onNoticeClick ? (
          <Label
            as='button'
            type='button'
            variant='notice'
            className={clsx(classes.board__draw_notice, classes.board__draw_notice_button)}
            onClick={onNoticeClick}
          >
            {notice}
          </Label>
        ) : (
          <Label variant='notice' className={classes.board__draw_notice}>
            {notice}
          </Label>
        ))}

      {erasing && (
        <div className={classes.board__erase} aria-hidden>
          <span className={classes.board__smudge} />
          <span className={classes.board__eraser} />
          {ERASER_CRUMBS.map((crumb, index) => (
            <span
              key={index}
              className={classes.board__crumb}
              style={
                {
                  left: `${crumb.left}%`,
                  top: `${crumb.top}%`,
                  width: crumb.size,
                  height: crumb.size,
                  '--crumb-dx': `${crumb.dx}px`,
                  '--crumb-dy': `${crumb.dy}px`,
                  '--crumb-delay': `${crumb.delay}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      <div className={classes.board__cells}>
        {cells.map((mark, index) => (
          <button
            key={index}
            type='button'
            className={classes.board__cell}
            aria-label={`${labels.cell} ${index + 1}${mark ? `, ${labels[mark]}` : ''}`}
            disabled={disabled || mark !== null}
            onClick={() => onCellClick?.(index)}
          />
        ))}
      </div>
    </div>
  );
}
