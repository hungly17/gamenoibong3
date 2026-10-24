import React, { useEffect } from 'react';
import { BALL_COLORS, BallColorId, StickerDefinition } from '../game/gameTypes';
import { MascotCharacter } from './MascotCharacter';

interface VictoryScreenProps {
  levelId: number;
  earnedStars: number;
  praiseText: string;
  levelColors: BallColorId[];
  newlyUnlockedSticker: StickerDefinition | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onNextLevel: () => void;
  onGoHome: () => void;
  onOpenStickerBook: () => void;
  onPlayStarSound: (starIndex: number) => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  levelId,
  earnedStars,
  praiseText,
  levelColors,
  newlyUnlockedSticker,
  soundEnabled,
  onToggleSound,
  onNextLevel,
  onGoHome,
  onOpenStickerBook,
  onPlayStarSound
}) => {
  useEffect(() => {
    for (let i = 0; i < earnedStars; i++) {
      onPlayStarSound(i);
    }
  }, [earnedStars, onPlayStarSound]);

  return (
    <section
      className="victory-screen"
      data-testid="victory-screen"
      aria-label="Hoàn thành màn chơi"
    >
      <div className="victory-top-bar">
        <span className="victory-level-pill">Hoàn thành Màn {levelId}</span>
        <button
          type="button"
          className="icon-pill-btn"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      <div className="confetti-layer" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, idx) => (
          <span
            key={idx}
            className={`confetti-piece confetti-piece--${idx % 6}`}
            style={{
              left: `${8 + ((idx * 7) % 84)}%`,
              animationDelay: `${(idx % 5) * 0.18}s`
            }}
          />
        ))}
      </div>

      <div className="victory-card">
        <div className="victory-glowing-balls" aria-hidden="true">
          {levelColors.slice(0, 5).map((colorId) => {
            const color = BALL_COLORS[colorId];
            return (
              <span
                key={colorId}
                className="victory-mini-ball"
                style={{
                  backgroundColor: color.hex,
                  boxShadow: `0 0 18px ${color.glowHex}`
                }}
              />
            );
          })}
        </div>

        <MascotCharacter mood="celebrating" size={96} />

        <div
          className="victory-stars-row"
          aria-label={`Đạt ${earnedStars} ngôi sao`}
        >
          {[1, 2, 3].map((starNum) => {
            const active = starNum <= earnedStars;
            return (
              <span
                key={starNum}
                className={`victory-star ${active ? 'victory-star--earned' : 'victory-star--dim'}`}
                style={{ animationDelay: `${(starNum - 1) * 0.14}s` }}
              >
                ★
              </span>
            );
          })}
        </div>

        <h2 className="victory-title">Giỏi quá! Con làm tốt lắm!</h2>
        <p className="victory-subtitle">{praiseText}</p>

        {/* Thông báo mở khóa nhãn dán mới nếu có */}
        {newlyUnlockedSticker && (
          <button
            type="button"
            className="new-sticker-banner"
            onClick={onOpenStickerBook}
          >
            <span className="new-sticker-banner__emoji">
              {newlyUnlockedSticker.emoji}
            </span>
            <span className="new-sticker-banner__text">
              🎁 Quà mới: <strong>{newlyUnlockedSticker.nameVi}</strong>!
            </span>
          </button>
        )}

        <div className="victory-buttons">
          <button
            type="button"
            data-testid="btn-next-level"
            className="primary-jumbo-btn victory-next-btn"
            onClick={onNextLevel}
          >
            CHƠI TIẾP ▶
          </button>

          <div className="victory-secondary-row">
            <button
              type="button"
              className="secondary-pill-btn"
              onClick={onOpenStickerBook}
            >
              🎁 Sổ Nhãn Dán
            </button>

            <button
              type="button"
              data-testid="btn-victory-home"
              className="secondary-pill-btn"
              onClick={onGoHome}
            >
              🏠 Trang Chủ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
