import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import Chessboard from '../components/Chessboard';
import { PUZZLES_DATABASE } from '../data/puzzlesData';
import { soundFx } from '../services/audio';
import { Target, Flame, Lightbulb, RefreshCw, Trophy, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * PuzzleZone - Tactical Exercise Zone & Streak Mode (Racha de Tácticas)
 */
export default function PuzzleZone({ puzzleRating, setPuzzleRating, boardTheme }) {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [moveStep, setMoveStep] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success'|'error', text: '' }

  const puzzle = PUZZLES_DATABASE[currentPuzzleIndex];

  useEffect(() => {
    loadPuzzle(currentPuzzleIndex);
  }, [currentPuzzleIndex]);

  const loadPuzzle = (index) => {
    const p = PUZZLES_DATABASE[index];
    if (p) {
      setGame(new Chess(p.fen));
      setMoveStep(0);
      setShowHint(false);
      setStatusMessage(null);
    }
  };

  const handlePuzzleMove = (moveResult) => {
    const targetMove = puzzle.solution[moveStep];

    if (targetMove && moveResult.from === targetMove.from && moveResult.to === targetMove.to) {
      soundFx.playVictory();

      if (moveStep + 1 < puzzle.solution.length) {
        setMoveStep(moveStep + 1);
        setStatusMessage({ type: 'success', text: '¡Buen movimiento! Sigue así.' });
      } else {
        // Puzzle solved successfully!
        confetti({ particleCount: 70, spread: 50 });
        const ratingGain = 12 + Math.floor(Math.random() * 5);
        setPuzzleRating(puzzleRating + ratingGain);
        setStreakCount(streakCount + 1);
        setStatusMessage({ type: 'success', text: `¡Ejercicio resuelto con éxito! (+${ratingGain} Rating Puzzles)` });
      }
    } else {
      soundFx.playDefeat();
      const ratingLoss = 8;
      setPuzzleRating(Math.max(400, puzzleRating - ratingLoss));
      setStreakCount(0);
      setStatusMessage({ type: 'error', text: `Movimiento incorrecto. Solución esperada de la posición. (-${ratingLoss} Rating Puzzles)` });

      // Reset position
      setTimeout(() => {
        setGame(new Chess(puzzle.fen));
      }, 1200);
    }
  };

  const nextPuzzle = () => {
    const nextIdx = (currentPuzzleIndex + 1) % PUZZLES_DATABASE.length;
    setCurrentPuzzleIndex(nextIdx);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target color="var(--accent-gold)" size={24} /> Zona de Ejercicios & Racha Táctica
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Resuelve problemas tácticos diarios para mejorar tu visión combinatoria y elevar tu Rating de Ejercicios.
          </p>
        </div>

        {/* Rating & Streak Badges */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Trophy size={18} color="var(--accent-gold)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
              Rating Puzzles: {puzzleRating}
            </span>
          </div>

          <div className="glass-card" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={18} color="#ef4444" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444' }}>
              Racha: {streakCount} 🔥
            </span>
          </div>
        </div>
      </div>

      {/* Main Puzzle Playground */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', alignItems: 'flex-start' }}>
        {/* Left Column: Board */}
        <div style={{ flex: 1, maxWidth: '580px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          {/* Turn indicator */}
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-tertiary)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid var(--border-color)'
            }}
          >
            <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
              Juegan las {game.turn() === 'w' ? '⚪ Blancas' : '⚫ Negras'} y ganan
            </span>
            <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--accent-green)', color: '#111', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
              {puzzle.theme}
            </span>
          </div>

          <Chessboard
            game={game}
            onMoveMade={handlePuzzleMove}
            boardTheme={boardTheme}
          />
        </div>

        {/* Right Column: Puzzle Meta, Hints & Actions */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Puzzle Info Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>🧩 {puzzle.title}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{puzzle.description}</p>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Dificultad estimada: <strong style={{ color: 'var(--accent-gold)' }}>{puzzle.rating} Elo</strong>
            </div>
          </div>

          {/* Hint Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              className="btn-secondary"
              onClick={() => setShowHint(!showHint)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Lightbulb size={18} color="var(--accent-gold)" />
              <span>{showHint ? 'Ocultar Pista' : 'Ver Pista del Ejercicio'}</span>
            </button>

            {showHint && (
              <div
                className="animate-slide-up"
                style={{
                  backgroundColor: 'rgba(240, 192, 64, 0.1)',
                  border: '1px solid var(--accent-gold)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px',
                  fontSize: '0.85rem',
                  color: 'var(--accent-gold)'
                }}
              >
                💡 <strong>Pista:</strong> {puzzle.hint}
              </div>
            )}
          </div>

          {/* Result Status Banner */}
          {statusMessage && (
            <div
              className="glass-card animate-slide-up"
              style={{
                backgroundColor: statusMessage.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(129, 182, 76, 0.15)',
                borderColor: statusMessage.type === 'error' ? '#ef4444' : 'var(--accent-green)',
                textAlign: 'center'
              }}
            >
              <p style={{ fontSize: '0.9rem', color: statusMessage.type === 'error' ? '#fca5a5' : '#fff', fontWeight: 600 }}>
                {statusMessage.text}
              </p>
            </div>
          )}

          {/* Navigation to next puzzle */}
          <button className="btn-primary" onClick={nextPuzzle} style={{ width: '100%' }}>
            <RefreshCw size={18} /> Siguiente Ejercicio Táctico
          </button>
        </div>
      </div>
    </div>
  );
}
