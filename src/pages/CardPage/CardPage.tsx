// src/pages/CardPage/CardPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import TradingCard from '../../components/TradingCard';
import { useData } from '../../contexts/DataContext';
import { useDeckBuilder } from '../../contexts/DeckBuilderContext';
import { getSubjectBySlug, LAB_CODES } from '../../utils/dataLoader';
import Logo from '../../components/Logo';

const CardPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { subjects } = useData();
  const { addCard, removeCard, hasCard } = useDeckBuilder();

  const subject = slug ? getSubjectBySlug(subjects, slug) : undefined;

  if (!subject) {
    return (
      <Layout>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '40px 20px',
            textAlign: 'center',
            width: '100%',
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              onClick={() => navigate('/')}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                display: 'inline-block',
                maxWidth: '100%',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Logo size={800} />
            </div>
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 5vw, 32px)',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginBottom: '16px',
            }}
          >
            Card Not Found
          </h1>
          <p
            style={{
              fontSize: 'clamp(14px, 3vw, 16px)',
              color: '#A7ACB2',
              marginBottom: '32px',
            }}
          >
            The card you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/search')}
            style={{
              background: 'linear-gradient(145deg, #8285FF, #0005E9)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
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
            Browse All Cards
          </button>
        </div>
      </Layout>
    );
  }

  const cardData = {
    id: subject.fsid,
    name: subject.name,
    description: subject.summary,
    category: subject.category,
    fastUrl: subject.fst,
    labs: subject.labs,
    inventor: subject.inventor,
    synonyms: subject.synonyms,
    wikipediaDefinition: subject.wikipediaDefinition,
    wikipediaUrl: subject.wikipediaUrl,
  };

  const isInDeck = hasCard(subject.fsid);

  const handleDeckBuilderToggle = () => {
    if (isInDeck) {
      removeCard(subject.fsid);
    } else {
      addCard({
        id: subject.fsid,
        name: subject.name,
        category: subject.category,
        summary: subject.summary,
      });
    }
  };

  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 'clamp(40px, 8vw, 80px) 16px',
          minHeight: '100vh',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          onClick={() => navigate('/')}
          style={{
            marginBottom: '24px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            display: 'flex',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Logo size={800} />
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: '800px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <TradingCard card={cardData} />

          {/* Deck Builder Button */}
          <button
            onClick={handleDeckBuilderToggle}
            style={{
              padding: '12px 24px',
              background: isInDeck
                ? 'rgba(255, 77, 77, 0.1)'
                : 'linear-gradient(145deg, #8285FF, #0005E9)',
              border: isInDeck ? '1px solid rgba(255, 77, 77, 0.3)' : 'none',
              borderRadius: '12px',
              color: isInDeck ? '#FF4D4D' : '#FFFFFF',
              fontSize: 'clamp(14px, 3vw, 16px)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = isInDeck
                ? '0 6px 16px rgba(255, 77, 77, 0.4)'
                : '0 6px 16px rgba(130, 133, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isInDeck ? (
              <>✓ Remove from Deck Builder</>
            ) : (
              <>+ Add to Deck Builder</>
            )}
          </button>

          {/* Deck Links Below Card */}
          {subject.labs && subject.labs.length > 0 && (
            <div
              style={{
                width: '100%',
                maxWidth: 'min(600px, calc(100vw - 32px))',
              }}
            >
              <h3
                style={{
                  fontSize: 'clamp(14px, 3.5vw, 16px)',
                  color: '#A7ACB2',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '12px',
                  textAlign: 'center',
                }}
              >
                Found in Decks
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {subject.labs.map((labCode) => {
                  const labInfo = LAB_CODES[labCode];
                  return (
                    <button
                      key={labCode}
                      onClick={() => navigate(`/deck/${labCode}`)}
                      style={{
                        padding: '10px 20px',
                        background: 'rgba(130, 133, 255, 0.1)',
                        border: '1px solid rgba(130, 133, 255, 0.3)',
                        borderRadius: '8px',
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        color: '#8285FF',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(130, 133, 255, 0.2)';
                        e.currentTarget.style.borderColor =
                          'rgba(130, 133, 255, 0.5)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(130, 133, 255, 0.1)';
                        e.currentTarget.style.borderColor =
                          'rgba(130, 133, 255, 0.3)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {labInfo ? labInfo.name : labCode.toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CardPage;
