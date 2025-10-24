// src/pages/CardPage/CardPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import TradingCard from '../../components/TradingCard';
import { useData } from '../../contexts/DataContext';
import { getSubjectBySlug } from '../../utils/dataLoader';
import Logo from '../../components/Logo';

const ExternalLinkIcon: React.FC = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
  >
    <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
    <polyline points='15 3 21 3 21 9'></polyline>
    <line x1='10' y1='14' x2='21' y2='3'></line>
  </svg>
);

const CardPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { subjects, labs } = useData();
  const [showWikiTooltip, setShowWikiTooltip] = useState(false);

  const subjectData = slug ? getSubjectBySlug(subjects, slug) : undefined;

  if (!subjectData) {
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
            Card Not Found
          </h1>
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

  const subject = {
    id: slug!,
    name: subjectData.name,
    description: subjectData.summary,
    fastUrl: `https://futurity.science/subject/${slug}`, // Fallback URL
  };

  const subjectLabs = labs.filter((lab) => subjectData.labs.includes(lab.id));

  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
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

        <TradingCard subject={subject} />

        <div
          style={{
            marginTop: '40px',
            maxWidth: '500px',
            width: '100%',
          }}
        >
          {subjectData.category && (
            <div
              style={{
                background: 'rgba(26, 26, 26, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#64ffda',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Category
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#FFFFFF',
                  textTransform: 'capitalize',
                }}
              >
                {subjectData.category}
              </div>
            </div>
          )}

          {subjectData.inventor && (
            <div
              style={{
                background: 'rgba(26, 26, 26, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#64ffda',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Inventor/Developer
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#FFFFFF',
                }}
              >
                {subjectData.inventor}
              </div>
            </div>
          )}

          {subjectData.synonyms.length > 0 && (
            <div
              style={{
                background: 'rgba(26, 26, 26, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#64ffda',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Also Known As
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#A7ACB2',
                  lineHeight: '1.6',
                }}
              >
                {subjectData.synonyms.join(', ')}
              </div>
            </div>
          )}

          {subjectData.wikipediaUrl && (
            <div
              style={{
                background: 'rgba(26, 26, 26, 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#64ffda',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Learn More
              </div>
              <a
                href={subjectData.wikipediaUrl}
                target='_blank'
                rel='noopener noreferrer'
                onMouseEnter={() => setShowWikiTooltip(true)}
                onMouseLeave={() => setShowWikiTooltip(false)}
                style={{
                  fontSize: '16px',
                  color: '#8285FF',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'color 0.3s ease',
                }}
              >
                <span>Wikipedia Article</span>
                <ExternalLinkIcon />
              </a>

              {showWikiTooltip && subjectData.wikipediaDefinition && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: '8px',
                    background: 'rgba(17, 17, 17, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(130, 133, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    maxWidth: '400px',
                    width: 'max-content',
                    fontSize: '14px',
                    color: '#FFFFFF',
                    lineHeight: '1.5',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {subjectData.wikipediaDefinition.substring(0, 200)}
                  {subjectData.wikipediaDefinition.length > 200 && '...'}
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid rgba(130, 133, 255, 0.3)',
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {subjectLabs.length > 0 && (
          <div
            style={{
              marginTop: '20px',
              maxWidth: '500px',
              width: '100%',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              Featured in Futurity Labs
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {subjectLabs.map((lab) => (
                <div
                  key={lab.id}
                  style={{
                    background: 'rgba(26, 26, 26, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(130, 133, 255, 0.1)';
                    e.currentTarget.style.borderColor =
                      'rgba(130, 133, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(26, 26, 26, 0.6)';
                    e.currentTarget.style.borderColor =
                      'rgba(255, 255, 255, 0.1)';
                  }}
                  onClick={() => navigate(`/deck/${lab.id}`)}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                      marginBottom: '8px',
                    }}
                  >
                    {lab.name}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#A7ACB2',
                      lineHeight: '1.5',
                    }}
                  >
                    {lab.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CardPage;
