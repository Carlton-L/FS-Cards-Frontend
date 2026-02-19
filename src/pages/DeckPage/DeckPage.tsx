// src/pages/DeckPage/DeckPage.tsx
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import SearchResultCard from '../../components/TradingCard/SearchResultCard';
import { useData } from '../../contexts/DataContext';
import Logo from '../../components/Logo';
import DeckStack from '../../components/DeckStack';
import PrintModal, { type PrintOptions } from '../../components/PrintModal';
import { generateCardsPDF } from '../../utils/pdfGenerator';
import { generateStickersPDF } from '../../utils/stickerGenerator';
import printIcon from '../../assets/print_icon.svg';

const DeckPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subjects, labs } = useData();
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const currentLab = useMemo(() => {
    return labs.find((lab) => lab.id === id);
  }, [labs, id]);

  const filteredSubjects = useMemo(() => {
    if (!id) return [];
    return subjects
      .filter((subject) => subject.labs.includes(id))
      .map((subject) => ({
        id: subject.fsid,
        name: subject.name,
        description: subject.summary,
        fastUrl: subject.fst,
      }));
  }, [subjects, id]);

  const deckSubjects = useMemo(() => {
    if (!id) return [];
    return subjects.filter((subject) => subject.labs.includes(id));
  }, [subjects, id]);

  // Convert SubjectData to Subject format for components
  const convertedSubjects = deckSubjects.map((subjectData) => ({
    id: subjectData.fsid,
    name: subjectData.name,
    description: subjectData.summary,
    fastUrl: subjectData.fst,
  }));

  const handlePrint = async (
    options: PrintOptions,
    onProgress?: (current: number, total: number) => void
  ) => {
    const cardsData = deckSubjects.map((subject) => ({
      id: subject.fsid,
      name: subject.name,
      category: subject.category,
      summary: subject.summary,
    }));

    try {
      if (options.printType === 'stickers') {
        await generateStickersPDF(
          cardsData.map(({ id, name }) => ({ id, name })),
          { template: options.template as 'apli10199' | 'averyL4732' },
          onProgress
        );
      } else {
        await generateCardsPDF(
          cardsData,
          {
            template: options.template as 'avery5371' | 'avery8371' | 'avery5376' | 'apli10609' | 'apli10608',
            includeCategory: options.includeCategory,
            includeSummary: options.includeSummary,
          },
          onProgress
        );
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleCardClick = (subject: {
    id: string;
    name: string;
    description: string;
    fastUrl: string;
  }) => {
    navigate(`/a/${subject.id}`);
  };

  if (!currentLab) {
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
          }}
        >
          <div
            onClick={() => navigate('/')}
            style={{
              marginBottom: '24px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
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

          <h1
            style={{
              fontSize: 'clamp(24px, 5vw, 32px)',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginBottom: '16px',
            }}
          >
            Deck Not Found
          </h1>
          <p
            style={{
              fontSize: 'clamp(14px, 3vw, 16px)',
              color: '#A7ACB2',
              marginBottom: '32px',
            }}
          >
            The deck you're looking for doesn't exist.
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
            Browse All Decks
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        style={{
          padding: 'clamp(40px, 8vw, 80px) 16px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
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

        {/* Deck Info */}
        <div
          style={{
            background: 'rgba(26, 26, 26, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: 'clamp(20px, 5vw, 32px)',
            marginBottom: '48px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(24px, 6vw, 36px)',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginBottom: '16px',
            }}
          >
            {currentLab.name}
          </h1>
          <p
            style={{
              fontSize: 'clamp(14px, 3vw, 18px)',
              color: '#A7ACB2',
              lineHeight: '1.6',
              maxWidth: '800px',
              margin: '0 auto',
              marginBottom: '40px',
            }}
          >
            {currentLab.description}
          </p>
          {/* Deck Stack */}
          {convertedSubjects.length > 0 ? (
            <DeckStack
              subjects={convertedSubjects}
              onCardClick={handleCardClick}
            />
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
              }}
            >
              <p
                style={{
                  fontSize: 'clamp(16px, 4vw, 18px)',
                  color: '#A7ACB2',
                  marginBottom: '24px',
                }}
              >
                No cards found in this deck yet.
              </p>
              <button
                onClick={() => navigate('/search')}
                style={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(130, 133, 255, 0.1)';
                  e.currentTarget.style.borderColor =
                    'rgba(130, 133, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(26, 26, 26, 0.8)';
                  e.currentTarget.style.borderColor =
                    'rgba(255, 255, 255, 0.1)';
                }}
              >
                Browse All Cards
              </button>
            </div>
          )}
          <div
            style={{
              marginTop: '8px',
              padding: 'clamp(12px, 3vw, 16px) clamp(20px, 4vw, 24px)',
              background: 'rgba(130, 133, 255, 0.1)',
              border: '1px solid rgba(130, 133, 255, 0.3)',
              borderRadius: '12px',
              display: 'inline-block',
            }}
          >
            <p
              style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                color: '#8285FF',
                fontWeight: 'bold',
              }}
            >
              {filteredSubjects.length} cards in this deck
            </p>
          </div>

          {/* Print Button */}
          {filteredSubjects.length > 0 && (
            <button
              onClick={() => setIsPrintModalOpen(true)}
              style={{
                marginTop: '16px',
                padding: '12px 24px',
                background: 'linear-gradient(145deg, #8285FF, #0005E9)',
                border: 'none',
                borderRadius: '12px',
                color: '#FFFFFF',
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
                style={{ width: '20px', height: '20px' }}
              />
              Print Deck
            </button>
          )}
        </div>

        {/* Print Modal */}
        <PrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          onPrint={handlePrint}
          cardCount={filteredSubjects.length}
        />

        {/* Cards Grid */}
        {filteredSubjects.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
              gap: '20px',
              width: '100%',
            }}
          >
            {filteredSubjects.map((subject) => (
              <SearchResultCard
                key={subject.id}
                subject={subject}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
            }}
          >
            <p
              style={{
                fontSize: 'clamp(16px, 4vw, 18px)',
                color: '#A7ACB2',
                marginBottom: '24px',
              }}
            >
              No cards found in this deck yet.
            </p>
            <button
              onClick={() => navigate('/search')}
              style={{
                background: 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(130, 133, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(130, 133, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(26, 26, 26, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Browse All Cards
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DeckPage;
