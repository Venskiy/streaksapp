import dayjs from 'dayjs';
import clsx from 'clsx';
import { Checkbox, Container, Group, Title } from '@mantine/core';
import { DayStates, getDayState } from './DayCell';

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
            <Checkbox
              key={idx}
              // disabled
              defaultChecked={dayState !== DayStates.TODAY}
              disabled={dayState === DayStates.LOCKED || dayState === DayStates.NOT_EXIST}
              color={clsx({
                'red': dayState === DayStates.FAILED,
                'yellow': dayState === DayStates.BELLOW_50,
                'green': dayState === DayStates.ABOVE_50,
                'blue': dayState === DayStates.SUCCESS,
              })}
            />
          );
        })}
      </Group>
    </Container>
  );
}
