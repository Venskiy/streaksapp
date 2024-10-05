import { useState } from 'react';
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
dayjs.extend(isoWeek);

import { MonthView } from './components/MonthView';
import { MetricsList } from './components/MetricsList';

enum Views {
  YEAR_VIEW = 'yearView',
  MONTH_VIEW = 'monthView',
}

export default function App() {
  const [selectedView, setSelectedView] = useState<string>(Views.MONTH_VIEW);
  return (
    <MantineProvider theme={theme}>
      <Container fluid={true} px={70} py={30} mb="md">
        <MetricsList />
        <Space h="lg" />
        <SegmentedControl
          data={[
            { value: Views.MONTH_VIEW, label: 'Month view' },
            { value: Views.YEAR_VIEW, label: 'Year view' },
          ]}
          value={selectedView}
          onChange={setSelectedView}
        />
        <Space h="lg" />
        {selectedView === Views.YEAR_VIEW && <div>Year view</div>}
        {selectedView === Views.MONTH_VIEW && <MonthView />}
        <Space h="lg" />
      </Container>
    </MantineProvider>
  );
}
