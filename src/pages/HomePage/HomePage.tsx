// src/pages/HomePage/HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import SearchBar from '../../components/SearchBar';
import Logo from '../../components/Logo';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
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
          padding: '40px 20px',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '24px',
            background: 'linear-gradient(to right, #8285FF, #0005E9)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          <Logo variant='full' size={128} />
        </h1>

        <p
          style={{
            fontSize: '18px',
            color: '#A7ACB2',
            textAlign: 'center',
            maxWidth: '600px',
            lineHeight: '1.6',
            marginBottom: '40px',
          }}
        >
          Explore breakthrough technologies and innovations that will shape our
          future.
        </p>

        <div
          style={{
            width: '100%',
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
          />
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
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
      </div>
    </Layout>
  );
};

export default HomePage;
