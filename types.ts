export interface Card {
  id: string;
  front: string;
  back: string;
  // SRS Data - optional for backward compatibility
  due?: string; // ISO string for the next review date
  interval?: number; // review interval in days
  state?: 'new' | 'learning' | 'review';
}

export interface Deck {
  id: string;
  name: string;
  cards: Card[];
  color: string;
}

export type View = 'home' | 'study' | 'settings';
