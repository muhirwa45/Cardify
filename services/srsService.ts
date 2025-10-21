import type { Card } from '../types';

// Constants for SRS logic
const LEARNING_INTERVAL_MINUTES = 10;
const INITIAL_GOOD_INTERVAL_DAYS = 1;
const INITIAL_EASY_INTERVAL_DAYS = 4;

const HARD_MULTIPLIER = 1.2;
const GOOD_MULTIPLIER = 2.5;
const EASY_MULTIPLIER = 3.0;
const MIN_INTERVAL = 1; // Minimum interval is 1 day after graduation

type Rating = 'again' | 'hard' | 'good' | 'easy';

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const addMinutes = (date: Date, minutes: number): Date => {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
};

export const updateCardSchedule = (card: Card, rating: Rating): Card => {
    const now = new Date();
    // Ensure card has default SRS properties before calculation
    const C = {
        ...card,
        state: card.state || 'new',
        interval: card.interval || 0,
        due: card.due || now.toISOString(),
    } as Required<Card>;


    switch (C.state) {
        case 'new':
        case 'learning':
            switch (rating) {
                case 'again':
                    // Stays in learning, due again soon in this session
                    C.state = 'learning';
                    C.interval = 0;
                    C.due = addMinutes(now, LEARNING_INTERVAL_MINUTES).toISOString();
                    break;
                case 'hard':
                     // Still learning, but slightly longer interval
                    C.state = 'learning';
                    C.interval = 0;
                    C.due = addMinutes(now, LEARNING_INTERVAL_MINUTES * 1.5).toISOString();
                    break;
                case 'good':
                    // Graduates to review
                    C.state = 'review';
                    C.interval = INITIAL_GOOD_INTERVAL_DAYS;
                    C.due = addDays(now, INITIAL_GOOD_INTERVAL_DAYS).toISOString();
                    break;
                case 'easy':
                    // Graduates to review with a bonus
                    C.state = 'review';
                    C.interval = INITIAL_EASY_INTERVAL_DAYS;
                    C.due = addDays(now, INITIAL_EASY_INTERVAL_DAYS).toISOString();
                    break;
            }
            break;

        case 'review':
            switch (rating) {
                case 'again':
                    // Lapse, back to learning
                    C.state = 'learning';
                    C.interval = 0; // Reset interval
                    C.due = addMinutes(now, LEARNING_INTERVAL_MINUTES).toISOString();
                    break;
                case 'hard':
                    C.interval = Math.max(MIN_INTERVAL, C.interval * HARD_MULTIPLIER);
                    C.due = addDays(now, C.interval).toISOString();
                    break;
                case 'good':
                    C.interval = Math.max(MIN_INTERVAL, C.interval * GOOD_MULTIPLIER);
                    C.due = addDays(now, C.interval).toISOString();
                    break;
                case 'easy':
                    C.interval = Math.max(MIN_INTERVAL, C.interval * EASY_MULTIPLIER);
                    C.due = addDays(now, C.interval).toISOString();
                    break;
            }
            break;
    }
    
    // round interval to 2 decimal places
    C.interval = Math.round(C.interval * 100) / 100;

    return C;
};
