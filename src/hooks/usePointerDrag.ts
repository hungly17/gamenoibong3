import { useCallback, useRef, useState } from 'react';
import {
  ActiveDragState,
  BallNode,
  CompletedConnection,
  Point
} from '../game/gameTypes';
import {
  detectNonCrossingCollision,
  findBallAtPoint,
  isBallConnected
} from '../game/connectionRules';
import { distanceBetween, mapBallPositionForOrientation } from '../utils/geometry';
import { clientPointToNormalized } from '../utils/responsiveLayout';

interface UsePointerDragParams {
  balls: BallNode[];
  completedConnections: CompletedConnection[];
  hitRadiusNormalized: number;
  visualRadiusNormalized: number;
  isLandscape: boolean;
  preventCrossing: boolean;
  disabled: boolean;
  onStartDrag: (ball: BallNode) => void;
  onHoverMatchingTarget: (targetBall: BallNode) => void;
  onFinishDrag: (
    startBall: BallNode,
    releasePoint: Point,
    dragPathPoints: Point[]
  ) => void;
}

export function usePointerDrag({
  balls,
  completedConnections,
  hitRadiusNormalized,
  visualRadiusNormalized,
  isLandscape,
  preventCrossing,
  disabled,
  onStartDrag,
  onHoverMatchingTarget,
  onFinishDrag
}: UsePointerDragParams) {
  const [activeDrag, setActiveDrag] = useState<ActiveDragState | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const dragStateRef = useRef<ActiveDragState | null>(null);
  const lastHoveredTargetIdRef = useRef<string | null>(null);

  const clearDrag = useCallback(() => {
    activePointerIdRef.current = null;
    dragStateRef.current = null;
    lastHoveredTargetIdRef.current = null;
    setActiveDrag(null);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>, boardElement: HTMLElement | null) => {
      if (disabled || !boardElement) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (activePointerIdRef.current !== null) return;

      const rect = boardElement.getBoundingClientRect();
      const normPoint = clientPointToNormalized(e.clientX, e.clientY, rect);

      const touchedBall = findBallAtPoint(
        normPoint,
        balls,
        hitRadiusNormalized,
        isLandscape
      );

      if (!touchedBall) return;

      if (isBallConnected(touchedBall.id, completedConnections)) {
        return;
      }

      e.preventDefault();
      try {
        boardElement.setPointerCapture(e.pointerId);
      } catch {
        // Bỏ qua nếu môi trường không hỗ trợ
      }

      const ballCenter = mapBallPositionForOrientation(touchedBall, isLandscape);
      const initialDrag: ActiveDragState = {
        startBallId: touchedBall.id,
        colorId: touchedBall.colorId,
        currentPoint: normPoint,
        pathPoints: [ballCenter],
        hoveredTargetBallId: null,
        collisionPoint: null,
        blockedByBallId: null,
        blockedByConnectionId: null
      };

      activePointerIdRef.current = e.pointerId;
      dragStateRef.current = initialDrag;
      lastHoveredTargetIdRef.current = null;
      setActiveDrag(initialDrag);
      onStartDrag(touchedBall);
    },
    [balls, completedConnections, disabled, hitRadiusNormalized, isLandscape, onStartDrag]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>, boardElement: HTMLElement | null) => {
      if (
        disabled ||
        !boardElement ||
        activePointerIdRef.current === null ||
        e.pointerId !== activePointerIdRef.current ||
        !dragStateRef.current
      ) {
        return;
      }

      e.preventDefault();
      const rect = boardElement.getBoundingClientRect();
      const normPoint = clientPointToNormalized(e.clientX, e.clientY, rect);

      const currentDrag = dragStateRef.current;
      const candidateTarget = findBallAtPoint(
        normPoint,
        balls,
        hitRadiusNormalized * 1.1,
        isLandscape,
        currentDrag.startBallId
      );

      let hoveredMatchingId: string | null = null;
      let displayPoint = normPoint;

      if (
        candidateTarget &&
        candidateTarget.colorId === currentDrag.colorId &&
        !isBallConnected(candidateTarget.id, completedConnections)
      ) {
        hoveredMatchingId = candidateTarget.id;
        displayPoint = mapBallPositionForOrientation(candidateTarget, isLandscape);
      }

      let basePoints = [...currentDrag.pathPoints];

      // Cho phép người chơi kéo lùi lại (backtrack) để tháo gỡ nút thắt trên chính đường đang vẽ
      if (basePoints.length >= 4) {
        for (let i = 0; i < basePoints.length - 2; i++) {
          if (distanceBetween(basePoints[i], displayPoint) < 3.5) {
            basePoints = basePoints.slice(0, i + 1);
            break;
          }
        }
      }

      const lastValidPoint = basePoints[basePoints.length - 1];

      // Trong chế độ Không Cắt Nhau: kiểm tra đoạn mới từ điểm hợp lệ cuối tới vị trí ngón tay
      if (preventCrossing && lastValidPoint) {
        const check = detectNonCrossingCollision({
          candidatePathDisplay: [...basePoints, displayPoint],
          startBallId: currentDrag.startBallId,
          targetBallId: hoveredMatchingId,
          balls,
          completedConnections,
          ballObstacleRadiusNormalized: Math.max(4.5, visualRadiusNormalized * 0.86),
          isLandscape
        });

        if (check.collided) {
          // Chặn không cho đường nối vượt qua rào cản, hiển thị cảnh báo trực quan tại điểm cắt
          lastHoveredTargetIdRef.current = null;
          const blockedState: ActiveDragState = {
            ...currentDrag,
            currentPoint: displayPoint,
            pathPoints: basePoints,
            hoveredTargetBallId: null,
            collisionPoint: check.collisionPoint,
            blockedByBallId: check.blockedByBallId,
            blockedByConnectionId: check.blockedByConnectionId
          };
          dragStateRef.current = blockedState;
          setActiveDrag(blockedState);
          return;
        }
      }

      if (hoveredMatchingId && lastHoveredTargetIdRef.current !== hoveredMatchingId) {
        lastHoveredTargetIdRef.current = hoveredMatchingId;
        if (candidateTarget) {
          onHoverMatchingTarget(candidateTarget);
        }
      } else if (!hoveredMatchingId) {
        lastHoveredTargetIdRef.current = null;
      }

      const shouldAppendPoint =
        !lastValidPoint || distanceBetween(lastValidPoint, displayPoint) >= 2.4;

      const updatedPathPoints = shouldAppendPoint
        ? [...basePoints.slice(-80), displayPoint]
        : basePoints.length > 1
          ? [...basePoints.slice(0, -1), displayPoint]
          : [basePoints[0], displayPoint];

      const nextState: ActiveDragState = {
        ...currentDrag,
        currentPoint: displayPoint,
        pathPoints: updatedPathPoints,
        hoveredTargetBallId: hoveredMatchingId,
        collisionPoint: null,
        blockedByBallId: null,
        blockedByConnectionId: null
      };

      dragStateRef.current = nextState;
      setActiveDrag(nextState);
    },
    [
      balls,
      completedConnections,
      disabled,
      hitRadiusNormalized,
      isLandscape,
      onHoverMatchingTarget,
      preventCrossing,
      visualRadiusNormalized
    ]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>, boardElement: HTMLElement | null) => {
      if (
        activePointerIdRef.current === null ||
        e.pointerId !== activePointerIdRef.current ||
        !dragStateRef.current
      ) {
        return;
      }

      e.preventDefault();
      if (boardElement) {
        try {
          if (boardElement.hasPointerCapture(e.pointerId)) {
            boardElement.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Bỏ qua
        }
      }

      const finishedDrag = dragStateRef.current;
      const startBall = balls.find((b) => b.id === finishedDrag.startBallId);

      // Nếu đang bị chặn bởi đường khác trong chế độ Không Cắt Nhau, lấy điểm hợp lệ cuối cùng
      let releasePoint = finishedDrag.currentPoint;
      let finalPath = finishedDrag.pathPoints;

      if (finishedDrag.collisionPoint) {
        finalPath = [...finishedDrag.pathPoints, finishedDrag.currentPoint];
      } else if (boardElement && !finishedDrag.hoveredTargetBallId) {
        const rect = boardElement.getBoundingClientRect();
        releasePoint = clientPointToNormalized(e.clientX, e.clientY, rect);
      }

      clearDrag();

      if (startBall) {
        onFinishDrag(startBall, releasePoint, finalPath);
      }
    },
    [balls, clearDrag, onFinishDrag]
  );

  const handlePointerCancel = useCallback(
    (e: React.PointerEvent<HTMLElement>, boardElement: HTMLElement | null) => {
      if (
        activePointerIdRef.current === null ||
        e.pointerId !== activePointerIdRef.current
      ) {
        return;
      }
      if (boardElement) {
        try {
          if (boardElement.hasPointerCapture(e.pointerId)) {
            boardElement.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Bỏ qua
        }
      }
      clearDrag();
    },
    [clearDrag]
  );

  return {
    activeDrag,
    clearDrag,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel
  };
}
