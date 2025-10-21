import React, { useState, useEffect, useCallback } from 'react';
import type { Deck, Card, View } from './types';
import { HomeScreen } from './components/HomeScreen';
import { StudyScreen } from './components/StudyScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNav } from './components/BottomNav';
import { StudySession } from './components/StudySession';

// Sample data for initial state
const initialDecks: Deck[] = [
  {
    id: '1',
    name: 'Spanish Vocabulary',
    cards: [
      { id: 'c1', front: 'Hola', back: 'Hello', state: 'new' },
      { id: 'c2', front: 'Adiós', back: 'Goodbye', state: 'new' },
      { id: 'c3', front: 'Gracias', back: 'Thank you', state: 'new' },
    ],
    color: 'bg-red-500',
  },
    {
    id: '2',
    name: 'React Hooks',
    cards: [
      { id: 'c4', front: 'useState', back: 'Manages state in a functional component', state: 'new' },
      { id: 'c5', front: 'useEffect', back: 'Performs side effects in functional components', state: 'new' },
    ],
    color: 'bg-sky-500',
  },
];


const App: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>(() => {
    try {
      const savedDecks = localStorage.getItem('flashcard-decks');
      return savedDecks ? JSON.parse(savedDecks) : initialDecks;
    } catch (error) {
      console.error("Failed to parse decks from localStorage", error);
      return initialDecks;
    }
  });
  const [view, setView] = useState<View>('home');
  const [activeStudyDeck, setActiveStudyDeck] = useState<Deck | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('flashcard-decks', JSON.stringify(decks));
    } catch (error) {
      console.error("Failed to save decks to localStorage", error);
    }
  }, [decks]);

  const handleAddDeck = useCallback((newDeck: Deck) => {
    setDecks(prevDecks => [...prevDecks, newDeck]);
  }, []);

  const handleUpdateDeck = useCallback((updatedDeck: Deck) => {
    setDecks(prevDecks => prevDecks.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck));
  }, []);

  const handleDeleteDeck = useCallback((deckId: string) => {
    if (window.confirm("Are you sure you want to delete this deck? This action cannot be undone.")) {
      setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
    }
  }, []);
  
  const handleStartStudy = useCallback((deck: Deck) => {
    setActiveStudyDeck(deck);
  }, []);

  const handleSessionComplete = useCallback((deckId: string, updatedCards: Card[]) => {
    setDecks(prevDecks =>
      prevDecks.map(deck => {
        if (deck.id === deckId) {
          const updatedCardMap = new Map(updatedCards.map(c => [c.id, c]));
          const newCards = deck.cards.map(card => updatedCardMap.get(card.id) || card);
          return { ...deck, cards: newCards };
        }
        return deck;
      })
    );
    setActiveStudyDeck(null);
  }, []);
  
  const handleCloseSession = useCallback(() => {
    setActiveStudyDeck(null);
  }, [])

  const renderContent = () => {
    if (activeStudyDeck) {
      return <StudySession deck={activeStudyDeck} onClose={handleCloseSession} onSessionComplete={handleSessionComplete} />;
    }

    switch (view) {
      case 'home':
        return <HomeScreen decks={decks} onStartStudy={handleStartStudy} />;
      case 'study':
        return <StudyScreen decks={decks} onAddDeck={handleAddDeck} onUpdateDeck={handleUpdateDeck} onStartStudy={handleStartStudy} onDeleteDeck={handleDeleteDeck} />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen decks={decks} onStartStudy={handleStartStudy} />;
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100 font-sans">
        <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
            {renderContent()}
        </main>
        {!activeStudyDeck && <BottomNav activeView={view} setView={setView} />}
    </div>
  );
};

export default App;
