import { Flex, Text, Title, Checkbox, Container } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
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
          <Title className="text-dark-gray" order={4} ta="center">
            {day}
          </Title>
        </div>
      ))}
    </div>
  );
}

// reading
const GOALS = [
  {
    id: 1,
    emoji: '🍟',
    title: 'No fast food',
    description: 'Can eat fast food once a week',
  },
  {
    id: 2,
    emoji: '🏃',
    title: 'Do sport',
    description: 'Do sport every day',
  },
  {
    id: 3,
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

function GoalCheckbox({ day, goal }) {
  const [goalsStatusData, setGoalsStatusData] = useLocalStorage({
    key: 'goalsStatusData',
    serialize: (value) => JSON.stringify(value),
    deserialize: (localStorageValue) => JSON.parse(localStorageValue),
    defaultValue: {},
  });
  const dayKey = day.format('YYYY-MM-DD');

  function handleChange(e) {
    let newGoalsStatusData = { ...goalsStatusData };
    if (!newGoalsStatusData[dayKey]) {
      newGoalsStatusData[dayKey] = {};
    }
    newGoalsStatusData[dayKey][goal.id] = e.target.checked;
    setGoalsStatusData(newGoalsStatusData);
  }

  const checked = goalsStatusData[dayKey]?.[goal.id] || false;
  return (
    <Checkbox
      checked={checked}
      label={`${goal.emoji} ${goal.title}`}
      color="green"
      onChange={handleChange}
    />
  );
}

function WeekRow({ week }) {
  const currentMonth = dayjs().month();
  return (
    <Flex direction="row">
      {week.map((day, idx) => (
        <div className="day-cell flex-grow" key={`day-cell-${idx}`}>
          <div>
            <Text
              className={currentMonth === day.month() ? '' : 'text-gray'}
              ta="center"
            >
              {day.format('D')}
            </Text>
            {GOALS.map((goal, idx) => (
              <GoalCheckbox day={day} goal={goal} key={`goal-${idx}`} />
            ))}
          </div>
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
