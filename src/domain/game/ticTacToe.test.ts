import { describe, expect, it } from 'vitest';

import { TBoard, TicTacToe } from './ticTacToe';

describe('TicTacToe', () => {
  it('starts empty with X to move', () => {
    const game = new TicTacToe();

    expect(game.currentPlayer).toBe('x');
    expect(game.availableMoves).toHaveLength(9);
    expect(game.isOver).toBe(false);
  });

  it('alternates players and stays immutable', () => {
    const game = new TicTacToe();
    const next = game.play(0);

    expect(next.board[0]).toBe('x');
    expect(next.currentPlayer).toBe('o');
    expect(game.board[0]).toBeNull();
  });

  it('detects a winner on a directly built board', () => {
    const board: TBoard = ['x', 'x', 'x', 'o', 'o', null, null, null, null];

    expect(new TicTacToe(board).winner).toEqual({ mark: 'x', line: [0, 1, 2] });
  });

  it('detects the winning line completed by the last played move', () => {
    const game = new TicTacToe().play(0).play(3).play(1).play(4).play(2);

    expect(game.winner).toEqual({ mark: 'x', line: [0, 1, 2] });
    expect(game.isOver).toBe(true);
  });

  it('detects a draw', () => {
    const game = new TicTacToe(['x', 'o', 'x', 'x', 'o', 'o', 'o', 'x', 'x']);

    expect(game.winner).toBeNull();
    expect(game.isDraw).toBe(true);
    expect(game.isOver).toBe(true);
  });

  it('ignores plays on taken cells', () => {
    const game = new TicTacToe().play(0);

    expect(game.play(0)).toBe(game);
  });

  describe('chooseMove', () => {
    it('easy picks an available cell', () => {
      const game = new TicTacToe().play(0).play(4);

      expect(game.availableMoves).toContain(game.chooseMove('easy'));
    });

    it('medium takes an immediate win', () => {
      const game = new TicTacToe(['x', 'x', null, 'o', 'o', null, null, null, null]);

      expect(game.currentPlayer).toBe('x');
      expect(game.chooseMove('medium')).toBe(2);
    });

    it('medium blocks the opponent', () => {
      const game = new TicTacToe(['x', 'x', null, null, 'o', null, null, null, null]);

      expect(game.currentPlayer).toBe('o');
      expect(game.chooseMove('medium')).toBe(2);
    });

    it('hard never loses against every X line (X first, O optimal)', () => {
      const assertNeverLoses = (game: TicTacToe): void => {
        if (game.winner) {
          expect(game.winner.mark).not.toBe('x');
          return;
        }
        if (game.isOver) return;

        if (game.currentPlayer === 'o') {
          assertNeverLoses(game.play(game.chooseMove('hard')));
          return;
        }

        game.availableMoves.forEach((index) => assertNeverLoses(game.play(index)));
      };

      assertNeverLoses(new TicTacToe());
    });
  });
});
