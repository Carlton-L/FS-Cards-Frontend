// src/components/SearchBar/SearchBar.tsx
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';

interface SearchBarProps {
  value: string;
  onSubmit: (value: string) => void;
  placeholder?: string;
}

export interface SearchBarHandle {
  getCurrentValue: () => string;
}

const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(
  ({ value, onSubmit, placeholder = 'Search for innovations...' }, ref) => {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    useImperativeHandle(ref, () => ({
      getCurrentValue: () => localValue,
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
    };

    const handleSubmit = () => {
      onSubmit(localValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    return (
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <input
          type='text'
          value={localValue}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '16px 50px 16px 20px',
            fontSize: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(10px)',
            color: '#FFFFFF',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(130, 133, 255, 0.5)';
            e.currentTarget.style.boxShadow =
              '0 0 0 3px rgba(130, 133, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        {/* Search icon */}
        <div
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#A7ACB2',
            pointerEvents: 'none',
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
            <circle cx='11' cy='11' r='8' />
            <path d='m21 21-4.35-4.35' />
          </svg>
        </div>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
