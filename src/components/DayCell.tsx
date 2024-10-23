import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Text, Checkbox } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Metric, MetricsStatusData, MetricStatus } from '../types';
import { getKeyForDay, getMetricsForDay } from '../utils';

export enum DayStates {
  EMPTY = 'empty', // no metrics for day
  LOCKED = 'locked', // days after today
  TODAY = 'today',
  FAILED = 'failed', // nothings checked
  BELLOW_50 = 'bellow50', // less than 50% checked
  ABOVE_50 = 'above50', // more than 50% checked
  SUCCESS = 'success', // all checked
}

export function getDayState(day: dayjs.Dayjs): DayStates {
  const allMetricsForDayCount = getMetricsForDay(day).length;
  const today = dayjs();
  if (allMetricsForDayCount === 0) {
    return DayStates.EMPTY;
  } else if (day.isAfter(today, 'day')) {
    return DayStates.LOCKED;
  } else if (day.isSame(today, 'day')) {
    return DayStates.TODAY;
    // When today everything is checked, it should be marked as success
    // const dayKey = getKeyForDay(day);
    // const metricsStatusData: MetricsStatusData = JSON.parse(
    //   localStorage.getItem('metricsStatusData') || '{}'
    // );
    // const checkedMetricsForDayCount = Object.values(
    //   metricsStatusData[dayKey] || {}
    // ).filter(Boolean).length;
    // if (checkedMetricsForDayCount === allMetricsForDayCount) {
    //   return DayStates.SUCCESS;
    // }
  } else {
    const dayKey = getKeyForDay(day);
    const metricsStatusData: MetricsStatusData = JSON.parse(
      localStorage.getItem('metricsStatusData') || '{}'
    );
    const checkedMetricsForDayCount = Object.values(
      metricsStatusData[dayKey] || {}
    ).filter(Boolean).length;
    if (checkedMetricsForDayCount === 0) {
      return DayStates.FAILED;
    } else if (checkedMetricsForDayCount === allMetricsForDayCount) {
      return DayStates.SUCCESS;
    } else if (checkedMetricsForDayCount < allMetricsForDayCount / 2) {
      return DayStates.BELLOW_50;
    } else {
      return DayStates.ABOVE_50;
    }
  }
}

function getNextMetricStatus(currentStatus: MetricStatus): MetricStatus {
  if (currentStatus === false) {
    return true;
  } else if (currentStatus === true) {
    return 'settle';
  } else {
    return false;
  }
}

function MetricCheckbox({
  day,
  metric,
  disabled,
  onChange,
}: {
  day: dayjs.Dayjs;
  metric: Metric;
  disabled: boolean;
  onChange: () => void;
}) {
  const [metricsStatusData, setMetricsStatusData] =
    useLocalStorage<MetricsStatusData>({
      key: 'metricsStatusData',
      serialize: (value) => JSON.stringify(value),
      deserialize: (localStorageValue) => JSON.parse(localStorageValue || '{}'),
      defaultValue: {},
    });
  const dayKey = getKeyForDay(day);

  function handleChange() {
    const newMetricsStatusData: MetricsStatusData = { ...metricsStatusData };
    if (!newMetricsStatusData[dayKey]) {
      newMetricsStatusData[dayKey] = {};
    }
    newMetricsStatusData[dayKey][metric.id] = getNextMetricStatus(
      metricsStatusData[dayKey]?.[metric.id] || false
    );
    setMetricsStatusData(newMetricsStatusData);
    onChange();
  }

  const checked = metricsStatusData[dayKey]?.[metric.id] || false;
  const failed = !checked && day.isBefore(dayjs(), 'day');
  return (
    <Checkbox
      style={{ backgroundColor: failed ? '#ff99a9' : undefined }}
      checked={checked !== 'settle' && checked}
      indeterminate={checked === 'settle'}
      label={`${metric.emoji} ${metric.title}`}
      color={failed ? 'red' : 'green'}
      onChange={handleChange}
      disabled={disabled}
      mt={4}
    />
  );
}

export function DayCell({ day }: { day: dayjs.Dayjs }) {
  const [, setId] = useState<number>(0);
  const dayOutOfTheCurrentMonth = dayjs().month() !== day.month();
  const dayState = getDayState(day);
  const allMetricsForDay = getMetricsForDay(day);
  return (
    <div
      className={clsx('day-cell', 'flex-1', {
        'day-failed': dayState === DayStates.FAILED,
        'day-bellow50': dayState === DayStates.BELLOW_50,
        'day-above50': dayState === DayStates.ABOVE_50,
        'day-success': dayState === DayStates.SUCCESS,
      })}
    >
      <div className={clsx({ 'opacity-40': dayState === DayStates.LOCKED })}>
        <Text
          className={clsx({ 'text-gray': dayOutOfTheCurrentMonth, 'current-date': dayState === DayStates.TODAY })}
          ta="center"
        >
          {day.format('D')}
        </Text>
        {dayState === DayStates.EMPTY
          ? null
          : allMetricsForDay.map((m, idx) => (
              <MetricCheckbox
                day={day}
                metric={m}
                key={`metric-${idx}`}
                disabled={dayState === DayStates.LOCKED}
                onChange={() => setId((prev) => prev + 1)}
              />
            ))}
      </div>
    </div>
  );
}
