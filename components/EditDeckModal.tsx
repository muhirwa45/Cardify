
import React, { useState, useEffect } from 'react';
import type { Deck, Card } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';

interface EditDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: Deck | null;
  onSave: (updatedDeck: Deck) => void;
}

// Use a temporary type for cards in state to handle new, unsaved cards
type EditableCard = Partial<Card> & { front: string; back: string };

export const EditDeckModal: React.FC<EditDeckModalProps> = ({ isOpen, onClose, deck, onSave }) => {
  const [deckName, setDeckName] = useState('');
  const [cards, setCards] = useState<EditableCard[]>([]);

  useEffect(() => {
    if (deck) {
      setDeckName(deck.name);
      // Create a deep copy to avoid mutating the original deck state directly
      setCards(JSON.parse(JSON.stringify(deck.cards)));
    }
  }, [deck]);

  if (!isOpen || !deck) return null;

  const handleCardChange = (index: number, field: 'front' | 'back', value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
  };

  const handleAddCard = () => {
    setCards([...cards, { front: '', back: '', state: 'new' }]);
  };

  const handleDeleteCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!deckName.trim()) {
      alert("Please enter a deck name.");
      return;
    }
    
    const finalCards: Card[] = cards
      .filter(card => card.front.trim() || card.back.trim()) // Remove empty cards
      .map((card, index) => ({
        id: card.id || `c-${Date.now()}-${index}`,
        front: card.front.trim(),
        back: card.back.trim(),
        state: card.state || 'new',
        due: card.due,
        interval: card.interval
      }));

    const updatedDeck: Deck = {
      ...deck,
      name: deckName,
      cards: finalCards,
    };
    onSave(updatedDeck);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-app shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold">Edit Deck</h2>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="editDeckName" className="block text-sm font-medium text-text-muted mb-1">Deck Name</label>
            <input
              id="editDeckName"
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div className="space-y-3">
             <label className="block text-sm font-medium text-text-muted">Cards</label>
             {cards.map((card, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-start">
                    <textarea
                        value={card.front}
                        onChange={(e) => handleCardChange(index, 'front', e.target.value)}
                        placeholder={`Front ${index + 1}`}
                        rows={2}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-mono text-sm resize-y"
                    />
                    <textarea
                        value={card.back}
                        onChange={(e) => handleCardChange(index, 'back', e.target.value)}
                        placeholder={`Back ${index + 1}`}
                        rows={2}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-mono text-sm resize-y"
                    />
                     <button 
                        onClick={() => handleDeleteCard(index)} 
                        className="p-2.5 rounded-md text-text-muted hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 self-center justify-self-end md:justify-self-center"
                        aria-label="Delete card"
                     >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}
             <button
                onClick={handleAddCard}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 mt-2 border-2 border-dashed border-border rounded-app text-text-muted hover:border-primary hover:text-primary transition-colors"
             >
                <PlusIcon className="w-5 h-5" />
                <span>Add Card</span>
            </button>
          </div>
        </div>
        <div className="p-4 bg-background dark:bg-card/50 rounded-b-app flex justify-end space-x-3">
          <button onClick={onClose} className="bg-border text-text-base px-4 py-2 rounded-app font-semibold hover:bg-border/80 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-primary text-primary-content px-4 py-2 rounded-app font-semibold hover:bg-primary-hover transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
