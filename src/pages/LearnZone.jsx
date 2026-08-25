import React, { useState } from 'react';
import { Chess } from 'chess.js';
import Chessboard from '../components/Chessboard';
import { LESSON_LEVELS, LESSONS_DATA } from '../data/lessonsData';
import { BookOpen, CheckCircle, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../services/audio';

/**
 * LearnZone - Interactive FIDE Elo Scaled Theory & Practice Lessons (QA Hardened)
 */
export default function LearnZone({ userElo, updateUserElo, boardTheme }) {
  const [selectedLevel, setSelectedLevel] = useState('novice');
  const [activeLesson, setActiveLesson] = useState(LESSONS_DATA[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [game, setGame] = useState(new Chess(LESSONS_DATA[0].initialFen));
  const [feedback, setFeedback] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isLockBoard, setIsLockBoard] = useState(false);

  const filteredLessons = LESSONS_DATA.filter(l => l.levelId === selectedLevel);

  const startLesson = (lesson) => {
    soundFx.playButtonClick();
    setActiveLesson(lesson);
    setCurrentStepIndex(0);
    const initialFen = lesson.steps[0]?.initialFenOverride || lesson.initialFen;
    setGame(new Chess(initialFen));
    setFeedback(null);
    setIsLockBoard(false);
  };

  const handleLessonMove = (moveResult) => {
    if (isLockBoard) return;

    const currentStep = activeLesson.steps[currentStepIndex];
    if (!currentStep) return;

    // Check if move matches target move
    if (moveResult.from === currentStep.targetMove.from && moveResult.to === currentStep.targetMove.to) {
      setFeedback({ type: 'success', text: currentStep.explanation });

      if (currentStepIndex + 1 < activeLesson.steps.length) {
        setIsLockBoard(true);
        setTimeout(() => {
          const nextIndex = currentStepIndex + 1;
          setCurrentStepIndex(nextIndex);
          const nextStep = activeLesson.steps[nextIndex];
          if (nextStep.initialFenOverride) {
            setGame(new Chess(nextStep.initialFenOverride));
          }
          setFeedback(null);
          setIsLockBoard(false);
        }, 1600);
      } else {
        // Lesson Complete!
        confetti({ particleCount: 80, spread: 60 });
        if (!completedLessons.includes(activeLesson.id)) {
          setCompletedLessons([...completedLessons, activeLesson.id]);
          updateUserElo(userElo + 25);
        }
        setFeedback({ type: 'completed', text: `¡Felicitaciones! Has completado "${activeLesson.title}". (+25 Elo FIDE)` });
      }
    } else {
      setIsLockBoard(true);
      setFeedback({ type: 'error', text: 'Movimiento incorrecto. Revisa la instrucción e inténtalo de nuevo.' });
      setTimeout(() => {
        const currentStepFen = currentStep.initialFenOverride || activeLesson.initialFen;
        setGame(new Chess(currentStepFen));
        setFeedback(null);
        setIsLockBoard(false);
      }, 1400);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen color="var(--accent-gold)" size={24} /> Zona de Teoría & Práctica Guiada
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Nivelación por **Elo FIDE**: Domina conceptos teóricos y demuestra tu habilidad en el tablero interactivo.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Lecciones completadas:</span>
          <span className="btn-gold" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
            {completedLessons.length} / {LESSONS_DATA.length}
          </span>
        </div>
      </div>

      {/* FIDE ELO Tier Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {LESSON_LEVELS.map(lvl => {
          const isActive = selectedLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              onClick={() => {
                soundFx.playButtonClick();
                setSelectedLevel(lvl.id);
                const firstLesson = LESSONS_DATA.find(l => l.levelId === lvl.id);
                if (firstLesson) startLesson(firstLesson);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                color: isActive ? lvl.color : 'var(--text-secondary)',
                border: isActive ? `2px solid ${lvl.color}` : '1px solid var(--border-color)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{lvl.badge}</span>
              <span>{lvl.name} ({lvl.eloRange})</span>
            </button>
          );
        })}
      </div>

      {/* Active Lesson Content Layout */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
        {/* Left Column: Lesson Selector & Theory Text */}
        <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Lessons List in selected tier */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '4px' }}>📚 Lecciones en este nivel:</h3>
            {filteredLessons.map(lesson => {
              const isSelected = activeLesson.id === lesson.id;
              const isDone = completedLessons.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => startLesson(lesson)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-secondary)',
                    border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.9rem', color: isSelected ? 'var(--accent-gold)' : '#fff' }}>
                      {lesson.title}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱️ {lesson.duration} • {lesson.elo} Elo</span>
                  </div>
                  {isDone && <CheckCircle size={18} color="var(--accent-green)" />}
                </div>
              );
            })}
          </div>

          {/* Theory Module Explanation Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb color="var(--accent-gold)" size={22} />
              <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Teoría: {activeLesson.title}</h3>
            </div>
            <div
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                backgroundColor: 'var(--bg-secondary)',
                padding: '14px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {activeLesson.theory.split('\n\n').map((paragraph, idx) => (
                <p key={idx} style={{ marginBottom: '8px' }}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Practical Board Exercise & Step Guide */}
        <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          {/* Step Guide Banner */}
          <div
            className="glass-card"
            style={{
              width: '100%',
              borderColor: 'var(--accent-gold)',
              backgroundColor: 'rgba(212, 163, 89, 0.08)'
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: 800 }}>
              PASO {currentStepIndex + 1} DE {activeLesson.steps.length}
            </span>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginTop: '4px' }}>
              {activeLesson.steps[currentStepIndex]?.instruction}
            </h4>
          </div>

          {/* Interactive Lesson Board */}
          <Chessboard
            game={game}
            onMoveMade={handleLessonMove}
            boardTheme={boardTheme}
            allowMoves={!isLockBoard}
          />

          {/* Step Feedback Banner */}
          {feedback && (
            <div
              className="glass-card animate-slide-up"
              style={{
                width: '100%',
                backgroundColor: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(129, 182, 76, 0.15)',
                borderColor: feedback.type === 'error' ? '#ef4444' : 'var(--accent-green)',
                textAlign: 'center'
              }}
            >
              <p style={{ fontSize: '0.9rem', color: feedback.type === 'error' ? '#fca5a5' : '#fff', fontWeight: 600 }}>
                {feedback.text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
