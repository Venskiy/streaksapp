import dayjs from 'dayjs';
import { DayKey } from '@/types';

export function getKeyForDay(day: dayjs.Dayjs): DayKey {
  return day.format('YYYY-MM-DD') as DayKey;
}
