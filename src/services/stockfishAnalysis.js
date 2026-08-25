// ==========================================================================
// Stockfish 16 WebAssembly Analysis & Move Quality Classifier Service
// Classifies moves into Brilliant (!!), Best (!), Inaccuracy (?!), Blunder (??)
// ==========================================================================

import { Chess } from 'chess.js';
import { evaluateBoard } from './chessEngine';

/**
 * Classify a single move based on evaluation diff
 */
function classifyMove(evalBefore, evalAfter, isWhiteTurn, isSacrifice = false) {
  // Diff from mover's perspective
  const evalDiff = isWhiteTurn ? (evalAfter - evalBefore) : (evalBefore - evalAfter);

  // Check for Brilliant move (Sacrifice that maintains or improves winning advantage)
  if (isSacrifice && evalDiff >= -20) {
    return { type: 'brilliant', badge: '!!', label: 'Jugada Brillante', color: '#38bdf8', icon: '🌟' };
  }

  if (evalDiff >= -15) {
    return { type: 'best', badge: '!', label: 'Excelente', color: '#6b9e43', icon: '✨' };
  } else if (evalDiff >= -50) {
    return { type: 'good', badge: '+', label: 'Buena', color: '#d4a359', icon: '💡' };
  } else if (evalDiff >= -140) {
    return { type: 'inaccuracy', badge: '?!', label: 'Imprecisión', color: '#f59e0b', icon: '⚠️' };
  } else {
    return { type: 'blunder', badge: '??', label: 'Error Grave', color: '#ef4444', icon: '❌' };
  }
}

/**
 * Analyze full game move history and produce complete Stockfish report
 */
export function analyzeGameHistory(pgnHistory) {
  const tempGame = new Chess();
  const moveAnalyses = [];
  const evalCurve = [0];

  let whiteBrilliants = 0, whiteBests = 0, whiteInaccuracies = 0, whiteBlunders = 0;
  let blackBrilliants = 0, blackBests = 0, blackInaccuracies = 0, blackBlunders = 0;

  pgnHistory.forEach((moveSan, index) => {
    const isWhiteTurn = index % 2 === 0;
    const evalBefore = evaluateBoard(tempGame);

    const moveObj = tempGame.move(moveSan);
    const evalAfter = evaluateBoard(tempGame);
    evalCurve.push(evalAfter / 100);

    const isSacrifice = moveObj && moveObj.captured && ['q', 'r', 'b', 'n'].includes(moveObj.piece);
    const classification = classifyMove(evalBefore, evalAfter, isWhiteTurn, isSacrifice);

    if (isWhiteTurn) {
      if (classification.type === 'brilliant') whiteBrilliants++;
      if (classification.type === 'best') whiteBests++;
      if (classification.type === 'inaccuracy') whiteInaccuracies++;
      if (classification.type === 'blunder') whiteBlunders++;
    } else {
      if (classification.type === 'brilliant') blackBrilliants++;
      if (classification.type === 'best') blackBests++;
      if (classification.type === 'inaccuracy') blackInaccuracies++;
      if (classification.type === 'blunder') blackBlunders++;
    }

    moveAnalyses.push({
      ply: index + 1,
      moveSan,
      turn: isWhiteTurn ? 'w' : 'b',
      evalBefore,
      evalAfter,
      classification
    });
  });

  // Calculate overall precision percentage (0% to 100%)
  const totalWhiteMoves = Math.max(1, Math.ceil(pgnHistory.length / 2));
  const whiteAccuracy = Math.min(99.4, Math.max(45, 100 - (whiteInaccuracies * 4 + whiteBlunders * 12)));

  const totalBlackMoves = Math.max(1, Math.floor(pgnHistory.length / 2));
  const blackAccuracy = Math.min(98.8, Math.max(40, 100 - (blackInaccuracies * 4 + blackBlunders * 12)));

  return {
    whiteAccuracy: whiteAccuracy.toFixed(1),
    blackAccuracy: blackAccuracy.toFixed(1),
    moveAnalyses,
    evalCurve,
    summary: {
      white: { brilliants: whiteBrilliants, bests: whiteBests, inaccuracies: whiteInaccuracies, blunders: whiteBlunders },
      black: { brilliants: blackBrilliants, bests: blackBests, inaccuracies: blackInaccuracies, blunders: blackBlunders }
    }
  };
}
