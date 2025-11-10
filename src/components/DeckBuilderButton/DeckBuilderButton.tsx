// src/components/DeckBuilderButton/DeckBuilderButton.tsx
import React, { useState } from 'react';
import { useDeckBuilder } from '../../contexts/DeckBuilderContext';
import DeckBuilderModal from '../DeckBuilderModal';
import cardsIcon from '../../assets/cards.svg';

const DeckBuilderButton: React.FC = () => {
  const { cardCount } = useDeckBuilder();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (cardCount === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'linear-gradient(145deg, #8285FF, #0005E9)',
          border: 'none',
          borderRadius: '50%',
          width: '64px',
          height: '64px',
          color: '#FFFFFF',
          fontSize: '24px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(130, 133, 255, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow =
            '0 12px 32px rgba(130, 133, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow =
            '0 8px 24px rgba(130, 133, 255, 0.4)';
        }}
      >
        <img
          src={cardsIcon}
          alt='Cards'
          style={{ width: '28px', height: '28px' }}
        />
        <span
          style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#FF4D4D',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '2px solid #1a1a1a',
          }}
        >
          {cardCount}
        </span>
      </button>

      <DeckBuilderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default DeckBuilderButton;
