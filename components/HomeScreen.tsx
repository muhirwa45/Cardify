import React, { useMemo, useState } from 'react';
import type { Deck } from '../types';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';

interface HomeScreenProps {
  decks: Deck[];
  onStartStudy: (deck: Deck) => void;
  showHeatmap: boolean;
}

const Heatmap: React.FC = () => {
    const [year, setYear] = useState(new Date().getFullYear());

    // Generate days for the selected year
    const daysInYear = useMemo(() => {
        const days = [];
        const date = new Date(year, 0, 1);
        while (date.getFullYear() === year) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [year]);

    // Placeholder study data
    const studyData = useMemo(() => {
        const data = new Map<string, number>();
        daysInYear.forEach(date => {
            if (Math.random() > 0.15) { // ~85% of days have some activity
                data.set(date.toDateString(), Math.random());
            }
        });
        return data;
    }, [daysInYear]);

    // Color scale using theme's primary color
    const getHeatmapColor = (intensity: number) => {
        if (intensity === 0) return 'bg-border/50 dark:bg-border/20';
        if (intensity < 0.25) return 'bg-primary/20';
        if (intensity < 0.5) return 'bg-primary/40';
        if (intensity < 0.75) return 'bg-primary/70';
        return 'bg-primary';
    };

    // Grid layout calculations
    const firstDayOfYear = daysInYear[0].getDay(); // 0 for Sunday
    const emptyCells = Array.from({ length: firstDayOfYear }, (_, i) => <div key={`empty-${i}`} />);

    // Month labels
    const monthLabels = useMemo(() => {
        const labels: { name: string, startColumn: number }[] = [];
        let lastMonth = -1;
        daysInYear.forEach((date, index) => {
            const month = date.getMonth();
            if (month !== lastMonth) {
                const startColumn = Math.floor((index + firstDayOfYear) / 7);
                labels.push({
                    name: date.toLocaleString('default', { month: 'short' }),
                    startColumn: startColumn,
                });
            }
            lastMonth = month;
        });
        return labels;
    }, [daysInYear, firstDayOfYear]);
    
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-bold text-text-base">{year}</h2>
                    <p className="text-sm text-text-muted">Annual Completion Heatmap</p>
                </div>
                <div className="flex space-x-1">
                    <button onClick={() => setYear(y => y - 1)} className="p-1.5 rounded-md hover:bg-background dark:hover:bg-slate-700/50" aria-label="Previous year">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => setYear(y => y + 1)} className="p-1.5 rounded-md hover:bg-background dark:hover:bg-slate-700/50" aria-label="Next year">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto pb-2">
                <div className="inline-block min-w-full">
                    <div className="flex">
                        {/* Day labels */}
                        <div className="grid grid-rows-7 gap-y-1 text-xs text-text-muted pr-2 shrink-0 self-start text-left w-10">
                           {dayLabels.map(day => <div key={day} className="h-5 flex items-center">{day}</div>)}
                        </div>
                        
                        {/* Main grid area */}
                        <div className="relative">
                            {/* Grid cells */}
                            <div className="grid grid-flow-col grid-rows-7 gap-1">
                                {emptyCells}
                                {daysInYear.map((date) => {
                                    const intensity = studyData.get(date.toDateString()) || 0;
                                    return (
                                        <div
                                            key={date.toISOString()}
                                            className={`w-5 h-5 rounded-md ${getHeatmapColor(intensity)}`}
                                            title={`Studied on ${date.toDateString()}`}
                                        />
                                    );
                                })}
                            </div>

                            {/* Month labels */}
                             <div className="relative h-4 mt-2 ml-1">
                                {monthLabels.map((month) => (
                                    <div key={month.name} className="absolute text-xs text-text-muted" style={{ left: `calc(${month.startColumn} * (1.25rem + 4px))`}}>
                                        {month.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

    const handlePrevWeek = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 7);
            return newDate;
        });
    };

    const handleNextWeek = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 7);
            return newDate;
        });
    };
    
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(day.getDate() + i);
        return day;
    });

    const weekRangeString = `${weekDays[0].toLocaleString('default', { month: 'short', day: 'numeric' })} - ${weekDays[6].toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    const today = new Date();

    return (
        <div className="bg-card p-4 rounded-app shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevWeek} className="p-2 rounded-full hover:bg-background dark:hover:bg-border font-mono" aria-label="Previous week">&lt;</button>
                <h3 className="font-semibold text-base md:text-lg text-center">{weekRangeString}</h3>
                <button onClick={handleNextWeek} className="p-2 rounded-full hover:bg-background dark:hover:bg-border font-mono" aria-label="Next week">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="font-medium text-text-muted text-xs">{day}</div>
                ))}
                {weekDays.map(dayDate => {
                    const day = dayDate.getDate();
                    const isToday = dayDate.toDateString() === today.toDateString();
                    const hasDueCards = dueDates.has(dayDate.toDateString());

                    let dayClasses = "w-9 h-9 flex items-center justify-center rounded-full mx-auto transition-colors ";
                    if (isToday) {
                        dayClasses += "bg-primary text-primary-content font-bold ";
                    } else if (hasDueCards) {
                        dayClasses += "bg-primary-light dark:bg-primary/20 text-primary-hover dark:text-primary font-semibold";
                    } else {
                        dayClasses += "text-text-base ";
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


export const HomeScreen: React.FC<HomeScreenProps> = ({ decks, onStartStudy, showHeatmap }) => {
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
                <h1 className="text-3xl font-bold text-text-base">{getGreeting()}</h1>
                <p className="text-text-muted">Ready for another study session?</p>
                {totalDueCards > 0 && (
                    <div className="mt-4 bg-primary-light dark:bg-primary/20 border border-primary/20 text-primary-hover dark:text-primary p-3 rounded-app text-center">
                        You have <span className="font-bold">{totalDueCards}</span> card{totalDueCards === 1 ? '' : 's'} due for review today.
                    </div>
                )}
            </header>
            
             <section>
                <h2 className="text-lg font-semibold mb-3 text-text-base">Recent Decks</h2>
                {decks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {decks.slice(0, 4).map(deck => (
                            <div key={deck.id} className="bg-card p-4 rounded-app shadow-sm flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-full ${deck.color} flex items-center justify-center`}>
                                        <BrainCircuitIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-text-base">{deck.name}</h3>
                                        <p className="text-sm text-text-muted">{deck.cards.length} cards</p>
                                    </div>
                                </div>
                                <button onClick={() => onStartStudy(deck)} className="bg-primary text-primary-content px-4 py-2 rounded-app font-semibold hover:bg-primary-hover transition-colors">
                                    Study
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 px-4 bg-card rounded-app">
                        <p className="text-text-muted">No decks yet. Go to the Study tab to create one!</p>
                    </div>
                )}
            </section>
            
            {showHeatmap && (
              <section className="bg-card p-4 rounded-app shadow-sm">
                  <Heatmap />
              </section>
            )}

            <section>
                <h2 className="text-lg font-semibold mb-3 text-text-base">Study Calendar</h2>
                <Calendar decks={decks} />
            </section>
        </div>
    );
};