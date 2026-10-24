import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AdaptivePerformance,
  AgeGroup,
  BALL_COLORS,
  BallNode,
  CompletedConnection,
  GameMode,
  HintPair,
  Point,
  ScreenName,
  SparkleEffect,
  StickerDefinition
} from '../game/gameTypes';
import {
  calculateStarsForCompletion,
  createInitialAdaptiveState,
  getAutoHintIdleDelayMs,
  recordLevelCompletion
} from '../game/adaptiveDifficulty';
import {
  evaluateConnectionAttempt,
  findNextHintPair
} from '../game/connectionRules';
import {
  buildActiveLevelConfig,
  getNewlyUnlockedSticker,
  getStartingLevelForAge,
  getTotalStarsEarned,
  isLevelComplete,
  loadProgressFromStorage,
  PersistentProgress,
  PRAISE_MESSAGES_VI,
  saveProgressToStorage,
  STEP_PRAISE_VI
} from '../game/gameEngine';
import { GameAudioController } from './useAudio';

export type MascotMood = 'happy' | 'excited' | 'encouraging' | 'celebrating';

export function useGameState(audio: GameAudioController) {
  const [progress, setProgress] = useState<PersistentProgress>(() =>
    loadProgressFromStorage()
  );
  const [screen, setScreen] = useState<ScreenName>('home');
  const [adaptive, setAdaptive] = useState<AdaptivePerformance>(() =>
    createInitialAdaptiveState()
  );
  const [completedConnections, setCompletedConnections] = useState<CompletedConnection[]>([]);
  const [activeHint, setActiveHint] = useState<HintPair | null>(null);
  const [fadingMissLine, setFadingMissLine] = useState<{
    points: Point[];
    colorId: BallNode['colorId'];
  } | null>(null);
  const [sparkleBurst, setSparkleBurst] = useState<SparkleEffect | null>(null);
  const [newlyUnlockedSticker, setNewlyUnlockedSticker] =
    useState<StickerDefinition | null>(null);
  const [mascotMessage, setMascotMessage] = useState<string>(
    'Tìm hai quả bóng cùng màu và nối chúng lại nhé!'
  );
  const [mascotMood, setMascotMood] = useState<MascotMood>('happy');
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [victoryPraise, setVictoryPraise] = useState<string>(PRAISE_MESSAGES_VI[0]);

  const victoryTriggeredRef = useRef<boolean>(false);
  const hintTimeoutRef = useRef<number | null>(null);
  const idleHintTimerRef = useRef<number | null>(null);
  const sparkleTimerRef = useRef<number | null>(null);
  const autoHintShownForPairRef = useRef<string | null>(null);

  useEffect(() => {
    saveProgressToStorage(progress);
  }, [progress]);

  const currentLevel = useMemo(
    () =>
      buildActiveLevelConfig(
        progress.currentLevelId,
        adaptive,
        progress.nonCrossingMode
      ),
    [progress.currentLevelId, adaptive, progress.nonCrossingMode]
  );

  const clearTimers = useCallback(() => {
    if (hintTimeoutRef.current !== null) {
      window.clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    if (idleHintTimerRef.current !== null) {
      window.clearTimeout(idleHintTimerRef.current);
      idleHintTimerRef.current = null;
    }
    if (sparkleTimerRef.current !== null) {
      window.clearTimeout(sparkleTimerRef.current);
      sparkleTimerRef.current = null;
    }
  }, []);

  const resetCurrentLevelBoard = useCallback(
    (customMessage?: string) => {
      clearTimers();
      victoryTriggeredRef.current = false;
      autoHintShownForPairRef.current = null;
      setCompletedConnections([]);
      setActiveHint(null);
      setFadingMissLine(null);
      setSparkleBurst(null);
      setNewlyUnlockedSticker(null);
      setMascotMood('happy');
      setMascotMessage(
        customMessage ?? 'Con kéo bóng đến bóng cùng màu nhé!'
      );
      setAdaptive((prev) => ({
        ...prev,
        wrongAttemptsInLevel: 0,
        hintsUsedInLevel: 0
      }));
    },
    [clearTimers]
  );

  const selectAgeGroup = useCallback((age: AgeGroup) => {
    const targetStartLevel = getStartingLevelForAge(age);
    setProgress((prev) => ({
      ...prev,
      selectedAge: age,
      currentLevelId: targetStartLevel
    }));
  }, []);

  const selectGameMode = useCallback((gameMode: GameMode) => {
    setProgress((prev) => ({
      ...prev,
      gameMode
    }));
  }, []);

  const startGameFromHome = useCallback(
    (forceTutorial?: boolean) => {
      resetCurrentLevelBoard();
      if (forceTutorial || !progress.tutorialSeen) {
        setScreen('tutorial');
      } else {
        setScreen('game');
      }
    },
    [progress.tutorialSeen, resetCurrentLevelBoard]
  );

  const finishTutorial = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      tutorialSeen: true
    }));
    resetCurrentLevelBoard('Con kéo bóng đến bóng cùng màu nhé!');
    setScreen('game');
  }, [resetCurrentLevelBoard]);

  const goToLevel = useCallback(
    (levelId: number) => {
      const safeId = Math.max(1, levelId);
      setProgress((prev) => ({
        ...prev,
        currentLevelId: safeId,
        selectedAge: safeId <= 10 ? 3 : 4
      }));
      resetCurrentLevelBoard();
      setScreen('game');
    },
    [resetCurrentLevelBoard]
  );

  const triggerHint = useCallback(
    (isAuto: boolean = false) => {
      if (screen !== 'game' || victoryTriggeredRef.current) return;
      const pair = findNextHintPair(currentLevel.balls, completedConnections);
      if (!pair) return;

      if (hintTimeoutRef.current !== null) {
        window.clearTimeout(hintTimeoutRef.current);
      }

      const colorInfo = BALL_COLORS[pair.colorId];
      setActiveHint(pair);
      setMascotMood('encouraging');
      setMascotMessage(
        progress.gameMode === 'animals'
          ? `Gợi ý: Đưa ${colorInfo.animalPair.animalNameVi} đến với ${colorInfo.animalPair.foodNameVi} nhé!`
          : `Thỏ Bông gợi ý hai bạn ${colorInfo.nameVi} này nhé!`
      );
      audio.playHintChime();

      if (!isAuto) {
        setAdaptive((prev) => ({
          ...prev,
          hintsUsedInLevel: prev.hintsUsedInLevel + 1
        }));
      }

      hintTimeoutRef.current = window.setTimeout(() => {
        setActiveHint(null);
      }, 3400);
    },
    [audio, completedConnections, currentLevel.balls, progress.gameMode, screen]
  );

  useEffect(() => {
    if (screen !== 'game' || victoryTriggeredRef.current) {
      if (idleHintTimerRef.current !== null) {
        window.clearTimeout(idleHintTimerRef.current);
      }
      return;
    }

    const nextPair = findNextHintPair(currentLevel.balls, completedConnections);
    if (!nextPair) return;

    const pairKey = `${currentLevel.id}-${completedConnections.length}-${nextPair.fromBallId}`;
    if (autoHintShownForPairRef.current === pairKey) {
      return;
    }

    const delayMs = getAutoHintIdleDelayMs(progress.selectedAge, adaptive);
    idleHintTimerRef.current = window.setTimeout(() => {
      autoHintShownForPairRef.current = pairKey;
      triggerHint(true);
    }, delayMs);

    return () => {
      if (idleHintTimerRef.current !== null) {
        window.clearTimeout(idleHintTimerRef.current);
      }
    };
  }, [
    adaptive,
    completedConnections,
    currentLevel.balls,
    currentLevel.id,
    progress.selectedAge,
    screen,
    triggerHint
  ]);

  const handleAttemptConnection = useCallback(
    (params: {
      startBall: BallNode;
      releasePoint: Point;
      dragPathPoints: Point[];
      hitRadiusNormalized: number;
      visualRadiusNormalized?: number;
      isLandscape: boolean;
    }) => {
      if (victoryTriggeredRef.current) return;

      const result = evaluateConnectionAttempt({
        startBall: params.startBall,
        releasePoint: params.releasePoint,
        dragPathPoints: params.dragPathPoints,
        balls: currentLevel.balls,
        completedConnections,
        hitRadiusNormalized: params.hitRadiusNormalized,
        visualRadiusNormalized: params.visualRadiusNormalized,
        isLandscape: params.isLandscape,
        preventCrossing: currentLevel.preventCrossing
      });

      if (result.status === 'valid' && result.connection && result.targetBall) {
        const nextConnections = [...completedConnections, result.connection];
        setCompletedConnections(nextConnections);
        setActiveHint(null);
        setFadingMissLine(null);

        const colorDef = BALL_COLORS[params.startBall.colorId];
        const vocabLabel =
          progress.gameMode === 'animals'
            ? `${colorDef.animalPair.animalEmoji} ${colorDef.animalPair.animalNameVi} & ${colorDef.animalPair.foodNameVi} ${colorDef.animalPair.foodEmoji}`
            : progress.gameMode === 'shapes'
              ? `✨ ${colorDef.shapeNameVi}!`
              : `🎈 ${colorDef.nameVi}!`;

        // Hiệu ứng hạt lấp lánh và thẻ từ vựng
        setSparkleBurst({
          id: result.connection.id,
          colorHex: colorDef.hex,
          points: [
            { x: params.startBall.x, y: params.startBall.y },
            { x: result.targetBall.x, y: result.targetBall.y }
          ],
          labelVi: vocabLabel
        });
        if (sparkleTimerRef.current !== null) {
          window.clearTimeout(sparkleTimerRef.current);
        }
        sparkleTimerRef.current = window.setTimeout(() => {
          setSparkleBurst(null);
        }, 1450);

        const praiseText =
          STEP_PRAISE_VI[nextConnections.length % STEP_PRAISE_VI.length];
        setMascotMood('excited');
        setMascotMessage(`${praiseText} ${vocabLabel}`);
        audio.playPairConnected();

        if (
          isLevelComplete(currentLevel, nextConnections) &&
          !victoryTriggeredRef.current
        ) {
          victoryTriggeredRef.current = true;
          if (hintTimeoutRef.current !== null) window.clearTimeout(hintTimeoutRef.current);
          if (idleHintTimerRef.current !== null) window.clearTimeout(idleHintTimerRef.current);

          const stars = calculateStarsForCompletion(adaptive, progress.selectedAge);
          const nextAdaptive = recordLevelCompletion(adaptive);
          const randomPraise =
            PRAISE_MESSAGES_VI[currentLevel.id % PRAISE_MESSAGES_VI.length];

          const prevTotalStars = getTotalStarsEarned(progress.starsByLevel);
          const updatedStarsMap = {
            ...progress.starsByLevel,
            [currentLevel.id]: Math.max(progress.starsByLevel[currentLevel.id] ?? 0, stars)
          };
          const nextTotalStars = getTotalStarsEarned(updatedStarsMap);
          const unlockedSticker = getNewlyUnlockedSticker(prevTotalStars, nextTotalStars);

          setEarnedStars(stars);
          setVictoryPraise(randomPraise);
          setNewlyUnlockedSticker(unlockedSticker);
          setAdaptive(nextAdaptive);
          setMascotMood('celebrating');
          setMascotMessage(randomPraise);

          const nextLevelId = currentLevel.id + 1;
          setProgress((prev) => ({
            ...prev,
            unlockedLevelIds: Array.from(
              new Set([...prev.unlockedLevelIds, currentLevel.id, nextLevelId])
            ),
            starsByLevel: updatedStarsMap
          }));

          window.setTimeout(() => {
            audio.playLevelVictory();
            audio.speakPraiseVi('Giỏi quá! Con làm tốt lắm!');
            setScreen('victory');
          }, 560);
        } else {
          audio.speakPraiseVi(`${colorDef.nameVi}. ${praiseText}`);
        }
        return;
      }

      if (params.dragPathPoints.length >= 2) {
        setFadingMissLine({
          points: params.dragPathPoints,
          colorId: params.startBall.colorId
        });
        window.setTimeout(() => {
          setFadingMissLine(null);
        }, 280);
      }

      if (result.status === 'wrong_color') {
        audio.playGentleMiss();
        setMascotMood('encouraging');
        setMascotMessage('Ồ, hai bóng này khác màu rồi! Con tìm bóng cùng màu nhé!');
        setAdaptive((prev) => {
          const nextWrong = prev.wrongAttemptsInLevel + 1;
          return {
            ...prev,
            wrongAttemptsInLevel: nextWrong,
            assistanceBoost: nextWrong >= 3 ? true : prev.assistanceBoost
          };
        });
      } else if (result.status === 'crossing_blocked') {
        audio.playGentleMiss();
        setMascotMood('encouraging');
        setMascotMessage('Đường nối bị vướng rồi, mình đi vòng qua nhé!');
      } else if (result.status === 'outside_target') {
        audio.playGentleMiss();
        setMascotMood('happy');
        setMascotMessage('Con kéo đường nối chạm tới quả bóng cùng màu nhé!');
      }
    },
    [
      adaptive,
      audio,
      completedConnections,
      currentLevel,
      progress.gameMode,
      progress.selectedAge,
      progress.starsByLevel
    ]
  );

  const goToNextLevel = useCallback(() => {
    const nextId = currentLevel.id + 1;
    setProgress((prev) => ({
      ...prev,
      currentLevelId: nextId,
      selectedAge: nextId <= 10 ? 3 : 4
    }));
    resetCurrentLevelBoard('Mình chơi tiếp nhé!');
    setScreen('game');
  }, [currentLevel.id, resetCurrentLevelBoard]);

  const goHome = useCallback(() => {
    clearTimers();
    setScreen('home');
  }, [clearTimers]);

  const toggleNonCrossingMode = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      nonCrossingMode: !prev.nonCrossingMode
    }));
    resetCurrentLevelBoard();
  }, [resetCurrentLevelBoard]);

  return {
    progress,
    screen,
    setScreen,
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
    adaptive,
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
  };
}
