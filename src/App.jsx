import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PlayZone from './pages/PlayZone';
import LearnZone from './pages/LearnZone';
import PuzzleZone from './pages/PuzzleZone';
import TrainingZone from './pages/TrainingZone';
import VideoZone from './pages/VideoZone';
import ProfileZone from './pages/ProfileZone';

class ZoneErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('[v0] Zone render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="zone-error" role="alert">
          <h1>No se pudo cargar esta zona</h1>
          <p>La plataforma sigue disponible. Recarga la página para intentarlo nuevamente.</p>
          <button className="btn-primary" onClick={() => this.setState({ hasError: false })}>Reintentar</button>
        </section>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentTab, setCurrentTab] = useState('play');
  const [isMobileSim, setIsMobileSim] = useState(false);

  // User progression stats
  const [userElo, setUserElo] = useState(1250);
  const [puzzleRating, setPuzzleRating] = useState(1320);
  const [streak, setStreak] = useState(5);
  const [selectedBotElo, setSelectedBotElo] = useState(1300);

  // Master Woodcraft default board theme
  const [boardTheme, setBoardTheme] = useState('wood'); // 'wood' | 'default' | 'cyber' | 'glass'
  const [soundEnabled, setSoundEnabled] = useState(true);

  const updateUserElo = (newElo) => {
    setUserElo(newElo);
  };

  const handleSelectBotFromTraining = (botElo) => {
    setSelectedBotElo(botElo);
    setCurrentTab('play');
  };

  const renderCurrentZone = () => {
    switch (currentTab) {
      case 'play':
        return (
          <PlayZone
            userElo={userElo}
            updateUserElo={updateUserElo}
            boardTheme={boardTheme}
            initialBotElo={selectedBotElo}
          />
        );
      case 'learn':
        return (
          <LearnZone
            userElo={userElo}
            updateUserElo={updateUserElo}
            boardTheme={boardTheme}
          />
        );
      case 'puzzles':
        return (
          <PuzzleZone
            puzzleRating={puzzleRating}
            setPuzzleRating={setPuzzleRating}
            boardTheme={boardTheme}
          />
        );
      case 'training':
        return (
          <TrainingZone
            boardTheme={boardTheme}
            onSelectBot={handleSelectBotFromTraining}
          />
        );
      case 'videos':
        return <VideoZone />;
      case 'profile':
        return (
          <ProfileZone
            userElo={userElo}
            puzzleRating={puzzleRating}
            streak={streak}
            boardTheme={boardTheme}
            setBoardTheme={setBoardTheme}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
        );
      default:
        return <PlayZone userElo={userElo} updateUserElo={updateUserElo} boardTheme={boardTheme} />;
    }
  };

  if (isMobileSim) {
    return (
      <div className="mobile-frame-wrapper">
        <div className="mobile-phone-frame">
          <div className="phone-notch" />

          {/* Desktop Top Header Bar inside Frame */}
          <Navbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            isMobileSim={isMobileSim}
            setIsMobileSim={setIsMobileSim}
            userElo={userElo}
            streak={streak}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />

          {/* Scrollable Mobile Body Content */}
          <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px', paddingTop: '10px' }}>
            <ZoneErrorBoundary>{renderCurrentZone()}</ZoneErrorBoundary>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container platform-shell">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isMobileSim={isMobileSim}
        setIsMobileSim={setIsMobileSim}
        userElo={userElo}
        streak={streak}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
      <div className="platform-main">
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
          <ZoneErrorBoundary>{renderCurrentZone()}</ZoneErrorBoundary>
        </main>
      </div>
    </div>
  );
}
