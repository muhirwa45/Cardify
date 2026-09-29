import React, { useMemo } from 'react';
import type { Deck, StudyLogEntry } from '../types';

interface StatsScreenProps {
  decks: Deck[];
  studyLog: StudyLogEntry[];
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ decks, studyLog }) => {
  const totalCards = useMemo(() => decks.reduce((sum, deck) => sum + deck.cards.length, 0), [decks]);
  const totalStudied = useMemo(() => studyLog.reduce((sum, day) => sum + day.cardsStudied, 0), [studyLog]);
  const avgPerDay = studyLog.length > 0 ? Math.round(totalStudied / studyLog.length) : 0;

  const strongestDeck = useMemo(() => {
    if (decks.length === 0) return null;
    return [...decks].sort((a, b) => {
      const aMastery = a.cards.length === 0 ? 0 : a.cards.filter((card) => card.state === 'review').length / a.cards.length;
      const bMastery = b.cards.length === 0 ? 0 : b.cards.filter((card) => card.state === 'review').length / b.cards.length;
      return bMastery - aMastery;
    })[0];
  }, [decks]);

  const weakestDeck = useMemo(() => {
    if (decks.length === 0) return null;
    return [...decks].sort((a, b) => {
      const aMastery = a.cards.length === 0 ? 0 : a.cards.filter((card) => card.state === 'review').length / a.cards.length;
      const bMastery = b.cards.length === 0 ? 0 : b.cards.filter((card) => card.state === 'review').length / b.cards.length;
      return aMastery - bMastery;
    })[0];
  }, [decks]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Stats</h1>

      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm text-text-muted">Total cards</p>
          <p className="text-2xl font-bold text-primary">{totalCards}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm text-text-muted">Total studied</p>
          <p className="text-2xl font-bold text-primary">{totalStudied}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm text-text-muted">Average / day</p>
          <p className="text-2xl font-bold text-primary">{avgPerDay}</p>
        </div>
        <div className="bg-card rounded-2xl p-4 border border-border">
          <p className="text-sm text-text-muted">Active study days</p>
          <p className="text-2xl font-bold text-primary">{studyLog.length}</p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h2 className="font-semibold mb-2">Strongest deck</h2>
          <p className="text-text-muted">{strongestDeck ? `${strongestDeck.icon || '📘'} ${strongestDeck.name}` : 'Add decks to see this insight.'}</p>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h2 className="font-semibold mb-2">Weakest deck</h2>
          <p className="text-text-muted">{weakestDeck ? `${weakestDeck.icon || '📘'} ${weakestDeck.name}` : 'Add decks to see this insight.'}</p>
        </div>
      </section>
    </div>
  );
};
