import React, { useMemo, useState } from 'react';
import type { Deck } from '../types';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';

interface HomeScreenProps {
  decks: Deck[];
  onStartStudy: (deck: Deck) => void;
}

const Heatmap: React.FC = () => {
    const today = new Date();
    const squares = useMemo(() => {
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + (6 - today.getDay())); 
        const startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 365);

        const days = [];
        let currentDate = new Date(startDate);
        while(currentDate <= endDate) {
            const intensity = Math.random();
            days.push({
                date: new Date(currentDate),
                intensity: intensity > 0.2 ? Math.min(intensity, 1) : 0,
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return days;
    }, [today]);

    const getColor = (intensity: number) => {
        if (intensity === 0) return 'bg-slate-200 dark:bg-slate-700';
        if (intensity < 0.4) return 'bg-sky-200 dark:bg-sky-800';
        if (intensity < 0.7) return 'bg-sky-400 dark:bg-sky-600';
        return 'bg-sky-600 dark:bg-sky-400';
    };

    return (
        <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] grid-rows-7 gap-1">
            {squares.map(({ date, intensity }, index) => (
                <div 
                    key={index} 
                    className={`w-full aspect-square rounded-[3px] ${getColor(intensity)}`}
                    title={`Studied on ${date.toDateString()}`}
                />
            ))}
        </div>
    );
};

const Calendar: React.FC<{ decks: Deck[] }> = ({ decks }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const dueDates = useMemo(() => {
        const dates = new Set<string>();
        decks.forEach(deck => {
            deck.cards.forEach(card => {
                if (card.due) {
                    const dueDate = new Date(card.due);
                    dates.add(new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()).toDateString());
                }
            });
        });
        return dates;
    }, [decks]);

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const today = new Date();

    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-app shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 font-mono" aria-label="Previous month">&lt;</button>
                <h3 className="font-semibold text-lg">{monthName} {year}</h3>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 font-mono" aria-label="Next month">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="font-medium text-slate-500 text-xs">{day}</div>
                ))}
                {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                {days.map(day => {
                    const dayDate = new Date(year, month, day);
                    const isToday = dayDate.toDateString() === today.toDateString();
                    const hasDueCards = dueDates.has(dayDate.toDateString());

                    let dayClasses = "w-9 h-9 flex items-center justify-center rounded-full mx-auto transition-colors ";
                    if (isToday) {
                        dayClasses += "bg-sky-500 text-white font-bold ";
                    } else if (hasDueCards) {
                        dayClasses += "bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-semibold";
                    } else {
                        dayClasses += "text-slate-700 dark:text-slate-300 ";
                    }

                    return (
                        <div key={day} className="flex justify-center items-center h-9">
                           <div className={dayClasses} title={hasDueCards ? "Cards due for review" : ""}>
                            {day}
                           </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export const HomeScreen: React.FC<HomeScreenProps> = ({ decks, onStartStudy }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    }

    const totalDueCards = useMemo(() => {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return decks.reduce((count, deck) => {
            return count + deck.cards.filter(card => {
                 const dueDate = new Date(card.due || 0);
                 return card.state === 'new' || dueDate <= today;
            }).length;
        }, 0);
    }, [decks]);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{getGreeting()}</h1>
                <p className="text-slate-500 dark:text-slate-400">Ready for another study session?</p>
                {totalDueCards > 0 && (
                    <div className="mt-4 bg-sky-100 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200 p-3 rounded-app text-center">
                        You have <span className="font-bold">{totalDueCards}</span> card{totalDueCards === 1 ? '' : 's'} due for review today.
                    </div>
                )}
            </header>
            
            <section className="bg-white dark:bg-slate-800 p-4 rounded-app shadow-sm">
                <h2 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200">Study Activity</h2>
                <Heatmap />
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200">Recent Decks</h2>
                {decks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {decks.slice(0, 4).map(deck => (
                            <div key={deck.id} className="bg-white dark:bg-slate-800 p-4 rounded-app shadow-sm flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-full ${deck.color} flex items-center justify-center`}>
                                        <BrainCircuitIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-white">{deck.name}</h3>
                                        <p className="text-sm text-slate-500">{deck.cards.length} cards</p>
                                    </div>
                                </div>
                                <button onClick={() => onStartStudy(deck)} className="bg-sky-500 text-white px-4 py-2 rounded-app font-semibold hover:bg-sky-600 transition-colors">
                                    Study
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 px-4 bg-white dark:bg-slate-800 rounded-app">
                        <p className="text-slate-500">No decks yet. Go to the Study tab to create one!</p>
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-200">Study Calendar</h2>
                <Calendar decks={decks} />
            </section>
        </div>
    );
};