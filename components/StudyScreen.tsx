import React, { useState } from 'react';
import type { Deck, Card } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { EditDeckModal } from './EditDeckModal';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ImportDeckModal } from './ImportDeckModal';
import { UploadIcon } from './icons/UploadIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ConfirmationModal } from './ConfirmationModal';

const colorOptions = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];
const getRandomColor = () => colorOptions[Math.floor(Math.random() * colorOptions.length)];

interface CreateDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newDeck: Deck) => void;
}

const CreateDeckModal: React.FC<CreateDeckModalProps> = ({ isOpen, onClose, onSave }) => {
    const [deckName, setDeckName] = useState('');
    const [cardsText, setCardsText] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!deckName.trim()) {
            alert("Please enter a deck name.");
            return;
        }
        const cardLines = cardsText.split('\n').filter(line => line.trim() !== '');
        const newCards: Card[] = cardLines.map((line, index) => {
            const parts = line.split(';');
            const front = parts[0]?.trim() || '';
            const back = parts.slice(1).join(';').trim() || '';
            return {
                id: `c-${Date.now()}-${index}`,
                front,
                back,
                state: 'new'
            };
        });
        const newDeck: Deck = {
            id: `d-${Date.now()}`,
            name: deckName,
            cards: newCards,
            color: getRandomColor(),
        };
        onSave(newDeck);
        handleClose();
    };

    const handleClose = () => {
        setDeckName('');
        setCardsText('');
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-app shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold">Create New Deck</h2>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="newDeckName" className="block text-sm font-medium text-text-muted mb-1">Deck Name</label>
                        <input
                            id="newDeckName"
                            type="text"
                            value={deckName}
                            onChange={(e) => setDeckName(e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="newCardsText" className="block text-sm font-medium text-text-muted mb-1">Cards (front;back)</label>
                        <textarea
                            id="newCardsText"
                            value={cardsText}
                            onChange={(e) => setCardsText(e.target.value)}
                            rows={10}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-mono text-sm"
                            placeholder="Question;Answer"
                        />
                        <p className="text-xs text-text-muted mt-1">One card per line, separated by a semicolon (;).</p>
                    </div>
                </div>
                <div className="p-4 bg-background dark:bg-card/50 rounded-b-app flex justify-end space-x-3">
                    <button onClick={handleClose} className="bg-border text-text-base px-4 py-2 rounded-app font-semibold hover:bg-border/80 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-primary text-primary-content px-4 py-2 rounded-app font-semibold hover:bg-primary-hover transition-colors">
                        Create Deck
                    </button>
                </div>
            </div>
        </div>
    );
};


interface StudyScreenProps {
  decks: Deck[];
  onAddDeck: (newDeck: Deck) => void;
  onUpdateDeck: (updatedDeck: Deck) => void;
  onStartStudy: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
}

export const StudyScreen: React.FC<StudyScreenProps> = ({ decks, onAddDeck, onUpdateDeck, onStartStudy, onDeleteDeck }) => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deckToDelete, setDeckToDelete] = useState<Deck | null>(null);

  const filteredDecks = decks.filter(deck =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleInitiateDelete = (deck: Deck) => {
    setDeckToDelete(deck);
  };

  const handleConfirmDelete = () => {
    if (deckToDelete) {
      onDeleteDeck(deckToDelete.id);
      setDeckToDelete(null);
    }
  };
  
  const handleCancelDelete = () => {
    setDeckToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Decks</h1>
        <div className="flex items-center space-x-2">
            <button
              onClick={() => setImportModalOpen(true)}
              className="bg-primary-light text-primary-hover dark:bg-primary/20 dark:text-primary px-4 py-2 rounded-app font-semibold hover:bg-primary/20 transition-colors flex items-center"
            >
              <UploadIcon className="w-5 h-5 mr-2" />
              Import
            </button>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="bg-primary text-primary-content px-4 py-2 rounded-app font-semibold hover:bg-primary-hover transition-colors flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              New Deck
            </button>
        </div>
      </div>
      
      {decks.length > 0 && (
         <div className="relative">
            <input
                type="text"
                placeholder="Search decks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-app shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        </div>
      )}

      {decks.length > 0 ? (
        filteredDecks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map(deck => (
                <div key={deck.id} className="bg-card rounded-app shadow-sm flex flex-col">
                <div className="p-4 flex-grow">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg ${deck.color} flex items-center justify-center`}>
                            <BrainCircuitIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-text-base">{deck.name}</h3>
                            <p className="text-sm text-text-muted">{deck.cards.length} cards</p>
                        </div>
                        </div>
                        <div className="flex space-x-1">
                            <button onClick={() => setEditingDeck(deck)} className="p-2 rounded-full text-text-muted hover:bg-background dark:hover:bg-border" aria-label="Edit deck">
                                <PencilIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleInitiateDelete(deck)} className="p-2 rounded-full text-text-muted hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400" aria-label="Delete deck">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-border/50">
                    <button
                    onClick={() => onStartStudy(deck)}
                    className="w-full bg-primary text-primary-content px-4 py-2 rounded-app font-semibold hover:bg-primary-hover transition-colors"
                    >
                    Study Now
                    </button>
                </div>
                </div>
            ))}
            </div>
        ) : (
             <div className="text-center py-20 px-4 bg-card rounded-app">
                <h2 className="text-xl font-semibold text-text-base">No Decks Found</h2>
                <p className="text-text-muted mt-2">Your search for "{searchQuery}" did not match any decks.</p>
            </div>
        )
      ) : (
        <div className="text-center py-20 px-4 bg-card rounded-app">
          <h2 className="text-xl font-semibold text-text-base">No decks yet!</h2>
          <p className="text-text-muted mt-2 mb-6">Click 'New Deck' to create your first set of flashcards.</p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-primary text-primary-content px-6 py-3 rounded-app font-semibold hover:bg-primary-hover transition-colors flex items-center mx-auto"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Your First Deck
          </button>
        </div>
      )}

      <CreateDeckModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={onAddDeck}
      />
      
       <ImportDeckModal
        isOpen={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSave={onAddDeck}
      />
      
      <EditDeckModal
        isOpen={!!editingDeck}
        onClose={() => setEditingDeck(null)}
        deck={editingDeck}
        onSave={onUpdateDeck}
      />

      <ConfirmationModal
        isOpen={!!deckToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Deck"
        message={
            <>
              Are you sure you want to permanently delete the deck "<strong>{deckToDelete?.name}</strong>"? This action cannot be undone.
            </>
        }
        confirmButtonText="Delete"
      />
    </div>
  );
};