import React, { useCallback, useState } from 'react';
import { GameBoard } from './components/GameBoard';
import { GameHeader } from './components/GameHeader';
import { HomeScreen } from './components/HomeScreen';
import { ParentControls } from './components/ParentControls';
import { StickerBookModal } from './components/StickerBookModal';
import { TutorialOverlay } from './components/TutorialOverlay';
import { VictoryScreen } from './components/VictoryScreen';
import { useAudio } from './hooks/useAudio';
import { useGameState } from './hooks/useGameState';

export const App: React.FC = () => {
  const [soundEnabledState, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const raw = window.localStorage.getItem('be_noi_bong_mau_progress_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.soundEnabled === 'boolean') {
          return parsed.soundEnabled;
        }
      }
    } catch {
      // Bỏ qua
    }
    return true;
  });

  const [isLevelPickerOpen, setIsLevelPickerOpen] = useState(false);
  const [isStickerBookOpen, setIsStickerBookOpen] = useState(false);

  const handleToggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      try {
        const raw = window.localStorage.getItem('be_noi_bong_mau_progress_v1');
        const parsed = raw ? JSON.parse(raw) : {};
        window.localStorage.setItem(
          'be_noi_bong_mau_progress_v1',
          JSON.stringify({ ...parsed, soundEnabled: next })
        );
      } catch {
        // Bỏ qua
      }
      return next;
    });
  }, []);

  const audio = useAudio(soundEnabledState, handleToggleSound);

  const {
    progress,
    screen,
    currentLevel,
    completedConnections,
    activeHint,
    fadingMissLine,
    sparkleBurst,
    newlyUnlockedSticker,
    mascotMessage,
    mascotMood,
    earnedStars,
    victoryPraise,
    selectAgeGroup,
    selectGameMode,
    startGameFromHome,
    finishTutorial,
    goToLevel,
    resetCurrentLevelBoard,
    triggerHint,
    handleAttemptConnection,
    goToNextLevel,
    goHome,
    toggleNonCrossingMode
  } = useGameState(audio);

  return (
    <div className="app-shell">
      {screen === 'home' && (
        <HomeScreen
          selectedAge={progress.selectedAge}
          selectedMode={progress.gameMode}
          nonCrossingMode={progress.nonCrossingMode}
          starsByLevel={progress.starsByLevel}
          soundEnabled={audio.soundEnabled}
          onSelectAge={(age) => {
            audio.playBallTouch();
            selectAgeGroup(age);
          }}
          onSelectMode={(mode) => {
            audio.playBallTouch();
            selectGameMode(mode);
          }}
          onToggleNonCrossing={() => {
            audio.playBallTouch();
            toggleNonCrossingMode();
          }}
          onStartPlay={() => {
            audio.playPairConnected();
            startGameFromHome(false);
          }}
          onStartHardMazeLevels={() => {
            audio.playPairConnected();
            goToLevel(21);
          }}
          onOpenTutorial={() => {
            audio.playBallTouch();
            startGameFromHome(true);
          }}
          onOpenLevelPicker={() => {
            audio.playBallTouch();
            setIsLevelPickerOpen(true);
          }}
          onOpenStickerBook={() => {
            audio.playHintChime();
            setIsStickerBookOpen(true);
          }}
          onToggleSound={audio.toggleSound}
        />
      )}

      {screen === 'tutorial' && (
        <TutorialOverlay
          soundEnabled={audio.soundEnabled}
          onToggleSound={audio.toggleSound}
          onCompleteTutorial={() => {
            audio.playBallTouch();
            finishTutorial();
          }}
          onPlaySuccessSound={audio.playPairConnected}
          onPlayTouchSound={audio.playBallTouch}
        />
      )}

      {screen === 'game' && (
        <div className="game-screen-container" data-testid="game-screen">
          <GameHeader
            levelId={currentLevel.id}
            levelTitle={currentLevel.title}
            pairsCount={currentLevel.pairsCount}
            completedPairsCount={completedConnections.length}
            levelColors={currentLevel.colors}
            preventCrossing={currentLevel.preventCrossing}
            soundEnabled={audio.soundEnabled}
            onToggleSound={audio.toggleSound}
            onToggleNonCrossing={() => {
              audio.playBallTouch();
              toggleNonCrossingMode();
            }}
            onGoHome={() => {
              audio.playBallTouch();
              goHome();
            }}
            onOpenLevelPicker={() => {
              audio.playBallTouch();
              setIsLevelPickerOpen(true);
            }}
          />

          <GameBoard
            level={currentLevel}
            gameMode={progress.gameMode}
            completedConnections={completedConnections}
            activeHint={activeHint}
            fadingMissLine={fadingMissLine}
            sparkleBurst={sparkleBurst}
            mascotMessage={mascotMessage}
            mascotMood={mascotMood}
            onBallTouchSound={audio.playBallTouch}
            onHoverTargetSound={audio.playTargetHover}
            onAttemptConnection={handleAttemptConnection}
            onTriggerHint={() => triggerHint(false)}
            onReplayLevel={() => {
              audio.playBallTouch();
              resetCurrentLevelBoard('Mình thử nối lại từ đầu nhé!');
            }}
            onChangeGameMode={(mode) => {
              audio.playBallTouch();
              selectGameMode(mode);
            }}
          />
        </div>
      )}

      {screen === 'victory' && (
        <VictoryScreen
          levelId={currentLevel.id}
          earnedStars={earnedStars}
          praiseText={victoryPraise}
          levelColors={currentLevel.colors}
          newlyUnlockedSticker={newlyUnlockedSticker}
          soundEnabled={audio.soundEnabled}
          onToggleSound={audio.toggleSound}
          onNextLevel={() => {
            audio.playBallTouch();
            goToNextLevel();
          }}
          onGoHome={() => {
            audio.playBallTouch();
            goHome();
          }}
          onOpenStickerBook={() => {
            audio.playHintChime();
            setIsStickerBookOpen(true);
          }}
          onPlayStarSound={audio.playStarEarned}
        />
      )}

      <ParentControls
        isOpen={isLevelPickerOpen}
        currentLevelId={currentLevel.id}
        starsByLevel={progress.starsByLevel}
        nonCrossingMode={progress.nonCrossingMode}
        onSelectLevel={goToLevel}
        onToggleNonCrossing={toggleNonCrossingMode}
        onOpenTutorial={() => startGameFromHome(true)}
        onClose={() => setIsLevelPickerOpen(false)}
      />

      <StickerBookModal
        isOpen={isStickerBookOpen}
        starsByLevel={progress.starsByLevel}
        onPlayStickerSound={audio.playPairConnected}
        onClose={() => setIsStickerBookOpen(false)}
      />
    </div>
  );
};

export default App;
