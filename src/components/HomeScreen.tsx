import React from 'react';
import { getTotalStarsEarned, getUnlockedStickers } from '../game/gameEngine';
import { AgeGroup, BALL_COLORS, GameMode, STICKER_COLLECTION } from '../game/gameTypes';
import { MascotCharacter } from './MascotCharacter';

interface HomeScreenProps {
  selectedAge: AgeGroup;
  selectedMode: GameMode;
  nonCrossingMode: boolean;
  starsByLevel: Record<number, number>;
  soundEnabled: boolean;
  onSelectAge: (age: AgeGroup) => void;
  onSelectMode: (mode: GameMode) => void;
  onToggleNonCrossing: () => void;
  onStartPlay: () => void;
  onStartHardMazeLevels: () => void;
  onOpenTutorial: () => void;
  onOpenLevelPicker: () => void;
  onOpenStickerBook: () => void;
  onToggleSound: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  selectedAge,
  selectedMode,
  nonCrossingMode,
  starsByLevel,
  soundEnabled,
  onSelectAge,
  onSelectMode,
  onToggleNonCrossing,
  onStartPlay,
  onStartHardMazeLevels,
  onOpenTutorial,
  onOpenLevelPicker,
  onOpenStickerBook,
  onToggleSound
}) => {
  const totalStars = getTotalStarsEarned(starsByLevel);
  const unlockedCount = getUnlockedStickers(starsByLevel).length;

  return (
    <section className="home-screen" data-testid="home-screen">
      {/* Thanh trên cùng: Chọn màn, Sổ Nhãn Dán & Bật/tắt âm thanh */}
      <div className="home-top-bar">
        <div className="home-top-left-group">
          <button
            type="button"
            data-testid="btn-open-levels"
            className="secondary-pill-btn home-top-btn"
            onClick={onOpenLevelPicker}
          >
            🎯 25 Màn ({totalStars}★)
          </button>

          <button
            type="button"
            data-testid="btn-open-stickers"
            className="secondary-pill-btn home-top-btn home-sticker-btn"
            onClick={onOpenStickerBook}
          >
            🎁 Nhãn Dán ({unlockedCount}/{STICKER_COLLECTION.length})
          </button>
        </div>

        <button
          type="button"
          data-testid="btn-home-sound"
          className={`icon-pill-btn ${soundEnabled ? 'icon-pill-btn--active' : 'icon-pill-btn--muted'}`}
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Khu vực trung tâm Trang chủ */}
      <div className="home-hero-card">
        <div className="home-logo-badge" aria-hidden="true">
          <span
            className="logo-ball"
            style={{ backgroundColor: BALL_COLORS.red.hex }}
          />
          <span className="logo-connector" />
          <span
            className="logo-ball"
            style={{ backgroundColor: BALL_COLORS.blue.hex }}
          />
          <span className="logo-connector logo-connector--yellow" />
          <span
            className="logo-ball"
            style={{ backgroundColor: BALL_COLORS.yellow.hex }}
          />
        </div>

        <h1 className="home-title">Bé Nối Bóng Màu</h1>

        <div className="home-mascot-stage">
          <MascotCharacter mood="happy" size={88} />
        </div>

        <p className="home-guide-text">
          {nonCrossingMode
            ? '🔥 Chế độ Khó: Vẽ đường nối không được cắt hoặc đè lên nhau nhé!'
            : 'Tìm hai quả bóng cùng màu và nối chúng lại nhé!'}
        </p>

        {/* Hai lựa chọn độ tuổi + Chế độ thử thách Không Cắt Nhau */}
        <div
          className="age-selector-group"
          role="radiogroup"
          aria-label="Chọn độ tuổi và cấp độ của bé"
        >
          <button
            type="button"
            role="radio"
            aria-checked={selectedAge === 3 && !nonCrossingMode}
            data-testid="btn-age-3"
            className={`age-choice-btn ${selectedAge === 3 && !nonCrossingMode ? 'age-choice-btn--active' : ''}`}
            onClick={() => onSelectAge(3)}
          >
            <span className="age-choice-btn__emoji" aria-hidden="true">
              🐣
            </span>
            <span className="age-choice-btn__title">Bé 3 tuổi</span>
            <span className="age-choice-btn__desc">2–3 cặp bóng lớn</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={selectedAge === 4 && !nonCrossingMode}
            data-testid="btn-age-4"
            className={`age-choice-btn ${selectedAge === 4 && !nonCrossingMode ? 'age-choice-btn--active' : ''}`}
            onClick={() => onSelectAge(4)}
          >
            <span className="age-choice-btn__emoji" aria-hidden="true">
              🦁
            </span>
            <span className="age-choice-btn__title">Bé 4 tuổi</span>
            <span className="age-choice-btn__desc">3–5 cặp bóng vui</span>
          </button>
        </div>

        {/* Nút bật/tắt Luật Khó: Không Cắt Nhau + Vào thẳng Mê Cung Không Cắt Nhau */}
        <div className="crossing-rule-bar">
          <button
            type="button"
            data-testid="btn-toggle-noncrossing"
            className={`crossing-toggle-btn ${nonCrossingMode ? 'crossing-toggle-btn--active' : ''}`}
            onClick={onToggleNonCrossing}
          >
            {nonCrossingMode
              ? '🔥 Đang bật: Đường Không Cắt Nhau'
              : '🟢 Đang bật: Nối Tự Do (Bấm để bật Không Cắt Nhau)'}
          </button>

          <button
            type="button"
            data-testid="btn-start-hard-maze"
            className="hard-maze-quick-btn"
            onClick={onStartHardMazeLevels}
          >
            🧩 Chơi ngay Mê Cung Không Cắt Nhau (Màn 21–25)
          </button>
        </div>

        {/* Ba chế độ chủ đề học tập */}
        <div
          className="mode-selector-group"
          role="radiogroup"
          aria-label="Chọn chủ đề chơi"
        >
          <button
            type="button"
            role="radio"
            aria-checked={selectedMode === 'classic'}
            className={`mode-pill-btn ${selectedMode === 'classic' ? 'mode-pill-btn--active' : ''}`}
            onClick={() => onSelectMode('classic')}
          >
            🎈 Bóng Cười
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={selectedMode === 'animals'}
            className={`mode-pill-btn ${selectedMode === 'animals' ? 'mode-pill-btn--active' : ''}`}
            onClick={() => onSelectMode('animals')}
          >
            🐾 Thú & Món Ăn
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={selectedMode === 'shapes'}
            className={`mode-pill-btn ${selectedMode === 'shapes' ? 'mode-pill-btn--active' : ''}`}
            onClick={() => onSelectMode('shapes')}
          >
            🔷 Hình Khối
          </button>
        </div>

        {/* Nút lớn BẮT ĐẦU CHƠI */}
        <button
          type="button"
          data-testid="btn-start-play"
          className="primary-jumbo-btn home-start-btn"
          onClick={onStartPlay}
        >
          BẮT ĐẦU CHƠI ▶
        </button>

        <button
          type="button"
          data-testid="btn-home-tutorial"
          className="home-tutorial-link"
          onClick={onOpenTutorial}
        >
          👋 Hướng dẫn cách chơi
        </button>
      </div>
    </section>
  );
};
