// src/components/TradingCard/TradingCard.tsx
import React, { useState } from 'react';

interface Subject {
  id: string;
  name: string;
  description: string;
  fastUrl: string;
}

interface TradingCardProps {
  subject: Subject;
  onClick?: () => void;
}

const TradingCard: React.FC<TradingCardProps> = ({ subject, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className='trading-card'
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '400px',
        height: '600px',
        background: isHovered
          ? 'linear-gradient(145deg, rgba(130, 133, 255, 0.1), rgba(0, 5, 233, 0.1))'
          : 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(10px)',
        border: isHovered
          ? '2px solid #8285FF'
          : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 25px 50px rgba(130, 133, 255, 0.3), 0 0 0 1px rgba(130, 133, 255, 0.2)'
          : '0 10px 30px rgba(0, 0, 0, 0.4)',
        zIndex: isHovered ? 10 : 1,
      }}
    >
      {/* Icon/Avatar Area */}
      <div
        style={{
          width: '140px',
          height: '140px',
          margin: '0 auto 24px',
          background: 'linear-gradient(145deg, #8285FF, #0005E9)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transform: isHovered
            ? 'scale(1.05) rotate(2deg)'
            : 'scale(1) rotate(0deg)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Hexagon Icon */}
        <svg width='70' height='70' viewBox='0 0 24 24' fill='none'>
          <path
            d='M12 2L20.196 7V17L12 22L3.804 17V7L12 2Z'
            fill='white'
            stroke='white'
            strokeWidth='1'
            strokeLinejoin='round'
          />
        </svg>

        {/* Glow effect when hovered */}
        {isHovered && (
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              background: 'linear-gradient(145deg, #8285FF, #0005E9)',
              borderRadius: '26px',
              zIndex: -1,
              opacity: 0.5,
              filter: 'blur(10px)',
            }}
          />
        )}
      </div>

      {/* Subject Name */}
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          marginBottom: '16px',
          background: isHovered
            ? 'linear-gradient(to right, #8285FF, #0005E9)'
            : 'none',
          backgroundClip: isHovered ? 'text' : 'none',
          WebkitBackgroundClip: isHovered ? 'text' : 'none',
          WebkitTextFillColor: isHovered ? 'transparent' : 'white',
          transition: 'all 0.3s ease',
          lineHeight: '1.2',
        }}
      >
        {subject.name}
      </h1>

      {/* Description */}
      <p
        style={{
          fontSize: '16px',
          color: '#A7ACB2',
          textAlign: 'center',
          lineHeight: '1.6',
          marginBottom: '24px',
          flex: 1,
          overflow: 'auto',
        }}
      >
        {subject.description}
      </p>

      {/* Link to FAST subject page */}
      <div
        style={{
          marginBottom: '24px',
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (subject.fastUrl) {
              window.open(subject.fastUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          style={{
            background: 'linear-gradient(145deg, #8285FF, #0005E9)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(130, 133, 255, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow =
              '0 6px 16px rgba(130, 133, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 4px 12px rgba(130, 133, 255, 0.3)';
          }}
        >
          Explore in FAST →
        </button>
      </div>

      {/* Holographic effect overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '20px',
          background: isHovered
            ? 'linear-gradient(45deg, transparent 30%, rgba(130, 133, 255, 0.1) 50%, transparent 70%)'
            : 'none',
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
        }}
      />
    </div>
  );
};

export default TradingCard;
