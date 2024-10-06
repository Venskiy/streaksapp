import dayjs from 'dayjs';
import { Container, Group, Title } from '@mantine/core';
import { getDayState } from './DayCell';
import { DAY_STATE_COLORS } from '@/constants';

export function YearView() {
  const today = dayjs();
  const daysCount = today.isLeapYear() ? 366 : 365;
  return (
    <Container fluid={true} px={0}>
      <Title order={1}>Year {today.format('YYYY')}</Title>
      <Group mt="sm">
        {Array.from({ length: daysCount }).map((_, idx) => {
          const day = today.dayOfYear(idx + 1);
          const dayState = getDayState(day);
          return (
            <div
              className="year-view-day-box"
              key={idx}
              style={{
                backgroundColor: DAY_STATE_COLORS[dayState],
              }}
            />
          );
        })}
      </Group>
    </Container>
  );
}
