// ==========================================================================
// Chess AI Engine & Position Evaluator - Optimized QA Master Edition
// Supports scaled FIDE ELO levels (200 - 2800 Elo) & position evaluation
// ==========================================================================

import { Chess } from 'chess.js';

// Piece value mapping
const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Piece Square Tables for Positional Evaluation
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

/**
 * Evaluate current board position from White's perspective in centipawns
 */
export function evaluateBoard(game) {
  if (game.isCheckmate()) {
    return game.turn() === 'w' ? -99999 : 99999;
  }
  if (game.isDraw() || game.isStalemate() || game.isThreefoldRepetition()) {
    return 0;
  }

  let totalScore = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      let score = PIECE_VALUES[piece.type] || 0;
      const squareIndex = r * 8 + c;

      if (piece.type === 'p') {
        score += piece.color === 'w' ? PAWN_TABLE[squareIndex] : PAWN_TABLE[63 - squareIndex];
      } else if (piece.type === 'n') {
        score += KNIGHT_TABLE[squareIndex];
      }

      if (piece.color === 'w') {
        totalScore += score;
      } else {
        totalScore -= score;
      }
    }
  }

  return totalScore;
}

/**
 * Sort moves for optimal Alpha-Beta Pruning speed (Captures and checks first)
 */
function orderMoves(moves) {
  return moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.captured) scoreA += 10 * PIECE_VALUES[a.captured] - PIECE_VALUES[a.piece];
    if (b.captured) scoreB += 10 * PIECE_VALUES[b.captured] - PIECE_VALUES[b.piece];
    if (a.san.includes('+')) scoreA += 50;
    if (b.san.includes('+')) scoreB += 50;

    return scoreB - scoreA;
  });
}

/**
 * Minimax with Alpha-Beta Pruning & Move Ordering
 */
function minimax(game, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const moves = orderMoves(game.moves({ verbose: true }));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalScore = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Get AI Bot move adjusted by FIDE ELO difficulty level
 */
export function getBotMove(game, botElo = 1200) {
  const possibleMoves = game.moves({ verbose: true });
  if (possibleMoves.length === 0) return null;

  // ELO 200 - Martin: 85% random, 15% basic capture
  if (botElo <= 400) {
    if (Math.random() < 0.85) {
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
  }

  // ELO 600 - Elani: Prefers captures and checks
  if (botElo <= 800) {
    const captures = possibleMoves.filter(m => m.captured || m.san.includes('+'));
    if (captures.length > 0 && Math.random() < 0.75) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    if (Math.random() < 0.4) {
      return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
  }

  // Intermediate & Advanced Bots (1200 - 2800 ELO): Fast Minimax with Alpha-Beta
  const isWhite = game.turn() === 'w';
  const depth = botElo >= 2000 ? 3 : 2;

  let bestMove = null;
  let bestValue = isWhite ? -Infinity : Infinity;

  const orderedMoves = orderMoves([...possibleMoves]);

  for (const move of orderedMoves) {
    game.move(move);
    const boardValue = minimax(game, depth - 1, -Infinity, Infinity, !isWhite);
    game.undo();

    // Elo error factor
    const errorFactor = botElo < 1600 ? (Math.random() * 60 - 30) : 0;
    const adjustedValue = boardValue + errorFactor;

    if (isWhite) {
      if (adjustedValue > bestValue) {
        bestValue = adjustedValue;
        bestMove = move;
      }
    } else {
      if (adjustedValue < bestValue) {
        bestValue = adjustedValue;
        bestMove = move;
      }
    }
  }

  return bestMove || possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
}

/**
 * Format evaluation centipawns to displayable string (+1.4, -0.8, M2, etc.)
 */
export function getEvaluationDisplay(scoreInCentipawns) {
  if (Math.abs(scoreInCentipawns) > 9000) {
    const movesToMate = Math.ceil((99999 - Math.abs(scoreInCentipawns)) / 100);
    return scoreInCentipawns > 0 ? `M${movesToMate}` : `-M${movesToMate}`;
  }
  const evalInPawns = (scoreInCentipawns / 100).toFixed(1);
  return evalInPawns > 0 ? `+${evalInPawns}` : `${evalInPawns}`;
}
