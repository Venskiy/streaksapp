import { Metric } from './types';

export const METRICS: Metric[] = [
  {
    id: 1,
    emoji: '🍟',
    title: 'No fast food',
    reasons:
      "Better skin, better look, less fat, don't damage your health. Helps loose weight.",
    description: 'Can eat fast food once a week',
    startDay: '2024-10-06',
  },
  {
    id: 2,
    emoji: '🏃',
    title: 'Do sport',
    reasons: 'Feel better during the days, get very fit, loose weight.',
    description: 'Do sport 6 times a week. 1 day for restoring.',
    startDay: '2024-10-06',
  },
  {
    id: 3,
    emoji: '🚫🥙',
    title: 'Fasting',
    description:
      'Intermittent fasting at least 14h, but strive for 16h. And sometime longer fasting(24h, 36h). Can skip once a week.',
    startDay: '2024-10-06',
  },
  {
    id: 4,
    emoji: '📚',
    title: 'Reading',
    description: 'Read at least 10/15 minutes a day',
    startDay: '2024-10-06',
  },
  {
    id: 5,
    emoji: '🌅',
    title: 'Early wake up',
    description: 'Early and quick wake up. Try at 6:00.',
    startDay: '2024-10-11',
  },
];

export const DAY_STATE_COLORS = {
  failed: '#ff99a9',
  bellow50: '#c8f9cf',
  above50: '#80ed99',
  success: '#21ad70',
};
