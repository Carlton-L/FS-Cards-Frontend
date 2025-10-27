// src/pages/SearchResultsPage/SearchResultsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import SearchBar from '../../components/SearchBar';
import SearchResultCard from '../../components/TradingCard/SearchResultCard';
import { useData } from '../../contexts/DataContext';
import { searchSubjects } from '../../utils/dataLoader';
import Logo from '../../components/Logo';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { subjects, labs } = useData();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      fastUrl: string;
    }>
  >([]);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    setSearchQuery(query);

    setIsLoading(true);

    setTimeout(() => {
      if (query.trim()) {
        const results = searchSubjects(subjects, query);
        const converted = results.map((subjectData) => ({
          id:
            subjectData.fsid ||
            subjectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: subjectData.name,
          description: subjectData.summary,
          fastUrl: subjectData.fst,
        }));
        setFilteredResults(converted);
      } else {
        const all = subjects.map((subjectData) => ({
          id:
            subjectData.fsid ||
            subjectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: subjectData.name,
          description: subjectData.summary,
          fastUrl: subjectData.fst,
        }));
        setFilteredResults(all);
      }
      setIsLoading(false);
    }, 100);
  }, [searchParams, subjects]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setIsLoading(true);
      navigate('/search');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
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

  return (
    <Layout>
      <div
        style={{
          padding: 'clamp(20px, 5vw, 60px) 16px',
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
            <Logo size={800} variant='full' />
          </div>
        </div>

        {/* Search Bar with Button */}
        <div
          style={{
            display: 'flex',
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            justifyContent: 'center',
            marginBottom: '40px',
            gap: '12px',
            alignItems: 'stretch',
            width: '100%',
          }}
        >
          <div
            onKeyPress={handleKeyPress}
            style={{
              flex: '0 1 auto',
              maxWidth: '100%',
            }}
          >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            style={{
              background: 'linear-gradient(145deg, #8285FF, #0005E9)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isLoading ? 0.6 : 1,
              minWidth: window.innerWidth < 640 ? '100%' : '100px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 16px rgba(130, 133, 255, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Decks Section */}
        {!searchQuery && !isLoading && (
          <div
            style={{
              marginBottom: '60px',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(20px, 5vw, 24px)',
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: '24px',
              }}
            >
              Browse by Deck
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                gap: '16px',
              }}
            >
              {labs.map((lab) => (
                <div
                  key={lab.id}
                  onClick={() => navigate(`/deck/${lab.id}`)}
                  style={{
                    background: 'rgba(26, 26, 26, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(130, 133, 255, 0.1)';
                    e.currentTarget.style.borderColor =
                      'rgba(130, 133, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(26, 26, 26, 0.6)';
                    e.currentTarget.style.borderColor =
                      'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <h3
                    style={{
                      fontSize: 'clamp(16px, 4vw, 18px)',
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                      marginBottom: '8px',
                    }}
                  >
                    {lab.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      color: '#A7ACB2',
                      lineHeight: '1.5',
                    }}
                  >
                    {lab.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
              gap: '20px',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                border: '4px solid rgba(130, 133, 255, 0.3)',
                borderTop: '4px solid #8285FF',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <p
              style={{
                fontSize: '16px',
                color: '#A7ACB2',
              }}
            >
              Searching cards...
            </p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <>
            {/* Search Results Header */}
            <div
              style={{
                width: '100%',
                marginBottom: '24px',
                textAlign: 'left',
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(18px, 4vw, 20px)',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                {searchQuery ? 'Search Results' : 'All Cards'}
              </h2>
              <p
                style={{
                  fontSize: 'clamp(12px, 3vw, 14px)',
                  color: '#A7ACB2',
                }}
              >
                Found {filteredResults.length} cards
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            {/* Search Results Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
                gap: '20px',
                width: '100%',
              }}
            >
              {filteredResults.map((subject) => (
                <SearchResultCard
                  key={subject.id}
                  subject={subject}
                  onCardClick={handleCardClick}
                />
              ))}
            </div>

            {filteredResults.length === 0 && (
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
                  No cards found matching your search.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    navigate('/search');
                  }}
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
                    e.currentTarget.style.background =
                      'rgba(130, 133, 255, 0.1)';
                    e.currentTarget.style.borderColor =
                      'rgba(130, 133, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(26, 26, 26, 0.8)';
                    e.currentTarget.style.borderColor =
                      'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  View All Cards
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default SearchResultsPage;
