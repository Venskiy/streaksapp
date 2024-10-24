import dayjs from 'dayjs';
import React from 'react';
import { MetricsStatusData } from '@/types';
import { Title, Text, Flex } from '@mantine/core';
import { METRICS } from '@/constants';
import { getKeyForDay } from '@/utils';

function getStatsForMonth(month: dayjs.Dayjs) {
  const stats: any = {};
  const metricsStatusData: MetricsStatusData = JSON.parse(
    localStorage.getItem('metricsStatusData') || '{}'
  );
  let day = month.startOf('month');
  const endDay =
    dayjs().month() === month.month()
      ? dayjs().subtract(1, 'day')
      : day.endOf('month');
  while (!day.isAfter(endDay, 'day')) {
    const dayKey = getKeyForDay(day);
    if (metricsStatusData[dayKey]) {
      Object.keys(metricsStatusData[dayKey]).forEach((metric) => {
        if (!stats[metric]) {
          stats[metric] = { count: 0, success: 0 };
        }
        stats[metric].count = stats[metric].count + 1;
        if (metricsStatusData[dayKey][metric]) {
          stats[metric].success = stats[metric].success + 1;
        }
      });
    }
    day = day.add(1, 'day');
  }
  return stats;
}

export function StatsForMonth({ month }: { month: dayjs.Dayjs }) {
  const stats = getStatsForMonth(month);
  return (
    <Flex direction="column" mb="lg">
      <Title order={3}>Stats:</Title>
      {METRICS.map((metric) => {
        return (
          <React.Fragment key={metric.id}>
            {stats[metric.id] ? (
              <Text>
                {stats[metric.id].success} / {stats[metric.id].count} (
                {stats[metric.id].count - stats[metric.id].success}) -{' '}
                {metric.emoji} {metric.title}
              </Text>
            ) : null}
          </React.Fragment>
        );
      })}
    </Flex>
  );
}
