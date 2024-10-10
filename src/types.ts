export type DateStr = `${number}-${number}-${number}`;
export type DayKey = `${number}-${number}-${number}`;

export type MetricId = number;

export type Metric = {
  id: MetricId;
  emoji: string;
  title: string;
  reasons?: string;
  description: string;
  startDay: DateStr;
  endDay?: DateStr;
};

export type MetricStatus = false | true | 'settle';

export type MetricsStatusForDay = {
  [key: MetricId]: MetricStatus;
};

export type MetricsStatusData = {
  [key: DayKey]: MetricsStatusForDay;
};
