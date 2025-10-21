
import React, { useState } from 'react';
import type { Deck, Card } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { EditDeckModal } from './EditDeckModal';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { generateCardsFromTopic } from '../services/geminiService';

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
    const [aiTopic, setAiTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

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

    const handleGenerate = async () => {
        if (!aiTopic.trim()) {
            alert('Please enter a topic to generate cards.');
            return;
        }
        setIsGenerating(true);
        try {
            const generatedText = await generateCardsFromTopic(aiTopic, 10);
            setCardsText(prev => prev ? `${prev}\n${generatedText}` : generatedText);
            setAiTopic('');
        } catch (error) {
            alert((error as Error).message);
        } finally {
            setIsGenerating(false);
        }
    }

    const handleClose = () => {
        setDeckName('');
        setCardsText('');
        setAiTopic('');
        setIsGenerating(false);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-app shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold">Create New Deck</h2>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="newDeckName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deck Name</label>
                        <input
                            id="newDeckName"
                            type="text"
                            value={deckName}
                            onChange={(e) => setDeckName(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                        />
                    </div>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-md p-3 space-y-2">
                         <label htmlFor="aiTopic" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Generate cards with AI</label>
                         <div className="flex space-x-2">
                           <input
                                id="aiTopic"
                                type="text"
                                value={aiTopic}
                                onChange={(e) => setAiTopic(e.target.value)}
                                placeholder="e.g., 'React Hooks'"
                                className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                            />
                            <button onClick={handleGenerate} disabled={isGenerating} className="bg-sky-500 text-white px-4 py-2 rounded-app font-semibold hover:bg-sky-600 transition-colors flex items-center justify-center disabled:bg-sky-300 disabled:cursor-not-allowed">
                                <SparklesIcon className="w-5 h-5 mr-2" />
                                {isGenerating ? 'Generating...' : 'Generate'}
                            </button>
                         </div>
                    </div>
                    <div>
                        <label htmlFor="newCardsText" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cards (front;back)</label>
                        <textarea
                            id="newCardsText"
                            value={cardsText}
                            onChange={(e) => setCardsText(e.target.value)}
                            rows={10}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 font-mono text-sm"
                            placeholder="Question;Answer"
                        />
                        <p className="text-xs text-slate-500 mt-1">One card per line, separated by a semicolon (;).</p>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-b-app flex justify-end space-x-3">
                    <button onClick={handleClose} className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-app font-semibold hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-sky-500 text-white px-4 py-2 rounded-app font-semibold hover:bg-sky-600 transition-colors">
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
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Decks</h1>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-sky-500 text-white px-4 py-2 rounded-app font-semibold hover:bg-sky-600 transition-colors flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Deck
        </button>
      </div>

      {decks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => (
            <div key={deck.id} className="bg-white dark:bg-slate-800 rounded-app shadow-sm flex flex-col">
              <div className="p-4 flex-grow">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg ${deck.color} flex items-center justify-center`}>
                        <BrainCircuitIcon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">{deck.name}</h3>
                        <p className="text-sm text-slate-500">{deck.cards.length} cards</p>
                      </div>
                    </div>
                     <div className="flex space-x-1">
                        <button onClick={() => setEditingDeck(deck)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Edit deck">
                            <PencilIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => onDeleteDeck(deck.id)} className="p-2 rounded-full text-slate-500 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400" aria-label="Delete deck">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                     </div>
                 </div>
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-700/50">
                <button
                  onClick={() => onStartStudy(deck)}
                  className="w-full bg-sky-500 text-white px-4 py-2 rounded-app font-semibold hover:bg-sky-600 transition-colors"
                >
                  Study Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-white dark:bg-slate-800 rounded-app">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">No decks yet!</h2>
          <p className="text-slate-500 mt-2 mb-6">Click 'New Deck' to create your first set of flashcards.</p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-sky-500 text-white px-6 py-3 rounded-app font-semibold hover:bg-sky-600 transition-colors flex items-center mx-auto"
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
      
      <EditDeckModal
        isOpen={!!editingDeck}
        onClose={() => setEditingDeck(null)}
        deck={editingDeck}
        onSave={onUpdateDeck}
      />
    </div>
  );
};
