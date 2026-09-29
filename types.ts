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
  icon?: string;
  description?: string;
  createdAt?: string;
  lastStudiedAt?: string;
}

export interface StudyLogEntry {
  date: string; // YYYY-MM-DD
  cardsStudied: number;
}

export type View = 'home' | 'study' | 'stats' | 'settings';

export type BaseTheme = 'light' | 'dark';
export type AccentColor = 'sky' | 'green' | 'yellow' | 'blue' | 'black';
