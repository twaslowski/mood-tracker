import { Metric } from "@/types/metric";

export const Mood: Metric = {
  id: "some-id",
  name: "Mood",
  description: "Daily mood rating",
  metric_type: "discrete",
  labels: {
    Depressed: -1,
    Neutral: 0,
    Happy: 1,
  },
  creation_timestamp: new Date().toISOString(),
  update_timestamp: new Date().toISOString(),
  owner_id: "SYSTEM",
  min_value: -1,
  max_value: 1,
};

export const Sleep: Metric = {
  id: "another-id",
  name: "Sleep Duration",
  description: "Hours of sleep",
  metric_type: "continuous",
  labels: {},
  creation_timestamp: new Date().toISOString(),
  update_timestamp: new Date().toISOString(),
  owner_id: "SYSTEM",
  min_value: 0,
  max_value: 24,
};
