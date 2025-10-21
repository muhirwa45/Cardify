
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
      setCardsText(deck.cards.map(c => `${c.front};${c.back}`).join('\n'));
    }
  }, [deck]);

  if (!isOpen || !deck) return null;

  const handleSave = () => {
    if (!deckName.trim()) {
      alert("Please enter a deck name.");
      return;
    }
    const cardLines = cardsText.split('\n').filter(line => line.trim() !== '');
    
    const updatedCards: Card[] = cardLines.map((line, index) => {
      const parts = line.split(';');
      const front = parts[0]?.trim() || '';
      const back = parts.slice(1).join(';').trim() || '';
      
      // Try to find the original card to preserve its ID and SRS state.
      // This is a simple match; a more robust solution might use a unique key if card content can be edited.
      const originalCard = deck.cards.find(c => c.front === front && c.back === back);
      
      return {
        id: originalCard?.id || `c-${Date.now()}-${index}`,
        front,
        back,
        state: originalCard?.state || 'new',
        due: originalCard?.due,
        interval: originalCard?.interval
      };
    });

    const updatedDeck: Deck = {
      ...deck,
      name: deckName,
      cards: updatedCards,
    };
    onSave(updatedDeck);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-app shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">Edit Deck</h2>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="editDeckName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deck Name</label>
            <input
              id="editDeckName"
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label htmlFor="editCardsText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cards (front;back)</label>
            <textarea
              id="editCardsText"
              value={cardsText}
              onChange={(e) => setCardsText(e.target.value)}
              rows={15}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 font-mono text-sm"
              placeholder="Question;Answer"
            />
            <p className="text-xs text-slate-500 mt-1">One card per line, separated by a semicolon (;).</p>
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
