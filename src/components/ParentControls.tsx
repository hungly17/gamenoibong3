import React from 'react';
import { PRESET_LEVELS } from '../game/levelData';

interface ParentControlsModalProps {
  isOpen: boolean;
  currentLevelId: number;
  starsByLevel: Record<number, number>;
  nonCrossingMode: boolean;
  onSelectLevel: (levelId: number) => void;
  onToggleNonCrossing: () => void;
  onOpenTutorial: () => void;
  onClose: () => void;
}

export const ParentControls: React.FC<ParentControlsModalProps> = ({
  isOpen,
  currentLevelId,
  starsByLevel,
  nonCrossingMode,
  onSelectLevel,
  onToggleNonCrossing,
  onOpenTutorial,
  onClose
}) => {
  if (!isOpen) return null;

  const age3Levels = PRESET_LEVELS.filter((l) => l.id <= 10);
  const age4Levels = PRESET_LEVELS.filter((l) => l.id >= 11 && l.id <= 20);
  const hardMazeLevels = PRESET_LEVELS.filter((l) => l.id >= 21);

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chọn màn chơi và cài đặt"
    >
      <div
        className="parent-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="parent-modal-header">
          <h2 className="parent-modal-title">Chọn Màn Chơi</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        <div className="parent-modal-body">
          <div className="level-group-section">
            <h3 className="level-group-heading">🌱 Nhóm A — Bé 3 tuổi (Màn 1–10)</h3>
            <div className="level-grid">
              {age3Levels.map((lvl) => {
                const stars = starsByLevel[lvl.id] ?? 0;
                const isCurrent = lvl.id === currentLevelId;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    data-testid={`select-level-${lvl.id}`}
                    className={`level-cell-btn ${isCurrent ? 'level-cell-btn--current' : ''}`}
                    onClick={() => {
                      onSelectLevel(lvl.id);
                      onClose();
                    }}
                  >
                    <span className="level-cell-btn__num">{lvl.id}</span>
                    <span className="level-cell-btn__stars">
                      {stars > 0 ? '★'.repeat(stars) : '☆☆☆'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="level-group-section">
            <h3 className="level-group-heading">🚀 Nhóm B — Bé 4 tuổi (Màn 11–20)</h3>
            <div className="level-grid">
              {age4Levels.map((lvl) => {
                const stars = starsByLevel[lvl.id] ?? 0;
                const isCurrent = lvl.id === currentLevelId;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    data-testid={`select-level-${lvl.id}`}
                    className={`level-cell-btn ${isCurrent ? 'level-cell-btn--current' : ''}`}
                    onClick={() => {
                      onSelectLevel(lvl.id);
                      onClose();
                    }}
                  >
                    <span className="level-cell-btn__num">{lvl.id}</span>
                    <span className="level-cell-btn__stars">
                      {stars > 0 ? '★'.repeat(stars) : '☆☆☆'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="level-group-section">
            <h3 className="level-group-heading">
              🔥 Nhóm C — Mê Cung Không Cắt Nhau (Màn 21–25)
            </h3>
            <div className="level-grid">
              {hardMazeLevels.map((lvl) => {
                const stars = starsByLevel[lvl.id] ?? 0;
                const isCurrent = lvl.id === currentLevelId;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    data-testid={`select-level-${lvl.id}`}
                    className={`level-cell-btn level-cell-btn--hard ${isCurrent ? 'level-cell-btn--current' : ''}`}
                    onClick={() => {
                      onSelectLevel(lvl.id);
                      onClose();
                    }}
                  >
                    <span className="level-cell-btn__num">🔥 {lvl.id}</span>
                    <span className="level-cell-btn__stars">
                      {stars > 0 ? '★'.repeat(stars) : '☆☆☆'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="parent-settings-row">
            <label className="parent-toggle-label">
              <input
                type="checkbox"
                checked={nonCrossingMode}
                onChange={onToggleNonCrossing}
              />
              <span>
                🔥 Luật Khó cho mọi màn: Các đường nối không được cắt hoặc đè lên nhau
              </span>
            </label>

            <button
              type="button"
              className="secondary-pill-btn"
              onClick={() => {
                onClose();
                onOpenTutorial();
              }}
            >
              📖 Xem lại hướng dẫn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
