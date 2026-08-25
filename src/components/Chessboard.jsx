import React, { useState } from 'react';
import PromotionModal from './PromotionModal';
import { soundFx } from '../services/audio';

const PIECE_SYMBOLS = {
  wp: '♙', wr: '♖', wn: '♘', wb: '♗', wq: '♕', wk: '♔',
  bp: '♟', br: '♜', bn: '♞', bb: '♝', bq: '♛', bk: '♚'
};

export default function Chessboard({
  game,
  onMoveMade,
  isFlipped = false,
  boardTheme = 'wood', // Default to Master Woodcraft
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

  // Find King in check position
  let inCheckSquare = null;
  if (game.inCheck()) {
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

              {/* Piece Rendering */}
              {piece && (
                <div
                  className="chess-piece"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.8rem',
                    lineHeight: 1,
                    color: piece.color === 'w' ? '#fcf8f2' : '#1e140d',
                    textShadow: piece.color === 'w' ? '0 3px 6px rgba(0,0,0,0.85)' : '0 2px 4px rgba(255,255,255,0.3)',
                    filter: piece.color === 'w' ? 'drop-shadow(0px 3px 4px rgba(0,0,0,0.8))' : 'drop-shadow(0px 2px 2px rgba(255,255,255,0.25))'
                  }}
                >
                  {PIECE_SYMBOLS[`${piece.color}${piece.type}`]}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
