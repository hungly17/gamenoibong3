import React from 'react';
import { BALL_COLORS, BallColorId, GameMode, Point } from '../game/gameTypes';

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

function renderInnerSymbol(symbol: string, solid: boolean = false) {
  const fill = solid ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.34)';
  switch (symbol) {
    case 'heart':
      return (
        <path
          d="M12 20.5 C12 20.5 5 15.2 5 10.2 C5 7.6 7 5.5 9.5 5.5 C11 5.5 12 6.4 12 7.5 C12 6.4 13 5.5 14.5 5.5 C17 5.5 19 7.6 19 10.2 C19 15.2 12 20.5 12 20.5 Z"
          fill={fill}
        />
      );
    case 'sun':
      return <circle cx="12" cy="12" r="6" fill={fill} />;
    case 'star':
      return (
        <path
          d="M12 4.5 L14.3 9.2 L19.5 10 L15.7 13.6 L16.6 18.8 L12 16.3 L7.4 18.8 L8.3 13.6 L4.5 10 L9.7 9.2 Z"
          fill={fill}
        />
      );
    case 'leaf':
      return (
        <path
          d="M17.5 5.5 C10 5.5 5.5 10 5.5 17.5 C13 17.5 17.5 13 17.5 5.5 Z"
          fill={fill}
        />
      );
    case 'flower':
      return (
        <g fill={fill}>
          <circle cx="12" cy="7.5" r="3.2" />
          <circle cx="16.5" cy="12" r="3.2" />
          <circle cx="12" cy="16.5" r="3.2" />
          <circle cx="7.5" cy="12" r="3.2" />
        </g>
      );
    case 'moon':
    default:
      return (
        <path
          d="M14.5 6 A6 6 0 1 0 18 15.5 A4.8 4.8 0 1 1 14.5 6 Z"
          fill={fill}
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
      aria-label={`Bóng ${colorDef.nameVi}${isCompleted ? ' đã nối' : ''}`}
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
            width="64%"
            height="64%"
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
              width="58%"
              height="58%"
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
