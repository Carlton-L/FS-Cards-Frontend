// src/components/DeckBuilderModal/DeckBuilderModal.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeckBuilder } from '../../contexts/DeckBuilderContext';
import PrintModal, { type PrintOptions } from '../PrintModal';
import { generateCardsPDF } from '../../utils/pdfGenerator';
import printIcon from '../../assets/print_icon.svg';

interface DeckBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeckBuilderModal: React.FC<DeckBuilderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { cards, removeCard, clearAll } = useDeckBuilder();
  const navigate = useNavigate();
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  if (!isOpen) return null;

  const handlePrint = async (options: PrintOptions) => {
    try {
      await generateCardsPDF(cards, options);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleCardClick = (cardId: string) => {
    onClose();
    navigate(`/a/${cardId}`);
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              Custom Deck Builder
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#A7ACB2',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          {/* Card Count Info */}
          <div
            style={{
              padding: '16px',
              background: 'rgba(130, 133, 255, 0.1)',
              border: '1px solid rgba(130, 133, 255, 0.3)',
              borderRadius: '12px',
              marginBottom: '24px',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: '#8285FF',
                margin: 0,
              }}
            >
              <strong>{cards.length}</strong> card
              {cards.length !== 1 ? 's' : ''} in your custom deck
            </p>
          </div>

          {/* Cards List */}
          {cards.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  color: '#A7ACB2',
                  marginBottom: '24px',
                }}
              >
                Your deck is empty. Browse cards and add them to build your
                custom deck!
              </p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/search');
                }}
                style={{
                  background: 'linear-gradient(145deg, #8285FF, #0005E9)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                Browse Cards
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '24px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}
              >
                {cards.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      background: 'rgba(26, 26, 26, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <div
                      onClick={() => handleCardClick(card.id)}
                      style={{
                        flex: 1,
                        cursor: 'pointer',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#FFFFFF',
                          marginBottom: '4px',
                        }}
                      >
                        {card.name}
                      </h3>
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#8285FF',
                          marginBottom: '8px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {card.category}
                      </p>
                      <p
                        style={{
                          fontSize: '14px',
                          color: '#A7ACB2',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {card.summary}
                      </p>
                    </div>
                    <button
                      onClick={() => removeCard(card.id)}
                      style={{
                        background: 'rgba(255, 77, 77, 0.1)',
                        border: '1px solid rgba(255, 77, 77, 0.3)',
                        borderRadius: '8px',
                        color: '#FF4D4D',
                        fontSize: '20px',
                        width: '36px',
                        height: '36px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 77, 77, 0.2)';
                        e.currentTarget.style.borderColor =
                          'rgba(255, 77, 77, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 77, 77, 0.1)';
                        e.currentTarget.style.borderColor =
                          'rgba(255, 77, 77, 0.3)';
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={clearAll}
                  style={{
                    padding: '12px 24px',
                    background: 'rgba(255, 77, 77, 0.1)',
                    border: '1px solid rgba(255, 77, 77, 0.3)',
                    borderRadius: '8px',
                    color: '#FF4D4D',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 77, 77, 0.2)';
                    e.currentTarget.style.borderColor =
                      'rgba(255, 77, 77, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)';
                    e.currentTarget.style.borderColor =
                      'rgba(255, 77, 77, 0.3)';
                  }}
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(145deg, #8285FF, #0005E9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 16px rgba(130, 133, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={printIcon}
                    alt='Print'
                    style={{
                      width: '20px',
                      height: '20px',

                      padding: '0 4px 0 0',
                    }}
                  />
                  Print Custom Deck
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Print Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onPrint={handlePrint}
        cardCount={cards.length}
      />
    </>
  );
};

export default DeckBuilderModal;
