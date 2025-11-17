import { Metric } from "@/types/metric";

export const mood: Metric = {
  id: crypto.randomUUID(),
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

export const sleep: Metric = {
  id: crypto.randomUUID(),
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

export const exercise: Metric = {
  id: crypto.randomUUID(),
  name: "Exercise Minutes",
  description: "Minutes of exercise",
  metric_type: "continuous",
  labels: {},
  creation_timestamp: new Date().toISOString(),
  update_timestamp: new Date().toISOString(),
  owner_id: "user-123",
  min_value: 0,
  max_value: 180,
};

export const waterIntake: Metric = {
  id: crypto.randomUUID(),
  name: "Water Intake",
  description: "Glasses of water",
  metric_type: "continuous",
  labels: {},
  creation_timestamp: new Date().toISOString(),
  update_timestamp: new Date().toISOString(),
  owner_id: "user-123",
  min_value: 0,
  max_value: 12,
};
