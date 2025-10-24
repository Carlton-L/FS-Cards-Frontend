// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import HomePage from './pages/HomePage';
import CardPage from './pages/CardPage';
import SearchResultsPage from './pages/SearchResultsPage';
import DeckPage from './pages/DeckPage';

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/a/:slug' element={<CardPage />} />
          <Route path='/search' element={<SearchResultsPage />} />
          <Route path='/deck/:id' element={<DeckPage />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
