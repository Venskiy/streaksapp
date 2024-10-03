import clsx from 'clsx';
import { Flex, Text, Title, Checkbox, Container } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import dayjs from 'dayjs';

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

const startDay = '2024-09-30';

enum DayStates {
  NOT_EXIST = 'notExist', // days before startDay
  LOCKED = 'locked', // days after today
  TODAY = 'today',
  FAILED = 'failed', // nothings checked
  BELLOW_50 = 'bellow50', // less than 50% checked
  ABOVE_50 = 'above50', // more than 50% checked
  SUCCESS = 'success', // all checked
}

function getDayState(day: dayjs.Dayjs): DayStates {
  const today = dayjs();
  if (day.isBefore(dayjs(startDay), 'day')) {
    return DayStates.NOT_EXIST;
  } else if (day.isAfter(today, 'day')) {
    return DayStates.LOCKED;
  } else if (day.isSame(today, 'day')) {
    // TODO: when everything is checked then success
    return DayStates.TODAY;
  } else {
    const dayKey = day.format('YYYY-MM-DD');
    const goalsStatusData = JSON.parse(
      localStorage.getItem('goalsStatusData') || '{}'
    );
    if (!goalsStatusData[dayKey]) {
      return DayStates.FAILED;
    }
    const goalsStatus = Object.values(goalsStatusData[dayKey]);
    const goalsCount = GOALS.length; // TODO: different day could have different goals
    const checkedGoalsCount = goalsStatus.filter(Boolean).length;
    if (checkedGoalsCount === 0) {
      return DayStates.FAILED;
    } else if (checkedGoalsCount === goalsCount) {
      return DayStates.SUCCESS;
    } else if (checkedGoalsCount < goalsCount / 2) {
      return DayStates.BELLOW_50;
    } else {
      return DayStates.ABOVE_50;
    }
  }
}

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

function GoalCheckbox({ day, goal, disabled }) {
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
      disabled={disabled}
      mt={4}
    />
  );
}

// TODO one function which will return day cell state from enum
function WeekRow({ week }) {
  const currentMonth = dayjs().month();
  return (
    <Flex direction="row">
      {week.map((day, idx) => {
        const dayState = getDayState(day);
        return (
          <div
            className={clsx('day-cell', 'flex-1', {
              'day-failed': dayState === DayStates.FAILED,
              'day-bellow50': dayState === DayStates.BELLOW_50,
              'day-above50': dayState === DayStates.ABOVE_50,
              'day-success': dayState === DayStates.SUCCESS,
            })}
            key={`day-cell-${idx}`}
          >
            <div className={dayState === DayStates.LOCKED ? 'opacity-40' : ''}>
              <Text
                className={currentMonth === day.month() ? '' : 'text-gray'}
                ta="center"
              >
                {day.format('D')}
              </Text>
              {dayState === DayStates.NOT_EXIST
                ? null
                : GOALS.map((goal, idx) => (
                    <GoalCheckbox
                      day={day}
                      goal={goal}
                      key={`goal-${idx}`}
                      disabled={dayState === DayStates.LOCKED}
                    />
                  ))}
            </div>
          </div>
        );
      })}
    </Flex>
  );
}

function getMonthView() {
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
