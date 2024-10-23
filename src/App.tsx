import { useState, useEffect } from 'react';
import '@mantine/core/styles.css';
import {
  Container,
  MantineProvider,
  SegmentedControl,
  Space,
} from '@mantine/core';
import { theme } from './theme';

import '@mantine/core/styles/global.css';
import '@mantine/core/styles/Flex.css';
import './styles/main.css';
import './styles/flex.css';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import dayOfYear from 'dayjs/plugin/dayOfYear';
dayjs.extend(isoWeek);
dayjs.extend(isLeapYear);
dayjs.extend(dayOfYear);

import { MonthView } from '@/components/MonthView';
import { MetricsList } from '@/components/MetricsList';
import { YearView } from '@/components/YearView';
import { initMetricsForDaysInLocalStorage } from '@/utils';

enum Views {
  YEAR_VIEW = 'yearView',
  MONTH_VIEW = 'monthView',
}

export default function App() {
  const [selectedView, setSelectedView] = useState<string>(Views.MONTH_VIEW);

  useEffect(() => {
    initMetricsForDaysInLocalStorage();
  }, []);

  return (
    <MantineProvider theme={theme}>
      <Container fluid={true} px={70} py={30} mb="md">
        <SegmentedControl
          data={[
            { value: Views.MONTH_VIEW, label: 'Month view' },
            { value: Views.YEAR_VIEW, label: 'Year view' },
          ]}
          value={selectedView}
          onChange={setSelectedView}
        />
        <Space h="lg" />
        {selectedView === Views.YEAR_VIEW && <YearView />}
        {selectedView === Views.MONTH_VIEW && <MonthView />}
        <Space h="xl" />
        <MetricsList />
        <Space h="lg" />
      </Container>
    </MantineProvider>
  );
}
