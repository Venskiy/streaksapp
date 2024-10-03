import { Text } from '@mantine/core';
import { METRICS } from '../constants';

export function MetricsList() {
  return (
    <div>
      {METRICS.map((m, idx) => (
        <Text key={`goal-${idx}`} mt="xs">
          {m.emoji} {m.title} ({m.description})
        </Text>
      ))}
    </div>
  );
}
