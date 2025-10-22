import React, { useState, useCallback } from 'react';
import type { Deck, Card } from '../types';
import { UploadIcon } from './icons/UploadIcon';

const colorOptions = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];
const getRandomColor = () => colorOptions[Math.floor(Math.random() * colorOptions.length)];

interface ImportDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newDeck: Deck) => void;
}

export const ImportDeckModal: React.FC<ImportDeckModalProps> = ({ isOpen, onClose, onSave }) => {
    const [deckName, setDeckName] = useState('');
    const [fileName, setFileName] = useState<string | null>(null);
    const [parsedCards, setParsedCards] = useState<Omit<Card, 'id' | 'state'>[]>([]);
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const resetState = useCallback(() => {
        setDeckName('');
        setFileName(null);
        setParsedCards([]);
        setIsParsing(false);
        setError(null);
    }, []);

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsParsing(true);
        setError(null);
        setFileName(file.name);
        setParsedCards([]);

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
                if (lines.length === 0) {
                    throw new Error("File is empty or contains no valid lines.");
                }

                const delimiter = lines[0].includes(';') ? ';' : ',';
                
                const cards = lines.map((line, index) => {
                    const parts = line.split(delimiter);
                    if (parts.length < 2) {
                        console.warn(`Skipping malformed line ${index + 1}: ${line}`);
                        return null;
                    }
                    const front = parts[0].trim();
                    const back = parts.slice(1).join(delimiter).trim();
                    return { front, back };
                }).filter((card): card is { front: string, back: string } => card !== null);

                if (cards.length === 0) {
                    throw new Error("Could not parse any valid cards from the file.");
                }

                setParsedCards(cards);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred during parsing.");
                setFileName(null);
            } finally {
                setIsParsing(false);
            }
        };

        reader.onerror = () => {
            setError("Failed to read the file.");
            setIsParsing(false);
            setFileName(null);
        };

        reader.readAsText(file);
    };

    const handleSave = () => {
        if (!deckName.trim()) {
            alert("Please enter a deck name.");
            return;
        }
        if (parsedCards.length === 0) {
            alert("No cards were parsed from the file. Please upload a valid file.");
            return;
        }

        const newCards: Card[] = parsedCards.map((card, index) => ({
            ...card,
            id: `c-${Date.now()}-${index}`,
            state: 'new',
        }));

        const newDeck: Deck = {
            id: `d-${Date.now()}`,
            name: deckName,
            cards: newCards,
            color: getRandomColor(),
        };

        onSave(newDeck);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-app shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-border">
                    <h2 className="text-xl font-bold">Import Deck From File</h2>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label htmlFor="importDeckName" className="block text-sm font-medium text-text-muted mb-1">New Deck Name</label>
                        <input
                            id="importDeckName"
                            type="text"
                            value={deckName}
                            onChange={(e) => setDeckName(e.target.value)}
                            placeholder="e.g., 'Spanish Vocabulary'"
                            className="w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Upload File</label>
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-background border-2 border-border border-dashed rounded-md appearance-none cursor-pointer hover:border-primary focus:outline-none">
                            <UploadIcon className="w-8 h-8 text-text-muted" />
                            <span className="flex items-center space-x-2">
                                <span className="font-medium text-text-muted">
                                    {fileName ? fileName : 'Click to upload a file'}
                                </span>
                            </span>
                            <input id="file-upload" name="file-upload" type="file" className="hidden" accept=".csv,.txt" onChange={handleFileChange} />
                        </label>
                         <p className="text-xs text-text-muted mt-1">Accepts .csv or .txt. Format: front;back or front,back</p>
                    </div>
                    
                    {isParsing && <p className="text-text-muted">Parsing file...</p>}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {parsedCards.length > 0 && (
                        <div className="text-sm p-3 bg-primary-light dark:bg-primary/20 rounded-md text-primary-hover dark:text-primary">
                            Successfully parsed <span className="font-bold">{parsedCards.length}</span> cards. Ready to import.
                        </div>
                    )}

                </div>
                <div className="p-4 bg-background dark:bg-card/50 rounded-b-app flex justify-end space-x-3">
                    <button onClick={handleClose} className="bg-border text-text-base px-4 py-2 rounded-app font-semibold hover:bg-border/80 transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={!deckName.trim() || parsedCards.length === 0 || isParsing}
                        className="bg-primary text-primary-content px-4 py-2 rounded-app font-semibold hover:bg-primary-hover transition-colors disabled:bg-primary/60 disabled:cursor-not-allowed"
                    >
                        Import Deck
                    </button>
                </div>
            </div>
        </div>
    );
};