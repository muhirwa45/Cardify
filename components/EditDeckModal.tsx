import React, { useState, useEffect } from 'react';
import type { Deck, Card } from '../types';

interface EditDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: Deck | null;
  onSave: (updatedDeck: Deck) => void;
}

export const EditDeckModal: React.FC<EditDeckModalProps> = ({ isOpen, onClose, deck, onSave }) => {
  const [deckName, setDeckName] = useState('');
  const [cardsText, setCardsText] = useState('');

  useEffect(() => {
    if (deck) {
      setDeckName(deck.name);
      const text = deck.cards.map(c => `${c.front};${c.back}`).join('\n');
      setCardsText(text);
    }
  }, [deck]);

  if (!isOpen || !deck) return null;

  const handleSave = () => {
    // FIX: Add a null check for `deck` to prevent spreading null.
    if (!deck) return;
    
    const cardLines = cardsText.split('\n').filter(line => line.trim() !== '');
    
    // Create a map of existing cards by their front content to preserve their SRS data
    const existingCardsByFront = new Map(deck.cards.map(c => [c.front, c]));

    const newCards: Card[] = cardLines.map((line, index) => {
      const parts = line.split(';');
      const front = parts[0]?.trim() || '';
      const back = parts.slice(1).join(';').trim() || '';
      
      const existingCard = existingCardsByFront.get(front);
      
      if (existingCard) {
        // If card exists, update its back content but keep SRS data
        return { ...existingCard, back };
      }
      
      // Otherwise, it's a new card
      return {
          id: `c-${Date.now()}-${index}`,
          front,
          back,
          state: 'new'
      };
    });

    const updatedDeck: Deck = {
      ...deck,
      name: deckName,
      cards: newCards,
    };
    
    onSave(updatedDeck);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-app shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">Edit Deck: {deck.name}</h2>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="deckName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deck Name</label>
            <input
              id="deckName"
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label htmlFor="cardsText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cards (front;back)</label>
            <textarea
              id="cardsText"
              value={cardsText}
              onChange={(e) => setCardsText(e.target.value)}
              rows={15}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 font-mono text-sm"
              placeholder="Question;Answer"
            />
            <p className="text-xs text-slate-500 mt-1">One card per line, separated by a semicolon (;). Existing card progress will be kept if the 'front' text is unchanged.</p>
          </div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-b-app flex justify-end space-x-3">
          <button onClick={onClose} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-app font-semibold hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-sky-500 text-white px-4 py-2 rounded-app font-semibold hover:bg-sky-600 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
