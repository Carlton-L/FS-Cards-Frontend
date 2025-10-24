// src/components/LoadingScreen/LoadingScreen.tsx
import React from 'react';
import NodeNetworkBackground from '../NodeNetworkBackground';
import Logo from '../Logo';

interface LoadingScreenProps {
  progress?: number;
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress = 0,
  message = 'Loading subjects...',
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        background: '#111111',
      }}
    >
      <NodeNetworkBackground />

      {/* Background blur layer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(64, 64, 64, 0.2)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
        }}
      >
        <div
          style={{
            marginBottom: '24px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Logo size={80} variant='full' />
        </div>

        <div
          style={{
            width: '300px',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '16px',
              color: '#A7ACB2',
              marginBottom: '16px',
            }}
          >
            {message}
          </p>

          {/* Progress bar */}
          <div
            style={{
              width: '100%',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(to right, #8285FF, #0005E9)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Loading spinner */}
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(130, 133, 255, 0.2)',
            borderTop: '3px solid #8285FF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingScreen;
