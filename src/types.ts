export type DayKey = `${number}-${number}-${number}`;

export type MetricId = number;

export type Metric = {
  id: MetricId;
  emoji: string;
  title: string;
  description: string;
};

export type MetricsStatusForDay = {
  [key: MetricId]: boolean;
};

export type MetricsStatusData = {
  [key: DayKey]: MetricsStatusForDay;
};
