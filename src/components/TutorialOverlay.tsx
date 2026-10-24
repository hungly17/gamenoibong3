import React, { useRef, useState } from 'react';
import { BALL_COLORS } from '../game/gameTypes';
import { clientPointToNormalized } from '../utils/responsiveLayout';
import { MascotCharacter } from './MascotCharacter';

interface TutorialOverlayProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onCompleteTutorial: () => void;
  onPlaySuccessSound: () => void;
  onPlayTouchSound: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  soundEnabled,
  onToggleSound,
  onCompleteTutorial,
  onPlaySuccessSound,
  onPlayTouchSound
}) => {
  const demoBoxRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingDemo, setIsDraggingDemo] = useState(false);
  const [dragX, setDragX] = useState(25);
  const [demoCompleted, setDemoCompleted] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (demoCompleted || !demoBoxRef.current) return;
    e.preventDefault();
    try {
      demoBoxRef.current.setPointerCapture(e.pointerId);
    } catch {
      // Bỏ qua
    }
    setIsDraggingDemo(true);
    onPlayTouchSound();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingDemo || demoCompleted || !demoBoxRef.current) return;
    const rect = demoBoxRef.current.getBoundingClientRect();
    const norm = clientPointToNormalized(e.clientX, e.clientY, rect);
    const clampedX = Math.max(25, Math.min(75, norm.x));
    setDragX(clampedX);

    if (clampedX >= 64) {
      setIsDraggingDemo(false);
      setDragX(75);
      setDemoCompleted(true);
      onPlaySuccessSound();
      window.setTimeout(() => {
        onCompleteTutorial();
      }, 1100);
    }
  };

  const handlePointerUp = () => {
    if (demoCompleted) return;
    setIsDraggingDemo(false);
    setDragX(25);
  };

  const redColor = BALL_COLORS.red;

  return (
    <section className="tutorial-screen" aria-label="Hướng dẫn chơi">
      <div className="tutorial-top-bar">
        <button
          type="button"
          className="skip-tutorial-btn"
          onClick={onCompleteTutorial}
        >
          Bỏ qua ➔
        </button>

        <button
          type="button"
          className="icon-pill-btn"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      <div className="tutorial-card">
        <div className="tutorial-mascot-row">
          <MascotCharacter
            mood={demoCompleted ? 'celebrating' : 'excited'}
            size={84}
          />
          <p className="tutorial-headline">
            {demoCompleted
              ? 'Giỏi quá! Mình vào chơi nhé!'
              : 'Con kéo bóng đến bóng cùng màu nhé!'}
          </p>
        </div>

        {/* Khu vực minh họa tương tác: Bé có thể tự tay kéo thử hoặc nhìn bàn tay mẫu */}
        <div
          ref={demoBoxRef}
          data-testid="tutorial-demo-box"
          className={`tutorial-demo-stage ${demoCompleted ? 'tutorial-demo-stage--done' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <svg
            className="tutorial-svg"
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
          >
            {/* Đường dẫn mẫu chấm đứt */}
            <line
              x1="25"
              y1="25"
              x2="75"
              y2="25"
              stroke="#FFB4B4"
              strokeWidth="3.5"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />

            {/* Đường nối tự động minh họa khi bé chưa chạm */}
            {!isDraggingDemo && !demoCompleted && (
              <line
                x1="25"
                y1="25"
                x2="75"
                y2="25"
                stroke={redColor.hex}
                strokeWidth="4.5"
                strokeLinecap="round"
                className="tutorial-auto-line"
              />
            )}

            {/* Đường nối theo tay bé hoặc khi đã hoàn thành */}
            {(isDraggingDemo || demoCompleted) && (
              <line
                x1="25"
                y1="25"
                x2={demoCompleted ? 75 : dragX}
                y2="25"
                stroke={redColor.hex}
                strokeWidth="5"
                strokeLinecap="round"
              />
            )}
          </svg>

          {/* Quả bóng thứ nhất */}
          <div
            className={`tutorial-ball tutorial-ball--left ${demoCompleted ? 'tutorial-ball--glow' : ''}`}
            style={{ background: redColor.hex }}
          >
            <span className="tutorial-ball__shine" />
            {demoCompleted && <span className="tutorial-ball__star">★</span>}
          </div>

          {/* Quả bóng thứ hai cùng màu */}
          <div
            className={`tutorial-ball tutorial-ball--right ${demoCompleted ? 'tutorial-ball--glow' : 'tutorial-ball--pulse-target'}`}
            style={{ background: redColor.hex }}
          >
            <span className="tutorial-ball__shine" />
            {demoCompleted && <span className="tutorial-ball__star">★</span>}
          </div>

          {/* Bàn tay hướng dẫn chuyển động từ bóng 1 sang bóng 2 */}
          {!isDraggingDemo && !demoCompleted && (
            <div className="tutorial-hand-pointer" aria-hidden="true">
              👆
            </div>
          )}
        </div>

        <div className="tutorial-actions">
          <button
            type="button"
            data-testid="btn-start-after-tutorial"
            className="primary-jumbo-btn"
            onClick={onCompleteTutorial}
          >
            CHƠI NGAY! ▶
          </button>
        </div>
      </div>
    </section>
  );
};
