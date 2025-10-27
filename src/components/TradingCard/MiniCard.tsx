// src/components/TradingCard/MiniCard.tsx
import React from 'react';
import type { Subject } from '../../types';

interface MiniCardProps {
  subject: Subject;
  isTop: boolean;
  stackIndex: number;
  onCardClick: (subject: Subject) => void;
}

const MiniCard: React.FC<MiniCardProps> = ({
  subject,
  isTop,
  stackIndex,
  onCardClick,
}) => {
  // First card (index 0) is upright, others tilt left and fade
  const rotation = isTop ? 0 : stackIndex * -8;
  const xOffset = isTop ? 0 : stackIndex * -12;
  const yOffset = isTop ? 0 : stackIndex * -8;
  const opacity = isTop ? 1 : 1 - stackIndex * 0.2;

  // Hexagon SVG background component
  const HexagonBackground = () => (
    <svg
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '80%',
        opacity: 0.15,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      viewBox='0 0 100 100'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z'
        fill='#000000'
        stroke='#4B5563'
        strokeWidth='1'
      />
    </svg>
  );

  return (
    <div
      onClick={() => isTop && onCardClick(subject)}
      style={{
        position: 'absolute',
        width: '160px',
        height: '260px',
        background:
          'linear-gradient(145deg, rgba(26, 26, 26, 0.95), rgba(17, 17, 17, 0.95))',
        borderRadius: '12px',
        transform: `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg)`,
        cursor: isTop ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        zIndex: 5 - stackIndex, // Higher z-index for cards further back
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        opacity: opacity,
      }}
      onMouseEnter={(e) => {
        if (isTop) {
          e.currentTarget.style.transform = `translateX(${xOffset}px) translateY(${
            yOffset - 8
          }px) rotate(${rotation}deg)`;
          e.currentTarget.style.boxShadow =
            '0 8px 24px rgba(130, 133, 255, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (isTop) {
          e.currentTarget.style.transform = `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${rotation}deg)`;
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }
      }}
    >
      {/* Gradient header */}
      <div
        style={{
          background: 'linear-gradient(145deg, #8285FF, #0005E9)',
          padding: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            lineHeight: '1.2',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {subject.name}
        </h3>
      </div>

      {/* Card content with hexagon background */}
      <div
        style={{
          flex: 1,
          padding: '12px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <HexagonBackground />

        {/* Content on top of hexagon */}
        <p
          style={{
            fontSize: '11px',
            color: '#E5E7EB',
            lineHeight: '1.4',
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 8,
            WebkitBoxOrient: 'vertical',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {subject.description}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          background: 'rgba(17, 17, 17, 0.95)',
          padding: '8px 12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            fontSize: '9px',
            color: '#646E78',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          FS.CARDS
        </div>
      </div>
    </div>
  );
};

export default MiniCard;
