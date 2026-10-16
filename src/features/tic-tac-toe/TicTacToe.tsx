'use client';

import { useEffect, useRef, useState } from 'react';

import { TicTacToe as Game, TDifficulty, TMark } from '@domain/game/ticTacToe';

import Label from '@ui/atoms/typography/Label';

import { useIsomorphicLayoutEffect } from '@utils/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@utils/hooks/usePrefersReducedMotion';

import Board from './Board';
import classes from './TicTacToe.module.scss';
import { boardsThatFit, nearestGridOffset } from './utils';

const HUMAN: TMark = 'x';
const AI: TMark = 'o';

const AI_MOVE_DELAY = 380;
const DEMO_MOVE_DELAY = 2000;
const DEMO_END_PAUSE = 2000;
const ERASE_DURATION = 2000;

const MAX_BOARDS = 3;
const FALLBACK_CELL = 42;
const IDLE_TIMEOUT = 10000;
const RESTART_DELAY = 2000;

const DIFFICULTIES: readonly TDifficulty[] = ['easy', 'medium', 'hard'];

function pickDifficulty(): TDifficulty {
  return DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
}

type TSlot = { game: Game; difficulty: TDifficulty; erasing?: boolean };

function freshSlot(): TSlot {
  return { game: new Game(), difficulty: pickDifficulty() };
}

