import React, { useMemo, useState } from 'react';
import type { Deck, StudyLogEntry } from '../types';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';

interface HomeScreenProps {
  decks: Deck[];
  onStartStudy: (deck: Deck) => void;
  showHeatmap: boolean;
  studyLog: StudyLogEntry[];
  cardsStudiedToday: number;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const toKey = (date: Date) => date.toISOString().slice(0, 10);

const calculateStreak = (studyLog: StudyLogEntry[]): number => {
  const activeDays = new Set(studyLog.filter((entry) => entry.cardsStudied > 0).map((entry) => entry.date));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (activeDays.has(toKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

const DeckCarousel: React.FC<{ decks: Deck[]; onStartStudy: (deck: Deck) => void }> = ({ decks, onStartStudy }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-bold">Your Decks</h2>
        <p className="text-sm text-text-muted">Slide horizontally to browse</p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid grid-rows-2 grid-flow-col gap-4 auto-cols-[minmax(230px,1fr)] min-w-max pr-2">
          {decks.map((deck) => {
            const learnedCount = deck.cards.filter((card) => card.state === 'review').length;
            const mastery = deck.cards.length === 0 ? 0 : Math.round((learnedCount / deck.cards.length) * 100);
            const lastStudied = deck.lastStudiedAt
              ? new Date(deck.lastStudiedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
              : 'Not yet';

            return (
              <button
                key={deck.id}
                onClick={() => onStartStudy(deck)}
                className="text-left bg-card/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-md hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{deck.icon || '📘'}</span>
                  <div className={`w-3 h-3 rounded-full ${deck.color}`} />
                </div>
                <h3 className="font-semibold text-base truncate">{deck.name}</h3>
                <p className="text-sm text-text-muted">{deck.cards.length} cards</p>
                <p className="text-sm text-primary font-medium">{mastery}% learned</p>
                <p className="text-xs text-text-muted mt-1">Last studied: {lastStudied}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MonthlyHeatmap: React.FC<{ studyLog: StudyLogEntry[] }> = ({ studyLog }) => {
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [hoverLabel, setHoverLabel] = useState('Hover a day to see details');

  const activityByDate = useMemo(() => {
    const map = new Map<string, number>();
    studyLog.forEach((entry) => map.set(entry.date, entry.cardsStudied));
    return map;
  }, [studyLog]);

  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, activeMonth + 1, 0).getDate();
  const firstWeekday = new Date(year, activeMonth, 1).getDay();

  const heatClass = (count: number) => {
    if (count === 0) return 'bg-border/70';
    if (count <= 10) return 'bg-green-300/80 dark:bg-green-900/60';
    if (count <= 20) return 'bg-green-400/90 dark:bg-green-700/80';
    if (count <= 30) return 'bg-green-500 dark:bg-green-600';
    return 'bg-green-700 dark:bg-green-500';
  };

  return (
    <section className="bg-card/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-5 shadow-md space-y-4">
      <div className="flex flex-wrap gap-2">
        {monthNames.map((month, index) => (
          <button
            key={month}
            onClick={() => setActiveMonth(index)}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              activeMonth === index ? 'bg-primary text-primary-content' : 'bg-background text-text-muted'
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstWeekday }).map((_, idx) => (
          <div key={`offset-${idx}`} className="w-8 h-8" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const date = new Date(year, activeMonth, day);
          const key = toKey(date);
          const count = activityByDate.get(key) ?? 0;
          return (
            <div
              key={key}
              className={`w-8 h-8 rounded-md ${heatClass(count)} transition-colors`}
              onMouseEnter={() =>
                setHoverLabel(`${date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}: ${count} cards studied`)
              }
              title={`${date.toLocaleDateString()}: ${count} cards studied`}
            />
          );
        })}
      </div>

      <p className="text-sm text-text-muted">{hoverLabel}</p>
    </section>
  );
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ decks, onStartStudy, showHeatmap, studyLog, cardsStudiedToday }) => {
  const streak = useMemo(() => calculateStreak(studyLog), [studyLog]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">Card</h1>
        <p className="text-text-muted">Distraction-free learning with offline progress tracking.</p>
      </header>

      {decks.length > 0 ? (
        <DeckCarousel decks={decks} onStartStudy={onStartStudy} />
      ) : (
        <section className="text-center py-10 bg-card rounded-2xl border border-border">
          <BrainCircuitIcon className="w-10 h-10 mx-auto text-primary mb-3" />
          <p className="text-text-muted">No decks yet. Open Decks tab to create your first set.</p>
        </section>
      )}

      <section className="bg-card/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-5 shadow-md">
        <p className="text-sm text-text-muted">{new Date().toLocaleDateString(undefined, { weekday: 'long' })}</p>
        <h2 className="text-xl font-semibold">{new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div className="bg-background/60 rounded-xl p-3">
            <p className="text-sm text-text-muted">Cards studied today</p>
            <p className="text-2xl font-bold text-primary">{cardsStudiedToday}</p>
          </div>
          <div className="bg-background/60 rounded-xl p-3">
            <p className="text-sm text-text-muted">Current streak</p>
            <p className="text-2xl font-bold text-primary">🔥 {streak} days</p>
          </div>
        </div>
      </section>

      {showHeatmap && <MonthlyHeatmap studyLog={studyLog} />}
    </div>
  );
};
