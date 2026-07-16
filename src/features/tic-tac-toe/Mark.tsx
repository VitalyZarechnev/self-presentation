import clsx from 'clsx';

import { cellTranslate, O_STROKE, X_STROKES } from './boardGeometry';
import classes from './Mark.module.scss';

export type TBoardMark = 'x' | 'o';
export type TBoardCell = TBoardMark | null;

const MARK_ERASE_STAGGER = 0.4;

type TProps = {
  mark: TBoardMark;
  index: number;
  erasing?: boolean;
};

export default function Mark(props: TProps) {
  const { mark, index, erasing } = props;

  const strokes = mark === 'x' ? X_STROKES : [O_STROKE];
  const row = Math.floor(index / 3);

  return (
    <g
      className={clsx(classes.mark, erasing && classes.mark_erasing)}
      transform={`translate(${cellTranslate(index)})`}
      style={erasing ? { animationDelay: `${row * MARK_ERASE_STAGGER}s` } : undefined}
    >
      {strokes.map((d, i) => (
        <path key={i} d={d} pathLength={1} />
      ))}
    </g>
  );
}
