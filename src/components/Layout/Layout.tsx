// src/components/Layout/Layout.tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NodeNetworkBackground from '../NodeNetworkBackground';
import Footer from '../Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
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
          paddingTop: '72px',
          display: 'flex',
          flexDirection: 'column',
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
