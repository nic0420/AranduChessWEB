import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import Chessboard from '../components/Chessboard';
import EvaluationBar from '../components/EvaluationBar';
import { evaluateBoard, getBotMove } from '../services/chessEngine';
import { analyzeGameHistory } from '../services/stockfishAnalysis';
import { multiplayerLobby } from '../services/multiplayerServer';
import { soundFx } from '../services/audio';
import { Play, RotateCcw, Cpu, Users, Sparkles, BarChart2, MessageSquare, Key } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * PlayZone - Full Featured Game Zone with Stockfish 16 Analysis & Multiplayer Lobby
 */
export default function PlayZone({ userElo, updateUserElo, boardTheme, initialBotElo = 1300 }) {
  const [game, setGame] = useState(new Chess());
  const [lastMove, setLastMove] = useState(null);
  const [gameMode, setGameMode] = useState('bot'); // 'bot' | 'online' | 'room'
  const [selectedBotElo, setSelectedBotElo] = useState(initialBotElo);
  const [timeControl, setTimeControls] = useState(600);
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const [gameActive, setGameActive] = useState(false);
  const [gameOverReason, setGameOverReason] = useState(null);
  const [evalScore, setEvalScore] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [playerColor, setPlayerColor] = useState('w'); // 'w' | 'b'

  // Player & Opponent information
  const [opponentName, setOpponentName] = useState('Nelson (Bot)');
  const [opponentElo, setOpponentElo] = useState(1300);
  const [opponentAvatar, setOpponentAvatar] = useState('🤖');

  // Multiplayer Room State
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [activeRoomCode, setActiveRoomCode] = useState(null);
  const [searchingMatch, setSearchingMatch] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Stockfish 16 Analysis Report
  const [analysisReport, setAnalysisReport] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const timerRef = useRef(null);

  const endGame = useCallback((reason) => {
    setGameActive(false);
    setGameOverReason(reason);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const checkGameOverStatus = useCallback((currentGame) => {
    setGameActive(false);
    if (currentGame.isCheckmate()) {
      const winner = currentGame.turn() === 'w' ? 'Negras' : 'Blancas';
      const userWon = (winner === 'Blancas' && playerColor === 'w') || (winner === 'Negras' && playerColor === 'b');
      if (userWon) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        soundFx.playVictory();
        updateUserElo(userElo + 18);
        endGame('¡Jaque Mate! ¡Has Ganado la Partida! (+18 Elo)');
      } else {
        soundFx.playDefeat();
        updateUserElo(Math.max(400, userElo - 12));
        endGame('Jaque Mate. El oponente ha ganado la partida. (-12 Elo)');
      }
    } else if (currentGame.isDraw()) {
      endGame('Partida Tablas (Empate por Ahogado o repetición).');
    }
  }, [playerColor, userElo, updateUserElo, endGame]);

  // Sync initialBotElo from props if selected in TrainingZone
  useEffect(() => {
    if (initialBotElo) {
      setSelectedBotElo(initialBotElo);
    }
  }, [initialBotElo]);

  // Clock countdown logic
  useEffect(() => {
    if (gameActive && !game.isGameOver()) {
      timerRef.current = setInterval(() => {
        if (game.turn() === 'w') {
          setWhiteTime(prev => {
            if (prev <= 1) {
              endGame('El tiempo de las Blancas expiró. ¡Ganan las Negras!');
              return 0;
            }
            return prev - 1;
          });
        } else {
          setBlackTime(prev => {
            if (prev <= 1) {
              endGame('El tiempo de las Negras expiró. ¡Ganan las Blancas!');
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [gameActive, game, endGame]);

  // Opponent Auto-Move Engine (Works for both Bot Mode and Online Matchmaking Mode)
  useEffect(() => {
    const opponentColor = playerColor === 'w' ? 'b' : 'w';
    if (gameActive && game.turn() === opponentColor && !game.isGameOver()) {
      const delay = gameMode === 'bot' ? 600 : 1500;
      const botTimer = setTimeout(() => {
        const targetElo = gameMode === 'bot' ? selectedBotElo : opponentElo;
        const botMove = getBotMove(game, targetElo);
        if (botMove) {
          const moveResult = game.move(botMove);
          if (moveResult) {
            const nextGame = new Chess(game.fen());
            setGame(nextGame);
            setLastMove({ from: moveResult.from, to: moveResult.to });
            setMoveHistory(prev => [...prev, moveResult.san]);
            setEvalScore(evaluateBoard(nextGame));

            // Random Chat reaction (25% chance in online mode)
            if (gameMode !== 'bot' && Math.random() < 0.25) {
              const reaction = multiplayerLobby.getRandomChatReaction(opponentName);
              setChatMessages(prev => [...prev, reaction]);
            }

            if (nextGame.isGameOver()) {
              checkGameOverStatus(nextGame);
            } else if (nextGame.inCheck()) {
              soundFx.playCheck();
            } else if (moveResult.captured) {
              soundFx.playCapture();
            } else {
              soundFx.playMove();
            }
          }
        }
      }, delay);
      return () => clearTimeout(botTimer);
    }
  }, [game, gameActive, gameMode, playerColor, selectedBotElo, opponentElo, opponentName, checkGameOverStatus]);

  const startNewGame = (mode = 'bot', botElo = selectedBotElo, timeSecs = timeControl, side = playerColor) => {
    soundFx.playButtonClick();
    let chosenColor = side;
    if (side === 'random') {
      chosenColor = Math.random() < 0.5 ? 'w' : 'b';
    }

    const newGame = new Chess(); // White always starts game
    setPlayerColor(chosenColor);
    setIsFlipped(chosenColor === 'b');

    let initialHistory = [];
    let initialLastMove = null;

    // If human plays Black, White (Bot/Opponent) MUST start the game immediately
    if (chosenColor === 'b' && mode === 'bot') {
      const firstBotMove = getBotMove(newGame, botElo);
      if (firstBotMove) {
        const moveRes = newGame.move(firstBotMove);
        if (moveRes) {
          initialLastMove = { from: moveRes.from, to: moveRes.to };
          initialHistory = [moveRes.san];
        }
      }
    }

    setGame(newGame);
    setLastMove(initialLastMove);
    setMoveHistory(initialHistory);
    setGameMode(mode);
    setSelectedBotElo(botElo);
    setTimeControls(timeSecs);
    setWhiteTime(timeSecs);
    setBlackTime(timeSecs);
    setGameActive(true);
    setGameOverReason(null);
    setEvalScore(evaluateBoard(newGame));
    setAnalysisReport(null);
    setShowAnalysisModal(false);

    if (mode === 'bot') {
      const botMetadata = {
        200: { name: 'Martin', avatar: '👨‍🌾' },
        600: { name: 'Elani', avatar: '👩‍🎨' },
        1300: { name: 'Nelson', avatar: '🧔‍♂️' },
        1800: { name: 'Isabel (Maestra)', avatar: '👩‍🔬' },
        2800: { name: 'Magnus Bot', avatar: '👑' }
      };
      const botInfo = botMetadata[botElo] || { name: 'Bot', avatar: '🤖' };
      setOpponentName(`${botInfo.name} (Bot)`);
      setOpponentElo(botElo);
      setOpponentAvatar(botInfo.avatar);
      setChatMessages([{ sender: 'Sistema', text: `Partida iniciada contra ${botInfo.name} (${botElo} Elo).` }]);
    }
  };

  const startQuickMatchmaking = () => {
    soundFx.playButtonClick();
    setSearchingMatch(true);
    multiplayerLobby.quickMatch('Tú', userElo, (opp) => {
      setSearchingMatch(false);
      setOpponentName(opp.name);
      setOpponentElo(opp.elo);
      setOpponentAvatar(opp.avatar || '⚔️');
      startNewGame('online', opp.elo, 300, 'w');
      setChatMessages([
        { sender: 'Sistema', text: `¡Emparejado en línea contra ${opp.name} ${opp.country} (${opp.elo} Elo)!` },
        { sender: opp.name, text: '¡Hola! Buena partida y diviértete.' }
      ]);
    });
  };

  const createPrivateRoom = () => {
    soundFx.playButtonClick();
    const room = multiplayerLobby.createRoom('Tú', userElo);
    setActiveRoomCode(room.code);
    setOpponentName('GranMaestro_Online');
    setOpponentElo(userElo + 15);
    setOpponentAvatar('👑');
    setChatMessages(room.messages);
    startNewGame('room', userElo + 15, 600, 'w');
  };

  const joinPrivateRoom = () => {
    soundFx.playButtonClick();
    const res = multiplayerLobby.joinRoom(roomCodeInput, 'Tú', userElo);
    if (res.success) {
      setActiveRoomCode(res.room.code);
      setOpponentName(res.room.host.name);
      setOpponentElo(res.room.host.elo);
      setOpponentAvatar('⚔️');
      setChatMessages(res.room.messages);
      startNewGame('room', res.room.host.elo, 600, 'b');
    } else {
      alert(res.error);
    }
  };

  const handleUserMove = (moveResult) => {
    const nextGame = new Chess(game.fen());
    setGame(nextGame);
    setLastMove({ from: moveResult.from, to: moveResult.to });
    setMoveHistory(prev => [...prev, moveResult.san]);
    setEvalScore(evaluateBoard(nextGame));

    if (nextGame.isGameOver()) {
      checkGameOverStatus(nextGame);
    }
  };

  const runStockfishAnalysis = () => {
    soundFx.playButtonClick();
    const report = analyzeGameHistory(moveHistory);
    setAnalysisReport(report);
    setShowAnalysisModal(true);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { sender: 'Tú', text: chatInput }]);
    setChatInput('');
  };

  const formatClock = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Top Banner / Mode Controls */}
      <div className="glass-card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Play color="var(--accent-gold)" size={24} /> Partida Online, Multijugador & Análisis Stockfish 16
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Partidas en tiempo real contra bots de IA o jugadores reales con reporte de jugadas brillantes (**!!**).
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button className="btn-primary" onClick={() => startNewGame('bot', 1300, 600)}>
            <Cpu size={18} /> VS Bot (1300 Elo)
          </button>

          <button className="btn-gold" onClick={startQuickMatchmaking} disabled={searchingMatch}>
            <Users size={18} /> {searchingMatch ? 'Buscando Oponente...' : 'Búsqueda Rápida Online'}
          </button>

          <button className="btn-secondary" onClick={createPrivateRoom}>
            <Key size={18} color="var(--accent-gold)" /> Crear Sala Privada
          </button>
        </div>
      </div>

      {/* Private Room Joiner Sub-Bar */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', padding: '12px 20px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Unirse a Sala por Código:</span>
        <input
          type="text"
          placeholder="Ej: ROOM-4821"
          value={roomCodeInput}
          onChange={(e) => setRoomCodeInput(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            textTransform: 'uppercase'
          }}
        />
        <button className="btn-secondary" onClick={joinPrivateRoom} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
          Conectarse
        </button>
        {activeRoomCode && (
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginLeft: 'auto', fontWeight: 800 }}>
            🔑 Código de Sala Activo: {activeRoomCode}
          </span>
        )}
      </div>

      {/* Main Game Layout (Board + Evaluation Bar + Sidebar Panel) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', alignItems: 'flex-start' }}>
        {/* Live Centipawn Evaluation Bar */}
        <EvaluationBar scoreCentipawns={evalScore} isFlipped={isFlipped} />

        {/* Board & Player Clocks Wrapper */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%', maxWidth: '580px' }}>
          {/* Opponent Card (Top) */}
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-tertiary)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>{opponentAvatar}</span>
              <div>
                <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>{opponentName}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>⭐ {opponentElo} Elo</span>
              </div>
            </div>

            {/* Clock Timer */}
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                fontWeight: 800,
                backgroundColor: game.turn() === 'b' ? 'var(--accent-gold)' : '#191715',
                color: game.turn() === 'b' ? '#111' : '#fff',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              ⏱️ {formatClock(blackTime)}
            </div>
          </div>

          {/* Interactive Chessboard */}
          <Chessboard
            game={game}
            onMoveMade={handleUserMove}
            isFlipped={isFlipped}
            boardTheme={boardTheme}
            allowMoves={gameActive && !game.isGameOver()}
            lastMove={lastMove}
          />

          {/* User Card (Bottom) */}
          <div
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-tertiary)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.6rem' }}>😎</span>
              <div>
                <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Tú (Jugador)</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)' }}>🏆 {userElo} Elo FIDE</span>
              </div>
            </div>

            {/* Clock Timer */}
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                fontWeight: 800,
                backgroundColor: game.turn() === 'w' ? 'var(--accent-green)' : '#191715',
                color: game.turn() === 'w' ? '#fff' : '#bab8b6',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              ⏱️ {formatClock(whiteTime)}
            </div>
          </div>
        </div>

        {/* Sidebar Controls & Stockfish Analysis Button */}
        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Game Status Announcement Banner */}
          {gameOverReason && (
            <div
              className="glass-card animate-slide-up"
              style={{
                backgroundColor: 'rgba(212, 163, 89, 0.15)',
                borderColor: 'var(--accent-gold)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <Sparkles size={32} color="var(--accent-gold)" style={{ margin: '0 auto' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-gold)' }}>Fin de la Partida</h3>
              <p style={{ fontSize: '0.9rem', color: '#fff' }}>{gameOverReason}</p>

              <button className="btn-primary" onClick={runStockfishAnalysis}>
                <BarChart2 size={18} /> Ver Análisis Stockfish 16 (Precisión %)
              </button>

              <button className="btn-secondary" onClick={() => startNewGame(gameMode, selectedBotElo, timeControl)}>
                <RotateCcw size={16} /> Jugar Otra Partida
              </button>
            </div>
          )}

          {/* Time Control, Player Color & Bot Selector */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontSize: '1rem', color: '#fff' }}>⚙️ Configuración de Partida</h3>

            {/* Side / Color Selector */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Elección de Piezas (Blancas inician la partida):</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {[
                  { id: 'w', label: '⚪ Blancas (Mueves 1.º)' },
                  { id: 'b', label: '⚫ Negras (Bot saca)' },
                  { id: 'random', label: '🎲 Aleatorio' }
                ].map(side => (
                  <button
                    key={side.id}
                    className="btn-secondary"
                    style={{
                      flex: 1,
                      fontSize: '0.75rem',
                      borderColor: playerColor === side.id ? 'var(--accent-gold)' : 'var(--border-color)',
                      color: playerColor === side.id ? 'var(--accent-gold)' : '#fff',
                      fontWeight: playerColor === side.id ? 800 : 500
                    }}
                    onClick={() => startNewGame(gameMode, selectedBotElo, timeControl, side.id)}
                  >
                    {side.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ritmo de Juego:</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {[
                  { label: '1m Bullet', sec: 60 },
                  { label: '3m Blitz', sec: 180 },
                  { label: '10m Rapid', sec: 600 }
                ].map(tc => (
                  <button
                    key={tc.sec}
                    className="btn-secondary"
                    style={{
                      flex: 1,
                      fontSize: '0.75rem',
                      borderColor: timeControl === tc.sec ? 'var(--accent-gold)' : 'var(--border-color)'
                    }}
                    onClick={() => startNewGame(gameMode, selectedBotElo, tc.sec)}
                  >
                    {tc.label}
                  </button>
                ))}
              </div>
            </div>

            {gameMode === 'bot' && (
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bot por Elo:</label>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {[200, 600, 1300, 1800, 2800].map(elo => (
                    <button
                      key={elo}
                      className="btn-secondary"
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.75rem',
                        borderColor: selectedBotElo === elo ? 'var(--accent-gold)' : 'var(--border-color)',
                        color: selectedBotElo === elo ? 'var(--accent-gold)' : 'var(--text-secondary)'
                      }}
                      onClick={() => startNewGame('bot', elo, timeControl)}
                    >
                      {elo} Elo
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Chat Tray in Multiplayer Mode */}
          {gameMode !== 'bot' && (
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={16} color="var(--accent-gold)" /> Chat de Partida Online
              </h3>
              <div
                style={{
                  maxHeight: '120px',
                  overflowY: 'auto',
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                {chatMessages.map((msg, i) => (
                  <div key={i}>
                    <strong style={{ color: 'var(--accent-gold)' }}>{msg.sender}:</strong> {msg.text}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Escribe un mensaje..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem'
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  Enviar
                </button>
              </form>
            </div>
          )}

          {/* Move History / PGN Sheet */}
          <div className="glass-card" style={{ flex: 1, minHeight: '180px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '0.95rem', color: '#fff' }}>📝 Historial de Jugadas (PGN)</h3>
              <button
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                🔄 Girar Tablero
              </button>
            </div>

            <div
              style={{
                flex: 1,
                maxHeight: '200px',
                overflowY: 'auto',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px',
                display: 'grid',
                gridTemplateColumns: '40px 1fr 1fr',
                gap: '6px',
                fontSize: '0.85rem',
                fontFamily: 'monospace'
              }}
            >
              {moveHistory.reduce((acc, move, index) => {
                if (index % 2 === 0) {
                  acc.push({ num: Math.floor(index / 2) + 1, w: move, b: '' });
                } else {
                  acc[acc.length - 1].b = move;
                }
                return acc;
              }, []).map(row => (
                <React.Fragment key={row.num}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.num}.</span>
                  <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{row.w}</span>
                  <span style={{ color: 'var(--accent-gold)' }}>{row.b}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* STOCKFISH 16 ANALYSIS MODAL REPORT */}
      {showAnalysisModal && analysisReport && (
        <div className="promotion-overlay animate-slide-up" style={{ zIndex: 2000 }}>
          <div
            className="glass-card"
            style={{
              maxWidth: '650px',
              width: '92%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '2px solid var(--accent-gold)',
              backgroundColor: 'var(--bg-primary)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={24} /> Reporte de Análisis Stockfish 16
              </h3>
              <button className="btn-secondary" onClick={() => setShowAnalysisModal(false)} style={{ padding: '4px 10px' }}>
                ✕
              </button>
            </div>

            {/* Accuracy Score Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div className="glass-card" style={{ textAlign: 'center', borderColor: 'var(--accent-green)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Precisión Blancas</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-green)' }}>
                  {analysisReport.whiteAccuracy}%
                </div>
              </div>
              <div className="glass-card" style={{ textAlign: 'center', borderColor: 'var(--accent-gold)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Precisión Negras</span>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-gold)' }}>
                  {analysisReport.blackAccuracy}%
                </div>
              </div>
            </div>

            {/* Classification Breakdown Summary */}
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '10px' }}>📊 Desglose de Calidad de Jugadas:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid #38bdf8', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>🌟 Brillante (!!)</span>
                <div style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 800 }}>{analysisReport.summary.white.brilliants}</div>
              </div>

              <div style={{ backgroundColor: 'rgba(107, 158, 67, 0.15)', border: '1px solid #6b9e43', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#6b9e43', fontWeight: 700 }}>✨ Excelente (!)</span>
                <div style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 800 }}>{analysisReport.summary.white.bests}</div>
              </div>

              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700 }}>⚠️ Imprecisión (?!)</span>
                <div style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 800 }}>{analysisReport.summary.white.inaccuracies}</div>
              </div>

              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700 }}>❌ Error (??)</span>
                <div style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 800 }}>{analysisReport.summary.white.blunders}</div>
              </div>
            </div>

            {/* Detailed Move Classification List */}
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '10px' }}>🔍 Clasificación de Jugadas:</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px' }}>
              {analysisReport.moveAnalyses.map(item => (
                <div key={item.ply} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                  <span>Jugada {item.ply}. <strong>{item.moveSan}</strong></span>
                  <span style={{ color: item.classification.color, fontWeight: 800 }}>
                    {item.classification.icon} {item.classification.label} ({item.classification.badge})
                  </span>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={() => setShowAnalysisModal(false)} style={{ width: '100%', marginTop: '16px' }}>
              Cerrar Reporte de Análisis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
