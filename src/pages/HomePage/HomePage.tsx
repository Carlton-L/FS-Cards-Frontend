// src/pages/HomePage/HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import SearchBar from '../../components/SearchBar';
import Logo from '../../components/Logo';

const HomePage: React.FC = () => {
  const [searchQuery, _setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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

        <p
          style={{
            fontSize: 'clamp(14px, 4vw, 18px)',
            color: '#A7ACB2',
            textAlign: 'center',
            maxWidth: '600px',
            lineHeight: '1.6',
            marginBottom: '40px',
            padding: '0 16px',
          }}
        >
          Explore breakthrough technologies and innovations that will shape our
          future.
        </p>

        <div
          style={{
            width: '100%',
            maxWidth: '600px',
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'center',
            padding: '0 16px',
          }}
        >
          <SearchBar value={searchQuery} onSubmit={handleSearch} />
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '0 16px',
          }}
        >
          <button
            onClick={() => navigate('/deck/ag')}
            style={{
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: 'clamp(14px, 3vw, 16px)',
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
            Browse Agriculture Deck
          </button>

          <button
            onClick={() => navigate('/search')}
            style={{
              background: 'rgba(26, 26, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: 'clamp(14px, 3vw, 16px)',
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
      </div>
    </Layout>
  );
};

export default HomePage;
