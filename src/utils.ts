import dayjs from 'dayjs';
import { DayKey, MetricsStatusData } from '@/types';
import { METRICS } from './constants';
import { Metric } from '@/types';

export function getKeyForDay(day: dayjs.Dayjs): DayKey {
  return day.format('YYYY-MM-DD') as DayKey;
}

export function getMetricsForDay(day: dayjs.Dayjs): Metric[] {
  return METRICS.filter((m) => !day.isBefore(dayjs(m.startDay), 'day'));
}

export function initMetricsForDaysInLocalStorage() {
  const lastUpdatedOn = dayjs(localStorage.getItem('lastUpdatedOn')) || dayjs();
  const metricsStatusData: MetricsStatusData = JSON.parse(localStorage.getItem('metricsStatusData') || '{}')
  const today = dayjs();

  let currentDay = lastUpdatedOn;
  while (!currentDay.isAfter(today, 'day')) {
    const dayKey = getKeyForDay(currentDay);
    const metricsForDay = getMetricsForDay(currentDay);
    if (!metricsStatusData[dayKey]) {
      metricsStatusData[dayKey] = {};
    }
    metricsForDay.forEach((metric) => {
      if (metricsStatusData[dayKey][metric.id] === undefined) {
        metricsStatusData[dayKey][metric.id] = false;
      }
    });
    currentDay = currentDay.add(1, 'day');
  }

  localStorage.setItem('metricsStatusData', JSON.stringify(metricsStatusData));
  localStorage.setItem('lastUpdatedOn', today.format('YYYY-MM-DD'));
}