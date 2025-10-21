import React, { useState, useRef, useMemo } from 'react';
import type { Deck, Card } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';

interface StudyScreenProps {
  decks: Deck[];
  onAddDeck: (deck: Deck) => void;
  onStartStudy: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
}

const COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-app shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-b-app flex justify-end">
          <button onClick={onClose} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-app font-semibold hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DeckCard: React.FC<{
    deck: Deck;
    onStartStudy: (deck: Deck) => void;
    onDeleteDeck: (deckId: string) => void;
}> = ({ deck, onStartStudy, onDeleteDeck }) => {
    const dueCards = useMemo(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return deck.cards.filter(card => {
             const dueDate = new Date(card.due || 0);
             return card.state === 'new' || dueDate <= today;
        }).length;
    }, [deck.cards]);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-app shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 flex-1">
            <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-full ${deck.color} flex items-center justify-center`}>
                    <BrainCircuitIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-slate-800 dark:text-white">{deck.name}</h3>
                    <p className="text-sm text-slate-500">{deck.cards.length} cards</p>
                </div>
            </div>
             {dueCards > 0 && (
                <div className="text-sm text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/50 px-2 py-1 rounded-md">
                    {dueCards} card{dueCards === 1 ? '' : 's'} due
                </div>
            )}
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 flex justify-between items-center">
            <button onClick={() => onDeleteDeck(deck.id)} className="text-slate-400 hover:text-red-500 p-2 rounded-full transition-colors">
                <TrashIcon className="w-5 h-5" />
            </button>
            <button onClick={() => onStartStudy(deck)} className="bg-sky-500 text-white px-4 py-2 rounded-app font-semibold hover:bg-sky-600 transition-colors disabled:bg-slate-300 dark:disabled:bg-slate-600" disabled={dueCards === 0}>
              Study Now
            </button>
          </div>
        </div>
    );
};

export const StudyScreen: React.FC<StudyScreenProps> = ({ decks, onAddDeck, onStartStudy, onDeleteDeck }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const deckName = file.name.split('.').slice(0, -1).join('.');
    const reader = new FileReader();

    reader.onload = (e) => {
        const content = e.target?.result as string;
        let cards: Omit<Card, 'id'>[] = [];
        
        try {
            if (file.name.endsWith('.csv')) {
                const rows = content.split('\n').slice(1); // Assuming header row
                cards = rows.map(row => {
                    const [front, back] = row.split(',');
                    return { front: front?.trim(), back: back?.trim() };
                }).filter(c => c.front && c.back);
            } else if (file.name.endsWith('.txt')) {
                cards = content.split('\n').map(line => {
                    const parts = line.split(/[;\t]/); // Split by semicolon or tab
                    return { front: parts[0]?.trim(), back: parts[1]?.trim() };
                }).filter(c => c.front && c.back);
            } else if (file.name.endsWith('.apkg')) {
                alert(".apkg import is not supported due to its complexity. Please export your Anki deck as a CSV or TXT file and try again.");
                return;
            } else {
                alert("Unsupported file type. Please use .csv or .txt");
                return;
            }

            if (cards.length > 0) {
              const newDeck: Deck = {
                  id: Date.now().toString(),
                  name: deckName,
                  cards: cards.map((c, i) => ({ ...c, id: `c-${Date.now()}-${i}`})),
                  color: getRandomColor(),
              };
              onAddDeck(newDeck);
              setIsModalOpen(false);
            } else {
                alert("Could not find any valid cards in the file.");
            }

        } catch (err) {
            console.error(err);
            alert("An error occurred while parsing the file.");
        }
    };

    reader.readAsText(file);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Decks</h1>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-sky-500 text-white px-4 py-2 rounded-app font-semibold hover:bg-sky-600 transition-colors shadow-sm">
          <PlusIcon className="w-5 h-5" />
          <span>Add Deck</span>
        </button>
      </div>

      {decks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map(deck => (
            <DeckCard 
                key={deck.id}
                deck={deck}
                onStartStudy={onStartStudy}
                onDeleteDeck={onDeleteDeck}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-white dark:bg-slate-800 rounded-app">
          <h2 className="text-xl font-semibold mb-2">No decks found</h2>
          <p className="text-slate-500 mb-4">Click 'Add Deck' to create your first flashcard deck.</p>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-sky-500 text-white px-4 py-2 rounded-app font-semibold hover:bg-sky-600 transition-colors shadow-sm mx-auto">
            <PlusIcon className="w-5 h-5" />
            <span>Add Deck</span>
          </button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Import Deck from File">
        <div>
            <p className="mb-4 text-slate-600 dark:text-slate-300">Upload a .csv or .txt file. Each line should contain a front and back value, separated by a comma (for CSV) or a semicolon/tab (for TXT).</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv,.txt,.apkg" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center space-x-2 bg-sky-500 text-white px-4 py-3 rounded-app font-semibold hover:bg-sky-600 transition-colors">
                <UploadIcon className="w-6 h-6" />
                <span>Choose File</span>
            </button>
            <p className="text-sm text-slate-500 mt-2">.apkg files are not directly supported.</p>
        </div>
      </Modal>
    </div>
  );
};