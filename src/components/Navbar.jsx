import React, { useState, useEffect } from 'react';
import { Play, BookOpen, Target, Dumbbell, Video, User, Smartphone, Volume2, VolumeX, Flame, Download } from 'lucide-react';
import { soundFx } from '../services/audio';

/**
 * Navbar component - Arandu Chess Edition with Logo Image
 */
export default function Navbar({
  currentTab,
  setCurrentTab,
  isMobileSim,
  setIsMobileSim,
  userElo = 1250,
  streak = 5,
  soundEnabled = true,
  setSoundEnabled
}) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }
  }, []);

  const navItems = [
    { id: 'play', label: 'Jugar', icon: Play, badge: 'Online' },
    { id: 'learn', label: 'Aprender', icon: BookOpen, badge: 'Elo FIDE' },
    { id: 'puzzles', label: 'Ejercicios', icon: Target, badge: 'Puzzles' },
    { id: 'training', label: 'Entrenar', icon: Dumbbell, badge: 'Bots' },
    { id: 'videos', label: 'Videos', icon: Video, badge: 'Clases' },
    { id: 'profile', label: 'Perfil', icon: User, badge: `${userElo}` }
  ];

  const handleTabChange = (tabId) => {
    soundFx.playButtonClick();
    setCurrentTab(tabId);
  };

  const handleMobileSimToggle = () => {
    soundFx.playButtonClick();
    setIsMobileSim(!isMobileSim);
  };

  const handleSoundToggle = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundFx.toggleSound(nextState);
    if (nextState) soundFx.playButtonClick();
  };

  const handleInstallPWA = () => {
    soundFx.playButtonClick();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuario instalo Arandu Chess PWA');
        }
        setDeferredPrompt(null);
      });
    } else {
      alert('Para instalar Arandu Chess en tu celular:\n1. Abre esta página en Chrome o Safari.\n2. Presiona "Agregar a la pantalla de inicio".');
    }
  };

  return (
    <>
      {/* Desktop Top Header Bar */}
      <header
        style={{
          height: 'var(--header-height)',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color-strong)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 100
        }}
      >
        {/* Brand Logo Image & Title */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => handleTabChange('play')}
        >
          <img
            src="/arandu-logo.png"
            alt="Arandu Chess Logo"
            style={{
              height: '46px',
              width: 'auto',
              borderRadius: '8px',
              objectFit: 'contain',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
            }}
          />
          <div>
            <h2 className="font-cinzel" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              ARANDU <span style={{ color: 'var(--accent-gold)' }}>CHESS</span>
            </h2>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              AJEDREZ INTERACTIVO & MÓVIL
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-only-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '800' : '600',
                  fontSize: '0.9rem',
                  border: isActive ? '1px solid var(--accent-gold)' : '1px solid transparent'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent-gold)' : 'var(--text-secondary)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Stats & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Daily Streak Counter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-tertiary)',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--accent-gold)',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--accent-gold)'
            }}
            title="¡Racha Diaria de Ajedrez!"
          >
            <Flame size={16} color="#ef4444" /> <span>{streak} días</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            style={{
              background: 'var(--bg-tertiary)',
              color: soundEnabled ? 'var(--accent-gold)' : 'var(--text-muted)',
              padding: '9px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)'
            }}
            title={soundEnabled ? 'Silenciar sonidos de madera' : 'Activar sonidos de madera'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* PWA Install Button */}
          {!isStandalone && (
            <button
              onClick={handleInstallPWA}
              className="btn-gold"
              style={{ padding: '7px 12px', fontSize: '0.8rem' }}
              title="Instalar Arandu Chess en tu Celular"
            >
              <Download size={15} /> Instalar App
            </button>
          )}

          {/* Mobile Simulator Mode Toggle Button */}
          <button
            onClick={handleMobileSimToggle}
            className={isMobileSim ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
            title="Alternar vista simulada de Celular / Escritorio"
          >
            <Smartphone size={16} />
            <span>{isMobileSim ? 'Vista PC' : 'Vista Celular'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div
        className="mobile-bottom-nav"
        style={{
          position: isMobileSim ? 'absolute' : 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'var(--mobile-nav-height)',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color-strong)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 900
        }}
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px',
                background: 'none',
                color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
                fontSize: '0.75rem',
                fontWeight: isActive ? 800 : 500,
                width: '16%'
              }}
            >
              <Icon size={20} color={isActive ? 'var(--accent-gold)' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
