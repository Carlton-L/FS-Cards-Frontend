// src/contexts/DeckBuilderContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface DeckBuilderCard {
  id: string;
  name: string;
  category: string;
  summary: string;
}

interface DeckBuilderContextType {
  cards: DeckBuilderCard[];
  addCard: (card: DeckBuilderCard) => void;
  removeCard: (cardId: string) => void;
  clearAll: () => void;
  hasCard: (cardId: string) => boolean;
  cardCount: number;
}

const DeckBuilderContext = createContext<DeckBuilderContextType | undefined>(
  undefined
);

const STORAGE_KEY = 'fs_deck_builder_cards';

export const DeckBuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cards, setCards] = useState<DeckBuilderCard[]>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
      console.error('Failed to save deck builder state:', error);
    }
  }, [cards]);

  const addCard = (card: DeckBuilderCard) => {
    setCards((prev) => {
      if (prev.some((c) => c.id === card.id)) {
        return prev;
      }
      return [...prev, card];
    });
  };

  const removeCard = (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const clearAll = () => {
    setCards([]);
  };

  const hasCard = (cardId: string) => {
    return cards.some((c) => c.id === cardId);
  };

  return (
    <DeckBuilderContext.Provider
      value={{
        cards,
        addCard,
        removeCard,
        clearAll,
        hasCard,
        cardCount: cards.length,
      }}
    >
      {children}
    </DeckBuilderContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDeckBuilder = () => {
  const context = useContext(DeckBuilderContext);
  if (!context) {
    throw new Error('useDeckBuilder must be used within DeckBuilderProvider');
  }
  return context;
};
