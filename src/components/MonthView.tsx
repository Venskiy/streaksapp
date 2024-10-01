import { Flex, Text, Title, Checkbox, Container } from '@mantine/core';
import dayjs from 'dayjs';

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
function WeekDaysHeader() {
  return (
    <div className="flex flex-row">
      {WEEKDAYS.map((day) => (
        <div className="flex-1" key={day}>
          <Title order={4} ta="center">
            {day}
          </Title>
        </div>
      ))}
    </div>
  );
}

const GOALS = [
  {
    emoji: '🍟',
    title: 'No fast food',
    description: 'Can eat fast food once a week',
  },
  {
    emoji: '🏃',
    title: 'Do sport',
    description: 'Do sport every day',
  },
  {
    emoji: '🚫🥙',
    title: 'Fasting',
    description: 'IF 16:8 6 days a week',
  },
];
function GoalList() {
  return (
    <div>
      {GOALS.map((goal, idx) => (
        <Text key={`goal-${idx}`} mt="xs">
          {goal.emoji} {goal.title} ({goal.description})
        </Text>
      ))}
    </div>
  );
}

function WeekRow({ week }) {
  return (
    <Flex direction="row">
      {week.map((day, idx) => (
        <div className="date-cell flex-grow" key={`date-cell-${idx}`}>
          <Text ta="center">{day.format('D')}</Text>
          {GOALS.map((goal, idx) => (
            <Checkbox
              label={`${goal.emoji} ${goal.title}`}
              color="green"
              key={`goal-${idx}`}
            />
          ))}
        </div>
      ))}
    </Flex>
  );
}

function getMonthView() {
  // TODO: make month selectable
  // TODO: handle when 1 february is on monday
  const now = dayjs();
  const firstDayOfMonthView = now.startOf('month').startOf('isoWeek');
  let monthView = [];
  let week = [];
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
      <GoalList />
      <Flex direction="column" mt="xs">
        <WeekDaysHeader />
        <div className="month-table">
          {monthView.map((week, idx) => (
            <WeekRow week={week} key={`week-row-${idx}`} />
          ))}
        </div>
      </Flex>
    </Container>
  );
}
