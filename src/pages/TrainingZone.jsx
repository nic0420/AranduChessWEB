import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import Chessboard from '../components/Chessboard';
import { OPENINGS_DATA, ENDGAMES_DATA, AI_BOTS } from '../data/trainingData';
import { Dumbbell, Cpu, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * TrainingZone - Opening Trainer, Endgame Drills, 30s Board Vision Speed Quiz, & AI Bots
 */
export default function TrainingZone({ boardTheme, onSelectBot }) {
  const [activeTab, setActiveTab] = useState('openings'); // 'openings' | 'endgames' | 'vision' | 'bots'

  // Opening Explorer state
  const [selectedOpening, setSelectedOpening] = useState(OPENINGS_DATA[0]);
  const [openingGame, setOpeningGame] = useState(new Chess(OPENINGS_DATA[0].fen));

  // Vision Speed Quiz state
  const [visionScore, setVisionScore] = useState(0);
  const [visionTime, setVisionTime] = useState(30);
  const [visionActive, setVisionActive] = useState(false);
  const [targetSquare, setTargetSquare] = useState('e4');

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Vision Quiz countdown timer
  useEffect(() => {
    let timer = null;
    if (visionActive && visionTime > 0) {
      timer = setInterval(() => {
        setVisionTime(prev => prev - 1);
      }, 1000);
    } else if (visionTime === 0 && visionActive) {
      setVisionActive(false);
      confetti({ particleCount: 60, spread: 50 });
    }
    return () => clearInterval(timer);
  }, [visionActive, visionTime]);

  const startVisionGame = () => {
    setVisionScore(0);
    setVisionTime(30);
    setVisionActive(true);
    generateNextSquare();
  };

  const generateNextSquare = () => {
    const randomFile = files[Math.floor(Math.random() * 8)];
    const randomRank = ranks[Math.floor(Math.random() * 8)];
    setTargetSquare(`${randomFile}${randomRank}`);
  };

  const handleSquareClickInVision = (file, rank) => {
    if (!visionActive) return;
    const clickedSquare = `${file}${rank}`;
    if (clickedSquare === targetSquare) {
      setVisionScore(prev => prev + 1);
      generateNextSquare();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Dumbbell color="var(--accent-green)" size={24} /> Centro de Entrenamiento Específico
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Perfecciona aperturas, domina finales clave, entrena tu visión de tablero y desafía Bots de IA.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'openings', label: '📖 Aperturas', desc: 'Explorador de Aperturas' },
          { id: 'endgames', label: '👑 Finales', desc: 'Mates y Peones' },
          { id: 'vision', label: '⚡ Entrenador de Visión', desc: 'Test de 30s' },
          { id: 'bots', label: '🤖 Bots de IA', desc: '200 a 2800 Elo' }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                color: isActive ? 'var(--accent-green)' : 'var(--text-secondary)',
                border: isActive ? '2px solid var(--accent-green)' : '1px solid var(--border-color)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: OPENING EXPLORER */}
      {activeTab === 'openings' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div className="glass-card" style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Repertorio de Aperturas</h3>
            {OPENINGS_DATA.map(op => (
              <div
                key={op.id}
                onClick={() => {
                  setSelectedOpening(op);
                  setOpeningGame(new Chess(op.fen));
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: selectedOpening.id === op.id ? 'var(--bg-card-hover)' : 'var(--bg-secondary)',
                  border: selectedOpening.id === op.id ? '1px solid var(--accent-green)' : '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '0.95rem', color: selectedOpening.id === op.id ? 'var(--accent-green)' : '#fff' }}>
                    {op.name}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>ECO {op.eco}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{op.moves.join(' ')}</p>
              </div>
            ))}
          </div>

          {/* Interactive Opening Board Display */}
          <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <div className="glass-card" style={{ width: '100%' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-green)' }}>{selectedOpening.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                {selectedOpening.description}
              </p>
            </div>
            <Chessboard game={openingGame} boardTheme={boardTheme} allowMoves={false} />
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ENDGAME DRILLS */}
      {activeTab === 'endgames' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {ENDGAMES_DATA.map(eg => (
            <div key={eg.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>{eg.name}</h3>
                <span className="btn-gold" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>{eg.difficulty}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{eg.description}</p>
              <Chessboard game={new Chess(eg.fen)} boardTheme={boardTheme} allowMoves={false} />
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: VISION SPEED TRAINER (30s) */}
      {activeTab === 'vision' && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Zap color="var(--accent-gold)" size={24} /> Entrenador de Visión de Tablero (30s)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Haz clic en la casilla solicitada lo más rápido posible para entrenar tu visión espacial.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tiempo</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: visionTime <= 5 ? '#ef4444' : 'var(--accent-green)' }}>
                {visionTime}s
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '2px solid var(--accent-gold)',
                padding: '12px 24px',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>Haz clic en:</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                {visionActive ? targetSquare : '--'}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Puntos</span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {visionScore}
              </div>
            </div>
          </div>

          {!visionActive ? (
            <button className="btn-primary" onClick={startVisionGame} style={{ fontSize: '1.1rem', padding: '14px 32px' }}>
              ⚡ Iniciar Desafío de 30 Segundos
            </button>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px', width: '100%', aspectRatio: '1/1', maxWidth: '400px' }}>
              {ranks.map(r =>
                files.map(f => {
                  const isDark = (files.indexOf(f) + ranks.indexOf(r)) % 2 === 1;
                  return (
                    <button
                      key={`${f}${r}`}
                      onClick={() => handleSquareClickInVision(f, r)}
                      style={{
                        backgroundColor: isDark ? 'var(--board-dark)' : 'var(--board-light)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: isDark ? 'var(--board-light)' : 'var(--board-dark)'
                      }}
                    >
                      {`${f}${r}`}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: BOTS POR ELO */}
      {activeTab === 'bots' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {AI_BOTS.map(bot => (
            <div
              key={bot.id}
              className="glass-card"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}
            >
              <span style={{ fontSize: '3rem' }}>{bot.avatar}</span>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>{bot.name}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
                  🏆 {bot.elo} Elo FIDE
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{bot.personality}</p>
              <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                "{bot.quote}"
              </div>
              <button
                className="btn-primary"
                onClick={() => onSelectBot(bot.elo)}
                style={{ marginTop: 'auto', width: '100%' }}
              >
                <Cpu size={16} /> Desafiar en Partida
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
