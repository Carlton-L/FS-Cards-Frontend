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
  const offset = stackIndex * 8;
  const rotation = stackIndex * 2;

  return (
    <div
      onClick={() => isTop && onCardClick(subject)}
      style={{
        position: 'absolute',
        top: `-${offset}px`,
        left: `-${offset}px`,
        width: '160px',
        height: '220px',
        background: isTop ? 'rgba(26, 26, 26, 0.9)' : 'rgba(20, 20, 20, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        cursor: isTop ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        transform: `rotate(${rotation}deg)`,
        zIndex: isTop ? 10 : 10 - stackIndex,
        boxShadow: isTop
          ? '0 8px 24px rgba(0, 0, 0, 0.4)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
        opacity: isTop ? 1 : 0.8 - stackIndex * 0.1,
      }}
    >
      {isTop && (
        <>
          {/* Mini Icon */}
          <div
            style={{
              width: '40px',
              height: '40px',
              margin: '0 auto 12px',
              background: 'linear-gradient(145deg, #8285FF, #0005E9)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
              <path
                d='M12 2L20.196 7V17L12 22L3.804 17V7L12 2Z'
                fill='white'
                stroke='white'
                strokeWidth='1'
                strokeLinejoin='round'
              />
            </svg>
          </div>

          {/* Mini Title */}
          <h4
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: '8px',
              lineHeight: '1.2',
            }}
          >
            {subject.name}
          </h4>

          {/* Mini Description */}
          <p
            style={{
              fontSize: '10px',
              color: '#A7ACB2',
              textAlign: 'center',
              lineHeight: '1.3',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              flex: 1,
            }}
          >
            {subject.description}
          </p>
        </>
      )}
    </div>
  );
};

export default MiniCard;
