import React from 'react';
import { BALL_COLORS, BallColorId } from '../game/gameTypes';

interface GameHeaderProps {
  levelId: number;
  levelTitle: string;
  pairsCount: number;
  completedPairsCount: number;
  levelColors: BallColorId[];
  preventCrossing: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onToggleNonCrossing: () => void;
  onGoHome: () => void;
  onOpenLevelPicker: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  levelId,
  pairsCount,
  completedPairsCount,
  levelColors,
  preventCrossing,
  soundEnabled,
  onToggleSound,
  onToggleNonCrossing,
  onGoHome,
  onOpenLevelPicker
}) => {
  return (
    <header className="game-header">
      {/* Nút về trang chủ */}
      <button
        type="button"
        className="icon-pill-btn"
        onClick={onGoHome}
        aria-label="Về trang chủ"
        title="Về trang chủ"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
          <path
            d="M4 10.5L12 4L20 10.5V19C20 19.8 19.3 20.5 18.5 20.5H14.5V14.5H9.5V20.5H5.5C4.7 20.5 4 19.8 4 19V10.5Z"
            fill="#4D96FF"
            stroke="#256CD9"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Thông tin màn chơi, tiến độ & chế độ Không Cắt Nhau */}
      <div className="game-header__center">
        <button
          type="button"
          className="level-badge-btn"
          onClick={onOpenLevelPicker}
          aria-label={`Màn ${levelId} - Chọn màn chơi`}
        >
          <span className="level-badge-btn__label">MÀN {levelId}</span>
          <span
            className="level-badge-btn__dots"
            aria-label={`Đã nối ${completedPairsCount} trên ${pairsCount} cặp`}
          >
            {Array.from({ length: pairsCount }).map((_, idx) => {
              const isDone = idx < completedPairsCount;
              const dotColor = levelColors[idx]
                ? BALL_COLORS[levelColors[idx]].hex
                : '#FFC83D';
              return (
                <span
                  key={idx}
                  className={`progress-dot ${isDone ? 'progress-dot--done' : ''}`}
                  style={
                    {
                      '--dot-color': dotColor
                    } as React.CSSProperties
                  }
                >
                  {isDone ? '★' : ''}
                </span>
              );
            })}
          </span>
        </button>

        <button
          type="button"
          data-testid="btn-header-noncrossing"
          className={`rule-mode-chip ${preventCrossing ? 'rule-mode-chip--hard' : 'rule-mode-chip--easy'}`}
          onClick={onToggleNonCrossing}
          title="Bật/tắt luật đường nối không được cắt hoặc đè lên nhau"
        >
          {preventCrossing ? '🔥 Không Cắt Nhau' : '🟢 Nối Tự Do'}
        </button>
      </div>

      {/* Nút bật/tắt âm thanh */}
      <button
        type="button"
        className={`icon-pill-btn ${soundEnabled ? 'icon-pill-btn--active' : 'icon-pill-btn--muted'}`}
        onClick={onToggleSound}
        aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
      >
        {soundEnabled ? (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
            <path
              d="M5 9.5H8.5L13.5 5.5V18.5L8.5 14.5H5C4.2 14.5 3.5 13.8 3.5 13V11C3.5 10.2 4.2 9.5 5 9.5Z"
              fill="#55C98A"
              stroke="#2FA164"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 9C17.8 10.3 17.8 13.7 16.5 15M19 6.5C21.5 9.2 21.5 14.8 19 17.5"
              stroke="#2FA164"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
            <path
              d="M5 9.5H8.5L13.5 5.5V18.5L8.5 14.5H5C4.2 14.5 3.5 13.8 3.5 13V11C3.5 10.2 4.2 9.5 5 9.5Z"
              fill="#94A3B8"
              stroke="#64748B"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 9.5L21 14M21 9.5L16.5 14"
              stroke="#EF4444"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    </header>
  );
};
