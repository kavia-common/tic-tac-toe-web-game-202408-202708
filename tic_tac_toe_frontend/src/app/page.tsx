"use client";

import React, { useMemo, useState } from "react";

type Player = "X" | "O";
type Cell = Player | null;

const WIN_LINES: Array<[number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

function getWinner(board: Cell[]): { winner: Player | null; line: number[] | null } {
  for (const [a, b, c] of WIN_LINES) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function isBoardFull(board: Cell[]) {
  return board.every((c) => c !== null);
}

// PUBLIC_INTERFACE
export default function Home() {
  /** Main Tic Tac Toe game page (client component): renders a 3x3 board, status, and reset control. */
  const [board, setBoard] = useState<Cell[]>(Array.from({ length: 9 }, () => null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");

  const { winner, line } = useMemo(() => getWinner(board), [board]);
  const isDraw = useMemo(() => !winner && isBoardFull(board), [winner, board]);

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw game";
    return `Turn: ${currentPlayer}`;
  }, [winner, isDraw, currentPlayer]);

  function resetGame() {
    setBoard(Array.from({ length: 9 }, () => null));
    setCurrentPlayer("X");
  }

  function handleCellClick(index: number) {
    // Prevent moves after game end or overwriting a filled cell.
    if (winner || isDraw) return;
    if (board[index] !== null) return;

    setBoard((prev) => {
      const next = [...prev];
      next[index] = currentPlayer;
      return next;
    });
    setCurrentPlayer((p) => (p === "X" ? "O" : "X"));
  }

  return (
    <main className="ttt-page">
      <section className="ttt-card" aria-labelledby="ttt-title">
        <header className="ttt-header">
          <h1 id="ttt-title" className="ttt-title">
            Tic Tac Toe
          </h1>
          <p className="ttt-subtitle">
            Two-player game — take turns placing <strong>X</strong> and <strong>O</strong>.
          </p>
        </header>

        <div className="ttt-status" role="status" aria-live="polite">
          <span className="ttt-status-label">{statusText}</span>
        </div>

        <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
          {board.map((cell, idx) => {
            const isWinningCell = line?.includes(idx) ?? false;
            const isDisabled = winner !== null || isDraw || cell !== null;

            return (
              <button
                key={idx}
                type="button"
                className={`ttt-cell ${isWinningCell ? "ttt-cell--win" : ""}`}
                onClick={() => handleCellClick(idx)}
                disabled={isDisabled}
                role="gridcell"
                aria-label={`Cell ${idx + 1}${cell ? `: ${cell}` : ""}`}
              >
                <span
                  className={`ttt-mark ${
                    cell === "X" ? "ttt-mark--x" : cell === "O" ? "ttt-mark--o" : ""
                  }`}
                  aria-hidden="true"
                >
                  {cell ?? ""}
                </span>
              </button>
            );
          })}
        </div>

        <footer className="ttt-controls">
          <button type="button" className="ttt-reset" onClick={resetGame}>
            Reset game
          </button>

          <div className="ttt-hint" aria-label="How to play">
            Click an empty square to place your mark.
          </div>
        </footer>
      </section>
    </main>
  );
}
