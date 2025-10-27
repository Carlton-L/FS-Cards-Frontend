// src/components/TradingCard/TradingCard.tsx
import React, { useState } from 'react';

export interface TradingCardProps {
  card: {
    id: string;
    name: string;
    description: string;
    category: string;
    fastUrl?: string;
    labs?: string[];
    inventor?: string;
    synonyms?: string[];
    wikipediaDefinition?: string;
    wikipediaUrl?: string;
  };
}

const TradingCard: React.FC<TradingCardProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!card) {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          aspectRatio: '2 / 3',
          background: 'rgba(26, 26, 26, 0.8)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#A7ACB2',
        }}
      >
        Card data not available
      </div>
    );
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getCategoryGradient = (category: string): string => {
    const gradients: { [key: string]: string } = {
      futuristic: 'linear-gradient(145deg, #8B5CF6, #3B82F6)',
      emerging: 'linear-gradient(145deg, #10B981, #3B82F6)',
      existing: 'linear-gradient(145deg, #F59E0B, #EF4444)',
      default: 'linear-gradient(145deg, #8285FF, #0005E9)',
    };
    return gradients[category.toLowerCase()] || gradients['default'];
  };

  // Hexagon SVG background
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
      style={{
        width: '100%',
        maxWidth: 'min(600px, calc(100vw - 32px))',
        aspectRatio: '2 / 3',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.6s',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        cursor: 'pointer',
        margin: '0 auto',
      }}
      onClick={handleFlip}
    >
      {/* Front of card */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          MozBackfaceVisibility: 'hidden',
          borderRadius: 'clamp(12px, 3vw, 20px)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          transform: 'rotateY(0deg)',
        }}
      >
        {/* Header gradient */}
        <div
          style={{
            background: getCategoryGradient(card.category),
            padding: 'clamp(16px, 4vw, 24px)',
            color: 'white',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(10px, 2.5vw, 12px)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px',
              opacity: 0.9,
            }}
          >
            {card.category}
          </div>
          <h2
            style={{
              fontSize: 'clamp(20px, 5vw, 28px)',
              fontWeight: 'bold',
              margin: 0,
              lineHeight: '1.2',
            }}
          >
            {card.name}
          </h2>
        </div>

        {/* Main content with hexagon background */}
        <div
          style={{
            flex: 1,
            background: 'rgba(26, 26, 26, 0.95)',
            padding: 'clamp(16px, 4vw, 24px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(12px, 3vw, 16px)',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          <HexagonBackground />

          {/* Content on top of hexagon */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Description */}
            <div>
              <h3
                style={{
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  color: '#8285FF',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px',
                }}
              >
                Description
              </h3>
              <p
                style={{
                  fontSize: 'clamp(13px, 3.5vw, 16px)',
                  lineHeight: '1.6',
                  color: '#E5E7EB',
                  margin: 0,
                }}
              >
                {card.description}
              </p>
            </div>

            {/* Inventor */}
            {card.inventor && (
              <div style={{ marginTop: 'clamp(12px, 3vw, 16px)' }}>
                <h3
                  style={{
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    color: '#8285FF',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                  }}
                >
                  Inventor
                </h3>
                <p
                  style={{
                    fontSize: 'clamp(13px, 3.5vw, 16px)',
                    lineHeight: '1.6',
                    color: '#E5E7EB',
                    margin: 0,
                  }}
                >
                  {card.inventor}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            background: 'rgba(17, 17, 17, 0.95)',
            padding: 'clamp(12px, 3vw, 16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(10px, 2.5vw, 12px)',
              color: '#646E78',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            FS.CARDS
          </div>
          <div
            style={{
              fontSize: 'clamp(10px, 2.5vw, 12px)',
              color: '#646E78',
            }}
          >
            Click to flip
          </div>
        </div>
      </div>

      {/* Back of card */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          MozBackfaceVisibility: 'hidden',
          borderRadius: 'clamp(12px, 3vw, 20px)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          transform: 'rotateY(180deg)',
        }}
      >
        {/* Back header */}
        <div
          style={{
            background: getCategoryGradient(card.category),
            padding: 'clamp(16px, 4vw, 24px)',
            color: 'white',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(10px, 2.5vw, 12px)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px',
              opacity: 0.9,
            }}
          >
            {card.category}
          </div>
          <h2
            style={{
              fontSize: 'clamp(20px, 5vw, 28px)',
              fontWeight: 'bold',
              margin: 0,
              lineHeight: '1.2',
            }}
          >
            {card.name}
          </h2>
        </div>

        {/* Back content with hexagon background */}
        <div
          style={{
            flex: 1,
            background: 'rgba(26, 26, 26, 0.95)',
            padding: 'clamp(16px, 4vw, 24px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(12px, 3vw, 16px)',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          <HexagonBackground />

          {/* Content on top of hexagon */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Wikipedia Definition */}
            {card.wikipediaDefinition && (
              <div>
                <h3
                  style={{
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    color: '#8285FF',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                  }}
                >
                  Definition
                </h3>
                <p
                  style={{
                    fontSize: 'clamp(13px, 3.5vw, 16px)',
                    lineHeight: '1.6',
                    color: '#E5E7EB',
                    margin: 0,
                  }}
                >
                  {card.wikipediaDefinition}
                </p>
              </div>
            )}

            {/* Synonyms */}
            {card.synonyms && card.synonyms.length > 0 && (
              <div style={{ marginTop: 'clamp(12px, 3vw, 16px)' }}>
                <h3
                  style={{
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    color: '#8285FF',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                  }}
                >
                  Also Known As
                </h3>
                <p
                  style={{
                    fontSize: 'clamp(13px, 3.5vw, 16px)',
                    lineHeight: '1.6',
                    color: '#E5E7EB',
                    margin: 0,
                  }}
                >
                  {card.synonyms.join(', ')}
                </p>
              </div>
            )}

            {/* Links */}
            <div
              style={{
                marginTop: 'auto',
                paddingTop: 'clamp(12px, 3vw, 16px)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {card.fastUrl && (
                <a
                  href={`https://futurity.science/subject/${card.id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-block',
                    padding: '10px 16px',
                    background: 'linear-gradient(145deg, #8285FF, #0005E9)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(130, 133, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  View on Futurity Science →
                </a>
              )}

              {card.wikipediaUrl && (
                <a
                  href={card.wikipediaUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-block',
                    padding: '10px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: 'clamp(12px, 3vw, 14px)',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  Read on Wikipedia →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Back footer */}
        <div
          style={{
            background: 'rgba(17, 17, 17, 0.95)',
            padding: 'clamp(12px, 3vw, 16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(10px, 2.5vw, 12px)',
              color: '#646E78',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            FS.CARDS
          </div>
          <div
            style={{
              fontSize: 'clamp(10px, 2.5vw, 12px)',
              color: '#646E78',
            }}
          >
            Click to flip
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingCard;
