// src/components/TradingCard/SearchResultCard.tsx
import React, { useState } from 'react';
import type { Subject } from '../../types';

interface SearchResultCardProps {
  subject: Subject;
  onCardClick: (subject: Subject) => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  subject,
  onCardClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onCardClick(subject)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: '0',
        height: '200px',
        background: isHovered
          ? 'linear-gradient(145deg, rgba(130, 133, 255, 0.1), rgba(0, 5, 233, 0.1))'
          : 'rgba(26, 26, 26, 0.8)',
        backdropFilter: 'blur(10px)',
        border: isHovered
          ? '2px solid #8285FF'
          : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 12px 24px rgba(130, 133, 255, 0.2)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
        boxSizing: 'border-box',
      }}
    >
      {/* Subject Name */}
      <h3
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '12px',
          background: isHovered
            ? 'linear-gradient(to right, #8285FF, #0005E9)'
            : 'none',
          backgroundClip: isHovered ? 'text' : 'none',
          WebkitBackgroundClip: isHovered ? 'text' : 'none',
          WebkitTextFillColor: isHovered ? 'transparent' : 'white',
          transition: 'all 0.3s ease',
          lineHeight: '1.3',
        }}
      >
        {subject.name}
      </h3>

      {/* Description (truncated) */}
      <p
        style={{
          fontSize: '14px',
          color: '#A7ACB2',
          lineHeight: '1.5',
          flex: 1,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          marginBottom: '12px',
        }}
      >
        {subject.description}
      </p>

      {/* View button */}
      <div
        style={{
          alignSelf: 'flex-end',
        }}
      >
        <span
          style={{
            color: '#64ffda',
            fontSize: '14px',
            fontWeight: '500',
            opacity: isHovered ? 1 : 0.7,
            transition: 'all 0.3s ease',
          }}
        >
          View Card →
        </span>
      </div>

      {/* Holographic effect overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '16px',
          background: isHovered
            ? 'linear-gradient(45deg, transparent 30%, rgba(130, 133, 255, 0.05) 50%, transparent 70%)'
            : 'none',
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
        }}
      />
    </div>
  );
};

export default SearchResultCard;
