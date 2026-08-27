import React from 'react';
import { Trophy, Palette } from 'lucide-react';

/**
 * ProfileZone - Player Profile Dashboard & Theme Customizer
 */
export default function ProfileZone({
  userElo,
  puzzleRating,
  streak,
  boardTheme,
  setBoardTheme,
  soundEnabled,
  setSoundEnabled
}) {
  const achievements = [
    { title: 'Primeros Pasos', desc: 'Completaste tu primera lección teórica', unlocked: true, icon: '🌱' },
    { title: 'Táctico Implacable', desc: 'Alcanzaste 1200+ Elo en Puzzles', unlocked: puzzleRating >= 1200, icon: '🎯' },
    { title: 'Racha de Fuego', desc: 'Mantén una racha de 5 días seguidos', unlocked: streak >= 5, icon: '🔥' },
    { title: 'Vencedor de Bots', desc: 'Derrota al Bot Nelson (1300 Elo)', unlocked: true, icon: '🤖' },
    { title: 'Gran Maestro en Ciernes', desc: 'Supera 1800 Elo FIDE', unlocked: userElo >= 1800, icon: '👑' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* User Header Profile Card */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-gold) 0%, #c49620 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            boxShadow: '0 8px 20px rgba(240, 192, 64, 0.4)'
          }}
        >
          😎
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Ajedrecista Pro <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--accent-green)', color: '#111', padding: '2px 8px', borderRadius: '4px' }}>PRO MEMBER</span>
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Miembro desde 2026 • Rango FIDE: Candidato a Maestro</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ELO FIDE</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-green)' }}>{userElo}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PUZZLE ELO</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{puzzleRating}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>RACHA</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>{streak}d 🔥</div>
          </div>
        </div>
      </div>

      {/* Board Theme & Settings Customizer */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Palette color="var(--accent-green)" size={20} /> Personalización de Tablero y Estilo
        </h3>

        <div>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estilos de Tablero Disponibles:</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '8px' }}>
            {[
              { id: 'default', name: 'Verde Clásico (Chess.com)', color: '#769656' },
              { id: 'wood', name: 'Madera Tradicional', color: '#b58863' },
              { id: 'cyber', name: 'Neón Cyberpunk', color: '#19212c' },
              { id: 'glass', name: 'Cristal Elegante', color: '#64748b' }
            ].map(theme => (
              <div
                key={theme.id}
                onClick={() => setBoardTheme(theme.id)}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: boardTheme === theme.id ? '2px solid var(--accent-green)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: theme.color }} />
                <span style={{ fontSize: '0.85rem', color: boardTheme === theme.id ? 'var(--accent-green)' : '#fff', fontWeight: 600 }}>
                  {theme.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border-color)' }} />

        {/* Audio Preferences */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>Efectos de Sonido Web Audio</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sonidos sintetizados sin latencia para movimientos y capturas</p>
          </div>
          <button
            className={soundEnabled ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? 'Sonido Activado 🔊' : 'Sonido Silenciado 🔇'}
          </button>
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy color="var(--accent-gold)" size={20} /> Logros Desbloqueados
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: ach.unlocked ? 'rgba(129, 182, 76, 0.1)' : 'var(--bg-secondary)',
                border: ach.unlocked ? '1px solid var(--accent-green)' : '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                opacity: ach.unlocked ? 1 : 0.5
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>{ach.icon}</span>
              <div>
                <h4 style={{ fontSize: '0.88rem', color: ach.unlocked ? 'var(--accent-green)' : '#fff' }}>
                  {ach.title}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
