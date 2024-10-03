import { Flex, Title, Container } from '@mantine/core';
import dayjs from 'dayjs';
import { MetricsList } from './MetricsList';
import { DaysOfWeekHeader } from './DaysOfWeekHeader';
import { DayCell } from './DayCell';

type MonthViewType = dayjs.Dayjs[][];

function getMonthView(): MonthViewType {
  // TODO: handle when 1 february is on monday
  const now = dayjs();
  const firstDayOfMonthView = now.startOf('month').startOf('isoWeek');
  const monthView: MonthViewType = [];
  let week: dayjs.Dayjs[] = [];
  const daysNumber = 35;
  Array.from({ length: daysNumber }).forEach((_, idx) => {
    if (idx % 7 === 0) {
      monthView.push(week);
      week = [];
    }
    week.push(firstDayOfMonthView.add(idx, 'day'));
    if (idx === daysNumber - 1) {
      monthView.push(week);
    }
  });
  return monthView;
}

export function MonthView() {
  const now = dayjs();
  const monthView = getMonthView();
  return (
    <Container fluid={true} px={0} h={1000} w="100%">
      <Title order={1}>{now.format('MMMM YYYY')}</Title>
      <MetricsList />
      <Flex direction="column" mt="xs">
        <DaysOfWeekHeader />
        <div className="month-table">
          {monthView.map((week, idx) => (
            <Flex direction="row" key={`week-${idx}`}>
              {week.map((day, idx) => (
                <DayCell key={`day-cell-${idx}`} day={day} />
              ))}
            </Flex>
          ))}
        </div>
      </Flex>
    </Container>
  );
}
