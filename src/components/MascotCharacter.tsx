import React from 'react';
import { MascotMood } from '../hooks/useGameState';

interface MascotCharacterProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
}

/**
 * Nhân vật hoạt hình hướng dẫn thân thiện: Chú Thỏ Bông dễ thương
 */
export const MascotCharacter: React.FC<MascotCharacterProps> = ({
  mood = 'happy',
  size = 88,
  className = ''
}) => {
  const isJumping = mood === 'celebrating' || mood === 'excited';

  return (
    <div
      className={`mascot-wrapper ${isJumping ? 'mascot-bounce' : 'mascot-breathe'} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bóng đổ dưới chân */}
        <ellipse cx="60" cy="112" rx="34" ry="5" fill="rgba(77, 150, 255, 0.16)" />

        {/* Tai trái */}
        <g className="mascot-ear-left">
          <rect
            x="30"
            y="8"
            width="20"
            height="46"
            rx="10"
            transform="rotate(-10 30 8)"
            fill="#FFFFFF"
            stroke="#5B7DB1"
            strokeWidth="3.5"
          />
          <rect
            x="35"
            y="15"
            width="10"
            height="30"
            rx="5"
            transform="rotate(-10 35 15)"
            fill="#FFB5C2"
          />
        </g>

        {/* Tai phải */}
        <g className="mascot-ear-right">
          <rect
            x="70"
            y="6"
            width="20"
            height="46"
            rx="10"
            transform="rotate(10 70 6)"
            fill="#FFFFFF"
            stroke="#5B7DB1"
            strokeWidth="3.5"
          />
          <rect
            x="74"
            y="14"
            width="10"
            height="30"
            rx="5"
            transform="rotate(10 74 14)"
            fill="#FFB5C2"
          />
        </g>

        {/* Thân thỏ nhỏ xinh */}
        <path
          d="M36 86 C36 72 84 72 84 86 L88 106 C88 110 32 110 32 106 Z"
          fill="#4D96FF"
          stroke="#5B7DB1"
          strokeWidth="3.5"
        />
        {/* Ngôi sao trên áo */}
        <circle cx="60" cy="95" r="7" fill="#FFC83D" />

        {/* Đầu thỏ */}
        <circle
          cx="60"
          cy="62"
          r="32"
          fill="#FFFFFF"
          stroke="#5B7DB1"
          strokeWidth="3.5"
        />

        {/* Hai má hồng */}
        <ellipse cx="39" cy="67" rx="6.5" ry="4" fill="#FF9EBB" opacity="0.75" />
        <ellipse cx="81" cy="67" rx="6.5" ry="4" fill="#FF9EBB" opacity="0.75" />

        {/* Mắt */}
        {mood === 'celebrating' || mood === 'excited' ? (
          <>
            <path
              d="M41 58 Q46 51 51 58"
              stroke="#2C3E50"
              strokeWidth="3.8"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M69 58 Q74 51 79 58"
              stroke="#2C3E50"
              strokeWidth="3.8"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            <circle cx="46" cy="57" r="4.8" fill="#2C3E50" />
            <circle cx="44.5" cy="55.2" r="1.6" fill="#FFFFFF" />
            <circle cx="74" cy="57" r="4.8" fill="#2C3E50" />
            <circle cx="72.5" cy="55.2" r="1.6" fill="#FFFFFF" />
          </>
        )}

        {/* Mũi hồng */}
        <ellipse cx="60" cy="64" rx="4.2" ry="3" fill="#FF6B8B" />

        {/* Miệng cười thân thiện */}
        {mood === 'celebrating' ? (
          <path
            d="M51 69 Q60 80 69 69 Z"
            fill="#FF6B8B"
            stroke="#2C3E50"
            strokeWidth="2.5"
          />
        ) : (
          <path
            d="M52 69 Q60 76 68 69"
            stroke="#2C3E50"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Tay vẫy chào */}
        <circle
          cx={isJumping ? '24' : '28'}
          cy={isJumping ? '78' : '88'}
          r="8"
          fill="#FFFFFF"
          stroke="#5B7DB1"
          strokeWidth="3"
        />
        <circle
          cx={isJumping ? '96' : '92'}
          cy={isJumping ? '78' : '88'}
          r="8"
          fill="#FFFFFF"
          stroke="#5B7DB1"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};
