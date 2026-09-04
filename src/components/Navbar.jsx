import React, { useEffect, useState } from 'react';
import { Play, BookOpen, Target, Dumbbell, Video, User, Volume2, VolumeX, Flame, Download, Settings } from 'lucide-react';
import { soundFx } from '../services/audio';

const LOGO = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/channels4_profile-m7vEPiMJdWz72exzr6kwYMI0ACLhLE.jpg';

export default function Navbar({ currentTab, setCurrentTab, isMobileSim, setIsMobileSim, userElo = 1250, streak = 5, soundEnabled = true, setSoundEnabled }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  useEffect(() => {
    const handler = (event) => { event.preventDefault(); setDeferredPrompt(event); };
    window.addEventListener('beforeinstallprompt', handler);
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const navItems = [
    { id: 'play', label: 'Jugar', icon: Play },
    { id: 'learn', label: 'Aprender', icon: BookOpen },
    { id: 'puzzles', label: 'Puzzles', icon: Target },
    { id: 'training', label: 'Entrenar', icon: Dumbbell },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'profile', label: 'Perfil', icon: User },
  ];
  const changeTab = (id) => { soundFx.playButtonClick(); setCurrentTab(id); };
  const install = () => {
    if (deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.then(() => setDeferredPrompt(null)); }
    else alert('En tu navegador, elige “Agregar a la pantalla de inicio” para instalar Arandu Chess.');
  };

  return <>
    <aside className="platform-sidebar">
      <button className="brand-lockup" onClick={() => changeTab('play')} aria-label="Ir al inicio">
        <img src={LOGO} alt="Arandu Chess" />
        <span><strong>ARANDU</strong><b>CHESS</b></span>
      </button>
      <div className="sidebar-section-label">JUGAR</div>
      <nav className="platform-nav">
        {navItems.slice(0, 1).map(({ id, label, icon: Icon }) => <button key={id} className={currentTab === id ? 'active' : ''} onClick={() => changeTab(id)}><Icon size={19} /><span>{label}</span><em>›</em></button>)}
      </nav>
      <div className="sidebar-section-label">MEJORAR</div>
      <nav className="platform-nav">
        {navItems.slice(1, 4).map(({ id, label, icon: Icon }) => <button key={id} className={currentTab === id ? 'active' : ''} onClick={() => changeTab(id)}><Icon size={19} /><span>{label}</span></button>)}
      </nav>
      <div className="sidebar-section-label">INSPIRACIÓN</div>
      <nav className="platform-nav">
        {navItems.slice(4).map(({ id, label, icon: Icon }) => <button key={id} className={currentTab === id ? 'active' : ''} onClick={() => changeTab(id)}><Icon size={19} /><span>{label}</span></button>)}
      </nav>
      <div className="sidebar-spacer" />
      <div className="sidebar-profile"><div className="avatar-mark">A</div><div><strong>Jugador Arandu</strong><span>{userElo} ELO</span></div><Settings size={16} /></div>
    </aside>
    <header className="mobile-topbar">
      <button className="mobile-brand" onClick={() => changeTab('play')}><img src={LOGO} alt="Arandu Chess" /><strong>ARANDU <b>CHESS</b></strong></button>
      <div className="mobile-actions"><span><Flame size={16} />{streak}</span><button onClick={() => { const next = !soundEnabled; setSoundEnabled(next); soundFx.toggleSound(next); }} aria-label="Sonido">{soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}</button></div>
    </header>
    <div className="mobile-bottom-nav">{navItems.slice(0, 5).map(({ id, label, icon: Icon }) => <button key={id} className={currentTab === id ? 'active' : ''} onClick={() => changeTab(id)}><Icon size={19} /><span>{label}</span></button>)}</div>
    <div className="desktop-utility"><span><Flame size={16} /> {streak} días</span>{!isStandalone && <button onClick={install}><Download size={15} /> Instalar</button>}<button onClick={() => { const next = !soundEnabled; setSoundEnabled(next); soundFx.toggleSound(next); }}>{soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button></div>
  </>;
}