export default function TicTacToe() {
  const reducedMotion = usePrefersReducedMotion();
  const [mode, setMode] = useState<'demo' | 'user'>('demo');
  const [capacity, setCapacity] = useState(MAX_BOARDS);

  const [slots, setSlots] = useState<TSlot[]>(() => [freshSlot()]);
  const demoRef = useRef<{ slots: TSlot[]; activeIndex: number }>({ slots, activeIndex: 0 });
  const capacityRef = useRef(capacity);

  const [userGame, setUserGame] = useState(() => new Game());
  const [userDifficulty, setUserDifficulty] = useState<TDifficulty>('medium');
  const [showRestart, setShowRestart] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const anchor = anchorRef.current;
    if (!root || !anchor) return undefined;

    const measure = (): void => {
      root.style.transform = 'none';
      const cell = parseFloat(getComputedStyle(root).getPropertyValue('--surface-grid-cell')) || FALLBACK_CELL;

      const rect = anchor.getBoundingClientRect();
      const dx = nearestGridOffset(rect.left + window.scrollX, cell);
      const dy = nearestGridOffset(rect.top + window.scrollY, cell);
      root.style.transform = `translate(${dx}px, ${dy}px)`;
      root.style.opacity = '1';

      const container = root.parentElement;
      if (container) {
        const available = container.clientWidth - (rect.left - container.getBoundingClientRect().left);
        const fit = boardsThatFit(available, cell, MAX_BOARDS);
        setCapacity((prev) => (prev === fit ? prev : fit));
      }
    };

    measure();

    let cancelled = false;
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    document.fonts?.ready
      .then(() => {
        if (!cancelled) measure();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [mode]);

  useEffect(() => {
    capacityRef.current = capacity;
  }, [capacity]);

  useEffect(() => {
    if (mode !== 'demo' || reducedMotion) return undefined;

    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;

    const state = demoRef.current;

    const commit = (): void => setSlots(state.slots.slice());

    const advance = (): void => {
      const cap = Math.max(1, capacityRef.current);
      if (state.slots.length > cap) {
        state.slots = state.slots.slice(0, cap);
        state.activeIndex = Math.min(state.activeIndex, cap - 1);
        commit();
      }

      const active = state.slots[state.activeIndex];
      if (!active) return;

      if (!active.game.isOver) {
        timer = setTimeout(() => {
          if (stopped) return;
          state.slots[state.activeIndex] = { ...active, game: active.game.play(active.game.chooseMove(active.difficulty)) };
          commit();
          advance();
        }, DEMO_MOVE_DELAY);
        return;
      }

      if (state.slots.length < cap) {
        timer = setTimeout(() => {
          if (stopped) return;
          state.slots = [...state.slots, freshSlot()];
          state.activeIndex = state.slots.length - 1;
          commit();
          advance();
        }, DEMO_END_PAUSE);
        return;
      }

      const eraseIndex = (state.activeIndex + 1) % state.slots.length;
      timer = setTimeout(() => {
        if (stopped) return;
        state.slots[eraseIndex] = { ...state.slots[eraseIndex], erasing: true };
        commit();

        timer = setTimeout(() => {
          if (stopped) return;
          state.slots[eraseIndex] = freshSlot();
          state.activeIndex = eraseIndex;
          commit();
          advance();
        }, ERASE_DURATION);
      }, DEMO_END_PAUSE);
    };

    advance();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [mode, reducedMotion]);

  useEffect(() => {
    if (mode !== 'user' || userGame.isOver || userGame.currentPlayer !== AI) return undefined;

    const timer = setTimeout(() => {
      setUserGame((current) =>
        current.isOver || current.currentPlayer !== AI ? current : current.play(current.chooseMove(userDifficulty)),
      );
    }, AI_MOVE_DELAY);

    return () => clearTimeout(timer);
  }, [mode, userGame, userDifficulty]);

  useEffect(() => {
    const inProgress = !userGame.isOver && userGame.board.some((cell) => cell !== null);
    if (mode !== 'user' || inProgress) return undefined;

    const timer = setTimeout(() => {
      demoRef.current = { slots: [freshSlot()], activeIndex: 0 };
      setSlots(demoRef.current.slots);
      setMode('demo');
    }, IDLE_TIMEOUT);

    return () => clearTimeout(timer);
  }, [mode, userGame]);

  useEffect(() => {
    if (mode !== 'user' || !userGame.isOver) return undefined;

    const timer = setTimeout(() => setShowRestart(true), RESTART_DELAY);
    return () => clearTimeout(timer);
  }, [mode, userGame]);

  const startUserGame = (): void => {
    setUserDifficulty(pickDifficulty());
    setUserGame(new Game());
    setShowRestart(false);
    setMode('user');
  };

  const resetUserGame = (): void => {
    setUserDifficulty(pickDifficulty());
    setUserGame(new Game());
    setShowRestart(false);
  };

  const handleCellClick = (index: number): void => {
    setUserGame((current) => (current.currentPlayer === HUMAN ? current.play(index) : current));
  };

  const winner = userGame.winner;
  const outcome = winner ? (winner.mark === HUMAN ? 'Вы выиграли' : 'Компьютер выиграл') : userGame.isDraw ? 'Ничья' : '';
  const restartNotice = userGame.isDraw ? (
    <>
      ничья,
      <br />
      заново?
    </>
  ) : (
    'Заново?'
  );

  if (mode === 'demo') {
    return (
      <div className={classes.tic_tac_toe} ref={rootRef}>
        <div
          className={classes.tic_tac_toe__demo}
          ref={anchorRef}
          role='button'
          tabIndex={0}
          aria-label='Сыграть в крестики-нолики'
          onClick={startUserGame}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') startUserGame();
          }}
        >
          {slots.map((slot, index) => (
            <Board
              key={index}
              cells={slot.game.board}
              winningLine={slot.game.winner?.line ?? null}
              disabled
              erasing={slot.erasing}
              notice={slot.game.isDraw ? 'Ничья' : undefined}
            />
          ))}
        </div>

        <Label variant='eyebrow' className={classes.tic_tac_toe__hint}>
          Сыграйте против ИИ
        </Label>
      </div>
    );
  }

  return (
    <div className={classes.tic_tac_toe} ref={rootRef}>
      <div className={classes.tic_tac_toe__board} ref={anchorRef}>
        <Board
          cells={userGame.board}
          winningLine={winner?.line ?? null}
          disabled={userGame.isOver || userGame.currentPlayer === AI}
          notice={showRestart ? restartNotice : undefined}
          onNoticeClick={resetUserGame}
          onCellClick={handleCellClick}
        />
      </div>

      <Label variant='eyebrow' aria-hidden className={classes.tic_tac_toe__hint_hidden}>
        Сыграйте против ИИ
      </Label>

      <span role='status' aria-live='polite' className={classes.tic_tac_toe__status}>
        {outcome}
      </span>
    </div>
  );
}
