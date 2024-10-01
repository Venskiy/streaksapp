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

function WeekRow() {
  return (
    <Flex direction="row">
      {Array.from({ length: 7 }, (_, index) => (
        <div className="date-cell flex-grow" key={`date-cell-${index}`}>
          <Checkbox defaultChecked color="green" />
        </div>
      ))}
    </Flex>
  );
}

export function MonthView() {
  const now = dayjs();
  return (
    <Container fluid={true} px={0} h={1000} w="100%">
      <Title order={1}>{now.format('MMMM YYYY')}</Title>
      <GoalList />
      <Flex direction="column" mt="xs">
        <WeekDaysHeader />
        <div className="month-table">
          {Array.from({ length: 5 }, (_, index) => (
            <WeekRow key={`week-row-${index}`} />
          ))}
        </div>
      </Flex>
    </Container>
  );
}
