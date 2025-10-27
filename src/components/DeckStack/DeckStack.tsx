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
        width: '160px',
        height: '260px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease',
      }}
    >
      {/* Show top 5 cards in stack */}
      {subjects.slice(0, 5).map((subject, index) => (
        <MiniCard
          key={index}
          subject={subject}
          isTop={index === 0}
          stackIndex={index}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default DeckStack;
