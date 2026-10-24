import React, { useState } from 'react';
import { getTotalStarsEarned } from '../game/gameEngine';
import { STICKER_COLLECTION, StickerDefinition } from '../game/gameTypes';

interface StickerBookModalProps {
  isOpen: boolean;
  starsByLevel: Record<number, number>;
  onPlayStickerSound: () => void;
  onClose: () => void;
}

export const StickerBookModal: React.FC<StickerBookModalProps> = ({
  isOpen,
  starsByLevel,
  onPlayStickerSound,
  onClose
}) => {
  const [bouncingId, setBouncingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalStars = getTotalStarsEarned(starsByLevel);

  const handleTapSticker = (stk: StickerDefinition, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    onPlayStickerSound();
    setBouncingId(stk.id);
    window.setTimeout(() => {
      setBouncingId((prev) => (prev === stk.id ? null : prev));
    }, 550);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Sổ Nhãn Dán Của Bé"
    >
      <div
        className="parent-modal-card sticker-book-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="parent-modal-header">
          <div>
            <h2 className="parent-modal-title">🎁 Sổ Nhãn Dán Của Bé</h2>
            <p className="sticker-book-sub">
              Bé đã sưu tầm được <strong>{totalStars} ★</strong> ngôi sao!
            </p>
          </div>
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
          <div className="sticker-grid">
            {STICKER_COLLECTION.map((stk) => {
              const unlocked = totalStars >= stk.requiredStars;
              const isBouncing = bouncingId === stk.id;
              return (
                <button
                  key={stk.id}
                  type="button"
                  className={`sticker-card ${unlocked ? 'sticker-card--unlocked' : 'sticker-card--locked'} ${isBouncing ? 'sticker-card--bounce' : ''}`}
                  style={
                    {
                      '--stk-bg': unlocked ? stk.bgHex : '#F1F5F9'
                    } as React.CSSProperties
                  }
                  onClick={() => handleTapSticker(stk, unlocked)}
                >
                  <span className="sticker-card__emoji" aria-hidden="true">
                    {unlocked ? stk.emoji : '🔒'}
                  </span>
                  <span className="sticker-card__name">
                    {unlocked ? stk.nameVi : `Cần ${stk.requiredStars} ★`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
