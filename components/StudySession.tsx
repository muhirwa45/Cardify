import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Deck, Card } from '../types';
import { updateCardSchedule } from '../services/srsService';

const MAX_NEW_CARDS_PER_SESSION = 20;

type Rating = 'again' | 'hard' | 'good' | 'easy';

interface FlashcardProps {
  card: Card;
  isFlipped: boolean;
  onFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, isFlipped, onFlip }) => {
  return (
    <div className="w-full h-80 perspective-1000">
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={onFlip}
      >
        <div className="absolute w-full h-full backface-hidden bg-card rounded-app shadow-lg flex items-center justify-center p-6 text-center">
          <p className="text-2xl font-semibold text-text-base">{card.front}</p>
        </div>
        <div className="absolute w-full h-full backface-hidden bg-card dark:bg-border rounded-app shadow-lg flex items-center justify-center p-6 text-center rotate-y-180">
          <p className="text-xl text-text-base">{card.back}</p>
        </div>
      </div>
    </div>
  );
};

interface StudySessionProps {
  deck: Deck;
  onClose: () => void;
  onSessionComplete: (deckId: string, updatedCards: Card[]) => void;
}

export const StudySession: React.FC<StudySessionProps> = ({ deck, onClose, onSessionComplete }) => {
  const [sessionQueue, setSessionQueue] = useState<Card[]>([]);
  const [relearningQueue, setRelearningQueue] = useState<Card[]>([]);
  const [updatedCards, setUpdatedCards] = useState<Map<string, Card>>(new Map());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const newCards = deck.cards
      .filter(c => c.state === 'new')
      .sort(() => Math.random() - 0.5) // Shuffle new cards
      .slice(0, MAX_NEW_CARDS_PER_SESSION);

    const dueCards = deck.cards.filter(c => {
      const dueDate = new Date(c.due || 0);
      return c.state !== 'new' && dueDate <= today;
    });

    // Shuffle the combined queue
    const queue = [...newCards, ...dueCards].sort(() => Math.random() - 0.5);
    setSessionQueue(queue);
    
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsComplete(queue.length === 0);
  }, [deck]);

  const handleEndSession = useCallback(() => {
    onSessionComplete(deck.id, Array.from(updatedCards.values()));
    onClose();
  }, [deck.id, updatedCards, onSessionComplete, onClose]);

  const handleFlip = useCallback(() => {
    if (isComplete) return;
    setIsFlipped(prev => !prev);
  }, [isComplete]);

  const handleNextCard = useCallback((rating: Rating) => {
    const card = sessionQueue[currentIndex];
    if (!card) return;

    const updatedCard = updateCardSchedule(card, rating);
    setUpdatedCards(prev => new Map(prev).set(updatedCard.id, updatedCard));

    if (rating === 'again') {
        setRelearningQueue(prev => [...prev, updatedCard]);
    }

    if (currentIndex < sessionQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      // Finished initial queue, now start on relearning queue if it exists
      if (relearningQueue.length > 0) {
        setSessionQueue(relearningQueue);
        setRelearningQueue([]);
        setCurrentIndex(0);
        setIsFlipped(false);
      } else {
        setIsComplete(true);
      }
    }
  }, [currentIndex, sessionQueue, relearningQueue]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (isComplete) return;

        switch (event.key) {
            case ' ':
                event.preventDefault(); // prevent scrolling
                handleFlip();
                break;
            case 'Home':
                event.preventDefault();
                handleEndSession();
                break;
            case 'End':
                 event.preventDefault();
                if (isFlipped) {
                   handleNextCard('good');
                }
                break;
        }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFlipped, isComplete, handleFlip, handleEndSession, handleNextCard]);
  
  const totalInitialCards = useMemo(() => sessionQueue.length, [sessionQueue]);
  const progress = totalInitialCards > 0 ? ((currentIndex + 1) / totalInitialCards) * 100 : 0;

  if (sessionQueue.length === 0 && !isComplete) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
             <h2 className="text-2xl font-bold mb-2">{deck.name}</h2>
             <p className="text-text-muted mb-6">No cards are due for review in this deck today.</p>
             <button onClick={handleEndSession} className="bg-primary text-primary-content px-6 py-3 rounded-app font-semibold hover:bg-primary-hover transition-colors">
                Back to Decks
            </button>
        </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <h2 className="text-3xl font-bold text-center text-text-base">Deck Complete!</h2>
        <p className="text-text-muted mt-2 mb-8">You've reviewed all due cards for this session.</p>
        <button onClick={handleEndSession} className="bg-primary text-primary-content px-6 py-3 rounded-app font-semibold hover:bg-primary-hover transition-colors">
          Finish Session
        </button>
      </div>
    );
  }

  const currentCard = sessionQueue[currentIndex];

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">{deck.name}</h2>
        <button onClick={handleEndSession} className="font-semibold text-primary hover:text-primary-hover">
          End
        </button>
      </header>

      <div className="w-full bg-border h-1.5">
        <div className="bg-primary h-1.5" style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Flashcard card={currentCard} isFlipped={isFlipped} onFlip={handleFlip} />
        </div>
      </main>

      <footer className="p-4">
        {isFlipped ? (
            <div className="grid grid-cols-4 gap-3">
              <button onClick={() => handleNextCard('again')} className="bg-red-200 text-red-800 dark:bg-red-800/50 dark:text-red-200 py-3 rounded-app font-semibold text-center flex flex-col items-center"><span className="text-sm">&lt;10m</span>Again</button>
              <button onClick={() => handleNextCard('hard')} className="bg-amber-200 text-amber-800 dark:bg-amber-800/50 dark:text-amber-200 py-3 rounded-app font-semibold text-center flex flex-col items-center"><span className="text-sm">~1d</span>Hard</button>
              <button onClick={() => handleNextCard('good')} className="bg-green-200 text-green-800 dark:bg-green-800/50 dark:text-green-200 py-3 rounded-app font-semibold text-center flex flex-col items-center"><span className="text-sm">~2d</span>Good</button>
              <button onClick={() => handleNextCard('easy')} className="bg-primary/20 text-primary-hover dark:bg-primary/30 dark:text-primary py-3 rounded-app font-semibold text-center flex flex-col items-center"><span className="text-sm">~4d</span>Easy</button>
            </div>
        ) : (
            <button onClick={handleFlip} className="w-full bg-primary text-primary-content py-3 rounded-app font-semibold hover:bg-primary-hover transition-colors">
                Show Answer
            </button>
        )}
      </footer>
       <style jsx global>{`
          .perspective-1000 { perspective: 1000px; }
          .transform-style-3d { transform-style: preserve-3d; }
          .rotate-y-180 { transform: rotateY(180deg); }
          .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        `}</style>
    </div>
  );
};