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
  const { subjects } = useData();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
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

    if (query.trim()) {
      const results = searchSubjects(subjects, query);
      // Convert SubjectData to Subject format
      const converted = results.map((subjectData) => ({
        id: subjectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: subjectData.name,
        description: subjectData.summary,
        fastUrl: subjectData.fst,
      }));
      setFilteredResults(converted);
    } else {
      // Show all subjects if no query
      const all = subjects.map((subjectData) => ({
        id: subjectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: subjectData.name,
        description: subjectData.summary,
        fastUrl: subjectData.fst,
      }));
      setFilteredResults(all);
    }
  }, [searchParams, subjects]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
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
          padding: '40px 20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
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
        </div>

        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
          />
        </div>

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
              fontSize: '20px',
              color: '#FFFFFF',
              fontWeight: '600',
              marginBottom: '8px',
            }}
          >
            Search Results
          </h2>
          <p
            style={{
              fontSize: '14px',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            width: '100%',
            boxSizing: 'border-box',
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
                fontSize: '18px',
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
                e.currentTarget.style.background = 'rgba(130, 133, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(130, 133, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(26, 26, 26, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              View All Cards
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchResultsPage;
