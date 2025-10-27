// src/components/Layout/Layout.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NodeNetworkBackground from '../NodeNetworkBackground';
import Footer from '../Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isFadedIn, setIsFadedIn] = useState(false);

  useEffect(() => {
    // Reset to faded out
    setIsFadedIn(false);
    window.scrollTo(0, 0);

    // Fade in after brief delay
    const timer = setTimeout(() => {
      setIsFadedIn(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
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

      {/* Content */}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          opacity: isFadedIn ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
