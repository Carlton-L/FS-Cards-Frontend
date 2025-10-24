// src/components/DeckStack/DeckStack.tsx
import React, { useState } from 'react';
import type { Subject } from '../../types';
import MiniCard from '../TradingCard/MiniCard';

interface DeckStackProps {
  subjects: Subject[];
  onCardClick: (subject: Subject) => void;
}

const DeckStack: React.FC<DeckStackProps> = ({ subjects, onCardClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '200px',
        height: '260px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease',
      }}
    >
      {/* Show top 5 cards in stack */}
      {subjects
        .slice(0, 5)
        .reverse()
        .map((subject, index) => (
          <MiniCard
            key={index}
            subject={subject}
            isTop={index === 4}
            stackIndex={4 - index}
            onCardClick={onCardClick}
          />
        ))}

      {/* Card count indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(100, 255, 218, 0.1)',
          border: '1px solid rgba(100, 255, 218, 0.2)',
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '12px',
          color: '#64ffda',
          fontWeight: 'bold',
        }}
      >
        {subjects.length} cards
      </div>
    </div>
  );
};

export default DeckStack;
