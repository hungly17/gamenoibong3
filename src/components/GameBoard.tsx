import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  BallColorId,
  BallNode,
  CompletedConnection,
  GameMode,
  HintPair,
  LevelConfig,
  Point,
  SparkleEffect
} from '../game/gameTypes';
import { isBallConnected } from '../game/connectionRules';
import { MascotMood } from '../hooks/useGameState';
import { usePointerDrag } from '../hooks/usePointerDrag';
import { mapBallPositionForOrientation } from '../utils/geometry';
import { computeBoardMetrics } from '../utils/responsiveLayout';
import { Ball } from './Ball';
import { ConnectionLineLayer } from './ConnectionLine';
import { MascotCharacter } from './MascotCharacter';

interface GameBoardProps {
  level: LevelConfig;
  gameMode: GameMode;
  completedConnections: CompletedConnection[];
  activeHint: HintPair | null;
  fadingMissLine: { points: Point[]; colorId: BallColorId } | null;
  sparkleBurst: SparkleEffect | null;
  mascotMessage: string;
  mascotMood: MascotMood;
  onBallTouchSound: () => void;
  onHoverTargetSound: () => void;
  onAttemptConnection: (params: {
    startBall: BallNode;
    releasePoint: Point;
    dragPathPoints: Point[];
    hitRadiusNormalized: number;
    visualRadiusNormalized: number;
    isLandscape: boolean;
  }) => void;
  onTriggerHint: () => void;
  onReplayLevel: () => void;
  onChangeGameMode: (mode: GameMode) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  gameMode,
  completedConnections,
  activeHint,
  fadingMissLine,
  sparkleBurst,
  mascotMessage,
  mascotMood,
  onBallTouchSound,
  onHoverTargetSound,
  onAttemptConnection,
  onTriggerHint,
  onReplayLevel,
  onChangeGameMode
}) => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [boardSize, setBoardSize] = useState<{ width: number; height: number }>({
    width: 360,
    height: 440
  });
  const [tappedBallId, setTappedBallId] = useState<string | null>(null);

  useEffect(() => {
    setTappedBallId(null);
  }, [level.id, completedConnections.length]);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const updateDimensions = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setBoardSize({
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      }
    };

    updateDimensions();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        updateDimensions();
      });
      observer.observe(el);
    }

    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  const metrics = computeBoardMetrics(
    boardSize.width,
    boardSize.height,
    level.pairsCount,
    level.ballSizeScale,
    level.balls
  );

  const handleStartDrag = useCallback(
    (ball: BallNode) => {
      onBallTouchSound();
      if (tappedBallId && tappedBallId !== ball.id) {
        const prevBall = level.balls.find((b) => b.id === tappedBallId);
        if (
          prevBall &&
          prevBall.colorId === ball.colorId &&
          !isBallConnected(prevBall.id, completedConnections)
        ) {
          const posA = mapBallPositionForOrientation(prevBall, metrics.isLandscape);
          const posB = mapBallPositionForOrientation(ball, metrics.isLandscape);
          setTappedBallId(null);
          onAttemptConnection({
            startBall: prevBall,
            releasePoint: posB,
            dragPathPoints: [posA, posB],
            hitRadiusNormalized: metrics.hitRadiusNormalized,
            visualRadiusNormalized: metrics.visualRadiusNormalized,
            isLandscape: metrics.isLandscape
          });
        }
      }
    },
    [
      completedConnections,
      level.balls,
      metrics.hitRadiusNormalized,
      metrics.isLandscape,
      metrics.visualRadiusNormalized,
      onAttemptConnection,
      onBallTouchSound,
      tappedBallId
    ]
  );

  const handleFinishDrag = useCallback(
    (startBall: BallNode, releasePoint: Point, dragPathPoints: Point[]) => {
      const startPos = mapBallPositionForOrientation(startBall, metrics.isLandscape);
      const movedDist = Math.hypot(
        releasePoint.x - startPos.x,
        releasePoint.y - startPos.y
      );

      if (movedDist < metrics.visualRadiusNormalized * 0.85 && dragPathPoints.length <= 2) {
        setTappedBallId(startBall.id);
        return;
      }

      setTappedBallId(null);
      onAttemptConnection({
        startBall,
        releasePoint,
        dragPathPoints,
        hitRadiusNormalized: metrics.hitRadiusNormalized,
        visualRadiusNormalized: metrics.visualRadiusNormalized,
        isLandscape: metrics.isLandscape
      });
    },
    [
      metrics.hitRadiusNormalized,
      metrics.isLandscape,
      metrics.visualRadiusNormalized,
      onAttemptConnection
    ]
  );

  const {
    activeDrag,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel
  } = usePointerDrag({
    balls: level.balls,
    completedConnections,
    hitRadiusNormalized: metrics.hitRadiusNormalized,
    visualRadiusNormalized: metrics.visualRadiusNormalized,
    isLandscape: metrics.isLandscape,
    preventCrossing: level.preventCrossing,
    disabled: false,
    onStartDrag: handleStartDrag,
    onHoverMatchingTarget: onHoverTargetSound,
    onFinishDrag: handleFinishDrag
  });

  const cycleMode = () => {
    const order: GameMode[] = ['classic', 'animals', 'shapes'];
    const next = order[(order.indexOf(gameMode) + 1) % order.length];
    onChangeGameMode(next);
  };

  return (
    <main className="game-play-layout">
      {/* Dải nhân vật hướng dẫn nhỏ gọn */}
      <div className="mascot-helper-bar">
        <MascotCharacter mood={mascotMood} size={54} />
        <div className="mascot-speech-bubble" role="status" aria-live="polite">
          {activeDrag?.collisionPoint
            ? '⚠️ Vướng đường hoặc chạm bóng khác rồi! Con vẽ đường vòng qua ngoài nhé!'
            : mascotMessage}
        </div>
      </div>

      {/* Khu vực bảng chơi chính */}
      <div
        ref={boardRef}
        data-testid="game-board"
        className={`game-board-canvas ${level.preventCrossing ? 'game-board-canvas--noncrossing' : ''}`}
        onPointerDown={(e) => handlePointerDown(e, boardRef.current)}
        onPointerMove={(e) => handlePointerMove(e, boardRef.current)}
        onPointerUp={(e) => handlePointerUp(e, boardRef.current)}
        onPointerCancel={(e) => handlePointerCancel(e, boardRef.current)}
      >
        {/* Lớp SVG vẽ đường nối và gợi ý */}
        <ConnectionLineLayer
          balls={level.balls}
          completedConnections={completedConnections}
          activeDrag={activeDrag}
          fadingMissLine={fadingMissLine}
          activeHint={activeHint}
          isLandscape={metrics.isLandscape}
        />

        {/* Các quả bóng màu */}
        {level.balls.map((ball) => {
          const displayPos = mapBallPositionForOrientation(ball, metrics.isLandscape);
          const completed = isBallConnected(ball.id, completedConnections);
          const isSelected =
            activeDrag?.startBallId === ball.id || tappedBallId === ball.id;
          const isHoveredTarget = activeDrag?.hoveredTargetBallId === ball.id;
          const isHinted =
            activeHint?.fromBallId === ball.id || activeHint?.toBallId === ball.id;

          return (
            <Ball
              key={ball.id}
              id={ball.id}
              colorId={ball.colorId}
              position={displayPos}
              diameterPx={metrics.ballDiameterPx}
              pairRole={ball.pairRole}
              gameMode={gameMode}
              isSelected={isSelected}
              isHoveredTarget={isHoveredTarget}
              isCompleted={completed}
              isHinted={isHinted}
            />
          );
        })}

        {/* Hiệu ứng hạt ngôi sao lấp lánh và thẻ từ vựng */}
        {sparkleBurst && (
          <div className="sparkle-overlay-layer" aria-hidden="true">
            <div
              className="vocab-toast-pill"
              style={{ borderColor: sparkleBurst.colorHex }}
            >
              {sparkleBurst.labelVi}
            </div>
            {sparkleBurst.points.map((pt, i) => {
              const mapped = mapBallPositionForOrientation(pt, metrics.isLandscape);
              return (
                <div
                  key={i}
                  className="sparkle-burst-ring"
                  style={
                    {
                      left: `${mapped.x}%`,
                      top: `${mapped.y}%`,
                      '--sparkle-color': sparkleBurst.colorHex
                    } as React.CSSProperties
                  }
                >
                  <span>✦</span>
                  <span>★</span>
                  <span>✦</span>
                  <span>★</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Thanh điều khiển phía dưới */}
      <footer className="game-bottom-bar">
        <button
          type="button"
          data-testid="btn-hint"
          className="action-btn action-btn--hint"
          onClick={onTriggerHint}
        >
          <span className="action-btn__icon" aria-hidden="true">
            💡
          </span>
          <span className="action-btn__text">GỢI Ý</span>
        </button>

        <button
          type="button"
          data-testid="btn-cycle-mode"
          className="action-btn action-btn--mode"
          onClick={cycleMode}
          title="Đổi chủ đề bóng"
        >
          <span className="action-btn__icon" aria-hidden="true">
            {gameMode === 'classic' ? '🎈' : gameMode === 'animals' ? '🐾' : '🔷'}
          </span>
          <span className="action-btn__text">
            {gameMode === 'classic'
              ? 'BÓNG CƯỜI'
              : gameMode === 'animals'
                ? 'THÚ CƯNG'
                : 'HÌNH KHỐI'}
          </span>
        </button>

        <button
          type="button"
          data-testid="btn-replay"
          className="action-btn action-btn--replay"
          onClick={onReplayLevel}
        >
          <span className="action-btn__icon" aria-hidden="true">
            🔄
          </span>
          <span className="action-btn__text">CHƠI LẠI</span>
        </button>
      </footer>
    </main>
  );
};
