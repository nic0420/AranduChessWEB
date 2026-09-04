import React, { useState } from 'react';
import PromotionModal from './PromotionModal';
import { soundFx } from '../services/audio';

// Crisp SVG Vector Piece Set (cburnett FIDE Standard)
const SVG_PIECES = {
  wp: (
    <svg viewBox="0 0 45 45" width="100%" height="100%">
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  wr: (
    <svg viewBox="0 0 45 45" width="100%" height="100%">
      <g fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M9 39h27v-3H9v3zM12 36h21l-1.5-4h-18l-1.5 4zM11 14h23l-2 18H13l-2-18zM9 9h4v4H9V9zM16 9h4v4h-4V9zM23 9h4v4h-4V9zM30 9h4v4h-4V9z" />
        <path d="M11 14h23v-3H11v3z" />
      </g>
    </svg>
  ),
  wn: (
    <svg viewBox="0 0 45 45" width="100%" height="100%">
      <g fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M22 10c1.05 0 8.02.02 9.36 8.67 1.16 7.54-5.58 10.08-3.76 14.66 1.41 3.56 6.9 2.1 6.9 2.1-.66 2.2-6.65 4.57-14.5 4.57-11.5 0-14.2-7.87-14.2-12.37 0-4.5 2.7-8.2 8-10.2 4.14-1.56 6.2-4.14 6.2-7.43 0-1.85-.24-5.43-2-7.43 1.8.43 3.5 1.43 4.5 2.43z" />
        <path d="M24 18c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z" fill="#000" />
      </g>
    </svg>
  ),
  wb: (
    <svg viewBox="0 0 45 45" width="100%" height="100%">
      <g fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M9 36h27v-3H9v3zM15 33h15l-1.8-3H16.8l-1.8 3zM22.5 10c-3 0-6 4-6 9 0 2.5.8 4.6 2 6.1L16 30h13l-2.5-4.9c1.2-1.5 2-3.6 2-6.1 0-5-3-9-6-9z" />
        <path d="M22.5 6v4M20.5 8h4" strokeLinecap="round" />
        <circle cx="22.5" cy="18" r="1.5" fill="#000" />
      </g>
    </svg>
  ),
  wq: (
    <svg viewBox="0 0 45 45" width="100%" height="100%">
      <g fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M9 26c1.5 2 2.5 4 1 11.5h25c-1.5-7.5-.5-9.5 1-11.5l-6-6-7.5 9-7.5-9-6 6z" />
        <path d="M9 39h27v-3H9v3z" />
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="14" cy="9" r="2.5" />
        <circle cx="22.5" cy="8" r="2.5" />
        <circle cx="31" cy="9" r="2.5" />
        <circle cx="39" cy="12" r="2.5" />
      </g>
    </svg>
  ),
  wk: (
    <svg viewBox="0 0 45 45" width="100%" height="100%">
      <g fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M22.5 11.63c-1.6 0-3 1.4-3 3 0 1.2.7 2.3 1.8 2.8L16.5 30h12l-4.8-12.6c1.1-.5 1.8-1.6 1.8-2.8 0-1.6-1.4-3-3-3z" />
        <path d="M11.5 30c0-4 4.5-5.5 11-5.5s11 1.5 11 5.5v3h-22v-3z" />
        <path d="M10 39h25v-3H10v3z" />
        <path d="M22.5 6v4.5M20.25 8.25h4.5" strokeLinecap="round" />
      </g>
    </svg>
  ),
  bp: (
    <svg viewBox="0 0 45 45" width="100%" height="100%">
      <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#1c1917" stroke="#000" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  br: (
    <svg viewBox="0 0 45 45" width="100%" height="100%">
      <g fill="#1c1917" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M9 39h27v-3H9v3zM12 36h21l-1.5-4h-18l-1.5 4zM11 14h23l-2 18H13l-2-18zM9 9h4v4H9V9zM16 9h4v4h-4V9zM23 9h4v4h-4V9zM30 9h4v4h-4V9z" />
        <path d="M11 14h23v-3H11v3z" />
      </g>
    </svg>
  ),
  bn: (
    <svg viewBox="0 0 45 45" width="100%" height="100%">
      <g fill="#1c1917" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M22 10c1.05 0 8.02.02 9.36 8.67 1.16 7.54-5.58 10.08-3.76 14.66 1.41 3.56 6.9 2.1 6.9 2.1-.66 2.2-6.65 4.57-14.5 4.57-11.5 0-14.2-7.87-14.2-12.37 0-4.5 2.7-8.2 8-10.2 4.14-1.56 6.2-4.14 6.2-7.43 0-1.85-.24-5.43-2-7.43 1.8.43 3.5 1.43 4.5 2.43z" />
        <path d="M24 18c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3z" fill="#fff" />
      </g>
    </svg>
  ),
  bb: (
    <svg viewBox="0 0 45 45" width="100%" height="100%">
      <g fill="#1c1917" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M9 36h27v-3H9v3zM15 33h15l-1.8-3H16.8l-1.8 3zM22.5 10c-3 0-6 4-6 9 0 2.5.8 4.6 2 6.1L16 30h13l-2.5-4.9c1.2-1.5 2-3.6 2-6.1 0-5-3-9-6-9z" />
        <path d="M22.5 6v4M20.5 8h4" strokeLinecap="round" stroke="#fff" />
        <circle cx="22.5" cy="18" r="1.5" fill="#fff" />
      </g>
    </svg>
  ),
  bq: (
    <svg viewBox="0 0 45 45" width="100%" height="100%">
      <g fill="#1c1917" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M9 26c1.5 2 2.5 4 1 11.5h25c-1.5-7.5-.5-9.5 1-11.5l-6-6-7.5 9-7.5-9-6 6z" />
        <path d="M9 39h27v-3H9v3z" />
        <circle cx="6" cy="12" r="2.5" fill="#fff" />
        <circle cx="14" cy="9" r="2.5" fill="#fff" />
        <circle cx="22.5" cy="8" r="2.5" fill="#fff" />
        <circle cx="31" cy="9" r="2.5" fill="#fff" />
        <circle cx="39" cy="12" r="2.5" fill="#fff" />
      </g>
    </svg>
  ),
  bk: (
    <svg viewBox="0 0 45 45" width="100%" height="100%">
      <g fill="#1c1917" stroke="#000" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M22.5 11.63c-1.6 0-3 1.4-3 3 0 1.2.7 2.3 1.8 2.8L16.5 30h12l-4.8-12.6c1.1-.5 1.8-1.6 1.8-2.8 0-1.6-1.4-3-3-3z" />
        <path d="M11.5 30c0-4 4.5-5.5 11-5.5s11 1.5 11 5.5v3h-22v-3z" />
        <path d="M10 39h25v-3H10v3z" />
        <path d="M22.5 6v4.5M20.25 8.25h4.5" strokeLinecap="round" stroke="#fff" />
      </g>
    </svg>
  )
};

export default function Chessboard({
  game,
  onMoveMade,
  isFlipped = false,
  boardTheme = 'wood',
  allowMoves = true,
  lastMove = null
}) {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [pendingPromotion, setPendingPromotion] = useState(null);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = isFlipped ? [...files].reverse() : files;
  const displayRanks = isFlipped ? [...ranks].reverse() : ranks;

  // Find King in check position. Keep the board render-safe while a game state is initializing.
  let inCheckSquare = null;
  const isInCheck = typeof game?.inCheck === 'function' ? game.inCheck() : false;
  if (isInCheck) {
    const turn = game.turn();
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          inCheckSquare = `${files[c]}${ranks[r]}`;
        }
      }
    }
  }

  const handleSquareClick = (square) => {
    if (!allowMoves) return;

    // If square selected, try making a move
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // Check if clicked square is a legal move destination
      const validMove = legalMoves.find(m => m.to === square);

      if (validMove) {
        // Check if pawn promotion required
        if (validMove.flags.includes('p')) {
          setPendingPromotion({ from: selectedSquare, to: square, color: game.turn() });
          return;
        }

        executeMove({ from: selectedSquare, to: square });
        return;
      }
    }

    // Select piece
    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      soundFx.playSelect();
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  };

  const executeMove = (moveObj) => {
    try {
      const moveResult = game.move(moveObj);
      if (moveResult) {
        setSelectedSquare(null);
        setLegalMoves([]);
        setPendingPromotion(null);

        // Play woodcraft sound FX
        if (game.isCheckmate()) {
          soundFx.playVictory();
        } else if (game.inCheck()) {
          soundFx.playCheck();
        } else if (moveResult.captured) {
          soundFx.playCapture();
        } else {
          soundFx.playMove();
        }

        if (onMoveMade) {
          onMoveMade(moveResult);
        }
      }
    } catch (err) {
      console.error('Invalid move attempted:', err);
    }
  };

  const handlePromotionChoice = (promotionPiece) => {
    if (pendingPromotion) {
      executeMove({
        from: pendingPromotion.from,
        to: pendingPromotion.to,
        promotion: promotionPiece
      });
    }
  };

  return (
    <div className={`chessboard-container theme-${boardTheme}`}>
      {pendingPromotion && (
        <PromotionModal
          color={pendingPromotion.color}
          onSelect={handlePromotionChoice}
        />
      )}

      {displayRanks.map((rank, rIndex) =>
        displayFiles.map((file, fIndex) => {
          const square = `${file}${rank}`;
          const isDark = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 1;
          const piece = game.get(square);

          const isSelected = selectedSquare === square;
          const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);
          const isInCheck = inCheckSquare === square;

          const isLegalDestination = legalMoves.some(m => m.to === square);
          const isCaptureDestination = isLegalDestination && piece !== null;

          return (
            <div
              key={square}
              className={`square ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''} ${isLastMoveSquare ? 'last-move' : ''} ${isInCheck ? 'in-check' : ''}`}
              onClick={() => handleSquareClick(square)}
            >
              {/* Square File & Rank Coordinates */}
              {fIndex === 0 && <span className="coord-rank">{rank}</span>}
              {rIndex === 7 && <span className="coord-file">{file}</span>}

              {/* Legal Move Indicators */}
              {isLegalDestination && !isCaptureDestination && <div className="move-dot" />}
              {isCaptureDestination && <div className="capture-ring" />}

              {/* Vector Piece Rendering */}
              {piece && (
                <div className="chess-piece">
                  {SVG_PIECES[`${piece.color}${piece.type}`]}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

