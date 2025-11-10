// src/contexts/DataContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SubjectData, LabData } from '../utils/dataLoader';
import { loadSubjectsData } from '../utils/dataLoader';
import { getLabsFromSubjects } from '../utils/dataLoader';
import LoadingScreen from '../components/LoadingScreen';

interface DataContextType {
  subjects: SubjectData[];
  labs: LabData[];
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [labs, setLabs] = useState<LabData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setProgress(10);
        const subjectsData = await loadSubjectsData();
        setProgress(70);

        const labsData = getLabsFromSubjects(subjectsData);
        setProgress(90);

        setSubjects(subjectsData);
        setLabs(labsData);
        setProgress(100);

        // Small delay to show 100% before hiding
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load subjects data. Please refresh the page.');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <LoadingScreen progress={progress} message='Loading subjects...' />;
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '40px 20px',
          background: '#111111',
          color: 'white',
        }}
      >
        <h1
          style={{ fontSize: '24px', marginBottom: '16px', color: '#ff6b6b' }}
        >
          Error Loading Data
        </h1>
        <p style={{ color: '#A7ACB2', marginBottom: '24px' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'linear-gradient(145deg, #8285FF, #0005E9)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ subjects, labs, isLoading, error }}>
      {children}
    </DataContext.Provider>
  );
};
