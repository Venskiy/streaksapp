import '@mantine/core/styles.css';
import { Container, MantineProvider, Space } from '@mantine/core';
import { theme } from './theme';

import '@mantine/core/styles/global.css';
import '@mantine/core/styles/Flex.css';
import './styles/main.css';
import './styles/flex.css';

import { MonthView } from './components/MonthView';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Container fluid={true} px={70} py={30} mb="md">
        <MonthView />
        <Space h="lg" />
      </Container>
    </MantineProvider>
  );
}
