import React, { useState } from 'react';
import Navbar from './components/Navbar';
import PlayZone from './pages/PlayZone';
import LearnZone from './pages/LearnZone';
import PuzzleZone from './pages/PuzzleZone';
import TrainingZone from './pages/TrainingZone';
import VideoZone from './pages/VideoZone';
import ProfileZone from './pages/ProfileZone';

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
            {renderCurrentZone()}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Navigation Bar */}
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

        {/* Scrollable Viewport Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px' }}>
          {renderCurrentZone()}
        </main>
      </div>
    </div>
  );
}
