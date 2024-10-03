import { Title } from '@mantine/core';

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function DaysOfWeekHeader() {
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
