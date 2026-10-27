import React from 'react';
import { BALL_COLORS, BallColorId, GameMode, Point, ShapeSymbol } from '../game/gameTypes';

interface BallProps {
  id: string;
  colorId: BallColorId;
  position: Point;
  diameterPx: number;
  pairRole?: 0 | 1;
  gameMode: GameMode;
  isSelected: boolean;
  isHoveredTarget: boolean;
  isCompleted: boolean;
  isHinted: boolean;
}

function renderInnerSymbol(symbol: ShapeSymbol, solid: boolean = false) {
  const fill = solid ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.28)';
  const stroke = solid ? 'rgba(15,23,42,0.14)' : 'none';
  switch (symbol) {
    case 'heart':
      return (
        <path
          d="M12 20.5 C12 20.5 4.8 15.2 4.8 10.2 C4.8 7.5 6.9 5.4 9.5 5.4 C11 5.4 12 6.3 12 7.5 C12 6.3 13 5.4 14.5 5.4 C17.1 5.4 19.2 7.5 19.2 10.2 C19.2 15.2 12 20.5 12 20.5 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="0.8"
        />
      );
    case 'circle':
      return (
        <circle
          cx="12"
          cy="12"
          r="6.8"
          fill={fill}
          stroke={stroke}
          strokeWidth="0.8"
        />
      );
    case 'square':
      return (
        <rect
          x="5.8"
          y="5.8"
          width="12.4"
          height="12.4"
          rx="2.4"
          fill={fill}
          stroke={stroke}
          strokeWidth="0.8"
        />
      );
    case 'triangle':
      return (
        <path
          d="M12 4.8 L19.5 18.2 H4.5 Z"
          strokeLinejoin="round"
          fill={fill}
          stroke={stroke}
          strokeWidth="0.8"
        />
      );
    case 'star':
      return (
        <path
          d="M12 4.3 L14.4 9.1 L19.7 9.9 L15.8 13.6 L16.7 18.9 L12 16.4 L7.3 18.9 L8.2 13.6 L4.3 9.9 L9.6 9.1 Z"
          strokeLinejoin="round"
          fill={fill}
          stroke={stroke}
          strokeWidth="0.8"
        />
      );
    case 'diamond':
    default:
      return (
        <path
          d="M12 4.2 L19.2 12 L12 19.8 L4.8 12 Z"
          strokeLinejoin="round"
          fill={fill}
          stroke={stroke}
          strokeWidth="0.8"
        />
      );
  }
}

export const Ball: React.FC<BallProps> = ({
  id,
  colorId,
  position,
  diameterPx,
  pairRole = 0,
  gameMode,
  isSelected,
  isHoveredTarget,
  isCompleted,
  isHinted
}) => {
  const colorDef = BALL_COLORS[colorId];

  const stateClasses = [
    'game-ball',
    isSelected ? 'game-ball--selected' : '',
    isHoveredTarget ? 'game-ball--hovered-target' : '',
    isCompleted ? 'game-ball--completed' : '',
    isHinted ? 'game-ball--hinted' : ''
  ]
    .filter(Boolean)
    .join(' ');

  const animalOrFoodEmoji =
    pairRole === 0
      ? colorDef.animalPair.animalEmoji
      : colorDef.animalPair.foodEmoji;

  const ariaDescription =
    gameMode === 'animals'
      ? pairRole === 0
        ? `${colorDef.animalPair.animalNameVi} (${colorDef.nameVi})`
        : `${colorDef.animalPair.foodNameVi} (${colorDef.nameVi})`
      : gameMode === 'shapes'
        ? colorDef.shapeNameVi
        : `Bóng ${colorDef.nameVi}`;

  return (
    <div
      id={id}
      data-testid={`ball-${id}`}
      data-color={colorId}
      data-completed={isCompleted ? 'true' : 'false'}
      className={stateClasses}
      style={
        {
          left: `${position.x}%`,
          top: `${position.y}%`,
          width: `${diameterPx}px`,
          height: `${diameterPx}px`,
          '--ball-color': colorDef.hex,
          '--ball-light': colorDef.lightHex,
          '--ball-dark': colorDef.darkHex,
          '--ball-glow': colorDef.glowHex
        } as React.CSSProperties
      }
      role="img"
      aria-label={`${ariaDescription}${isCompleted ? ' đã nối' : ''}`}
    >
      {(isSelected || isHoveredTarget || isHinted || isCompleted) && (
        <span className="game-ball__halo" />
      )}

      <div className="game-ball__surface">
        <span className="game-ball__shine" />
        <span className="game-ball__shine-small" />

        {gameMode === 'animals' ? (
          <span
            className="game-ball__emoji"
            style={{ fontSize: `${Math.round(diameterPx * 0.48)}px` }}
            aria-hidden="true"
          >
            {animalOrFoodEmoji}
          </span>
        ) : gameMode === 'shapes' ? (
          <svg
            className="game-ball__symbol game-ball__symbol--solid"
            viewBox="0 0 24 24"
            width="66%"
            height="66%"
            aria-hidden="true"
          >
            {renderInnerSymbol(colorDef.symbol, true)}
          </svg>
        ) : (
          <>
            {/* Chế độ cổ điển: Biểu tượng chìm + Khuôn mặt cười dễ thương */}
            <svg
              className="game-ball__symbol"
              viewBox="0 0 24 24"
              width="56%"
              height="56%"
              aria-hidden="true"
            >
              {renderInnerSymbol(colorDef.symbol, false)}
            </svg>
            <svg
              className="game-ball__face"
              viewBox="0 0 40 40"
              width="70%"
              height="70%"
              aria-hidden="true"
            >
              {isCompleted || isHoveredTarget ? (
                <>
                  <path
                    d="M11 17 Q14 13 17 17"
                    stroke="#FFFFFF"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M23 17 Q26 13 29 17"
                    stroke="#FFFFFF"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M14 23 Q20 29 26 23"
                    stroke="#FFFFFF"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </>
              ) : (
                <>
                  <circle cx="14" cy="17" r="2.2" fill="#FFFFFF" opacity="0.92" />
                  <circle cx="26" cy="17" r="2.2" fill="#FFFFFF" opacity="0.92" />
                  <path
                    d="M15.5 23 Q20 26.5 24.5 23"
                    stroke="#FFFFFF"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.92"
                  />
                </>
              )}
            </svg>
          </>
        )}

        {isCompleted && (
          <span className="game-ball__completed-badge" aria-hidden="true">
            ★
          </span>
        )}
      </div>
    </div>
  );
};
