import React from 'react';
import { getDisplayPointsForConnection } from '../game/connectionRules';
import {
  ActiveDragState,
  BALL_COLORS,
  BallColorId,
  BallNode,
  CompletedConnection,
  HintPair,
  Point
} from '../game/gameTypes';
import {
  buildSmoothSvgPath,
  createCurvedConnectorPoints,
  mapBallPositionForOrientation
} from '../utils/geometry';

interface ConnectionLineLayerProps {
  balls: BallNode[];
  completedConnections: CompletedConnection[];
  activeDrag: ActiveDragState | null;
  fadingMissLine: { points: Point[]; colorId: BallColorId } | null;
  activeHint: HintPair | null;
  isLandscape: boolean;
}

export const ConnectionLineLayer: React.FC<ConnectionLineLayerProps> = ({
  balls,
  completedConnections,
  activeDrag,
  fadingMissLine,
  activeHint,
  isLandscape
}) => {
  const getBallDisplayPos = (ballId: string): Point | null => {
    const found = balls.find((b) => b.id === ballId);
    if (!found) return null;
    return mapBallPositionForOrientation(found, isLandscape);
  };

  return (
    <svg
      className="connection-svg-layer"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* 1. Đường gợi ý mẫu (nét đứt phát sáng nhẹ nhàng) */}
      {activeHint &&
        (() => {
          const fromPos = getBallDisplayPos(activeHint.fromBallId);
          const toPos = getBallDisplayPos(activeHint.toBallId);
          if (!fromPos || !toPos) return null;
          const hintPoints = createCurvedConnectorPoints(fromPos, toPos);
          const pathD = buildSmoothSvgPath(hintPoints);
          const color = BALL_COLORS[activeHint.colorId];

          return (
            <g className="hint-line-group">
              <path
                d={pathD}
                stroke={color.lightHex}
                strokeWidth="4.6"
                strokeLinecap="round"
                fill="none"
                opacity="0.45"
              />
              <path
                d={pathD}
                stroke={color.hex}
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeDasharray="3.2 3.2"
                fill="none"
                className="hint-line-animated"
              />
            </g>
          );
        })()}

      {/* 2. Các đường nối đã hoàn thành (giữ nguyên đường uốn lượn người chơi đã vẽ!) */}
      {completedConnections.map((conn) => {
        const displayPoints = getDisplayPointsForConnection(conn, balls, isLandscape);
        if (displayPoints.length < 2) return null;

        const pathD = buildSmoothSvgPath(displayPoints);
        const color = BALL_COLORS[conn.colorId];
        const isBlocking = activeDrag?.blockedByConnectionId === conn.id;

        return (
          <g
            key={conn.id}
            className={`completed-line-group ${isBlocking ? 'completed-line-group--blocking' : ''}`}
          >
            {/* Lớp hào quang bên ngoài */}
            <path
              d={pathD}
              stroke={isBlocking ? '#EF4444' : color.lightHex}
              strokeWidth={isBlocking ? '6.4' : '5.2'}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={isBlocking ? '0.75' : '0.48'}
            />
            {/* Đường nối chính */}
            <path
              d={pathD}
              stroke={color.hex}
              strokeWidth="3.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Đường sáng bóng ở tâm dây */}
            <path
              d={pathD}
              stroke="#FFFFFF"
              strokeWidth="1.05"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.58"
            />
          </g>
        );
      })}

      {/* 3. Đường nối tạm thời biến mất nhẹ nhàng khi thả sai */}
      {fadingMissLine &&
        fadingMissLine.points.length >= 2 &&
        (() => {
          const pathD = buildSmoothSvgPath(fadingMissLine.points);
          const color = BALL_COLORS[fadingMissLine.colorId];
          return (
            <path
              d={pathD}
              stroke={color.hex}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="fading-miss-line"
            />
          );
        })()}

      {/* 4. Đường nối đang kéo theo sát ngón tay */}
      {activeDrag &&
        (() => {
          const color = BALL_COLORS[activeDrag.colorId];
          const validPoints = activeDrag.pathPoints;
          const lastValidPt = validPoints[validPoints.length - 1];
          const hasCollision = Boolean(activeDrag.collisionPoint);

          return (
            <g className="active-drag-line-group">
              {validPoints.length >= 2 && (
                <>
                  <path
                    d={buildSmoothSvgPath(validPoints)}
                    stroke={color.lightHex}
                    strokeWidth="5.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    opacity="0.45"
                  />
                  <path
                    d={buildSmoothSvgPath(validPoints)}
                    stroke={color.hex}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </>
              )}

              {/* Đoạn bị chặn khi cố cắt qua đường khác hoặc bóng khác */}
              {hasCollision && lastValidPt && (
                <>
                  <line
                    x1={lastValidPt.x}
                    y1={lastValidPt.y}
                    x2={activeDrag.currentPoint.x}
                    y2={activeDrag.currentPoint.y}
                    stroke="#EF4444"
                    strokeWidth="2.4"
                    strokeDasharray="2.5 2.5"
                    strokeLinecap="round"
                  />
                  {activeDrag.collisionPoint && (
                    <g
                      transform={`translate(${activeDrag.collisionPoint.x}, ${activeDrag.collisionPoint.y})`}
                    >
                      <circle r="3.4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
                      <path
                        d="M -1.3 -1.3 L 1.3 1.3 M 1.3 -1.3 L -1.3 1.3"
                        stroke="#FFFFFF"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                      />
                    </g>
                  )}
                </>
              )}

              <circle
                cx={hasCollision && lastValidPt ? lastValidPt.x : activeDrag.currentPoint.x}
                cy={hasCollision && lastValidPt ? lastValidPt.y : activeDrag.currentPoint.y}
                r="2.3"
                fill="#FFFFFF"
                stroke={hasCollision ? '#EF4444' : color.hex}
                strokeWidth="1.4"
              />
            </g>
          );
        })()}
    </svg>
  );
};
