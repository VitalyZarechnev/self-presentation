export type TMark = 'x' | 'o';
export type TCell = TMark | null;
export type TBoard = readonly TCell[];
export type TLine = readonly [number, number, number];
export type TWinner = { mark: TMark; line: TLine };
export type TDifficulty = 'easy' | 'medium' | 'hard';

const CELL_COUNT = 9;
const WIN_SUM = 3;
const NO_MOVE = -1;

const WINNING_LINES: readonly TLine[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const LINES_THROUGH_CELL: readonly (readonly number[])[] = buildLinesThroughCell();

function buildLinesThroughCell(): number[][] {
  const table: number[][] = Array.from({ length: CELL_COUNT }, () => []);
  WINNING_LINES.forEach((line, lineId) => line.forEach((cell) => table[cell].push(lineId)));
  return table;
}

function markValue(cell: TCell): number {
  if (cell === 'x') return 1;
  if (cell === 'o') return -1;
  return 0;
}

function sumsFromBoard(board: TBoard): number[] {
  return WINNING_LINES.map((line) => line.reduce((sum, cell) => sum + markValue(board[cell]), 0));
}

function countMarks(board: TBoard): number {
  return board.filter((cell) => cell !== null).length;
}

function opponentOf(mark: TMark): TMark {
  return mark === 'x' ? 'o' : 'x';
}

export class TicTacToe {
  readonly board: TBoard;

  private readonly lineSums: readonly number[];

  private readonly moveCount: number;

  constructor(
    board: TBoard = new Array<TCell>(CELL_COUNT).fill(null),
    lineSums: readonly number[] = sumsFromBoard(board),
    moveCount: number = countMarks(board),
  ) {
    this.board = board;
    this.lineSums = lineSums;
    this.moveCount = moveCount;
  }

  get currentPlayer(): TMark {
    return this.moveCount % 2 === 0 ? 'x' : 'o';
  }

  get winner(): TWinner | null {
    for (let lineId = 0; lineId < WINNING_LINES.length; lineId += 1) {
      const sum = this.lineSums[lineId];
      if (sum === WIN_SUM) return { mark: 'x', line: WINNING_LINES[lineId] };
      if (sum === -WIN_SUM) return { mark: 'o', line: WINNING_LINES[lineId] };
    }
    return null;
  }

  get isDraw(): boolean {
    return this.winner === null && this.moveCount === CELL_COUNT;
  }

  get isOver(): boolean {
    return this.winner !== null || this.isDraw;
  }

  get availableMoves(): number[] {
    const moves: number[] = [];
    this.board.forEach((cell, index) => {
      if (cell === null) moves.push(index);
    });
    return moves;
  }

  canPlay(index: number): boolean {
    return !this.isOver && this.board[index] === null;
  }

  play(index: number): TicTacToe {
    if (!this.canPlay(index)) return this;

    const mark = this.currentPlayer;
    const nextBoard = this.board.slice();
    nextBoard[index] = mark;

    const delta = markValue(mark);
    const nextSums = this.lineSums.slice();
    for (const lineId of LINES_THROUGH_CELL[index]) {
      nextSums[lineId] += delta;
    }

    return new TicTacToe(nextBoard, nextSums, this.moveCount + 1);
  }

  chooseMove(difficulty: TDifficulty): number {
    if (this.isOver) return NO_MOVE;

    if (difficulty === 'easy') return this.randomMove();
    if (difficulty === 'medium') return this.tacticalMove();
    return this.optimalMove();
  }

  private randomMove(): number {
    const moves = this.availableMoves;
    return moves[Math.floor(Math.random() * moves.length)];
  }

  private tacticalMove(): number {
    const winningMove = this.findWinningMove(this.currentPlayer);
    if (winningMove !== null) return winningMove;

    const blockingMove = this.findWinningMove(opponentOf(this.currentPlayer));
    if (blockingMove !== null) return blockingMove;

    return this.randomMove();
  }

  private findWinningMove(mark: TMark): number | null {
    const target = mark === 'x' ? WIN_SUM - 1 : -(WIN_SUM - 1);

    for (let lineId = 0; lineId < WINNING_LINES.length; lineId += 1) {
      if (this.lineSums[lineId] !== target) continue;
      const empty = WINNING_LINES[lineId].find((cell) => this.board[cell] === null);
      if (empty !== undefined) return empty;
    }

    return null;
  }

  private optimalMove(): number {
    const player = this.currentPlayer;
    let bestIndex = this.availableMoves[0];
    let bestScore = -Infinity;

    for (const index of this.availableMoves) {
      const score = this.scoreFor(this.play(index), player, 1);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }

    return bestIndex;
  }

  private scoreFor(game: TicTacToe, player: TMark, depth: number): number {
    if (game.winner !== null) return game.winner.mark === player ? 10 - depth : depth - 10;
    if (game.isDraw) return 0;

    const scores = game.availableMoves.map((index) => this.scoreFor(game.play(index), player, depth + 1));
    return game.currentPlayer === player ? Math.max(...scores) : Math.min(...scores);
  }
}
