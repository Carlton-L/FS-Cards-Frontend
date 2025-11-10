// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { DeckBuilderProvider } from './contexts/DeckBuilderContext';
import HomePage from './pages/HomePage';
import CardPage from './pages/CardPage';
import SearchResultsPage from './pages/SearchResultsPage';
import DeckPage from './pages/DeckPage';
import DeckBuilderButton from './components/DeckBuilderButton';

const App: React.FC = () => {
  return (
    <DataProvider>
      <DeckBuilderProvider>
        <Router>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/a/:slug' element={<CardPage />} />
            <Route path='/search' element={<SearchResultsPage />} />
            <Route path='/deck/:id' element={<DeckPage />} />
          </Routes>
          <DeckBuilderButton />
        </Router>
      </DeckBuilderProvider>
    </DataProvider>
  );
};

export default App;
