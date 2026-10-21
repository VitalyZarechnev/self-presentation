import { PointerEvent as ReactPointerEvent, useRef } from 'react';
import clsx from 'clsx';

import { useLocale } from '@application/locale/LocaleProvider';

import Label from '@ui/atoms/typography/Label';

import classes from './Timeline.module.scss';

type TProps = {
  playing: boolean;
  progress: number;
  follow: boolean;
  tripTitle: string | null;
  currentTime: number | null;
  onTogglePlay: () => void;
  onToggleFollow: () => void;
  onScrub: (t: number) => void;
};

const DATE_FORMAT: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

const MESSAGES = {
  ru: {
    intl: 'ru-RU',
    pause: 'Пауза',
    play: 'Воспроизвести',
    unpin: 'Открепить камеру',
    follow: 'Следить за самолётом',
    track: 'Таймлайн поездок',
  },
  en: { intl: 'en-GB', pause: 'Pause', play: 'Play', unpin: 'Unpin the camera', follow: 'Follow the plane', track: 'Trips timeline' },
} as const;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export default function Timeline({ playing, progress, follow, tripTitle, currentTime, onTogglePlay, onToggleFollow, onScrub }: TProps) {
  const t = MESSAGES[useLocale().locale];
  const trackRef = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);

  const tFromEvent = (event: ReactPointerEvent<HTMLDivElement>): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    return clamp01((event.clientX - rect.left) / rect.width);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    scrubbing.current = true;
    trackRef.current?.setPointerCapture(event.pointerId);
    onScrub(tFromEvent(event));
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (scrubbing.current) onScrub(tFromEvent(event));
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>): void => {
    scrubbing.current = false;
    trackRef.current?.releasePointerCapture(event.pointerId);
  };

  const dateLabel = currentTime === null ? '—' : new Intl.DateTimeFormat(t.intl, DATE_FORMAT).format(currentTime);
  const percent = Math.round(clamp01(progress) * 100);

  return (
    <div className={classes.timeline}>
      <Label as='button' className={classes.timeline__play} onClick={onTogglePlay} aria-label={playing ? t.pause : t.play}>
        {playing ? '❚❚' : '▶'}
      </Label>

      <Label
        as='button'
        className={clsx(classes.timeline__play, follow && classes.timeline__play_on)}
        onClick={onToggleFollow}
        aria-label={follow ? t.unpin : t.follow}
        aria-pressed={follow}
      >
        ⌖
      </Label>

      <div className={classes.timeline__body}>
        <div className={classes.timeline__meta}>
          {tripTitle && <Label className={classes.timeline__trip}>{tripTitle}</Label>}
          <Label className={classes.timeline__date}>{dateLabel}</Label>
        </div>

        <div
          ref={trackRef}
          className={classes.timeline__track}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          role='slider'
          tabIndex={0}
          aria-label={t.track}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className={classes.timeline__fill} style={{ width: `${percent}%` }} />
          <div className={classes.timeline__knob} style={{ left: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}
