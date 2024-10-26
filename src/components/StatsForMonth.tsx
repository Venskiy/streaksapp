import dayjs from 'dayjs';
import React from 'react';
import { MetricsStatusData } from '@/types';
import { Title, Text, Flex, Table } from '@mantine/core';
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
          stats[metric] = { settle: 0, success: 0, failed: 0 };
        }
        if (metricsStatusData[dayKey][metric] === 'settle') {
          stats[metric].settle = stats[metric].settle + 1;
        } else if (metricsStatusData[dayKey][metric] === false) {
          stats[metric].failed = stats[metric].failed + 1;
        } else if (metricsStatusData[dayKey][metric]) {
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
    <Table
      withTableBorder
      withColumnBorders
      style={{ tableLayout: 'auto', width: 'auto' }}
      mb="lg"
    >
      <Table.Tr>
        <Table.Th>Metric</Table.Th>
        <Table.Th>Success</Table.Th>
        <Table.Th>Failed</Table.Th>
        <Table.Th>settle</Table.Th>
      </Table.Tr>
      {METRICS.map((metric) => {
        return (
          <React.Fragment key={metric.id}>
            {stats[metric.id] ? (
              <Table.Tr key={metric.id}>
                <Table.Td>
                  {metric.emoji} {metric.title}
                </Table.Td>
                <Table.Td>{stats[metric.id].success}</Table.Td>
                <Table.Td>{stats[metric.id].failed}</Table.Td>
                <Table.Td>{stats[metric.id].settle}</Table.Td>
              </Table.Tr>
            ) : null}
          </React.Fragment>
        );
      })}
    </Table>
  );
}
