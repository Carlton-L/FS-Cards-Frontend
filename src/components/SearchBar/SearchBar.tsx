// src/components/SearchBar/SearchBar.tsx
import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search for cards...',
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
      }}
    >
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '16px 20px',
          fontSize: '16px',
          background: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          color: 'white',
          outline: 'none',
          transition: 'all 0.3s ease',
          fontFamily: 'inherit',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#8285FF';
          e.currentTarget.style.background = 'rgba(130, 133, 255, 0.1)';
          e.currentTarget.style.boxShadow =
            '0 0 0 3px rgba(130, 133, 255, 0.2)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.background = 'rgba(26, 26, 26, 0.8)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />

      <button
        type='submit'
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#64ffda',
          cursor: 'pointer',
          padding: '4px',
        }}
      >
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
        >
          <circle cx='11' cy='11' r='8'></circle>
          <path d='m21 21-4.35-4.35'></path>
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;
