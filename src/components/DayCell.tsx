import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Text, Checkbox } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { START_DAY, METRICS } from '../constants';
import { Metric, MetricsStatusData, MetricStatus } from '../types';
import { getKeyForDay } from '../utils';

export enum DayStates {
  NOT_EXIST = 'notExist', // days before startDay
  LOCKED = 'locked', // days after today
  TODAY = 'today',
  FAILED = 'failed', // nothings checked
  BELLOW_50 = 'bellow50', // less than 50% checked
  ABOVE_50 = 'above50', // more than 50% checked
  SUCCESS = 'success', // all checked
}

export function getDayState(day: dayjs.Dayjs): DayStates {
  const today = dayjs();
  if (day.isBefore(dayjs(START_DAY), 'day')) {
    return DayStates.NOT_EXIST;
  } else if (day.isAfter(today, 'day')) {
    return DayStates.LOCKED;
  } else if (day.isSame(today, 'day')) {
    // When today everything is checked, it should be marked as success
    const dayKey = getKeyForDay(day);
    const metricsStatusData: MetricsStatusData = JSON.parse(
      localStorage.getItem('metricsStatusData') || '{}'
    );
    const metricsForDay = Object.values(metricsStatusData[dayKey] || {});
    const checkedMetricsCount = metricsForDay.filter(Boolean).length;
    if (checkedMetricsCount === METRICS.length) {
      return DayStates.SUCCESS;
    }
    return DayStates.TODAY;
  } else {
    const dayKey = getKeyForDay(day);
    const metricsStatusData: MetricsStatusData = JSON.parse(
      localStorage.getItem('metricsStatusData') || '{}'
    );
    const metricsForDay = Object.values(metricsStatusData[dayKey] || {});
    // TODO: different day could have different goals. Can't use METRICS.length in the future.
    const checkedMetricsCount = metricsForDay.filter(Boolean).length;
    if (checkedMetricsCount === 0) {
      return DayStates.FAILED;
    } else if (checkedMetricsCount === METRICS.length) {
      return DayStates.SUCCESS;
    } else if (checkedMetricsCount < METRICS.length / 2) {
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
  return (
    <Checkbox
      checked={checked !== 'settle' && checked}
      indeterminate={checked === 'settle'}
      label={`${metric.emoji} ${metric.title}`}
      color="green"
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
          className={clsx({ 'text-gray': dayOutOfTheCurrentMonth })}
          ta="center"
        >
          {day.format('D')}
        </Text>
        {dayState === DayStates.NOT_EXIST
          ? null
          : METRICS.map((m, idx) => (
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
