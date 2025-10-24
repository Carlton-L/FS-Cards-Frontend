// src/pages/DeckPage/DeckPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import DeckStack from '../../components/DeckStack';
import { useData } from '../../contexts/DataContext';
import { getSubjectsByLab } from '../../utils/dataLoader';
import Logo from '../../components/Logo';

const SubjectListItem: React.FC<{
  subject: { id: string; name: string; description: string; fastUrl: string };
  onSubjectClick: (subject: {
    id: string;
    name: string;
    description: string;
    fastUrl: string;
  }) => void;
}> = ({ subject, onSubjectClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onSubjectClick(subject)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        background: isHovered
          ? 'rgba(130, 133, 255, 0.1)'
          : 'rgba(26, 26, 26, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: '8px',
      }}
    >
      {/* Mini icon */}
      <div
        style={{
          width: '24px',
          height: '24px',
          background: 'linear-gradient(145deg, #8285FF, #0005E9)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          flexShrink: 0,
        }}
      >
        <svg width='12' height='12' viewBox='0 0 24 24' fill='none'>
          <path
            d='M12 2L20.196 7V17L12 22L3.804 17V7L12 2Z'
            fill='white'
            stroke='white'
            strokeWidth='1'
            strokeLinejoin='round'
          />
        </svg>
      </div>

      {/* Subject info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
            marginBottom: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {subject.name}
        </h4>
        <p
          style={{
            fontSize: '12px',
            color: '#A7ACB2',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {subject.description}
        </p>
      </div>

      {/* Arrow */}
      <div
        style={{
          color: '#64ffda',
          marginLeft: '12px',
          opacity: isHovered ? 1 : 0.5,
          transition: 'opacity 0.3s ease',
        }}
      >
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <path d='m9 18 6-6-6-6' />
        </svg>
      </div>
    </div>
  );
};

const DeckPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subjects, labs } = useData();

  // Find the lab/deck by ID
  const lab = labs.find((l) => l.id === id);

  // Get subjects for this lab
  const deckSubjects = id ? getSubjectsByLab(subjects, id) : [];

  // Convert SubjectData to Subject format for components
  const convertedSubjects = deckSubjects.map((subjectData) => ({
    id: subjectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: subjectData.name,
    description: subjectData.summary,
    fastUrl: subjectData.fst,
  }));

  if (!lab || deckSubjects.length === 0) {
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
          }}
        >
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '24px',
            }}
          >
            Deck Not Found
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#A7ACB2',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            {lab
              ? 'No subjects found in this deck.'
              : 'This deck does not exist.'}
          </p>
          <button
            onClick={() => navigate('/')}
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
          >
            Back to Home
          </button>
        </div>
      </Layout>
    );
  }

  const handlePrintDeck = () => {
    window.print();
  };

  const handleCardClick = (subject: {
    id: string;
    name: string;
    description: string;
    fastUrl: string;
  }) => {
    navigate(`/a/${subject.id}`);
  };

  const handleSubjectClick = (subject: {
    id: string;
    name: string;
    description: string;
    fastUrl: string;
  }) => {
    navigate(`/a/${subject.id}`);
  };

  return (
    <Layout>
      <div
        style={{
          padding: '40px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <h1>
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
              <Logo variant='full' />
            </div>
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#A7ACB2',
            }}
          >
            Deck Collection
          </p>
        </div>

        {/* Deck Info and Stack - Responsive Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            alignItems: 'center',
            marginBottom: '60px',
          }}
        >
          {/* Deck Info */}
          <div>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '16px',
              }}
            >
              {lab.name}
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: '#A7ACB2',
                lineHeight: '1.6',
                marginBottom: '24px',
              }}
            >
              {lab.description}
            </p>

            {/* Print Button */}
            <button
              onClick={handlePrintDeck}
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
                boxShadow: '0 4px 12px rgba(130, 133, 255, 0.3)',
                display: 'flex',
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
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(130, 133, 255, 0.3)';
              }}
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <polyline points='6,9 6,2 18,2 18,9' />
                <path d='M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18' />
                <polyline points='6,14 18,14 18,22 6,22' />
              </svg>
              Print Deck
            </button>
          </div>

          {/* Visual Deck Stack - centered for smaller screens */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <DeckStack
              subjects={convertedSubjects}
              onCardClick={handleCardClick}
            />
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                background: 'rgba(26, 26, 26, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                minWidth: '150px',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#64ffda',
                  marginBottom: '4px',
                }}
              >
                {convertedSubjects.length}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#A7ACB2',
                }}
              >
                Total Cards
              </div>
            </div>
          </div>
        </div>

        {/* Subject List */}
        <div>
          <h3
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            All Cards in Deck
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '0 20px',
            }}
          >
            {convertedSubjects.map((subject) => (
              <SubjectListItem
                key={subject.id}
                subject={subject}
                onSubjectClick={handleSubjectClick}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeckPage;
