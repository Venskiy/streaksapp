import { useState } from 'react';
import { Flex, Title, Container } from '@mantine/core';
import dayjs from 'dayjs';
import { MetricsList } from './MetricsList';
import { DaysOfWeekHeader } from './DaysOfWeekHeader';
import { DayCell } from './DayCell';

type MonthViewType = dayjs.Dayjs[][];

function getMonthView(currentMonth: dayjs.Dayjs): MonthViewType {
  // TODO: handle when 1 february is on monday
  const firstDayOfMonthView = currentMonth.startOf('month').startOf('isoWeek');
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
  const [monthIndex, setMonthIndex] = useState(0);
  const currentMonth = dayjs().add(monthIndex, 'month');
  const monthView = getMonthView(currentMonth);
  return (
    <Container fluid={true} px={0} h={1000} w="100%">
      <Title order={1}>{currentMonth.format('MMMM YYYY')}</Title>
      <MetricsList />
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setMonthIndex((mIndex) => mIndex - 1);
        }}
      >
        Back
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setMonthIndex((mIndex) => mIndex + 1);
        }}
      >
        Next
      </a>
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
